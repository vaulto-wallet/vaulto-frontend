import { routerRedux } from 'dva/router';
import { createVault, getVaults, shareKey } from '@/services/api';

export default {
  namespace: 'userVaults',

  state: {
    keys : undefined,
    network_types : undefined,
    key_types : undefined
  },

  effects: {
    *createVault( {payload}, {call, put}  ){
        console.log("createVault model", payload)
        const response = yield call(createVault, payload);
    },

    *getVaults( {payload}, {call, put}  ){
        console.log("getVaults model", payload)
        const response = yield call(getVaults, payload);
        console.log("getKeys model response", response);
        yield put({
            type: 'setVaults',
            payload: response.result.reduce((a, b)=>(a[b.id]=b, a),{}),
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
    setVaults(state, { payload }) {
      console.log("setVaults reducer",payload);
      return {
        ...state,
        vaults: payload,
        key_types: payload.key_types,
        network_types: payload.network_types,
      };
    },
  },
};
