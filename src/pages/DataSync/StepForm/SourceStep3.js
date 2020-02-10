import React, {Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import T from './../../../utils/T';
import styles from './style.less';
import {
    Button,
    Row,
    Col,
    Spin,
    Table,
    Tag,
    Divider,
    Switch,
    Input,
    Popconfirm,
    Select,
    Card,
} from 'antd';
import SyncAddFieldModal from '../SyncAddFieldModal';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';


const {Option} = Select;

//分步界面- 配置规则
@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    data: dataSyncNewMission.step,
    getRuleStatus: loading.effects['dataSyncNewMission/fetchDataSourceConfigAction'],
}))
class SourceStep3 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            keyIndex: 0,    //序号下标
            modalType: T.storage.getStorage('HtmlType').modalType,
            dataLeft: [],//数据接入-配置规则/数据分发-配置规则左边表
            dataRight: [],//数据分发-配置规则右边表
            rulesKeyIndex: 0,//数据分发-路由规则序号
            routerTableList: [],//数据分发的路由规则
        };
    }

    componentDidMount() {
        const {dispatch, dataSyncNewMission, location} = this.props;
        const {modalType, processorParamInfo, detailModalData, currentStep, isProcessorEdit} = dataSyncNewMission;

        //刷新界面(数据源还是数据目的地，是否可编辑)
        // T.auth.returnSpecialMainPage(location, modalType === 'dataOrigin' ? '/dataTask/step-form/sourceType' : '/dataDistribution/step-form/sourceType');
        T.auth.returnSpecialMainPage(location, T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? T.storage.getStorage('HtmlType').isProcessorEdit ? '/dataTask' : '/dataTask/step-form/sourceType' : '/dataDistribution');
        //获取右边的表格（接口没有）
        if (processorParamInfo.hasOwnProperty('connectorPlugin') &&processorParamInfo['connectorPlugin'].hasOwnProperty('className')&&(processorParamInfo['connectorPlugin']['className'] === 'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector' || processorParamInfo['connectorPlugin']['className'] === 'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector')) {
            //新建  获取左边的表格（判断是否从第二步正常跳转）
            if (location.hasOwnProperty("params") && location.params.hasOwnProperty("configParams")&&!isProcessorEdit) {
                dispatch({
                    type: 'dataSyncNewMission/fetchDataSourceConfigAction',
                    params: location.hasOwnProperty('params') ? location.params.configParams : '',
                });
            }
            //编辑
            if (isProcessorEdit) {
               /* processorParamInfo['transform'].map((item)=>{
                    item['fetchColumn'] = item['fetchColumn'] ==='false'? false : true;
                });
                console.log('122',processorParamInfo['transform']);*/
                dispatch({
                    type: 'dataSyncNewMission/fetchDataSourceConfig',
                    configRules: processorParamInfo['transform'],
                });
                this.setState({
                    dataLeft: processorParamInfo['transform']
                })
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        const {dataSyncNewMission} = nextProps;
        const {configRules, isProcessorEdit} = dataSyncNewMission;
        const {fieldTypeArr} = this.state;
        //更新表格信息
        if (configRules !== this.props.dataSyncNewMission.configRules) {
            this.setState({
                dataLeft: configRules,
                keyIndex: configRules.length,
                dataRight: configRules,
                rulesKeyIndex: 0,
            });

        }
    }

    /**
     * 上一步
     */
    onPrev = () => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {modalType} = dataSyncNewMission;
        router.push({
            pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/config' : '/dataDistribution/step-form/config',
            params: {
                isRouterPush: true,
            },
        });
        //跳到第二步
        dispatch({
            type: 'dataSyncNewMission/setCurrentStepAction',
            currentStep: 1,
        });
    };

    /**
     * 保存配置
     */
    saveConfig = () => {
        let self = this;
        const {dispatch, dataSyncNewMission} = this.props;
        const {
            modalType,
            processorParamInfo,
            isProcessorEdit,
        } = dataSyncNewMission;
        const {dataLeft, routerTableList} = this.state;
        //transform jdbc存储映射规则的
        processorParamInfo['transform'] = dataLeft;
        //去除key，传递
        const newData = routerTableList.map(item => ({...item}));
        newData.map((item) => {
            delete item.key
        });
        //dataFilters jdbc存储路由规则的
        processorParamInfo['dataFilters'] = newData;
        // console.log('processorParamInfo',processorParamInfo);

        //本地保存
        dispatch({
            type: "dataSyncNewMission/saveProcessorParamInfoAction",
            processorParamInfo: processorParamInfo,
        });
        //编辑状态
        if (isProcessorEdit && processorParamInfo.hasOwnProperty('configuration')) {
            //编辑/新建统一格式
            processorParamInfo['config'] = processorParamInfo['configuration']['config'];
            //删除详情页中无用的参数configuration
            delete processorParamInfo.configuration;
        }
        // console.log('processorParamInfo', processorParamInfo);
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
                //更改编辑状态
                dispatch({
                    type: 'dataSyncNewMission/changeProcessorEditAction',
                    isProcessorEdit: true
                });
                //本地保存（点击保存配置后，再保存就是编辑，要传uuid）
                processorParamInfo['uuid'] = response.data;
                dispatch({
                    type: "dataSyncNewMission/saveProcessorParamInfoAction",
                    processorParamInfo: processorParamInfo,
                });
            } else {
                T.prompt.error(response.message);
            }
        });

        /*if (modalType === 'dataOrigin') {
            //获取详情
            new Promise((resolve, reject) => {
                dispatch({
                    type: 'dataSyncNewMission/saveSourceConfigAction',
                    params: sourceParamInfo,
                    resolve,
                    reject,
                });
            }).then(response => {
                if (response.result === 'true') {
                    T.prompt.success(response.data);
                } else {
                    T.prompt.error(response.message);
                }
            });
        }else{
            new Promise((resolve, reject) => {
                dispatch({
                    type: 'dataSyncNewMission/saveSinkConfigAction',
                    params: sinkParamInfo,
                    resolve,
                    reject,
                });
            }).then(response => {
                if (response.result === 'true') {
                    T.prompt.success(response.data);
                } else {
                    T.prompt.error(response.message);
                }
            });
        }*/

    };

    /**
     * 下一步
     */
    onFinish = () => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {modalType, processorParamInfo} = dataSyncNewMission;
        const {dataLeft,routerTableList} = this.state;
        let self = this;

        processorParamInfo['transform'] = dataLeft;
        const newData = routerTableList.map(item => ({...item}));
        newData.map((item) => {
            delete item.key
        });
        //dataFilters jdbc存储路由规则的
        processorParamInfo['dataFilters'] = newData;

        //本地保存
        dispatch({
            type: "dataSyncNewMission/saveProcessorParamInfoAction",
            processorParamInfo: processorParamInfo,
        });

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
                if (!processorParamInfo['uuid']) {
                    T.prompt.success("保存配置成功");
                }
                //本地保存（点击保存配置后，再保存就是编辑，要传uuid）
                processorParamInfo['uuid'] = response.data;
                dispatch({
                    type: "dataSyncNewMission/saveProcessorParamInfoAction",
                    processorParamInfo: processorParamInfo,
                });
                //跳转界面
                router.push({
                    pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/active' : '/dataDistribution/step-form/active',
                    params: {
                        isRouterPush: true,
                    },
                });
                //跳到第四步
                dispatch({
                    type: 'dataSyncNewMission/setCurrentStepAction',
                    currentStep: 3,
                });
            } else {
                T.prompt.error(response.message);
            }
        });

    };


    //数据分发- 路由规则input/select/switch 改变变化
    handleRouterChange(e, fieldName, fieldData, type) {
        const {routerTableList, dataLeft} = this.state;
        const newData = routerTableList.map(item => ({...item}));
        const target = this.getRowByKey(fieldData.key, newData);
        //input 框
        if (type === 'input') {
            if (target) {
                target[fieldName] = e.target.value;
                this.setState({routerTableList: newData});
            }

        } else {
            if (fieldName === 'condition') {
                if (target) {
                    target[fieldName] = String(e);
                    this.setState({routerTableList: newData});
                }
            } else {
                //field 上面列表的name相同的值
                let field = dataLeft.filter(item => item.name === String(e))[0];
                if (target) {
                    target[fieldName] = String(e);
                    target['fieldType'] = field['type'];
                    this.setState({
                        routerTableList: newData
                    });
                }
            }
        }
    };

    //数据分发 - 路由规则 - 新建一行
    newMember = () => {
        const {routerTableList, rulesKeyIndex} = this.state;
        const newData = routerTableList.map(item => ({...item}));
        newData.push({
            key: rulesKeyIndex + 1,
            fieldName: "",
            value: '',
            condition: "0",
            fieldType: "",
        });
        // this.index += 1;
        this.setState({
            routerTableList: newData,
            rulesKeyIndex: rulesKeyIndex + 1

        });
    };


    /**
     * 数据分发 - 路由规则 删除
     * @param {boolean} isSingle 是否是删除一行，
     * @param key 如果是删除一行的话，就需要key
     */
    remove = (isSingle = false, key) => {
        const {routerTableList, rulesKeyIndex} = this.state;
        //单选删除
        if (isSingle) {
            const newData = routerTableList.filter(item => item.key !== key);
            this.setState({routerTableList: newData});
        }
    };

    //数据接入/数据分发 - 映射规则input/select/switch 改变
    handleMapChange(e, fieldName, key, type) {
        const {dataLeft} = this.state;
        // console.log(key,'key');
        const newData = dataLeft.map(item => ({...item}));
        const target = this.getRowByKey(key, newData);
        if (target) {
            target[fieldName] = type === 'input' ? e.target.value : String(e);
            this.setState({dataLeft: newData});
        }
    };

    //数据接入/数据分发 - 映射规则- 删除新建的映射规则
    removeField = (data) => {
        const {dataLeft, rulesKeyIndex} = this.state;
        if(data.isNewRecord){
            const newData = dataLeft.filter(item => item.key !== data.key);
            this.setState({dataLeft: newData});
        }else{
            T.prompt.error('不可删除');
        }

    };

    //数据接入/数据分发 - 映射规则 - 显示新建字段弹窗
    showAddFieldModel = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/changeFieldModalVisibleAction',
            modalVisible: true,
        });
    };

    //数据接入/数据分发 - key值相等
    getRowByKey(key, newData) {
        const {dataLeft} = this.state;
        return (newData || dataLeft).filter(item => item.key === key)[0];
    }

    //数据接入/数据分发 - 映射规则 - 新增加一条记录
    addRow = (values) => {
        const {dispatch} = this.props;
        const {dataLeft, keyIndex} = this.state;
        dataLeft.push({
            key: keyIndex + 1,
            fieldName: values.fieldName,
            newFieldName: '',
            fieldType: '',
            newFieldType: '',
            length: '',
            isNotnull: '',
            defaultValue: values.defaultValue,
            fetchColumn: 'true',
            isNewRecord: 1

        });
        this.setState({
            dataLeft,
            keyIndex: keyIndex + 1
        });
        dispatch({
            type: 'dataSyncNewMission/changeFieldModalVisibleAction',
            modalVisible: false,
        });
    };


    render() {
        const {getRuleStatus, dataSyncNewMission} = this.props;
        const {getNewTaskData} = dataSyncNewMission;
        const {modalType, dataLeft, dataRight, routerTableList} = this.state;
        //数据接入表格
        const columnsLeft = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: '10%',
                render: text => <a>{text}</a>,
            },
            {
                title: '字段名称',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: '15%',
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                width: '10%',
                render: text => <span title={text}>{text}</span>
            },
            {
                title: '采集字段名',
                dataIndex: 'newFieldName',
                key: 'newFieldName',
                width: '10%',
                render: (text, record) => {
                    if(!record.isNewRecord){
                        return (
                            <Input
                                value={text}
                                autoFocus
                                // disabled={record.isNewRecord ? true:false}
                                //isNewRecord
                                // defaultValue = {record.fieldName}
                                // onChange={e => this.handleFieldChange(e, 'newFieldName', record.key)}
                                onChange={e => this.handleMapChange(e, 'newFieldName', record.key, 'input')}
                                placeholder="请输入采集字段名"
                            />
                        );
                    }else{
                        return (
                            <span title={text}>{text}</span>
                        );
                    }
                },
            },
            {
                title: '字段类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
                width: '15%',
            },
            {
                title: '采集字段类型',
                dataIndex: 'newFieldType',
                key: 'newFieldType',
                width: '10%',
                render: (text, record) => {
                    if(!record.isNewRecord){
                        return (
                            <Input
                                value={text}
                                autoFocus
                                // disabled={record.isNewRecord ? true:false}
                                // defaultValue = {record.fieldType}
                                // onChange={e => this.handleFieldChange(e, 'newFieldType', record.key)}
                                onChange={e => this.handleMapChange(e, 'newFieldType', record.key, 'input')}
                                placeholder="请输入采集字段类型"
                            />
                        );
                    }else{
                        return (
                            <span title={text}>{text}</span>
                        );
                    }

                },
            },
            {
                title: '长度',
                dataIndex: 'length',
                key: 'length',
            },
            {
                title: '是否为空',
                dataIndex: 'isNotnull',
                key: 'isNotnull',
                width: '10%',
            },
            {
                title: '默认值',
                dataIndex: 'defaultValue',
                key: 'defaultValue',
                width: '10%',
            },
            {
                title: '是否采集',
                dataIndex: 'fetchColumn',
                key: 'fetchColumn',
                render: (text, record) => {
                    // console.log('text',text)
                    return (
                        <Switch checkedChildren="是"
                                unCheckedChildren="否"
                                // defaultChecked
                                checked = {text ==='false'? false : true}
                            // onChange={e => this.handleFieldChange(e, 'fetchColumn', record.key)}/>
                                onChange={e => this.handleMapChange(e, 'fetchColumn', record.key, 'switch')}/>
                    );

                },
            },
            {
                title: '操作',
                key: 'action',
                width: '15%',
                render: (text, record) => {
                    if(record.isNewRecord){
                        return (
                            <span>
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeField(record)}>
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                        );
                    }else{
                        return (
                            <span></span>
                        );
                    }
                },
            },
        ];
        //数据分发左侧表格
        const columnsDataDestination = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                // width: '10%',
                render: text => <a>{text}</a>,
            },
            {
                title: '字段名称',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: '15%',
                render: text => <span title={text}>{text}</span>
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                width: '15%',
                render: text => <span title={text}>{text}</span>
            },
            {
                title: '分发到目标表的字段名称',
                dataIndex: 'newFieldName',
                key: 'newFieldName',
                width: '10%',
                render: (text, record) => {
                    if(!record.isNewRecord){
                        return (
                            <Select defaultValue={text} style={{width: 120}}
                                // onChange={e => this.handleSelectChange(e, 'newFieldName', record.key)}>
                                    onChange={e => this.handleMapChange(e, 'newFieldName', record.key, 'select')}>
                                {dataRight.map(item => (
                                    <Option key={item.fieldName} value={item.fieldName}
                                            title={item.fieldName}>{item.fieldName}</Option>))}
                            </Select>
                        );
                    }else{
                        return (
                            <span title={text}>{text}</span>
                        );
                    }

                },
            },
            {
                title: '字段类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
                width: '15%',
            },
            {
                title: '目标表字段类型',
                dataIndex: 'newFieldType',
                key: 'newFieldType',
                width: '10%',
                render: (text, record) => {
                    if(!record.isNewRecord){
                        return (
                            <Select defaultValue={text} style={{width: 120}}
                                // onChange={e => this.handleSelectChange(e, 'newFieldType', record.key)}>
                                    onChange={e => this.handleMapChange(e, 'newFieldType', record.key, 'select')}>
                                {T.lodash.uniqBy(dataRight, 'fieldType').map(item => (
                                    <Option key={item.fieldType} value={item.fieldType}>{item.fieldType}</Option>))}
                            </Select>
                        );
                    }else{
                        return (
                            <span title={text}>{text}</span>
                        );
                    }

                },
            },
            {
                title: '长度',
                dataIndex: 'length',
                key: 'length',
            },
            {
                title: '是否为空',
                dataIndex: 'isNotnull',
                key: 'isNotnull',
                // width: '10%',
            },
            {
                title: '默认值',
                dataIndex: 'defaultValue',
                key: 'defaultValue',
                // width: '10%',
            },
            {
                title: '是否采集',
                dataIndex: 'fetchColumn',
                key: 'fetchColumn',
                width: '15%',
                render: (text, record) => {
                    return (
                        <Switch checkedChildren="是"
                                unCheckedChildren="否"
                                // defaultChecked
                                checked = {text ==='false'? false : true}
                            // onChange={e => this.handleSelectChange(e, 'fetchColumn', record.key)}/>
                                onChange={e => this.handleMapChange(e, 'fetchColumn', record.key, 'switch')}/>
                    );

                },
            },
            {
                title: '操作',
                key: 'action',
                width: '15%',
                render: (text, record) => {
                    if(record.isNewRecord){
                        return (
                            <span>
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeField(record)}>
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                        );
                    }else{
                        return (
                            <span></span>
                        );
                    }
                },
            },
        ];
        //数据分发右侧表格
        const columnsRight = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                render: text => <a>{text}</a>,
            },
            {
                title: '字段名称',
                dataIndex: 'fieldName',
                key: 'fieldName',
            },
            {
                title: '字段类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
            },
            {
                title: '长度',
                dataIndex: 'length',
                key: 'length',
                width: '10%',
            },
            {
                title: '是否为空',
                dataIndex: 'isNotnull',
                key: 'isNotnull',
                width: '10%',
            },
            {
                title: '默认值',
                dataIndex: 'defaultValue',
                key: 'defaultValue',
                width: '10%',
            },
        ];
        //数据分发路由规则
        const columnsRouterRule = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                render: text => <a>{text}</a>,
            },
            {
                title: '字段名称',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: '10%',
                render: (text, record) => {
                    return (
                        <Select style={{width: 180}}
                                onChange={e => this.handleRouterChange(e, 'fieldName', record, 'select')}
                                placeholder="请选择字段名称"
                        >
                            {dataRight.map(item => (
                                <Option key={item.fieldName} value={item.fieldName}
                                        title={item.fieldName}>{item.fieldName}</Option>))}
                        </Select>
                    );
                },
            },
            {
                title: '字段类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
                render: text => <span>{text}</span>
            },
            {
                title: '过滤条件',
                dataIndex: 'condition',
                key: 'condition',
                render: (text, record) => {
                    return (
                        <Select defaultValue='0' style={{width: 120}}
                                onChange={e => this.handleRouterChange(e, 'condition', record, 'select')}>
                            <Option value="0" key="0">
                                <FormattedMessage
                                    id="form.sourceStep3.databaseName.option.fuzzy.label"/>
                            </Option>
                            <Option value="1" key="1">
                                <FormattedMessage
                                    id="form.sourceStep3.databaseName.option.accurate.label"/>
                            </Option>
                        </Select>
                    );
                },
            },
            {
                title: '过滤值',
                dataIndex: 'value',
                key: 'value',
                // width:'10%',
                render: (text, record) => {
                    return (
                        <Input
                            value={text}
                            autoFocus
                            // style={{width: 200}}
                            // defaultValue = {record.fieldName}
                            onChange={e => this.handleRouterChange(e, 'value', record, 'input')}
                            placeholder="请输入过滤值"
                        />
                    );
                },
            },
            {
                title: '默认值',
                dataIndex: 'defaultValue',
                key: 'defaultValue',
            },
            {
                title: '操作',
                key: 'action',
                width: '15%',
                render: (text, record) => {
                    return (
                        <span>
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(true, record.key)}>
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                    );
                },
            },
        ];
        return (
            <Fragment>
                {
                    getRuleStatus ?
                        <Spin size='large' className={styles.missionStep}/> :
                        <div className={styles.ruleStep}>
                            {modalType === 'dataOrigin' ?
                                <div>
                                    <Row gutter={24}>
                                        <Col xl={24} lg={24} md={24} sm={24} xs={24} style={{textAlign: 'center'}}>
                                            <Table columns={columnsLeft} dataSource={dataLeft} pagination={false}/>
                                        </Col>
                                    </Row>
                                    <Row
                                        gutter={24}
                                        style={{marginTop: 32}}
                                    >
                                        <Col xl={24} lg={24} md={8} sm={24} xs={24} style={{textAlign: 'center'}}>
                                            <Button onClick={this.onPrev}>
                                                上一步
                                            </Button>
                                            <Button onClick={this.showAddFieldModel} type="primary"
                                                    style={{marginLeft: 20}}>
                                                新增
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
                                                onClick={this.onFinish}
                                            >
                                                下一步
                                            </Button>
                                        </Col>
                                    </Row>
                                    <SyncAddFieldModal
                                        addRow={this.addRow}
                                    />
                                </div>
                                : <div>
                                    <div className={styles.tableTitle}>
                                        映射规则
                                    </div>
                                    <Card bordered={false}>
                                        <Row gutter={24}>
                                            <Col xl={14} lg={14} md={14} sm={14} xs={14} style={{textAlign: 'center'}}>
                                                <Table columns={columnsDataDestination} dataSource={dataLeft}
                                                       pagination={false}
                                                />
                                                <Button
                                                    style={{width: '100%', marginTop: 16, marginBottom: 8}}
                                                    type="dashed"
                                                    onClick={this.showAddFieldModel}
                                                    icon="plus"
                                                >
                                                    新增
                                                </Button>
                                            </Col>
                                            <Col xl={2} lg={2} md={2} sm={2} xs={2} style={{textAlign: 'center'}}>
                                            </Col>
                                            <Col xl={8} lg={8} md={8} sm={8} xs={8} style={{textAlign: 'center'}}>
                                                <Table columns={columnsRight} dataSource={dataLeft} pagination={false}/>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <div className={styles.tableTitle}>路由规则</div>
                                    <Card bordered={false}>
                                        <Row gutter={24}>
                                            <Col xl={24} lg={24} md={24} sm={24} xs={24} style={{textAlign: 'center'}}>
                                                <Table columns={columnsRouterRule} dataSource={routerTableList}
                                                       pagination={false}
                                                />
                                                <Button
                                                    style={{width: '100%', marginTop: 16, marginBottom: 8}}
                                                    type="dashed"
                                                    onClick={this.newMember}
                                                    icon="plus"
                                                >
                                                    新增
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Row
                                        gutter={24}
                                        style={{marginTop: 32}}
                                    >
                                        <Col xl={24} lg={24} md={8} sm={24} xs={24} style={{textAlign: 'center'}}>
                                            <Button onClick={this.onPrev}>
                                                上一步
                                            </Button>
                                            {/*<Button onClick={this.showAddFieldModel} type="primary"
                                                    style={{marginLeft: 20}}>
                                                新增
                                            </Button>*/}
                                            <Button
                                                onClick={this.saveConfig}
                                                style={{marginLeft: 20}}
                                            >
                                                保存配置
                                            </Button>
                                            <Button
                                                style={{marginLeft: 20}}
                                                type="primary"
                                                onClick={this.onFinish}
                                            >
                                                下一步
                                            </Button>
                                        </Col>
                                    </Row>
                                    <SyncAddFieldModal
                                        addRow={this.addRow}
                                    />
                                </div>
                            }


                        </div>

                }
            </Fragment>
        );
    }
}

export default SourceStep3;
