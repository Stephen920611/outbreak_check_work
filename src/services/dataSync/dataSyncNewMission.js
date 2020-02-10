/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../../constants/EnumAPI';
import {get, post, postJSON, del} from './../../utils/core/requestTj';
import T from './../../utils/T';

//获取数据源列表(本地)
export async function fetchSourceProcessorsList(params = {}) {
    return get(EnumAPI.fetchSourceProcessorsList, params);
}
//fetchClusterSourceProcessorsListServices
//获取数据源列表(远程)
export async function fetchClusterSourceProcessorsListServices(params = {}) {
    return get(EnumAPI.fetchClusterSourceProcessorsListAPI, params);
}

//获取输入数据源插件列表
export async function fetchDataSourcePlugins(params = {}) {
    return post(EnumAPI.fetchDataSourcePluginsAPI, params);
}


//数据详情页 - 获取数据源详情(本地)
export async function fetchDataOriginDetail(uuid) {
    return get(EnumAPI.fetchDataOriginDetail(uuid));
}

//删除数据源processors（本地）
export async function deleteSourceProcessor(uuid) {
    return del(EnumAPI.deleteSourceProcessor(uuid));
}

//激活数据源（本地）
export async function activateSourceProcessor(uuid) {
    return post(EnumAPI.activateSourceProcessor(uuid));
}

//开始数据源（本地）
export async function resumeSourceProcessor(uuid) {
    return post(EnumAPI.resumeSourceProcessor(uuid));
}

//暂停数据源（本地）
export async function pauseSourceProcessor(uuid) {
    return post(EnumAPI.pauseSourceProcessor(uuid));
}

//重启数据源（本地）
export async function restartSourceProcessor(uuid) {
    return post(EnumAPI.restartSourceProcessor(uuid));
}

//数据详情页 - 获取数据源详情(远程)
export async function fetchClusterDataOriginDetail(uuid) {
    return get(EnumAPI.fetchClusterDataOriginDetail(uuid));
}

//删除数据源processors（远程）
export async function deleteClusterSourceProcessor(uuid) {
    return del(EnumAPI.deleteClusterSourceProcessor(uuid));
}

//激活数据源(远程)
export async function activateClusterSourceProcessor(uuid) {
    return post(EnumAPI.activateClusterSourceProcessor(uuid));
}

//开始数据源（远程）
export async function resumeClusterSourceProcessor(uuid) {
    return post(EnumAPI.resumeClusterSourceProcessor(uuid));
}

//暂停数据源（远程）
export async function pauseClusterSourceProcessor(uuid) {
    return post(EnumAPI.pauseClusterSourceProcessor(uuid));
}

//重启数据源（远程）
export async function restartClusterSourceProcessor(uuid) {
    return post(EnumAPI.restartClusterSourceProcessor(uuid));
}

//重启详情页面运行状态的任务
export async function restartProcessorDetailTask(uuid, taskId) {
    return post(EnumAPI.restartProcessorDetailTask(uuid, taskId));
}

//保存数据源配置
export async function saveSourceConfig(params = {}) {
    return postJSON(EnumAPI.saveSourceConfig, params);
}

//根据id获取每分钟速率
export async function getDetailLineDataById(uuid, params = {}) {
    return get(EnumAPI.getDetailLineDataById(uuid), params);
}



//dataSyncSaveQuickRegister
//数据源配置 - 新建数据源（提交功能）（待定）
export async function dataSyncSaveQuickRegister(params = {}) {
    return postJSON(EnumAPI.dataSyncSaveQuickRegister, params);
}

//dataSyncSaveQuickRegister
//数据源配置 - 新建数据源（提交功能）
export async function dataSyncSaveQuickRegisterDestination(params = {}) {
    return postJSON(EnumAPI.dataSyncSaveQuickRegisterDestination, params);
}

export async function getDataSourceListDestinationServices(params = {}) {
    return get(EnumAPI.getDataSourceListDestinationServices, params);
}

/*------------ 数据接入-远程数据接入 ----------------*/
//数据接入-远程数据接入-获取平台资源列表
export async function fetchRemoteClusterResourceList(params = {}) {
    return get(EnumAPI.fetchRemoteClusterResourceList, params);
}
//数据接入-远程数据接入-获取某一资源的元数据信息
export async function fetchRemoteClusterDataFieldList(params = {}) {
    return get(EnumAPI.fetchRemoteClusterDataFieldList, params);
}
//数据接入-远程数据接入-激活
export async function activateRemoteResource(params = {}) {
    return post(EnumAPI.activateRemoteResource, params);
}
//数据接入-远程数据接入-向远程集群申请接入资源
export async function applyRemoteResource(params = {}) {
    return post(EnumAPI.applyRemoteResource, params);
}
//数据接入-远程数据接入-获取本平台信息信息
export async function fetchLocalCluster(params = {}) {
    return get(EnumAPI.fetchLocalCluster, params);
}

//获取processors详情（编辑页）（待定）
export async function getProcessorsDetails(uuid, params = {}) {
    return get(EnumAPI.getProcessorsDetails(uuid), params);
}

//getSinkDetails
//获取processors详情（编辑页）
export async function getSinkDetails(uuid, params = {}) {
    return get(EnumAPI.getSinkDetails(uuid), params);
}

//更新任务（待定）
export async function updateTaskById(params = {}) {
    return postJSON(EnumAPI.updateTaskById, params);
}

//获取单个任务详情（待定）
export async function getTaskDetailById(params = {}) {
    return post(EnumAPI.getTaskDetailById, params);
}

//数据目的地
//获取输出数据目的地插件列表
export async function fetchDataDestinationPlugins(params = {}) {
    return post(EnumAPI.fetchDataDestinationPluginsAPI, params);
}

//保存数据目的地配置
export async function saveSinkConfig(params = {}) {
    return postJSON(EnumAPI.saveSinkConfig, params);
}
