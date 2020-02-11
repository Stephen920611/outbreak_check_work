import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './StatisticsList.less';
import T from './../../utils/T';
import router from 'umi/router';
import {formatMessage} from 'umi-plugin-react/locale';

import {EnumPluginListPageInfo} from './../../constants/EnumPageInfo';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Button,
    Input,
    Row,
    Col,
    Table,
} from 'antd';

//数据分发页面
/* eslint react/no-multi-comp:0 */
@connect(({touchStatisticsPageList, loading}) => ({
    touchStatisticsPageList,
    fetchStatisticsListStatus: loading.effects['touchStatisticsPageList/fetchStatisticsListAction'],
}))
class StatisticsList extends PureComponent {
    constructor() {
        super();
        this.state = {
            currentPage: EnumPluginListPageInfo.defaultPage,
            pageSize: EnumPluginListPageInfo.defaultPageSize,
            inputValue: "",     //输入框的值
            platformExpand: false,  //是否展开
            localResourcesAccessed: 0 ,//本地资源数
            clusterActiveColor: '000',//选中的颜色，本地的自己造成000， 为了满足list的id需求
            editing: false,
            dataSource: [
                {
                    key: 1,
                    totalNum: 10,
                    returnNum: 20,
                    closeContactsNum: 30,
                    partyNum: 40,
                    keyEpidemicAreasNum: 50,
                    abnormalPhysicalConditionsNum: 60,
                    quarantinedOnThatDayNum: 70,
                    isolatedTotalNum: 80,
                    quarantinedAtHomeOnThatDayNum: 90,
                    atHomeTotalNum: 100,
                }
            ],
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        const {clusterActiveColor} = this.state;
        // new Promise((resolve, reject) => {
        //     dispatch({
        //         type: 'touchStatisticsPageList/fetchStatisticsListAction',
        //         params: {},
        //         resolve,
        //         reject,
        //     });
        // }).then(response => {
        //     if (response.code === 0) {
        //
        //     } else {
        //         T.prompt.error(response.msg);
        //     }
        // });
    }

    componentWillUnmount(){
        const {dispatch} = this.props;
    }

    //
    handleMapChange(e, fieldName, key) {
        const {dataSource} = this.state;
        const newData = dataSource.map(item => ({...item}));
        const target = this.getRowByKey(key, newData);
        if (target) {
            target[fieldName] = e.target.value;
            this.setState({dataSource: newData});
        }
    };

    getRowByKey(key, newData) {
        const {dataSource} = this.state;
        return (newData || dataSource).filter(item => item.key === key)[0];
    }

    //获取当前页数数据
    fetchDataList = () => {
        const {dispatch, dataDistribution} = this.props;
        const {platformType} = dataDistribution;
        const {currentPage, inputValue, clusterActiveColor} = this.state;
        let self = this;
        //后台发送的参数
        let sendParams = {};
        if (platformType === 'cluster') {
            sendParams = {
                clusterId: clusterActiveColor,
            }
        }
        new Promise((resolve, reject) => {
            dispatch({
                type: platformType === 'local' ? 'dataDistribution/fetchSourceListAction' : 'dataDistribution/fetchRemoteClusterListAction',
                params: {
                    ...sendParams,
                    page: currentPage,
                    pageSize: EnumPluginListPageInfo.defaultPageSize,
                    taskName: inputValue
                },
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                if (platformType === 'local') {
                    self.setState({
                        localResourcesAccessed: response.data.total,
                    })
                }
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //导出功能
    exportData = () => {
        console.log("导出");
    };

    //页码变换
    pageChange = (page) => {
        this.setState({
            currentPage: page.current,
        }, () => {
            this.fetchDataList();
        });
    };

    render() {
        const {
            fetchStatisticsListStatus,
            touchStatisticsPageList,
        } = this.props;
        const {statisticsList} = touchStatisticsPageList;
        const {dataSource, currentPage, pageSize, inputValue, clusterActiveColor, platformExpand} = this.state;
        const columns = [
            {
                title: '县市区',
                dataIndex: 'city',
            },
            {
                title: '摸排总人数',
                dataIndex: 'totalNum',
            },
            {
                title: '来烟（返烟）人数',
                dataIndex: 'returnNum',
            },
            {
                title: '与确诊、疑似病例有过密切接触的人数',
                dataIndex: 'closeContactsNum',
            },
            {
                title: '与密切接触者有过共同生活、工作、学习、聚会的人数',
                dataIndex: 'partyNum',
            },
            {
                title: '与重点疫区人员有过接触的人数',
                dataIndex: 'keyEpidemicAreasNum',
            },
            {
                title: '身体状况异常的人数',
                dataIndex: 'abnormalPhysicalConditionsNum',
            },
            {
                title: '当日集中隔离人数',
                dataIndex: 'quarantinedOnThatDayNum',
            },
            {
                title: '累计集中隔离人数（1月24日至今）',
                dataIndex: 'isolatedTotalNum',
                render: (text, record) => {
                    return (
                        <Input
                            value={text}
                            autoFocus
                            onChange={e => this.handleMapChange(e, 'isolatedTotalNum', record.key)}
                            placeholder="请输入累计集中隔离人数"
                        />
                    );
                },
            },
            {
                title: '当日居家隔离人数',
                dataIndex: 'quarantinedAtHomeOnThatDayNum',
            },
            {
                title: '累计居家隔离人数（1月24日至今）',
                dataIndex: 'atHomeTotalNum',
                render: (text, record) => {
                    return (
                        <Input
                            value={text}
                            autoFocus
                            onChange={e => this.handleMapChange(e, 'atHomeTotalNum', record.key)}
                            placeholder="请输入累计居家隔离人数"
                        />
                    );
                },
            },
            // {
            //     title: '操作',
            //     render: (text, record) => (
            //         <Fragment>
            //             <a onClick={() => this.showDetailModal(record)}>详情</a>
            //             <Divider type="vertical"/>
            //             <a onClick={() => this.showSingleDistributionModal(record)}>分发配置</a>
            //         </Fragment>
            //     ),
            // },
        ];
        return (
            <PageHeaderWrapper title={"摸排工作统计表"}>
                <Row className={styles.title}>
                    摸排工作统计表
                </Row>
                <Row className={styles.exportBtn}>
                    <Col span={2} offset={22}>
                        <Button type="primary"><a onClick={this.exportData}>导出</a></Button>
                    </Col>
                </Row>
                <Row className={styles.distributeTitle}>
                    <Col span={12}>
                        <span>县市区：</span>
                        <span>芝罘区</span>
                    </Col>
                    <Col span={12}>
                        <span>截止日期：</span>
                        <span>1192.23.23</span>
                    </Col>
                </Row>
                <Table
                    className={styles.distributeTable}
                    // loading={platformType === 'local' ? fetchLocalListStatus : fetchRemoteListStatus}
                    dataSource={statisticsList}
                    pagination={false}
                    columns={columns}
                    onChange={this.pageChange}
                />
            </PageHeaderWrapper>
        );
    }
}

export default StatisticsList;
