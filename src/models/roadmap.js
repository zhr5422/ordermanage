import {
  addFlow,
  addRoadmap,
  queryFlow,
  queryRoadmap,
  removeFlow,
  removeRoadmap,
  updateFlow,
  updateRoadmap,
} from '@/services/roadmap'

const Model = {
  namespace: 'roadmap',
  state: {
    flow: [],
    roadmap: []
  },
  effects: {
    * fetchRoadmap({payload}, {call, put}) {
      const response = yield call(queryRoadmap, payload);
      yield  put({
        type: "saveRoadmap",
        payload: response
      })
    },
    * fetchFlow({payload}, {call, put}) {
      const response = yield call(queryFlow, payload);
      yield  put({
        type: "saveFlow",
        payload: response
      })
    },
    * submitRoadmap({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeRoadmap : updateRoadmap;
      } else {
        callback = addRoadmap;
      }
      yield call(callback, payload);
      yield put({
        type: 'fetchRoadmap',
      });
    },

    * submitFlow({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFlow : updateFlow;
      } else {
        callback = addFlow;
      }
      yield call(callback, payload);
      yield put({
        type: 'fetchFlow',
      });
    },
  },
  reducers: {
    saveRoadmap(state, {payload}) {
      return {...state, roadmap: payload}
    },
    saveFlow(state, {payload}) {
      return {...state, flow: payload}
    }
  },
};
export default Model;
