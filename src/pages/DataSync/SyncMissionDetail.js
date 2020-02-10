import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './SyncMissionDetail.less';
import styleNewTaskFlow from './NewTaskFlow.less';
import T from './../../utils/T';
import router from 'umi/router';

import {EnumIconSrc} from './../../constants/dataSync/EnumSyncCommon';

import testMysql from './imgs/testMysql.jpg';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddDataLine from "./AddDataLine";
import RateLine from "./RateLine";
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import SyncConfigDataOriginModal from './SyncConfigDataOriginModal';
import SyncDetailDataModal from './SyncDetailDataModal';
import {
    Card,
    Button,
    Icon,
    Input,
    Select,
    Tooltip,
    Row,
    Col,
    Spin,
    Timeline,
    Tabs,
    Modal,
    Form,
    Popconfirm,
} from 'antd';

const {TabPane} = Tabs;
const {Option} = Select;
const FormItem = Form.Item;

//修改任务Modal
@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    loading: loading.models.dataSyncNewForm,
}))
@Form.create()
class ChangeMissionNameModal extends PureComponent {
    state = {
        submitFormLayout: {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 10, offset: 8},
            },
        },
        submitLoading: false,
    };
    //更改任务名称
    onSubmitMissionName = (e) => {
        let self = this;
        const {dispatch, form, closeMissionNameModal, dataSyncNewMission} = this.props;
        const {getMissionDetail} = dataSyncNewMission;
        this.setState({
            submitLoading: true
        });
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = {
                    createBy: '',
                    createDate: '',
                    des: '',
                    name: values.missionName,
                    status: '',
                    step: '5',
                    updateBy: T.auth.getLoginInfo().user.loginCode,
                    updateDate: '',
                    sink: getMissionDetail.sink,
                    source: getMissionDetail.source,
                    uuid: T.storage.getStorage('taskId'),
                };
                const {dispatch} = this.props;
                new Promise((resolve, reject) => {
                    dispatch({
                        type: 'dataSyncNewMission/updateTaskByIdAction',
                        params,
                        resolve,
                        reject,
                    });
                }).then(response => {
                    if (response.result === 'true') {
                        self.setState({
                            submitLoading: false
                        });
                        closeMissionNameModal();
                        let params = {
                            taskId: T.storage.getStorage('taskId'),
                        };
                        //获取任务详情
                        dispatch({
                            type: 'dataSyncNewMission/getTaskDetailByIdAction',
                            params,
                        });

                    } else {
                        T.prompt.error(response.message);
                    }
                });

            }
        })
    };

    render() {
        const {
            MissionNameModalState,
            closeMissionNameModal,
            dataSyncNewMission,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {modalType, dataOriginList, dataDestinationList} = dataSyncNewMission;
        const {submitFormLayout, submitLoading} = this.state;

        return (
            <Modal
                title="修改任务名"
                visible={MissionNameModalState}
                footer={null}
                onCancel={closeMissionNameModal}
                centered={true}
                // className={styles.dataOriginModal}
            >
                <div>
                    <Form onSubmit={this.onSubmitMissionName} hideRequiredMark>
                        <FormItem
                            label={
                                <FormattedMessage id="form.syncConfigDataOriginModal.MissionName.label"/>
                            }
                        >
                            {getFieldDecorator('missionName', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({
                                            id: 'form.syncConfigDataOriginModal.MissionName.placeholder',
                                        }),
                                    },
                                ],
                            })(
                                <Input
                                    autoComplete="off"
                                    // disabled=true
                                    placeholder={formatMessage({
                                        id: 'form.syncConfigDataOriginModal.MissionName.placeholder',
                                    })}
                                />
                            )}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24}}>

                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                htmlType="submit"
                                loading={submitLoading}
                            >
                                <FormattedMessage id="form.syncConfigDataOriginModal.submit"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                onClick={closeMissionNameModal}
                                // loading={createStatus}
                            >
                                <FormattedMessage id="form.syncConfigDataOriginModal.clear"/>
                            </Button>

                        </FormItem>

                    </Form>
                </div>
            </Modal>
        );
    }
}

//任务详情页面（立即激活或者是查看当前所有信息）
/* eslint react/no-multi-comp:0 */
@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    loading: loading.effects['dataSyncNewMission/getTaskDetailByIdAction'],
}))
class SyncMissionDetail extends PureComponent {
    constructor() {
        super();
        this.websocketConstructor = null;
        this.lineTimer = null;
        this.state = {
            activeText: {
                btn: '立即激活',
                context: '任务已设置完毕，请点击[立即激活]开始任务'
            },
            rateLineData: [], // 折线图速度数据
            minutesValue: "oneMin", //默认是近1分钟（一个选项控制三个数据）
            activeState: false,
            fakeData: {},//后台返回的数据
            MissionNameModalState: false,
        };
    }

    componentDidMount() {
        let self = this;
        const {dispatch, location} = this.props;
        //验证是否刷新页面
        // T.auth.returnSpecialMainPage(location, '/dataTask');
        let params = {
            taskId: T.storage.getStorage('taskId'),
        };
        // //获取任务详情
        // dispatch({
        //     type: 'dataSyncNewMission/getTaskDetailByIdAction',
        //     params,
        // });
        //默认获取一次数据
        this.fetchLineData();
        //获取当前折线图数据
        this.lineTimer = setInterval(function () {
            self.fetchLineData();
        },1000 * 60);
        //如果路由里有带过来的参数，发送websocket
        if (location.hasOwnProperty("params") && location.params.hasOwnProperty("data")) {
            // //判断是否为进行中的状态
            // if (location.params.data.hasOwnProperty("step") && location.params.data.step === '6') {
            //     self.setState({
            //         activeState: true,
            //     });
            //     // 发送websocket
            //     this.websocketRunning(location, self);
            // }
        }
    };

    componentWillUnmount() {
        let self = this;
        //清除定时器
        clearInterval(this.lineTimer);
        //如果不为null，关闭websocket
        if (this.websocketConstructor) {
            this.websocketConstructor.close();
            //必须要销毁绑定的事件，否则会每进来一次就多触发一次
            this.websocketConstructor.unon("open");
            this.websocketConstructor.unon("message");
            //销毁websocket实例
            this.websocketConstructor.on("close", function (data) {
                self.websocketConstructor = null;
            });
        }
    };

    //根据id获取每分钟速率
    fetchLineData = () => {
        let uuid = T.storage.getStorage('processorId');
        //当前时间的时间戳
        let currentDate = new Date().getTime();
        //当前时间
        let currentTime = T.helper.dateFormat(currentDate);
        //半小时前时间
        let beforeTime = T.helper.dateFormat( (currentDate - 1000 * 60 * 30) );
        let self = this;
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/getDetailLineDataByIdAction',
                id: uuid,
                // id: '__consumer_offsets',
                params: {
                    startTime: beforeTime,
                    endTime: currentTime,
                },
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                self.setState({
                    rateLineData: JSON.parse(response.data)
                })
            }else {
                T.prompt.error(response.message)
            }
        });
    };

    //websocket获取数据
    websocketRunning = (location, self) => {
        let taskId = location.params.data.hasOwnProperty("taskId") ? location.params.data["taskId"] : "";
        //实例化websocket
        this.websocketConstructor = new T.Socket({
            isStart: true,                          // 是否开启websocket服务
            // domain: 'ws://172.20.41.137:10004',         // websocket domain地址
            domain: 'ws://192.168.10.122:8080',         // websocket domain地址
            opts: {
                path: '/datadist/websocket/20',                    //path
            }
        });

        //连接成功的时候需要传给后台任务id（taskId）
        this.websocketConstructor.on("open", function () {
            self.websocketConstructor.send(taskId)
        });
        //收到后台返回的数据时候的
        this.websocketConstructor.on("message", function (datas) {
            if (datas.hasOwnProperty('isTrusted') && datas.isTrusted && datas.data !== "连接成功") {
                if (!T.moment(datas.data).valueOf()) {
                    self.setState({
                        fakeData: JSON.parse(datas.data),
                    })
                }
            }
        });
    };


    callback = (key) => {
        // console.log(key);
    };

    //查看详情页面
    showDetail = (type) => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {getMissionDetail} = dataSyncNewMission;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/getProcessorsDetailsAction',
                id: type == 'dataOrigin' ? getMissionDetail.hasOwnProperty('source') ? getMissionDetail.source : '' : getMissionDetail.hasOwnProperty('sink') ? getMissionDetail.sink : '',
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                let connectorClass = response.data['config']['connector.class'];
                if (connectorClass === 'io.confluent.connect.jdbc.JdbcSourceConnector' || connectorClass === 'io.confluent.connect.jdbc.JdbcSinkConnector') {
                    dispatch({
                        type: 'dataSyncNewMission/getMetadataManageTreeAction',
                    });
                }
            }
        });

        dispatch({
            type: 'dataSyncNewMission/changeModalTypeAction',
            modalType: type,
        });
        //详情页显示
        dispatch({
            type: 'dataSyncNewMission/changeDetailDataModalAction',
            detailDataModalVisible: !this.state.detailDataModalVisible,
        });
    };

    //复制任务
    copyMission = () => {
    };

    //编辑任务
    editMission = () => {
        this.setState({
            MissionNameModalState: true,
        });
    };

    //删除任务
    deleteMission = () => {
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/deleteMissionAction',
                params: {
                    id: T.storage.getStorage('taskId'),
                },
                resolve,
                reject,
            });
        }).then(response => {
            router.push({
                pathname: '/dataTask/dataSync',
            });
            if (response.result === 'true') {
                T.prompt.success(response.data);
                //返回任务列表页
                router.push({
                    pathname: '/dataTask/dataSync',
                });
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //更改时间选择，对应展示不同数据
    changeTime = (value) => {
        this.setState({
            minutesValue: value
        });
    };

    // 关闭修改任务名模态框
    closeMissionNameModal = () => {
        this.setState({
            MissionNameModalState: false,
        });
    };

    //渲染title
    renderTitle = (getMissionDetail) => {
        return (
            <Row className={styles.detailHeaderTitle}>
                {/*TODO 暂时不要*/}
                {/*<Col xl={16} lg={16} md={16} sm={16} xs={16} className={styles.detailHeaderTitleLeft}>*/}
                    {/*<Icon type="left"/>*/}
                    {/*<span>*/}
                        {/*{getMissionDetail.hasOwnProperty('taskName') ? getMissionDetail.taskName : '---'}*/}
                    {/*</span>*/}
                    {/*<Icon title={"复制任务"} type="copy" theme="filled" onClick={this.copyMission}/>*/}
                    {/*<Icon title={"编辑"} type="edit" theme="filled" onClick={this.editMission}/>*/}
                    {/*<Popconfirm*/}
                        {/*title="确定要删除这个任务吗?"*/}
                        {/*onConfirm={this.deleteMission}*/}
                        {/*okText="是"*/}
                        {/*cancelText="否"*/}
                    {/*>*/}
                        {/*<a href="#">*/}
                            {/*<Icon title={"删除"} type="delete" theme="filled"/>*/}
                        {/*</a>*/}
                    {/*</Popconfirm>*/}
                {/*</Col>*/}
                {/*<Col xl={8} lg={8} md={8} sm={8} xs={8} className={styles.detailHeaderTitleRight}>
                    <span>单位:</span>
                    <Radio.Group defaultValue="line">
                        <Radio.Button value="line">行</Radio.Button>
                        <Radio.Button value="mb">MB</Radio.Button>
                    </Radio.Group>
                </Col>*/}
            </Row>
        );
    };

    //渲染时间间隔
    renderAddDataSelect = () => {
        const {minutesValue} = this.state;
        return (
            <Select value={minutesValue} style={{width: 120}} onChange={this.changeTime}>
                <Option value="oneMin">近1分钟</Option>
                <Option value="fiveMin">近5分钟</Option>
                <Option value="fifteenMin">近15分钟</Option>
            </Select>
        );
    };

    //立即激活功能
    taskActive = (e) => {
        let self = this;
        const {dispatch, dataSyncNewMission, location} = this.props;
        const {getMissionDetail} = dataSyncNewMission;
        e.preventDefault();
        let params = {
            createBy: '',
            createDate: '',
            des: '',
            name: getMissionDetail.taskName,
            status: '',
            step: '6',
            updateBy: T.auth.getLoginInfo().user.loginCode,
            updateDate: '',
            sink: getMissionDetail.sink,
            source: getMissionDetail.source,
            uuid: T.storage.getStorage('taskId'),
        };
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/updateTaskByIdAction',
                params,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                // 发送websocket
                self.websocketRunning(location, self);
                self.setState({
                    activeState: true,
                });
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    render() {
        const {
            loading,
            dataSyncNewMission,
            img,
        } = this.props;
        const {
            getMissionDetail,
        } = dataSyncNewMission;
        const {
            activeState,
            activeText,
            fakeData,
            minutesValue,
            rateLineData,
            MissionNameModalState,
        } = this.state;
        const config = [
            {
                img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
            },
        ];

        return (
            <PageHeaderWrapper
                title={null}
                // content={this.renderTitle(getMissionDetail)}
                wrapperClassName={styles.missionDetailWrapper}
            >
                {
                    loading ?
                        <div className={styles.loading}>
                            <Spin size="large"/>
                        </div>
                        :
                        <div>
                            <Row className={styles.syncTop}>
                                <Col xl={5} lg={5} md={5} sm={5} xs={5} className={styles.syncTopLeft}>
                                    <div className={styles.leftStatus}>
                                        <div>
                                            状态：
                                            {activeState ? <span>进行中</span>
                                                : <span>未激活</span>
                                            }
                                        </div>
                                        {activeState ? <Button shape="round" icon="pause">暂停</Button>
                                            : <Button shape="round" icon="caret-right">{activeText.btn}</Button>
                                        }
                                    </div>
                                    <Timeline className={styles.leftTimeLine}>
                                        <Timeline.Item
                                            dot={
                                                <Icon type="read" style={{fontSize: '16px'}}/>
                                            }
                                        >
                                            <div className={styles.timeItemImg}>
                                                <img
                                                    src={getMissionDetail.hasOwnProperty("sourceicon") ? EnumIconSrc[getMissionDetail.sourceicon].url : testMysql}
                                                />
                                                <span>{getMissionDetail.hasOwnProperty('sourceName') ? getMissionDetail.sourceName : '---'}</span>
                                            </div>
                                            <span onClick={this.showDetail.bind(this, "dataOrigin")}>详情</span>
                                        </Timeline.Item>
                                        {/*<Timeline.Item*/}
                                            {/*dot={*/}
                                                {/*<Icon type="reconciliation" style={{fontSize: '16px'}}/>*/}
                                            {/*}*/}
                                        {/*>*/}
                                            {/*<div className={styles.timeItemImg}>*/}
                                                {/*<img*/}
                                                    {/*src={getMissionDetail.hasOwnProperty("sinkIcon") ? EnumIconSrc[getMissionDetail.sinkIcon].url : testMysql}*/}
                                                {/*/>*/}
                                                {/*<span>{getMissionDetail.hasOwnProperty('sinkName') ? getMissionDetail.sinkName : '---'}</span>*/}
                                            {/*</div>*/}
                                            {/*<span onClick={this.showDetail.bind(this, "dataDestination")}>详情</span>*/}
                                        {/*</Timeline.Item>*/}
                                    </Timeline>
                                </Col>
                                <Col xl={19} lg={19} md={19} sm={19} xs={19} className={styles.syncTopRight}>
                                    <ul className={styles.dataItem + " clearfix"}>
                                        <li>
                                            <div>
                                                全量数据
                                                <Tooltip title={<FormattedMessage id="form.client.label.tooltip"/>}>
                                                    <Icon type="info-circle-o" style={{marginLeft: 4}}/>
                                                </Tooltip>
                                            </div>
                                            <div>
                                                {/*<FullData/>*/}
                                                <span>{fakeData.hasOwnProperty('rate') ? fakeData.rate[0].data.count : '---'}</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                增量数据
                                                <Tooltip title={<FormattedMessage id="form.client.label.tooltip"/>}>
                                                    <Icon type="info-circle-o" style={{marginLeft: 4}}/>
                                                </Tooltip>
                                            </div>
                                            <div>全量数据同步中</div>
                                        </li>
                                        <li>
                                            <div>读取数据量</div>
                                            <div>
                                                <span>{fakeData.hasOwnProperty('consumerNum') ? fakeData.consumerNum : '---'}</span>
                                                {/*<span>{(45332).toLocaleString()}</span><span>行/秒</span>*/}
                                            </div>
                                        </li>
                                        <li>
                                            <div>处理数据量</div>
                                            <div>
                                                <span>{fakeData.hasOwnProperty('topicOffset') ? fakeData.topicOffset : '---'}</span>
                                                {/*<span>{(45332).toLocaleString()}</span><span>行/秒</span>*/}
                                            </div>
                                        </li>
                                    </ul>
                                    <ul className={styles.createrInfo + " clearfix"}>
                                        <li>
                                            创建时间:<span>2017-06-30 20:16:21</span>
                                        </li>
                                        <li>
                                            创建人:<span>李军</span>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                            <div className={styles.syncLine}>
                                <RateLine
                                    rateLineData={rateLineData}
                                />
                            </div>
                            {activeState ?
                                <Tabs defaultActiveKey="1" onChange={this.callback} className={styles.detailTabs}>
                                    <TabPane tab="概览" key="1" className={styles.detailTabPane}>
                                        {/*  <Card title="已完成数据量" bordered={false}>
                                            <ul className={styles.doneDataNumber + " clearfix"}>
                                                <li>
                                                    已读取数据量
                                                    <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                                                        <Icon type="info-circle-o" style={{ marginLeft: 4}} />
                                                    </Tooltip>
                                                    <span>
                                                        12.5
                                                    </span>
                                                    <span>
                                                        亿行
                                                    </span>
                                                </li>
                                                <li>
                                                    已写入数据量
                                                    <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                                                        <Icon type="info-circle-o" style={{ marginLeft: 4}} />
                                                    </Tooltip>
                                                    <span>
                                                        12.5
                                                    </span>
                                                    <span>
                                                        亿行
                                                    </span>
                                                </li>
                                                <li>
                                                    错误队列
                                                    <Tooltip title={<FormattedMessage id="form.client.label.tooltip" />}>
                                                        <Icon type="info-circle-o" style={{ marginLeft: 4}} />
                                                    </Tooltip>
                                                    <span>
                                                        12.5
                                                    </span>
                                                    <span>
                                                        亿行
                                                    </span>
                                                </li>
                                            </ul>
                                        </Card>*/}
                                        <Card title="每秒钟读取的行数" bordered={false} extra={this.renderAddDataSelect()}>
                                            <AddDataLine
                                                showDataModal={{
                                                    fakeData,
                                                    type: 'MessagesInPerSec',
                                                    minutesValue: minutesValue
                                                }}/>
                                        </Card>
                                        <Card title="每秒钟读取的字节数" bordered={false}>
                                            <AddDataLine
                                                showDataModal={{
                                                    fakeData,
                                                    type: 'BytesInPerSec',
                                                    minutesValue: minutesValue
                                                }}/>
                                        </Card>
                                        <Card title="每秒钟处理的字节数" bordered={false}>
                                            <AddDataLine
                                                showDataModal={{
                                                    fakeData,
                                                    type: 'BytesOutPerSec',
                                                    minutesValue: minutesValue
                                                }}/>
                                        </Card>
                                    </TabPane>
                                    <TabPane tab="错误队列" key="2">
                                        Content of Tab Pane 2
                                    </TabPane>
                                    <TabPane tab="配置规则" key="3">
                                        Content of Tab Pane 3
                                    </TabPane>
                                    <TabPane tab="任务设置" key="4">
                                        Content of Tab Pane 4
                                    </TabPane>
                                    <TabPane tab="消息列表" key="5">
                                        Content of Tab Pane 5
                                    </TabPane>
                                </Tabs> :
                                <Fragment>
                                    <Tabs defaultActiveKey="1" onChange={this.callback} className={styles.detailTabs}>
                                        <TabPane tab="概览" key="1" className={styles.detailTabPane}/>
                                        <TabPane tab="错误队列" key="2"/>
                                        <TabPane tab="配置规则" key="3"/>
                                        <TabPane tab="任务设置" key="4"/>
                                        <TabPane tab="消息列表" key="5"/>
                                    </Tabs>
                                    <div className={styleNewTaskFlow.exception}>
                                        <Row gutter={24}>
                                            <div className={styleNewTaskFlow.content}>
                                                <div className={styleNewTaskFlow.actions}>
                                                    <Button
                                                        size="large"
                                                        onClick={this.taskActive}
                                                    >
                                                        {activeText.btn}
                                                    </Button>
                                                </div>
                                                <div className={styleNewTaskFlow.desc}>
                                                    {activeText.content}
                                                </div>
                                            </div>
                                        </Row>
                                        <Row gutter={24} type="flex" justify="center">
                                            <Col xl={2} lg={3} md={4} sm={5} className={styleNewTaskFlow.imgBlock}>
                                                <img
                                                    src={img || config[0].img}
                                                    alt=""
                                                    className={styleNewTaskFlow.imgEle}
                                                />
                                                <div className={styleNewTaskFlow.imgText}>1.选择数据源和目的地</div>
                                            </Col>
                                            <Col xl={2} lg={3} md={4} sm={5} className={styleNewTaskFlow.imgBlock}
                                                 offset={1}>
                                                <img src={img || config[0].img} alt=""
                                                     className={styleNewTaskFlow.imgEle}/>
                                                <div className={styleNewTaskFlow.imgText}>2.任务设置</div>
                                            </Col>
                                            <Col xl={2} lg={3} md={4} sm={5} className={styleNewTaskFlow.imgBlock}
                                                 offset={1}>
                                                <img src={img || config[0].img} alt=""
                                                     className={styleNewTaskFlow.imgEle}/>
                                                <div className={styleNewTaskFlow.imgText}>2.目的地配置</div>
                                            </Col>
                                            <Col xl={2} lg={3} md={4} sm={5} className={styleNewTaskFlow.imgBlock}
                                                 offset={1}>
                                                <img src={img || config[0].img} alt=""
                                                     className={styleNewTaskFlow.imgEle}/>
                                                <div className={styleNewTaskFlow.imgText}>4.激活-完成</div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Fragment>}
                            <SyncConfigDataOriginModal/>
                            <SyncDetailDataModal/>
                            <ChangeMissionNameModal
                                closeMissionNameModal={this.closeMissionNameModal}
                                MissionNameModalState={MissionNameModalState}
                            />
                        </div>
                }
            </PageHeaderWrapper>
        );
    }
}

export default SyncMissionDetail;
