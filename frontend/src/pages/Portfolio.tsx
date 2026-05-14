import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageContainer from '../components/PageContainer';
import { usePortfolioProjects } from '../hooks/usePortfolio';
import { resolveMediaUrl } from '../utils/media';

const Portfolio: React.FC = () => {
  const { projects, loading, error } = usePortfolioProjects();

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg)' }}>
      <Helmet>
        <title>Портфолио | СПС МАСТЕР</title>
        <meta name="description" content="Портфолио СПС МАСТЕР: реализованные проекты пожарной сигнализации, СОУЭ, пожаротушения и комплексной противопожарной защиты." />
        <link rel="canonical" href="https://sps-master.ru/portfolio" />
      </Helmet>

      <PageContainer>
        <div className="col-start-1 col-end-13 mb-12 px-4 md:px-0">
          <h1
            className="text-5xl md:text-7xl uppercase mb-6"
            style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}
          >
            Портфолио
          </h1>
          <p className="max-w-4xl text-lg md:text-xl leading-relaxed" style={{ color: 'var(--font-body-color, var(--text))' }}>
            Реализованные объекты с описанием проектных решений, состава работ, оборудования и технических сценариев.
          </p>
        </div>
      </PageContainer>

      <PageContainer>
        <div className="col-start-1 col-end-13 px-4 md:px-0">
          {loading && <div className="py-12 text-lg" style={{ color: 'var(--text)' }}>Загрузка портфолио...</div>}
          {error && !loading && <div className="py-12 text-lg" style={{ color: 'var(--accent)' }}>Показаны резервные данные</div>}

          <div className="space-y-24">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.3) }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
              >
                <div className="lg:col-span-7">
                  <Link to={`/portfolio/${project.slug}`} className="group">
                    <h2
                      className="text-4xl md:text-6xl uppercase mb-6 transition-colors group-hover:text-red-500"
                      style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}
                    >
                      {project.title}
                    </h2>
                  </Link>
                  {project.location && (
                    <div className="mb-5 text-sm uppercase" style={{ color: 'var(--accent)', fontFamily: 'var(--font-body, Inter)' }}>
                      {project.location}
                    </div>
                  )}
                  <p className="text-base md:text-xl leading-relaxed whitespace-pre-line" style={{ color: 'var(--font-body-color, var(--text))' }}>
                    {project.summary || project.description}
                  </p>
                </div>
                <Link to={`/portfolio/${project.slug}`} className="lg:col-span-5 block">
                  {project.image_url ? (
                    <img
                      src={resolveMediaUrl(project.image_url)}
                      alt={project.title}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-square glass flex items-center justify-center" style={{ color: 'var(--text)' }}>
                      Фото проекта
                    </div>
                  )}
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Portfolio;
