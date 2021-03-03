import {addType, queryType, removeType, updateType} from "@/services/type";

const Model = {
  namespace: 'type',
  state: {
    type: [],
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryType);
      yield put({
        type: 'saveType',
        payload: response,
      });
    },
    * submit({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeType : updateType;
      } else {
        callback = addType;
      }
      yield call(callback, payload);
      yield put({
        type: 'fetch',
      });
    },
  },
  reducers: {
    saveType(state, {payload}) {
      return {...state, type: payload};
    },
  },
};
export default Model;
