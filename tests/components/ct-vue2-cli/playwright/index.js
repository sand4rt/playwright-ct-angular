//@ts-check
import { beforeMount, afterMount } from '@playwright/experimental-ct-vue2/hooks';
import Router from 'vue-router';
import { router } from '../src/router';
import '../src/assets/index.css';

beforeMount(async ({ app, options, hooksConfig }) => {
  console.log(`Before mount: ${JSON.stringify(hooksConfig)}`);
  app.use(Router);
  options.router = router;
});

afterMount(async ({ instance }) => {
  console.log(`After mount el: ${instance.$el.constructor.name}`);
});
