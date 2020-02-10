import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './CheckRecordDetail.less';
import T from './../../utils/T';
import router from 'umi/router';
import {formatMessage} from 'umi-plugin-react/locale';

import {EnumPluginListPageInfo} from './../../constants/EnumPageInfo';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';

import {
    Button,
    Input,
    Row,
    Col,
    Icon,
    Table,
    Card,
    List,
    Spin,
    DatePicker,
} from 'antd';

//数据分发页面
/* eslint react/no-multi-comp:0 */
@connect(({dataDistribution, dataSyncNewMission, loading}) => ({
    dataDistribution,
    dataSyncNewMission,
    fetchLocalListStatus: loading.effects['dataDistribution/fetchSourceListAction'],
    fetchRemoteListStatus: loading.effects['dataDistribution/fetchRemoteClusterListAction'],
}))
class CheckRecordDetail extends PureComponent {
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
            basicPersonnelInformation: {
                location: '芝罘区',
                name: '王凯',
            }
        };
    }

    componentDidMount() {
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

    showDetail = () => {
        router.push({
            pathname: '/metadataManage/metadataManageConfig/info',
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
        const {basicPersonnelInformation, currentPage, pageSize, inputValue, clusterActiveColor, platformExpand} = this.state;
        const columns = [
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
            <PageHeaderWrapper
                title={"疫情防控调查详情查看"}
                isSpecialBreadcrumb={true}
            >
                <div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailTitleName}>
                            人员基本信息
                        </div>
                        <Card style={{marginBottom: 20}}>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>县市区：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>姓名：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createDate') ? T.helper.dateFormat(basicPersonnelInformation.createDate) : '---' : '---'}</span>
                                </Col>
                                <Col span={6}>
                                    <span>年龄：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                                <Col span={6}>
                                    <span>性别：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>籍贯：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>住址：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createDate') ? T.helper.dateFormat(basicPersonnelInformation.createDate) : '---' : '---'}</span>
                                </Col>
                                <Col span={6}>
                                    <span>身份证号码：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                                <Col span={6}>
                                    <span>联系电话：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>被调查人基本情况：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                            </Row>
                        </Card>
                        <div className={styles.detailTitleName}>
                            人员活动信息
                        </div>
                        <Card style={{marginBottom: 20}}>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>从何地来烟(返烟)：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>来烟(返烟)时间：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createDate') ? T.helper.dateFormat(basicPersonnelInformation.createDate) : '---' : '---'}</span>
                                </Col>
                                <Col span={6}>
                                    <span>来烟(返烟)方式：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                                <Col span={6}>
                                    <span>航班/车次/船次/车牌号：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>期间还到过哪些城市：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                                </Col>
                            </Row>
                        </Card>
                      <div className={styles.detailTitleName}>
                        人员接触信息
                      </div>
                      <Card style={{marginBottom: 20}}>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>是否与确诊、疑似病例密切接触过：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>接触者姓名：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>接触者身份证号：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6} className={styles.detailBtns}>
                            <span>来接触时间</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createDate') ? T.helper.dateFormat(basicPersonnelInformation.createDate) : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>接触地点：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>是否与密切接触者共同生活、工作、学习、聚会过：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>接触者姓名：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>接触者身份证号：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6} className={styles.detailBtns}>
                            <span>来接触时间</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createDate') ? T.helper.dateFormat(basicPersonnelInformation.createDate) : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>接触地点：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>是否与重点疫区人员接触过：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>接触者姓名：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>接触者身份证号：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6} className={styles.detailBtns}>
                            <span>来接触时间</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createDate') ? T.helper.dateFormat(basicPersonnelInformation.createDate) : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>接触地点：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                        </Row>
                      </Card>
                      <div className={styles.detailTitleName}>
                        人员接触新信息
                      </div>
                      <Card style={{marginBottom: 20}}>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>身体状况：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6} className={styles.detailBtns}>
                            <span>是否就医：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createDate') ? T.helper.dateFormat(basicPersonnelInformation.createDate) : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>就医医院：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>就医时间</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>是否采取过防护措施：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={12} className={styles.detailBtns}>
                            <span>什么时间内采取的防护措施：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createDate') ? T.helper.dateFormat(basicPersonnelInformation.createDate) : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>下步拟采取措施：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>

                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>填报日期：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                          <Col span={6}>
                            <span>摸排人：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('createBy') ? basicPersonnelInformation.createBy : '---' : '---'}</span>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default CheckRecordDetail;
