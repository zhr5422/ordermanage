import {addProblem, queryProblem, removeProblem, updateProblem,} from "@/services/problem";

const Model = {
  namespace: 'problem',
  state: {
    problems: [],
  },
  effects: {
    * fetch({payload,callback}, {call, put}) {
      const response = yield call(queryProblem, payload);
      yield put({
        type: 'saveProblem',
        payload: response,
      });
      if(callback&&typeof callback==='function'){
        callback(response);
      }
    },
    * submit({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeProblem : updateProblem;
      } else {
        callback = addProblem;
      }
      const response = yield call(callback, payload);
      yield put({
        type: 'saveProblem',
        payload: response,
      });

    },
  },
  reducers: {
    saveProblem(state, {payload}) {
      return {...state, problems: payload}
    },
  },
};
export default Model;
