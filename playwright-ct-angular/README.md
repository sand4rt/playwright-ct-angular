# Playwright Angular component testing

> **Note**
> The API has been designed to closely resemble Playwright's API wherever applicable. This library is _(without guarantee)_ aimed at facilitating a smooth transition to Playwright once it offers official support for Angular components. It is important to take into account that this library will reach end of life when Playwright has official support for Angular component testing.
> 
> To push for official support, feedback in the form of GitHub issues and or stars is appreciated!

## Usage

Initialize Playwright Angular component testing with PNPM, NPM or Yarn and follow the installation steps:

```sh
pnpm dlx create-playwright-sand4rt --ct
```
```sh
npm init playwright-sand4rt@latest -- --ct
```
```sh
yarn create playwright-sand4rt --ct
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
// button.component.test.ts
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

See the official [playwright component testing documentation](https://playwright.dev/docs/test-components) and the [tests](https://github.com/sand4rt/playwright-ct-angular/tree/main/ct-angular/tests) for more information on how to use it.
