import {
  db
} from "./../../firebase";
import {
  getRevisionDateFromCount,
  formatDate
} from "@/controllers/dateController";
import moment from 'moment';
import {
  firebase
} from "@firebase/app";

export async function getSingleMemory(doc_id, uid) {
  try {
    var doc = await db.collection("users")
      .doc(uid)
      .collection("m")
      .doc(doc_id)
      .get();
    var data = doc.data();
    return {
      success: true,
      code: "",
      data: data
    };
  } catch (err) {
    return {
      success: false,
      code: err.code,
      data: err.message
    };
  }
}

export async function fadeMemory(doc_id, revised) {
  var user = sessionStorage.getItem("user");
  if (!user) {
    return {
      success: false,
      code: "Not logged in",
      message: "You are not logged in!"
    };
  } else {
    if (revised < 8) {
      revised += 1;
    }
    try {
      await db.collection("users")
        .doc(user)
        .collection("m")
        .doc(doc_id)
        .update({
          revised: revised,
          created_on: new Date().toISOString()
        });
      return {
        success: true,
        code: "",
        message: ""
      }
    } catch (err) {
      return {
        success: false,
        code: err.code,
        message: err.message
      }
    }
  }
}

export async function gainMemory(doc_id, revised) {
  var user = sessionStorage.getItem("user");
  if (!user) {
    return {
      success: false,
      code: "Not logged in",
      message: "You are not logged in!"
    };
  } else {
    if (revised > 0) {
      revised -= 1;
    }
    try {
      await db.collection("users")
        .doc(user)
        .collection("m")
        .doc(doc_id)
        .update({
          revised: revised,
          created_on: new Date().toISOString()
        });
      return {
        success: true,
        code: "",
        message: ""
      }
    } catch (err) {
      return {
        success: false,
        code: err.code,
        message: err.message
      }
    }
  }
}

export async function pushCategory(uid, category) {
  const userRef = db.collection("users").doc(uid);
  try {
    await userRef.update({
      category: firebase.firestore.FieldValue.arrayUnion(category)
    })
    return {
      success: true,
      code: "",
      data: ""
    };
  } catch (err) {
    var errorCode = err.code;
    var errorMessage = err.message;
    return {
      success: false,
      code: errorCode,
      data: errorMessage
    };
  }

}

export async function getCategory(uid) {
  const userRef = db.collection("users").doc(uid);
  var snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      var data = snapshot.data();
      return {
        success: true,
        code: "",
        data: data.category
      };
    } catch (err) {
      var errorCode = err.code;
      var errorMessage = err.message;
      return {
        success: false,
        code: errorCode,
        data: errorMessage
      };
    }
  }
}

export async function getMemory(uid) {
  const userRef = db.collection("users").doc(uid);
  var snapshot = await userRef.get();
  if (snapshot.exists) {
    try {
      snapshot = await userRef.collection("m").get();
      if (snapshot.docs.length == 0) {
        return {
          success: false,
          code: "empty",
          data: null
        };
      } else {
        var memoryData = snapshot.docs.map((doc, idx) => {
          var doc_id = doc.id;
          var created_on = doc.data().created_on;
          var revised = doc.data().revised;
          var next_date = getRevisionDateFromCount(
            created_on,
            revised
          );
          var need_revise = false;
          if (revised > 0 && moment(next_date.toISOString()).isBefore(moment(new Date()))) {
            need_revise = true;
          }
          var category = doc.data().category;
          if (category == undefined || category.length == 0) {
            category = "uncategorized";
          }
          return {
            id: doc_id,
            index: idx,
            created_on: formatDate(created_on),
            type: doc.data().type,
            revised: doc.data().revised,
            q: doc.data().q,
            a: doc.data().a,
            link: doc.data().link,
            title: doc.data().title,
            next_date: formatDate(next_date),
            need_revise: need_revise,
            category: category
          };
        });
        return {
          success: true,
          code: "",
          data: memoryData
        };
      }
    } catch (err) {
      var errorCode = err.code;
      var errorMessage = err.message;
      return {
        success: false,
        code: errorCode,
        data: errorMessage
      };
    }
  } else {
    try {
      userRef.set({
        email: user.email,
        verified: user.emailVerified,
        username: user.displayName,
        category: ["uncategorized"]
      });
      return {
        success: false,
        code: "empty",
        data: null
      };
    } catch (err) {
      errorCode = err.code;
      errorMessage = err.message;
      return {
        success: false,
        code: errorCode,
        data: errorMessage
      };
    }
  }
}

export async function deleteMemory(doc_id, uid) {
  try {
    await db.collection('users').doc(uid).collection('m').doc(doc_id).delete();
    return {
      success: true,
      code: "",
      data: null
    };
  } catch (err) {
    return {
      success: false,
      code: err.code,
      data: err.message
    };
  }
}

export async function getNextDocID(doc_id, category) {
  const formatter = "dddd, MMM Do YYYY, HH:mm:ss";
  var result = await getMemory(sessionStorage.getItem("user"));
  if (result.success) {
    var memory = result.data;
    var sortedMemory = sortDataByRevisionDate(memory);
    var sortedUnrevisedMemory = sortedMemory.filter(obj => {
      var obj_nextDate = moment(obj.next_date, formatter);
      var revised = obj.revised;
      var today = moment(new Date().toISOString());
      return (obj_nextDate.isBefore(today) && revised > 0 && (obj.category === category || category === "All"));
    });
    var doc_idx = sortedUnrevisedMemory.findIndex(obj => obj.id == doc_id);
    if (doc_idx >= 0) {
      var next_idx = doc_idx + 1;
      var next_doc_id = "";
      if (next_idx == sortedUnrevisedMemory.length) {
        if (sortedUnrevisedMemory[0].revised > 0 && sortedUnrevisedMemory[0].id !== doc_id) {
          next_doc_id = sortedUnrevisedMemory[0].id
        } else {
          next_doc_id = "end";
        }
      } else {
        next_doc_id = sortedUnrevisedMemory[doc_idx + 1].id;
      }
      return {
        success: true,
        code: "",
        data: next_doc_id
      };
    } else {
      return {
        success: true,
        code: "",
        data: "end"
      };
    }
  } else {
    return result;
  }
}

export function sortDataByRevisionDate(data) {
  const formatter = "dddd, MMM Do YYYY, HH:mm:ss";
  data.sort((a, b) => {
    if (a.category === b.category) {
      var a_date = moment(a.next_date, formatter);
      var b_date = moment(b.next_date, formatter);
      return a_date.isAfter(b_date);
    } return a.category.localeCompare(b.category);
  });
  return data;
}

export async function addLink(uid, title, link, category) {
  try {
    db.collection("users")
      .doc(uid)
      .collection("m")
      .add({
        category: category,
        type: "link",
        q: "",
        a: "",
        title: title,
        link: link,
        created_on: new Date().toISOString(),
        revised: 8,
      });
    return {
      success: true,
      code: "",
      data: ""
    };
  } catch (err) {
    return {
      success: false,
      code: err.code,
      message: err.message
    };
  }
}

export async function addQA(uid, q, a, category) {
  try {
    db.collection("users")
      .doc(uid)
      .collection("m")
      .add({
        category: category,
        type: "q_a",
        q: q,
        a: a,
        title: "",
        link: "",
        created_on: new Date().toISOString(),
        revised: 8,
      })
    return {
      success: true,
      code: "",
      message: ""
    };
  } catch (err) {
    return {
      success: false,
      code: err.code,
      message: err.message
    };
  }
}