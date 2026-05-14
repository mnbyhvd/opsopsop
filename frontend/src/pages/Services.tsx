import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageContainer from '../components/PageContainer';
import { useServices } from '../hooks/useServices';
import { resolveMediaUrl } from '../utils/media';

const Services: React.FC = () => {
  const { services, loading, error } = useServices();

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg)' }}>
      <Helmet>
        <title>Услуги | СПС МАСТЕР</title>
        <meta name="description" content="Услуги СПС МАСТЕР: проектирование, монтаж, пусконаладка, обслуживание и экспертиза систем пожарной безопасности." />
        <link rel="canonical" href="https://sps-master.ru/services" />
      </Helmet>

      <PageContainer>
        <div className="col-start-1 col-end-13 mb-12 px-4 md:px-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl uppercase mb-6"
            style={{ fontFamily: 'var(--font-headings, Bebas Neue)', color: 'var(--font-headings-color, var(--text))' }}
          >
            Услуги
          </motion.h1>
          <p
            className="max-w-3xl text-lg md:text-xl leading-relaxed"
            style={{ fontFamily: 'var(--font-body, Inter)', color: 'var(--font-body-color, var(--text))' }}
          >
            Выполняем полный цикл работ по системам пожарной безопасности: от обследования и проектирования до монтажа, пусконаладки и регулярного обслуживания.
          </p>
        </div>
      </PageContainer>

      <PageContainer>
        <div className="col-start-1 col-end-13 px-4 md:px-0">
          {loading && <div className="py-12 text-lg" style={{ color: 'var(--text)' }}>Загрузка услуг...</div>}
          {error && !loading && <div className="py-12 text-lg" style={{ color: 'var(--accent)' }}>Показаны резервные данные</div>}

          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.article
                key={service.id}
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
                    {service.title}
                  </h2>
                  <p
                    className="text-base md:text-lg leading-relaxed whitespace-pre-line"
                    style={{ fontFamily: 'var(--font-body, Inter)', color: 'var(--font-body-color, var(--text))' }}
                  >
                    {service.description}
                  </p>
                </div>

                <div className="lg:col-span-5">
                  {service.image_url ? (
                    <img
                      src={resolveMediaUrl(service.image_url)}
                      alt={service.title}
                      className="w-full aspect-[4/3] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] flex items-center justify-center glass" style={{ color: 'var(--text)' }}>
                      Изображение услуги
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Services;
