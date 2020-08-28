<template>
  <div @keypress="onEnter">
    <el-form
      ref="qa_form"
      :model="qa_form"
      :rules="qa_rules"
      label-width="100px"
      style="width: 100%"
    >
      <el-form-item label="Question" prop="q">
        <el-input
          class="input-element"
          placeholder="Input your question..."
          v-model="qa_form.q"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Answer" prop="a">
        <el-input
          class="input-element"
          type="textarea"
          :rows="5"
          placeholder="Input your answer..."
          v-model="qa_form.a"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div>
      <p>
        <span class="display-title">Question:</span>
        {{ qa_form.q }}
      </p>
      <p>
        <span class="display-title">Answer:</span>
        {{ qa_form.a }}
      </p>
    </div>
  </div>
</template>

<script>
import { app, db } from "./../../firebase";
import router from "@/router";
export default {
  data() {
    return {
      qa_form: {
        q: "",
        a: "",
      },

      qa_rules: {
        q: [
          {
            required: true,
            message: "Question cannot be empty",
            trigger: "blur",
          },
        ],
        a: [
          {
            required: true,
            message: "Answer cannot be empty",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    onEnter(e) {
      var user = app.auth().currentUser;
      if (e.charCode === 13) {
        if (user) {
          this.$refs.qa_form.validate((valid) => {
            if (valid) {
              var q = this.qa_form.q;
              var a = this.qa_form.a;
              db.collection("users")
                .doc(user.uid)
                .collection("m")
                .add({
                  type: "q_a",
                  q: q,
                  a: a,
                  title: "",
                  link: "",
                  created_on: new Date().toISOString(),
                  revised: 8
                })
                .then(() => {
                  this.$message.success(
                    "Your memory has been successfully recorded!"
                  );
                  this.$refs.qa_form.resetFields();
                })
                .catch((err) => {
                  var errorCode = err.code;
                  var errorMessage = err.message;
                  this.$message.error(errorCode + ": " + errorMessage);
                });
            }
          });
        } else {
          this.$message.warning("You are not logged in!");
        }
      }
    },
  },
};
</script>

<style scoped>
.el-input,
.el-textarea {
  width: 70vw;
}
</style>