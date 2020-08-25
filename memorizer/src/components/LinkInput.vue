<template>
  <div>
    <el-form
      ref="link_form"
      :inline="true"
      :model="linkForm"
      :rules="link_rules"
      style="width: 100%"
    >
      <el-form-item label="Title" prop="link_title">
        <el-input placeholder="Input title..." v-model="linkForm.link_title" clearable></el-input>
      </el-form-item>
      <el-form-item label="Link" prop="link_input">
        <el-input
          placeholder="Input a valid URL..."
          v-model="linkForm.link_input"
          type="url"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div>
      <p>
        <span class="display-title">Title:</span>
        {{ linkForm.link_title }}
      </p>
      <span class="display-title">Link:</span>
      <el-link
        class="display-link"
        :href="linkForm.link_input"
        target="_blank"
      >{{ linkForm.link_input }}</el-link>
    </div>
    <div>
      <iframe
        style="margin-top: 10px"
        title="Link Source"
        width="560"
        height="315"
        :src="embeddedLink"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkForm: {
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
      if (this.linkForm.link_input) {
        try {
          var url = new URL(this.linkForm.link_input);
          if (url.host === "www.youtube.com") {
            var vid = new URLSearchParams(url.search).get("v");
            return "https://www.youtube.com/embed/" + vid;
          } else {
            return url;
          }
        } catch (err) {}
      } else {
        return this.linkForm.link_input;
      }
    },
    methods: {
    onEnter(e) {
      if (e.charCode === 13) {
      }
    },
  },
  }
};
</script>

<style scoped>
.el-input {
  width: 300px;
}
</style>