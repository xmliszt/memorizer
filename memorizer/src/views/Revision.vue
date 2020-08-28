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
    </div>
  </div>
</template>

<script>
import { auth } from "./../../firebase";
import { fadeMemory, gainMemory, getSingleMemory } from "@/controllers/revisionController";
export default {
  data() {
    return {
      data: null,
      answerVisible: false,
      loading: false,
    };
  },
  methods: {
    async reviseAgain() {
      var result = await fadeMemory(this.$route.params.id, this.data.revised);
      if (result.success) {
        this.$message.warning("Memory has slightly faded~");
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
  },
  mounted() {
    this.loading = true;
    setTimeout(async () => {
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
    }, 1000);
  },
};
</script>

<style scoped>
.revision {
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.question-section {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 50vw;
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