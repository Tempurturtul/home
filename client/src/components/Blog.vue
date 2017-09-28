<template>
  <div class="blog">
    <h1>~/blog$ ls -l posts/ | format-post-info</h1>
    <div class="posts">
      <div class="loading" v-if="loading">
        Loading...
      </div>

      <div class="error" v-if="error">
        {{ error }}
      </div>

      <ul class="content" v-if="posts">
        <li v-for="post in posts">
          <router-link :to="{path: `/blog/${post.id}`}">{{post.created}} {{post.author}} {{post.title}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'blog',
  data() {
    return {
      loading: false,
      posts: null,
      error: null,
    };
  },
  created() {
    // Fetch data when view is created.
    this.fetchData();
  },
  watch: {
    // Fetch data again when the route changes.
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      this.error = null;
      this.posts = null;
      this.loading = true;

      axios.get('/api/v1/blog-posts')
        .then((res) => {
          this.loading = false;
          this.posts = res.data;
        })
        .catch((e) => {
          this.loading = false;
          this.error = e.toString();
        });
    },
  },
};
</script>

<style scoped>
li {
  text-align: left;
}
</style>
