<template>
  <div class="input-content">
    <div class="input-content-holder">
      <div class="option-holder">
        <el-select v-model="option">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import router from "../router";
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
    };
  },
  watch: {
    option() {
      if (this.option == "link") router.push("/link");
      if (this.option == "q_a") router.push("/qa");
    },
  },
};
</script>

<style>
.input-content {
  font-size: 20px;
  width: 80vw;
  max-width: 100%;
  max-height: 70vh;
}
.input-content-holder {
  text-align: right;
  margin-top: 2vh;
  margin-bottom: 2vh;
}

.option-holder {
  z-index: 999;
}

.el-select {
  width: 100px;
}
</style>