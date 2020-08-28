<template>
  <div class="home">
    <InputContent />
  </div>
</template>

<script>
import InputContent from "@/components/InputContent.vue"
export default {
  components: {
    InputContent
  }
}
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
