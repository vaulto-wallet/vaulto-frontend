import { routerRedux } from 'dva/router';
import { createAccount, getAccount, getOTP, confirmOTP } from '@/services/api';

export default {
  namespace: 'userAccount',

  state: {
    status: undefined,
    account : undefined
  },

  effects: {
    *fetchWallets( {payload}, {call, put}){


    },
    *createAccount( {payload}, {call, put}  ){
        console.log("createAccount model", payload)
        const response = yield call(createAccount, payload);
    },

    *getAccount( {payload}, {call, put}  ){
        console.log("getAccount model", payload)
        const response = yield call(getAccount, payload);
        console.log("getAccount model response", response);
        yield put({
            type: 'setAccount',
            payload: response,
        });
    },
    *getOTP( {payload}, {call, put}  ){
      console.log("getOTP model", payload)
      const response = yield call(getOTP, payload);
      console.log("getOTP model response", response);
      yield put({
          type: 'setOTP',
          payload: response,
      });
    },
    *confirmOTP( {payload}, {call, put}  ){
      console.log("confirmOTP model", payload)
      const response = yield call(confirmOTP, payload);
      console.log("confirmOTP model response", response);
      yield put({
          type: 'getOTP',
          payload: response,
      });
    },


  },

  reducers: {
    setAccount(state, { payload }) {
      console.log("setAccount reducer",payload);
      return {
        ...state,
        account: payload.account,
      };
    },
    setOTP(state, { payload }) {
      console.log("setOTP reducer",payload);
      return {
        ...state,
        otp: payload,
      };
    },
  },
};
