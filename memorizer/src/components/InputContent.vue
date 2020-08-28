<template>
  <div class="input-content">
    <div class="input-content-holder">
      <transition name="fade">
        <div v-show="centralise" class="option-holder-before">
          <el-select v-model="option">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </transition>
      <transition name="fade">
        <div v-show="!centralise" class="option-holder-after">
          <el-select v-model="option">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </transition>
    </div>
    <router-view />
  </div>
</template>

<script>
import router from "../router"
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
  computed: {
    centralise() {
      var route = this.$route.name;
      if (route == "Link" || route == "QA") return false;
      return true;
    }
  },
  watch: {
    option() {
      if (this.option == 'link') router.push('/link');
      if (this.option == 'q_a') router.push('/qa');
    }
  }
};
</script>

<style>
.input-content {
  font-size: 20px;
  width: 80vw;
}
.input-content-holder {
  text-align: center;
  padding: 10px;
  margin-top: 20px;
}

.display-link {
  font-size: 20px;
}
.display-title {
  font-weight: 700;
  margin-right: 10px;
}

.option-holder-before {
  z-index: 999;
  position: absolute;
  left: 25vw;
  right: 25vw;
  top: 150px;
}

.option-holder-after {
  z-index: 999;
  position: absolute;
  top: 30px;
  left: 30px;
}

.el-select {
  width: 100px
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>