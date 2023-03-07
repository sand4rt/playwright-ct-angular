import { test, expect } from '@playwright/experimental-ct-solid';
import Button from '@/components/Button';
import DefaultChildren from '@/components/DefaultChildren';
import MultipleChildren from '@/components/MultipleChildren';

test('render a default child', async ({ mount }) => {
  const component = await mount(
    <DefaultChildren>Main Content</DefaultChildren>
  );
  await expect(component).toContainText('Main Content');
});

test('render multiple children', async ({ mount }) => {
  const component = await mount(
    <DefaultChildren>
      <div id="one">One</div>
      <div id="two">Two</div>
    </DefaultChildren>
  );
  await expect(component.locator('#one')).toContainText('One');
  await expect(component.locator('#two')).toContainText('Two');
});

test('render a component as child', async ({ mount }) => {
  const component = await mount(
    <DefaultChildren>
      <Button title="Submit" />
    </DefaultChildren>
  );
  await expect(component).toContainText('Submit');
});

test('render named children', async ({ mount }) => {
  const component = await mount(
    <MultipleChildren>
      <div>Header</div>
      <div>Main Content</div>
      <div>Footer</div>
    </MultipleChildren>
  );
  await expect(component).toContainText('Header');
  await expect(component).toContainText('Main Content');
  await expect(component).toContainText('Footer');
});

test('render string as child', async ({ mount }) => {
  const component = await mount(<DefaultChildren>{'string'}</DefaultChildren>);
  await expect(component).toContainText('string');
});

test('render array as child', async ({ mount }) => {
  const component = await mount(<DefaultChildren>{[4,2]}</DefaultChildren>);
  await expect(component).toContainText('42');
});

test('render number as child', async ({ mount }) => {
  const component = await mount(<DefaultChildren>{1337}</DefaultChildren>);
  await expect(component).toContainText('1337');
});