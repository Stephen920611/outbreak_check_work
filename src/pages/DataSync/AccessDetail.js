import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './AccessDetail.less';
import T from './../../utils/T';
import {getTimeDistance} from '@/utils/utils';
import router from 'umi/router';

import {FormattedMessage} from 'umi-plugin-react/locale';
import { EnumDataDistributeStatus, EnumSourceDataStatus,EnumProcessorStatus } from './../../constants/dataSync/EnumSyncCommon';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';

import RateLine from "./RateLine";
import {
    Button,
    Icon,
    Row,
    Col,
    Table,
    Card,
    List,
    Spin,
    DatePicker,
} from 'antd';
const {RangePicker} = DatePicker;

//数据分发页面
/* eslint react/no-multi-comp:0 */
@connect(({dataSyncNewMission,dataDistribution, loading}) => ({
    dataSyncNewMission,
    dataDistribution,
    fetchDetailLineDataStatus: loading.effects['dataSyncNewMission/getDetailLineDataByIdAction'],
    fetchDataOriginDetailStatus: loading.effects['dataSyncNewMission/fetchDataOriginDetailAction'],
}))
class AccessDetail extends PureComponent {
    constructor() {
        super();
        this.websocketConstructor = null;
        this.lineTimer = null;
        this.state = {
            rangePickerValue: getTimeDistance('30min'),
            rangePickerType: '30min',
            activeText: {
                btn: '立即激活',
                context: '任务已设置完毕，请点击[立即激活]开始任务'
            },
            rateLineData: [], // 折线图速度数据
            infoData: {

            },   //其他数据
            stateAndRateData: {
                state: 'UNSIGNED',
                rate: '--'
            },   //速率和状态数据
            stateAndDetail: {
                // detail: '"org.apache.kafka.connect.errors.ConnectException: java.net.ConnectException: Connection refused (Connection refused)\\n\\tat cn.gov.ytga.kafka.connect.file.FtpCsvSourceTask.start(FtpCsvSourceTask.java:73)\\n\\tat org.apache.kafka.connect.runtime.WorkerSourceTask.execute(WorkerSourceTask.java:199)\\n\\tat org.apache.kafka.connect.runtime.WorkerTask.doRun(WorkerTask.java:175)\\n\\tat org.apache.kafka.connect.runtime.WorkerTask.run(WorkerTask.java:219)\\n\\tat java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:511)\\n\\tat java.util.concurrent.FutureTask.run(FutureTask.java:266)\\n\\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)\\n\\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)\\n\\tat java.lang.Thread.run(Thread.java:748)\\nCaused by: java.net.ConnectException: Connection refused (Connection refused)\\n\\tat java.net.PlainSocketImpl.socketConnect(Native Method)\\n\\tat java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350)\\n\\tat java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206)\\n\\tat java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188)\\n\\tat java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)\\n\\tat java.net.Socket.connect(Socket.java:589)\\n\\tat org.apache.commons.net.SocketClient._connect(SocketClient.java:243)\\n\\tat org.apache.commons.net.SocketClient.connect(SocketClient.java:181)\\n\\tat cn.gov.ytga.kafka.connect.utils.FTPUtils.connect(FTPUtils.java:108)\\n\\tat cn.gov.ytga.kafka.connect.file.FtpCsvSourceTask.start(FtpCsvSourceTask.java:70)\\n\\t... 8 more\\n"',
                state: [ { "state": "RUNNING", "worker_id": "192.168.10.122:8083" }, { "id": 0, "state": "RUNNING", "worker_id": "192.168.10.122:8083" } ],
                allDetailData: [],      //后台返回的所有数据
                detailTableData: [],    //运行状态数据
                logData: [],    //运行状态数据
            }, //日志信息和运行状态
            activeState: false,
            fakeData: {},//后台返回的数据
            updateTime: '---'
        };
    }

    componentDidMount() {
        const {dispatch, location} = this.props;
        //默认获取一次数据
        this.updateDetailInfo();
        this.fetchLineData();
        // this.fetchDataOneMinute();

        //之前的：--------验证是否刷新页面
        // T.auth.returnSpecialMainPage(location, '/dataTask');
        let params = {
            taskId: T.storage.getStorage('taskId'),
        };
        // //获取任务详情
        // dispatch({
        //     type: 'dataSyncNewMission/getTaskDetailByIdAction',
        //     params,
        // });
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
    }

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

    //获取当前页数数据（运行状态、日志信息、数据接入总量）
    fetchDataDetail = () => {
        const {dispatch} = this.props;
        let uuid = T.storage.getStorage('processorId');
        dispatch({
            type: 'dataSyncNewMission/fetchDataOriginDetailAction',
            uuid,
        });
    };

    //每隔一分钟刷新一次
    fetchDataOneMinute = () => {
        //默认先获取一遍数据
        this.fetchLineData();
        //清除定时器
        clearInterval(this.lineTimer);
        let self = this;
        //获取当前折线图数据
        this.lineTimer = setInterval(function () {
            self.fetchLineData();
        },1000 * 5);
    };

    //根据id获取每分钟速率
    fetchLineData = () => {
        const {dispatch,dataDistribution,dataSyncNewMission} = this.props;
        const { rangePickerValue } = this.state;
        const {platformType} = dataDistribution;
        const {checkType} = dataSyncNewMission;
        let self = this;
        //处理器id
        let uuid = T.storage.getStorage('processorId');

        let startTime = T.moment(rangePickerValue[0]).format("YYYY-MM-DD HH:mm:ss");
        let endTime = T.moment(rangePickerValue[1]).format("YYYY-MM-DD HH:mm:ss");

        //当前时间的时间戳
        let currentDate = new Date().getTime();
        //当前时间
        let currentTime = T.helper.dateFormat(currentDate);
        //更新时间改变
        this.setState({
            updateTime: currentTime
        });
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/getDetailLineDataByIdAction',
                id: uuid,
                // id: '__consumer_offsets',
                params: {
                    startTime,
                    endTime,
                    type: T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ?
                        checkType === 'local' ? 'local' : 'remote'
                        : platformType === 'local' ? 'local' : 'remote'
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

    /**
     * 处理数据源的操作
     * @param {string} data 数据列
     * @param {string} type activate 激活,resume 开始,pause 暂停,restart 重启,delete 删除
     */
    handleDifferentTask = (data, type) => {
        //uuid
        let uuid = T.storage.getStorage('processorId');
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/' + (type === 'activate' ? 'activateSourceProcessorAction' : type === 'resume' ? 'resumeSourceProcessorAction' : type === 'pause' ? 'pauseSourceProcessorAction' : type === 'restart' ? 'restartSourceProcessorAction' : type === 'delete' ? 'deleteSourceProcessorAction' : ''),
                uuid: uuid,//填写数据源的uuid
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                T.prompt.success(response.data);
                // 重新刷新列表
                this.fetchDataDetail();
                // self.fetchRateAndStatus();
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //刷新
    updateDetailInfo = () => {
        //重新获取数据
        this.fetchDataDetail();
    };

    //重启功能
    resetNode = (data) => {
        let self = this;
        let uuid = T.storage.getStorage('processorId');
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/restartProcessorDetailTaskAction',
                uuid,
                taskId: data.id,
                resolve,
                reject,
            });
        }).then(response => {
            if(response.result ==='true'){
                T.prompt.success(response.data);
                self.fetchDataDetail();
                // self.fetchStateAndDetail();
            }else{
                T.prompt.error(response.message);
            }
        });
    };

    //页码变换
    pageChange = (page) => {
        let self = this;
        this.setState({
            currentPage: page.current,
        }, () => {
            self.fetchDataDetail();
            // this.fetchStateAndDetail();
        });
    };

    /**
     * 快速选择今日，本周，本月，全年
     * @param {string} type    today今日， week本周，month 本月， year本年
     */
    selectDate = type => {
        this.setState({
            rangePickerValue: getTimeDistance(type),
        },() => {
            this.fetchLineData()
        });
    };

    //时间选择器
    handleRangePickerChange = rangePickerValue => {
        this.setState({
            rangePickerValue,
        },() => {
            this.fetchLineData()
        });
    };

    // confirmTime = rangePickerValue => {
    //     this.setState({
    //         rangePickerValue,
    //     },() => {
    //         this.fetchLineData()
    //     });
    // };

    //是否激活当前选择的样式
    isActive = type => {
        const {rangePickerValue, rangePickerType} = this.state;
        const value = getTimeDistance(type);
        if (!rangePickerValue[0] || !rangePickerValue[1]) {
            return '';
        }
        if (
            rangePickerValue[0].isSame(value[0], 'day') &&
            rangePickerValue[1].isSame(value[1], 'day')
        ) {
            return styles.currentDate;
        }
        return '';
    };

    //点击详情页的数据源或者数据资源，跳转到数据源管理或者资源管理
    showDetail = (name,type,e)=>{
        router.push({
            pathname:type === 'datasource' ? '/metadataManage/dataSourceManagement/info':'/metadataManage/resourceManagement/info',
            params:{
                isRouterPush: true,
                name:name
            }
        });
    }
    ;

    render() {
        const {
            dataSyncNewMission,
            fetchDetailLineDataStatus,
            fetchDataOriginDetail,
            fetchDataOriginDetailStatus
        } = this.props;
        const {dataOriginDetail} = dataSyncNewMission;
        const {processor,status,statistics,logs} = dataOriginDetail;
        const {
            rateLineData,
            rangePickerValue,
            updateTime
        } = this.state;
        //运行状态表格列
        const statusColumns = [
            {
                title: 'ID',
                dataIndex: 'id',
            },
            {
                title: '状态',
                dataIndex: 'state',
            },
            {
                title: '运行节点',
                dataIndex: 'worker_id',
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <Icon type="redo" title="重启" onClick={()=>this.resetNode(record)}/>
                    </Fragment>
                ),
            },
        ];

        //数据统计表格列
        const statisticsColumns = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '数据总量',
                dataIndex: 'totalCount',
            },
            /*{
                title: '已读取数据',
                dataIndex: 'handlerCount',
            },
            {
                title: '未读数据',
                dataIndex: 'unHandlerCount',
            },*/
        ];

        let htmlInfo = T.storage.getStorage('HtmlType');
        const breadcrumbDetail = [
            {
                linkTo: '/dashboard',
                name: '首页',
            },
            {
                linkTo: htmlInfo.modalType === 'dataOrigin'? '/dataTask' : '/dataDistribution',
                name: htmlInfo.modalType === 'dataOrigin'? '数据接入' : '数据分发',
            },
            {
                name: '数据源详情',
            },
        ];

        return (
            <PageHeaderWrapper
                title={""}
                isSpecialBreadcrumb={true}
                breadcrumbName={<CustomBreadcrumb dataSource={breadcrumbDetail}/>}
                wrapperClassName={styles.missionDetailWrapper}
            >
                {
                    fetchDataOriginDetail ?
                        <Spin size='large' className={styles.missionStep} />
                        :
                        <div>
                            <Row className={styles.detailTitle + " " + styles.destinationName}>
                                <Col span={13}>
                                    <div
                                        className={styles.detailSourceName}
                                        title={processor ? processor.hasOwnProperty('name') ? processor.name : '---': '---'}
                                    >
                                        {processor ? processor.hasOwnProperty('name') ? processor.name : '---': '---'}
                                    </div>
                                    <div className={styles.detailSourceBtns}>
                                        <Icon
                                            type="exclamation-circle"
                                            style={{
                                                marginRight: 20,
                                                fontSize: 24,
                                                color:processor ? processor.hasOwnProperty('state') ?
                                                    T.lodash.isUndefined(EnumProcessorStatus[processor.state]) ? EnumProcessorStatus['UNKNOWN'].color : EnumProcessorStatus[processor.state].color
                                                    : EnumProcessorStatus['UNKNOWN'].color
                                                    : EnumProcessorStatus['UNKNOWN'].color
                                                // color: !T.lodash.isUndefined(EnumSourceDataStatus[stateAndRateData.hasOwnProperty('state') ? stateAndRateData.state : '1']) ? EnumSourceDataStatus[stateAndRateData.hasOwnProperty('state') ? stateAndRateData.state : '1'].color : EnumSourceDataStatus['4'].color
                                            }}
                                            title={processor ? processor.hasOwnProperty('state') ?
                                                T.lodash.isUndefined(EnumProcessorStatus[processor.state]) ? EnumProcessorStatus['UNKNOWN'].label : EnumProcessorStatus[processor.state].label
                                                : EnumProcessorStatus['UNKNOWN'].label
                                                : EnumProcessorStatus['UNKNOWN'].label
                                            }

                                            // title={!T.lodash.isUndefined(EnumSourceDataStatus[stateAndRateData.hasOwnProperty('state') ? stateAndRateData.state : '1']) ? EnumSourceDataStatus[stateAndRateData.hasOwnProperty('state') ? stateAndRateData.state : '1'].label : EnumSourceDataStatus['4'].label}
                                        />
                                        <Button
                                            disabled={processor ? (processor.state === EnumProcessorStatus['INACTIVED'].value || processor.state === EnumProcessorStatus['FAILED'].value) ? false : true : true}
                                            title="激活" shape="circle" icon="bulb" size={"small"}
                                            onClick={() => this.handleDifferentTask(processor, 'activate')}
                                        />
                                        <Button disabled={processor ? processor.state === EnumProcessorStatus['PAUSED'].value ? false : true : true} title="开始"
                                                shape="circle" icon="caret-right" size={"small"}
                                                onClick={() => this.handleDifferentTask(processor, 'resume')}
                                        />
                                        <Button disabled={processor ? processor.state === EnumProcessorStatus['RUNNING'].value ? false : true : true} title="暂停"
                                                shape="circle" icon="pause" size={"small"}
                                                onClick={() => this.handleDifferentTask(processor, 'pause')}
                                        />
                                        <Button
                                            disabled={processor ? (processor.state === EnumProcessorStatus['RUNNING'].value || processor.state === EnumProcessorStatus['PAUSED'].value) ? false : true : true}
                                            title="重启" shape="circle" icon="reload" size={"small"}
                                            onClick={() => this.handleDifferentTask(processor, 'restart')}
                                        />
                                    </div>
                                </Col>
                                <Col span={11} className={styles.detailBtns} style={{textAlign: 'right'}}>
                                    <span>更新时间：</span>
                                    <span>{updateTime}</span>
                                    <Button
                                        type="primary"
                                        onClick={this.updateDetailInfo}
                                        style={{marginLeft: 10}}
                                        loading={fetchDataOriginDetailStatus}
                                    >
                                        <span>刷新</span>
                                    </Button>
                                </Col>
                            </Row>
                            <Card
                                className={styles.detailLine}
                                extra={
                                    <div className={styles.salesExtraWrap}>
                                        <div className={styles.salesExtra}>
                                            <a className={this.isActive('30min')} onClick={() => this.selectDate('30min')}>
                                                <FormattedMessage id="app.analysis.30min" defaultMessage="30min"/>
                                            </a>
                                            <a className={this.isActive('1day')} onClick={() => this.selectDate('1day')}>
                                                <FormattedMessage id="app.analysis.1day" defaultMessage="1day"/>
                                            </a>
                                            <a className={this.isActive('3days')} onClick={() => this.selectDate('3days')}>
                                                <FormattedMessage id="app.analysis.3days" defaultMessage="3days"/>
                                            </a>
                                            <a className={this.isActive('7days')} onClick={() => this.selectDate('7days')}>
                                                <FormattedMessage id="app.analysis.7days" defaultMessage="7days"/>
                                            </a>
                                        </div>
                                        <RangePicker
                                            value={rangePickerValue}
                                            onChange={this.handleRangePickerChange}
                                            style={{width: 340}}
                                            showTime={true}
                                            // onOk={this.confirmTime}
                                        />
                                    </div>
                                }
                            >
                                {
                                    fetchDetailLineDataStatus ?
                                        <Spin/>
                                        :
                                        <RateLine
                                            rateLineData={rateLineData}
                                        />
                                }
                            </Card>
                            {/*<div className={styles.syncLine}>*/}
                            {/**/}
                            {/*</div>*/}
                            <Card style={{marginBottom: 20}}>
                                {/* <Row className={styles.detailTitle}>
                        <Col span={24}>
                            <span>运行节点：</span>
                            <span>{infoData.hasOwnProperty('name') ? infoData.name : '---'}</span>
                        </Col>
                    </Row>*/}
                                <Row className={styles.detailTitle}>
                                    <Col span={8}>
                                        <span>接入人：</span>
                                        <span>{processor ? processor.hasOwnProperty('createBy') ? processor.createBy : '---' : '---'}</span>
                                    </Col>
                                    <Col span={8} className={styles.detailBtns}>
                                        <span>创建时间：</span>
                                        <span>{processor ? processor.hasOwnProperty('createDate') ? T.helper.dateFormat(processor.createDate) : '---' : '---'}</span>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={8}>
                                        <span>数据源：</span>
                                        {/*<span>{processor.hasOwnProperty('sourceName') ? processor.sourceName : '---'}</span>*/}
                                        {processor ? processor.hasOwnProperty('sourceName') ?
                                            <a onClick={this.showDetail.bind(this,processor.sourceName,'datasource')}>{processor.sourceName}</a>
                                            : <span>---</span>
                                            : <span>---</span>
                                        }
                                        </Col>
                                    <Col span={8} className={styles.detailBtns}>
                                        <span>数据资源：</span>
                                        {processor ? processor.hasOwnProperty('resourceName') ?
                                            <a onClick={this.showDetail.bind(this,processor.resourceName,'resource')}>{processor.resourceName}</a>
                                            : <span>---</span>
                                            : <span>---</span>
                                        }
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={24}>
                                        <span>描述：</span>
                                        <span>{processor ? processor.hasOwnProperty('des') ? processor.des : '---': '---'}</span>
                                    </Col>
                                </Row>
                            </Card>
                            <div className={styles.detailItem}>
                                <div className={styles.detailTitleName}>
                                    运行状态
                                </div>
                                <div className={styles.tableContainer}>
                                    <Table
                                        className={styles.detailTable}
                                        // dataSource={stateAndDetail['detailTableData']}
                                        dataSource={status ? status.hasOwnProperty('tasks') ? status.tasks : []:[]}
                                        pagination={false}
                                        columns={statusColumns}
                                        onChange={this.pageChange}
                                        loading={fetchDataOriginDetail}
                                        // scroll={{y: (status['tasks'].length > 6 ? 324 : 0) }}
                                    />
                                </div>
                            </div>
                            {/* TODO 数据统计暂时没接口 */}
                            <div className={styles.detailItem}>
                                <div className={styles.detailTitleName}>
                                    数据统计
                                </div>
                                <div className={styles.tableContainer}>
                                    <Row>
                                        <Col span={24}>
                                            <span>累计数据总量：</span>
                                            <span>{statistics ? statistics.hasOwnProperty('totalCount') ? statistics.totalCount : '---':'---'}</span>
                                        </Col>
                                        {/*<Col span={8} className={styles.detailBtns}>
                                <span>已读取数据总量：</span>
                                <span>{statistics.hasOwnProperty('handlerCount') ? statistics.handlerCount : '---'}</span>
                            </Col>
                            <Col span={8}>
                                <span>未读取数据总量：</span>
                                <span>{statistics.hasOwnProperty('unHandlerCount') ? statistics.unHandlerCount : '---'}</span>
                            </Col>*/}
                                    </Row>
                                   {/* <Table
                                        className={styles.detailTable}
                                        dataSource={statistics ? statistics.hasOwnProperty('statistics') ? statistics.statistics :[]:[]}
                                        pagination={false}
                                        columns={statisticsColumns}
                                        onChange={this.pageChange}
                                    />*/}
                                </div>

                            </div>
                            <div className={styles.detailItem}>
                                <div className={styles.detailTitleName}>
                                    日志信息
                                </div>
                                <Card style={{marginBottom: 20}}>
                                    <Row className={styles.detailTitle}>
                                        <Col span={24}>
                                            <List
                                                loading={fetchDataOriginDetail}
                                                dataSource={logs ? logs.length >10 ? T.lodash.slice(logs,0,9) : logs:[]}
                                                // dataSource={stateAndDetail.allDetailData}
                                                renderItem={(item,index) => (<List.Item key={index}>
                                        <span
                                            style={{
                                                width: '100%',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                            // title={JSON.stringify(item)}
                                            title={item}
                                        >
                                            {item}
                                            {/*{JSON.stringify(item)}*/}
                                        </span>
                                                </List.Item>)}
                                            />
                                            {/*{stateAndDetail.hasOwnProperty('detail') ? stateAndDetail.detail : '---'}*/}
                                        </Col>
                                    </Row>
                                </Card>
                            </div>
                        </div>
                }
            </PageHeaderWrapper>
        );
    }
}

export default AccessDetail;
