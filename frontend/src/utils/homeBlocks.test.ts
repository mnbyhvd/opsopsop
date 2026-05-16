import { buildHomeBlockState, defaultHomeBlockState } from './homeBlocks';

declare const describe: (name: string, callback: () => void) => void;
declare const it: (name: string, callback: () => void) => void;
declare const expect: any;

describe('home block visibility state', () => {
  it('keeps every homepage block enabled by default', () => {
    expect(Object.values(defaultHomeBlockState).every(Boolean)).toBe(true);
  });

  it('applies inactive CMS block flags without disabling missing defaults', () => {
    const state = buildHomeBlockState([
      { block_key: 'scroll_video', is_active: false },
      { block_key: 'products', is_active: true },
      { block_key: 'unknown_block', is_active: false },
    ]);

    expect(state.scroll_video).toBe(false);
    expect(state.products).toBe(true);
    expect(state.hero).toBe(true);
    expect((state as Record<string, boolean | undefined>).unknown_block).toBeUndefined();
  });
});
