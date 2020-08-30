<template>
  <div class="link-input">
    <el-form
      ref="link_form"
      :model="link_form"
      :rules="link_rules"
      label-width="120px"
      style="width: 100%"
    >
      <el-form-item label="Title" prop="link_title">
        <el-input
          placeholder="Input title..."
          v-model="link_form.link_title"
          clearable
          :maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="Link" prop="link_input">
        <el-input
          placeholder="Input a valid URL..."
          v-model="link_form.link_input"
          type="url"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div style="text-align: left">
          <el-button type="info" plain @click="submit">Submit</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div>
      <div class="display-holder">
        <div class="display-title">Title:</div>
        <div class="display-content">{{ link_form.link_title }}</div>
      </div>
      <div class="display-holder">
        <div class="display-title">Link:</div>
        <div class="display-content">
          <el-link
            class="display-link"
            :href="link_form.link_input"
            target="_blank"
          >{{ link_form.link_input }}</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "./../../firebase";
export default {
  data() {
    return {
      link_form: {
        link_input: "",
        link_title: "",
      },
      link_rules: {
        link_title: [
          { required: true, message: "Title cannot be empty", trigger: "blur" },
        ],
        link_input: [
          { required: true, message: "Link cannot be empty", trigger: "blur" },
          { type: "url", message: "Invalid link", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submit() {
      var user = auth.currentUser;
      if (user) {
        this.$refs.link_form.validate((valid) => {
          if (valid) {
            var title = this.link_form.link_title;
            var link = this.link_form.link_input;
            var date = new Date();
            db.collection("users")
              .doc(user.uid)
              .collection("m")
              .add({
                type: "link",
                q: "",
                a: "",
                title: title,
                link: link,
                created_on: date.toISOString(),
                revised: 8,
              })
              .then(() => {
                this.$message.success(
                  "Your memory has been successfully recorded!"
                );
                this.$refs.link_form.resetFields();
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
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 50vw;
}
.display-holder {
  display: flex;
  margin-bottom: 20px;
}
.display-title {
  width: 100px;
  font-weight: 700;
  margin-right: 10px;
}
.display-content {
  white-space: pre-wrap;
  width: 50vw;
  word-break: break-word;
}
</style>