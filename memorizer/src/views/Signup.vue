<template>
  <div class="signup-page" @keypress="onEnter">
    <el-form ref="signup_form" :model="signup_form" status-icon :rules="rules" label-width="130px">
      <el-form-item label="Email" prop="email">
        <el-input prefix-icon="el-icon-message" v-model="signup_form.email" placeholder="Input email address.." clearable></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="pwd">
        <el-input
          type="password"
          autocomplete="off"
          v-model="signup_form.pwd"
          placeholder="Input your password..."
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Repeat Password" prop="rpwd">
        <el-input
          type="password"
          autocomplete="off"
          v-model="signup_form.rpwd"
          placeholder="Repeat your password..."
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <div class="google-signin-notice">
        <el-link type="primary" href="/login">Login using your Google account</el-link>
      </div>
      <div class="btn-holder">
        <el-button type="info" @click="submit">Signup</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { checkpwd } from "@/controllers/loginController";
export default {
  data() {
    var checkpwd2 = (rule, rpwd, callback) => {
      if (rpwd != this.signup_form.pwd) {
        callback("Passwords do not match!");
      } else {
        callback();
      }
    };
    return {
      signup_form: {
        email: "",
        pwd: "",
        rpwd: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Please input your email address!",
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
            message: "Please input password!",
            trigger: "blur",
          },
          {
            validator: checkpwd,
            trigger: ["blur", "change"],
          },
        ],
        rpwd: [
          {
            required: true,
            message: "Please repeat your password!",
            trigger: "blur",
          },
          {
            validator: checkpwd2,
            trigger: ["blur", "change"],
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
      this.$refs.signup_form.validate((valid) => {
        if (valid) {
          this.$message.info("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.signup-page {
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

.google-signin-notice {
  text-align: center;
  margin-bottom: 20px;
}
</style>