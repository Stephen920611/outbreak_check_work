import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import styles from './style.less';
import T from './../../../utils/T';
import {EnumIconSrc} from './../../../constants/dataSync/EnumSyncCommon';
import {Form, Button, Card, Row, Col, Radio, Tabs, Select} from 'antd';

const {TabPane} = Tabs;
const {Option} = Select;
import SyncConfigDataOriginModal from './../SyncConfigDataOriginModal';
import SyncDetailDataModal from './../SyncDetailDataModal';
import testMysql from './../imgs/testMysql.jpg';

//分步界面 - 任务设置


@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    getMissionDetailStatus: loading.effects['dataSyncNewMission/getTaskDetailByIdAction'],
}))
@Form.create()
class newTask2 extends React.PureComponent {
    state = {
        radioValue: true,
        radioGroupValue: 'globalData',
        showGlobalRadioValue: false,
        globalRadioValue: 'synchronous',
        showIncrementalRadioValue: false,
        incrementalRadioValue: 'binlog',
        beginningRadioValue: 'activation',
        showBeginningRadioValue: false,
        dataModalVisible: false,
    };

    componentDidMount() {
        const {dispatch, location} = this.props;
        //验证是否刷新页面
        T.auth.returnSpecialMainPage(location, '/dataTask/dataSync');
        let params = {
            taskId: T.storage.getStorage('taskId'),
        };
        dispatch({
            type: 'dataSyncNewMission/getTaskDetailByIdAction',
            params,
        });
    }

    //同步范围：全量数据or增量数据
    onRadioChange = e => {
        this.setState({
            radioValue: e.target.value == 'globalData' ? true : false,
            radioGroupValue: e.target.value,
        });
    };

    //全量数据读取方式：同步一次or定时读取
    onGlobalRadioChange = e => {
        this.setState({
            showGlobalRadioValue: e.target.value == 'synchronous' ? false : true,
            globalRadioValue: e.target.value,
        });
    };

    //增量数据读取方式：BINLOG or 增量识别字段
    onIncrementalRadioChange = e => {
        this.setState({
            showIncrementalRadioValue: e.target.value == 'binlog' ? false : true,
            incrementalRadioValue: e.target.value,
        });
    };

    //增量数据读取起点：激活任务为起点 or 自定义
    onBeginningRadioChange = e => {
        this.setState({
            showBeginningRadioValue: e.target.value == 'activation' ? false : true,
            beginningRadioValue: e.target.value,
        });
    };

    //切换tab
    callback = key => {
    };

    //获取数据源结构还是获取数据目的地详情
    onShowDetail = type => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {getMissionDetail} = dataSyncNewMission;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/getProcessorsDetailsAction',
                id: type == 'dataOrigin' ? getMissionDetail.hasOwnProperty('source') ? getMissionDetail.source:'':getMissionDetail.hasOwnProperty('sink') ? getMissionDetail.sink:'',
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                let connectorClass = response.data['config']['connector.class'];
                if(connectorClass==='io.confluent.connect.jdbc.JdbcSourceConnector'||connectorClass ==='io.confluent.connect.jdbc.JdbcSinkConnector'){
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

    //点击下一步
    onValidateForm = e => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {getMissionDetail} = dataSyncNewMission;
        e.preventDefault();
        let params = {
            createBy: '',
            createDate: '',
            des: '',
            name: getMissionDetail.taskName,
            status: '',
            step: '4',
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
                router.push({
                    pathname: '/dataTask/step-form/rule',
                    params: {
                        isRouterPush: true,
                    },
                });
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    render() {
        const {dataSyncNewMission} = this.props;
        const {
            getMissionDetail,
            getMissionDetailStatus,
        } = dataSyncNewMission;
        return (
            <Fragment>
                <Form layout="horizontal" className={styles.stepForm}>
                    <Form.Item label="摸排数据平台">
                        <Row gutter={24}>
                            <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Card hoverable size="default" loading={getMissionDetailStatus}>
                                    <Card.Meta
                                        avatar={
                                            <img
                                                alt=""
                                                className={styles.cardAvatar}
                                                src={
                                                    getMissionDetail.hasOwnProperty('sourceicon')
                                                        ? EnumIconSrc[getMissionDetail.sourceicon].url
                                                        : testMysql
                                                }
                                            />
                                        }
                                        title={
                                            <div className={styles.title}>
                                                <div className={styles.name}>
                                                    {getMissionDetail.hasOwnProperty('sourceName')
                                                        ? getMissionDetail.sourceName
                                                        : '---'}
                                                </div>
                                                <div
                                                    className={styles.detail}
                                                    onClick={this.onShowDetail.bind(this, 'dataOrigin')}
                                                >
                                                    详情
                                                </div>
                                            </div>
                                        }
                                    ></Card.Meta>
                                </Card>
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                <Card hoverable size="default">
                                    <Card.Meta
                                        avatar={
                                            <img
                                                alt=""
                                                className={styles.cardAvatar}
                                                src={
                                                    getMissionDetail.hasOwnProperty('sinkIcon')
                                                        ? EnumIconSrc[getMissionDetail.sinkIcon].url
                                                        : testMysql
                                                }
                                            />
                                        }
                                        title={
                                            <div className={styles.title}>
                                                <div className={styles.name}>
                                                    {getMissionDetail.hasOwnProperty('sinkName')
                                                        ? getMissionDetail.sinkName
                                                        : '---'}
                                                </div>
                                                <div
                                                    className={styles.detail}
                                                    onClick={this.onShowDetail.bind(this, 'dataDestination')}
                                                >
                                                    详情
                                                </div>
                                            </div>
                                        }
                                    ></Card.Meta>
                                </Card>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="任务设置">
                        <Card style={{marginBottom: 10}} title="同步范围">
                            <Radio.Group onChange={this.onRadioChange} value={this.state.radioGroupValue}>
                                <Radio value="globalData">全量数据</Radio>
                                <Radio value="incrementalData">增量数据</Radio>
                            </Radio.Group>
                        </Card>
                    </Form.Item>
                    <Form.Item>
                        {this.state.radioValue ? (
                            <Card style={{marginBottom: 10}} title="全量数据读取设置">
                                <Radio.Group
                                    onChange={this.onGlobalRadioChange}
                                    value={this.state.globalRadioValue}
                                >
                                    <span style={{marginRight: 10}}>读取方式</span>
                                    <Radio value="synchronous">同步一次</Radio>
                                    <Radio value="timing">定时读取</Radio>
                                    {this.state.showGlobalRadioValue ? (
                                        <div className={styles.frequency}>
                                            <span>读取频率</span>
                                            <input type="text" className={styles.frequencyInput}/>
                                            <span> 秒</span>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </Radio.Group>
                            </Card>
                        ) : (
                            <Card title="增量数据读取设置">
                                <Radio.Group
                                    onChange={this.onIncrementalRadioChange}
                                    value={this.state.incrementalRadioValue}
                                >
                                    <span style={{marginRight: 10}}>读取方式</span>
                                    <Radio value="binlog">BINLOG</Radio>
                                    <Radio value="incrementalField">增量识别字段</Radio>
                                    {this.state.showIncrementalRadioValue ? (
                                        <div className={styles.frequency}>
                                            <span>读取频率</span>
                                            <input type="text" className={styles.frequencyInput}/>
                                            <span>秒</span>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </Radio.Group>
                                <div className={styles.readingStart}>
                                    <Radio.Group
                                        onChange={this.onBeginningRadioChange}
                                        value={this.state.beginningRadioValue}
                                    >
                                        <span style={{marginRight: 10}}>读取起点</span>
                                        <Radio value="activation">激活任务为起点</Radio>
                                        <Radio value="custom">自定义</Radio>
                                        {this.state.showBeginningRadioValue ? (
                                            <div className={styles.frequency}>
                                                <div>
                                                    Binlog Position
                                                    <input
                                                        type="text"
                                                        placeholder="请输入Position"
                                                        className={styles.frequencyInput}
                                                    />
                                                </div>
                                                <div>
                                                    Binlog 文件名称
                                                    <input
                                                        type="text"
                                                        placeholder="请输入Binlog文件名称"
                                                        className={styles.frequencyInput}
                                                        style={{marginBottom: 10, marginTop: 10}}
                                                    />
                                                </div>
                                                <div>
                                                    GTID
                                                    <input
                                                        type="text"
                                                        placeholder="请输入GTID"
                                                        className={styles.frequencyInput}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </Radio.Group>
                                </div>
                            </Card>
                        )}
                    </Form.Item>
                    <Card style={{marginBottom: 10}} className={styles.setting}>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="错误队列设置" key="1">
                                <Form.Item label="预处理设置">
                                    <Radio.Group onChange={this.onChange} defaultValue="11">
                                        <Radio value="11">默认（每个表预处理100000行）</Radio>
                                        <Radio value="2">
                                            <span>每个表预处理</span>
                                            <input/>
                                            <span>行</span>
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="预警设置" value="3">
                                    <Radio.Group onChange={this.onChange} defaultValue="3">
                                        <Radio value="3">默认（错误率大于0.5%，发出预警通知）</Radio>
                                        <Radio value="4">
                                            <span>错误率大于</span>
                                            <input/>
                                            <span>%，发出预警通知</span>
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="暂停设置" value="5">
                                    <Radio.Group onChange={this.onChange} defaultValue="5">
                                        <Radio value="5">默认（错误率大于1%，暂停改数据任务，并通知参与人）</Radio>
                                        <Radio value="6">
                                            <span>错误率大于</span>
                                            <input/>
                                            <span>%，暂停该数据任务，并通知参与人</span>
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </TabPane>
                            <TabPane tab="子任务设置" key="12">
                                <Form>
                                    <Form.Item>
                                        <div>
                                            <span>条数 读取满</span>
                                            <input className={styles.subTaskInput}/>
                                            <span>条时批量写入</span>
                                        </div>
                                    </Form.Item>
                                    <Form.Item>
                                        <div>
                                            <span>大小 读取满</span>
                                            <input className={styles.subTaskInput}/>
                                            <Select defaultValue="KB" style={{width: 60}}>
                                                <Option value="kb">KB</Option>
                                                <Option value="mb">MB</Option>
                                            </Select>
                                            <span>时批量写入</span>
                                        </div>
                                    </Form.Item>
                                    <Form.Item>
                                        <div>
                                            <span>时间 读取满</span>
                                            <input className={styles.subTaskInput}/>
                                            <Select defaultValue="秒" style={{width: 60}}>
                                                <Option value="second">秒</Option>
                                                <Option value="minute">分</Option>
                                            </Select>
                                            <span> 时批量写入</span>
                                        </div>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </Card>
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
                <SyncConfigDataOriginModal/>
                <SyncDetailDataModal/>
            </Fragment>
        );
    }
}

export default newTask2;
