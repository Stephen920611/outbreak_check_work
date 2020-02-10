/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../../constants/EnumAPI';
import {postJSON, post} from './../../utils/core/requestTj';
import T from './../../utils/T';

export async function fetchStatisticsList(params = {}) {
    return postJSON(EnumAPI.fetchStatisticsList, params);
}
