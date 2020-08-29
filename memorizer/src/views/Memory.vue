<template>
  <div class="memory" v-loading="loading">
    <div class="empty-warning" v-show="empty">
      You have no recorded memory.
      <el-link type="warning" @click="goHome">Go and add some first!</el-link>
    </div>
    <div class="memory-table" v-show="!empty">
      <el-table :data="memoryData" style="width: 100%; font-size: 12px;" height="65vh" max-height="65vh" size="mini">
        <el-table-column label="S/N" width="80" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="right" :content="scope.row.id">
              <span>{{scope.row.index}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="created_on" label="Created on" width="220" sortable></el-table-column>
        <el-table-column prop="type" label="Type" width="100" sortable></el-table-column>
        <el-table-column label="Question / Title" max-width="500px" min-width="150">
          <template slot-scope="scope">
            <textarea
              disabled
              class="long-answer"
              v-if="scope.row.type === 'q_a'"
              :value="scope.row.q"
            />
            <textarea
              class="long-answer"
              disabled
              v-if="scope.row.type === 'link'"
              :value="scope.row.title"
            />
          </template>
        </el-table-column>
        <el-table-column label="Answer / Link" max-width="500px" min-width="150">
          <template slot-scope="scope">
            <textarea
              class="brief-answer"
              disabled
              v-if="scope.row.type === 'q_a'"
              :value="scope.row.a"
            />
            <div v-if="scope.row.type === 'link'">
              <a
                :href="scope.row.link"
                type="info"
                target="_blank"
              >Click to open link</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Next Revision" width="220" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.need_revise">
              <strong>{{ scope.row.next_date }}</strong>
            </span>
            <span v-else>{{ scope.row.next_date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="revised" label="R" width="80" sortable></el-table-column>
        <el-table-column label="Revise" min-width="100">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="Time to revise" placement="left">
              <el-button
                v-if="scope.row.need_revise"
                icon="el-icon-warning"
                type="warning"
                size="mini"
                plain
                @click="revise(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="scope.row.revised > 0 ? 'Wait for next round of revision' : 'All done!'"
              placement="left"
            >
              <el-button
                v-if="!scope.row.need_revise"
                icon="el-icon-success"
                type="success"
                plain
                size="mini"
                @click="revise(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Delete">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="Delete entry" placement="left">
              <el-button icon="el-icon-remove" type="danger" @click="remove(scope.row.id)" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { auth } from "./../../firebase";
import {
  getMemory,
  deleteMemory,
  getNextDocID,
} from "@/controllers/dbController";
import router from "@/router";
export default {
  data() {
    return {
      empty: false,
      memoryData: [],
      loading: false,
    };
  },
  methods: {
    goHome() {
      router.push({ name: "Home" });
    },
    async revise(doc_id) {
      var result = await getNextDocID(doc_id);
      var next_doc_id = "";
      if (result.success) {
        next_doc_id = result.data;
        router.push(`/revision/${doc_id}?next=${next_doc_id}`);
      } else {
        this.$message.error(`${result.code}: ${result.data}`);
      }
    },
    async remove(doc_id) {
      var uid = auth.currentUser.uid;
      var result = await deleteMemory(doc_id, uid);
      if (result.success) {
        this.$message.success("Memory has been deleted successfully!");
        this.refreshMemory();
      } else {
        this.$message.error(`${result.code}: ${result.data}`);
      }
    },
    async refreshMemory() {
      this.loading = true;
      var user = auth.currentUser;
      if (!user) {
        this.loading = false;
        this.$notify.warning("You are not logged in!");
        router.push({ name: "Home" });
      } else {
        var result = await getMemory(user.uid);
        this.loading = false;
        if (result.success) {
          this.memoryData = result.data;
          this.empty = false;
        } else {
          if (result.code == "empty") {
            this.empty = true;
            this.memoryData = [];
          } else {
            this.$message.error(`${result.code}: ${result.data}`);
          }
        }
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.refreshMemory();
    }, 1500);
  },
};
</script>

<style scoped>
.empty-warning {
  margin-top: 5vh;
  text-align: center;
  font-size: 15px;
  color: grey;
}
.memory-table {
  padding: 3vh;
}

.brief-answer {
  outline: none;
  border: 0px;
  resize: none;
  font-size: 12px !important;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 18px;
  background: transparent;
}

.long-answer {
  outline: none;
  border: 0px;
  resize: none;
  font-size: 12px !important;
  word-break: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background: transparent;
  height: 18px;
  transition: height 0.3s;
}

.long-answer:hover {
  word-break: break-all;
  text-overflow: unset;
  white-space: normal;
  overflow: hidden;
  height: 65px;
}
a {
  font-size: 12px !important;
  text-decoration: none !important;
  color: grey !important;
}

@supports (-webkit-touch-callout: none) {
  .long-answer {
    word-break: normal;
    white-space: unset;
    text-overflow: ellipsis;
    overflow: scroll;
  }
}

@media(max-width: 500px) {
  .memory {
    height: 60vh;
  }
}
</style>