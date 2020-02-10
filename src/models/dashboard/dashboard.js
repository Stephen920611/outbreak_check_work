/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */

import {routerRedux} from 'dva/router';
import {
    fetchDashboardTopData,
    fetchChartLineData,
} from '@/services/dashboard/dashboard';
import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import T from '../../utils/T';

export default {
    namespace: 'dashboard',//要唯一

    state: {
        /*------------ 数据分发页面 ----------------*/
        dataSourceCount: '-',   //数据源个数
        dataResourceCount: '-',   //数据资源个数
        taskCount: '-',   //任务总数
        runTaskCount: '-',   //正在运行任务个数
        pieData: [],    //饼图数据
        pieTotal: '-',    //饼图数据总量
        dataInTableData: [],    //数据接入任务速度排名数据
        chartLineData: [],    //折线图数据
    },

    effects: {
        //获取首页统计数据
        * fetchDashboardTopDataAction(_, {put, call}) {
            const response = yield call(fetchDashboardTopData);
            if (response.result === 'true') {
                let returnData = response.data;
                //饼图数据
                let pieData = [];
                //饼图返回的key值
                let pieKeys = T.lodash.keys(returnData.sourceTypeCount);
                //饼图的总数量
                let pieTotal = 0;
                //遍历
                pieKeys.map( val => {
                    pieTotal += returnData.sourceTypeCount[val];
                    pieData.push({
                        x: val,
                        y: returnData.sourceTypeCount[val],
                        name:val,
                        value:returnData.sourceTypeCount[val],
                    })
                });
                let tableData = returnData.dataInTopicMonitor.map( (item,idx) => {
                    return {
                        ...item,
                        index: idx + 1,
                        key: idx + 1,
                    }
                });
                yield put({
                    type: 'setDashboardTopData',
                    dashboardTopData: {
                        ...response.data,
                        pieData,
                        pieTotal,
                        tableData
                    },
                });
            } else {
                T.prompt.error(response.message);
            }
        },

        //获取首页折线图数据
        * fetchChartLineDataAction({params}, {put, call}) {
            const response = yield call(fetchChartLineData, params);
            if (response.result === 'true') {
                yield put({
                    type: 'setChartLineData',
                    chartLineData: response.data
                });
            } else {
                T.prompt.error(response.message);
            }
        },
    },

    reducers: {
        //设置数据源列表
        setDashboardTopData(state, {dashboardTopData}) {
            return {
                ...state,
                dataSourceCount: dashboardTopData.dataSourceCount,
                dataResourceCount: dashboardTopData.dataResourceCount,
                taskCount: dashboardTopData.taskCount,
                runTaskCount: dashboardTopData.runTaskCount,
                pieData: dashboardTopData.pieData,
                pieTotal: dashboardTopData.pieTotal,
                dataInTableData: dashboardTopData.tableData,
            };
        },
        //设置首页折线图数据
        setChartLineData(state, {chartLineData}) {
            return {
                ...state,
                chartLineData
            };
        },
    },
};
