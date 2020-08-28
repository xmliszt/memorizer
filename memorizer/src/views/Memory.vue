<template>
  <div class="memory" v-loading="loading">
    <div class="empty-warning" v-show="empty">
      You have no recorded memory.
      <el-link type="warning" @click="goHome">Go and add some first!</el-link>
    </div>
    <div class="memory-table" v-show="!empty">
      <el-table :data="memoryData" style="width: 100%" height="60vh" max-height="65vh">
        <el-table-column label="S/N" width="80" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="right" :content="scope.row.id">
              <span>{{scope.row.index}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="created_on" label="Created on" width="250" sortable></el-table-column>
        <el-table-column prop="type" label="Type" width="100" sortable></el-table-column>
        <el-table-column label="Question / Title" max-width="200" min-width="120">
          <template slot-scope="scope">
            <span class="long-answer" v-if="scope.row.type === 'q_a'">{{scope.row.q}}</span>
            <span class="long-answer" v-if="scope.row.type === 'link'">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Answer / Link" max-width="300" min-width="120">
          <template slot-scope="scope">
            <span class="long-answer" v-if="scope.row.type === 'q_a'">{{scope.row.a}}</span>
            <el-link
              v-if="scope.row.type === 'link'"
              :href="scope.row.link"
              type="info"
              target="_blank"
            >{{scope.row.link}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="Next Revision" width="250" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.need_revise"><strong>{{ scope.row.next_date }}</strong></span>
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
                plain
                @click="revise(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :content="scope.row.revised > 0 ? 'Wait for next round of revision' : 'All done!'" placement="left">
              <el-button
                v-if="!scope.row.need_revise"
                icon="el-icon-success"
                type="success"
                plain
                @click="revise(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Delete">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="Delete entry" placement="left">
              <el-button
                icon="el-icon-remove"
                type="danger"
                @click="remove(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { auth } from "./../../firebase";
import { getMemory, deleteMemory, getNextDocID } from "@/controllers/dbController";
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
      router.push({name: "Home"});
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
        router.push({name: "Home"});
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
    }
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
  margin-top: 30px;
  text-align: center;
  font-size: 15px;
  color: grey;
}
.memory-table {
  padding: 20px
}
.long-answer {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.long-answer:hover {
  word-break: normal;
  text-overflow: unset;
  white-space: normal;
}
</style>