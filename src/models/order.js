import {addOrder, queryNeedDemo, queryOrder, removeOrder, updateOrder,changeDeadline} from '@/services/order';
import {Button, message, notification} from "antd";
import React from "react";
import {routerRedux} from "dva/router";
import {Link} from 'umi'

const Model = {
  namespace: 'order',
  state: {
    order: [],
    currentOrder: {},
  },

  effects: {
    * fetch({payload, callback}, {call, put}) {
      const response = yield call(queryOrder, payload);
      yield put({
        type: 'saveOrder',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
    * needdemo({payload, callback}, {call, put}) {
      const response = yield  call(queryNeedDemo, payload);
      if (callback && typeof callback === 'function')
        callback(response);
    },
    *deadline({payload,outcallback},{call,put}){
      const response = yield  call(changeDeadline, payload);
      yield put({
        type: 'saveOrder',
        payload: response,
      })
      if(outcallback&&typeof outcallback==='function'){
        outcallback();
      }
    },
    * submit({payload, outcallback}, {call, put}) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeOrder : updateOrder;
      } else {
        callback = addOrder;
      }
      const response = yield call(callback, payload);
      yield put({
        type: 'saveOrder',
        payload: response,
      });
      if (callback === removeOrder) {
        yield put(routerRedux.push('/orders'))
      }
      if (outcallback && typeof outcallback === 'function') {
        outcallback();
      }
      if (response.result) {
            message.info(response.result)
        }
      }
    ,
    },
    reducers: {
      saveOrder(state, {payload}) {
        if (Array.isArray(payload))
          return {...state, order: payload};
        return {...state, currentOrder: payload}
      },

    },

  };
export default Model;
