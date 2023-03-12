# Playwright Angular component testing

> **Note**
> The API has been designed to closely resemble Playwright's API wherever applicable. This library is _(without guarantee)_ aimed at facilitating a smooth transition to Playwright once it offers official support for Angular components. It is important to take into account that this library will reach end of life when Playwright has official support for Angular component testing.
> 
> To push for official support, feedback in the form of GitHub issues and or stars is appreciated!

## Usage

First, install playwright and initialize component testing, then install the Angular adapter.

```sh
npm init playwright@latest -- --ct
npm install -D @sand4rt/experimental-ct-angular
```

After installing the config needs to be modified:

```ts
import { defineConfig } from '@sand4rt/experimental-ct-angular';

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
  selector: 'button-component',
  template: `<button>{{title}}</button>`,
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

See the official [playwright component testing documentation](https://playwright.dev/docs/test-components) and the [tests](ct-angular/tests) for more information on how to use it.
