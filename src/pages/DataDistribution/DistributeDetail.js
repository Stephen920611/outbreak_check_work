import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './DistributeDetail.less';
import T from './../../utils/T';
import {getTimeDistance} from '@/utils/utils';

import { EnumDataDistributeStatus, EnumSourceDataStatus,EnumProcessorStatus } from './../../constants/dataSync/EnumSyncCommon';
import {FormattedMessage} from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';
import RateLine from ".././DataSync/RateLine";
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
@connect(({dataDistribution, dataSyncNewMission, loading}) => ({
    dataDistribution,
    dataSyncNewMission,
    fetchDestinationDetailStatus: loading.effects['dataDistribution/getDestinationDetailAction'],
    fetchSinkDetailLineDataStatus: loading.effects['dataDistribution/getDetailLineDataBySinkIdAction'],
}))
class DistributeConfig extends PureComponent {
    constructor() {
        super();
        this.lineTimer = null;
        this.state = {
            rangePickerValue: getTimeDistance('30min'),
            rangePickerType: '30min',
            updateTime: '---',  //更新时间
            rateLineData: [], // 折线图速度数据
            infoData: {

            },   //其他数据
            stateAndRateData: {
                state: 'UNSIGNED',
                rate: '--'
            },   //速率和状态数据
        };
    }

    componentDidMount() {
        let self = this;
        const {location} = this.props;
        // 默认获取数据
        // this.updateDistributeDetailInfo();
        this.fetchDataList();
        this.fetchLineData();

        // //获取当前折线图数据
        // this.lineTimer = setInterval(function () {
        //     self.fetchLineData();
        // },1000 * 60);
    }

    componentWillUnmount() {
        //清除定时器
        clearInterval(this.lineTimer);
    };

    //获取当前页数数据（运行状态、日志信息、数据接入总量）
    fetchDataList = () => {
        const {dispatch} = this.props;
        let uuid = T.storage.getStorage('processorId');
        dispatch({
            type: 'dataDistribution/getDestinationDetailAction',
            uuid,
        });
    };

    //获取除了折线图的信息
    /*fetchInfo = () => {
        const self = this;
        const {dispatch} = this.props;
        let uuid = T.storage.getStorage('processorId');
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/fetchProcessorDetailAction',
                uuid,//填写数据源的uuid
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                //重新刷新列表
                self.setState({
                    infoData: response.data
                })
            } else {
                T.prompt.error(response.message);
            }
        });
    };*/

    //根据id获取每分钟速率
    fetchLineData = () => {
        let self = this;
        const {dispatch} = this.props;
        const { rangePickerValue } = this.state;
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
                type: 'dataDistribution/getDetailLineDataBySinkIdAction',
                id: uuid,
                params: {
                    startTime,
                    endTime,
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

    //刷新
    updateDistributeDetailInfo = () => {
        //重新获取数据
        this.fetchDataList();
    };

    //重启功能
    resetNode = (data) => {
        let self = this;
        const {dispatch} = this.props;
        let uuid = T.storage.getStorage('processorId');
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataDistribution/restartDestinationChildAction',
                id: uuid,
                taskId: data.worker_id,
                resolve,
                reject,
            });
        }).then(response => {
            if(response.result ==='true'){
                T.prompt.success(response.data);
                self.fetchDataList();
            }else{
                T.prompt.error(response.message);
            }
        });
    };

    //页码变换
    pageChange = (page) => {
        this.setState({
            currentPage: page.current,
        }, () => {
            this.fetchDataList();
        });
    };

    /**
     * 处理目的地的操作
     * @param {string} data 数据列
     * @param {string} type running启动 pause暂停 restart 重启 恢复是resume，delete是删除
     * @param {string} type activate 激活,resume 开始,pause 暂停,restart 重启,delete 删除

     */
    handleDestination = (data, type) => {
        let self = this;
        const {dispatch, dataDistribution} = this.props;
        const {sourceInfo} = dataDistribution;
        new Promise((resolve, reject) => {
            dispatch({
                //
                type: 'dataDistribution/' + (type === 'activate' ? 'runningDestinationAction' : type === 'pause' ? 'pauseDestinationAction' : type === 'restart' ? 'restartDestinationAction' : type === 'resume' ? 'resumeDestinationAction' : type === 'delete' ? 'deleteDestinationAction' : ''),
                uuid: data.id,//填写数据目的地的uuid
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                T.prompt.success(response.data);
                // 获取数据
                self.fetchDataList();
            } else {
                T.prompt.error(response.message);
            }
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

    render() {
        const {
            fetchDestinationDetailStatus,
            dataDistribution,
            fetchSinkDetailLineDataStatus,
        } = this.props;
        const {
            rateLineData,
            rangePickerValue,
            updateTime
        } = this.state;
        const {sourceList,destinationDetail,sourceInfo} = dataDistribution;
        const {destination,status,statistics,logs,processor} = destinationDetail;

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
            {
                title: '已读取数据',
                dataIndex: 'handlerCount',
            },
            {
                title: '未读数据',
                dataIndex: 'unHandlerCount',
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
                linkTo:'/dataDistribution/distributeConfig',
                name: '分发配置',
                params:sourceInfo.hasOwnProperty('name')?{data:sourceInfo,isRouterPush: true}:{}
            },
            {
                name: '数据目的地详情',
            },
        ];
        return (
            <PageHeaderWrapper
                title={"数据目的地"}
                wrapperClassName={styles.missionDetailWrapper}
                breadcrumbName={<CustomBreadcrumb dataSource={breadcrumb}/>}
                isSpecialBreadcrumb={true}
            >
                <div>
                    <Row className={styles.detailTitle + " " + styles.destinationName}>
                        <Col span={13}>
                            <div
                                className={styles.detailSourceName}
                                title={processor ? processor.hasOwnProperty('name') ? processor.name : '---' : '---'}
                            >
                                {processor ? processor.hasOwnProperty('name') ? processor.name : '---' : '---'}
                            </div>
                            <div className={styles.detailSourceBtns}>
                                <Icon
                                    type="exclamation-circle"
                                    style={{
                                        marginRight: 20,
                                        fontSize: 24,
                                        // color: !T.lodash.isUndefined(EnumProcessorStatus[stateAndRateData.hasOwnProperty('state') ? stateAndRateData.state : EnumProcessorStatus['RUNNING'].value]) ? EnumProcessorStatus[stateAndRateData.hasOwnProperty('state') ? stateAndRateData.state : '1'].color : EnumProcessorStatus['4'].color
                                        color:processor ? processor.hasOwnProperty('state') ?
                                            T.lodash.isUndefined(EnumProcessorStatus[processor.state]) ? EnumProcessorStatus['UNKNOWN'].color : EnumProcessorStatus[processor.state].color
                                            : EnumProcessorStatus['UNKNOWN'].color
                                            : EnumProcessorStatus['UNKNOWN'].color
                                    }}
                                    title={processor ? processor.hasOwnProperty('state') ?
                                        T.lodash.isUndefined(EnumProcessorStatus[processor.state]) ? EnumProcessorStatus['UNKNOWN'].label : EnumProcessorStatus[processor.state].label
                                        : EnumProcessorStatus['UNKNOWN'].label
                                        : EnumProcessorStatus['UNKNOWN'].label
                                    }
                                    // title={!T.lodash.isUndefined(EnumProcessorStatus[stateAndRateData.hasOwnProperty('state') ? stateAndRateData.state : '1']) ? EnumProcessorStatus[stateAndRateData.hasOwnProperty('state') ? stateAndRateData.state : '1'].label : EnumProcessorStatus['4'].label}
                                />
                                <Button
                                    disabled={processor ? (processor.state === EnumProcessorStatus['INACTIVED'].value || processor.state === EnumProcessorStatus['FAILED'].value) ? false : true : true}
                                    title="激活" shape="circle" icon="bulb" size={"small"}
                                    onClick={() => this.handleDestination(processor, 'activate')}
                                />
                                <Button disabled={processor ? processor.state === EnumProcessorStatus['PAUSED'].value ? false : true : true} title="开始"
                                        shape="circle" icon="caret-right" size={"small"}
                                        onClick={() => this.handleDestination(processor, 'resume')}
                                />
                                <Button disabled={processor ? processor.state === EnumProcessorStatus['RUNNING'].value ? false : true : true} title="暂停"
                                        shape="circle" icon="pause" size={"small"}
                                        onClick={() => this.handleDestination(processor, 'pause')}
                                />
                                <Button
                                    disabled={processor ? (processor.state === EnumProcessorStatus['RUNNING'].value || processor.state === EnumProcessorStatus['PAUSED'].value) ? false : true : true}
                                    title="重启" shape="circle" icon="reload" size={"small"}
                                    onClick={() => this.handleDestination(processor, 'restart')}
                                />
                            </div>
                        </Col>
                        <Col span={11} className={styles.detailBtns} style={{textAlign: 'right'}}>
                            <span>更新时间：</span>
                            <span>{processor ? processor.hasOwnProperty('updateDate') ? processor.updateDate : "--" : "--"}</span>
                            <Button loading={fetchDestinationDetailStatus} type="primary" onClick={this.updateDistributeDetailInfo} style={{marginLeft: 10}}>
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
                            fetchSinkDetailLineDataStatus ?
                                <Spin/>
                                :
                                <RateLine
                                    rateLineData={rateLineData}
                                />
                        }
                    </Card>
                    <Card style={{marginBottom: 20}}>
                        <Row className={styles.detailTitle}>
                            <Col span={8}>
                                <span>接入人：</span>
                                <span>{processor ? processor.hasOwnProperty('createBy') ? processor.createBy : '---' : '---'}</span>
                            </Col>
                            <Col span={8} className={styles.detailBtns}>
                                <span>创建时间：</span>
                                <span>{processor ? processor.hasOwnProperty('createDate') ? processor.createDate : '---': '---'}</span>
                            </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                            <Col span={8}>
                                <span>目的地：</span>
                                <span>{processor ? processor.hasOwnProperty('sourceName') ? processor.sourceName : '---' : '---'}</span>
                            </Col>
                            <Col span={16}>
                                <span>描述：</span>
                                <span>{processor ? processor.hasOwnProperty('desc') ? processor.desc : '---' : '---'}</span>
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
                                dataSource={status ? status.hasOwnProperty('tasks') ? status.tasks : []:[]}
                                pagination={false}
                                columns={statusColumns}
                                onChange={this.pageChange}
                            />
                        </div>

                    </div>
                    {/*<div className={styles.detailItem}>
                        <div className={styles.detailTitleName}>
                            数据统计
                        </div>
                        <div className={styles.tableContainer}>
                            <Row>
                                <Col span={8}>
                                    <span>累计数据总量：</span>
                                    <span>{statistics ? statistics.hasOwnProperty('totalCount') ? statistics.totalCount : '---':'---'}</span>
                                </Col>
                                <Col span={8} className={styles.detailBtns}>
                                    <span>已读取数据总量：</span>
                                    <span>{statistics ? statistics.hasOwnProperty('handlerCount') ? statistics.handlerCount : '---':'---'}</span>
                                </Col>
                                <Col span={8}>
                                    <span>未读取数据总量：</span>
                                    <span>{statistics ? statistics.hasOwnProperty('unHandlerCount') ? statistics.unHandlerCount : '---':'---'}</span>
                                </Col>
                            </Row>
                            <Table
                                className={styles.detailTable}
                                dataSource={statistics ? statistics.hasOwnProperty('statistics') ? statistics.statistics :[]:[]}
                                pagination={false}
                                columns={statisticsColumns}
                                onChange={this.pageChange}
                            />
                        </div>
                    </div>*/}
                    <div className={styles.detailItem}>
                        <div className={styles.detailTitleName}>
                            日志信息
                        </div>
                        <Card style={{marginBottom: 20}}>
                            <Row className={styles.detailTitle}>
                                <Col span={24}>
                                    <List
                                        dataSource={logs ? logs.length >10 ? T.lodash.slice(logs,0,9) : logs:[]}
                                        renderItem={(item,index) => (
                                            <List.Item key={index}>
                                                <span
                                                    style={{
                                                        width: '100%',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                    title={item}
                                                >
                                                    {item}
                                                </span>
                                            </List.Item>)}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default DistributeConfig;
