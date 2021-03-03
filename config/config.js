// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history:{type:'hash'},
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    }, {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [{
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: '欢迎',
              icon: 'smile',
              component: './Welcome',
            },
            {
              name: '添加订单',
              icon: 'PlusOutlined',
              path: '/order/add',
              authority: ['wdzdd', 'admin'],
              component: './AddOrder',
            },
            {
              name: '订单浏览',
              icon: 'UnorderedListOutlined',
              path: '/orders',
              component: './BrowseOrder',
            },
            {
              name: '订单详情',
              hideInMenu: true,
              path: '/order/:order',
              component: './DescriptionOrder',
            },
            {
              name: '首件浏览',
              icon: 'BulbOutlined',
              path: '/demos',
              component: './BrowseDemo',
            },
            {
              name: '首件详情',
              hideInMenu: true,
              path: '/demo/:demo',
              component: './DescriptionDemo',
            },
            {
              name:'问题浏览',
              icon:'ExceptionOutlined',
              path:'/problems',
              component:'./BrowseProblem',
            },
            {
              path: '/account',
              name: '个人设置',
              icon: 'UserOutlined',
              component: './user/AccountSetting',
            }, {
              path: '/about',
              name: '关于网站',
              hideInMenu:true,
              component: './About',
            },{
              path: '/admin',
              name: '数据配置',
              icon: 'SettingOutlined',
              authority: ['admin','wdzdd','wdzgy'],
              routes:[
                {
                  path: '/admin/company',
                  name: '外协单位',
                  icon: 'BlockOutlined',
                  component: './Admin/Company',
                },
                {
                  path: '/admin/ordertype',
                  name: '订单类型',
                  icon: 'BlockOutlined',
                  component: './Admin/OrderType',
                },
                {
                  path: '/admin/roadmap',
                  name: '工艺路线',
                  icon: 'BlockOutlined',
                  component: './Admin/RoadMap',
                },
                {
                  path: '/admin/specialneed',
                  name: '特殊要求',
                  icon: 'BlockOutlined',
                  component: './Admin/SpecialNeed',
                },
                {
                  path: '/admin/user',
                  name: '人员管理',
                  icon: 'BlockOutlined',
                  component: './Admin/User',
                  // authority: ['admin'],
                },
              ]
            }, {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
