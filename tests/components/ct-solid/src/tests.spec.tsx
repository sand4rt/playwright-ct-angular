import { test, expect } from '@playwright/experimental-ct-solid'
import Button from './components/Button';
import DefaultChildren from './components/DefaultChildren';

test.use({ viewport: { width: 500, height: 500 } });

test('props should work', async ({ mount }) => {
  const component = await mount(<Button title="Submit" />);
  await expect(component).toContainText('Submit');
});

test('callback should work', async ({ mount }) => {
  const messages: string[] = []
  const component = await mount(<Button title="Submit" onClick={data => {
    messages.push(data)
  }}></Button>)
  await component.click()
  expect(messages).toEqual(['hello'])
})

test('default child should work', async ({ mount }) => {
  const component = await mount(<DefaultChildren>
    Main Content
  </DefaultChildren>)
  await expect(component).toContainText('Main Content')
})
