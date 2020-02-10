/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */

import {getQuickRegisterTree} from '@/services/pluginManage/pluginList';
import T from '../../utils/T';

export default {
    namespace: 'pluginList',//要唯一

    state: {
        pluginTableList: [],//插件管理表格
    },

    effects: {
        //快速注册-获取树
        * getQuickRegisterTreeAction(_, {call, put}) {
            const response = yield call(getQuickRegisterTree);
            yield put({
                type: 'getDataTree',   //这里的getDataTree对应的reducer里的getDataTree名字
                payload: response,
            });
        },
    },

    reducers: {
        getDataTree(state, action) {
            return {
                ...state,
            };
        },
    },
};
