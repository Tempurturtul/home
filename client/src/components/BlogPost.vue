<template>
  <div class="blog-post">
    <h1>~/blog/{{ id }}$ print-post</h1>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div class="error" v-if="error">
      {{ error }}
    </div>

    <div class="content" v-if="post">
      <h1>{{ post.title }}</h1>
      <!-- TODO ID -->
      <!-- TODO Author -->
      <!-- TODO Created -->
      <!-- TODO Modified -->
      <!-- TODO Tags -->
      <!-- TODO Body -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'blog-post',
  props: [
    'id',
  ],
  data() {
    return {
      loading: false,
      error: null,
      post: null,
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
      this.post = null;
      this.loading = true;

      axios.get(`/api/v1/blog-post/${this.id}`)
        .then((res) => {
          this.loading = false;
          this.post = res.data;
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
</style>
