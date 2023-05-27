import { test, expect } from '@playwright/experimental-ct-react17';
import Counter from '@/components/Counter.vue';
import DefaultSlot from '@/components/DefaultSlot.vue';

test('update props without remounting', async ({ mount }) => {
  const component = await mount(<Counter count={9001} />);
  await expect(component.getByTestId('props')).toContainText('9001');

  await component.update(<Counter count={1337} />);
  await expect(component).not.toContainText('9001');
  await expect(component.getByTestId('props')).toContainText('1337');

  await expect(component.getByTestId('remount-count')).toContainText('2');
});

test('update child props without remounting', async ({ mount }) => {
  const component = await mount(<DefaultSlot><Counter count={9001} /></DefaultSlot>);
  await expect(component.getByTestId('props')).toContainText('9001');

  await component.update(<DefaultSlot><Counter count={1337} /></DefaultSlot>);
  await expect(component).not.toContainText('9001');
  await expect(component.getByTestId('props')).toContainText('1337');

  await expect(component.getByTestId('remount-count')).toContainText('2');
});

test('update callbacks without remounting', async ({ mount }) => {
  const component = await mount(<Counter />);

  const messages: string[] = [];
  await component.update(
    <Counter
      v-on:submit={(message) => {
        messages.push(message);
      }}
    />
  );
  await component.click();
  expect(messages).toEqual(['hello']);

  await expect(component.getByTestId('remount-count')).toContainText('2');
});

test('update child callbacks without remounting', async ({ mount }) => {
  const component = await mount(<DefaultSlot><Counter /></DefaultSlot>);

  const messages: string[] = [];
  await component.update(
    <DefaultSlot>
      <Counter
        v-on:submit={(message) => {
          messages.push(message);
        }}
      />
    </DefaultSlot>
  );
  await component.getByRole('button').click();
  expect(messages).toEqual(['hello']);

  await expect(component.getByTestId('remount-count')).toContainText('2');
});

test('update children without remounting', async ({ mount }) => {
  const component = await mount(<Counter>Default Slot</Counter>);
  await expect(component).toContainText('Default Slot');

  await component.update(<Counter>Test Slot</Counter>);
  await expect(component).not.toContainText('Default Slot');
  await expect(component).toContainText('Test Slot');

  await expect(component.getByTestId('remount-count')).toContainText('2');
});

test.only('update grandchild without remounting', async ({ mount }) => {
  const component = await mount(
    <DefaultSlot>
      <Counter>Default Slot</Counter>
    </DefaultSlot>
  );
  await expect(component.getByRole('button')).toContainText('Default Slot');

  await component.update(
    <DefaultSlot>
      <Counter>Test Slot</Counter>
    </DefaultSlot>
  );
  await expect(component.getByRole('button')).not.toContainText('Default Slot');
  await expect(component.getByRole('button')).toContainText('Test Slot');

  await expect(component.getByTestId('remount-count')).toContainText('2');
});
