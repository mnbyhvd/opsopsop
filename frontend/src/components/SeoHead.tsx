import React from 'react';
import { Helmet } from 'react-helmet-async';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildSeoMeta } from '../utils/seoMeta';

interface SeoHeadProps {
  pageKey?: string;
  title?: string;
  description?: string;
  canonicalPath?: string;
  canonicalUrl?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({
  pageKey,
  title,
  description,
  canonicalPath,
  canonicalUrl
}) => {
  const cmsMeta = usePageMeta(pageKey || '');
  const meta = buildSeoMeta({
    title: title || cmsMeta.title,
    description: description || cmsMeta.description,
    canonicalPath: canonicalPath || cmsMeta.path,
    canonicalUrl
  });

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.ogDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.canonicalUrl} />
      <link rel="canonical" href={meta.canonicalUrl} />
    </Helmet>
  );
};

export default SeoHead;
