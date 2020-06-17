import { queryCurrent, queryUsers } from '@/services/api';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      console.log("fetchCurrent")
      const response = yield call(queryCurrent);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      yield put({
        type: 'saveCurrentUser',
        payload: response.result,
      });

    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      console.log("saveCurrent", state, action);
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
