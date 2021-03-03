import {addDemo, queryDemo, removeDemo, updateDemo} from "@/services/demo";

const Model = {
  namespace: 'demo',
  state: {
    demos: [],
    currentDemo: {},
  },
  effects: {
    * fetch({payload,callback}, {call, put}) {
      const response = yield call(queryDemo, payload);
      if (Array.isArray(response))
        yield put({
          type: 'saveDemos',
          payload: response,
        });
      else
        yield put({
          type: 'saveDemo',
          payload: response,
        });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
    * submit({payload, outcallback}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeDemo : updateDemo;
      } else {
        callback = addDemo;
      }
      const response = yield call(callback, payload);
      if (Array.isArray(response))
        yield put({
          type: 'saveDemos',
          payload: response,
        });
      else
        yield put({
          type: 'saveDemo',
          payload: response,
        });
      if (outcallback && typeof outcallback === 'function') {
        outcallback();
      }
    },
  },
  reducers: {
    saveDemos(state, {payload}) {
      return {...state, demos: payload};
    },
    saveDemo(state, {payload}) {
      return {...state, currentDemo: payload};
    },
  },
};
export default Model;
