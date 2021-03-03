import {addCompany, queryCompany, removeCompany, updateCompany} from "@/services/company";

const Model = {
  namespace: 'company',
  state: {
    company: [],
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryCompany);
      yield put({
        type: 'saveCompany',
        payload: response,
      });
    },
    * submit({payload}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeCompany : updateCompany;
      } else {
        callback = addCompany;
      }
      yield call(callback, payload);
      yield put({
        type: 'fetch',
      });
    },
  },
  reducers: {
    saveCompany(state, {payload}) {
      return {...state, company: payload};
    },
  },
};
export default Model;
