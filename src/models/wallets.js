import { routerRedux } from 'dva/router';
import { getAddress, getAddresses, validateAddress, getWallets} from '@/services/api';


export default {
  namespace: 'userWallets',

  state: {
    current_key : null,
    validated : {}
  },

  effects: {
    *setCurrentKey( {payload}, {call,put, dispatch} ){
      console.log("setCurrentKey", payload);
      yield put({
        type: 'setCurrentWallet',
        payload: payload,
      });
      yield put({
        type: 'getCurrentKeyInfo',
        payload: {},
      });

    },

    *getWallets( {payload}, {call, put}  ){
      console.log("getWallets model", payload)
      const response = yield call(getWallets, payload);
      console.log("getWallets model response", response);
      
      yield put({
        type: "setWallets",
        payload : response.result.reduce((a,b)=>(a[b.id]=b, a),{})
      });
  },

    *getCurrentKeyInfo( {payload}, {call,put, select} ){
      console.log("getCurrentKeyInfo");
      const current_key = yield select(state => state.userWallets.current_key);

      console.log("getCurrentKeyInfo", current_key);
      const response = yield call(getAddresses, current_key);
      console.log("getCurrentKeyInfo", response.result);
      yield put({
        type: 'setCurrentWalletAddresses',
        payload: response.result.reduce((a,b)=>(a[b.id]=b, a),{}),
      });
    },
    *getAddress( {payload}, {call, put}  ){
        console.log("getAddress model", payload)
        const response = yield call(getAddress, payload);
        console.log("getAddress model response", response);
        
        yield put({
          type: "getCurrentKeyInfo",
          payload : {}
        });
    },
    *validateAddress( {payload}, {call, put}  ){
      console.log("validateAddress model", payload)
      const response = yield call(validateAddress, payload);
      console.log("validateAddress model response", response);
      
      yield put({
        type: "setValidatedAddress",
        payload : response
      });
  },
},

  reducers: {
    setWallets(state, { payload }) {
      console.log("setWallets reducer",payload);
      return {
        ...state,
        wallets: payload,
      };
    },
    setCurrentWallet(state, { payload }) {
      console.log("setCurrentWallet reducer",payload);
      return {
        ...state,
        current_key: payload,
      };
    },
    setCurrentWalletAddresses(state, { payload }) {
      console.log("setCurrentAddresses reducer",payload);
      return {
        ...state,
        addresses: payload,
      };
    },
    setValidatedAddress(state, { payload }) {
      console.log("setCurrentAddresses reducer",payload);
      return {
        ...state,
        validated: Object.assign(payload, state.validated),
      };
    },
  },
};
