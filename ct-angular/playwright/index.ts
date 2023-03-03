import { beforeMount, afterMount } from '@sand4rt/experimental-ct-angular/hooks';
import { ButtonComponent } from '@/components/button.component';
import '@/assets/styles.css';

export type HooksConfig = {
  routing?: boolean;
};

beforeMount<HooksConfig>(async ({ hooksConfig, TestBed }) => {
  TestBed.configureTestingModule({
    imports: [ButtonComponent],
  });
});

afterMount<HooksConfig>(async () => {
  console.log('After mount');
});
