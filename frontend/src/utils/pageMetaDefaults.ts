export interface PageMetaDefaults {
  page_key: string;
  path: string;
  label: string;
  title: string;
  description: string;
  sort_order: number;
}

export const PAGE_META_DEFAULTS: PageMetaDefaults[] = [
  {
    page_key: 'home',
    path: '/',
    label: 'Главная',
    title: 'Автоматическая система пожарной сигнализации - Мастер',
    description: 'Современная интеллектуальная система пожарной сигнализации с интуитивным управлением, которая обеспечивает непрерывный мониторинг и быстрое реагирование.',
    sort_order: 1
  },
  {
    page_key: 'products',
    path: '/products',
    label: 'Продукция',
    title: 'Продукция | СПС МАСТЕР',
    description: 'Каталог продукции СПС МАСТЕР — приборы пожарной сигнализации, извещатели, блоки управления. Сертифицированное оборудование для объектов любой сложности.',
    sort_order: 2
  },
  {
    page_key: 'services',
    path: '/services',
    label: 'Услуги',
    title: 'Услуги | СПС МАСТЕР',
    description: 'Услуги СПС МАСТЕР: проектирование, монтаж, пусконаладка, обслуживание и экспертиза систем пожарной безопасности.',
    sort_order: 3
  },
  {
    page_key: 'portfolio',
    path: '/portfolio',
    label: 'Портфолио',
    title: 'Портфолио | СПС МАСТЕР',
    description: 'Портфолио СПС МАСТЕР: реализованные проекты пожарной сигнализации, СОУЭ, пожаротушения и комплексной противопожарной защиты.',
    sort_order: 4
  },
  {
    page_key: 'videos',
    path: '/videos',
    label: 'Видео-презентации',
    title: 'Видеопрезентации | СПС МАСТЕР',
    description: 'Видеопрезентации и обзоры оборудования СПС МАСТЕР. Смотрите как работают наши системы пожарной сигнализации.',
    sort_order: 5
  },
  {
    page_key: 'requisites',
    path: '/requisites',
    label: 'Реквизиты',
    title: 'Реквизиты | СПС МАСТЕР',
    description: 'Реквизиты компании СПС МАСТЕР — ИНН, КПП, ОГРН, банковские реквизиты и контактные данные для документооборота.',
    sort_order: 6
  },
  {
    page_key: 'about',
    path: '/about',
    label: 'О компании',
    title: 'О компании | СПС МАСТЕР',
    description: 'О компании СПС МАСТЕР — производитель систем пожарной и охранной сигнализации. История, команда, ценности.',
    sort_order: 7
  },
  {
    page_key: 'certificates',
    path: '/certificates',
    label: 'Сертификаты',
    title: 'Сертификаты | СПС МАСТЕР',
    description: 'Сертификаты и лицензии СПС МАСТЕР. Вся продукция сертифицирована и соответствует требованиям пожарной безопасности РФ.',
    sort_order: 8
  },
  {
    page_key: 'docs',
    path: '/docs',
    label: 'Документация',
    title: 'Документация | СПС МАСТЕР',
    description: 'Техническая документация, руководства по установке и эксплуатации оборудования СПС МАСТЕР. Скачать паспорта и инструкции.',
    sort_order: 9
  },
  {
    page_key: 'support',
    path: '/support',
    label: 'Поддержка',
    title: 'Поддержка | СПС МАСТЕР',
    description: 'Техническая поддержка СПС МАСТЕР — телефон, email, форма обратной связи. Помогаем с монтажом, настройкой и обслуживанием систем пожарной сигнализации.',
    sort_order: 10
  },
  {
    page_key: 'buy',
    path: '/buy',
    label: 'Оставить заявку',
    title: 'Оставить заявку | СПС МАСТЕР',
    description: 'Оставить заявку на системы пожарной сигнализации СПС МАСТЕР. Свяжемся с вами и подготовим предложение под задачи объекта.',
    sort_order: 11
  }
];

export const getPageMetaDefaults = (pageKey: string) =>
  PAGE_META_DEFAULTS.find(item => item.page_key === pageKey);
