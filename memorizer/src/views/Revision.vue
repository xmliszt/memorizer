<template>
  <div class="revision" v-loading="loading">
    <div class="card-holder">
      <el-card v-if="data.type === 'q_a'">
        <div class="question-section" @click="answerVisible = !answerVisible">
          <el-tooltip
            :content="answerVisible ? 'Click to hide the answer' : 'Click to show the answer'"
          >
            <span>{{ data.q }}</span>
          </el-tooltip>
          <el-tooltip content="Number of revisions left">
            <span style="color: #E6A23C">{{ data.revised }}</span>
          </el-tooltip>
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
          <el-tooltip content="Number of revisions left">
            <span style="color: #E6A23C">{{ data.revised }}</span>
          </el-tooltip>
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
import { auth } from "./../../firebase";
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
    };
  },
  computed: {
    embeddedLink() {
      if (this.data.link) {
        try {
          var url = new URL(this.data.link);
          if (url.host === "www.youtube.com") {
            var vid = new URLSearchParams(url.search).get("v");
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
      if (next_doc_id == "end") {
        router.push("/done");
      } else {
        var result = await getNextDocID(next_doc_id);
        if (result.success) {
          var next_next_id = result.data;
          router.push(`/revision/${next_doc_id}?next=${next_next_id}`);
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
      var user = auth.currentUser;
      if (!user) {
        this.loading = false;
        this.$notify.warning("You are not logged in!");
        router.push("/");
      } else {
        var doc_id = this.$route.params.id;
        var result = await getSingleMemory(doc_id, user.uid);
        this.loading = false;
        if (result.success) {
          this.data = result.data;
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
  width: 100%;
  height: 65vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card-holder {
  z-index: 999;
}

.question-section {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 50vw;
  text-align: center;
  font-size: 20px;
}

.title-section {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  text-align: center;
  font-size: 20px;
}

.answer-section {
  width: 50vw;
  text-align: center;
  font-size: 15px;
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
</style>