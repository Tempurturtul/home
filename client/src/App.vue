<template>
  <div id="app">
    <header>
      <router-link to="/">~</router-link>
      <router-link to="/whoami">whoami</router-link>
      <router-link to="/blog">blog</router-link>
      <router-link to="/portfolio">portfolio</router-link>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2,
h3 {
  font-weight: normal;
}

a {
  color: #42b983;
}

ul {
  list-style: none;
  padding: 0;
}
</style>
