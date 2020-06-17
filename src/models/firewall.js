import { routerRedux } from 'dva/router';
import { getFirewallRules, setFirewallRule, addFirewallRule} from '@/services/api';


export default {
  namespace: 'userFirewall',

  state: {
    current_key : null
  },

  effects: {
    *setFirewallRule( {payload}, {call,put, dispatch} ){
      console.log("setFirewallRule", payload);
      const response = yield call(setFirewallRule, payload);
      yield put({
        type: 'userWallets/getCurrentKeyInfo',
        payload: {},
      });
    },

    *addFirewallRule( {payload}, {call,put, dispatch} ){
      console.log("setFirewallRule", payload);
      const response = yield call(addFirewallRule, payload);
      yield put({
        type: 'userWallets/getCurrentKeyInfo',
        payload: {},
      });
    },

    *getFirewallRules( {payload}, {call,put, select} ){
      console.log("getFirewallRules");
      const current_key = yield select(state => state.userWallets.current_key);

      console.log("getFirewallRules", current_key);
      const response = yield call(getFirewallRules, current_key);
      console.log("getFirewallRules", response);
      yield put({
        type: 'setFirewallRules',
        payload: response,
      });



    },
  },

  reducers: {
  },
};
