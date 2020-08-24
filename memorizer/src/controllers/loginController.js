export function checkpwd(rul, pwd, callback) {
  if (pwd.length < 6) {
    callback(new Error("Password needs to be at least 6 characters"));
  } else {
    callback();
  }
}