import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeoHead from '../components/SeoHead';
import PageContainer from '../components/PageContainer';
import { usePortfolioProject } from '../hooks/usePortfolio';
import { resolveMediaUrl } from '../utils/media';

const PortfolioDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading } = usePortfolioProject(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        Загрузка проекта...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        <div className="text-center">
          <div className="text-3xl mb-6">Проект не найден</div>
          <Link to="/portfolio" className="underline">Вернуться в портфолио</Link>
        </div>
      </div>
    );
  }

  const metaTitle = project.meta_title || `${project.title} | СПС МАСТЕР`;
  const metaDescription = project.meta_description || (project.summary || project.description || '').slice(0, 160);

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg)' }}>
      <SeoHead
        title={metaTitle}
        description={metaDescription}
        canonicalPath={`/portfolio/${project.slug}`}
      />

      <PageContainer>
        <div className="col-start-1 col-end-13 px-4 md:px-0 mb-20">
          <Link to="/portfolio" className="inline-block mb-10 text-sm uppercase" style={{ color: 'var(--accent)' }}>
            Назад к портфолио
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <h1
                className="text-4xl md:text-6xl uppercase mb-6"
                style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}
              >
                {project.title}
              </h1>
              {project.location && (
                <div className="mb-6 text-sm uppercase" style={{ color: 'var(--accent)' }}>
                  {project.location}
                </div>
              )}
              <p className="text-base md:text-xl leading-relaxed whitespace-pre-line" style={{ color: 'var(--font-body-color, var(--text))' }}>
                {project.description || project.summary}
              </p>
            </div>
            <div className="lg:col-span-5">
              {project.image_url && (
                <img src={resolveMediaUrl(project.image_url)} alt={project.title} className="w-full aspect-square object-cover" />
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      <PageContainer>
        <div className="col-start-1 col-end-13 px-4 md:px-0">
          <div className="space-y-20">
            {(project.sections || []).map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
              >
                <div className="lg:col-span-7">
                  <h2
                    className="text-3xl md:text-5xl uppercase mb-6"
                    style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed whitespace-pre-line" style={{ color: 'var(--font-body-color, var(--text))' }}>
                    {section.description}
                  </p>
                </div>
                <div className="lg:col-span-5">
                  {section.image_url ? (
                    <img src={resolveMediaUrl(section.image_url)} alt={section.title} className="w-full aspect-[4/3] object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full aspect-[4/3] glass flex items-center justify-center" style={{ color: 'var(--text)' }}>
                      Материал проекта
                    </div>
                  )}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default PortfolioDetail;
