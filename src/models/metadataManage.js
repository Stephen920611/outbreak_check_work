/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */

import {
    getQuickRegisterTree,
    saveQuickRegister,
    testQuickRegister,
    getTableInfosById,
    getDataSourceSearch,
    getDataSourceAllList,
    getTableOrViewById,
    getMetadataManageTree,
    saveRegisterQueueAndFile,
    getDataSourceManagementListServices,
    getDataSourceTypeTreeServices,
    getDataSourceManagementSelectServices,
    deleteDataSourceServices,
    updateDataSourceConfigServices,
    getDataResourceTreeServices,
    getDataResourceManagementListServices,
    getDataResourceManagementListAll,
    addDataResourceManagement,
    updateDataResourceManagement,
    getDataResource,
    getDataResourceFromDataSource,
    deleteDataResource,
    getMetaDataTree,
    mataDataAutoExploration,
    saveResourceMetaData,
} from '@/services/metadataManage';
import T from '../utils/T';
import {EnumDataSourceStatus} from './../constants/dataSync/EnumSyncCommon';

export default {
    namespace: 'metadataManage',//要唯一

    state: {
        metadataManageList: [],//快速注册-树节点，后台返回的数据存储在该list中,名字想怎么起怎么起
        metadataManageCurrentData: {},//这个是我为了存储后台返回来的json
        metadataManageTreeList: [],//存储元数据管理-树节点
        tableData: {},//返回的表格数据
        tableDataList: [],//返回的表格列表
        searchList: [],
        searchData: {},
        dataSourceTypeList: [],//元数据搜索-数据源列表
        dataResourceList: [
            {
                key: 1,
                title: 'title1'
            },
            {
                key: 2,
                title: 'title2'
            },
            {
                key: 3,
                title: 'title3'
            }
        ],
        dataResourceFromDataSource: [],     //数据资源管理-根据数据源选择数据资源（包括根据名称搜索数据资源）
        metadataManageHtmlType:'resourceManagement',
        //向树内追加table和view数据
        renderTreeTableOrView: function (datas, params, table, view) {
            //datas原来的树节点，params点击的数据库信息datasourceId,tableType，num获取的表格或视图的列表

            table.map(((item, index) => {
                item.title = item.tableName;
                item.key = item.id;
                item.keyId = item.id;
            }));
            view.map(((item, index) => {
                item.title = item.tableName;
                item.key = item.id;
                item.keyId = item.id;

            }));

            datas.map((item, index) => {
                if (item.id && item.id == params.datasourceId) {
                    let tableOrView = [
                        {
                            title: '表',
                            key: 'TABLE' + item.id,
                            id: 'TABLE',
                            keyId: 'TABLE' + item.id,
                        },
                        {
                            title: '视图',
                            key: 'VIEW' + item.id,
                            id: 'VIEW',
                            keyId: 'VIEW' + item.id,
                        }
                    ];
                    tableOrView.map(((item, index) => {
                        if (item.id === 'TABLE') {
                            item.children = table;
                        } else {
                            item.children = view;
                        }
                    }));
                    item.children = tableOrView;
                    // return datas;
                } else if (item.hasOwnProperty("children")) {
                    this.renderTreeTableOrView(item.children, params, table, view);
                }
            });
            return datas;
        },
        //统一树内元素含有title,keyId
        addRenderTree: function (datas) {
            datas.map((item, index) => {
                item.title = item.name || item.title || item.databaseName || '---';
                item.keyId = item.code || item.key || item.id;
                if (item.hasOwnProperty("children")) {
                    this.addRenderTree(item.children);
                }
            });
            return datas;
        },

        /*------------ 修改后的 ----------------*/
        dataSourceTypeTreeData: [],//数据源管理-存储数据源类型列表
        dataSourceTypeTreeList: [],//数据源管理-快速注册-存储数据源类型树列表（树显示）

        dataResourceCheckedList: [],//选中的数据资源列表
        dataResourceCheckedListTitle: [],//选中的数据资源title列表（用于注册资源界面的显示）
        dataResourceModalVisible: false,//资源管理-注册资源-数据资源模态框打开与隐藏
        addMetadataModalVisible: false,//元数据管理-新增元数据模态框的打开与隐藏

        dataSourceLists: [],//数据源管理 - 所有的数据源列表(分页)
        selectDataSource: [],//数据源管理-所有数据源列表（不分页）
        dataSourceDetailModalVisible: false,//数据源管理 - 单个数据源编辑的弹窗打开与隐藏

        dataResourceLists: [],//数据资源管理 - 所有数据资源的列表（分页）
        dataResourceTypeTreeData: [],//资源管理 - 资源类型树（原数据）
        dataResourceTypeTreeList: [],//资源管理 - 资源管理树
        dataSourceTypeTreeOldData: [], //资源管理-资源管理树-存储数据源类型树列表从后台返回的数据
        dataResourceNameSelected: "",   //资源管理-选择的数据源名字
        dataResourceRadio: "",   //资源管理-选择的数据源名字
        dataResourceManageEdit: false,  //是否是编辑状态的注册资源
        dataResourceManageEditInfo: {},  //编辑状态的注册资源信息

        metaDataTreeData: [],//管理元数据-获取数据源树类型
        metaDataOldTreeData: [],//管理元数据-获取数据源树类型-存储数据源类型树列表从后台返回的数据
        metaDataById: {},   //管理元数据-通过id获取dataResource的所有信息
        metaDataTableList: [],  //管理元数据-通过id获取表格信息
        metaDataSelectTreeKey: [],  //管理元数据-树选择的key值
        metaDataExpandTreeKey: [],  //管理元数据-树展开的key值
    },

    effects: {
        //快速注册-获取树
        * getQuickRegisterTreeAction(_, {call, put}) {
            const response = yield call(getQuickRegisterTree);
            //转换成json格式
            let data = JSON.parse(response.data);
            //树需要遍历，所以放到数组里
            let treeArr = [];
            treeArr.push(data);
            yield put({
                type: 'getDataTree',   //这里的getDataTree对应的reducer里的getDataTree名字
                payload: {
                    metadataManageCurrentData: response,
                    metadataManageList: treeArr
                },
            });
        },

        //快速注册-提交功能(数据库)
        /* * saveQuickRegisterAction({params}, {call}) {
             //后台需要一个参数是loginCode，这个接口需要带过去
             const info = T.auth.getLoginInfo();
             const response = yield call(saveQuickRegister, Object.assign(params, {
                 loginCode: info.user.loginCode
             }));
             //提示信息
             if(response.result === 'true'){
                 T.prompt.success(response.data)
             }else {
                 T.prompt.error(response.message)
             }
         },*/

        //快速注册-提交功能(队列、文件)
        * saveRegisterQueueAndFileAction({sendParams}, {call}) {
            //后台需要一个参数是loginCode，这个接口需要带过去
            const info = T.auth.getLoginInfo();
            const response = yield call(saveRegisterQueueAndFile, sendParams);
            // const response = yield call(saveRegisterQueueAndFile, Object.assign(params, {
            //     loginCode: info.user.loginCode
            // }));
            // 提示信息
            if (response.result === 'true') {
                T.prompt.success(response.data)
            } else {
                T.prompt.error(response.message)
            }
        },

        //快速注册-测试功能
        * testQuickRegisterAction({params}, {call}) {
            const response = yield call(testQuickRegister, params);
            //提示信息
            if (response.result === 'true') {
                //后端不好处理，及时是测试失败也返回true，所以这里需要特殊处理一下
                if (response.data === "测试失败") {
                    T.prompt.error(response.data)
                } else {
                    T.prompt.success(response.data)
                }
            } else {
                T.prompt.error(response.message)
            }
        },

        //元数据管理-获取树
        * getMetadataManageTreeAction({_, resolve, reject}, {call, put}) {
            try {
                const response = yield call(getMetadataManageTree);
                resolve(response);
                //转换成json格式
                let data = JSON.parse(response.data);
                //树需要遍历，所以放到数组里
                let treeArr = [];
                treeArr.push(data);
                yield put({
                    type: 'getMetadataManageTree',   //这里的getDataTree对应的reducer里的getDataTree名字
                    payload: {
                        metadataManageTreeList: treeArr
                    },
                });
            } catch (error) {
                reject(error);
            }
        },

        //元数据管理-根据数据源Id获取表和视图
        * getTableOrViewByIdAction({params}, {call, put}) {
            const table = yield call(getTableOrViewById, {...params, tableType: 'TABLE',});
            const view = yield call(getTableOrViewById, {...params, tableType: 'VIEW',});

            //提示信息
            yield put({
                type: 'getTableOrViewById',
                table: table,
                view: view,
                params: params,
            });
        },

        //元数据管理-获取表格信息
        * getTableInfosByIdAction({params, resolve, reject}, {call, put}) {
            try {
                const response = yield call(getTableInfosById, params);
                resolve(response);
                yield put({
                    type: 'getTableData',
                    payload: response,
                });
            } catch (error) {
                reject(error);
            }
        },

        //元数据搜索-获取数据源信息
        * getDataSourceInfosAction({params}, {call, put}) {
            const response = yield call(getDataSourceSearch, params);
            //提示信息
            yield put({
                type: 'getDataSource',
                payload: response,
            });
        },

        //元数据搜索-获取数据源列表
        * getDataSourceListAction(_, {call, put}) {
            const response = yield call(getDataSourceAllList);
            yield put({
                type: 'getDataSourceList',
                payload: response,
            });
        },


        /*------------ 修改后的 ----------------*/

        /*---------------------- 公共使用 ---------------------*/
        //加载数据资源列表
        * getDataResourceListAction({_,}, {call, put}) {
            yield put({
                type: 'setDataResourceList',
                // payload: response,
            });
        },
        //获取选择的数据资源列表
        * getDataResourceListCheckedAction({params,}, {call, put}) {
            yield put({
                type: 'getDataResourceListChecked',
                payload: params,
            });
        },
        //关闭或者打开选择选择数据资源模态框
        * changeDataResourceModalVisibleAction({htmlType, modalVisible}, {put}) {
            yield put({
                type: 'changeDataResourceModalVisible',
                htmlType,
                modalVisible,
            });
        },
        //元数据管理 - 模拟数据
        * getTableListAction({_}, {put}) {
            yield put({
                type: 'getTableList',
            });
        },

        /*------------ 数据源管理 ----------------*/
        //获取数据源类型
        * getDataSourceTypeTreeAction({_, resolve, reject}, {call, put}) {
            try {
                const response = yield call(getDataSourceTypeTreeServices);
                resolve(response);
                yield put({
                    type: 'getDataSourceTypeTree',
                    payload: response,
                });
            } catch (error) {
                reject(error);
            }
        },

        //数据源管理-获取数据源列表（分页）
        * getDataSourceManagementListAction({params}, {call, put,select}) {
            const response = yield call(getDataSourceManagementListServices, params);
            if (response.result === 'true') {
                let list = response.data.list;
                let dataSourceType = yield select(state => state.metadataManage.dataSourceTypeTreeData);
                list.map((item, index) => {
                    item.key = index + 1;
                    item.config = JSON.parse(item.config);//配置项转化
                    item.dataSourceStatus = EnumDataSourceStatus[item.status]["label"];
                    dataSourceType.map((val, idx) => { //数据源类型转化
                        if (item.type === val.id) {
                            item.dataSourceType = val.name;
                        }
                    })
                });
                yield put({
                    type: 'getDataSourceManagementList',
                    payload: list,
                });
            } else {
                T.prompt.error(response.message)
            }
        },

        //数据源管理 - 删除数据源
        * deleteDataSourceAction({id, resolve, reject}, {call}) {
            try {
                const response = yield call(deleteDataSourceServices, id);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //数据源管理 - 快速注册数据源 - 提交功能
        * saveQuickRegisterAction({sendParams}, {call}) {
            //后台需要一个参数是loginCode，这个接口需要带过去
            const response = yield call(saveQuickRegister, sendParams);
            //提示信息
            if (response.result === 'true') {
                T.prompt.success(response.data)
            } else {
                T.prompt.error(response.message)
            }
        },

        //数据源管理-获取数据源列表（不分页）
        * getDataSourceManagementSelectAction(_, {call, put}) {
            const response = yield call(getDataSourceManagementSelectServices);
            if (response.result === 'true') {
                yield put({
                    type: 'setDataSourceManagementSelect',
                    payload: response,
                });
            } else {
                T.prompt.error(response.message)
            }
        },

        //数据源管理 - 编辑数据源
        * updateDataSourceConfigAction({sendParams, resolve, reject}, {call}) {
            try {
                const response = yield call(updateDataSourceConfigServices, sendParams);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //数据源管理 - 操作-快速注册资源
        * changeMetadataManageHtmlTypeAction({metadataManageHtmlType}, {put}) {
            yield put({
                type: 'changeMetadataManageHtmlType',
                metadataManageHtmlType,
            });
        },

        /*------------ 数据资源管理 ----------------*/
        //获取数据资源类型树
        * getDataResourceTreeAction({_, resolve, reject}, {call, put}) {
            try {
                const response = yield call(getDataResourceTreeServices);
                resolve(response);
                let arr = response.data;
                //parent存储树的最外层
                let parentData = [];
                arr.map( val => {
                    if (val.pId === '0') {
                        parentData.push(val);
                    }
                });
                let endData = T.helper.createTreeStructure(parentData,arr);

                yield put({
                    type: 'setDataResourceTree',
                    payload: {
                        dataResourceTypeTreeData: arr.filter(item => item.pId !== '0'),
                        dataResourceTypeTreeList: endData,
                        dataSourceTypeTreeOldData: arr,
                    },
                });
            } catch (error) {
                reject(error);
            }
        },

        //数据资源管理-获取数据资源列表（分页）
        * getDataResourceManagementListAction({params}, {call, put, select}) {
            const response = yield call(getDataResourceManagementListServices, params);
            if (response.result === 'true') {
                let list = response.data.list;
                const dataResourceTypeTreeData = yield select(state => {
                    return state.metadataManage.dataResourceTypeTreeData
                });
                let endData = list.map((item, index) => {
                    let resourceTypeToName;
                    dataResourceTypeTreeData.map((val, idx) => { //数据源类型转化
                        if (item.categoryCode === val.id) {
                            resourceTypeToName = val.name;
                        }
                    });
                    return {
                        ...item,
                        key: index + 1,
                        dataSourceStatus: EnumDataSourceStatus[item.status]["label"],
                        dataSourceName: item.dataSource.name,
                        resourceType: resourceTypeToName,
                    }
                });
                yield put({
                    type: 'setDataResourceManagementList',
                    payload: {
                        dataResourceLists: endData
                    },
                });
            } else {
                T.prompt.error(response.message)
            }
        },

        //数据资源管理-新增资源
        * addDataResourceManagementAction({params, resolve, reject}, {call}) {
            try {
                const response = yield call(addDataResourceManagement, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //数据资源管理-新增资源
        * updateDataResourceManagementAction({params, resolve, reject}, {call}) {
            try {
                const response = yield call(updateDataResourceManagement, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //数据资源管理-设置选择的资源注册信息-数据源
        * changeResourceDataSourceNameAction({dataResourceNameSelected}, {put}) {
            yield put({
                type: 'setResourceDataSourceName',
                payload: {
                    dataResourceNameSelected
                },
            });
        },

        //数据资源管理-查看数据资源详情
        * getDataResourceFromDataSourceAction({id, resolve, reject}, {call}) {
            try {
                const response = yield call(getDataResourceFromDataSource, id);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //数据资源管理-查看数据资源详情
        * setDataResourceFromDataSourceAction({dataResourceFromDataSource}, {put}) {
            yield put({
                type: 'setDataResourceFromDataSource',
                dataResourceFromDataSource,
            });
        },

        //数据资源管理-单选数据资源
        * setDataResourceRadioAction({dataResourceRadio}, {put}) {
            yield put({
                type: 'setDataResourceRadio',
                dataResourceRadio,
            });
        },

        //数据资源管理-删除数据源
        * deleteDataResourceAction({id, resolve, reject}, {call}) {
            try {
                const response = yield call(deleteDataResource, id);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //数据资源管理-设置注册资源的编辑还是注册状态
        * changeResourceEditAction({dataResourceManageEdit}, {put}) {
            yield put({
                type: 'setResourceEdit',
                payload: {
                    dataResourceManageEdit
                },
            });
        },

        //数据资源管理-编辑状态的注册资源信息
        * changeDataResourceManageEditInfoAction({dataResourceManageEditInfo}, {put}) {
            yield put({
                type: 'setDataResourceManageEditInfo',
                payload: {
                    dataResourceManageEditInfo
                },
            });
        },

        /*------------ 元数据管理 ----------------*/
        //获取数据源树类型
        * getMetaDataTreeAction({_, resolve, reject}, {call, put}) {
            try {
                const response = yield call(getMetaDataTree);
                resolve(response);
                let arr = response.data;
                //parent存储树的最外层
                let parentData = [];
                arr.map( val => {
                    if (val.pId === '0') {
                        parentData.push(val);
                    }
                });
                let endData = T.helper.createTreeStructure(parentData,arr);

                yield put({
                    type: 'setMetaDataTree',
                    payload: {
                        metaDataTreeData: endData,
                        metaDataOldTreeData: arr,
                    },
                });
            } catch (error) {
                reject(error);
            }
        },

        //元数据管理-获取右边信息
        * getDataResourceAction({id, resolve, reject}, {call, put}) {
            try {
                const response = yield call(getDataResource, id);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //元数据管理-设置表格信息
        * setMetaDataByIdAction({metaDataById}, {put}) {
            yield put({
                type: 'setMetaDataById',
                payload: {
                    metaDataById
                },
            });
        },

        //元数据管理-设置表格信息
        * setMetaDataTableListAction({metaDataTableList}, {put}) {
            yield put({
                type: 'setMetaDataTableList',
                payload: {
                    metaDataTableList
                },
            });
        },

        //管理元数据-树选择的key值
        * setMetaDataSelectTreeKeyAction({metaDataSelectTreeKey}, {put}) {
            yield put({
                type: 'setMetaDataSelectTreeKey',
                payload: {
                    metaDataSelectTreeKey,
                }
            });
        },

        //管理元数据-树展开的key值
        * setMetaDataExpandTreeKeyAction({metaDataExpandTreeKey}, {put}) {
            yield put({
                type: 'setMetaDataExpandTreeKey',
                payload: {
                    metaDataExpandTreeKey,
                }
            });
        },

        //元数据管理-自动探查
        * mataDataAutoExplorationAction({params, resolve, reject}, {call, put}) {
            try {
                const response = yield call(mataDataAutoExploration,params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //元数据管理-保存表格信息
        * saveResourceMetaDataAction({id, dataFields, resolve, reject}, {call, put}) {
            try {
                const response = yield call(saveResourceMetaData, id, dataFields);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },


    },

    reducers: {
        //快速注册-获取树
        getDataTree(state, action) {
            return {
                ...state,
                metadataManageCurrentData: action.payload.metadataManageCurrentData,
                metadataManageList: action.payload.metadataManageList,
            };
        },

        saveData(state, action) {
            return {
                ...state,
            }
        },

        //元数据管理-获取表格信息
        getTableData(state, action) {
            let list = JSON.parse(action.payload.data);
            //添加不同的key
            /*list.map((item,index)=>{
                item.key = item.columnName
            });*/
            let endList = [];
            list.map((val, idx) => {
                endList.push({
                    ...val,
                    key: idx + 1,
                })
            });
            return {
                ...state,
                tableData: action.payload,
                // tableDataList:JSON.parse(action.payload.data)
                tableDataList: endList
            }
        },

        //元数据搜索-获取数据源信息
        getDataSource(state, action) {
            let datas = JSON.parse(action.payload.data).data;
            let newDate = '';
            let newSourceData = '';
            datas.map(((item, index) => {
                if (item.hasOwnProperty("createDate") || item.hasOwnProperty("create_date")) {
                    newDate = T.helper.dateFormat(item.hasOwnProperty("createDate") ? item.createDate : item.create_date,);
                    item.newDate = newDate;
                }
                if (item.hasOwnProperty("databaseId") || item.hasOwnProperty("database_id")) {
                    let newSourceId = item.hasOwnProperty("databaseId") ? item.databaseId : item.database_id;
                    state.dataSourceTypeList.forEach(function (item, index, input) {
                        if (item.id === newSourceId) {
                            newSourceData = item.name
                        }
                    });
                    item.newSourceData = newSourceData;
                    // datas.push(Object.assign({},item,{newSourceData:newSourceData}));
                }
            }));
            return {
                ...state,
                searchList: datas,
                searchData: JSON.parse(action.payload.data)
            }
        },

        //元数据搜索-获取数据源列表
        getDataSourceList(state, action) {
            // let data = action.payload.data;
            return {
                ...state,
                dataSourceTypeList: JSON.parse(action.payload.data),
            }
        },

        //元数据管理-根据数据源Id获取表和视图
        getTableOrViewById(state, action) {
            let table = JSON.parse(action.table.data);
            let view = JSON.parse(action.view.data);
            let params = action.params;
            let datas = state.metadataManageTreeList;
            let newdatas = state.renderTreeTableOrView(datas, params, table, view);
            return {
                ...state,
                // TableOrViewList: JSON.parse(action.payload.data),
                // TableOrViewData:newPayload,
                metadataManageTreeList: newdatas
            }
        },

        //元数据管理-获取树
        getMetadataManageTree(state, action) {
            return {
                ...state,
                metadataManageTreeList: state.addRenderTree(action.payload.metadataManageTreeList),
            };
        },

        /*------------ 修改后的 ----------------*/

        //关闭或者打开选择类型模态框
        changeDataResourceModalVisible(state, {htmlType, modalVisible}) {
            if (htmlType == 'ResourceRegister') {
                return {
                    ...state,
                    dataResourceModalVisible: modalVisible,//（数据资源注册界面）选择弹窗显示与隐藏
                };
            } else if (htmlType == 'dataSourceManagement') {
                return {
                    ...state,
                    dataSourceDetailModalVisible: modalVisible,//（数据源管理）数据源编辑弹窗的显示与隐藏
                };
            } else {
                return {
                    ...state,
                    addMetadataModalVisible: modalVisible,//（元数据管理）添加字段的显示与隐藏
                };
            }


        },

        //资源管理-注册资源-获取数据资源列表
        setDataResourceList(state, action) {
            //假数据
            let arr = [];
            for (let i = 0; i < 100; i++) {
                let obj = {
                    key: i,
                    title: 'title' + i
                };
                arr.push(obj);
            }
            return {
                ...state,
                // dataResourceList: action.payload,
                dataResourceList: arr,
            };
        },

        //资源管理-注册资源-根据数据源选择数据资源（包括根据名称搜索数据资源）
        setDataResourceFromDataSource(state, action) {
            return {
                ...state,
                dataResourceFromDataSource: action.dataResourceFromDataSource,
            };
        },

        //数据资源管理-单选数据资源
        setDataResourceRadio(state, action) {
            return {
                ...state,
                dataResourceRadio: action.dataResourceRadio,
            };
        },

        //资源管理-注册资源，获取选中的数据资源列表getDataResourceListChecked
        getDataResourceListChecked(state, action) {
            let title = action.payload;
            let dataResourceCheckedListTitle = [];
            title.map((item, index) => {
                dataResourceCheckedListTitle.push(item.title);
            });
            return {
                ...state,
                dataResourceCheckedList: action.payload,
                dataResourceCheckedListTitle: dataResourceCheckedListTitle,
            };
        },


        //元数据管理-获取表格信息（假数据）
        getTableList(state, action) {
            let arr = [];
            for (let i = 0; i < 20; i++) {
                let obj = {
                    key: i,
                    columnName: 'title' + i,
                    columnRemark: '字段' + i,
                    typeName: 'VARCHAR',
                    columnSize: '20',
                    defaultNum: '0',
                    updateTime: '2019-10-16',
                };
                arr.push(obj);
            }
            let endList = [];

            return {
                ...state,
                tableDataList: arr
            }
        },

        /*------------ 数据源管理  ----------------*/
        //获取数据源类型树
        getDataSourceTypeTree(state, action) {
            let arr = action.payload.data;
            let endList = [];
            //复制数组 arr：未改变的数组
            arr.map((val, idx) => {
                endList.push({
                    ...val,
                })
            });

            //parent存储树的最外层
            let parent = T.lodash.remove(endList, function (item) {
                if (item.pId === '0') {
                    return item;
                }
            });
            parent.map((item) => {
                let children = [];
                item.title = item.name;
                endList.map((self) => {
                    if (self.pId === item.id) {
                        children.push(self);
                        self.title = self.name;
                    }
                });
                item.children = children;
            });
            return {
                ...state,
                dataSourceTypeTreeData: arr.filter(item => item.pId !== '0'),
                dataSourceTypeTreeList: parent,
            };
        },

        //数据源管理-获取数据源列表(分页)
        getDataSourceManagementList(state, action) {
            // let list = action.payload.data.list;
            let dataSourceType = state.dataSourceTypeTreeData;
            /*list.map((item, index) => {
                item.key = index + 1;
                item.config = JSON.parse(item.config);//配置项转化
                item.dataSourceStatus = EnumDataSourceStatus[item.status]["label"];
                dataSourceType.map((val, idx) => { //数据源类型转化
                    if (item.type === val.id) {
                        item.dataSourceType = val.name;
                    }
                })
            });*/
            return {
                ...state,
                dataSourceLists: action.payload
            }
        },

        //数据源管理-获取数据源列表(不分页)
        setDataSourceManagementSelect(state, action) {
            return {
                ...state,
                selectDataSource: action.payload.data
            }
        },

        //数据源管理 - 操作 - 快速注册资源
        changeMetadataManageHtmlType(state, {metadataManageHtmlType}) {
            return {
                ...state,
                metadataManageHtmlType,
            };
        },

        /*------------ 数据资源管理 ----------------*/

        //获取数据源类型树
        setDataResourceTree(state, action) {
            return {
                ...state,
                dataResourceTypeTreeData: action.payload.dataResourceTypeTreeData,
                dataResourceTypeTreeList: action.payload.dataResourceTypeTreeList,
                dataSourceTypeTreeOldData: action.payload.dataSourceTypeTreeOldData,
            };
        },
        //数据源管理-获取数据源列表(分页)
        setDataResourceManagementList(state, action) {
            return {
                ...state,
                dataResourceLists: action.payload.dataResourceLists
            }
        },
        //数据资源管理-设置选择的资源注册信息-数据源
        setResourceDataSourceName(state, action) {
            return {
                ...state,
                dataResourceNameSelected: action.payload.dataResourceNameSelected
            }
        },
        //数据资源管理-设置注册资源的编辑还是注册状态
        setResourceEdit(state, action) {
            return {
                ...state,
                dataResourceManageEdit: action.payload.dataResourceManageEdit
            }
        },
        //数据资源管理-编辑状态的注册资源信息
        setDataResourceManageEditInfo(state, action) {
            return {
                ...state,
                dataResourceManageEditInfo: action.payload.dataResourceManageEditInfo
            }
        },
        /*------------ 元数据管理 ----------------*/
        //获取元数据管理数据源类型树
        setMetaDataTree(state, action) {
            return {
                ...state,
                metaDataTreeData: action.payload.metaDataTreeData,
                metaDataOldTreeData: action.payload.metaDataOldTreeData,
            };
        },

        //元数据管理-设置右边信息
        setMetaDataById(state, action) {
            return {
                ...state,
                metaDataById: action.payload.metaDataById,
            };
        },

        //元数据管理-设置表格信息
        setMetaDataTableList(state, action) {
            return {
                ...state,
                metaDataTableList: action.payload.metaDataTableList,
            };
        },

        //管理元数据-树选择的key值
        setMetaDataSelectTreeKey(state, action) {
            return {
                ...state,
                metaDataSelectTreeKey: action.payload.metaDataSelectTreeKey,
            };
        },

        //管理元数据-树展开的key值
        setMetaDataExpandTreeKey(state, action) {
            return {
                ...state,
                metaDataExpandTreeKey: action.payload.metaDataExpandTreeKey,
            };
        },
    },
};
