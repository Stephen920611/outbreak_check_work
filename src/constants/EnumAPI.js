/**
 * @description
 * @Version Created by Stephen on 2019/8/16.
 * @Author Stephen
 * @license dongfangdianzi
 */
import './../config/ENV';


const _processAPI = (api) => {
    //未来可以把mock方法写在这里面
    if (window.ENV.isAntdProRequest) {
        return '/api' + api;
    }

    return api;
};

/**
 *
 * @param api
 * @return {string}
 */
const processDataList = (api) => api;

const EnumAPI = {
    /*
	 |----------------------------------------------------------------
	 | 登陆-相关的API地址
	 |----------------------------------------------------------------
	 */
    login: _processAPI('login'), // 登录

    /*
    |----------------------------------------------------------------
    | 连-h5-摸排统计页面-相关的API地址
    |----------------------------------------------------------------
    */
    fetchStatisticsList: _processAPI('home/count'), //摸排统计页面
    fetchRecordList: _processAPI('home/chart'), //摸排记录查询页面

    /*
   |----------------------------------------------------------------
   | 张-app-摸排统计页面-相关的API地址
   |----------------------------------------------------------------
   */
    fetchCheckRecordList: _processAPI('/member/pageByArea'),//获取摸排记录查询列表
    fetchSelectInfo: _processAPI('/dict/getByType'),//获取下拉选项
    fetchMemberInfo: (id) => processDataList('/member/get/' + id),//查看详情页面

    /*
   |----------------------------------------------------------------
   | 张-app-摸排工作统计页面-相关的API地址
   |----------------------------------------------------------------
   */
    fetchJobStatisticsList: _processAPI('/static/getStaticSum'),//获取摸排工作统计列表

    /*
  |----------------------------------------------------------------
  | 张-app-信息录入页面-相关的API地址
  |----------------------------------------------------------------
  */
    addInfo: _processAPI('/member/saveAll'),//信息录入
    deleteInfo: _processAPI('/member/del'),//删除信息

    /*
    |----------------------------------------------------------------
    | 首页-相关的API地址
    |----------------------------------------------------------------
    */
    fetchDashboardTopData: _processAPI('home/count'), //获取首页统计数据
    fetchChartLineData: _processAPI('home/chart'), //获取首页折线图数据

    /*
	 |----------------------------------------------------------------
	 | 元数据管理-相关的API地址
	 |----------------------------------------------------------------
	 */
    getQuickRegisterDataTree: _processAPI('metadata/metadataDataSource/getDataTree'), //快速注册
    // saveQuickRegister: _processAPI('metadata/metadataDataSource/registMetadataDataSource'), //添加数据资源配置(数据库)
    testQuickRegister: _processAPI('metadata/metadataDataSource/testMetadataDataSource'), //测试数据资源配置(数据库)
    saveRegisterQueueAndFile: _processAPI('metadata/metadataDataSource/registMetadataDataSourceQueueAndFile'), //添加数据资源配置（队列、文件）
    getTableInfosById: _processAPI('metadata/metadataDataSource/getTableInfos'),//根据表格或视图id获取具体表格信息
    getDataSourceSearch: _processAPI('metadata/metadataDataSource/search'),//元数据搜索
    getDataSourceAllList: _processAPI('metadata/metadataDataSource/searchDatabaseId'),//获取数据源类型
    getTableOrViewById: _processAPI('metadata/metadataDataSource/getTableOrView'),//根据数据源id获取数据源内的表和视图
    getMetadataManageTree: _processAPI('metadata/metadataDataSource/getDataManageTree'),//元数据管理-获取树
    /*
	 |----------------------------------------------------------------
	 | 元数据管理(修改后)-相关的API地址
	 |----------------------------------------------------------------
	 */
    getDataSourceManagementListServices: _processAPI('dataSource/listData'),//数据源管理-数据源列表(分页)
    getDataSourceManagementSelectServices: _processAPI('dataSource/listAll'),//数据源管理-数据源列表（不分页）
    getDataSourceTypeTreeServices: _processAPI('dataSource/types/treeData'),//数据源管理-新增数据源- 获取数据源类型树
    saveQuickRegister: _processAPI('dataSource'), //数据源管理-新增数据源 - 添加数据源配置
    updateDataSourceConfigServices: _processAPI('dataSource'), //数据源管理-编辑更新数据源
    deleteDataSourceServices: (id) => processDataList('dataSource/' + id), //数据源管理-删除数据源
    /*------------ 数据资源管理 ----------------*/
    getDataResourceTreeServices: _processAPI('dataResource/category/treeData'),//数据资源管理- 获取数据资源树
    getDataResourceManagementListServices: _processAPI('dataResource/listData'),//数据资源管理-获取数据资源列表
    addDataResourceManagement: _processAPI('dataResource'),//数据资源管理-新增资源
    getDataResource: (uuid) => processDataList('dataResource/' + uuid),//数据资源管理-查看数据资源详情
    deleteDataResource: (uuid) => processDataList('dataResource/' + uuid),//数据资源管理-删除数据源
    getDataResourceFromDataSource: (uuid) => processDataList('dataSource/' + uuid + '/exploration'),    //数据资源管理-根据数据源选择数据资源（包括根据名称搜索数据资源）
    /*------------ 管理元数据 ----------------*/
    getMetaDataTree: _processAPI('dataResource/treeData'),//管理元数据-获取数据源树类型
    // mataDataAutoExploration: _processAPI('matadata/exploration'),//管理元数据-自动探查功能
    mataDataAutoExploration: (params) => processDataList('dataSource/' + params.id + '/' + params.name + '/describe'),//管理元数据-自动探查功能
    saveResourceMetaData: (id) => processDataList('dataResource/' + id),//管理元数据-保存元数据

    /*
	 |----------------------------------------------------------------
	 | 数据接入-相关的API地址
	 |----------------------------------------------------------------
	 */

    //修改后
    fetchSourceProcessorsList: _processAPI('processor/source'), //获取数据源列表
    fetchClusterSourceProcessorsListAPI: _processAPI('cluster/resource/processor'), //获取数据源列表(远程)
    fetchDataMissionList: _processAPI('dataTask/getTask'), //获取数据任务总列表(未使用)
    fetchDataSourcePluginsAPI: _processAPI('plugins/source'), //获取输入数据源插件列表(点击新建数据源-选择数据源类型)
    deleteSourceProcessor: (uuid) => processDataList('processor/' + uuid),//删除数据源processors（本地）
    activateSourceProcessor: (uuid) => processDataList('processor/activate/' + uuid),//激活数据源（本地）
    resumeSourceProcessor: (uuid) => processDataList('processor/' + uuid + '/resume'),//开始数据源（本地）
    pauseSourceProcessor: (uuid) => processDataList('processor/' + uuid + '/pause'),//暂停数据源（本地）
    restartSourceProcessor: (uuid) => processDataList('processor/' + uuid + '/restart'),//重启数据源（本地）
    fetchDataOriginDetail: (uuid) => processDataList('processor/' + uuid + '/status'), //获取processors详情(数据源详情页，本地)

    deleteClusterSourceProcessor: (uuid) => processDataList('cluster/source/processor/' + uuid),//删除数据源processors（远程）
    activateClusterSourceProcessor: (uuid) => processDataList('cluster/source/processor/activate/' + uuid),//激活数据源（远程）
    resumeClusterSourceProcessor: (uuid) => processDataList('cluster/source/processor/' + uuid + '/resume'),//开始数据源（远程）
    pauseClusterSourceProcessor: (uuid) => processDataList('cluster/source/processor/' + uuid + '/pause'),//暂停数据源（远程）
    restartClusterSourceProcessor: (uuid) => processDataList('cluster/source/processor/' + uuid + '/restart'),//重启数据源（远程）
    fetchClusterDataOriginDetail: (uuid) => processDataList('cluster/source/processor/' + uuid + '/status'), //获取processors详情(数据源详情页，远程)

    //
    dataSyncSaveQuickRegister: _processAPI('dataSource'), //数据接入-新增数据源
    dataSyncSaveQuickRegisterDestination: _processAPI('dataDestinationSource'), //数据分发-新增数据源
    getDataSourceListDestinationServices: _processAPI('dataDestinationSource/listDestAll'),//数据分发-数据源列表（不分页）
    restartProcessorDetailTask: (uuid, taskId) => processDataList('processor/' + uuid + '/tasks/' + taskId + '/restart'),//重启详情页面运行状态的任务
    saveSourceConfig: _processAPI('processor/saveconfig'),  // 保存数据源配置
    getDetailLineDataById: (uuid) => processDataList('monitor/' + uuid + '/rate'),//根据id获取每分钟速率
    getProcessorsDetails: (uuid) => processDataList('processor/' + uuid), //获取processors详情(编辑页)
    getSinkDetails: (uuid) => processDataList('sink/' + uuid), //获取sink详情(编辑页)

    //数据接入-远程数据接入
    fetchRemoteClusterResourceList: _processAPI('cluster/resource/list'),//数据接入-远程数据接入-获取平台资源列表
    fetchRemoteClusterDataFieldList: _processAPI('cluster/datafield/list'),//数据接入-远程数据接入-获取某一资源的元数据信息
    activateRemoteResource: _processAPI('cluster/resource/activate'),//数据接入-远程数据接入-激活
    applyRemoteResource: _processAPI('cluster/resource/apply'),//数据接入-远程数据接入-向远程集群申请接入资源
    fetchLocalCluster: _processAPI('cluster/mycluster'),//数据接入-远程数据接入-获取本平台信息信息

    fetchDataDestinationPluginsAPI: _processAPI('plugins/sink'), //获取输出数据源插件列表(点击新建数据目的地-选择数据目的地类型)

    // getProcessorsDetails: _processAPI('task/processors'), //获取processors详情（点击连接后的详情页功能）
    // getProcessorsDetails: 'task/getprocessors', //获取processors详情（点击连接后的详情页功能）
    // updateTaskById:_processAPI('task/updateTask'),//更新任务
    updateTaskById: _processAPI('task/updateTask'),//点击下一步，更新任务
    getTaskDetailById: _processAPI('dataTask/getTaskInfo'),//获取任务详情
    /*
   |----------------------------------------------------------------
   | 数据分发-相关的API地址
   |----------------------------------------------------------------
   */
    // dataSyncSaveQuickRegisterDestination
    // saveSinkConfig: _processAPI('dist/destination'),  // 保存数据目的地配置
    saveSinkConfig: _processAPI('sink/'),  // 保存数据目的地配置
    getDestinationDetail: (uuid) => processDataList('sink/' + uuid + '/status'),//分发目的地详情页-获取分发目的地详情(本地)
    getInfoFormSource: (uuid) => processDataList('sink/' + uuid + '/list'), //获取数据分发列表（本地）
    restartDestinationChild: ({id, taskId}) => processDataList('sink/' + id + '/tasks/' + taskId + '/restart'),//分发目的地详情页-重启运行状态里的任务（本地）
    searchDistribute: ({uuid, name}) => processDataList('sink/' + uuid + '/' + name),//数据分发目的地列表页-查询数据分发目的地（本地）
    activateSinkProcessor: (uuid) => processDataList('sink/activate/' + uuid),//激活数据目的地（本地）

    // getInfoFormSource: (uuid) => processDataList('dist/' + uuid), //数据源里点击配置分发
    addDestination: _processAPI('dist/destination'), //新增(更新)数据分发目的地，put方法是更新，post方法是新增
    // runningDestination: (uuid) => processDataList('sink/' + uuid + '/start'),//数据分发目的地列表页-点击启动（启动某个数据分发目的地）
    runningDestination: (uuid) => processDataList('sink/activate/' + uuid),//数据分发目的地列表页-点击启动（启动某个数据分发目的地）
    pauseDestination: (uuid) => processDataList('sink/' + uuid + '/pause'),//数据分发目的地列表页-点击暂停（暂停某个数据分发目的地）
    restartDestination: (uuid) => processDataList('sink/' + uuid + '/restart'),//数据分发目的地列表页-点击重启（重启某个数据分发目的地）
    resumeDestination: (uuid) => processDataList('sink/' + uuid + '/resume'),//数据分发目的地列表页-点击恢复（恢复某个数据分发目的地）
    deleteDestination: (uuid) => processDataList('sink/' + uuid),//数据分发目的地列表页-点击删除（删除某个数据分发目的地）
    getDestination: (uuid) => processDataList('dist/destination/' + uuid),//数据分发目的地列表页-查看数据分发基本信息
    editDestination: _processAPI('dist/destination'),//数据分发目的地列表页-点击编辑（编辑某个数据分发目的地）
    // searchDistribute: ({uuid, name}) => processDataList('sink/' + uuid + '/' + name),//数据分发目的地列表页-查询数据分发目的地
    // getDestinationDetail:(uuid) => processDataList('dist/destination/' + uuid + '/status'),//分发目的地详情页-获取分发目的地详情
    // restartDestinationChild:({id,taskId}) => processDataList('dist/destination/' + id + '/tasks/' + taskId + '/restart'),//分发目的地详情页-重启运行状态里的任务
    getDetailLineDataBySinkId: (uuid) => processDataList('monitor/' + uuid + '/consumerAllRate'),//根据数据分发id获取每分钟速率


    getInfoFormClusterSource: (uuid) => processDataList('cluster/sink/processor/' + uuid + '/list'), //获取数据分发列表（远程）
    addClusterDestination: _processAPI('cluster/sink/processor/'), //新增(更新)数据分发目的地，put方法是更新，post方法是新增(远程)
    getClusterDestination: (uuid) => processDataList('cluster/sink/processor/' + uuid),//数据分发目的地列表页-查看数据分发基本信息(远程)
    deleteClusterDestination: (uuid) => processDataList('cluster/sink/processor/' + uuid),//数据分发目的地列表页-点击删除（删除某个数据分发目的地）（远程）
    runningClusterDestination: (uuid) => processDataList('cluster/sink/processor/' + uuid),//数据分发目的地列表页-点击启动（启动某个数据分发目的地）（远程）
    pauseClusterDestination: (uuid) => processDataList('cluster/sink/processor/' + uuid + '/pause'),//数据分发目的地列表页-点击暂停（暂停某个数据分发目的地）（远程）
    resumeClusterDestination: (uuid) => processDataList('cluster/sink/processor/' + uuid + '/resume'),//数据分发目的地列表页-点击恢复（恢复某个数据分发目的地）（远程）
    restartClusterDestination: (uuid) => processDataList('cluster/sink/processor/' + uuid + '/restart'),//数据分发目的地列表页-点击重启（重启某个数据分发目的地）（远程）

    getClusterDestinationDetail: (uuid) => processDataList('cluster/sink/processor/' + uuid + '/status'),//分发目的地详情页-获取分发目的地详情（远程）
    restartClusterDestinationChild: ({id, taskId}) => processDataList('cluster/sink/' + id + '/tasks/' + taskId + '/restart'),//分发目的地详情页-重启运行状态里的任务（远程）
    searchClusterDistribute: ({uuid, name}) => processDataList('cluster/sink/processor/' + uuid + '/' + name),//数据分发目的地列表页-查询数据分发目的地（远程）


    /*
   |----------------------------------------------------------------
   | 集群管理-相关的API地址
   |----------------------------------------------------------------
   */
    fetchClusterManageListAPI: _processAPI('cluster/list'),//集群管理 - 获取数据平台接口
    // deleteDataPlatformAPI: _processAPI('cluster/list'), //集群管理 - 删除数据平台
    fetchMessageListAPI: _processAPI('message/list'), //消息管理 - 获取任务消息列表
    fetchMessageStatueAPI: _processAPI('message/check'), //消息管理 - 审批消息状态修改（同意/拒绝）
    fetchSynchronizationAPI: _processAPI('cluster/synchronization'), //消息管理 - 审批消息状态修改（同意/拒绝）

};
export default EnumAPI;