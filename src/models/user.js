import {
  addUser,
  editInformation,
  editPassword,
  query as queryUsers,
  queryCraftMan,
  queryCurrent,
  queryWelcome,
  removeUser,
  updateUser
} from '@/services/user';
import {message} from "antd";


const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    users: [],
    craftMan: [],
    welcome: {},
    authority:[],
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryUsers);
      yield put({
        type: 'saveUsers',
        payload: response,
      });
    },
    * welcome(_, {call, put}) {
      const response = yield  call(queryWelcome);
      yield put({
        type: 'saveWelcome',
        payload: response
      });
    },
    * submit({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeUser : updateUser;
      } else {
        callback = addUser;
      }
      yield call(callback, payload);
      yield put({
        type: 'fetch',
      });
    },
    * fetchCraftMan(_, {call, put}) {
      const response = yield call(queryCraftMan);
      yield  put({
        type: 'saveCraftMan',
        payload: response
      })
    },
    * fetchCurrent({callback}, {call, put}) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback();
      }
    },

    * updateInformation({payload}, {call}) {
      const response = yield call(editInformation, payload);
      if (response === 1)
        message.success("操作成功")
    },
    * updatePassword({payload}, {call}) {
      const response = yield call(editPassword, payload);
      if (response === 1)
        message.success('修改成功');
      else
        message.error('修改失败')
    }
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {...state, currentUser: action.payload || {}};
    },
    saveUsers(state, {payload}) {

      return {...state, users: payload}
    },
    saveCraftMan(state, {payload}) {
      return {...state, craftMan: payload}
    },
    saveWelcome(state, {payload}) {
      return {...state, welcome: payload}
    },
    saveAuthority(state,{payload}){
      let authority=payload?payload.map(item=>item.eName):'';
      return {...state,authority}
    }
  },
};
export default UserModel;
