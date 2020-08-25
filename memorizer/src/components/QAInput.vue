<template>
  <div>
    <el-form
      ref="qa_form"
      :inline="true"
      :model="qaForm"
      :rules="qa_rules"
      label-width="100px"
      style="width: 100%"
    >
      <el-form-item label="Question" prop="q">
        <el-input
          class="input-element"
          placeholder="Input your question..."
          v-model="qaForm.q"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Answer" prop="a">
        <el-input
          class="input-element"
          placeholder="Input your answer..."
          v-model="qaForm.a"
          type="url"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div>
      <p>
        <span class="display-title">Question:</span>
        {{ qaForm.q }}
      </p>
      <p>
        <span class="display-title">Answer:</span>
        {{ qaForm.a }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qaForm: {
        q: "",
        a: "",
      },
      
      qa_rules: {
        q: [
          {
            required: true,
            message: "Question cannot be empty",
            trigger: "blur",
          },
        ],
        a: [
          {
            required: true,
            message: "Answer cannot be empty",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    onEnter(e) {
      if (e.charCode === 13) {
        if (this.option === "") {
          this.$notify.warning("Please select an option first!");
        } else if (this.option === "link") {
        } else if (this.option === "q_a") {
        }
      }
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 300px;
}
</style>