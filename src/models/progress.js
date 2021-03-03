import {addProgress, queryProgress, removeProgress, updateProgress,} from "@/services/progress";

const Model = {
  namespace: 'progress',
  state: {
    progress: [],
  },

  reducers: {
    saveProgress(state, {payload}) {
      return {...state, progress: payload}
    },
  },
  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryProgress, payload);
      yield put({
        type: 'saveProgress',
        payload: response,
      })
    },
    * submit({payload, outcallback}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeProgress : updateProgress;
      } else {
        callback = addProgress;
      }
      const response = yield call(callback, payload);
      yield put({
        type: 'saveProgress',
        payload: response,
      });
      if (outcallback && typeof outcallback === 'function')
        outcallback();
    },
  },
};
export default Model;
