import {stringify} from 'querystring';
import {history} from 'umi';
import {accountLogin, accountLogout} from '@/services/login';
import {setAuthority} from '@/utils/authority';
import {getPageQuery} from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    userid: '',
  },
  effects: {
    * login({payload}, {call, put}) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {redirect} = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
      yield put({
        type:'user/saveAuthority',
        payload:response.authority
      })

    },

    * logout(_, {call, put}) {
      const {redirect} = getPageQuery(); // Note: There may be security issues, please note
      yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {authority: ""},
      }); // Login successfully
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      let authority=payload.authority?payload.authority.map(item=>item.eName):'';
      setAuthority(authority);
      return {...state, status: payload.status, userid: payload.userid};
    },
  },
};
export default Model;
