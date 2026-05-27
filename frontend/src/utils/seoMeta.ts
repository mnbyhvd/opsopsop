const SITE_URL = 'https://sps-master.ru';

export interface SeoMetaInput {
  title: string;
  description: string;
  canonicalPath?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
}

const normalizeCanonicalUrl = (canonicalPath?: string, canonicalUrl?: string) => {
  if (canonicalUrl) return canonicalUrl;
  const path = canonicalPath || '/';
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const buildSeoMeta = ({
  title,
  description,
  canonicalPath,
  canonicalUrl,
  ogTitle,
  ogDescription
}: SeoMetaInput): SeoMeta => ({
  title,
  description,
  canonicalUrl: normalizeCanonicalUrl(canonicalPath, canonicalUrl),
  ogTitle: ogTitle || title,
  ogDescription: ogDescription || description
});
