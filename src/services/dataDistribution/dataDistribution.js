/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../../constants/EnumAPI';
import {get, post, postJSON, del, put} from './../../utils/core/requestTj';
import T from './../../utils/T';

//数据源里点击配置分发（本地）
export async function getInfoFormSource(uuid) {
    return get(EnumAPI.getInfoFormSource(uuid));
}

//新增数据分发目的地（本地）
export async function addDestination(params = {}) {
    return postJSON(EnumAPI.addDestination, params);
}

//更新数据分发目的地，put方法是更新，post方法是新增（本地）
export async function updateDestination(params = {}) {
    return put(EnumAPI.addDestination, params);
}

//数据分发目的地列表页-点击启动（启动某个数据分发目的地）（本地）
export async function runningDestination(uuid) {
    return post(EnumAPI.runningDestination(uuid));
}

//数据分发目的地列表页-点击暂停（暂停某个数据分发目的地）（本地）
export async function pauseDestination(uuid) {
    return post(EnumAPI.pauseDestination(uuid));
}

//数据分发目的地列表页-点击重启（重启某个数据分发目的地）（本地）
export async function restartDestination(uuid) {
    return post(EnumAPI.restartDestination(uuid));
}

//数据分发目的地列表页-点击恢复（恢复某个数据分发目的地）（本地）
export async function resumeDestination(uuid) {
    return post(EnumAPI.resumeDestination(uuid));
}

//数据分发目的地列表页-点击删除（删除某个数据分发目的地）（本地）
export async function deleteDestination(uuid) {
    return del(EnumAPI.deleteDestination(uuid));
}

//数据分发目的地列表页-查看数据分发基本信息（本地）
export async function getDestination(uuid) {
    return get(EnumAPI.getDestination(uuid));
}

//数据分发目的地列表页-点击编辑（编辑某个数据分发目的地）
export async function editDestination(params = {}) {
    return put(EnumAPI.editDestination, params);
}

//数据分发目的地列表页-点击查询（查询某个数据分发目的地）（本地）
export async function searchDistribute({uuid,name}) {
    return post(EnumAPI.searchDistribute({uuid,name}));
}

//分发目的地详情页-获取分发目的地详情
//数据分发目的地列表页-点击查询（查询某个数据分发目的地）（本地）
export async function getDestinationDetail(uuid) {
    return get(EnumAPI.getDestinationDetail(uuid));
}
//分发目的地详情页-重启运行状态里的任务
export async function restartDestinationChild({id,taskId}) {
    return post(EnumAPI.restartDestinationChild({id,taskId}));
}
//根据数据分发id获取每分钟速率
export async function getDetailLineDataBySinkId(uuid, params={}) {
    return get(EnumAPI.getDetailLineDataBySinkId(uuid), params);
}
//分发 - 激活数据目的地
export async function activateSinkProcessor(uuid) {
    return post(EnumAPI.activateSinkProcessor(uuid));
}

//数据源里点击配置分发（远程）
export async function getInfoFormClusterSource(uuid) {
    return get(EnumAPI.getInfoFormClusterSource(uuid));
}

//新增数据分发目的地（远程）
export async function addClusterDestination(params = {}) {
    return postJSON(EnumAPI.addClusterDestination, params);
}
//更新数据分发目的地，put方法是更新，post方法是新增（远程）
export async function updateClusterDestination(params = {}) {
    return put(EnumAPI.addClusterDestination, params);
}

//数据分发目的地列表页-查看数据分发基本信息（远程）
export async function getClusterDestination(uuid) {
    return get(EnumAPI.getClusterDestination(uuid));
}

//数据分发目的地列表页-点击删除（删除某个数据分发目的地）（远程）
export async function deleteClusterDestination(uuid) {
    return del(EnumAPI.deleteClusterDestination(uuid));
}

//数据分发目的地列表页-点击启动（启动某个数据分发目的地）（远程）
export async function runningClusterDestination(uuid) {
    return post(EnumAPI.runningClusterDestination(uuid));
}

//数据分发目的地列表页-点击暂停（暂停某个数据分发目的地）（远程）
export async function pauseClusterDestination(uuid) {
    return post(EnumAPI.pauseClusterDestination(uuid));
}

//数据分发目的地列表页-点击恢复（恢复某个数据分发目的地）（远程）
export async function resumeClusterDestination(uuid) {
    return post(EnumAPI.resumeClusterDestination(uuid));
}

//数据分发目的地列表页-点击重启（重启某个数据分发目的地）（远程）
export async function restartClusterDestination(uuid) {
    return post(EnumAPI.restartClusterDestination(uuid));
}

//分发目的地详情页-获取分发目的地详情
//数据分发目的地列表页-点击查询（查询某个数据分发目的地）（远程）
export async function getClusterDestinationDetail(uuid) {
    return get(EnumAPI.getClusterDestinationDetail(uuid));
}
//分发目的地详情页-重启运行状态里的任务（远程）
export async function restartClusterDestinationChild({id,taskId}) {
    return post(EnumAPI.restartClusterDestinationChild({id,taskId}));
}
//数据分发目的地列表页-点击查询（查询某个数据分发目的地）（远程）
export async function searchClusterDistribute({uuid,name}) {
    return post(EnumAPI.searchClusterDistribute({uuid,name}));
}
