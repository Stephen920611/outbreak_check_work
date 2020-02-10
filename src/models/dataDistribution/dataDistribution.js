/**
 * @description
 * @Version Created by Stephen on 2019/8/12.
 * @Author Stephen
 * @license dongfangdianzi
 */

import {routerRedux} from 'dva/router';
import {
    getInfoFormSource,
    runningDestination,
    pauseDestination,
    restartDestination,
    resumeDestination,
    addDestination,
    updateDestination,
    deleteDestination,
    getDestination,
    editDestination,
    searchDistribute,
    getDestinationDetail,
    restartDestinationChild,
    getDetailLineDataBySinkId,
    activateSinkProcessor,

    getInfoFormClusterSource,
    addClusterDestination,
    updateClusterDestination,
    getClusterDestination,
    deleteClusterDestination,
    runningClusterDestination,
    pauseClusterDestination,
    resumeClusterDestination,
    restartClusterDestination,
    getClusterDestinationDetail,
    restartClusterDestinationChild,
    searchClusterDistribute,

} from '@/services/dataDistribution/dataDistribution';
import {
    fetchSourceProcessorsList,
    fetchClusterSourceProcessorsListServices,
} from '@/services/dataSync/dataSyncNewMission';
import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import T from '../../utils/T';

export default {
    namespace: 'dataDistribution',//要唯一

    state: {
        /*------------ 数据分发页面 ----------------*/
        sourceData: {
            sourceList: [],
        },//数据源列表
        sourceInfo: {},     //数据源详情信息，用来获取接口用的
        sourceToSinkInfo: {
            source: {},
            destinations: [],
        },   //数据源对应的所有目的地信息
        destinationDetail: {
            processor: {},//分发目的地详情
            status: {
                tasks: [],//运行状态下列表
            },//运行状态
            statistics: {
                statistics: [],//数据统计列表
            },//数据统计
            logs: [],//日志信息
        },
        addArrayKey: function (data) {
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
        platformType: 'local',//判断是本地还是远程, local是本地，cluster是远程

    },


    effects: {
        //获取数据源列表（也就是数据分发列表）
        * fetchSourceListAction({params, resolve, reject}, {put, call}) {
            try {
                const response = yield call(fetchSourceProcessorsList, params);
                resolve(response);
                if (response.result === 'true') {
                    //处理后的数据
                    let endData = [];
                    T.lodash.orderBy(response.data.data, 'create_date', 'desc').map((val, idx) => {
                        endData.push({
                            ...val,
                            key: idx + 1,
                            description: val.des,
                            updatedAt: val['create_date'],
                        })
                    });
                    yield put({
                        type: 'setSourceData',
                        sourceData: {
                            ...response.data,
                            count: response.data.total,
                            sourceList: endData,
                        },
                    });
                } else {
                    T.prompt.error(response.message);
                }
            } catch (error) {
                reject(error)
            }

        },

        //获取远程数据源列表（也就是数据分发列表）
        * fetchRemoteClusterListAction({params, resolve, reject}, {put, call, all}) {
            try {
                const response = yield call(fetchClusterSourceProcessorsListServices, params);
                resolve(response);
                if (response.result === 'true') {
                    //处理后的数据
                    let endData = [];
                    T.lodash.orderBy(response.data.list, 'createDate', 'desc').map((val, idx) => {
                        endData.push({
                            ...val,
                            key: idx + 1,
                            desc: val.des,
                            updatedAt: val['createDate'],
                        })
                    });
                    yield put({
                        type: 'setSourceData',
                        sourceData: {
                            ...response.data,
                            sourceList: endData,
                        },
                    });
                } else {
                    T.prompt.error(response.message);
                }
            } catch (error) {
                reject(error);
            }
        },

        //设置数据分发的平台类型：local是本地，cluster是远程
        * setPlatformTypeAction({platformType}, {put}) {
            //类似于reducer，
            // console.log('platformType',platformType)
            yield put({
                type: 'setPlatformType',
                platformType,
            });
        },

        //设置数据源详情信息
        * setSourceInfoAction({sourceInfo}, {put}) {
            //类似于reducer，
            yield put({
                type: 'setSourceInfo',
                sourceInfo,
            });
        },

        //数据源里点击配置分发
        * getInfoFormSourceAction({uuid}, {put, call, select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            const response = platformType === 'local' ? yield call(getInfoFormSource, uuid) : yield call(getInfoFormClusterSource, uuid);
            // const response = yield call(getInfoFormSource, uuid);
            if (response.result === 'true') {
                let endData = [];
                response.data.destinations.map((val, idx) => {
                    endData.push({
                        ...val,
                        key: idx + 1,
                    })
                });
                response.data['destinations'] = endData;
                yield put({
                    type: 'setSourceToSinkInfo',
                    sourceToSinkInfo: response.data,
                });
            } else {
                T.prompt.error(response.message);
            }
        },

        //新增数据分发目的地
        * addDestinationAction({params, resolve, reject}, {call, put, select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(addDestination, params) : yield call(addClusterDestination, params);
                // const response = yield call(addDestination, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //更新数据分发目的地
        * updateDestinationAction({params, resolve, reject}, {call, put, select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(updateDestination, params) : yield call(updateClusterDestination, params);
                // const response = yield call(updateDestination, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //启动数据分发目的地
        * runningDestinationAction({uuid, resolve, reject}, {put, call, select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(runningDestination, uuid) : yield call(runningClusterDestination, uuid);
                // const response = yield call(runningDestination, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //暂停数据分发目的地
        * pauseDestinationAction({uuid, resolve, reject}, {put, call, select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(pauseDestination, uuid) : yield call(pauseClusterDestination, uuid);
                // const response = yield call(pauseDestination, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //重新启动数据分发目的地
        * restartDestinationAction({uuid, resolve, reject}, {put, call,select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(restartDestination, uuid) : yield call(restartClusterDestinationChild, uuid);
                // const response = yield call(restartDestination, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //恢复某个数据分发目的地
        * resumeDestinationAction({uuid, resolve, reject}, {put, call,select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(resumeDestination, uuid) : yield call(resumeClusterDestination, uuid);
                // const response = yield call(resumeDestination, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //删除数据分发目的地
        * deleteDestinationAction({uuid, resolve, reject}, {put, call, select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(deleteDestination, uuid) : yield call(deleteClusterDestination, uuid);
                // const response = yield call(deleteDestination, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //数据分发目的地列表页-查看数据分发基本信息
        * getDestinationAction({uuid, resolve, reject}, {call, put, select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(getDestination, uuid) : yield call(getClusterDestination, uuid);
                // const response = yield call(getDestination, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //编辑数据分发目的地
        * editDestinationAction({params, resolve, reject}, {put, call}) {
            try {
                const response = yield call(editDestination, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //查询数据分发目的地
        * searchDistributeListAction({uuid, name}, {put, call,select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            const response = platformType === 'local' ? yield call(searchDistribute, {uuid, name}) : yield call(searchClusterDistribute, {uuid, name});
            // const response = yield call(searchDistribute, {uuid, name});
            let endData = [];
            if (response.result === 'true') {
                response.data.map((val, idx) => {
                    endData.push({
                        ...val,
                        key: idx + 1,
                    })
                });
                yield put({
                    type: 'searchDistributeList',
                    sourceToSinkInfo: endData,
                });
            } else {
                T.prompt.error(response.message);
            }

        },

        //获取分发目的地详情
        * getDestinationDetailAction({uuid}, {put, call, select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            // const response = yield call(getDestinationDetail, uuid);
            const response = platformType === 'local' ? yield call(getDestinationDetail, uuid) : yield call(getClusterDestinationDetail, uuid);
            if (response.result === 'true') {
                yield put({
                    type: 'setDestinationDetail',
                    destinationDetail: response.data,
                });
            } else {
                T.prompt.error(response.message);
            }
        },

        //分发目的地详情页-重启运行状态里的任务
        * restartDestinationChildAction({id, taskId, resolve, reject}, {put, call,select}) {
            const platformType = yield select(state => state.dataDistribution.platformType);
            try {
                const response = platformType === 'local' ? yield call(restartDestinationChild, {id, taskId}) : yield call(restartClusterDestination, {id, taskId});
                // const response = yield call(restartDestinationChild, {id, taskId});
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //根据id获取每分钟速率
        * getDetailLineDataBySinkIdAction({id, params, resolve, reject}, {call}) {
            try {
                const response = yield call(getDetailLineDataBySinkId, id, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },
        //数据目的地 - 激活
        * activateSinkProcessorAction({uuid, resolve, reject}, {put, call}) {
            try {
                const response = yield call(activateSinkProcessor, uuid);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

    },

    reducers: {
        //设置数据源列表
        setSourceData(state, {sourceData}) {
            return {
                ...state,
                sourceData,
            };
        },
        //设置数据分发的平台类型：local是本地，cluster是远程
        setPlatformType(state, {platformType}) {
            return {
                ...state,
                platformType,
            };
        },
        //设置数据源详情信息
        setSourceInfo(state, {sourceInfo}) {
            return {
                ...state,
                sourceInfo,
            };
        },
        //设置数据目的地列表
        setSourceToSinkInfo(state, {sourceToSinkInfo}) {
            return {
                ...state,
                sourceToSinkInfo,
            };
        },

        //根据名字查询数据目的地列表
        searchDistributeList(state, {sourceToSinkInfo}) {
            state.sourceToSinkInfo['destinations'] = sourceToSinkInfo;
            return {
                ...state,
            };
        },
        //设置分发目的地详情信息
        setDestinationDetail(state, {destinationDetail}) {
            let result = destinationDetail;
            if (result.hasOwnProperty('statistics') && result['statistics'].hasOwnProperty('statistics')) {
                result['statistics']['statistics'] = state.addArrayKey(result['statistics']['statistics']);
            }
            ;
            if (result.hasOwnProperty('status') && result['status'].hasOwnProperty('tasks')) {
                result['status']['tasks'] = state.addArrayKey(result['status']['tasks']);
            }
            ;
            return {
                ...state,
                destinationDetail: result,
            };
        },

    },
};
