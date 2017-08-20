<template>
  <div class="landing">
    <h1>~$ greet</h1>
    <h2>{{ msg }}</h2>
    <router-link to="/whoami">whoami</router-link>
    <router-link to="/blog">blog</router-link>
    <router-link to="/portfolio">portfolio</router-link>
  </div>
</template>

<script>
export default {
  name: 'landing',
  data() {
    const messages = [
      'Welcome home.',
      'It\'s warmer with you here.',
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return {
      msg: messages[randomIndex],
    };
  },
};
</script>

<style scoped>
</style>
