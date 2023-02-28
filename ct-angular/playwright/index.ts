import { beforeMount, afterMount } from '@sand4rt/experimental-ct-angular/hooks';
import '@/assets/styles.css';

export type HooksConfig = {
  routing?: boolean
}

beforeMount<HooksConfig>(async ({ hooksConfig, TestBed }) => {
  console.log('Before mount')
});

afterMount<HooksConfig>(async () => {
  console.log('After mount');
});
