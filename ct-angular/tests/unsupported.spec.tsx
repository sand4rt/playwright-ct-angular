import { expect, test } from '@sand4rt/experimental-ct-angular';

test('should throw an error when mounting JSX', async ({ mount }) => {
  // @ts-ignore
  await expect(mount(<h1 /> as any)).rejects.toThrow('JSX mount notation is not supported');
});
