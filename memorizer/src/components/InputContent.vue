<template>
  <div class="input-content">
    <div class="input-content-holder">
      <el-select v-model="option">
        <el-option
          class="input-element"
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        class="input-element"
        v-if="option === 'link'"
        placeholder="Input title..."
        v-model="link_title"
        clearable
      ></el-input>
      <el-input
        class="input-element"
        v-if="option === 'link'"
        placeholder="Input a valid URL..."
        v-model="link_input"
        clearable
      ></el-input>
      <el-input
        class="input-element"
        v-if="option === 'q_a'"
        placeholder="Input your question..."
        v-model="q_a_q"
        clearable
      ></el-input>
      <el-input
        class="input-element"
        v-if="option === 'q_a'"
        placeholder="Input your answer..."
        v-model="q_a_a"
        clearable
      ></el-input>
    </div>
    <el-alert v-show="error_msg" :title="error_msg" type="error" :closable="false" show-icon></el-alert>
    <div class="display-content-holder">
      <div v-if="option === 'link'">
        <p>
          <span class="display-title">Title:</span>
          {{ link_title }}
        </p>
        <span class="display-title">Link:</span>
        <el-link class="display-link" :href="link_input" target="_blank">{{ link_input }}</el-link>
      </div>
      <div v-if="option === 'link'">
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
      <div v-if="option === 'q_a'">
        <p>
          <span class="display-title">Question:</span>
          {{ q_a_q }}
        </p>
        <p>
          <span class="display-title">Answer:</span>
          {{ q_a_a }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "q_a",
          label: "Q&A",
        },
        {
          value: "link",
          label: "Link",
        },
      ],
      option: "",
      link_input: "",
      link_title: "",
      q_a_q: "",
      q_a_a: "",
      error_msg: "",
    };
  },
  computed: {
    embeddedLink() {
      if (this.link_input) {
        try {
          var url = new URL(this.link_input);
          this.error_msg = "";
          if (url.host === "www.youtube.com") {
            var vid = new URLSearchParams(url.search).get("v");
            return "https://www.youtube.com/embed/" + vid;
          } else {
            return url;
          }
        } catch (err) {
          console.log(err.message);
          this.error_msg = "Invalid URL";
        }
      } else {
        this.error_msg = "";
        return this.link_input;
      }
    },
  },
};
</script>

<style scoped>
.input-content {
  font-size: 20px;
}
.input-content-holder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  display: flex;
  padding: 10px;
  margin-top: 30px;
}
.display-content-holder {
  width: 80vw;
  overflow-wrap: break-word;
  font-size: 20px;
  padding: 15px;
}
.display-link {
  font-size: 20px;
}
.display-title {
  font-weight: 700;
  margin-right: 10px;
}
.input-element {
  margin-left: 15px;
  margin-right: 15px;
}
.el-alert {
  margin-top: 5px;
}
</style>