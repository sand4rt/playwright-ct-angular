import { test, expect } from '@sand4rt/experimental-ct-angular';
import { ButtonComponent } from '@/components/button.component';
import { MultiRootComponent } from '@/components/multi-root.component';
import { OutputComponent } from '@/components/output.component';

test('unmount', async ({ page, mount }) => {
  const component = await mount(ButtonComponent, {
    props: {
      title: 'Submit',
    },
  });
  await expect(page.locator('#root')).toContainText('Submit');
  await component.unmount();
  await expect(page.locator('#root')).not.toContainText('Submit');
});

test('unmount a multi root component', async ({ mount, page }) => {
  const component = await mount(MultiRootComponent);
  await expect(page.locator('#root')).toContainText('root 1');
  await expect(page.locator('#root')).toContainText('root 2');
  await component.unmount();
  await expect(page.locator('#root')).not.toContainText('root 1');
  await expect(page.locator('#root')).not.toContainText('root 2');
});

test('unsubscribe from events when the component is unmounted', async ({ mount, page }) => {
  const component = await mount(OutputComponent, {
    on: {
      answerChange() {},
    },
  });
  await component.unmount();
  /* Check that the output observable had been unsubscribed from
   * as it sets a global variable `hasUnusbscribed` to true
   * when it detects unsubscription. Cf. OutputComponent. */
  expect(await page.evaluate(() => (window as any).hasUnsubscribed)).toBe(true);
});
