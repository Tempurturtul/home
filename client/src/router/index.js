import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing';
import Whoami from '@/components/Whoami';
import Blog from '@/components/Blog';
import BlogPost from '@/components/BlogPost';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Landing,
    },
    {
      path: '/whoami',
      component: Whoami,
    },
    {
      path: '/blog',
      component: Blog,
    },
    {
      path: '/blog/:id',
      component: BlogPost,
      props: true,
    },
  ],
});
