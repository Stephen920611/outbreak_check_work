import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './DataDistributionList.less';
import T from './../../utils/T';
import router from 'umi/router';
import {formatMessage} from 'umi-plugin-react/locale';

import {EnumPluginListPageInfo, EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
    List,
    Badge,
} from 'antd';

//数据分发页面
/* eslint react/no-multi-comp:0 */
@connect(({dataDistribution, dataSyncNewMission, loading}) => ({
    dataDistribution,
    dataSyncNewMission,
    fetchLocalListStatus: loading.effects['dataDistribution/fetchSourceListAction'],
    fetchRemoteListStatus: loading.effects['dataDistribution/fetchRemoteClusterListAction'],
}))
class DataDistributionList extends PureComponent {
    constructor() {
        super();
        this.state = {
            currentPage: EnumPluginListPageInfo.defaultPage,
            pageSize: EnumPluginListPageInfo.defaultPageSize,
            inputValue: "",     //输入框的值
            platformExpand: false,  //是否展开
            localResourcesAccessed: 0 ,//本地资源数
            clusterActiveColor: '000',//选中的颜色，本地的自己造成000， 为了满足list的id需求
        };
    }

    componentDidMount() {
        T.storage.setStorage('HtmlType', {'modalType':'dataDestination','isProcessorEdit':false});
        const {dispatch} = this.props;
        const {clusterActiveColor} = this.state;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/fetchClusterManageListServicesAction',
                params: {},
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                // 默认获取数据
                this.fetchDataList();
            } else {
                T.prompt.error(response.message);
            }
        });
        if(clusterActiveColor==='000'){
            dispatch({
                type: 'dataDistribution/setPlatformTypeAction',
                platformType: 'local',
            });
        }
    }

    componentWillUnmount(){
        const {dispatch} = this.props;
        //组件卸载的时候要重置成本地平台
        /*dispatch({
            type: 'dataDistribution/setPlatformTypeAction',
            platformType: 'local',
        });*/
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

    //查询功能
    searchDataSource = () => {
        this.fetchDataList();
    };

    //重置功能
    resetDataSource = () => {
        let self = this;
        this.setState({
            inputValue: "",
            currentPage: EnumPluginListPageInfo.defaultPage
        }, () => {
            //重置之后重新获取首页数据
            self.fetchDataList()
        });
    };

    //详情功能
    showDetailModal = (data) => {
        const {dispatch, dataDistribution} = this.props;
        const {platformType} = dataDistribution;
        //远程数据接入没有uuid，是取id吗？
        // console.log(data,'data');
        /*
        *   createBy: "system"
            createDate: "2019-10-07 19:51"
            des: ""
            desc: ""
            id: "08236a1e0903421ab8a468038ca6610b"
            isNewRecord: false
            key: 1
            name: "jdbc-test1"
            plugin: {id: "1153876697261858816", isNewRecord: false, pluginType: "source", icon: "mysql"}
            status: "0"
            taskId: "dcd3a273aef84c10b86a0c4a66275894"
            updateBy: ""
            updatedAt: "2019-10-07 19:51"
            uuid: "08236a1e0903421ab8a468038ca6610b"
        * */
        // //设置缓存里
        // T.storage.setStorage('taskId', data.taskId);
        // //跳路由
        // router.push({
        //     pathname: '/dataTask/missionDetail',
        //     params: {
        //         data: data,
        //         isRouterPush: true,
        //     },
        // });
        //将uuid放到缓存里
        T.storage.setStorage('processorId', platformType === 'local' ? data.uuid : data.id);
        // dataSyncNewMission根据checkType类型来访问不同的接口
        dispatch({
            type: 'dataSyncNewMission/changeDataSourceType',
            checkType: platformType,
        });

        router.push({
            pathname: '/dataDistribution/accessDetail',
            params: {
                isRouterPush: true,
            },
        });
    };

    //分发配置功能
    showSingleDistributionModal = (data) => {
        const {dispatch,dataDistribution} = this.props;
        const {platformType} = dataDistribution;
        T.storage.setStorage('processorId', platformType === 'local' ? data.uuid : data.id);
        //跳路由
        router.push({
            pathname: '/dataDistribution/distributeConfig',
            params: {
                data: data,
                isRouterPush: true
            },
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

    //更改输入框
    onInputChange = (e) => {
        this.setState({
            inputValue: e.target.value,
        });
    };

    /**
     * 插入新建按钮数据
     * @param list {array}
     * @returns {*}
     */
    unshiftArr = (list) => {
        const {platformExpand, localResourcesAccessed} = this.state;
        if (list.length === 0) {
            list.unshift({
                isNew: true,
                name: "本地平台",
                numberResourcesAccessed: localResourcesAccessed,
                remarks: "本地平台",
                id: '000',
            });
        } else {
            !list[0].hasOwnProperty('isNew')
                ? list.unshift({
                    isNew: true,
                    name: "本地平台",
                    numberResourcesAccessed: localResourcesAccessed,
                    remarks: "本地平台",
                    id: '000',
                })
                : '';
        }
        return this.changeList(list, platformExpand);
    };
    /**
     * 展开操作
     */
    handleExpand = () => {
        const {platformExpand} = this.state;
        this.setState({
            platformExpand: !platformExpand,
        });
    };
    /**
     * 根据up/down的状态来控制显示的数据的数量
     * @param list {array}
     * @param expand {boolean}
     * @returns {*} {array}
     */
    changeList = (list, expand) => {
        if (list.length > 4 && !expand) {
            return list.slice(0, 4);
        } else {
            return list;
        }
    };

    //切换数据平台
    onSelectPlatform = (key) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dataDistribution/setPlatformTypeAction',
            platformType: key.id === '000' ? 'local' : 'cluster',
        });
        this.setState({
            clusterActiveColor: key.id,
            currentPage: EnumDataSyncPageInfo.defaultPage,  //切换平台，每次从第一页开始
        }, () => {
            //获取当前页数数据
            this.fetchDataList();
        });
    };

    render() {
        const {
            fetchLocalListStatus,
            fetchRemoteListStatus,
            dataSyncNewMission,
            dataDistribution
        } = this.props;
        const {sourceData, platformType} = dataDistribution;
        const {clusterPlatformList} = dataSyncNewMission;
        const {currentPage, pageSize, inputValue, clusterActiveColor, platformExpand} = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
            },
            {
                title: '数据源名称',
                dataIndex: 'name',
            },
            {
                title: '描述',
                dataIndex: 'description',
            },
            {
                title: '接入时间',
                dataIndex: 'create_date',
                render: val => <span>{T.helper.dateFormat(val, 'YYYY-MM-DD HH:mm:ss')}</span>,
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Fragment>
                        <a onClick={() => this.showDetailModal(record)}>详情</a>
                        <Divider type="vertical"/>
                        <a onClick={() => this.showSingleDistributionModal(record)}>分发配置</a>
                    </Fragment>
                ),
            },
        ];
        return (
            <PageHeaderWrapper title={"数据分发"}>
                <Row className={styles.distributeTitle}>
                    <Col span={8}>
                        <span>数据源名称</span>
                        <Input
                            className={styles.distributeInput}
                            value={inputValue}
                            placeholder={formatMessage({id: 'dataDistribution.index.PlaceHolder',})}
                            onChange={this.onInputChange}
                        />
                    </Col>
                    <Col span={8} className={styles.distributeBtns}>
                        <Button onClick={this.searchDataSource}>查询</Button>
                        <Button onClick={this.resetDataSource} type="primary">重置</Button>
                    </Col>
                </Row>
                <div className={styles.cardPlatform}>
                    <Card>
                        <List
                            rowKey="id"
                            // loading={getAllProcessorListStatus}
                            grid={{gutter: 24, lg: 4, md: 4, sm: 4, xs: 4}}
                            dataSource={this.unshiftArr(
                                T.lodash.orderBy(clusterPlatformList, 'create_date', 'desc')
                            )}
                            renderItem={item =>
                                <List.Item
                                    key={item.uuid}
                                    onClick={this.onSelectPlatform.bind(this, item)}
                                    className={styles.card}
                                >
                                    <Card
                                        hoverable
                                        size="default"
                                        id={item.hasOwnProperty('id') ? item.id : ''}
                                        style={{height: '82px'}}
                                        className={
                                            clusterActiveColor === item.id ? styles.activeColor : null
                                        }
                                    >
                                        <div className={styles.platformContent}>
                                            <div className={styles.platformLeft}>{item.name}</div>
                                            {item.hasOwnProperty('isNew') ?
                                                <div className={styles.platformRight} style={{lineHeight: '40px'}}>
                                                    <p>
                                                        <Badge color="#4ecb73"/>
                                                        已接入资源数：<span
                                                        className={styles.platformRightText}>{item.numberResourcesAccessed}</span>个
                                                    </p>
                                                </div>
                                                : <div className={styles.platformRight}>
                                                    <p>
                                                        <Badge color="#4ecb73"/>
                                                        已接入资源数：<span
                                                        className={styles.platformRightText}>{item.numberResourcesAccessed}</span>个
                                                    </p>
                                                    <p>
                                                        <Badge color="#36cbcb"/>
                                                        可接入资源数：<span
                                                        className={styles.platformRightText}>{item.numberResourcesAccessible}</span>个
                                                    </p>
                                                </div>
                                            }
                                        </div>
                                    </Card>
                                </List.Item>
                            }
                        />
                        <div className={styles.upOrDown}>
                            <a className={styles.trigger} onClick={this.handleExpand.bind(this)}>
                                <Icon
                                    type={platformExpand ? 'up' : 'down'}
                                />
                            </a>
                        </div>
                    </Card>
                </div>
                <Table
                    className={styles.distributeTable}
                    loading={platformType === 'local' ? fetchLocalListStatus : fetchRemoteListStatus}
                    dataSource={sourceData.sourceList}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: sourceData.hasOwnProperty("count") ? sourceData.count : 0,
                        showTotal: (total) => {
                            return `共${total}条`
                        },
                        showSizeChanger: false,
                        showQuickJumper: false
                    }}
                    columns={columns}
                    onChange={this.pageChange}
                />
            </PageHeaderWrapper>
        );
    }
}

export default DataDistributionList;
