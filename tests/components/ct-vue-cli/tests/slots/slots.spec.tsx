import { test, expect } from '@playwright/experimental-ct-vue';
import Button from '@/components/Button.vue';
import DefaultSlot from '@/components/DefaultSlot.vue';
import NamedSlots from '@/components/NamedSlots.vue';

test('render a default slot', async ({ mount }) => {
  const component = await mount(<DefaultSlot>Main Content</DefaultSlot>);
  await expect(component).toContainText('Main Content');
});

test('render a component as slot', async ({ mount }) => {
  const component = await mount(
    <DefaultSlot>
      <Button title="Submit" />
    </DefaultSlot>
  );
  await expect(component).toContainText('Submit');
});

test('render a component with multiple children', async ({ mount }) => {
  const component = await mount(
    <DefaultSlot>
      <div id="one">One</div>
      <div id="two">Two</div>
    </DefaultSlot>
  );
  await expect(component.locator('#one')).toContainText('One');
  await expect(component.locator('#two')).toContainText('Two');
});

test('default', async ({ mount }) => {
  const component = await mount(Component);
  // hydrates automatically because mode is 'default' by default.  
});

test('ssr', async ({ mount }) => {
  const component = await mount(Component, { mode: 'ssr' });
  // .. verify that SSR was right 
  await component.hydrate();
  // .. verify the component after hydration works
});

['ssr', 'default'].forEach(mode => {
  test(mode, async ({ mount }) => {
    const component = await mount(Component, { mode });
    // .. verify that SSR and default was right 
  });
})

test('render a component with a named slot', async ({ mount }) => {
  const component = await mount(
    <NamedSlots>
      <template v-slot:header>Header</template>
      <template v-slot:main>Main Content</template>
      <template v-slot:footer>Footer</template>
    </NamedSlots>
  );
  await expect(component).toContainText('Header');
  await expect(component).toContainText('Main Content');
  await expect(component).toContainText('Footer');
});
