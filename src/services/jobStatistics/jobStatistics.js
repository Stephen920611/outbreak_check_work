/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../../constants/EnumAPI';
import {postJSON, post, get} from './../../utils/core/requestTj';
import T from './../../utils/T';

//获取摸排工作统计页面
export async function fetchJobStatisticsList(params = {}) {
    return post(EnumAPI.fetchJobStatisticsList, params);
}