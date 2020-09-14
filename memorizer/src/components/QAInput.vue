<template>
  <div>
    <el-form
      ref="qa_form"
      :model="qa_form"
      :rules="qa_rules"
      label-width="120px"
      style="width: 100%"
    >
      <el-form-item label="Category" prop="category">
        <CategorySelector ref="categorySelector" />
      </el-form-item>
      <el-form-item label="Question" prop="q">
        <el-input
          class="input-element"
          placeholder="Input your question..."
          v-model="qa_form.q"
          :maxlength="100"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="Answer" prop="a">
        <el-input
          class="input-element"
          type="textarea"
          :rows="5"
          placeholder="Input your answer..."
          v-model="qa_form.a"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div style="text-align: left">
          <el-button type="info" plain @click="submit">Submit</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div>
      <div class="display-holder">
        <div class="display-title">Question:</div>
        <div class="display-content">{{ qa_form.q }}</div>
      </div>
      <div class="display-holder">
        <div class="display-title">Answer:</div>
        <div class="display-content">
          <span>{{ qa_form.a }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "./../../firebase";
import CategorySelector from "@/components/CategorySelector";
import { pushCategory, addQA } from "@/controllers/dbController";
export default {
  components: {
    CategorySelector,
  },
  data() {
    return {
      qa_form: {
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
    };
  },
  methods: {
    submit() {
      var user = sessionStorage.getItem("user");
      if (user) {
        this.$refs.qa_form.validate(async (valid) => {
          if (valid) {
            var q = this.qa_form.q;
            var a = this.qa_form.a;
            var category = this.$refs.categorySelector.category;
            var result = await pushCategory(user, category);
            if (!result.success) {
              this.$message.error(`${result.code}: ${result.data}`);
            }
            result = await addQA(user, q, a, category);
            if (result.success) {
              this.$message.success(
                "Your memory has been successfully recorded!"
              );
              this.$refs.qa_form.resetFields();
            } else {
              var errorCode = err.code;
              var errorMessage = err.message;
              this.$message.error(errorCode + ": " + errorMessage);
            }
          }
        });
      } else {
        this.$message.warning("You are not logged in!");
      }
    },
  },
};
</script>

<style scoped>
.el-input,
.el-textarea {
  width: 50vw;
}
.display-holder {
  display: flex;
  margin-bottom: 20px;
}
.display-content {
  white-space: pre-wrap;
  width: 50vw;
  word-break: break-word;
}
.display-title {
  width: 100px;
  font-weight: 700;
  margin-right: 10px;
}
</style>