/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../../constants/EnumAPI';
import {postJSON, post, get} from './../../utils/core/requestTj';
import T from './../../utils/T';

//信息录入
export async function addInfo(params = {}) {
    return postJSON(EnumAPI.addInfo, params);
}