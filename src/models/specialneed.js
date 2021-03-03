import {
  addSpecialNeed,
  querySpecialNeed,
  querySpecialNeedByFigure,
  removeSpecialNeed,
  updateSpecialNeed,
} from "@/services/specialneed";

const Model = {
  namespace: 'specialneed',
  state: {
    specialneed: [],
  },
  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(querySpecialNeed, payload);
      yield put({
        type: 'saveSpecialNeed',
        payload: response
      })
    },
    *fetchByFigure({payload}, {call, put}){
      const response = yield call(querySpecialNeedByFigure, payload);
      yield put({
        type: 'saveSpecialNeed',
        payload: response
      })
    },
    * submit({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeSpecialNeed : updateSpecialNeed;
      } else {
        callback = addSpecialNeed;
      }
      yield call(callback, payload);
      yield put({
        type: 'fetch',
      });
    },

  },
  reducers: {
    saveSpecialNeed(state, {payload}) {
      return {...state, specialneed: payload}
    }
  },
};
export default Model;
