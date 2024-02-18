import { test, expect } from '@sand4rt/experimental-ct-angular';
import { CounterComponent } from '@/components/counter.component';
import { ButtonComponent } from '@/components/button.component';

test('update props without remounting', async ({ mount }) => {
  const component = await mount(CounterComponent, {
    props: { count: 9001 },
  });
  await expect(component.getByTestId('props')).toContainText('9001');

  await component.update({
    props: { count: 1337 },
  });
  await expect(component).not.toContainText('9001');
  await expect(component.getByTestId('props')).toContainText('1337');

  await expect(component.getByTestId('remount-count')).toContainText('1');
});

test('update event listeners without remounting', async ({ mount }) => {
  const component = await mount(CounterComponent);

  const messages: string[] = [];
  await component.update({
    on: {
      submit: (data: string) => messages.push(data),
    },
  });
  await component.click();
  expect(messages).toEqual(['hello']);

  await expect(component.getByTestId('remount-count')).toContainText('1');
});

test('replace existing listener when new listener is set', async ({ mount }) => {
  let count = 0;

  const component = await mount(ButtonComponent, {
    props: {
      title: 'Submit',
    },
    on: {
      submit() {
        count++;
      },
    },
  });
  component.update({
    on: {
      submit() {
        count++;
      },
    },
  });
  await component.click();
  expect(count).toBe(1);
});

