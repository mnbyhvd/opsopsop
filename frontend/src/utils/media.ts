export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads') || url.startsWith('/images') || url.startsWith('/videos') || url.startsWith('/static')) {
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
}
