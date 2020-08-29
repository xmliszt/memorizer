<template>
  <div class="home">
    <InputContent />
  </div>
</template>

<script>
import InputContent from "@/components/InputContent.vue";
export default {
  components: {
    InputContent,
  },
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  overflow: scroll;
  height: 65vh;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.home::-webkit-scrollbar {
  display: none;
}

@media(max-width: 500px) {
  .home {
    height: 60vh;
  }
}
</style>
