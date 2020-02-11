/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../../constants/EnumAPI';
import {postJSON, get} from './../../utils/core/requestTj';
import T from './../../utils/T';

export async function fetchMemberInfo(id) {
    return get(EnumAPI.fetchMemberInfo(id) );
}
