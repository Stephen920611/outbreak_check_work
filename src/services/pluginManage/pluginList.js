/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../../constants/EnumAPI';
import {get, post} from './../../utils/core/requestTj';
import T from './../../utils/T';

export async function getQuickRegisterTree(params = {}) {
    return get(EnumAPI.getQuickRegisterDataTree, params);
}
