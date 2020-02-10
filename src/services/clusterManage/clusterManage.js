import EnumAPI from './../../constants/EnumAPI';
import {get, post, postJSON, del, put} from './../../utils/core/requestTj';
import T from './../../utils/T';


//集群管理 - 获取数据平台列表
export async function fetchClusterManageListServices(params = {}) {
    return get(EnumAPI.fetchClusterManageListAPI, params);
}
//fetchSynchronizationServices
export async function fetchSynchronizationServices(params = {}) {
    return get(EnumAPI.fetchSynchronizationAPI, params);
}
//集群管理 - 删除数据平台
/*export async function deleteDataPlatformServices(params = {}) {
    return del(EnumAPI.deleteDataPlatformAPI, params);
}*/

//消息管理 - 获取首页统计数据
export async function fetchMessageListServices(params = {}) {
    return get(EnumAPI.fetchMessageListAPI, params);
}
//消息管理 - 审批状态修改
export async function fetchMessageStatueServices(params = {}) {
    return post(EnumAPI.fetchMessageStatueAPI, params);
}
//消息管理 - 删除消息
/*
export async function deleteMessageServices(params = {}) {
    return post(EnumAPI.deleteMessageAPI, params);
}*/

