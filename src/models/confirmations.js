import { routerRedux } from 'dva/router';
import { createTransfer, getTransfers } from '@/services/api';

export default {
  namespace: 'userConfirmation',

  state: {
    toConfirm : undefined
  },

  effects: {
    *toConfirm ( {payload}, {call, put}  ){
        console.log("*toConfirm", payload);
        yield put({
            type: 'setToConfirm',
            payload: payload,
        });
    },
    *confirm ( {payload}, {call, put, select}  ){

      const toConfirm = yield select(state => state.userConfirmation.toConfirm);
      let confirmed = Object.assign({}, toConfirm);
      confirmed.payload["code_2fa"] = payload.code_2fa;
      confirmed.payload["master_password"] = payload.master_password;
      console.log("*confirm", confirmed);

      yield put({
          type: 'setToConfirm',
          payload: undefined,
      });
      yield put(
        confirmed
      );
  },

  },
  reducers: {
    setToConfirm(state, { payload }) {
      return {
        ...state,
        toConfirm: payload ? { 
          type : payload.type,
          payload : payload.payload
        } : undefined,
        passwordNotRequired : payload ? payload.passwordNotRequired || false : undefined
      };
    },
  },
};
