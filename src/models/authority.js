import {queryAuthorities} from '@/services/authority'
const Model = {
  namespace: 'authority',
  state: {
    authorities: [],
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryAuthorities);
      yield put({
        type: 'saveAuthorities',
        payload: response,
      })
    },

  },
  reducers: {
    saveAuthorities(state, {payload}) {
      return {...state, authorities: payload}
    }
  }
}
export default Model
