<template>
  <div class="memory" v-loading="loading">
    <div class="empty-warning" v-show="empty">
      You have no recorded memory.
      <el-link type="warning" @click="goHome">Go and add some first!</el-link>
    </div>
    <div class="memory-table" v-show="!empty">
      <div class="action-panel">
        <el-input
          placeholder="Search for a memory..."
          v-model="searchText"
          size="mini"
          style="width: 300px; margin-right: 15px"
          clearable
        ></el-input>
        <el-tooltip content="Select category" effect="dark" placement="top">
          <el-select
            v-model="categoryFilter"
            placeholder="Category"
            size="mini"
            style="width: 150px; margin-right: 15px"
          >
            <el-option
              v-for="item in categories"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-tooltip>
        <el-tooltip
          content="Select type of memory"
          effect="dark"
          placement="top"
        >
          <el-select
            v-model="typeFilter"
            placeholder="Type"
            size="mini"
            style="margin-right: 15px"
          >
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-tooltip>

        <el-switch
          style="display: block"
          v-model="showOnlyNeedRevision"
          active-color="#13ce66"
          active-text="Fading Memories"
        ></el-switch>
      </div>
      <el-table
        ref="memoryTable"
        :data="displayMemoryData"
        style="width: 100%; font-size: 12px"
        height="55vh"
        max-height="55vh"
        size="mini"
      >
        <el-table-column label="S/N" width="80" sortable>
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="right" :content="scope.row.id">
              <span>{{ scope.row.index }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_on"
          label="Previous Revision"
          width="220"
          sortable
          :sort-method="sortPrevDate"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="Type"
          width="100"
          sortable
        ></el-table-column>
        <el-table-column
          prop="category"
          label="Category"
          width="150"
          sortable
        ></el-table-column>
        <el-table-column
          label="Question / Title"
          max-width="500px"
          min-width="150"
        >
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
        <el-table-column
          label="Answer / Link"
          max-width="500px"
          min-width="150"
        >
          <template slot-scope="scope">
            <textarea
              class="brief-answer"
              disabled
              v-if="scope.row.type === 'q_a'"
              :value="scope.row.a"
            />
            <div v-if="scope.row.type === 'link'">
              <a :href="scope.row.link" type="info" target="_blank"
                >Click to open link</a
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Next Revision"
          width="240"
          sortable
          :sort-method="sortNextDate"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.need_revise">
              <strong>{{ scope.row.next_date }}</strong>
            </span>
            <span v-else>{{ scope.row.next_date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="revised"
          label="R"
          width="80"
          sortable
        ></el-table-column>
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
              :content="
                scope.row.revised > 0
                  ? 'Wait for next round of revision'
                  : 'All done!'
              "
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
              <el-button
                icon="el-icon-remove"
                type="danger"
                @click="remove(scope.row.id)"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  getMemory,
  deleteMemory,
  getNextDocID,
  getCategory,
} from "@/controllers/dbController";
import { searchFilter } from '../controllers/helper';
import router from "@/router";
import moment from "moment";
export default {
  data() {
    return {
      empty: false,
      memoryData: [],
      loading: false,
      showOnlyNeedRevision: false,
      typeFilter: "all",
      categoryFilter: "All",
      categories: [],
      searchText: "",
      types: [
        {
          value: "q_a",
          label: "Q&A",
        },
        {
          value: "link",
          label: "Link",
        },
        {
          value: "all",
          label: "All",
        },
      ],
    };
  },
  methods: {
    goHome() {
      router.push({ name: "Home" });
    },
    async revise(doc_id) {
      var result = await getNextDocID(doc_id, this.categoryFilter);
      var next_doc_id = "";
      if (result.success) {
        next_doc_id = result.data;
        router.push({
          path: `/revision/${doc_id}`,
          query: { next: next_doc_id, category: this.categoryFilter },
        });
      } else {
        this.$message.error(`${result.code}: ${result.data}`);
      }
    },
    async remove(doc_id) {
      var uid = sessionStorage.getItem("user");
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
      var user = sessionStorage.getItem("user");
      if (!user) {
        this.loading = false;
        this.$notify.warning("You are not logged in!");
        router.push({ name: "Home" });
      } else {
        var result = await getMemory(user);
        var cateogry_result = await getCategory(user);
        this.loading = false;
        if (cateogry_result.success) {
          this.categories = ["All"].concat(cateogry_result.data);
        } else {
          this.$message.error(
            `${category_result.code}: ${cateogry_result.data}`
          );
        }
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
      this.$refs.memoryTable.sort("created_on", "ascending");
    },
    sortPrevDate(a, b) {
      const formatter = "dddd, MMM Do YYYY, HH:mm:ss";
      return moment(a.created_on, formatter).isBefore(
        moment(b.created_on, formatter)
      )
        ? -1
        : 1;
    },
    sortNextDate(a, b) {
      const formatter = "dddd, MMM Do YYYY, HH:mm:ss";
      return moment(a.next_date, formatter).isBefore(
        moment(b.next_date, formatter)
      )
        ? -1
        : 1;
    },
  },
  mounted() {
    setTimeout(() => {
      this.refreshMemory();
    }, 1500);
  },
  computed: {
    displayMemoryData() {
      this.loading = true;
      var data = this.memoryData;
      if (this.showOnlyNeedRevision) {
        data = data.filter((d) => d.need_revise);
      }
      data = data.filter((d) =>
        this.typeFilter == "all" ? true : d.type === this.typeFilter
      );
      data = data.filter((d) =>
        this.categoryFilter == "All" ? true : this.categoryFilter === d.category
      );
      data = data.filter((d) => searchFilter(this.searchText, d));
      this.loading = false;
      return data;
    },
  },
};
</script>

<style scoped>
.action-panel {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
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
  word-break: break-word;
  text-overflow: unset;
  white-space: normal;
  overflow: hidden;
  height: 80px;
}
a {
  font-size: 12px !important;
  text-decoration: none !important;
  color: grey !important;
}

@media (max-width: 500px) {
  .memory {
    height: 60vh;
  }
}
</style>