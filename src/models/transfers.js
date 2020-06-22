import { routerRedux } from 'dva/router';
import { createTransfer, getTransfers, createConfirmation } from '@/services/api';

export default {
  namespace: 'userTransfers',

  state: {
    transfers : undefined,
    confirmationRequired : {required : false, request : undefined}
  },

  effects: {
    *transferForm ( {payload}, {call, put}  ){
        console.log("*transferForm", payload);
        yield put({
            type: 'setTransferForm',
            payload: payload,
        });
    },

    *createTransfer( {payload}, {call, put}  ){
        const confirmation_request = {
            required : true,
            request : 1
        }
        console.log("creatTransfer model", payload);
        const response = yield call(createTransfer, payload);
    },

    *getTransfers( {payload}, {call, put}  ){
        const response = yield call(getTransfers, payload);
        console.log("*getTransfers", response)
        yield put({
            type: 'setTransfers',
            payload: response.result,
        });
    },
    *createConfirmation( {payload}, {call, put}  ){
        const response = yield call(createConfirmation, payload);
        const confirmation_request = {
            required : false,
            request : response.id
        }
    },
    *cancelConfirmation( {payload}, {call, put}  ){
        const confirmation_request = {
            required : false,
            request : undefined
        }
        yield put({
            type: 'setConfirmationRequired',
            payload: confirmation_request,
        });
    },
  },
  reducers: {
    setTransfers(state, { payload }) {
      return {
        ...state,
        transfers: payload,
      };
    },
    setConfirmationRequired(state, { payload }) {
        return {
          ...state,
          confirmationRequired: payload,
        };
      },
    setTransferForm(state, { payload }) {
        return {
          ...state,
          transferForm: payload,
        };
    },
  },
};
