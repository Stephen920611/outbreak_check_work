/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */

import {fetchStatisticsList} from '@/services/touchStatisticsPage/touchStatisticsPageList';
import T from '../../utils/T';

export default {
    namespace: 'touchStatisticsPageList',//要唯一

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
        //快速注册-获取树
        * fetchStatisticsListAction(params, {call, put}) {
            console.log(params,'params');
            try {
                const response = yield call(fetchStatisticsList, params);
                if (response.code === 0) {
                    yield put({
                        type: 'setStatisticsList',   //这里的getDataTree对应的reducer里的getDataTree名字
                        statisticsList: response.data,
                    });
                }

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
