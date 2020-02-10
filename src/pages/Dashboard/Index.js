import React, {Component, Suspense} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import styles from './Index.less';
import T from './../../utils/T';
import {getTimeDistance} from '@/utils/utils';

import {EnumDashboardPageInfo} from './../../constants/EnumPageInfo';

import {FormattedMessage} from 'umi-plugin-react/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import LineData from './LineData';
import PieData from './PieData';
import {TimelineChart, MiniArea, Pie} from '@/components/Charts';
import sourceNum from './imgs/sourceNum.svg';
import resourceNum from './imgs/resourceNum.svg';
import totalNumPic from './imgs/totalNum.svg';
import runningNum from './imgs/runningNum.svg';
import {Row, Col, Table, Card, DatePicker, Spin} from 'antd';
const {RangePicker} = DatePicker;

//顶部col的样式
const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: {marginBottom: 24},
};

@connect(({dashboard, loading}) => ({
    dashboard,
    fetchTopDataStatus: loading.effects['dashboard/fetchDashboardTopDataAction'],
    fetchChartLineDataStatus: loading.effects['dashboard/fetchChartLineDataAction'],
}))
export default class Dashboard extends Component {
    state = {
        rangePickerValue: getTimeDistance('today'),
        currentPage: EnumDashboardPageInfo.defaultPage,
        pageSize: EnumDashboardPageInfo.defaultPageSize,
    };

    componentDidMount() {
        //默认获取数据
        this.fetchTopData();
        this.fetchLineData();
    }

    //获取除了折线图的所有数据
    fetchTopData = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dashboard/fetchDashboardTopDataAction',
        });
    };

    //获取折线图数据
    fetchLineData = () => {
        const {dispatch} = this.props;
        const { rangePickerValue } = this.state;
        let startTime = T.moment(rangePickerValue[0]).format("YYYY-MM-DD HH:mm:ss");
        let endTime = T.moment(rangePickerValue[1]).format("YYYY-MM-DD HH:mm:ss");
        dispatch({
            type: 'dashboard/fetchChartLineDataAction',
            params: {
                startTime,
                endTime
            }
        })
    };

    //时间选择器
    handleRangePickerChange = rangePickerValue => {
        this.setState({
            rangePickerValue,
        },() => {
            this.fetchLineData()
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

    //是否激活当前选择的样式
    isActive = type => {
        const {rangePickerValue} = this.state;
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

    //跳转到指定页面
    clickToSpecialPage = (data) => {
        router.push({
            pathname: data.type === 'source' ? '/metadataManage/dataSourceManagement/info' : data.type === 'resource' ? '/metadataManage/resourceManagement/info': data.type === 'task' ? '/dataTask' : '/dataTask',
        });
    };

    //渲染头部
    renderTop = (dataSource) => {
        return dataSource.map( (val,idx) => {
            return (
                <Col {...topColResponsiveProps} key={idx}>
                    <div
                        onClick={this.clickToSpecialPage.bind(this,val)}
                        className={styles.dashboardTopItem}
                        style={{
                            backgroundColor: val.bgColor,
                        }}
                    >
                        <div className={styles.dashboardTopItemLeft}>
                            <img src={val.img}/>
                        </div>
                        <div className={styles.dashboardTopItemRight}>
                            <div>{val.name}</div>
                            <div>{val.number}</div>
                        </div>
                    </div>
                </Col>
            )
        })
    };

    render() {
        const {rangePickerValue} = this.state;
        const {fetchTopDataStatus, dashboard, fetchChartLineDataStatus} = this.props;
        const {
            dataSourceCount,
            dataResourceCount,
            taskCount,
            runTaskCount,
            pieData,
            pieTotal,
            dataInTableData,
            chartLineData
        } = dashboard;

        //顶部数据
        let topData = [
            {
                name: "数据源个数",
                number: dataSourceCount,
                bgColor: "#4ecb73",
                img: sourceNum,
                type: 'source',
            },
            {
                name: "数据资源个数 ",
                number: dataResourceCount,
                bgColor: "#975fe4",
                img: resourceNum,
                type: 'resource',
            },
            {
                name: "任务总数",
                number: taskCount,
                bgColor: "#3aa1ff",
                img: totalNumPic,
                type: 'task',
            },
            {
                name: "正在运行任务个数",
                number: runTaskCount,
                bgColor: "#36cbcb",
                img: runningNum,
                type: 'runTask',
            }
        ];

        //表格数据列
        const columns = [
            {
                title: "",
                dataIndex: 'index',
                key: 'index',
                width: '5%',
                render: (record) => {
                    return (
                        <span
                            className={styles.rankTableStyle}
                            style={{
                                backgroundColor: record === 1 ? '#ff3852' : record === 2 ? '#00b7ee' : record === 3 ? '#ff9406':'none',
                                // backgroundColor: record === 1 ? '#f7d63c' : record === 2 ? '#c4babb' : record === 3 ? '#865d4c':'none',
                                color: (record === 1 || record === 2 || record === 3) ? '#fff' :'rgba(0, 0, 0, 0.65)'
                            }}
                        >
                            {record}
                        </span>
                    )
                },
            },
            {
                title: <FormattedMessage id="app.dashboard.accessRank.type"/>,
                dataIndex: 'name',
                key: 'name',
                width: '20%',
            },
            {
                title: (<FormattedMessage id="app.dashboard.accessRank.totalAccessData"/>),
                dataIndex: 'dataSum',
                key: 'dataSum',
                width: '15%',
            },
            {
                title: <FormattedMessage id="app.dashboard.accessRank.yesterdayAccessData"/>,
                dataIndex: 'yesterdayDataInCount',
                key: 'yesterdayDataInCount',
                width: '15%',
                // sorter: (a, b) => a.yesterday - b.yesterday,
            },
            {
                title: <FormattedMessage id="app.dashboard.accessRank.todayAccessData"/>,
                dataIndex: 'todayDataInCount',
                key: 'todayDataInCount',
                width: '20%',
            },
            {
                title: <FormattedMessage id="app.dashboard.accessRank.currentSpeed"/>,
                dataIndex: 'currentRate',
                key: 'currentRate',
                width: '25%',
            },
        ];

        return (
            <GridContent>
                <Row className={styles.dashboardTop} gutter={24}>
                    {
                        this.renderTop(topData)
                    }
                </Row>
                <Suspense fallback={null}>
                    <div>
                        <Card
                            loading={fetchTopDataStatus}
                            className={styles.lineContent}
                            bordered={false}
                            title={<FormattedMessage id="app.dashboard.dataVolume"/>}
                            extra={
                                <div className={styles.salesExtraWrap}>
                                    <div className={styles.salesExtra}>
                                        <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
                                            <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day"/>
                                        </a>
                                        <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
                                            <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week"/>
                                        </a>
                                        <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
                                            <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month"/>
                                        </a>
                                        <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
                                            <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year"/>
                                        </a>
                                    </div>
                                    <RangePicker
                                        value={rangePickerValue}
                                        onChange={this.handleRangePickerChange}
                                        style={{width: 256}}
                                    />
                                </div>
                            }
                        >
                            {
                                fetchChartLineDataStatus ?
                                    <Spin/>
                                    :
                                    <LineData
                                        rateLineData={chartLineData}
                                    />
                            }
                        </Card>
                    </div>
                </Suspense>
                <div className={styles.twoColLayout}>
                    <Row gutter={24} type="flex">
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                            <Card
                                loading={fetchTopDataStatus}
                                bordered={false}
                                title={
                                    <FormattedMessage id="app.dashboard.pie.dataSourceType"/>
                                }
                                style={{marginTop: 24}}
                            >
                                <PieData pieData={pieData} pieTotal={pieTotal} />
                            </Card>
                        </Col>
                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                            <Card
                                loading={fetchTopDataStatus}
                                bordered={false}
                                title={
                                    <FormattedMessage id="app.dashboard.dataAccessRank"/>
                                }
                                style={{marginTop: 24}}
                            >
                                <Table
                                    size="small"
                                    className={styles.rankTable}
                                    columns={columns}
                                    bordered={false}
                                    style={{ height: 285}}
                                    dataSource={dataInTableData}
                                    scroll={{y: dataInTableData.length > 6 ? 230 : 0}}
                                    pagination={false}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </GridContent>
        );
    }
}


