import { routerRedux } from 'dva/router';
import { createAsset, getAssets } from '@/services/api';

export default {
  namespace: 'userAssets',

  state: {
    assets : {},
    assets_types : undefined
  },

  effects: {
    *createAsset( {payload}, {call, put}  ){
        console.log("createAsset model", payload)
        const response = yield call(createAsset, payload);
    },

    *getAssets( {payload}, {call, put}  ){
        console.log("getAssets model", payload)
        const response = yield call(getAssets, payload);
        console.log("getAssets model response", response);
        yield put({
            type: 'setAssets',
            payload: response.result.reduce((a,b)=> (a[b.id]=b,a),{})
        });
    },
  },

  reducers: {
    setAssets(state, { payload }) {
      console.log("setAssets reducer",payload);
      return {
        ...state,
        assets: payload,
        assets_types: ["Basic", "ERC20"]
      };
    },
  },
};
