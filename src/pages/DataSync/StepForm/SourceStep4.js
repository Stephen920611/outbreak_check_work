import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './style.less';
import T from './../../../utils/T';
import router from 'umi/router';
import {EnumIconSrc} from './../../../constants/dataSync/EnumSyncCommon';

import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import testMysql from './../imgs/testMysql.jpg';
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
    Radio,
    Switch,
} from 'antd';

const {TabPane} = Tabs;
const {Option} = Select;
const FormItem = Form.Item;

//修改任务Modal
@connect(({dataSyncNewMission,dataDistribution, loading}) => ({
    dataSyncNewMission,
    dataDistribution,
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
@Form.create()
class SourceStep4 extends PureComponent {
    constructor() {
        super();
        this.websocketConstructor = null;
        this.state = {
            formItemLayout: {
                labelCol: {
                    xs: {span: 9},
                    sm: {span: 4},
                    md: {span: 2},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 10,},
                    md: {span: 10},
                },
            },
            radioValue:'',//全量数据/增量数据
            showGlobalRadioValue:'',//全量数据 - 读取方式
            showIncrementalRadioValue:'',//增量数据 - 读取方式
            showBeginningRadioValue:'',//读取起点
        };
    }

    componentDidMount() {
        const {dataSyncNewMission, location} = this.props;
        const {modalType} = dataSyncNewMission;
        // T.auth.returnSpecialMainPage(location, modalType === 'dataOrigin' ? '/dataTask/step-form/sourceType' : '/dataDistribution/step-form/sourceType');
        T.auth.returnSpecialMainPage(location, T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? '/dataTask/step-form/sourceType' : '/dataDistribution');

    };

    /**
     * 上一步
     */
    onPrev = () => {
        const {dispatch,dataSyncNewMission} = this.props;
        const {modalType} = dataSyncNewMission;
        router.push({
            pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/rule' : '/dataDistribution/step-form/rule',
            params: {
                isRouterPush: true,
            },
        });
        //跳到第三步
        dispatch({
            type: 'dataSyncNewMission/setCurrentStepAction',
            currentStep: 2,
        });
    };

    /**
     * 保存配置
     */
    saveConfig = () => {
        const {dispatch, form,dataSyncNewMission} = this.props;
        const {processorParamInfo,modalType} = dataSyncNewMission;
        form.validateFieldsAndScroll((err, values) => {
            console.log('values', values);
        });

        //本地保存
        dispatch({
            type: "dataSyncNewMission/saveProcessorParamInfoAction",
            processorParamInfo: processorParamInfo,
        });
        console.log('processorParamInfo',processorParamInfo);
        //保存配置接口
        //保存配置,数据源和数据目的地分别保存接口
        new Promise((resolve, reject) => {
            dispatch({
                type: modalType === 'dataOrigin' ? 'dataSyncNewMission/saveSourceConfigAction' : 'dataSyncNewMission/saveSinkConfigAction',
                params: processorParamInfo,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                T.prompt.success("保存配置成功");
                //本地保存（点击保存配置后，再保存就是编辑，要传uuid）
                processorParamInfo['uuid'] = response.data;
            } else {
                T.prompt.error(response.message);
            }
        });

    };

    /**
     * 激活功能
     */
    onActive = () => {
        const {dispatch,dataSyncNewMission} = this.props;
        const {processorParamInfo,modalType} = dataSyncNewMission;
        //将uuid放到缓存里
        T.storage.setStorage('processorId', processorParamInfo['uuid']);
        //本地保存
        dispatch({
            type: "dataSyncNewMission/saveProcessorParamInfoAction",
            processorParamInfo: processorParamInfo,
        });
        // console.log(processorParamInfo);
        new Promise((resolve, reject) => {
            dispatch({
                type: modalType === 'dataOrigin' ? 'dataSyncNewMission/activateSourceProcessorAction': 'dataDistribution/activateSinkProcessorAction',
                uuid: processorParamInfo['uuid'],//填写数据源的uuid
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                console.log('response',response);
                T.prompt.success('激活成功！');
                //重新刷新列表
                //激活成功跳转回列表页面
                router.push({
                    pathname: modalType === 'dataOrigin' ?'/dataTask':'/dataDistribution/distributeConfig',
                    params: {
                        isRouterPush: true,
                    },
                });
            } else {
                T.prompt.error(response.message);
            }
        });

    };

    //同步范围：全量数据or增量数据
    onRadioChange = e => {
        this.setState({
            radioValue: e.target.value === 'incrementalData' ? false : true,
            radioGroupValue: e.target.value,
        });
    };

    //全量数据读取方式：同步一次or定时读取
    onGlobalRadioChange = e => {
        this.setState({
            showGlobalRadioValue: e.target.value === 'synchronous' ? false : true,
            globalRadioValue: e.target.value,
        });
    };

    //增量数据读取方式：BINLOG or 增量识别字段
    onIncrementalRadioChange = e => {
        this.setState({
            showIncrementalRadioValue: e.target.value === 'binlog' ? false : true,
            incrementalRadioValue: e.target.value,
        });
    };

    //增量数据读取起点：激活任务为起点 or 自定义
    onBeginningRadioChange = e => {
        this.setState({
            showBeginningRadioValue: e.target.value === 'activation' ? false : true,
            beginningRadioValue: e.target.value,
        });
    };
    //渲染KB,MB单位
    renderSelectKBAfter = (name) => {
        const {
            form,
        } = this.props;
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        let nameUnit = name +'Unit';
        return (
            getFieldDecorator(nameUnit, {
                initialValue: 'KB',
            })(
                <Select style={{width: 80}}>
                    <Option value="KB">KB</Option>
                    <Option value="MB">MB</Option>
                </Select>
            )
        )
    };
    //渲染时间单位
    renderSelectTimeAfter = (name) => {
        const {
            form,
        } = this.props;
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        let nameUnit = name +'Unit';
        return (
            getFieldDecorator(nameUnit, {
                initialValue: 'second',
            })(
                <Select style={{width: 80}}>
                    <Option value="second">秒</Option>
                    <Option value="minute">分</Option>
                </Select>
            )
        )
    };

    render() {
        const {
            loading,
            dataSyncNewMission,
            img,
            form,
        } = this.props;
        const {
            getMissionDetail,
            processorParamInfo,
        } = dataSyncNewMission;
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        const {
            formItemLayout,
            radioValue,//全量数据/增量数据
            showGlobalRadioValue,//全量数据 - 读取方式
            showIncrementalRadioValue,//增量数据 - 读取方式
            showBeginningRadioValue,//读取起点
        } = this.state;

        return (
            <Fragment>
                {
                    loading ?
                        <div className={styles.loading}>
                            <Spin size="large"/>
                        </div>
                        :
                        <div>
                            <Form hideRequiredMark className={[styles.stepForm, styles.stepForm4]}>
                                <Form.Item label="摸排数据平台">
                                    <Row gutter={24}>
                                        <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                            <Card hoverable size="default">
                                                <Card.Meta
                                                    avatar={
                                                        <img
                                                            alt=""
                                                            className={styles.cardAvatar}
                                                            src={
                                                                processorParamInfo.hasOwnProperty('icon') && processorParamInfo.icon != ''
                                                                    ? EnumIconSrc[processorParamInfo.icon].url
                                                                    : testMysql
                                                            }
                                                        />
                                                    }
                                                    title={
                                                        <div className={styles.title}>
                                                            <div className={styles.name}>
                                                                {processorParamInfo.hasOwnProperty('name')
                                                                    ? processorParamInfo.name
                                                                    : '---'}
                                                            </div>
                                                        </div>
                                                    }
                                                ></Card.Meta>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Card style={{marginBottom: 10}}>
                                    <Form.Item
                                        {...formItemLayout}
                                        label='写入并发数量'
                                    >
                                        {getFieldDecorator('concurrentNumber', {})(
                                            <Input
                                                autoComplete="off"
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        label='处理速率限制'
                                    >
                                        <Input.Group compact>
                                            <span>大小 读取满</span>
                                            {getFieldDecorator('processRate', {})(
                                                <Input className={styles.subTaskInput}
                                                       addonAfter={this.renderSelectKBAfter('processRate')}/>
                                            )}
                                            <span>时批量写入</span>
                                        </Input.Group>

                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayout}
                                        label='表和字段名称'
                                    >
                                        {getFieldDecorator('tableAndField', {})(
                                            <Radio.Group onChange={this.onRadioChange}>
                                                <Radio value="globalData">自定义</Radio>
                                                <Radio value="maxData">全部大写</Radio>
                                                <Radio value="minData">全部小写</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <div>
                                            <div>每次定时执行批量同步前，允许清除目标表数据</div>
                                            <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>开启后，目标表的数据将会定时清除</span>
                                            {getFieldDecorator('switch', {valuePropName: 'checked'})(
                                                <Switch style={{marginLeft: 200}}/>
                                            )}
                                        </div>
                                    </Form.Item>
                                </Card>

                                <Form.Item label="任务设置">
                                    {getFieldDecorator('taskConfig', {
                                        initialValue:'globalData'
                                    })(
                                        <Card style={{marginBottom: 10}} title="同步范围">
                                            <Radio.Group onChange={this.onRadioChange}>
                                                <Radio value="globalData">全量数据</Radio>
                                                <Radio value="incrementalData">增量数据</Radio>
                                            </Radio.Group>
                                        </Card>
                                    )}

                                </Form.Item>
                                {radioValue ? (
                                    <Card style={{marginBottom: 10}} title="全量数据读取设置">
                                        <Form.Item>
                                            {getFieldDecorator('fullDataReading', {})(
                                                <Radio.Group
                                                    onChange={this.onGlobalRadioChange}
                                                    // value={this.state.globalRadioValue}
                                                >
                                                    <span style={{marginRight: 10}}>读取方式</span>
                                                    <Radio value="synchronous">同步一次</Radio>
                                                    <Radio value="timing">定时读取</Radio>
                                                </Radio.Group>
                                            )}

                                        </Form.Item>
                                        {showGlobalRadioValue ? (
                                            <Form.Item>
                                                <Input.Group compact>
                                                    <span>读取频率 </span>
                                                    {getFieldDecorator('fullDataReadingSpeed', {})(
                                                        <Input className={styles.subTaskInput}/>
                                                    )}
                                                    <span> 秒</span>
                                                </Input.Group>
                                            </Form.Item>
                                        ) : (
                                            ''
                                        )}
                                    </Card>
                                ) : (
                                    <Card title="增量数据读取设置">
                                        <Form.Item>
                                            {getFieldDecorator('incrementalReading', {
                                                initialValue: 'activation',
                                            })(
                                                <Radio.Group
                                                    onChange={this.onIncrementalRadioChange}
                                                    // value={this.state.incrementalRadioValue}
                                                >
                                                    <span style={{marginRight: 10}}>读取方式</span>
                                                    <Radio value="binlog">BINLOG</Radio>
                                                    <Radio value="incrementalField">增量识别字段</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                        {showIncrementalRadioValue ? (
                                            <Form.Item>
                                                {getFieldDecorator('incrementalReading', {})(
                                                    <Input.Group compact>
                                                        <span>读取频率 </span>
                                                        {getFieldDecorator('incrementalReadingSpeed', {})(
                                                            <Input className={styles.subTaskInput}/>
                                                        )}
                                                        <span> 秒</span>
                                                    </Input.Group>
                                                )}
                                            </Form.Item>
                                        ) : (
                                            <span></span>
                                        )}
                                            <div>
                                                <Form.Item>
                                                {getFieldDecorator('incrementalReadingStart', {
                                                    initialValue: 'activation',
                                                })(
                                                    <Radio.Group
                                                        onChange={this.onBeginningRadioChange}
                                                        // value={this.state.beginningRadioValue}
                                                    >
                                                        <span style={{marginRight: 10}}>读取起点</span>
                                                        <Radio value="activation">激活任务为起点</Radio>
                                                        <Radio value="custom">自定义</Radio>
                                                    </Radio.Group>
                                                )}
                                                </Form.Item>
                                                {showBeginningRadioValue ? (
                                                    <div className={styles.frequency}>
                                                        <Form.Item>
                                                                <Input.Group compact>
                                                                    <span>Binlog Position  </span>
                                                                    {getFieldDecorator('incrementalBinlogPosition', {})(
                                                                        <Input placeholder="请输入Position"
                                                                               className={styles.frequencyInput}
                                                                        />
                                                                    )}
                                                                </Input.Group>
                                                        </Form.Item>
                                                        <Form.Item>
                                                            <Input.Group compact>
                                                                <span>Binlog 文件名称  </span>
                                                                {getFieldDecorator('incrementalBinlogName', {})(
                                                                    <Input placeholder="请输入Binlog文件名称"
                                                                           className={styles.frequencyInput}

                                                                    />
                                                                )}
                                                            </Input.Group>
                                                        </Form.Item>
                                                        <Form.Item>
                                                            <Input.Group compact>
                                                                <span>GTID </span>
                                                                {getFieldDecorator('incrementalBinlogGTID', {})(
                                                                    <Input placeholder="请输入GTID"
                                                                           className={styles.frequencyInput}
                                                                    />
                                                                )}
                                                            </Input.Group>
                                                        </Form.Item>
                                                    </div>
                                                ) : (
                                                    <span></span>
                                                )}

                                            </div>
                                    </Card>
                                )}

                                {/*<Form.Item>
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
                                </Form.Item>*/}
                                <Card style={{marginBottom: 10,marginTop:24}} className={styles.setting}>
                                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                                        <TabPane tab="错误队列设置" key="1">
                                            <Form.Item label="预处理设置">
                                                <Radio.Group onChange={this.onChange}
                                                              defaultValue="11"
                                                >
                                                    <Radio value="11">默认（每个表预处理100000行）</Radio>
                                                    <Radio value="2">
                                                        <span>每个表预处理</span>
                                                        <input/>
                                                        <span>行</span>
                                                    </Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item label="预警设置" >
                                                <Radio.Group onChange={this.onChange}
                                                              defaultValue="3"
                                                >
                                                    <Radio value="3">默认（错误率大于0.5%，发出预警通知）</Radio>
                                                    <Radio value="4">
                                                        <span>错误率大于</span>
                                                        <input/>
                                                        <span>%，发出预警通知</span>
                                                    </Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item label="暂停设置"
                                                       // value="5"
                                            >
                                                <Radio.Group onChange={this.onChange}
                                                             defaultValue="5"
                                                >
                                                    <Radio value="5">默认（错误率大于1%，暂停改数据任务，并通知参与人）</Radio>
                                                    <Radio value="6">
                                                        <span>错误率大于</span>
                                                        <input/>
                                                        <span>%，暂停该数据任务，并通知参与人</span>
                                                    </Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </TabPane>
                                        <TabPane tab="子任务设置" key="2">
                                            <Form>
                                                <Form.Item>
                                                    <Input.Group compact>
                                                        <span>条数 读取满</span>
                                                        {getFieldDecorator('subTasks', {})(
                                                            <Input className={styles.subTaskInput}
                                                                   addonAfter={this.renderSelectKBAfter('subTasks')}
                                                            />
                                                        )}
                                                        <span>条时批量写入</span>
                                                    </Input.Group>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Input.Group compact>
                                                        <span>大小 读取满</span>
                                                        {getFieldDecorator('subTaskSize', {})(
                                                            <Input className={styles.subTaskInput}
                                                                   addonAfter={this.renderSelectKBAfter('subTaskSize')}
                                                            />
                                                        )}
                                                        <span>时批量写入</span>
                                                    </Input.Group>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Input.Group compact>
                                                        <span>时间 读取满</span>
                                                        {getFieldDecorator('subTaskTime', {})(
                                                            <Input className={styles.subTaskInput}
                                                                   addonAfter={this.renderSelectTimeAfter('subTaskTime')}
                                                            />
                                                        )}
                                                        <span>时批量写入</span>
                                                    </Input.Group>
                                                </Form.Item>
                                            </Form>
                                        </TabPane>
                                    </Tabs>
                                </Card>
                            </Form>
                            <Row
                                gutter={24}
                                style={{marginTop: 32}}
                            >
                                <Col xl={24} lg={24} md={8} sm={24} xs={24} style={{textAlign: 'center'}}>
                                    <Button onClick={this.onPrev}>
                                        上一步
                                    </Button>
                                    <Button
                                        onClick={this.saveConfig}
                                        style={{marginLeft: 20}}
                                    >
                                        保存配置
                                    </Button>
                                    <Button
                                        style={{marginLeft: 20}}
                                        type="primary"
                                        onClick={this.onActive}
                                    >
                                        激活
                                    </Button>
                                </Col>
                            </Row>
                        </div>

                }
            </Fragment>
        );
    }
}

export default SourceStep4;
