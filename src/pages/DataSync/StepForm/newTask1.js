import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import T from './../../../utils/T';
import styles from './style.less';
import router from 'umi/router';
import ReactDOM from 'react-dom';

import {EnumIconSrc} from './../../../constants/dataSync/EnumSyncCommon';
import {
    Form,
    Input,
    Button,
    Select,
    Divider,
    Card,
    Row,
    Col,
    List,
    Icon,
    Modal,
    Spin,
    Tooltip,
    message,
} from 'antd';

const {Option} = Select;
import SyncChooseDataTypeModal from './../SyncChooseDataTypeModal';
import SyncConfigDataOriginModal from './../SyncConfigDataOriginModal';
import SyncDetailDataModal from './../SyncDetailDataModal';
import testMysql from './../imgs/testMysql.jpg';

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    getAllProcessorListStatus: loading.effects['dataSyncNewMission/getAllProcessorListActive'],
}))
@Form.create()
class newTask1 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            originActiveColor: '', //选中数据源的uuid
            destinationActiveColor: false,
            sinkUuid: '',
            sourceUuid: '',
            inputValue: '',
            detailDataModalVisible: false,
            dataDestinationExpand: false,
            dataOriginExpand: false,
        };
        this.listRef = createRef();
    }

    componentDidMount() {
        const {dispatch, location} = this.props;
        //加载数据源和数据目的地列表
        dispatch({
            type: 'dataSyncNewMission/getAllProcessorListActive',
        });
        let params = {
            taskId: T.storage.getStorage('taskId'),
        };
        let self = this;
        //获取任务详情
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/getTaskInfoAction',
                params,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                self.recordDataId(response.data[0]);
            } else {
                T.prompt.error(response.message);
            }
        });
        //验证是否刷新页面
        T.auth.returnSpecialMainPage(location, '/dataTask/dataSync');
    }

    componentWillReceiveProps(nextProps) {
        const {getMissionDetail} = nextProps.dataSyncNewMission;
        //新建完成，选中状态
        if (getMissionDetail !== this.props.dataSyncNewMission.getMissionDetail) {
            this.setState({
                originActiveColor: getMissionDetail.hasOwnProperty('source') ? getMissionDetail.source : '',
                destinationActiveColor: getMissionDetail.hasOwnProperty('sink') ? getMissionDetail.sink : '',
                sourceUuid: getMissionDetail.hasOwnProperty('source') ? getMissionDetail.source : '',
                sinkUuid: getMissionDetail.hasOwnProperty('sink') ? getMissionDetail.sink : '',
            });
        }
    }

    componentWillUnmount(){
        //销毁异步请求
        this.setState = (state, callback) => {
            return;
        };
    }

    /**
     * 添加选中状态
     */
    recordDataId = (data) => {
        this.setState({
            originActiveColor: data.hasOwnProperty('source') ? data.source : '',
            destinationActiveColor: data.hasOwnProperty('sink') ? data.sink : '',
            sourceUuid: data.hasOwnProperty('source') ? data.source : '',
            sinkUuid: data.hasOwnProperty('sink') ? data.sink : '',
        });
    };

    /**
     * 打开新建数据源或者新建目的地模态框
     * @param type {string}
     */
    showDataModal = type => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {
            dataModalVisible
        } = dataSyncNewMission;
        const {originActiveColor, inputValue} = this.state;
        //this.state.originActiveColor 数据源的uuid
        if (originActiveColor || type === 'dataOrigin') {
            //更改页面类型
            dispatch({
                type: 'dataSyncNewMission/changeHtmlTypeAction',
                htmlType: 'dataSync',
            });
            dispatch({
                type: 'dataSyncNewMission/changeModalTypeAction',
                modalType: type,
            });
            //获取数据源结构还是获取数据目的地接口
            dispatch({
                type: type === 'dataOrigin' ? 'dataSyncNewMission/fetchDataSourcePluginsAction' : 'dataSyncNewMission/fetchDataDestinationPluginsAction',
            });
            //打开新建数据源或者新建目的地模态框
            dispatch({
                type: 'dataSyncNewMission/changeDataModalVisibleAction',
                dataModalVisible: true,
            });
        } else {
            T.prompt.error('请先选择数据源！');
        }
    };

    /**
     * 获取输入框里的值
     * @param e
     */
    onChangeName = e => {
        this.setState({
            inputValue: e.target.value,
        });
    };

    //输入框失去焦点触发
    /*onBlurName = () => {
        const {dispatch} = this.props;
        const {sourceUuid, sinkUuid, inputValue} = this.state;
        if (inputValue) {
            let params = {
                createBy: '',
                createDate: '',
                des: '',
                name: inputValue,
                status: '',
                step: '0',
                updateBy: T.auth.getLoginInfo().user.loginCode,
                updateDate: '',
                source: sourceUuid,
                sink: sinkUuid,
                uuid: T.storage.getStorage('taskId'),
            };
            dispatch({
                //完善任务接口
                type: 'dataSyncNewMission/updateTaskByIdAction',
                params,
            });
        }
    };*/

    /**
     * 点击选中数据源触发
     * @param key
     */
    onSelectOrigin = key => {
        this.setState({
            originActiveColor: key.uuid,
            sourceUuid: key.uuid,
        });
    };

    /**
     * 点击选中数据目的地触发
     * @param key
     */
    onSelectDestination = key => {
            this.setState({
                destinationActiveColor: key.uuid,
                sinkUuid: key.uuid,
            });
    };

    /**
     * 展开操作
     * @param {string} type
     */
    handleExpand = type => {
        const {dataOriginExpand, dataDestinationExpand} = this.state;
        switch (type) {
            case 'dataOrigin':
                this.setState({
                    dataOriginExpand: !dataOriginExpand,
                });
                break;
            case 'dataDestination':
                this.setState({
                    dataDestinationExpand: !dataDestinationExpand,
                });
                break;
        }
    };

    /**
     * 根据up/down的状态来控制显示的数据的数量
     * @param list {array}
     * @param expand {boolean}
     * @returns {*} {array}
     */
    changeList = (list, expand) => {
        if (list.length > 12 && !expand) {
            return list.slice(0, 12);
        } else {
            return list;
        }
    };

    /**
     * 插入新建按钮数据
     * @param list {array}
     * @param type {string}
     * @returns {*}
     */
    unshiftArr = (list, type) => {
        if (list.length === 0) {
            list.unshift({
                icon: '0',
                isNew: true,
            });
        } else {
            !list[0].hasOwnProperty('isNew')
                ? list.unshift({
                    icon: '0',
                    isNew: true,
                })
                : '';
        }
        switch (type) {
            case 'dataOrigin':
                return this.changeList(list, this.state.dataOriginExpand);
            case 'dataDestination':
                return this.changeList(list, this.state.dataDestinationExpand);
        }
    };

    //获取（元数据管理）数据源
    getDataManageUrl = (currentDataInfoClassName) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/getMetadataManageTreeAction',
            currentDataInfoClassName,
        });
    };

    /**
     * 获取数据源结构还是获取数据目的地详情
     * @param data {object}
     * @param type {string}
     */
    onShowDetail = (data, type) => {
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/getProcessorsDetailsAction',
                id: data.uuid,
                resolve,
                reject,
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
        }).then(response => {
            if (response.result === 'true') {
                //判断是否为jdbc数据源或者数据目的地，是获取元数据管理中的数据源树
                let connectorClass = response.data['config']['connector.class'];
                this.getDataManageUrl(connectorClass);
                // if(connectorClass==='io.confluent.connect.jdbc.JdbcSourceConnector'||connectorClass ==='io.confluent.connect.jdbc.JdbcSinkConnector'){
                //     this.getDataManageUrl();
                // }
            }
        });
    };

    /**
     * 点击下一步
     * @param e
     */
    onValidateForm = e => {
        const {form, dataSyncNewMission, getAllProcessorListStatus, dispatch} = this.props;
        const {getNewTaskData} = dataSyncNewMission;
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        const {
            sourceUuid,
            sinkUuid,
            inputValue,
            destinationActiveColor,
            originActiveColor
        } = this.state;

        if (originActiveColor && destinationActiveColor) {
            validateFields((err, values) => {
                let params = {
                    createBy: '',
                    createDate: '',
                    des: '',
                    name: inputValue,
                    status: '',
                    step: '3',
                    updateBy: T.auth.getLoginInfo().user.loginCode,
                    updateDate: '',
                    source: sourceUuid,
                    sink: sinkUuid,
                    uuid: T.storage.getStorage('taskId'),
                };
                if (!err) {
                    dispatch({
                        //完善任务接口
                        type: 'dataSyncNewMission/firstUpdateTaskByIdAction',
                        params,
                    });
                }
            });
        } else {
            T.prompt.error('请选择数据源或者数据目的地！');
        }
    };

    render() {
        const {form, dataSyncNewMission, getAllProcessorListStatus} = this.props;
        const {
            configDataModalVisible,
            getSourceProcessorList,
            getSinkProcessorList,
            getNewTaskData,
            detailModalData,
            // newProcessorId,
        } = dataSyncNewMission;
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        return (
            <Fragment>
                <Form layout="horizontal" hideRequiredMark>
                    <Form.Item>
                        <Card className={styles.sInput}>
                            <div>数据任务名称</div>
                            <Divider style={{margin: '20px 0 20px'}}/>
                            <Row gutter={24}>
                                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                                    {getFieldDecorator('taskName', {
                                        rules: [
                                            {
                                                required: true,
                                                max: 50,
                                                message: '请输入任务名称！',
                                            },
                                        ],
                                    })(
                                        <Input
                                            placeholder="请输入任务名称、最多50个字符"
                                            allowClear
                                            onChange={this.onChangeName}
                                        />
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    </Form.Item>
                    <Form.Item>
                        <Card>
                            <div ref="city">选择数据源</div>
                            <Divider style={{margin: '20px 0 20px'}}/>
                            <div className={styles.cardList}>
                                <List
                                    rowKey="id"
                                    loading={getAllProcessorListStatus}
                                    ref={this.listRef}
                                    grid={{gutter: 24, lg: 6, md: 4, sm: 3, xs: 2}}
                                    dataSource={this.unshiftArr(
                                        T.lodash.orderBy(getSourceProcessorList, 'create_date', 'desc'),
                                        'dataOrigin'
                                    )}
                                    renderItem={item =>
                                        !(item.hasOwnProperty('isNew') && item.isNew) ? (
                                            <List.Item
                                                key={item.uuid}
                                                onClick={this.onSelectOrigin.bind(this, item)}
                                                className={styles.card}
                                            >
                                                <Tooltip placement="top" title={item.title}>
                                                    <Card
                                                        hoverable
                                                        size="default"
                                                        id={item.hasOwnProperty('uuid') ? item.uuid : ''}
                                                        className={
                                                            this.state.originActiveColor == item.uuid ? styles.activeColor : null
                                                        }
                                                    >
                                                        <Card.Meta
                                                            avatar={
                                                                <img
                                                                    alt=""
                                                                    className={styles.cardAvatar}
                                                                    src={
                                                                        item.hasOwnProperty('icon')
                                                                            ? EnumIconSrc[item.icon].url
                                                                            : testMysql
                                                                    }
                                                                />
                                                            }
                                                            title={
                                                                <div className={styles.title}>
                                                                    <div className={styles.name}>{item.name}</div>
                                                                    <div
                                                                        className={styles.detail}
                                                                        onClick={this.onShowDetail.bind(this, item, 'dataOrigin')}
                                                                    >
                                                                        详情
                                                                    </div>
                                                                </div>
                                                            }
                                                        ></Card.Meta>
                                                    </Card>
                                                </Tooltip>
                                            </List.Item>
                                        ) : (
                                            <List.Item onClick={this.showDataModal.bind(this, 'dataOrigin')}>
                                                <Card hoverable className={styles.card} size="default">
                                                    <Button className={styles.newButton}>
                                                        <Icon type="plus"/> 新建数据源
                                                    </Button>
                                                </Card>
                                            </List.Item>
                                        )
                                    }
                                />
                                <div className={styles.upOrDown}>
                                    <a className={styles.trigger} onClick={this.handleExpand.bind(this, 'dataOrigin')}>
                                        <Icon
                                            type={this.state.dataOriginExpand ? 'up' : 'down'}
                                        />
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </Form.Item>
                    <Form.Item>
                        <Card>
                            <div>选择数据目的地</div>
                            <Divider style={{margin: '20px 0 20px'}}/>
                            <div className={styles.cardList}>
                                <List
                                    rowKey="id"
                                    loading={getAllProcessorListStatus}
                                    grid={{gutter: 24, lg: 6, md: 4, sm: 3, xs: 2}}
                                    dataSource={this.unshiftArr(
                                        T.lodash.orderBy(getSinkProcessorList, 'create_date', 'desc'),
                                        'dataDestination'
                                    )}
                                    renderItem={item =>
                                        !(item.hasOwnProperty('isNew') && item.isNew) ? (
                                            <List.Item
                                                key={item.uuid}
                                                onClick={this.onSelectDestination.bind(this, item)}
                                                className={styles.card}
                                            >
                                                <Tooltip placement="top" title={item.title}>
                                                    <Card
                                                        hoverable
                                                        size="default"
                                                        id={item.hasOwnProperty('uuid') ? item.uuid : ''}
                                                        className={
                                                            this.state.destinationActiveColor == item.uuid
                                                                ? styles.activeColor
                                                                : null
                                                        }
                                                    >
                                                        <Card.Meta
                                                            avatar={
                                                                <img
                                                                    alt=""
                                                                    className={styles.cardAvatar}
                                                                    src={
                                                                        item.hasOwnProperty('icon')
                                                                            ? EnumIconSrc[item.icon].url
                                                                            : testMysql
                                                                    }
                                                                />
                                                            }
                                                            title={
                                                                <div className={styles.title}>
                                                                    <div className={styles.name}>{item.name}</div>
                                                                    <div
                                                                        className={styles.detail}
                                                                        onClick={this.onShowDetail.bind(this, item, 'dataDestination')}
                                                                    >
                                                                        详情
                                                                    </div>
                                                                </div>
                                                            }
                                                        ></Card.Meta>
                                                    </Card>
                                                </Tooltip>
                                            </List.Item>
                                        ) : (
                                            <List.Item onClick={this.showDataModal.bind(this, 'dataDestination')}>
                                                <Card hoverable className={styles.card} size="default">
                                                    <Button type="dashed" className={styles.newButton}>
                                                        <Icon type="plus"/> 新建数据目的地
                                                    </Button>
                                                </Card>
                                            </List.Item>
                                        )
                                    }
                                />
                                <div className={styles.upOrDown}>
                                    <a className={styles.trigger}
                                       onClick={this.handleExpand.bind(this, 'dataDestination')}>
                                        <Icon
                                            type={this.state.dataDestinationExpand ? 'up' : 'down'}
                                        />
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            xs: {span: 24},
                            sm: {
                                span: 24,
                            },
                        }}
                        label=""
                        style={{textAlign: 'right'}}
                    >
                        <Button type="primary" onClick={this.onValidateForm}>
                            下一步
                        </Button>
                    </Form.Item>
                </Form>
                <SyncChooseDataTypeModal/>
                <SyncConfigDataOriginModal/>
                <SyncDetailDataModal/>
            </Fragment>
        );
    }
}

export default newTask1;
