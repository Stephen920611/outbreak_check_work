import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import styles from './DataSyncList.less';
import T from './../../utils/T';
import router from 'umi/router';

import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import {EnumProcessorStatus, EnumIconSrc, EnumClusterColor} from './../../constants/dataSync/EnumSyncCommon';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
    Button,
    Icon,
    List,
    Input,
    Select,
    Popconfirm,
    Row,
    Col,
    Badge,
    Avatar,
} from 'antd';

const {Search} = Input;
const {Option} = Select;
const ButtonGroup = Button.Group;
import testMysql from './imgs/testMysql.jpg';

//数据同步任务列表页面
/* eslint react/no-multi-comp:0 */
@connect(({dataSyncNewMission, clusterManage, loading}) => ({
    dataSyncNewMission,
    clusterManage,
    fetchDataMissionStatus: loading.effects['dataSyncNewMission/fetchSourceProcessorsListAction'],
    fetchDataListStatus: loading.effects['dataSyncNewMission/fetchClusterSourceProcessorsListAction'],
    fetchPlatformListStatus: loading.effects['dataSyncNewMission/fetchClusterManageListServicesAction'],
}))
class DataSyncList extends PureComponent {
    constructor() {
        super();
        this.state = {
            currentPage: EnumDataSyncPageInfo.defaultPage,
            platformExpand: false,  //是否展开
            localResourcesAccessed: 0,//本地资源数
            clusterActiveColor: '000',//选中的颜色
            // checkType: 'local',//判断是本地还是远程
            name:'',//数据源name
            status:'',//数据源状态
        };
    }

    componentDidMount() {
        const {dataSyncNewMission, dispatch} = this.props;

        //写入缓存，是数据接入还是数据分发
        T.storage.setStorage('HtmlType', {'modalType': 'dataOrigin', 'isProcessorEdit': false});
        //更改页面类型
        dispatch({
            type: 'dataSyncNewMission/changeModalTypeAction',
            modalType: 'dataOrigin',
        });

        //本地
        dispatch({
            type: 'dataSyncNewMission/changeDataSourceType',
            checkType:'local',
        });

        //获取远程集群平台
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/fetchClusterManageListServicesAction',
                params: {},
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                // 默认获取本地数据
                this.fetchDataList();
            } else {
                T.prompt.error(response.message);
            }
        });

    }

    //获取当前页数据(本地)
    fetchDataList = () => {
        const {dispatch,dataSyncNewMission} = this.props;
        const {checkType} = dataSyncNewMission;
        const {currentPage,clusterActiveColor,status,name} = this.state;
        let self = this;
        let sendParams = {};
        if (checkType === 'cluster') {
            sendParams = {
                clusterId: clusterActiveColor,
            }
        }
        new Promise((resolve, reject) => {
            dispatch({
                type: checkType === 'local' ? 'dataSyncNewMission/fetchSourceProcessorsListAction' : 'dataSyncNewMission/fetchClusterSourceProcessorsListAction',
                // type: 'dataSyncNewMission/fetchSourceProcessorsListAction',
                params: {
                    ...sendParams,
                    name:name,
                    status:status,
                    page: currentPage,
                    pageSize: EnumDataSyncPageInfo.defaultPageSize,
                },
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                if (checkType === 'local') {
                    self.setState({
                        localResourcesAccessed: response.data.total,
                    })
                }
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //新建任务
    createNewMission = () => {
        const {dispatch} = this.props;
        //更改编辑状态
        dispatch({
            // type: 'dataSyncNewMission/changeSourceEditAction',
            type: 'dataSyncNewMission/changeProcessorEditAction',
            isProcessorEdit: false
        });
        //回退到第一步
        dispatch({
            type: 'dataSyncNewMission/setCurrentStepAction',
            currentStep: 0,
        });
        //清空选中的数据源类型
        /*dispatch({
            type: 'dataSyncNewMission/changeSourceTypeInfoAction',
            params: {
                originActiveColor: '',
                sourceUuid: '',
            },
        });*/
        //清空选中的数据源或数据目的地类型
        dispatch({
            type: 'dataSyncNewMission/changeProcessorTypeInfoAction',
            params: {
                originActiveColor: '',
                processorUuid: '',
            },
        });
        //清空表单form表单数据
        dispatch({
            type: 'dataSyncNewMission/setFormDataAction',
            formData: {},
        });
        //创建新的数据源
        dispatch({
            type: 'dataSyncNewMission/createNewMissionAction',
        });

    };

    //搜索功能
    searchResult = value => {
        // console.log('value',value);
        const {dispatch} = this.props;
        this.setState({
            name:value,
            currentPage: EnumDataSyncPageInfo.defaultPage,
        },()=>{
            this.fetchDataList();
        })
    };

    //筛选功能
    handleSelectChange = value => {
        // console.log(`筛选的值 ${value}`);
        this.setState({
            status:value,
            currentPage: EnumDataSyncPageInfo.defaultPage,
        },()=>{
            this.fetchDataList();
        })

    };

    //页码变换
    pageChange = page => {
        const {clusterActiveColor} = this.state;
        this.setState({
                currentPage: page
            }, () => {
                this.fetchDataList();
                // clusterActiveColor === '000' ? this.fetchDataList() : this.fetchClusterDataList(clusterActiveColor);
            }
        );
    };

    //编辑数据源
    editSource = (item) => {
        const {dispatch} = this.props;
        dispatch({
            //更新选中的信息
            type: 'dataSyncNewMission/changeCurrentDataInfoAction',
            currentDataInfo: {
                className: item['class_name'],
                id: item.pluginId,
                uuid: item.uuid,
            },
        });
        //更改编辑状态
        /*dispatch({
            type: 'dataSyncNewMission/changeSourceEditAction',
            isSourceEdit: true
        });*/
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
            pathname: '/dataTask/step-form/config',
            params: {
                isRouterPush: true,
                uuid: item.uuid
            },
        });
    };

    /**
     * 处理数据源的操作
     * @param {string} data 数据列
     * @param {string} type activate 激活,resume 开始,pause 暂停,restart 重启,delete 删除
     */
    handleDifferentTask = (data, type) => {
        let self = this;
        // const { checkType } = this.state;
        const {dispatch,dataSyncNewMission} = this.props;
        const {checkType} = dataSyncNewMission;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/' + (type === 'activate' ? 'activateSourceProcessorAction' : type === 'resume' ? 'resumeSourceProcessorAction' : type === 'pause' ? 'pauseSourceProcessorAction' : type === 'restart' ? 'restartSourceProcessorAction' : type === 'delete' ? 'deleteSourceProcessorAction' : ''),
                uuid: checkType === 'local' ? data.uuid : data.id,//填写数据源的uuid
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                T.prompt.success(response.data);
                //重新刷新列表
                self.fetchDataList();
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //跳转详情页面
    toDetailPage = (data) => {
        const {dispatch,dataSyncNewMission} = this.props;
        const {checkType} = dataSyncNewMission;
        //将uuid放到缓存里
        T.storage.setStorage('processorId', checkType === 'local' ? data.uuid : data.id);
        router.push({
            pathname: '/dataTask/accessDetail',
            params: {
                isRouterPush: true,
            },
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
    onSelectPlatform = (key) =>{
        const {dispatch} = this.props;
        //本地or远程
        dispatch({
            type: 'dataSyncNewMission/changeDataSourceType',
            checkType: key.id === '000' ? 'local':'cluster',
        });
        this.setState({
            clusterActiveColor:key.id,
            // checkType: key.id === '000' ? 'local':'cluster',
            currentPage: EnumDataSyncPageInfo.defaultPage,//切换平台，每次从第一页开始
        }, () => {
            //获取当前页数数据
            this.fetchDataList();
        });
    };
    renderSelectOption = () =>{
        let arrKeys = T.lodash.keys(EnumProcessorStatus);
        return (
            arrKeys.map(item => {
                return (
                    <Option key={item} value={item} title={EnumProcessorStatus[item]["label"]}>
                        {EnumProcessorStatus[item]["label"]}
                    </Option>
                )
            })
        )

    };


    render() {
        const {fetchDataMissionStatus,fetchDataListStatus, dataSyncNewMission, clusterManage,fetchPlatformListStatus} = this.props;
        const {sourceProcessorsList,clusterPlatformList,checkType} = dataSyncNewMission;
        const {currentPage,clusterActiveColor} = this.state;
        return (
            <PageHeaderWrapper title={'数据接入'}>
                <div className={styles.syncTitle}>
                    <div className={styles.syncTitleName}>
                        数据源
                        <span>/{sourceProcessorsList.hasOwnProperty('total') ? sourceProcessorsList.total : sourceProcessorsList.hasOwnProperty('count') ? sourceProcessorsList.count : '-'}条</span>
                        <Button type="primary" onClick={this.createNewMission} style={{marginLeft:50}}>
                            <Icon type="plus"/>
                            <span style={{color:'#fff'}}>新建数据源</span>
                        </Button>
                    </div>
                    <div className={styles.syncTitleBtn}>
                        <Select
                            placeholder="筛选"
                            className={styles.syncTitleSelect}
                            style={{width: 120}}
                            onChange={this.handleSelectChange}
                            defaultValue=""
                        >
                            <Option key="" value="">
                                <FormattedMessage id="metadataManage.dataSourceManagement.dataSourceSearchForm.databaseType.option.ALL"/>
                            </Option>
                            {this.renderSelectOption()}

                            {/*{EnumProcessorStatus.map((item)=>{*/}
                                {/*<Option value={item.value}>{item.label}</Option>*/}
                            {/*})}*/}
                        </Select>
                        <Search
                            placeholder="搜索"
                            className={styles.syncTitleSearch}
                            onSearch={this.searchResult}
                            style={{width: 200}}
                            allowClear
                        />
                    </div>
                </div>
                <div className={styles.cardPlatform}>
                    <Card>
                        <List
                            rowKey="id"
                            loading={fetchPlatformListStatus}
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
                                    type={this.state.platformExpand ? 'up' : 'down'}
                                />
                            </a>
                        </div>
                    </Card>
                </div>
                <div className={styles.cardList}>
                    <List
                        rowKey="id"
                        loading={checkType === 'local' ? fetchDataMissionStatus : fetchDataListStatus}
                        pagination={{
                            current: currentPage,
                            onChange: this.pageChange,
                            pageSize: EnumDataSyncPageInfo.defaultPageSize,
                            total: sourceProcessorsList.hasOwnProperty('total') ? Number(sourceProcessorsList.total) + 1 : sourceProcessorsList.hasOwnProperty('count') ? Number(sourceProcessorsList.count) + 1 : 0,
                        }}
                        grid={{gutter: 24, lg: 6, md: 6, sm: 1, xs: 1}}
                        dataSource={sourceProcessorsList.hasOwnProperty('data') ? sourceProcessorsList.data : sourceProcessorsList.hasOwnProperty('list') ? sourceProcessorsList.list : []}
                        className={styles.syncList}
                        renderItem={item => {
                            return !(item.hasOwnProperty('isNew') && item.isNew) ? (
                                <List.Item key={item.uuid}>
                                    <Card
                                        hoverable
                                        className={styles.card}
                                        title={
                                            <div className={styles.cardTitle}>
                                                <Icon
                                                    type="exclamation-circle"
                                                    style={{
                                                        marginRight: 20,
                                                        fontSize: 24,
                                                        color: item.hasOwnProperty('state') ?
                                                            T.lodash.isUndefined(EnumProcessorStatus[item.state]) ? EnumProcessorStatus['UNKNOWN'].color : EnumProcessorStatus[item.state].color
                                                            :
                                                            EnumProcessorStatus['UNKNOWN'].color
                                                    }}
                                                    title={item.hasOwnProperty('state') ?
                                                        T.lodash.isUndefined(EnumProcessorStatus[item.state]) ? EnumProcessorStatus['UNKNOWN'].label : EnumProcessorStatus[item.state].label
                                                        :
                                                        EnumProcessorStatus['UNKNOWN'].label
                                                    }
                                                />
                                                <Button
                                                    disabled={(item.state === EnumProcessorStatus['INACTIVED'].value || item.state === EnumProcessorStatus['FAILED'].value) ? false : true}
                                                    title="激活" shape="circle" icon="bulb" size={"small"}
                                                    onClick={() => this.handleDifferentTask(item, 'activate')}/>
                                                <Button
                                                    disabled={item.state === EnumProcessorStatus['PAUSED'].value ? false : true}
                                                    title="开始"
                                                    shape="circle" icon="caret-right" size={"small"}
                                                    onClick={() => this.handleDifferentTask(item, 'resume')}/>
                                                <Button
                                                    disabled={item.state === EnumProcessorStatus['RUNNING'].value ? false : true}
                                                    title="暂停"
                                                    shape="circle" icon="pause" size={"small"}
                                                    onClick={() => this.handleDifferentTask(item, 'pause')}/>
                                                <Button
                                                    disabled={(item.state === EnumProcessorStatus['RUNNING'].value || item.state === EnumProcessorStatus['PAUSED'].value) ? false : true}
                                                    title="重启" shape="circle" icon="reload" size={"small"}
                                                    onClick={() => this.handleDifferentTask(item, 'restart')}/>
                                            </div>
                                        }
                                        bordered={false}
                                        extra={
                                            <ButtonGroup>
                                                <Button
                                                    size="small"
                                                    icon="edit"
                                                    title="编辑"
                                                    disabled={(item.state === EnumProcessorStatus['INACTIVED'].value || item.state === EnumProcessorStatus['PAUSED'].value || item.state === '') ? false : true}
                                                    onClick={this.editSource.bind(this, item)}
                                                />
                                                <Popconfirm
                                                    title="确定要删除这个数据源吗?"
                                                    onConfirm={this.handleDifferentTask.bind(this, item, 'delete')}
                                                    okText="是"
                                                    cancelText="否"
                                                >
                                                    <a href="#">
                                                        <Button
                                                            size="small"
                                                            icon="delete"
                                                            disabled={item.state === EnumProcessorStatus['RUNNING'].value ? true : false}
                                                        />
                                                    </a>
                                                </Popconfirm>
                                            </ButtonGroup>
                                        }
                                    >
                                        <div className={styles.syncCardContent}>
                                            <div className={styles.syncCardSource}>
                                                {checkType === 'local' ?
                                                    <img
                                                        src={item.hasOwnProperty('icon') ? EnumIconSrc[item.icon].url : testMysql}
                                                        alt=""
                                                    />
                                                    : <Avatar style={{
                                                        color: '#fff',
                                                        backgroundColor: '1890ff',
                                                        marginRight: '10px'
                                                    }}>
                                                        {item.hasOwnProperty('name') ? item.name.substring(0, 1) : '-'}
                                                    </Avatar>
                                                }
                                                {/*<img
                                                    src={item.hasOwnProperty('icon') ? EnumIconSrc[item.icon].url : testMysql}
                                                    alt=""
                                                />*/}
                                                <div onClick={this.toDetailPage.bind(this, item)}>
                                                    {item.hasOwnProperty('name') ? item.name : '--'}
                                                </div>
                                            </div>
                                            <div className={styles.syncCardLine}/>
                                            <div className={styles.syncBtnContent}>
                                                {checkType === 'local' ?
                                                    <span
                                                        style={{
                                                            textAlign: "left",
                                                            fontSize: 10,
                                                            color: "#999"
                                                        }}
                                                    >
                                                    处理速率:{item.hasOwnProperty('rate') ? item.rate : '--'}条/秒
                                                </span>
                                                    : <span></span>}

                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            ) : (
                                <List.Item key={item.taskId}>
                                    <Card hoverable className={styles.specialCard}>
                                        <Button type="solid" onClick={this.createNewMission}>
                                            <Icon type="plus"/> 新建数据源
                                        </Button>
                                    </Card>
                                </List.Item>
                            );
                        }}
                    />
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default DataSyncList;
