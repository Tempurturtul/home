<template>
  <div class="landing">
    <h1>~$ greet</h1>
    <h2>{{ msg }}</h2>
  </div>
</template>

<script>
export default {
  name: 'landing',
  data() {
    return {
      msg: 'Welcome home.',
    };
  },
};
</script>

<style scoped>
</style>
