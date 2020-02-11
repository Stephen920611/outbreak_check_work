/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */

import {fetchMemberInfo} from '@/services/checkRecord/checkRecord';
import T from '../../utils/T';

export default {
    namespace: 'checkRecord',//要唯一

    state: {
        statisticsList: [
            {
                key: 1,
                totalNum: 10,
                returnNum: 20,
                closeContactsNum: 30,
                partyNum: 40,
                keyEpidemicAreasNum: 50,
                abnormalPhysicalConditionsNum: 60,
                quarantinedOnThatDayNum: 70,
                isolatedTotalNum: 80,
                quarantinedAtHomeOnThatDayNum: 90,
                atHomeTotalNum: 100,
            }
        ],//插件管理表格
    },

    effects: {
        //获取人员基本信息
        * fetchMemberInfoAction({id, resolve, reject}, {call, put}) {
            try {
                const response = yield call(fetchMemberInfo, id);
                resolve(response);
                // if (response.code === 0) {
                //     yield put({
                //         type: 'setStatisticsList',   //这里的getDataTree对应的reducer里的getDataTree名字
                //         statisticsList: response.data,
                //     });
                // }
            } catch (error) {
                reject(error);
            }

        },
    },

    reducers: {
        setStatisticsList(state, {statisticsList}) {
            return {
                ...state,
                statisticsList
            };
        },
    },
};
