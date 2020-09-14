<template>
  <div class="revision" v-loading="loading">
    <div class="card-holder">
      <el-card v-if="data.type === 'q_a'">
        <div class="title-section" @click="answerVisible = !answerVisible">
          <div>
            <el-tooltip
              :content="answerVisible ? 'Click to hide the answer' : 'Click to show the answer'"
            >
              <div style="margin-right: 10px">{{ data.q }}</div>
            </el-tooltip>
          </div>
          <div class="info-section">
            <el-tag type="info" size="small" hit style="margin-right: 20px">{{ category }}</el-tag>
            <el-tooltip content="Number of revisions left">
              <div style="color: #E6A23C">{{ data.revised }}</div>
            </el-tooltip>
          </div>
        </div>
      </el-card>
      <el-card v-show="answerVisible">
        <div class="answer-section">{{ data.a }}</div>
        <div class="action-section">
          <el-button type="warning" plain @click="reviseAgain">Revise Again</el-button>
          <el-button type="success" plain @click="remember">I Remember!</el-button>
        </div>
      </el-card>
      <el-card v-if="data.type === 'link'">
        <div class="title-section" slot="header">
          <span>{{ data.title }}</span>
          <div class="info-section">
            <el-tag type="info" size="small" hit style="margin-right: 20px">{{ category }}</el-tag>
            <el-tooltip content="Number of revisions left">
              <span style="color: #E6A23C">{{ data.revised }}</span>
            </el-tooltip>
          </div>
        </div>
        <div>
          <div>
            <el-link :href="data.link" target="__blank">{{ data.link }}</el-link>
          </div>
          <iframe
            style="margin-top: 10px"
            title="Link Source"
            width="100%"
            height
            :src="embeddedLink"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <div class="action-section">
            <el-button type="warning" plain @click="reviseAgain">Revise Again</el-button>
            <el-button type="success" plain @click="remember">I Remember!</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  fadeMemory,
  gainMemory,
  getSingleMemory,
  getNextDocID,
} from "@/controllers/dbController";
import router from "@/router";
export default {
  data() {
    return {
      data: {},
      answerVisible: false,
      loading: false,
      category: "",
    };
  },
  computed: {
    embeddedLink() {
      if (this.data.link) {
        try {
          var url = new URL(this.data.link);
          var vid = "";
          if (url.host === "www.youtube.com") {
            vid = new URLSearchParams(url.search).get("v");
            return "https://www.youtube.com/embed/" + vid;
          } else if (url.host === "youtu.be") {
            vid = url.pathname.split("/")[1];
            return "https://www.youtube.com/embed/" + vid;
          } else {
            return url;
          }
        } catch (err) {}
      } else {
        return this.data.link;
      }
    },
  },
  methods: {
    async goToNextMemory() {
      var next_doc_id = this.$route.query.next;
      var categoryFilter = this.$route.query.category;
      if (next_doc_id == "end") {
        router.push("/done");
      } else {
        var result = await getNextDocID(next_doc_id, categoryFilter);
        if (result.success) {
          var next_next_id = result.data;
          router.push(`/revision/${next_doc_id}?next=${next_next_id}`);
          this.getMemory();
          this.answerVisible = false;
        } else {
          this.$message.error(`${result.code}: ${result.data}`);
        }
      }
    },
    async reviseAgain() {
      var result = await fadeMemory(this.$route.params.id, this.data.revised);
      if (result.success) {
        this.$message.warning("Memory has slightly faded~");
        this.goToNextMemory();
      } else {
        if (result.code == "Not logged in") {
          this.$notify.warning(result.message);
          router.push("/");
        } else {
          var errorCode = result.code;
          var errorMessage = result.message;
          this.$message.error(errorCode + ": " + errorMessage);
        }
      }
    },
    async remember() {
      var result = await gainMemory(this.$route.params.id, this.data.revised);
      if (result.success) {
        this.$message.success("Memory has been improved!");
        this.goToNextMemory();
      } else {
        if (result.code == "Not logged in") {
          this.$notify.warning(result.message);
          router.push("/");
        } else {
          var errorCode = result.code;
          var errorMessage = result.message;
          this.$message.error(errorCode + ": " + errorMessage);
        }
      }
    },
    async getMemory() {
      this.loading = true;
      var user = sessionStorage.getItem("user");
      if (!user) {
        this.loading = false;
        this.$notify.warning("You are not logged in!");
        router.push("/");
      } else {
        var doc_id = this.$route.params.id;
        var result = await getSingleMemory(doc_id, user);
        this.loading = false;
        if (result.success) {
          this.data = result.data;
          if (!result.data.category) {
            this.category = "uncategorized";
          } else {
            this.category = result.data.category;
          }
        } else {
          this.$message.error(`${result.code}: ${result.data}`);
        }
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.getMemory();
    }, 1500);
  },
};
</script>

<style scoped>
.revision {
  width: 100vw;
  max-width: 100%;
  height: 70vh;
  padding: 20px;
  overflow-y: scroll;
}

.card-holder {
  padding: 10vw;
}

.question-section {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 60vw;
  text-align: left;
  font-size: 20px;
}

.title-section {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  text-align: center;
  font-size: 20px;
}

.info-section {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.answer-section {
  width: 60vw;
  text-align: justify;
  font-size: 15px;
  white-space: pre-wrap;
  text-overflow: unset;
  word-break: break-word;
}

.action-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.question-section:hover {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

@supports (-webkit-touch-callout: none) {
  .question-section {
    display: flex;
  }
}

@media (max-width: 500px) {
  .question-section {
    font-size: 15px;
  }
}
</style>