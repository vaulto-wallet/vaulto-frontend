import { routerRedux } from 'dva/router';
import { createKey, getKeys, shareKey } from '@/services/api';

export default {
  namespace: 'userKeys',

  state: {
    keys : undefined,
    network_types : undefined,
    key_types : undefined
  },

  effects: {
    *createKey( {payload}, {call, put}  ){
        console.log("createKey model", payload)
        const response = yield call(createKey, payload);
    },

    *getKeys( {payload}, {call, put}  ){
        console.log("getKeys model", payload)
        const response = yield call(getKeys, payload);
        console.log("getKeys model response", response);
        yield put({
            type: 'setKeys',
            payload: response,
        });
    },
    *shareKey( {payload}, {call, put}  ){
      console.log("shareKey model", payload)
      const response = yield call(shareKey, payload);
      console.log("shareKey model response", response);
      yield put({
          type: 'getKeys',
          payload: response,
      });
  },
},

  reducers: {
    setKeys(state, { payload }) {
      console.log("setAccount reducer",payload);
      return {
        ...state,
        keys: payload.keys,
        key_types: payload.key_types,
        network_types: payload.network_types,
      };
    },
  },
};
