/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../../constants/EnumAPI';
import {get, post, postJSON, del, put} from './../../utils/core/requestTj';
import T from './../../utils/T';

//获取首页统计数据
export async function fetchDashboardTopData(params = {}) {
    return get(EnumAPI.fetchDashboardTopData, params);
}

//获取首页折线图数据
export async function fetchChartLineData(params = {}) {
    return get(EnumAPI.fetchChartLineData, params);
}