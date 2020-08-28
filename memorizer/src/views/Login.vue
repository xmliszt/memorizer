<template>
  <div class="login-page" @keypress="onEnter">
    <el-form ref="login_form" :model="login_form" status-icon :rules="rules" label-width="130px">
      <el-form-item label="Email" prop="email">
        <el-input
          prefix-icon="el-icon-message"
          v-model="login_form.email"
          placeholder="Input email address.. (Google account or other emails)"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="pwd">
        <el-input
          type="password"
          autocomplete="off"
          v-model="login_form.pwd"
          placeholder="Input your password..."
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <div class="dont-have-account">
        <el-link
          href="/signup"
          type="primary"
        >Don't have an account? Create one!</el-link>
      </div>
      <div class="dont-have-account">
        <el-link type="warning" @click="signInWithGoogle">Sign in with Google account!</el-link>
      </div>
      <div class="btn-holder">
        <el-button type="info" @click="submit">Login</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { app, provider } from "./../../firebase";
import firebase from '@firebase/app';
export default {
  data() {
    return {
      login_form: {
        email: "",
        pwd: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Please input your email address...",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Invalid email format!",
            trigger: "change",
          },
        ],
        pwd: [
          {
            required: true,
            message: "Please input your password...",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    onEnter(e) {
      if (e.charCode === 13) {
        this.submit();
      }
    },
    submit() {
      this.$refs.login_form.validate((valid) => {
        if (valid) {
          app.auth().signInWithEmailAndPassword(this.login_form.email, this.login_form.pwd).catch(e => {
            var errorCode = e.code;
            var errorMessage = e.message;
            this.$notify.error(errorCode + ": " + errorMessage);
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    signInWithGoogle() {
      firebase.auth().signInWithPopup(provider).then(result => {
        var token = result.credential.accessToken;
        var user = result.user;
        this.$message.info(`User[${user.email}] signed in with token: ${token}`);
        console.log(user);
      }).catch(err => {
        var errorCode = err.code;
        var errorMessage = err.message;
        var email = err.email;
        this.$notify.error(`Email [${email}] failed to login with error[${errorCode}]: ${errorMessage}`);
      })
    }
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.el-input {
  width: 40vw;
}

.btn-holder {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dont-have-account {
  text-align: center;
  margin-bottom: 20px;
}
</style>