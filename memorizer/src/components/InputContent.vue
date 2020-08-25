<template>
  <div class="input-content">
    <div class="input-content-holder">
      <transition name="fade">
        <div v-show="option_before_visible" class="option-holder-before">
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
        <div v-show="option_after_visible" class="option-holder-after">
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
    option_before_visible() {
      return this.option === "";
    },
    option_after_visible() {
      return this.option != "";
    },
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
}
.input-content-holder {
  text-align: center;
  padding: 10px;
  margin-top: 30px;
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
  position: fixed;
  left: 25vw;
  right: 25vw;
  top: 120px;
}

.option-holder-after {
  z-index: 999;
  position: fixed;
  top: 20px;
  right: 20px;
}

.el-select {
  width: 100px
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>