import { test, expect } from '@playwright/experimental-ct-solid'
import Button from './components/Button';
import MultiRoot from './components/MultiRoot';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(<Button />);
  await expect(component).toContainText('Submit');
});

test('should unmount', async ({ page, mount }) => {
  const component = await mount(<Button title="Submit" />)
  await expect(page.locator('#root')).toContainText('Submit')
  await component.unmount();
  await expect(page.locator('#root')).not.toContainText('Submit');
});

test('unmount a multi root component should work', async ({ mount, page }) => {
  const component = await mount(<MultiRoot />)
  await expect(page.locator('#root')).toContainText('root 1')
  await expect(page.locator('#root')).toContainText('root 2')
  await component.unmount()
  await expect(page.locator('#root')).not.toContainText('root 1')
  await expect(page.locator('#root')).not.toContainText('root 2')
})
