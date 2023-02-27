# Playwright angular component testing

> **Note**
> Playwright component testing is marked as experimental by the playwright team. 

## Usage

First, install playwright and initialize component testing, then install the web component adapter.

```sh
npm init playwright@latest -- --ct
npm install -D @sand4rt/experimental-ct-angular
```

After installing the config needs to be modified:

```ts
import { defineConfig } from "@sand4rt/experimental-ct-angular";

export default defineConfig({
  // ...Your config
});
```

Now you can start adding your first test:

```ts
// button.component.ts
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  template: `<button>{{title}}</button>`,
  selector: 'button-component'
})
export class ButtonComponent {
  @Input() title!: string;
}
```

```jsx
// Button.test.ts
import { test, expect } from '@sand4rt/experimental-ct-angular';
import { ButtonComponent } from './components/button.component';

test('render props', async ({ mount }) => {
  const component = await mount(ButtonComponent, {
    props: {
      title: 'Submit',
    },
  });
  await expect(component).toContainText('Submit');
});
```

See the official [playwright component testing documentation](https://playwright.dev/docs/test-components) and the tests for [angular](ct-angular/tests) for more information on how to use it.

