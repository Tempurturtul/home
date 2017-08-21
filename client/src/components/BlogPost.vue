<template>
  <div class="blog-post">
    <h1>~/blog/{{id}}$ print-post</h1>
    <div v-if="post" v-html="post.body"></div>
  </div>
</template>

<script>
export default {
  name: 'blog-post',
  props: [
    'id',
  ],
  data() {
    return {
      post: null,
    };
  },
  mounted() {
    this.fetchPost();
  },
  methods: {
    fetchPost() {
      const posts = [
        {
          title: 'Reviewing FEND',
          subtitle: 'Udacity\'s Front-End Web Developer Nanodegree',
          author: 'Matthew Feidt',
          created: '2016-07-24',
          modified: '',
          tags: [
            'review',
            'education',
          ],
          body: '<p>This review was originally posted on Reddit\'s /r/learnprogramming and /r/webdev subreddits. ...</p>',
        },
        {
          title: 'Hello World',
          subtitle: '',
          author: 'Matthew Feidt',
          created: '2016-07-19',
          modified: '2017-05-07',
          tags: [
            'personal',
          ],
          body: '<p>My name\'s Matt. ...</p>',
        },
      ];

      this.post = posts.filter(p => p.title.toLowerCase().split(' ').join('-') === this.id)[0];
    },
  },
};
</script>

<style scoped>
</style>
