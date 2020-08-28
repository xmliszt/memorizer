import { auth, db } from "./../../firebase";

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
  var user = auth.currentUser;
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
        .doc(user.uid)
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
  var user = auth.currentUser;
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
        .doc(user.uid)
        .collection("m")
        .doc(doc_id)
        .update({
          revised: revised
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