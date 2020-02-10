/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */
import EnumAPI from './../constants/EnumAPI';
import {get, post, postJSON,del,put} from './../utils/core/requestTj';
import T from './../utils/T';

//快速注册-获取树
export async function getQuickRegisterTree(params = {}) {
    return get(EnumAPI.getQuickRegisterDataTree, params);
}

/*//快速注册-提交功能(数据库)
export async function saveQuickRegister(params = {}) {
    return post(EnumAPI.saveQuickRegister, params);
}*/

//快速注册-提交功能(队列、文件)
export async function saveRegisterQueueAndFile(params = {}) {
    return postJSON(EnumAPI.saveRegisterQueueAndFile, params);
}

//快速注册-测试链接功能(数据库)
export async function testQuickRegister(params = {}) {
    return post(EnumAPI.testQuickRegister, params);
}

//元数据管理-根据tableId获取表格信息
export async function getTableInfosById(params = {}) {
    return post(EnumAPI.getTableInfosById, params);
}

//元数据管理-通过数据源的id，获取数据源下的表格和视图
export async function getTableOrViewById(params = {}) {
    return post(EnumAPI.getTableOrViewById, params);
}

//元数据管理-获取数据源树
export async function getMetadataManageTree(params = {}) {
    return get(EnumAPI.getMetadataManageTree, params);
}

//元数据搜索-获取数据源信息
export async function getDataSourceSearch(params = {}) {
    return post(EnumAPI.getDataSourceSearch, params);
}

//元数据搜索-获取数据源列表
export async function getDataSourceAllList(params = {}) {
    return get(EnumAPI.getDataSourceAllList, params);
}


//修改后
//数据源管理 - 获取数据源列表(分页)
export async function getDataSourceManagementListServices(params = {}) {
    return postJSON(EnumAPI.getDataSourceManagementListServices, params);
}
//数据源管理 - 获取数据源列表(不分页)
export async function getDataSourceManagementSelectServices(params = {}) {
    return get(EnumAPI.getDataSourceManagementSelectServices, params);
}
//数据源管理 - 删除数据源
export async function deleteDataSourceServices(id) {
    return del(EnumAPI.deleteDataSourceServices(id));
}

//数据源管理 - 编辑更新数据源
export async function updateDataSourceConfigServices(params = {}) {
    return put(EnumAPI.updateDataSourceConfigServices, params);
}

//数据源管理 -新增数据源 - 获取数据源类型树
export async function getDataSourceTypeTreeServices(params = {}) {
    return get(EnumAPI.getDataSourceTypeTreeServices, params);
}

//数据源管理 - 快速注册-提交功能(数据库)
export async function saveQuickRegister(params = {}) {
    return postJSON(EnumAPI.saveQuickRegister, params);
}

/*------------ 数据资源管理 ----------------*/
//数据资源管理 - 获取数据资源树
export async function getDataResourceTreeServices(params = {}) {
    return get(EnumAPI.getDataResourceTreeServices, params);
}
//数据源管理 - 获取数据源列表(分页)
export async function getDataResourceManagementListServices(params = {}) {
    return postJSON(EnumAPI.getDataResourceManagementListServices, params);
}
//数据资源管理-新增资源
export async function addDataResourceManagement(params = {}) {
    return postJSON(EnumAPI.addDataResourceManagement, params);
}
//数据资源管理-更新资源
export async function updateDataResourceManagement(params = {}) {
    return put(EnumAPI.addDataResourceManagement, params);
}
//数据资源管理-查看数据资源详情
export async function getDataResource(id) {
    return get(EnumAPI.getDataResource(id));
}
//数据资源管理-根据数据源选择数据资源（包括根据名称搜索数据资源）
export async function getDataResourceFromDataSource(id) {
    return get(EnumAPI.getDataResourceFromDataSource(id));
}
//数据资源管理-删除数据源
export async function deleteDataResource(id) {
    return del(EnumAPI.deleteDataResource(id));
}

/*------------ 管理元数据 ----------------*/
//管理元数据-获取数据源树类型
export async function getMetaDataTree(params = {}) {
    return get(EnumAPI.getMetaDataTree, params);
}

//管理元数据-自动探查
export async function mataDataAutoExploration(params = {}) {
    return get(EnumAPI.mataDataAutoExploration(params));
}
//管理元数据 - 保存数据资源下的元数据
export async function saveResourceMetaData(id,dataFields) {
    return postJSON(EnumAPI.saveResourceMetaData(id),dataFields, {}, false, true);
}

