export const HOME_BLOCK_KEYS = [
  'hero',
  'about_main',
  'technical_specs',
  'about_secondary',
  'products',
  'video_presentations',
  'downloads',
  'scroll_video'
] as const;

export type HomeBlockKey = typeof HOME_BLOCK_KEYS[number];
export type HomeBlockState = Record<HomeBlockKey, boolean>;

export interface HomeBlockVisibilitySource {
  block_key: string;
  is_active?: boolean | number | string | null;
}

const isHomeBlockKey = (key: string): key is HomeBlockKey =>
  HOME_BLOCK_KEYS.includes(key as HomeBlockKey);

const isInactiveValue = (value: HomeBlockVisibilitySource['is_active']) =>
  value === false || value === 0 || value === '0' || value === 'false';

export const defaultHomeBlockState: HomeBlockState = HOME_BLOCK_KEYS.reduce(
  (state, key) => ({ ...state, [key]: true }),
  {} as HomeBlockState
);

export const buildHomeBlockState = (
  blocks: HomeBlockVisibilitySource[] | null | undefined
): HomeBlockState => {
  const state = { ...defaultHomeBlockState };

  (blocks || []).forEach(block => {
    if (isHomeBlockKey(block.block_key)) {
      state[block.block_key] = !isInactiveValue(block.is_active);
    }
  });

  return state;
};
