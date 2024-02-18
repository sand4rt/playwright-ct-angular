import { test, expect } from '@sand4rt/experimental-ct-angular';
import { ButtonComponent } from '@/components/button.component';

test('emit an submit event when the button is clicked', async ({ mount }) => {
  const messages: string[] = [];
  const component = await mount(ButtonComponent, {
    props: {
      title: 'Submit',
    },
    on: {
      submit: (data: string) => messages.push(data),
    },
  });
  await component.click();
  expect(messages).toEqual(['hello']);
});
