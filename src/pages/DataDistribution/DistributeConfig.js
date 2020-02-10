import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './DistributeConfig.less';
import T from './../../utils/T';
import router from 'umi/router';
import {formatMessage} from 'umi-plugin-react/locale';

import {EnumPluginListPageInfo} from './../../constants/EnumPageInfo';
import { EnumProcessorStatus } from './../../constants/dataSync/EnumSyncCommon';
import SyncChooseDataTypeModal from './../DataSync/SyncChooseDataTypeModal';
import SyncConfigDataOriginModal from './../DataSync/SyncConfigDataOriginModal';
import SyncDetailDataModal from './../DataSync/SyncDetailDataModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';
import {
    Button,
    Icon,
    Input,
    Row,
    Divider,
    Col,
    Table,
    Popconfirm,
    Card,
} from 'antd';
const ButtonGroup = Button.Group;
//数据分发页面
/* eslint react/no-multi-comp:0 */
@connect(({dataDistribution, dataSyncNewMission, loading}) => ({
    dataDistribution,
    dataSyncNewMission,
    fetchDataMissionStatus: loading.effects['dataDistribution/getInfoFormSourceAction'],
}))
class DistributeConfig extends PureComponent {
    constructor() {
        super();
        this.state = {
            currentPage: EnumPluginListPageInfo.defaultPage,
            pageSize: EnumPluginListPageInfo.defaultPageSize,
            inputValue: "",
        };
    }

    componentDidMount() {
        const {dispatch, location} = this.props;
        //验证是否刷新页面
        T.auth.returnSpecialMainPage(location, '/dataDistribution');
        if (location.hasOwnProperty("params") && location["params"].hasOwnProperty("data")) {
            //设置当前信息
            dispatch({
                type: 'dataDistribution/setSourceInfoAction',
                sourceInfo: location["params"]["data"],
            });
            // 默认获取数据
            this.fetchDataList(location["params"]["data"]);
        }
        T.storage.setStorage('HtmlType', {'modalType':'dataDestination','isProcessorEdit':false});
    }

    //获取当前页数数据
    fetchDataList = (data) => {
        const {dispatch,dataDistribution} = this.props;
        const {platformType} = dataDistribution;
        dispatch({
            type: 'dataDistribution/getInfoFormSourceAction',
            uuid: platformType === 'local' ? data["uuid"] : data["id"],
        });
    };

    //查询功能
    searchDataDestination = () => {
        const {dispatch,dataDistribution} = this.props;
        const {sourceInfo} = dataDistribution;
        const {inputValue} = this.state;
        if(inputValue){
            dispatch({
                type: 'dataDistribution/searchDistributeListAction',
                uuid:sourceInfo.uuid,
                name:inputValue,
            });
        }else{
            this.fetchDataList(sourceInfo);
        }
    };

    //重置功能
    resetDataDestination = () => {
        let self = this;
        this.setState({
            inputValue: "",
            currentPage: EnumPluginListPageInfo.defaultPage
        },()=>{
            //重置之后重新获取首页数据
            self.searchDataDestination()
        });
    };

    //更改输入框
    onInputChange = (e) => {
        this.setState({
            inputValue: e.target.value,
        });
    };

    //详情功能
    showDetailModal = (data) => {
        const {dispatch,dataDistribution} = this.props;
        const {platformType} = dataDistribution;
        T.storage.setStorage('processorId', platformType === 'local' ? data.uuid : data.id);
        // T.storage.setStorage('processorId', data.id);
        router.push({
            pathname: "/dataDistribution/distributeDetail",
            params: {
                data: data,
                isRouterPush: true
            }
        })
    };

    //页码变换
    pageChange = (page) => {
        const {dataDistribution} = this.props;
        const {sourceInfo} = dataDistribution;
        this.setState({
            currentPage: page.current,
        }, () => {
            this.fetchDataList(sourceInfo);
        });
    };

    /**
     * 处理目的地的操作
     * @param {string} data 数据列
     * @param {string} type running启动 pause暂停 restart 重启 恢复是resume，delete是删除
     */
    handleDestination = (data, type) => {
        let self = this;
        const {dispatch, dataDistribution} = this.props;
        const {sourceInfo} = dataDistribution;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataDistribution/' + (type === 'running' ? 'runningDestinationAction' : type === 'pause' ? 'pauseDestinationAction' : type === 'restart' ? 'restartDestinationAction' : type === 'resume' ? 'resumeDestinationAction' : type === 'delete' ? 'deleteDestinationAction' : ''),
                uuid: data.id,//填写数据目的地的uuid
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                T.prompt.success(response.data);
                // 获取数据
                self.fetchDataList(sourceInfo);
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //编辑数据分发目的地
    editDestination = (item) => {
        const {dispatch} = this.props;
        //更改页面类型
        dispatch({
            type: 'dataSyncNewMission/changeModalTypeAction',
            modalType: 'dataDestination',
        });
        dispatch({
            //更新选中的信息
            type: 'dataSyncNewMission/changeCurrentDataInfoAction',
            currentDataInfo: {
                ...item['connectorPlugin'],
                uuid:item.uuid,
            },
        });
        //更改编辑状态
        dispatch({
            type: 'dataSyncNewMission/changeProcessorEditAction',
            isProcessorEdit: true
        });
        //跳到第二步
        dispatch({
            type: 'dataSyncNewMission/setCurrentStepAction',
            currentStep: 1,
        });
        router.push({
            pathname: '/dataDistribution/step-form/config',
            params: {
                isRouterPush: true,
                uuid: item.id
            },
        });
    };

    /**
     * 新增分发 - 打开新建目的地分步界面
     */
    showDataModal = () => {
        const {dispatch} = this.props;
        //更改页面类型
        dispatch({
            type: 'dataSyncNewMission/changeModalTypeAction',
            modalType: 'dataDestination',
        });
        //清空表单form表单数据
        dispatch({
            type: 'dataSyncNewMission/setFormDataAction',
            formData: {},
        });
        //清空选中的数据源（避免点击数据分发新建，再点击数据接入编辑，再点击数据分发，processorUuid默认选中，但currentDataInfo还是数据源的）
        dispatch({
            type: 'dataSyncNewMission/changeProcessorTypeInfoAction',
            params: {
                originActiveColor: '',
                processorUuid: '',
            },
        });
        //跳转到分步界面
        router.push({
            pathname: '/dataDistribution/step-form/sourceType',
            params: {
                isRouterPush: true,
            },
        });
    };

    render() {
        const {
            fetchDataMissionStatus,
            dataDistribution,
        } = this.props;
        const {sourceToSinkInfo, sourceInfo} = dataDistribution;
        const {destinations,source} = sourceToSinkInfo;
        const {inputValue} = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '分发目的地',
                dataIndex: 'name',
            },
            {
                title: '状态',
                dataIndex:'state',
                render: (text) => {
                    return !T.lodash.isUndefined(EnumProcessorStatus[text]) ? EnumProcessorStatus[text].label : EnumProcessorStatus['UNKNOWN'].label;
                },
            },
            {
                title: '备注',
                dataIndex: 'desc',
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
            },
            {
                title: '操作',
                render: (text, record) => {
                    return (
                        <Fragment>
                            <ButtonGroup>
                                <Button disabled={(record.state === EnumProcessorStatus['INACTIVED'].value) ? true: false} title="详情" size={"small"} onClick={() => this.showDetailModal(record)}>详情</Button>
                                <Button disabled={(record.state === EnumProcessorStatus['INACTIVED'].value || record.state === EnumProcessorStatus['FAILED'].value) ? false: true} title="启动" shape="circle" icon="caret-right" size={"small"} onClick={() => this.handleDestination(record, 'running')}/>
                                <Button disabled={record.state === EnumProcessorStatus['RUNNING'].value ? false: true} title="暂停" shape="circle" icon="pause" size={"small"} onClick={() => this.handleDestination(record, 'pause')}/>
                                <Button disabled={record.state === (EnumProcessorStatus['RUNNING'].value || record.state === EnumProcessorStatus['PAUSED'].value) ? false: true} title="重启" shape="circle" icon="redo" size={"small"} onClick={() => this.handleDestination(record, 'restart')}/>
                                <Button disabled={record.state === EnumProcessorStatus['PAUSED'].value ? false: true} title="恢复" shape="circle" icon="retweet" size={"small"} onClick={() => this.handleDestination(record, 'resume')}/>
                                <Popconfirm
                                    title="确定要删除这个任务吗?"
                                    onConfirm={this.handleDestination.bind(this, record, 'delete')}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <Button title="删除" shape="circle" icon="delete" size={"small"}
                                            disabled={record.state === EnumProcessorStatus['RUNNING'].value ? true : false}
                                    />
                                </Popconfirm>
                                <Button title="编辑" shape="circle" icon="edit" size={"small"}
                                        onClick={() => this.editDestination(record)}
                                        disabled={(record.state === EnumProcessorStatus['INACTIVED'].value || record.state === EnumProcessorStatus['PAUSED'].value || record.state === '') ? false : true}

                                />
                            </ButtonGroup>
                        </Fragment>
                    )
                },
            },
        ];
        const breadcrumb = [
            {
                linkTo: '/dashboard',
                name: '首页',
            },
            {
                linkTo:'/dataDistribution',
                name: '数据分发',
            },
            {
                name: '分发配置',
            },
        ];

        return (
            <PageHeaderWrapper
                title={sourceInfo.hasOwnProperty('name') ? sourceInfo.name : '---'}
                breadcrumbName={<CustomBreadcrumb dataSource={breadcrumb}/>}
                isSpecialBreadcrumb={true}
            >
                <Card style={{marginBottom: 20}}>
                    <Row className={styles.distributeTitle}>
                        <Col span={8}>
                            <span>接入人：</span>
                            <span>{source.hasOwnProperty('createBy') ? source.createBy : '---'}</span>
                        </Col>
                        <Col span={8} className={styles.distributeBtns}>
                            <span>创建时间：</span>
                            <span>{source.hasOwnProperty('createDate') ? T.moment(source.createDate).format('YYYY-MM-DD HH:mm:ss') : '---'}</span>
                        </Col>
                    </Row>
                    <Row className={styles.distributeTitle}>
                        <Col span={8}>
                            <span>数据源：</span>
                            <span className={styles.toPage}>{source.hasOwnProperty('sourceName') ? source.sourceName : '---'}</span>
                        </Col>
                        <Col span={8} className={styles.distributeBtns}>
                            <span>数据资源：</span>
                            <span className={styles.toPage}>{source.hasOwnProperty('resourceName') ? source.resourceName : '---'}</span>
                        </Col>
                    </Row>
                    <Row className={styles.distributeTitle}>
                        <Col span={16}>
                            <span>描述：</span>
                            <span>{source.hasOwnProperty('desc') ? source.desc : '---'}</span>
                        </Col>
                    </Row>
                </Card>
                <Row className={styles.distributeTitle}>
                    <Col span={8} className={styles.distributeBtns}>
                        <Button type="primary" onClick={this.showDataModal}>
                            <Icon type="plus"/>
                            <span>新增分发</span>
                        </Button>
                    </Col>
                    <Col span={11} style={{textAlign: 'right'}}>
                        <span>数据目的名称</span>
                        <Input
                            className={styles.distributeInput}
                            value={inputValue}
                            placeholder={formatMessage({id: 'dataDistribution.dataDestination.index.PlaceHolder',})}
                            onChange={this.onInputChange}
                        />
                    </Col>
                    <Col span={5} className={styles.distributeBtns} style={{textAlign: 'right'}}>
                        <Button onClick={this.searchDataDestination}>查询</Button>
                        <Button onClick={this.resetDataDestination} type="primary">重置</Button>
                    </Col>

                </Row>
                <Table
                    className={styles.distributeTable}
                    dataSource={destinations}
                    pagination={false}
                    columns={columns}
                    onChange={this.pageChange}
                    loading={fetchDataMissionStatus}
                />
                <SyncChooseDataTypeModal/>
                <SyncConfigDataOriginModal/>
                <SyncDetailDataModal/>
            </PageHeaderWrapper>
        );
    }
}

export default DistributeConfig;
