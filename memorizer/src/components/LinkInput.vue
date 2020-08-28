<template>
  <div @keypress="onEnter">
    <el-form
      ref="link_form"
      :inline="true"
      :model="link_form"
      :rules="link_rules"
      style="width: 100%"
    >
      <el-form-item label="Title" prop="link_title">
        <el-input placeholder="Input title..." v-model="link_form.link_title" clearable></el-input>
      </el-form-item>
      <el-form-item label="Link" prop="link_input">
        <el-input
          placeholder="Input a valid URL..."
          v-model="link_form.link_input"
          type="url"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div>
      <p>
        <span class="display-title">Title:</span>
        {{ link_form.link_title }}
      </p>
      <span class="display-title">Link:</span>
      <el-link
        class="display-link"
        :href="link_form.link_input"
        target="_blank"
      >{{ link_form.link_input }}</el-link>
    </div>
    <div>
      <iframe
        style="margin-top: 10px"
        title="Link Source"
        width="400"
        height="200"
        :src="embeddedLink"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
import { app, db } from './../../firebase';
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
  computed: {
    embeddedLink() {
      if (this.link_form.link_input) {
        try {
          var url = new URL(this.link_form.link_input);
          if (url.host === "www.youtube.com") {
            var vid = new URLSearchParams(url.search).get("v");
            return "https://www.youtube.com/embed/" + vid;
          } else {
            return url;
          }
        } catch (err) {}
      } else {
        return this.link_form.link_input;
      }
    },
  },
  methods: {
    onEnter(e) {
      var user = app.auth().currentUser;
      if (e.charCode === 13) {
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
                  revised: 8
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
      }
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 300px;
}
</style>