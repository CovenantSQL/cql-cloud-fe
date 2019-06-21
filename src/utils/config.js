module.exports = {
  siteName: 'Covenant Cloud',
  copyright: 'Covenant Cloud  © 2019 CovenantLabs',
  logoPath: '/logo.svg',
  apiEndpoint:
    process.env.NODE_ENV === 'development' ? '' : '//stg-api.covenantsql.io',
  apiPrefix: process.env.NODE_ENV === 'development' ? '/api/v1' : '/v3',
  loginClientID:
    process.env.NODE_ENV === 'development' ? '' : 'Iv1.3d8508c548b90714',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/(login|callback|wallets)/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      // {
      //   key: 'pt-br',
      //   title: 'Português',
      //   flag: '/brazil.svg',
      // },
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'en',
  },
}
