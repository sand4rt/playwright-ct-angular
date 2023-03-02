import { beforeMount, afterMount } from '@sand4rt/experimental-ct-angular/hooks';
import '../src/assets/styles.css';

export type HooksConfig = {
  routing?: boolean
}

beforeMount<HooksConfig>(async ({ hooksConfig, TestBed }) => {
  console.log('After mount');
});

afterMount<HooksConfig>(async () => {
  console.log('After mount');
});
