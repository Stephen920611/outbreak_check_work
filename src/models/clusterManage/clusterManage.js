import {routerRedux} from 'dva/router';
import {
    fetchMessageListServices,
    fetchClusterManageListServices,
    // deleteDataPlatformServices,
    fetchMessageStatueServices,
    fetchSynchronizationServices,
    // deleteMessageServices,
} from '@/services/clusterManage/clusterManage';
import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import T from '../../utils/T';

export default {
    namespace: 'clusterManage',//要唯一
    state: {
        /*------------ 集群管理页面 ----------------*/
        clusterMessage: {},//消息管理 - 消息（列表，总量）
        clusterManageList: [],//集群管理 - 集群列表
        clusterManageTotal: 0,//集群管理 - 集群总数
        ClusterVisible:false,//操作模态框的显示
        // messageType:'check',//消息的类型
    },


    effects: {
        //集群管理 - 获取集群平台列表
        * fetchClusterManageListAction({params}, {put, call}) {
            const response = yield call(fetchClusterManageListServices, params);
            if (response.result === 'true') {
                //处理后的数据
                let endData = [];
                response.data.list.map((val, idx) => {
                    endData.push({
                        ...val,
                        key: idx + 1,
                    })
                });
                yield put({
                    type: 'fetchClusterManageList',
                    clusterManageList: endData,
                    clusterManageTotal:response.data.count
                });
            } else {
                T.prompt.error(response.message);
            }
        },
        //集群管理 - 删除数据平台
        * deleteDataPlatformAction({id, resolve, reject}, {call}) {
            try {
                const response = yield call(deleteDataPlatformServices, id);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //集群管理 - 同步
        * fetchSynchronizationAction({resolve, reject}, {call}){
            try {
                const response = yield call(fetchSynchronizationServices);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //消息管理 - 获取消息列表
        * fetchMessageListAction({messageType,params}, {put, call,select}) {
            // const messageType = yield select(state => state.clusterManage.messageType);
            const response = yield call(fetchMessageListServices, params);
            if (response.result === 'true') {
                let endData = [];
                if(messageType === 'apply' && response.data && response['data']['pageData'] && response['data']['pageData']['list'].length>0){
                    response['data']['pageData']['list'].map((item)=>{
                        let data = {
                            ...item['apply'],
                            remoteClusterName:item.remoteClusterName
                        };
                        endData.push(data);
                    });
                    response['data']['pageData']['list'] = endData
                }
                yield put({
                    type: 'fetchMessageList',
                    clusterMessage: response.data,
                });
            } else {
                yield put({
                    type: 'fetchMessageList',
                    clusterMessage: [],
                });
                T.prompt.error(response.message);
            }
        },

        //修改消息状态（同意/拒绝）
        * fetchMessageStatueAction({params, resolve, reject}, {call,put}) {
            try {
                const response = yield call(fetchMessageStatueServices, params);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        },

        //删除消息
        * deleteMessageAction({id,resolve,reject},{call}){
            // try {
            //     const response = yield call(deleteMessageServices, id);
            //     resolve(response);
            // } catch (error) {
            //     reject(error);
            // }
        }


    },

    reducers: {
        //集群管理 - 平台列表
        fetchClusterManageList(state,{clusterManageList,clusterManageTotal}){
            return {
                ...state,
                clusterManageList,
                clusterManageTotal,
            };
        },
        //设置消息列表
        fetchMessageList(state, {clusterMessage}) {
            return {
                ...state,
                clusterMessage,
            };
        },
        //更改判断是申请还是待审批，check是待审批，apply是远程
        /*changeMessageType(state, {messageType}) {
            return {
                ...state,
                messageType,
            };
        },*/

    },
};
