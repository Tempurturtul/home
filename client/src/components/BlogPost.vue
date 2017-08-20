<template>
  <div class="blog-post">
    <h1>~/blog/{{id}}$ print-post</h1>
  </div>
</template>

<script>
export default {
  name: 'blog-post',
  props: [
    'id',
  ],
};
</script>

<style scoped>
</style>
