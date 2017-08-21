<template>
  <div class="blog">
    <h1>~/blog$ ls -l posts/ | format-post-info</h1>
    <ul>
      <li v-for="post in posts">
        <router-link :to="{path: '/blog/' + toLowerDashSpaces(post.title)}">{{post.created}} {{toLowerDashSpaces(post.author)}} {{toLowerDashSpaces(post.title)}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'blog',
  data() {
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

    return {
      posts,
    };
  },
  methods: {
    toLowerDashSpaces(str) {
      return str.toLowerCase().split(' ').join('-');
    },
  },
};
</script>

<style scoped>
li {
  text-align: left;
}
</style>
