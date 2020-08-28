import moment from 'moment';
import { db } from './../../firebase';

export function formatDate(d) {
  return moment(d).format(
    "dddd, MMM Do YYYY, HH:mm:ss"
  )
}

export function getNextRevisionDay(created_on, mode, value) {
  return moment(created_on).add(value, mode).toDate();
}

export function getRevisionDateFromCount(created_on, count) {
  switch (count) {
    case 8:
      return getNextRevisionDay(created_on, 'm', 30);
    case 7:
      return getNextRevisionDay(created_on, 'h', 12);
    case 6:
      return getNextRevisionDay(created_on, 'd', 1);
    case 5:
      return getNextRevisionDay(created_on, 'd', 2);
    case 4:
      return getNextRevisionDay(created_on, 'd', 4);
    case 3:
      return getNextRevisionDay(created_on, 'd', 7);
    case 2:
      return getNextRevisionDay(created_on, 'd', 15);
    case 1:
      return getNextRevisionDay(created_on, 'M', 1);
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
          if (
            moment(next_date.toISOString()).isBefore(
              moment(new Date())
            )
          ) {
            need_revise = true;
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