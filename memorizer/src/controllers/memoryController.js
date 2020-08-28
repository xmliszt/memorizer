import moment from 'moment';

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