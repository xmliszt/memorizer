<template>
  <div class="memory" v-loading="loading">
    <div class="empty-warning" v-show="empty">
      You have no recorded memory.
      <el-link type="warning" href="/">Go and add some first!</el-link>
    </div>
    <div class="memory-table">
      <el-table :data="memoryData" style="width: 100%">
        <el-table-column label="S/N" width="80" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="right" :content="scope.row.id">
              <span>{{scope.row.index}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="created_on" label="Created on" width="250" sortable></el-table-column>
        <el-table-column prop="type" label="Type" width="100" sortable></el-table-column>
        <el-table-column label="Question / Title">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 'q_a'">{{scope.row.q}}</span>
            <span v-if="scope.row.type === 'link'">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Answer / Link" width="200">
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
        <el-table-column prop="next_date" label="Next Revision" width="250" sortable></el-table-column>
        <el-table-column prop="revised" label="R" width="80" sortable></el-table-column>
        <el-table-column label="Action" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="Time to revise" placement="left">
              <el-button
                v-if="scope.row.need_revise"
                icon="el-icon-warning"
                type="danger"
                plain
                @click="revise(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { auth } from "./../../firebase";
import { getMemory } from "@/controllers/memoryController";
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
    revise(doc_id) {
      router.push(`/revision/${doc_id}`);
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
        var result = await getMemory(user.uid);
        this.loading = false;
        if (result.success) {
          this.memoryData = result.data;
          this.empty = false;
        } else {
          if (result.code == "emtpy") {
            this.empty = true;
          } else {
            this.$message.error(`${result.code}: ${result.data}`);
          }
        }
      }
    }, 1000);
  },
};
</script>

<style scoped>
.memory {
  padding: 20px;
}
.empty-warning {
  margin-top: 30px;
  text-align: center;
  font-size: 15px;
  color: grey;
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