<template>
  <div class="login-page" @keypress="onEnter">
    <el-form ref="login_form" :model="login_form" status-icon :rules="rules" label-width="130px">
      <el-form-item label="Email" prop="email">
        <el-input prefix-icon="el-icon-message" v-model="login_form.email" placeholder="Input email address.." clearable></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="pwd">
        <el-input
          type="password"
          autocomplete="off"
          v-model="login_form.pwd"
          placeholder="Input your password..."
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="Repeat Password" prop="rpwd">
        <el-input
          type="password"
          autocomplete="off"
          v-model="login_form.rpwd"
          placeholder="Repeat your password..."
          show-password
        ></el-input>
      </el-form-item>
      <div class="btn-holder">
        <el-button type="info" @click="submit">Login</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { checkpwd } from "@/controllers/loginController";
export default {
  data() {
    var checkpwd2 = (rule, rpwd, callback) => {
      if (rpwd != this.login_form.pwd) {
        callback("Passwords do not match!");
      } else {
        callback();
      }
    };
    return {
      login_form: {
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
            message: "Please input valid email address!",
            trigger: "blur",
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
      this.$refs.login_form.validate((valid) => {
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
</style>