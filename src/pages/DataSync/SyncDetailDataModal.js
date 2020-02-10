import React, {PureComponent, Fragment} from 'react';
import styles from './SyncDetailDataModal.less';
import {connect} from 'dva';
import {
    Modal,
    Row,
    Col,
    Button,
    Popconfirm,
    Spin,
    Icon
} from 'antd';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import {EnumModalFormContent, EnumCreateProcessorSpecialParam, EnumProcessorNoShowParams} from './../../constants/dataSync/EnumSyncConfigModal';
import {EnumIconSrc} from './../../constants/dataSync/EnumSyncCommon';
import T from './../../utils/T';
import testMysql from './imgs/testMysql.jpg';

//数据源或者目的地详情模态框
/* eslint react/no-multi-comp:0 */
@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    fetchStatus: loading.effects['dataSyncNewMission/getProcessorsDetailsAction'],
}))
class SyncDetailDataModal extends PureComponent {
    state = {};

    //关闭模态框
    closeModal = () => {
        const {dataSyncNewMission, dispatch} = this.props;
        const {detailDataModalVisible} = dataSyncNewMission;
        //关闭模态框并且清空数据
        dispatch({
            type: 'dataSyncNewMission/changeDetailDataModalAction',
            detailDataModalVisible: !detailDataModalVisible
        });
        dispatch({
            type: "dataSyncNewMission/setDetailModalDataAction",
            detailModalData: {}
        })
    };

    //重新连接功能
    reLink = () => {
        //重新连接接口暂时不做
    };

    //编辑功能
    editDetail = () => {
        const {dataSyncNewMission, dispatch} = this.props;
        const {detailDataModalVisible, configDataModalVisible} = dataSyncNewMission;
        //更改页面类型
        dispatch({
            type: 'dataSyncNewMission/changeHtmlTypeAction',
            htmlType: 'dataSync',
        });
        //隐藏当前窗口
        dispatch({
            type: 'dataSyncNewMission/changeDetailDataModalAction',
            detailDataModalVisible: !detailDataModalVisible
        });
        //打开新建窗口
        dispatch({
            type: 'dataSyncNewMission/changeConfigDataModalAction',
            configDataModalVisible: !configDataModalVisible
        });
        //更改为编辑状态
        dispatch({
            type: 'dataSyncNewMission/changeConfigModalEditAction',
            isEdit: true,
        });
    };

    //删除processors
    removeDetail = () => {
        let self = this;
        const {dataSyncNewMission, dispatch} = this.props;
        const {detailModalData} = dataSyncNewMission;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/deleteProcessorAction',
                params: {
                    id: detailModalData.uuid
                },
                resolve,
                reject
            });
        }).then((response) => {
            if (response.result === "true") {
                T.prompt.success(response.data);
                //删除成功关闭模态框
                self.closeModal();
                //获取任务列表
                dispatch({
                    type: 'dataSyncNewMission/getAllProcessorListActive',
                });
            } else {
                T.prompt.error(response.message)
            }
        });

    };

    //渲染所有数据
    renderAllFormData = (dataSource) => {
        const {dataSyncNewMission} = this.props;
        const {modalType, currentDataInfo,metadataManageUrlList} = dataSyncNewMission;
        //后台返回的数据
        let keysArr = dataSource.hasOwnProperty("config") ? T.lodash.keys(dataSource['config']) : [];
        //页面展示的所有的内容的key
        let keys;
        //当前的className ，也就是connector.class
        let connectorClass;
        //容错赋值
        if(dataSource.hasOwnProperty("config") && dataSource['config'].hasOwnProperty("connector.class")){
            keys = T.lodash.keys(EnumModalFormContent[modalType][(dataSource['config']["connector.class"])]);
            connectorClass = dataSource['config']["connector.class"];
        }
        //有些参数是固定写死加上的，但是后端也会返回，前端不需要显示，所以需要按照种类去掉
        T.lodash.keys(EnumProcessorNoShowParams).map( val => {
            if(connectorClass === val){
                T.lodash.pullAll(keysArr, EnumProcessorNoShowParams[connectorClass]);
            }
        });
        //去掉写死参数后有些还需要动态加上别的东西，在这里处理
        switch (connectorClass) {
            case "io.confluent.connect.jdbc.JdbcSourceConnector":
                //jdbc 输入(不需要显示黑白名单)
                /*keysArr.push('table.tablelist');
                keysArr = T.lodash.uniq(keysArr);
                let tableList = '';
                if(dataSource['config'].hasOwnProperty('table.whitelist')){
                    tableList = 'whitelist'
                }else{
                    tableList = 'blacklist'
                }
                let config = dataSource['config'];
                dataSource['config']={
                    ...config,
                    "table.tablelist":tableList
                };*/
                //后端返回的数据源信息为url,而显示的为数据源的名字
                metadataManageUrlList.map((item,index) =>{
                    if(dataSource['datasourceId'] == item.id){
                        dataSource['config']['connection.url'] = item.databaseName;
                    }
                });
                break;
            case "io.confluent.connect.jdbc.JdbcSinkConnector":
                //后端返回的数据源信息为url,而显示的为数据源的名字
                metadataManageUrlList.map((item,index) =>{
                    if(dataSource['datasourceId'] == item.id){
                        dataSource['config']['connection.url'] = item.databaseName;
                    }
                });
                break;
            case "cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector":
                //后端返回的数据源信息为url,而显示的为数据源的名字
                metadataManageUrlList.map((item,index) =>{
                    if(dataSource['datasourceId'] == item.id){
                        dataSource['config']['databaseInfoId'] = item.databaseName;
                    }
                });
                break;
        }
        //枚举的文件key数组,keysArr为返回数据的key值，keys为表格需要的key值
        return keysArr.map( (item,idx) => {
            if( item !== "connector.class" && item !== "name" && item !== EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]["key"]){
                //枚举的格式化的form表单数据
                let formId;
                keys.map( val => {
                    if (item === EnumModalFormContent[modalType][dataSource['config']["connector.class"]][val]["mapTo"]){
                        formId = EnumModalFormContent[modalType][(dataSource['config']["connector.class"])][val]["formatValue"]
                    }
                });
                return (
                    <Row className={styles.modalBottomItem} key={idx}>
                        <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                            {formatMessage({id: formId})}
                        </Col>
                        <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                            {dataSource['config'][item]}
                        </Col>
                    </Row>
                )
            }
        })
    };

    //获取（元数据管理）数据源
    getDataManageUrl =(dataSource) =>{
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/getMetadataManageTreeAction',
        });
    };

    render() {
        const {
            dataSyncNewMission,
            fetchStatus,
        } = this.props;
        const {modalType, detailDataModalVisible, detailModalData, currentDataInfo} = dataSyncNewMission;
        let imgUrl = currentDataInfo.hasOwnProperty("icon") ? EnumIconSrc[currentDataInfo["icon"]]["url"] : testMysql;
        return (
            <Modal
                title={(modalType === "dataOrigin" ? "数据源详情页" : "数据目的地详情页" )}
                visible={detailDataModalVisible}
                footer={null}
                centered={true}
                onCancel={this.closeModal}
                className={styles.detailModal}
            >
                <Row className={styles.modalTop}>
                    <Col className={styles.modalTopLeft} xl={18} lg={18} md={18} sm={24} xs={24}>
                        {/*<img src={testMysql} alt=""/>*/}
                        <img src={imgUrl} alt=""/>
                        <ul>
                            <li>
                                <span>
                                    {detailModalData.hasOwnProperty("name") ? detailModalData["name"] : "--"}
                                </span>
                                <Icon title={"编辑"} type="edit" theme="filled" onClick={this.editDetail}/>
                                <Popconfirm
                                    title="确定要删除这个processor吗？"
                                    onConfirm={this.removeDetail}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <Icon title={"删除"} type="delete" theme="filled"/>
                                </Popconfirm>
                            </li>
                            <li>
                                创建者：
                                <span>{detailModalData.hasOwnProperty("createBy") ? detailModalData.createBy : "--"}</span>
                                <span>{detailModalData.hasOwnProperty("createDate") ? T.helper.dateFormat(detailModalData.createDate) : "--"}</span>
                            </li>
                        </ul>
                    </Col>
                    <Col className={styles.modalTopRight} xl={6} lg={6} md={6} sm={24} xs={24}>
                        <Button
                            onClick={this.reLink}
                            icon="redo"
                        >
                            重新连接
                        </Button>
                    </Col>
                </Row>
                <div className={styles.modalBottom}>
                    {
                        fetchStatus ? <Spin/> : this.renderAllFormData(detailModalData)
                    }
                </div>
            </Modal>
        );
    }
}

export default SyncDetailDataModal;
