export default [
  {
    path: '/register/',
    component: require('./components/pages/register.vue')
  },
  {
    path: '/connection/',
    component: require('./components/pages/connection.vue')
  },
  {
    path: '/login/',
    component: require('./components/pages/login.vue')
  },
  {
    path: '/setting/',
    component: require('./components/pages/setting.vue')
  },
  {
    path: '/popup/photoEdit/',
    component: require('./components/popup/photoEdit.vue')
  },
  {
    path: '/request/',
    component: require('./components/pages/request.vue')
  },
  {
    path: '/requested/',
    component: require('./components/pages/requested.vue')
  },
  {
    path: '/letter_W/',
    component: require('./components/pages/letterWrite.vue')
  },
  {
    path: '/letter_R',
    component: require('./components/pages/letterRead.vue')
  },
  {
    path: '/popup/choice/',
    component: require('./components/popup/letterSkin.vue')
  },
  {
    path: '/',
    component: require('./App.vue')
  }
]
