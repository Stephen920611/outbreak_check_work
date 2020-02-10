/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */

import {routerRedux} from 'dva/router';
import {
    fetchSourceProcessorsList,
    fetchDataSourcePlugins,
    deleteSourceProcessor,
    activateSourceProcessor,
    resumeSourceProcessor,
    pauseSourceProcessor,
    restartSourceProcessor,
    restartProcessorDetailTask,
    saveSourceConfig,
    getDetailLineDataById,
    saveSinkConfig,
    fetchDataOriginDetail,
    getSinkDetails,
    fetchRemoteClusterResourceList,
    fetchRemoteClusterDataFieldList,
    activateRemoteResource,
    applyRemoteResource,
    fetchLocalCluster,
    fetchClusterSourceProcessorsListServices,
    deleteClusterSourceProcessor,
    activateClusterSourceProcessor,
    resumeClusterSourceProcessor,
    pauseClusterSourceProcessor,
    restartClusterSourceProcessor,
    fetchClusterDataOriginDetail,
    dataSyncSaveQuickRegisterDestination,
    fetchDataDestinationPlugins,
    getDataSourceListDestinationServices,

//待定
    getProcessorsDetails,
    updateTaskById,
    getTaskDetailById,
    dataSyncSaveQuickRegister,

} from '@/services/dataSync/dataSyncNewMission';
import {
    getMetadataManageTree,
    getTableOrViewById,
    getTableInfosById,
    getDataSourceManagementListServices,
    getDataSourceManagementSelectServices,
    getDataResourceFromDataSource,
    mataDataAutoExploration,
    saveQuickRegister,
} from '@/services/metadataManage';
import {fetchClusterManageListServices} from '@/services/clusterManage/clusterManage';

import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import T from '../../utils/T';

export default {
    namespace: 'dataSyncNewMission', //要唯一

    state: {
        /*------------ 新使用的 ----------------*/
        sourceProcessorsList: {
            data: [],
            "total": 0,
        }, //数据源列表
        formData: {},       //form表单数据
        currentStep: 0, //当前的本地数据接入或者数据目的地步骤
        currentRemoteDataStep: 0,   //远程数据接入步骤
        remoteSelectedPlatform: '',     //远程数据选择的集群平台id
        remoteSelectedPlatformInfo: {},     //远程数据选择的集群平台信息
        remoteSelectedResource: '',     //远程数据选择的平台资源id
        remoteSelectedResourceInfo: {}, //远程数据选择的平台资源信息
        clusterPlatformList: [],        //集群平台数据
        platformResourceList: [],    //平台资源信息
        resourceDataFieldList: [],       //获取某一资源的元数据信息
        localClusterInfo: {},       //获取本平台信息

        isProcessorEdit: false,//数据源或者数据目的地状态
        originActiveColor: '',  //选中的source变色的类型
        processorUuid: '',//选中source或sink的uuid
        processorParamInfo: {},//数据源配置信息
        addFieldModalVisible: false,//配置规则新建字段弹窗
        configRules: [],//分布界面 - 配置规则信息

        /*------------ 公共使用 ----------------*/
        modalType: 'dataOrigin', //控制新建和编辑窗口显示是数据源还是目的地，dataOrigin是数据源,dataDestination是数据目的地
        currentDataInfo: {}, //选择数据源或者是数据目的地的所有信息
        // dataOriginDetail:{},//数据源详情页 - 获取数据源详情
        dataOriginDetail:{//数据源详情页 - 数据源详情
            processor:{},//分发目的地详情
            status:{
                tasks:[],//运行状态下列表
            },//运行状态
            statistics:{},//数据统计
            logs:[],//日志信息
        },
        dataSourceModalVisible: false, //新建数据源的模态框的显示与隐藏
        dataResourceRadio:'',//数据分发 - 配置规则（jdbc）选择的数据源
        dataResourceModalVisible:false, //数据分发 - 配置规则选择数据源的弹窗的显示与隐藏
        dataResourceFromDataSource: [],     //数据资源管理-根据数据源选择数据资源（包括根据名称搜索数据资源）
        dataResourceNameSelected:'',//数据源配置，存储选择数据源的id
        createDataResourceModalVisible:false,//数据分发 - 配置规则，创建数据库表弹窗的显示与隐藏
        checkType:'local',//数据源列表页，用于存储是本地还是远程

        /*------------ 选择数据（源、目的地）类型页面 ----------------*/

        dataOriginList: [], //数据源列表，点击新建数据源-选择数据源类型的列表
        dataDestinationList: [], //数据目的地列表，点击新建数据目的地-选择数据目的地类型的列表
        updateReault: {}, //更新任务返回的任务信息
        metadataManageUrlList: [],//jdbc 数据源url列表
        metadataManageTableList: [],//jdbc 根据数据源id获取的列表
        fieldByTableIdList: [],//根据table id 获取的字段名列表
        detailModalData: {}, //详情模态框内容
        /*------------ 任务详情页面 ----------------*/
        getMissionDetail: {}, //获取的任务详情
        addArrayKey:function(data) {
            //处理后的数据
            let endData = [];
            data.map((val, idx) => {
                endData.push({
                    ...val,
                    key: idx + 1,
                })
            });
            return endData;
        },//给数组数据添加key值


        /*-------------------End----------------------*/


    },

    effects: {
        /*------------ 数据源列表页  ----------------*/
        //设置集群平台数据（远程接入）
        * fetchClusterManageListServicesAction({params,resolve, reject}, {call, put}) {
            try {
                const response = yield call(fetchClusterManageListServices, params);
                resolve(response);
                yield put({
                    type: 'setClusterPlatformList',
                    clusterPlatformList: response.data.list,
                });
            } catch (error) {
                reject(error);
            }
        },
        //获取数据源列表(本地)
        * fetchSourceProcessorsListAction({params, resolve, reject}, {put, call, all}) {
            // //获取model的state中的值
            // const checkType = yield select(state => state.dataSyncNewMission.checkType);
            try {
                const response = yield call(fetchSourceProcessorsList, params);
                resolve(response);
                if (response.result === 'true') {
                    let dataJSON = response.data;
                    // let dataJSON = x.data;
                   /* if (dataJSON.data.length < EnumDataSyncPageInfo.defaultPageSize && params.page === EnumDataSyncPageInfo.defaultPage) {
                        dataJSON.data.unshift({
                            taskId: 0,
                            taskName: '',
                            isNew: true,
                        });
                    }*/
                    yield put({
                        type: 'setSourceProcessorsList',
                        sourceProcessorsList: dataJSON,
                    });
                } else {
                    T.prompt.error(response.message);
                }
            } catch (error) {
                reject(error);
            }

        },
        //获取数据源列表远程接口（远程接入）
        * fetchClusterSourceProcessorsListAction({params, resolve, reject}, {put, call, all}) {
            try {
                const response = yield call(fetchClusterSourceProcessorsListServices, params);
                resolve(response);
                if (response.result === 'true') {
                    let dataJSON = response.data;
                    // let dataJSON = x.data;
                    /*if (dataJSON.list.length < EnumDataSyncPageInfo.defaultPageSize && params.page === EnumDataSyncPageInfo.defaultPage) {
                        dataJSON.list.unshift({
                            taskId: 0,
                            taskName: '',
                            isNew: true,
                        });
                    }*/
                    yield put({
                        type: 'setClusterSourceProcessorsList',
                        sourceProcessorsList: dataJSON,
                    });
                } else {
                    T.prompt.error(response.message);
                }
            } catch (error) {
                reject(error);
            }
        },
        //跳转新建任务路由
        * createNewMissionAction(_, {put}) {
            yield put(
                routerRedux.replace({
                    pathname: '/dataTask/newTaskFlow',
                })
            );
        },
        //更改选择的数据类型（本地）
        * changeCurrentDataInfoAction({currentDataInfo}, {call, put}) {
            let currentDataInfoClassName = currentDataInfo.className;
            //currentDataInfo选择的插件详情
            yield put({
                type: 'changeCurrentDataInfo',
                currentDataInfo,
            });
            //判断是否为jdbc输入或输出，获取url 地址
            yield put({
                type: 'getMetadataManageTreeAction',
                currentDataInfoClassName,
            });
            // if(currentDataInfo['className']==='io.confluent.connect.jdbc.JdbcSourceConnector'||currentDataInfo['className'] ==='io.confluent.connect.jdbc.JdbcSinkConnector'){
            //     yield put({
            //         type: 'getMetadataManageTreeAction',
            //     });
            // }
        },
        /*------------------- 分布界面 ------------------*/

        //新建数据源-获取输入数据源插件列表（本地）
        * fetchDataSourcePluginsAction(_, {call, put}) {
            const response = yield call(fetchDataSourcePlugins);
            if (response.result === 'true') {
                //提示信息
                yield put({
                    type: 'setDataSourcePlugins',
                    dataOriginList: response.data,
                });
            } else {
                T.prompt.error(response.message);
            }
        },
        //数据源或数据目的地，获取元数据管理数据源url列表(数据接入)
        * getDataSourceListAction({params,resolve, reject}, {call, put}) {
            // const response = yield call(getDataSourceManagementListServices, params);
            let metadataManageUrlList = [];
            try {
                const response = yield call(getDataSourceManagementSelectServices, params);
                // const response =T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? yield call(getDataSourceManagementSelectServices, params):yield call(getDataSourceListDestinationServices, params);
                if (response.result === 'true') {
                    // metadataManageUrlList = T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? response.data : response.data;
                    metadataManageUrlList = response.data;
                    yield put({
                        type: 'getDataSourceList',
                        metadataManageUrlList,
                    });
                } else {
                    T.prompt.error(response.message);
                }
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //数据源或数据目的地，获取元数据管理数据源url列表(数据分发)
        * getDataSourceListDestinationAction({params,resolve, reject}, {call, put}) {
            // const response = yield call(getDataSourceManagementListServices, params);
            let metadataManageUrlList = [];
            try {
                const response = yield call(getDataSourceListDestinationServices, params);
                if (response.result === 'true') {
                    metadataManageUrlList = response.data;
                    yield put({
                        type: 'getDataSourceList',
                        metadataManageUrlList,
                    });
                } else {
                    T.prompt.error(response.message);
                }
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //获取processors详情（编辑）(数据接入)（未做）
        * getProcessorsDetailsAction({uuid, resolve, reject}, {put, call}) {
            const response = yield call(getProcessorsDetails, uuid);
            resolve(response);
            if (response.result === 'true') {
                //设置所有数据
                yield put({
                    type: 'setDetailModalData',
                    detailModalData: response.data,
                });
                //设置当前数据源数据
                // yield put({
                //     type: 'changeCurrentDataInfo',
                //     processorParamInfo: response.data,
                // });
            } else {
                T.prompt.error(response.message);
            }
        },
        //获取processors详情（编辑）（数据分发）（未做）
        * getSinkDetailsAction({uuid, resolve, reject}, {put, call}) {
            const response = yield call(getSinkDetails, uuid);
            resolve(response);
            //如果是数据目的地
            let endData = response.data;
            if(T.storage.getStorage('HtmlType').modalType === 'dataDestination'){
                endData['configuration'] = {
                    ...JSON.parse(endData['configdata'])
                }
            }
            console.log('12333',endData);
            if (response.result === 'true') {
                //设置所有数据
                yield put({
                    type: 'setDetailModalData',
                    // detailModalData: response.data,
                    detailModalData: endData,
                });
                //设置当前数据源数据
                // yield put({
                //     type: 'changeCurrentDataInfo',
                //     processorParamInfo: response.data,
                // });
            } else {
                T.prompt.error(response.message);
            }
        },

        /*------------数据分发 ----------------*/

        //数据任务-新建数据目的地-获取数据目的地类型
        * fetchDataDestinationPluginsAction(_, {call, put}) {
            const response = yield call(fetchDataDestinationPlugins);
            if (response.result === 'true') {
                //提示信息
                yield put({
                    type: 'setDataDestinationPlugins',
                    dataDestinationList: response.data,
                });
            } else {
                T.prompt.error(response.message);
            }
        },
        //数据源配置-关闭或者打开选择新建数据源模态框
        * changeDataSourceModalVisibleAction({dataSourceModalVisible}, {put}) {
            yield put({
                type: 'changeDataSourceModalVisible',
                dataSourceModalVisible,
            });
        },
        // 数据源配置-根据数据库URL的id获取，相应的表（jdbc输入）
        * getDataResourceByIdAction({id}, {call, put}) {
            // const response = yield call(getTableOrViewById, params);
            const response = yield call(getDataResourceFromDataSource, id);
            let metadataManageTableList = [];
            if (response.result === 'true') {
                metadataManageTableList = response.data;
                yield put({
                    type: 'getDataResourceById',
                    metadataManageTableList,
                    dataResourceNameSelected:id,
                })
            } else {
                T.prompt.error(response.message);
            }
        },
        //（第二步）根据表的name获取字段名(jdbc输入和输出)
        * getFieldListAction({params}, {call, put}) {
            const response = yield call(mataDataAutoExploration, params);
            let fieldByTableIdList = [];
            if (response.result === 'true') {
                fieldByTableIdList = response.data;
                //如果返回的字段为零，且属于数据分发
                if(fieldByTableIdList.length === 0 && T.storage.getStorage('HtmlType').modalType === 'dataDestination'){
                    T.prompt.warn('该数据库表不存在！',6)
                }
                yield put({
                    type: 'getFieldList',
                    fieldByTableIdList,
                })
            } else {
                T.prompt.error(response.message);
            }
        },
        //数据分发 - （第二步）（jdbc）选择按钮,单选数据资源（暂定，未使用）
        * setDataResourceRadioAction({dataResourceRadio}, {put}) {
            yield put({
                type: 'setDataResourceRadio',
                dataResourceRadio,
            });
        },
        //数据分发 - （第二步）关闭或者打开选择选择数据资源模态框（暂定，未使用）
        * changeDataResourceModalVisibleAction({htmlType, modalVisible}, {put}) {
            yield put({
                type: 'changeDataResourceModalVisible',
                modalVisible,
                htmlType,
            });
        },
        //数据分发 - （第二步）-查看数据资源列表（暂定，未使用）
        * getDataResourceFromDataSourceAction({id, resolve, reject}, {call}) {
            try {
                const response = yield call(getDataResourceFromDataSource, id);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //数据分发 - （第二步）-查看数据资源详情（暂定，未使用）
        * setDataResourceFromDataSourceAction({dataResourceFromDataSource}, {put}) {
            yield put({
                type: 'setDataResourceFromDataSource',
                dataResourceFromDataSource,
            });
        },

        //（第三步）数据接入-保存数据源配置接口
        * saveSourceConfigAction({params, resolve, reject}, {put, call}) {
            try {
                const response = yield call(saveSourceConfig, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //（第三步）数据分发 - 保存数据目的地配置接口
        * saveSinkConfigAction({params, resolve, reject}, {put, call}) {
            try {
                const response = yield call(saveSinkConfig, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //配置规则（第三步） - 获取配置规则
        * fetchDataSourceConfigAction({params,}, {call, put}) {
            const response = yield call(mataDataAutoExploration, params);
            if (response.result === 'true') {
                let endData = [];
                response.data.map((val, idx) => {
                    endData.push({
                        ...val,
                        key: idx + 1,
                        fieldName: val.name,
                        newFieldName: val.name,
                        fieldType: val.type,
                        newFieldType: val.type,
                        isNotnull: '',
                        defaultValue: '',
                        fetchColumn: 'true',
                        isNewRecord: 0,
                    })
                });
                yield put({
                    type: 'fetchDataSourceConfig',
                    configRules: endData,
                });

            } else {
                T.prompt.error(response.message);
            }
        },

        //(第四步)更新任务
        * updateTaskByIdAction({params, resolve, reject}, {call, put}) {
            try {
                const response = yield call(updateTaskById, params);
                yield put({
                    type: 'updateTask',
                    payload: response,
                });
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //（第四步）获取单个任务详情
        * getTaskDetailByIdAction({params}, {call, put}) {
            const response = yield call(getTaskDetailById, params);
            yield put({
                type: 'getTaskDetail',
                payload: response,
            });
        },
        /*------------ 数据源详情页 ----------------*/

        //获取数据源详情
        * fetchDataOriginDetailAction({uuid}, {put, call, select}) {
            //获取model的state中的值
            const checkType = yield select(state => state.dataSyncNewMission.checkType);
            const response = checkType === 'local' ? yield call(fetchDataOriginDetail, uuid) : yield call(fetchClusterDataOriginDetail, uuid);
            // const response = yield call(fetchDataOriginDetail,uuid);
            if (response.result === 'true') {
                yield put({
                    type: 'setDataOriginDetail',
                    dataOriginDetail: response.data,
                });
            } else {
                T.prompt.error(response.message);
            }
        },
        //根据id获取每分钟速率
        * getDetailLineDataByIdAction({id, params, resolve, reject}, {call}) {
            try {
                const response = yield call(getDetailLineDataById, id, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //重启详情页面运行状态的任务
        * restartProcessorDetailTaskAction({uuid, taskId, resolve, reject}, {put, call}) {
            try {
                const response = yield call(restartProcessorDetailTask, uuid, taskId);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },


        /*------------ 分布界面-公共使用 ----------------*/

        //更改数据源/数据目的地编辑状态（本地）
        * changeProcessorEditAction({isProcessorEdit}, {put}) {
            yield put({
                type: 'changeProcessorEdit',
                isProcessorEdit,
            });
        },
        //更改当前步骤（本地）
        * setCurrentStepAction({currentStep}, {put}) {
            yield put({
                type: 'setCurrentStep',
                currentStep,
            });
        },
        //更改数据源或数据目的地类型信息（本地）
        * changeProcessorTypeInfoAction({params}, {put}) {
            yield put({
                type: 'changeProcessorTypeInfo',
                params,
            });
        },
        //保存数据源或数据目的地配置信息（本地）
        * setFormDataAction({formData}, {put}) {
            yield put({
                type: 'setFormData',
                formData,
            });
        },
        //更改数据任务模态框类型dataOrigin是数据源,dataDestination是数据目的地（本地）
        * changeModalTypeAction({modalType}, {put}) {
            yield put({
                type: 'changeModalType',
                modalType,
            });
        },

        //删除数据源processors
        * deleteSourceProcessorAction({uuid, resolve, reject}, {put, call,select}) {
            //获取model的state中的值
            const checkType = yield select(state => state.dataSyncNewMission.checkType);
            try {
                const response = checkType === 'local' ? yield call(deleteSourceProcessor, uuid) : yield call(deleteClusterSourceProcessor, uuid);
                // const response = yield call(deleteSourceProcessor, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //激活数据源
        * activateSourceProcessorAction({uuid, resolve, reject}, {put, call,select}) {
            //获取model的state中的值
            const checkType = yield select(state => state.dataSyncNewMission.checkType);
            try {
                const response = checkType === 'local' ? yield call(activateSourceProcessor, uuid) : yield call(activateClusterSourceProcessor, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //开始数据源
        * resumeSourceProcessorAction({uuid, resolve, reject}, {put, call,select}) {
            //获取model的state中的值
            const checkType = yield select(state => state.dataSyncNewMission.checkType);
            try {
                const response = checkType === 'local' ? yield call(resumeSourceProcessor, uuid) : yield call(resumeClusterSourceProcessor, uuid);
                // const response = yield call(resumeSourceProcessor, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //暂停数据源
        * pauseSourceProcessorAction({uuid, resolve, reject}, {put, call,select}) {
            //获取model的state中的值
            const checkType = yield select(state => state.dataSyncNewMission.checkType);
            try {
                const response = checkType === 'local' ? yield call(pauseSourceProcessor, uuid) : yield call(pauseClusterSourceProcessor, uuid);
                // const response = yield call(pauseSourceProcessor, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //重启数据源
        * restartSourceProcessorAction({uuid, resolve, reject}, {put, call,select}) {
            //获取model的state中的值
            const checkType = yield select(state => state.dataSyncNewMission.checkType);
            try {
                const response = checkType === 'local' ? yield call(restartSourceProcessor, uuid) : yield call(restartClusterSourceProcessor, uuid);
                // const response = yield call(restartSourceProcessor, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //保存数据源和数据目的地配置信息（本地保存）
        * saveProcessorParamInfoAction({processorParamInfo}, {put}) {
            yield put({
                type: 'saveProcessorParamInfo',
                processorParamInfo,
            });
        },
        //数据接入/数据分发- 配置规则-关闭或者打开选择选择配置规则模态框
        * changeFieldModalVisibleAction({modalVisible}, {put}) {
            yield put({
                type: 'changeFieldModalVisible',
                modalVisible,
            });
        },


        //数据源配置 - 快速注册数据源 - 提交功能(数据接入)（暂定）
        * saveQuickRegisterAction({sendParams, resolve, reject}, {put,call}) {
            try {
                //后台需要一个参数是loginCode，这个接口需要带过去
                // const response = yield call(saveQuickRegister, sendParams);
                const response = yield call(dataSyncSaveQuickRegister, sendParams);
                resolve(response);
                if (response.result === 'true') {


                }
            } catch (error) {
                reject(error);
            }
        },
        //数据源配置 - 快速注册数据源 - 提交功能(数据接入)（暂定）
        * saveQuickRegisterDestinationAction({sendParams, resolve, reject}, {put,call}) {
            try {
                //后台需要一个参数是loginCode，这个接口需要带过去
                // const response = yield call(saveQuickRegister, sendParams);
                const response = yield call(dataSyncSaveQuickRegisterDestination, sendParams);
                resolve(response);
                if (response.result === 'true') {
                }
            } catch (error) {
                reject(error);
            }
        },

        /*------------------- 远程数据接入，分布界面  ----------------------*/

        //数据接入-远程数据接入-获取本平台信息信息
        * fetchLocalClusterAction({params}, {call, put}) {
            const response = yield call(fetchLocalCluster, params);
            if (response.result === 'true') {
                yield put({
                    type: 'setLocalClusterInfo',
                    localClusterInfo: response.data,
                });
            } else {
                T.prompt.error(response.message);
            }
        },
        //更改远程数据选择的集群平台
        * setRemoteSelectedPlatformAction({remoteSelectedPlatformInfo}, {put}) {
            yield put({
                type: 'setRemoteSelectedPlatform',
                remoteSelectedPlatform : remoteSelectedPlatformInfo.hasOwnProperty('id') ? remoteSelectedPlatformInfo.id : '',
                remoteSelectedPlatformInfo,
            });
        },
        //获取平台资源数据
        * fetchRemoteClusterResourceListAction({params}, {call, put}) {
            const response = yield call(fetchRemoteClusterResourceList, params);
            if (response.result === 'true') {
                yield put({
                    type: 'setRemoteClusterResourceList',
                    platformResourceList: response.data,
                });
            } else {
                T.prompt.error(response.message);
            }
        },
        //更改远程数据选择的平台资源
        * setRemoteSelectedResourceAction({remoteSelectedResourceInfo}, {put}) {
            yield put({
                type: 'setRemoteSelectedResource',
                remoteSelectedResource: remoteSelectedResourceInfo.hasOwnProperty('id') ? remoteSelectedResourceInfo.id : '',
                remoteSelectedResourceInfo,
            });
        },
        //获取某一资源的元数据信息
        * fetchRemoteClusterDataFieldListAction({params}, {call, put}) {
            const response = yield call(fetchRemoteClusterDataFieldList, params);
            if (response.result === 'true') {
                let endData = response.data.map( (val,idx) => {
                    return {
                        ...val,
                        key: idx,
                        columnName: val.name,
                        columnRemark: val.description,
                        typeName: val.type,
                        columnSize: val.length,
                        defaultValue: val.defaultValue,
                        updateDate: T.helper.dateFormat(val.updateDate),
                    }
                });
                yield put({
                    type: 'setRemoteClusterDataFieldList',
                    resourceDataFieldList: endData,
                });
            } else {
                T.prompt.error(response.message);
            }
        },
        //数据接入-远程数据接入-激活
        * activateRemoteResourceAction({params,resolve, reject}, {call, put}) {
            try {
                const response = yield call(activateRemoteResource, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //数据接入-远程数据接入-向远程集群申请接入资源
        * applyRemoteResourceAction({params,resolve, reject}, {call, put}) {
            try {
                const response = yield call(applyRemoteResource, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        /*------------ 分布界面-公共使用 ----------------*/

        //更改当前远程数据接入步骤
        * setCurrentRemoteDataStepAction({currentRemoteDataStep}, {put}) {
            yield put({
                type: 'setCurrentRemoteDataStep',
                currentRemoteDataStep,
            });
        },





        /*-------------------End----------------------*/





    },

    reducers: {
        /*------------ 数据接入列表页  ----------------*/

        //(DataSyncList数据源列表页)更改判断是本地还是远程，local是本地，cluster是远程
        changeDataSourceType(state, {checkType}) {
            return {
                ...state,
                checkType,
            };
        },

        //更改远程数据选择的集群平台（远程接入）
        setClusterPlatformList(state, {clusterPlatformList}) {
            return {
                ...state,
                clusterPlatformList
            };
        },

        //获取数据任务总列表（本地）
        setSourceProcessorsList(state, {sourceProcessorsList}) {
            if (sourceProcessorsList.data.length > 1) {
                /*sourceProcessorsList.data.map((item) => {
                    /!* if (item.hasOwnProperty('uuid')) {
                         item.state = 'Uncommitted';
                         item.rate = '--';
                     }*!/
                    item.state = 'Uncommitted';
                    item.rate = '--';
                })*/
            }
            return {
                ...state,
                sourceProcessorsList,
            };
        },
        //设置数据任务接入总列表（远程接入）
        setClusterSourceProcessorsList(state, {sourceProcessorsList}) {
            return {
                ...state,
                sourceProcessorsList,
            };
        },
        //更改选择的数据类型
        changeCurrentDataInfo(state, {currentDataInfo}) {
            return {
                ...state,
                currentDataInfo,
            };
        },

        /*------------ 数据源详情页 ----------------*/
        //设置分发目的地详情信息
        setDataOriginDetail(state, {dataOriginDetail}) {
            let result = dataOriginDetail;
            if(result.hasOwnProperty('statistics') && result['statistics'].hasOwnProperty('statistics')){
                result['statistics']['statistics'] = state.addArrayKey(result['statistics']['statistics']);
            };
            if(result.hasOwnProperty('status')&&result['status'].hasOwnProperty('tasks')){
                result['status']['tasks' ] = state.addArrayKey(result['status']['tasks']);
            };
            return {
                ...state,
                dataOriginDetail:dataOriginDetail,
            };
        },


        /*------------ 分布界面  ----------------*/

        //设置新建数据源-选择数据源类型的列表(本地)
        setDataSourcePlugins(state, {dataOriginList}) {
            return {
                ...state,
                dataOriginList,
            };
        },
        //jdbc获取,数据源url地址列表
        getDataSourceList(state, {metadataManageUrlList}) {
            // console.log('metadataManageUrlList',metadataManageUrlList);
            return {
                ...state,
                metadataManageUrlList,
            }

        },

        /*------------ 数据分发  ----------------*/
        //设置新建数据源-选择数据源类型的列表
        setDataDestinationPlugins(state, {dataDestinationList}) {
            return {
                ...state,
                dataDestinationList,
            };
        },
        //获取processors详情（编辑、未使用）
        setDetailModalData(state, {detailModalData}) {
            return {
                ...state,
                detailModalData,
            };
        },
        //数据源配置-关闭或者打开新建数据源模态框
        changeDataSourceModalVisible(state, {dataSourceModalVisible}) {
            return {
                ...state,
                dataSourceModalVisible,
            }
        },
        //数据源配置-jdbc获取,根据数据源url地址id获取列表（jdbc输入）
        getDataResourceById(state, {metadataManageTableList}) {
            return {
                ...state,
                metadataManageTableList,
            }

        },
        //jdbc获取,根据数据源url地址id和表名获取字段名
        getFieldList(state, {fieldByTableIdList}) {
            return {
                ...state,
                fieldByTableIdList,
            }

        },



        //数据分发-（第二步）（jdbc）-单选数据资源（暂定、未使用）
        setDataResourceRadio(state, action) {
            return {
                ...state,
                dataResourceRadio: action.dataResourceRadio,
            };
        },
        //数据分发 - （第二步）关闭或者打开选择类型模态框（暂定、未使用）
        changeDataResourceModalVisible(state, {modalVisible,htmlType}) {
            if(htmlType === 'chooseResource'){
                return {
                    ...state,
                    dataResourceModalVisible: modalVisible,
                };
            }else{
                return {
                    ...state,
                    createDataResourceModalVisible: modalVisible,
                };
            }



        },
        //资源管理-注册资源-根据数据源选择数据资源（包括根据名称搜索数据资源）（暂定、未使用）
        setDataResourceFromDataSource(state, action) {
            return {
                ...state,
                dataResourceFromDataSource: action.dataResourceFromDataSource,
            };
        },
        //第三步 - 获取保存配置信息
        fetchDataSourceConfig(state, {configRules}) {
            //全部
            return {
                ...state,
                configRules:configRules
            };
        },
        //（第四步）更新任务状态
        updateTask(state, action) {
            return {
                ...state,
                updateReault: action.payload.data,
            };
        },
        //（第四步）获取单个任务详情
        getTaskDetail(state, action) {
            return {
                ...state,
                getMissionDetail: action.payload.data[0],
            };
        },




        /*------------ 公共使用 ----------------*/
        //更改数据源编辑状态
        changeProcessorEdit(state, {isProcessorEdit}) {
            T.storage.setStorage('HtmlType', {'modalType': state.modalType, 'isProcessorEdit': isProcessorEdit});
            return {
                ...state,
                isProcessorEdit,
            };
        },
        //更改当前步骤
        setCurrentStep(state, {currentStep}) {
            return {
                ...state,
                currentStep
            };
        },
        //更改数据源类型信息（本地）
        changeProcessorTypeInfo(state, {params}) {
            return {
                ...state,
                originActiveColor: params.originActiveColor,
                processorUuid: params.processorUuid,
            };
        },
        //保存数据源配置信息
        setFormData(state, {formData}) {
            return {
                ...state,
                formData
            };
        },
        //更改数据任务模态框类型dataOrigin是数据源,dataDestination是数据目的地
        changeModalType(state, {modalType}) {
            return {
                ...state,
                modalType,
            };
        },

        //本地保存数据源和数据目的地配置信息（本地保存）
        saveProcessorParamInfo(state, {processorParamInfo}) {
            return {
                ...state,
                processorParamInfo
            };
        },
        //数据接入/数据分发- 配置规则 - 关闭或者打开选择类型模态框
        changeFieldModalVisible(state, {modalVisible}) {
            return {
                ...state,
                addFieldModalVisible: modalVisible,
            }
        },



        /*------------------- 远程数据接入，分布界面  ----------------------*/
        //获取某一资源的元数据信息
        setLocalClusterInfo(state, {localClusterInfo}) {
            return {
                ...state,
                localClusterInfo
            };
        },
        //更改远程数据选择的集群平台
        setRemoteSelectedPlatform(state, {remoteSelectedPlatform, remoteSelectedPlatformInfo}) {
            return {
                ...state,
                remoteSelectedPlatform,
                remoteSelectedPlatformInfo,
            };
        },
        //设置平台资源数据
        setRemoteClusterResourceList(state, {platformResourceList}) {
            return {
                ...state,
                platformResourceList
            };
        },
        //更改远程数据选择的平台资源
        setRemoteSelectedResource(state, {remoteSelectedResource, remoteSelectedResourceInfo}) {
            return {
                ...state,
                remoteSelectedResource,
                remoteSelectedResourceInfo,
            };
        },
        //获取某一资源的元数据信息
        setRemoteClusterDataFieldList(state, {resourceDataFieldList}) {
            return {
                ...state,
                resourceDataFieldList
            };
        },

        /*------------ 分布界面-公共使用 ----------------*/
        //更改当前远程数据接入步骤
        setCurrentRemoteDataStep(state, {currentRemoteDataStep}) {
            return {
                ...state,
                currentRemoteDataStep
            };
        },



        /*-------------------End----------------------*/




    },
};
