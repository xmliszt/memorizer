<template>
  <div class="category-selector">
    <el-tooltip
      effect="dark"
      content="Enter a new category or select an existing one"
      placement="left"
    >
      <el-select
        v-model="category"
        filterable
        allow-create
        default-first-option
        @change="onCategoryChanged"
        placeholder="Category"
      >
        <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-tooltip>
  </div>
</template>

<script>
import { getCategory } from "./../controllers/dbController";
export default {
  data() {
    return {
      category: "uncategorized",
      options: ["uncategorized"],
    };
  },
  methods: {
    onCategoryChanged(value) {
      if (this.options.includes(value)) return;
      this.options.push(value);
    },
  },
  async mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      var result = await getCategory(user);
      if (result.success) {
        this.options = result.data;
      } else {
        this.$message.error(`${result.code}: ${result.error}`);
      }
    } else {
      this.$message.warning("You are not logged in!");
    }
  },
};
</script>

<style scoped>
.category-selector {
  padding-right: 20px;
}

.el-select {
  width: 50vw;
}
</style>