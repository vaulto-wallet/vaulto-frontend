import { routerRedux } from 'dva/router';
import { getAccounts, userList, createGroups, getWorkerStatus, createWorker, userDelete } from '@/services/api';

export default {
  namespace: 'userAccounts',

  state: {
    accounts : undefined,
  },

  effects: {
    *getAccounts( {payload}, {call, put}  ){
        console.log("getAccounts model", payload)
        const response = yield call(getAccounts, payload);
        console.log("getAccounts model response", response);
        yield put({
            type: 'setAccounts',
            payload: response.result.reduce((a,b)=>(a[b.id]=b,a),{}),
        });
    },
    *getUsers( {payload}, {call, put}  ){
      console.log("getUsers model", payload)
      const response = yield call(userList, payload);
      console.log("getUsers model response", response);
      yield put({
          type: 'setUsers',
          payload: response,
      });
    },
    *createGroups( {payload}, {call, put} ){
      console.log("createGroups model", payload)
      const response = yield call(createGroups, payload);
      yield put({
        type: 'getUsers',
        payload: response,
      });
    },
    *getWorkerStatus( {payload}, {call, put} ){
      console.log("getWorkerStatus", payload)
      const response = yield call(getWorkerStatus, payload);
      yield put({
        type: 'setWorkerStatus',
        payload: response,
      });
    },
    *createWorker( {payload}, {call, put} ){
      console.log("createWorker model", payload)
      const response = yield call(createWorker, payload);
      yield put({
        type: 'getWorkerStatus',
        payload: response,
      });
    },
    *deleteUser( {payload}, {call, put} ){
      console.log("deleteUser model", payload)
      const response = yield call(userDelete, payload);
      yield put({
        type: 'getUsers',
        payload: response,
      });
    }

},

  reducers: {
    setAccounts(state, { payload }) {
      console.log("setAccounts reducer",payload);
      return {
        ...state,
        accounts: payload,
      };
    },
    setUsers(state, { payload }) {
      console.log("setUsers reducer",payload);
      return {
        ...state,
        users: payload.users,
        groups: payload.groups,
      };
    },
    setWorkerStatus(state, { payload }) {
      console.log("setWorkerStatus reducer",payload);
      return {
        ...state,
        worker: payload.worker,
      };
    }, 
  },
};
