import { buildSeoMeta } from './seoMeta';

declare const describe: (name: string, callback: () => void) => void;
declare const it: (name: string, callback: () => void) => void;
declare const expect: any;

describe('buildSeoMeta', () => {
  it('uses title and description as default Open Graph tags', () => {
    const meta = buildSeoMeta({
      title: 'Тестовая страница',
      description: 'Описание тестовой страницы',
      canonicalPath: '/test'
    });

    expect(meta.ogTitle).toBe('Тестовая страница');
    expect(meta.ogDescription).toBe('Описание тестовой страницы');
    expect(meta.canonicalUrl).toBe('https://sps-master.ru/test');
  });
});
