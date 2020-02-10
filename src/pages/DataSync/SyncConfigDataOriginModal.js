import React, {PureComponent, Fragment} from 'react';
import styles from './SyncConfigDataOriginModal.less';
import {connect} from 'dva';
import Link from 'umi/link';
import {Modal, Button, Form, Input, Select, Radio, Tooltip, Icon} from 'antd';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import {
    EnumModalFormContent,
    EnumCreateProcessorSpecialParam,
} from './../../constants/dataSync/EnumSyncConfigModal';
import T from './../../utils/T';
import router from 'umi/router';

const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;

//新建数据源或者目的地模态框
/* eslint react/no-multi-comp:0 */
@connect(({dataSyncNewMission, dataDistribution, loading}) => ({
    dataSyncNewMission,
    dataDistribution,
    createStatus: loading.effects['dataSyncNewMission/createProcessorsAction'],
    metadataManageUrlListStatus: loading.effects['dataSyncNewMission/getMetadataManageTreeAction'],
    metadataManageTableListStatus: loading.effects['dataSyncNewMission/getTableOrViewByIdAction'],
    fieldByTableIdListStatus: loading.effects['dataSyncNewMission/getTableInfosByIdAction'],
}))
@Form.create()
class SyncConfigDataOriginModal extends PureComponent {
    state = {
        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 15},
                md: {span: 15},
            },
        },
        submitFormLayout: {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 4, offset: 10},
            },
        },
        modeNameLabel: 'form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.label',
        modeNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.placeholder',
        modeName: 'incrementing',
        modeNameState: true,
        tableNameLabel: 'form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.label',
        tableNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.tableList.option.blacklist.placeholder',
        tableNameValue: 'whitelist',
        pkModeState: true,
        pkModeLabel: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.record_value.label',
        pkModePlaceholder: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.record_value.placeholder',
        pkModeValue: 'fields',
        // tableNameValue:true,
    };


    componentWillReceiveProps(nextProps) {
        const {isEdit} = nextProps.dataSyncNewMission;
        //如果是可编辑状态的，那么需要更新表单值
        if (isEdit !== this.props.dataSyncNewMission.isEdit && isEdit) {
            this.setDefaultFormValue(nextProps.dataSyncNewMission);
        }
    }

    componentWillUnmount() {
        //销毁异步请求
        this.setState = (state, callback) => {
            return;
        };
    }

    //连接功能
    handleSubmit = e => {
        let self = this;
        const {dispatch, form, dataSyncNewMission, dataDistribution} = this.props;
        const {
            modalType,
            getNewTaskData,
            currentDataInfo,
            isEdit,
            detailModalData,
            configDataModalVisible,
            detailDataModalVisible,
            htmlType,
            metadataManageUrlList,
        } = dataSyncNewMission;
        const {sourceInfo} = dataDistribution;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);
                let valueArr = T.lodash.keys(values);
                let params = {};
                //不同的数据源和目的地类型后台可能需要加上（减去）不同的默认参数（未在前端页面展现的）
                switch (currentDataInfo.className) {
                    //rabbitmq输入
                    case 'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSourceConnector':
                        params = {
                            'tasks.max': '1',
                        };
                        break;
                    //rabbitmq 输出
                    case 'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSinkConnector':
                        params = {
                            'key.converter': 'org.apache.kafka.connect.converters.ByteArrayConverter',
                            'value.converter': 'org.apache.kafka.connect.converters.ByteArrayConverter',
                            'key.converter.schemas.enable': 'true',
                            'value.converter.schemas.enable': 'true',
                        };
                        break;
                    //jdbc 输入
                    case 'io.confluent.connect.jdbc.JdbcSourceConnector':
                        params = {
                            'tasks.max': '1',
                            'key.converter.schemas.enable': 'true',
                            'value.converter.schemas.enable': 'true',
                            'value.converter': 'org.apache.kafka.connect.json.JsonConverter',
                            'key.converter': 'org.apache.kafka.connect.json.JsonConverter',
                            'topic.prefix': '',
                            'table.tablelist': 'whitelist',//后端未删掉的参数（表的黑白名单）
                        };
                        break;
                    //jdbc 输出
                    case 'io.confluent.connect.jdbc.JdbcSinkConnector':
                        params = {
                            'tasks.max': '1',
                            'key.converter.schemas.enable': 'true',
                            'value.converter.schemas.enable': 'true',
                            'value.converter': 'org.apache.kafka.connect.json.JsonConverter',
                            'key.converter': 'org.apache.kafka.connect.json.JsonConverter',
                        };
                        break;
                    //debezium-mysql 输入
                    case 'io.debezium.connector.mysql.MySqlConnector':
                        params = {
                            'tasks.max': '1',
                            'database.history.kafka.bootstrap.servers':
                                '192.168.10.122:9092,192.168.10.123:9092,192.168.10.124:9092',
                        };
                        break;
                    //kafka输入
                    case 'cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector':
                        params = {
                            'key.converter.schemas.enable': 'true',
                            'value.converter': 'io.confluent.connect.replicator.util.ByteArrayConverter',
                            'header.converter': 'io.confluent.connect.replicator.util.ByteArrayConverter',
                            'key.converter': 'io.confluent.connect.replicator.util.ByteArrayConverter',
                            'tasks.max': '1',
                            'value.converter.schemas.enable': 'true',
                        };
                        break;
                    //kafka输入-可能会过期
                    case 'io.confluent.connect.replicator.ReplicatorSourceConnector':
                        params = {
                            'key.converter.schemas.enable': 'true',
                            'tasks.max': '1',
                            'value.converter.schemas.enable': 'true',
                            'value.converter': 'io.confluent.connect.replicator.util.ByteArrayConverter',
                            'header.converter': 'io.confluent.connect.replicator.util.ByteArrayConverter',
                            'key.converter': 'io.confluent.connect.replicator.util.ByteArrayConverter',
                        };
                        break;
                    //ftp-xml输入
                    case 'cn.gov.ytga.kafka.connect.xmlmanager.XmlSourceConnector':
                        params = {
                            'tasks.max': '1',
                            "ftp.filename.regex": "*.xml",
                        };
                        break;
                }
                valueArr.map(val => {
                    if (val !== 'dataSourceName') {
                        params[EnumModalFormContent[modalType][currentDataInfo.className][val]['mapTo']] = values[val];
                        /*//jdbc的黑白名单不同传给后端，去除，也可以不去除
                        if (currentDataInfo.className === 'io.confluent.connect.jdbc.JdbcSourceConnector') {
                            switch (val) {
                                case 'table':
                                    break;
                                default:
                                    params[EnumModalFormContent[modalType][currentDataInfo.className][val]['mapTo']] =
                                        values[val];
                            }
                        } else {
                            params[EnumModalFormContent[modalType][currentDataInfo.className][val]['mapTo']] =
                                values[val];
                        }*/
                    }
                });

                params['connector.class'] = currentDataInfo.className;
                //后台发送的参数
                let sendParams;
                //编辑功能还是新建功能
                if (isEdit) {
                    sendParams = {
                        config: {
                            ...params,
                            name: detailModalData.hasOwnProperty('uuid') ? detailModalData.uuid : '',
                            // topic: detailModalData.hasOwnProperty("config") ? detailModalData["config"]["config"]["topic"] : ""
                        },
                        uuid: detailModalData.hasOwnProperty('uuid') ? detailModalData.uuid : '', //编辑和新建的区别，新建为null，编辑需要加上
                    };
                    // let topic = detailModalData.hasOwnProperty("config") ? detailModalData["config"]["config"]["kafka.topic"]||detailModalData["config"]["config"]["topic"]||detailModalData["config"]["config"]["topics"] : "";
                    let topic = detailModalData.hasOwnProperty('config')
                        ? detailModalData['config'][EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]['key']]
                        : '';
                    //有些topic必须写死，比如kafka输入和kafka输出的
                    switch (currentDataInfo.className) {
                        //TODO 暂时去掉这个，需要跟后端确认
                        //kafka输入或者输出
                        // case "cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector" || "cn.gov.ytga.kafka.connect.replicate.KafkaSinkConnector":
                        //     sendParams["config"][EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]["key"]] = "${kafka.topic}-copy";
                        //     break;
                        default:
                            sendParams['config'][EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]['key']] = topic;
                    }

                    //jdbc输入topic字符串拼接，url拼接
                    if (sendParams['config']['connector.class'] === 'io.confluent.connect.jdbc.JdbcSourceConnector') {
                        sendParams['config']['topic.prefix'] = sendParams['config']['topic'].slice(0, 32);
                        metadataManageUrlList.map((item, index) => {
                            if (item.databaseName === sendParams['config']['connection.url']) {
                                sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                            }
                        });
                    }
                    //jdbc输入topic字符串拼接，url拼接
                    switch (sendParams['config']['connector.class']) {
                        //rabbitmq输入
                        case 'io.confluent.connect.jdbc.JdbcSourceConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.databaseName === sendParams['config']['connection.url']) {
                                    sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                                }
                            });
                            break;
                        case 'io.confluent.connect.jdbc.JdbcSinkConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.databaseName === sendParams['config']['connection.url']) {
                                    sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                                }
                            });
                            break;
                    }
                    //如果是从数据分发页面点击编辑的接口，需要另一套规范
                    if (htmlType === 'dataDistribution') {
                        new Promise((resolve, reject) => {
                            dispatch({
                                type: 'dataDistribution/updateDestinationAction',
                                params: {
                                    config: sendParams.config,
                                    name: sendParams.name,
                                    plugin: sendParams.pluginId,
                                    source: sourceInfo.uuid,
                                },
                                resolve,
                                reject,
                            });
                        }).then(response => {
                            if (response.result === 'true') {
                                T.prompt.success(response.message);
                                //隐藏新建窗口
                                dispatch({
                                    type: 'dataSyncNewMission/changeConfigDataModalAction',
                                    configDataModalVisible: !configDataModalVisible,
                                });
                                //重置表单
                                self.resetForm();
                                //变为不可编辑
                                dispatch({
                                    type: 'dataSyncNewMission/changeConfigModalEditAction',
                                    isEdit: false,
                                });
                                //重新获取列表
                                dispatch({
                                    type: 'dataDistribution/getInfoFormSourceAction',
                                    uuid: sourceInfo["uuid"],
                                });
                            } else {
                                T.prompt.error(response.message);
                            }
                        });
                    }else {
                        new Promise((resolve, reject) => {
                            dispatch({
                                type: 'dataSyncNewMission/updateProcessorsAction',
                                params: sendParams,
                                resolve,
                                reject,
                            });
                        }).then(response => {
                            if (response.result === 'true') {
                                //模态框内容
                                let endParams = {
                                    ...detailModalData,
                                    ...sendParams,
                                    config: {
                                        ...sendParams.config,
                                    },
                                };
                                //隐藏新建窗口
                                dispatch({
                                    type: 'dataSyncNewMission/changeConfigDataModalAction',
                                    configDataModalVisible: !configDataModalVisible,
                                });
                                //重置表单
                                self.resetForm();
                                //打开详情窗口
                                dispatch({
                                    type: 'dataSyncNewMission/changeDetailDataModalAction',
                                    detailDataModalVisible: !detailDataModalVisible,
                                });
                                //变为不可编辑
                                dispatch({
                                    type: 'dataSyncNewMission/changeConfigModalEditAction',
                                    isEdit: false,
                                });
                                //设置模态框内容
                                dispatch({
                                    type: 'dataSyncNewMission/setDetailModalDataAction',
                                    detailModalData: endParams,
                                });
                                //获取任务列表
                                dispatch({
                                    type: 'dataSyncNewMission/getAllProcessorListActive',
                                });
                            } else {
                                T.prompt.error(response.message);
                            }
                        });
                    }

                } else {
                    //新建功能（新建数据源的时候需要给后端传topic管道，但是新建目的地的时候，传不传无所谓，但是为了方便，就传过去了，后端不会用到这个参数）
                    let newUuid = T.helper.createUuid(32, 16);
                    sendParams = {
                        config: {
                            ...params,
                        },
                        connectorPlugin: currentDataInfo,
                        taskPipe: {
                            createBy: T.auth.getLoginInfo().user.loginCode,
                            createDate: '',
                            des: '',
                            destination: '',
                            name: '',
                            source: '',
                            status: '',
                            taskId: T.storage.getStorage('taskId'),
                            topic: newUuid,
                            updateBy: '',
                            updateDate: '',
                            uuid: '',
                        },
                        datasourceId:'',
                        createBy: T.auth.getLoginInfo().user.loginCode,
                        createDate: '',
                        des: '',
                        icon: '',
                        name: values['dataSourceName'], //数据源名称
                        pluginId: currentDataInfo.id, //id
                        status: '',
                        taskId: T.storage.getStorage('taskId'), //任务taskid
                        type: '',
                        updateBy: '',
                        updateDate: '',
                        uuid: '', //编辑和新建的区别，新建为null，编辑需要加上
                    };

                    //不同的数据源和数据目的地的topic的字段可能不一样，例如：有的可能叫topics
                    sendParams.config[
                        EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]['key']
                        ] = newUuid;
                    //有些topic必须写死，比如kafka输入和kafka输出的

                    switch (currentDataInfo.className) {
                        //TODO 暂时去掉这个，需要跟后端确认
                        //kafka输入或者输出
                        // case "cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector" || "cn.gov.ytga.kafka.connect.replicate.KafkaSinkConnector":
                        //     sendParams.config[EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]["key"]] = "${kafka.topic}-copy";
                        //     break;
                        default:
                            sendParams.config[
                                EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]['key']
                                ] = newUuid;
                    }
                    //jdbc输入topic字符串拼接，url拼接
                    switch (sendParams['config']['connector.class']) {
                        case "io.confluent.connect.jdbc.JdbcSourceConnector":
                            sendParams['config']['topic.prefix'] = newUuid;
                            sendParams['config']['topic'] = sendParams['config']['topic'] + params['table.whitelist'];
                            sendParams['taskPipe']['topic'] = sendParams['taskPipe']['topic'] + params['table.whitelist'];
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    sendParams['datasourceId'] = item.id;
                                    sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                                }
                            });
                            break;
                        //jdbc输出url拼接
                        case "io.confluent.connect.jdbc.JdbcSinkConnector":
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['connection.url']) {
                                    sendParams['datasourceId'] = item.id;
                                    sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                                }
                            });
                            break;
                            //kafka数据源
                        case "cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector":
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    sendParams['datasourceId'] = item.id;
                                    let databaseInfo = JSON.parse(item.config);//存储队列数据源注册时填写的信息
                                    let sendConfig = sendParams['config'];
                                    sendParams['config'] = {
                                        ...sendConfig,
                                        ...databaseInfo,
                                    };
                                }
                            });
                            break;
                    }
                    /* if(sendParams['config']['connector.class'] === 'io.confluent.connect.jdbc.JdbcSourceConnector'){
                         sendParams['config']['topic.prefix'] = newUuid;
                         sendParams['config']['topic']= sendParams['config']['topic'] + params['table.whitelist'];
                         sendParams['taskPipe']['topic']=sendParams['taskPipe']['topic'] + params['table.whitelist'];
                         metadataManageUrlList.map((item,index) =>{
                             if(item.id === sendParams['config']['connection.url']){
                                 sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                             }
                         });

                     }*/
                    //如果是从数据分发页面点击新建的接口，需要另一套规范
                    if (htmlType === 'dataDistribution') {
                        new Promise((resolve, reject) => {
                            dispatch({
                                type: 'dataDistribution/addDestinationAction',
                                params: {
                                    config: sendParams.config,
                                    name: sendParams.name,
                                    plugin: sendParams.pluginId,
                                    source: sourceInfo.uuid,
                                },
                                resolve,
                                reject,
                            });
                        }).then(response => {
                            if (response.result === 'true') {
                                T.prompt.success(response.message);
                                //隐藏新建窗口
                                dispatch({
                                    type: 'dataSyncNewMission/changeConfigDataModalAction',
                                    configDataModalVisible: !configDataModalVisible,
                                });
                                //重置表单
                                self.resetForm();
                                //变为不可编辑
                                dispatch({
                                    type: 'dataSyncNewMission/changeConfigModalEditAction',
                                    isEdit: false,
                                });
                                //重新获取列表
                                dispatch({
                                    type: 'dataDistribution/getInfoFormSourceAction',
                                    uuid: sourceInfo["uuid"],
                                });
                            } else {
                                T.prompt.error(response.message);
                            }
                        });
                    } else {
                        console.log('sendParams',sendParams);
                        new Promise((resolve, reject) => {
                            dispatch({
                                type: 'dataSyncNewMission/createProcessorsAction',
                                params: sendParams,
                                resolve,
                                reject,
                            });
                        }).then(response => {
                            if (response.result === 'true') {
                                //模态框内容
                                let endParams = {
                                    ...sendParams,
                                    uuid: response.data.uuid,
                                    createDate: response.data.createDate,
                                    createBy: response.data.createBy,
                                    config: {
                                        ...sendParams.config,
                                    },
                                };
                                //隐藏新建窗口
                                dispatch({
                                    type: 'dataSyncNewMission/changeConfigDataModalAction',
                                    configDataModalVisible: !configDataModalVisible,
                                });
                                //重置表单
                                self.resetForm();
                                //打开详情窗口
                                dispatch({
                                    type: 'dataSyncNewMission/changeDetailDataModalAction',
                                    detailDataModalVisible: !detailDataModalVisible,
                                });
                                //变为不可编辑
                                dispatch({
                                    type: 'dataSyncNewMission/changeConfigModalEditAction',
                                    isEdit: false,
                                });
                                //设置模态框内容
                                dispatch({
                                    type: 'dataSyncNewMission/setDetailModalDataAction',
                                    detailModalData: endParams,
                                });
                                //获取任务列表
                                dispatch({
                                    type: 'dataSyncNewMission/getAllProcessorListActive',
                                });
                                //获取任务详情
                                dispatch({
                                    type: 'dataSyncNewMission/getTaskDetailByIdAction',
                                    params: {
                                        taskId: T.storage.getStorage('taskId'),
                                    },
                                });
                            } else {
                                T.prompt.error(response.message);
                            }
                        });

                    }

                }
            }
        });
    };

    //关闭模态框
    closeModal = () => {
        const {dataSyncNewMission, dispatch} = this.props;
        const {configDataModalVisible, isEdit} = dataSyncNewMission;
        //关闭当前模态框
        dispatch({
            type: 'dataSyncNewMission/changeConfigDataModalAction',
            configDataModalVisible: !configDataModalVisible,
        });
        //不可编辑状态
        dispatch({
            type: 'dataSyncNewMission/changeConfigModalEditAction',
            isEdit: false,
        });
        //将模态框数据清空
        dispatch({
            type: 'dataSyncNewMission/setDetailModalDataAction',
            detailModalData: {},
        });
        //重置表单
        this.resetForm();
    };

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };

    //填充默认数据
    setDefaultFormValue = dataSyncNewMission => {
        const {isEdit, detailModalData, modalType, metadataManageUrlList} = dataSyncNewMission;
        //form表单需要的数据
        let formValue = {};
        //数据遍历成对应的数据
        let enumKeys = T.lodash.keys(EnumModalFormContent[modalType][detailModalData['config']['connector.class']]);
        let keysArr = detailModalData.hasOwnProperty('config') ? T.lodash.keys(detailModalData['config']) : [];
        //后台返回的config里,会有connector.class和name还有topic，都要从表单数据里去掉
        keysArr.map((item, idx) => {
            if (item !== 'connector.class') {
                enumKeys.map(val => {
                    if (EnumModalFormContent[modalType][detailModalData['config']['connector.class']][val]['mapTo'] === item) {
                        formValue[EnumModalFormContent[modalType][detailModalData['config']['connector.class']][val]['value']] = detailModalData['config'][item];
                    }
                });
            }
        });
        formValue['dataSourceName'] = detailModalData['name'];
        let self = this;
        //根据connector.class，设置表单中数据的显示（请求返回的数据没有，而表单需要显示）
        switch (detailModalData['config']['connector.class']) {
            //去掉了黑白名单选择
            case 'io.confluent.connect.jdbc.JdbcSourceConnector':
                this.setState({
                        // tableNameValue: detailModalData['config'].hasOwnProperty('table.whitelist') ? 'whitelist' : 'blacklist',
                        modeNameLabel: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + detailModalData['config']['mode'] + '.label',
                        modeNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + detailModalData['config']['mode'] + '.placeholder',
                        modeName: detailModalData['config']['mode'],
                        modeNameState: detailModalData['config']['mode'] === 'bulk' ? false : true,
                    },
                    () => {
                        //详情页跳编辑页，数据源显示的是url地址，不是数据源的名称
                        metadataManageUrlList.map((item, index) => {
                            if (T.lodash.startsWith(detailModalData['config']['connection.url'], item.url)) {
                                formValue['connectionUrl'] = item.databaseName;
                            }
                        });
                        self.props.form.setFieldsValue(formValue);
                    }
                );

                break;
            case 'io.confluent.connect.jdbc.JdbcSinkConnector':
                this.setState(
                    {
                        pkModeState: detailModalData['config']['pk.mode'] === 'none' ? false : true,
                        pkModeLabel:
                        'form.syncConfigDataOriginModal.jdbc.pkMode.fields.' +
                        detailModalData['config']['pk.mode'] +
                        '.label',
                        pkModePlaceholder:
                        'form.syncConfigDataOriginModal.jdbc.pkMode.fields.' +
                        detailModalData['config']['pk.mode'] +
                        '.placeholder',
                        pkModeValue:
                            detailModalData['config']['pk.mode'] === 'none' ? 'noneFields' : 'fields',
                    },
                    () => {
                        self.props.form.setFieldsValue(formValue);
                    }
                );
                break;
        }
        this.props.form.setFieldsValue(formValue);
    };

    //通过单选按钮输入框显示不同的内容（jdbc输入的轮询模式）
    onChangeMode = e => {
        this.setState({
            modeNameLabel: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + e.target.value + '.label',
            modeNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + e.target.value + '.placeholder',
            modeName: e.target.value,
            modeNameState: e.target.value === 'bulk' ? false : true,
        });
    };

    //通过单选按钮输入框显示不同的内容（jdbc输入黑白名单）
    onChangeTable = e => {
        this.setState({
            tableNameLabel: 'form.syncConfigDataOriginModal.jdbc.tableList.option.' + e.target.value + '.label',
            tableNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.tableList.option.' + e.target.value + '.placeholder',
            tableNameValue: e.target.value,
        });
    };

    //通过单选按钮输入框显示不同的内容（jdbc输出的主键模式）
    onChangePkMode = e => {
        this.setState({
            pkModeState: e.target.value === 'none' ? false : true,
            pkModeLabel: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.' + e.target.value + '.label',
            pkModePlaceholder:
            'form.syncConfigDataOriginModal.jdbc.pkMode.fields.' + e.target.value + '.placeholder',
            pkModeValue: e.target.value === 'none' ? 'noneFields' : 'fields',
        });
    };

    //获取（元数据管理）数据源
    getDataManageUrl = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/getMetadataManageTreeAction',
        });
    };

    //JDBC url/表 下拉选项
    renderSelectOption(metadataManageUrlList) {
        return (
            metadataManageUrlList.map(item => {
                return (
                    <Option key={item.id || item.tableName} value={item.tableName || item.id}
                            title={item.databaseName || item.tableName}>
                        {item.databaseName || item.tableName}
                    </Option>
                )
            })
        )
    };

    //字段 下拉选项
    renderSelectFieldOption(fieldByTableIdList) {
        return (
            fieldByTableIdList.map(item => {
                return (
                    <Option value={item.columnName} title={item.columnName} key={item.columnName}>
                        {item.columnName}
                    </Option>
                )
            })
        )
    };

    //根据url 的地址获取表格列表
    getDataManageTableByUrl = (key, item) => {
        if (item.key !== "create") {
            const {dispatch} = this.props;
            let params = {
                datasourceId: item.key,
                tableType: 'TABLE',
            };
            dispatch({
                type: 'dataSyncNewMission/getTableOrViewByIdAction',
                params,
            });
        } else {
            this.closeModal();
            router.push({
                pathname: '/metadataManage/quickRegister',
            });
        }

    };
    //根据表格id 获取字段名
    getFieldByTableId = (key, item) => {
        const {dispatch} = this.props;
        // console.log(key);
        let params = {
            id: item.key
        };
        dispatch({
            type: 'dataSyncNewMission/getTableInfosByIdAction',
            params,
        });
    };

    //数据源或数据目的地connectionUrl或表名whitelist的选择框发生改变时，清空选择的表名和字段名
    onChangeConnectionUrl = (dataType, type) => {
        const {
            modeName,
            pkModeValue,
        } = this.state;
        const {
            form: {resetFields},
        } = this.props;
        switch (dataType) {
            case 'dataOrigin':
                if (type !== "whitelist") {
                    resetFields("whitelist");
                }
                resetFields(modeName);
                break;
            case 'dataDestination':
                if (type !== "format") {
                    resetFields("format");
                }
                resetFields(pkModeValue);
                break;
        }
    };

    //渲染模态框不同的内容
    renderConfigContent = () => {
        const {
            dataSyncNewMission,
            metadataManageUrlListStatus,
            metadataManageTableListStatus,
            fieldByTableIdListStatus,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {
            modalType,
            dataType,
            configDataModalVisible,
            currentDataInfo,
            isEdit,
            metadataManageUrlList,
            metadataManageTableList,
            fieldByTableIdList,
        } = dataSyncNewMission;
        const name = currentDataInfo.hasOwnProperty('className') ? currentDataInfo.className : 'FTP';
        const {
            formItemLayout,
            submitFormLayout,
            modeNameLabel,
            modeNamePlaceholder,
            modeName,
            tableNameLabel,
            tableNamePlaceholder,
            pkModeLabel,
            pkModePlaceholder,
            pkModeState,
            tableNameValue,
            pkModeValue,
            modeNameState,
        } = this.state;
        //数据源
        if (modalType === 'dataOrigin') {
            switch (name) {
                //mysql输入
                case 'io.debezium.connector.mysql.MySqlConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('server', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}
                            >
                                {getFieldDecorator('port', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.port.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.port.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.username.label"/>}
                            >
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.username.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.username.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.password.label"/>}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.password.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        autoComplete="new-password"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.password.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.mysql.serverId.label"/>
                                }
                            >
                                {getFieldDecorator('serverId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.mysql.serverId.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.mysql.serverId.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.mysql.serverName.label"/>
                                }
                            >
                                {getFieldDecorator('serverName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.mysql.serverName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.mysql.serverName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.mysql.whiteList.label"/>
                                }
                            >
                                {getFieldDecorator('whiteList', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.mysql.whiteList.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.mysql.whiteList.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //FTP输入CSV文件
                case 'cn.gov.ytga.kafka.connect.file.FtpCsvSourceConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.databaseName.label"/>}
                            >
                                {getFieldDecorator('databaseInfoId', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.getDataManageTableByUrl.bind(this)}
                                        // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                            disabled={isEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={metadataManageUrlListStatus}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.databaseName.option.create.label"/>
                                        </Option>
                                        {this.renderSelectOption(metadataManageUrlList)}
                                    </Select>
                                )}
                            </FormItem>

                            {/*<FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}
                            >
                                {getFieldDecorator('port', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.port.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.port.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.username.label"/>}
                            >
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.username.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.username.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.password.label"/>}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.password.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        autoComplete="new-password"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.password.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>*/}
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.catalogue.label"/>}
                            >
                                {getFieldDecorator('catalogue', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.filename.label"/>}
                            >
                                {getFieldDecorator('filename', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.filename.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.filename.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.csv.label"/>}
                            >
                                {getFieldDecorator('csv', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.ftp.csv.option.DEFAULT',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.csv.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select>
                                        <Option value="form.syncConfigDataOriginModal.ftp.csv.option.DEFAULT">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.csv.option.DEFAULT"/>
                                        </Option>
                                        <Option value="form.syncConfigDataOriginModal.ftp.csv.option.EXCEL">
                                            <FormattedMessage id="form.syncConfigDataOriginModal.ftp.csv.option.EXCEL"/>
                                        </Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.filed.label"/>}
                            >
                                {getFieldDecorator('filed', {
                                    initialValue: 'true',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.coding.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Radio.Group>
                                        <Radio value="true">
                                            <FormattedMessage id="form.syncConfigDataOriginModal.ftp.filed.radio.true"/>
                                            <Tooltip title={<FormattedMessage id="form.client.label.tooltip"/>}>
                                                <Icon type="info-circle-o" style={{marginLeft: 4}}/>
                                            </Tooltip>
                                        </Radio>
                                        <Radio value="false">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.filed.radio.false"/>
                                            <Tooltip title={<FormattedMessage id="form.client.label.tooltip"/>}>
                                                <Icon type="info-circle-o" style={{marginLeft: 4}}/>
                                            </Tooltip>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.coding.label"/>}
                            >
                                {getFieldDecorator('coding', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.ftp.coding.option.UTF8',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.coding.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select>
                                        <Option
                                            value={formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.coding.placeholder',
                                            })}
                                        >
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.UTF8"/>
                                        </Option>
                                        <Option
                                            value={formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.coding.placeholder',
                                            })}
                                        >
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.GBK"/>
                                        </Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.header.label"/>}
                            >
                                {getFieldDecorator('header', {
                                    rules: [
                                        {
                                            required: getFieldValue('filed') === 'false' ? true : false,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.header.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <TextArea
                                        style={{minHeight: 32}}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.header.placeholder',
                                        })}
                                        rows={4}
                                    />
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //FTP输入xml文件
                case 'cn.gov.ytga.kafka.connect.xmlmanager.XmlSourceConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}
                            >
                                {getFieldDecorator('port', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.port.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.port.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.username.label"/>}
                            >
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.username.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.username.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.password.label"/>}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.password.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        autoComplete="new-password"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.password.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.catalogue.label"/>}
                            >
                                {getFieldDecorator('catalogue', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.ftp.xml.type.label"/>
                                }
                            >
                                {getFieldDecorator('type', {
                                    initialValue: 'Default',
                                })(
                                    <Radio.Group>
                                        <Radio value="GangKou">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.xml.type.GangKou"/>
                                        </Radio>
                                        <Radio value="NetBar">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.xml.type.NetBar"/>
                                        </Radio>
                                        <Radio value="Default">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.xml.type.Default"/>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.ftp.xml.code.label"/>
                                }
                            >
                                {getFieldDecorator('code', {
                                    initialValue: 'GBK',
                                })(
                                    <Radio.Group>
                                        <Radio value="GBK">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.xml.code.GBK"/>
                                        </Radio>
                                        <Radio value="UTF8">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.xml.code.UTF8"/>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //FTP输入文件
                case 'ftpFileSourceConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}
                            >
                                {getFieldDecorator('port', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.port.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.port.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.username.label"/>}
                            >
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.username.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.username.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.password.label"/>}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.password.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        autoComplete="new-password"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.password.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.catalogue.label"/>}
                            >
                                {getFieldDecorator('catalogue', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.filename.label"/>}
                            >
                                {getFieldDecorator('filename', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.filename.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.filename.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.coding.label"/>}
                            >
                                {getFieldDecorator('coding', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.ftp.coding.option.UTF8',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.coding.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select>
                                        <Option
                                            value={formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.coding.placeholder',
                                            })}
                                        >
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.UTF8"/>
                                        </Option>
                                        <Option
                                            value={formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.coding.placeholder',
                                            })}
                                        >
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.GBK"/>
                                        </Option>
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //kafka输入
                case 'cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.databaseName.label"/>}
                            >
                                {getFieldDecorator('databaseInfoId', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.getDataManageTableByUrl.bind(this)}
                                            // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                            disabled={isEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={metadataManageUrlListStatus}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.databaseName.option.create.label"/>
                                        </Option>
                                        {this.renderSelectOption(metadataManageUrlList)}
                                    </Select>
                                )}
                            </FormItem>
                            {/*<FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.kafka.register.label"/>
                                }
                            >
                                {getFieldDecorator('register', {
                                    rules: [
                                        {
                                            required: getFieldValue('dataFormat') === 'avro' ? true : false,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.kafka.register.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.kafka.register.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>*/}
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.kafka.topic.label"/>}
                            >
                                {getFieldDecorator('topic', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.kafka.topic.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.kafka.topic.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.kafka.dataFormat.label"/>
                                }
                            >
                                {getFieldDecorator('dataFormat', {
                                    initialValue: 'Json',
                                })(
                                    <Radio.Group>
                                        <Radio value="Json">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.kafka.dataFormat.radio.json"/>
                                        </Radio>
                                        <Radio value="Avro">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.kafka.dataFormat.radio.avro"/>
                                        </Radio>
                                        <Radio value="String">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.kafka.dataFormat.radio.string"/>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.kafka.isBeginning.label"/>
                                }
                            >
                                {getFieldDecorator('isBeginning', {
                                    initialValue: 'true',
                                })(
                                    <Radio.Group>
                                        <Radio value="true">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.kafka.isBeginning.radio.true"/>
                                        </Radio>
                                        <Radio value="false">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.kafka.isBeginning.radio.false"/>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //kafka输入-可能会过期
                case 'io.confluent.connect.replicator.ReplicatorSourceConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.kafka.sourceAddress.label"/>
                                }
                            >
                                {getFieldDecorator('sourceAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.kafka.sourceAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.kafka.sourceAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.kafka.sinkAddress.label"/>
                                }
                            >
                                {getFieldDecorator('sinkAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.kafka.sinkAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.kafka.sinkAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.kafka.copyTopic.label"/>
                                }
                            >
                                {getFieldDecorator('copyTopic', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.kafka.copyTopic.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.kafka.copyTopic.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //jdbc输入
                case 'io.confluent.connect.jdbc.JdbcSourceConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.url.label"/>}
                            >
                                {getFieldDecorator('databaseInfoId', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.jdbc.url.placeholder',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.url.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.getDataManageTableByUrl.bind(this)}
                                            onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "databaseInfoId")}
                                            disabled={isEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={metadataManageUrlListStatus}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.create.label"/>
                                        </Option>
                                        {this.renderSelectOption(metadataManageUrlList)}
                                    </Select>
                                )}
                            </FormItem>

                            {/*<FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.jdbc.tableList.label"/>
                                }
                            >
                                {getFieldDecorator('table', {
                                    initialValue: 'whitelist',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.tableList.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Radio.Group onChange={this.onChangeTable.bind(this)}>
                                        <Radio value="whitelist">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 4}}/>
                                            </Tooltip>
                                        </Radio>
                                        <Radio value="blacklist">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.tableList.option.blacklist.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.tableList.option.blacklist.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 4}}/>
                                            </Tooltip>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>*/}
                            <FormItem {...formItemLayout} label={<FormattedMessage
                                id='form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.label'/>}>
                                {getFieldDecorator('whitelist', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.placeholder',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: 'form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.placeholder'}),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.getFieldByTableId.bind(this)}
                                            onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "whitelist")}
                                            disabled={isEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={metadataManageTableListStatus}
                                    >
                                        {this.renderSelectOption(metadataManageTableList)}
                                    </Select>
                                    /*<Input
                                        autoComplete="off"
                                        placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.placeholder'})}
                                    />*/
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.mode.label"/>}
                            >
                                {getFieldDecorator('mode', {
                                    initialValue: 'incrementing',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.mode.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Radio.Group onChange={this.onChangeMode.bind(this)}
                                                 disabled={isEdit ? true : false}>
                                        <Radio value="bulk">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.mode.option.bulk.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.mode.option.bulk.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>
                                        <Radio value="incrementing">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>
                                        <Radio value="timestamp">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.mode.option.timestamp.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.mode.option.timestamp.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>
                                        {/* <Radio value="timestamp+incrementing">
                                            <FormattedMessage id="form.syncConfigDataOriginModal.jdbc.mode.option.timestampIncrementing.label"/>
                                            <Tooltip title={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.mode.option.timestampIncrementing.label"/>}>
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>*/}
                                    </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={<FormattedMessage id={modeNameLabel}/>}>
                                {getFieldDecorator(modeName, {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.placeholder',
                                    }),
                                    rules: [
                                        {
                                            required: modeNameState,
                                            message: formatMessage({id: modeNamePlaceholder}),
                                        },
                                    ],
                                })(
                                    <Select disabled={isEdit ? true : !modeNameState}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={fieldByTableIdListStatus}
                                    >
                                        {this.renderSelectFieldOption(fieldByTableIdList)}
                                    </Select>

                                    // <Input
                                    //     autoComplete="off"
                                    //     disabled={modeNameState ? false : true}
                                    //     placeholder={formatMessage({id: modeNamePlaceholder})}
                                    // />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.types.label"/>}
                            >
                                {getFieldDecorator('types', {
                                    initialValue: 'TABLE',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.types.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Radio.Group disabled={isEdit ? true : false}>
                                        <Radio value="TABLE">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.types.option.TABLE.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.types.option.TABLE.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 4}}/>
                                            </Tooltip>
                                        </Radio>
                                        <Radio value="VIEW">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.types.option.VIEW.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.types.option.VIEW.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 4}}/>
                                            </Tooltip>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>


                            {/* <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.prefix.label"/>}
                            >
                                {getFieldDecorator('topicPrefix', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.prefix.label',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.jdbc.prefix.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>*/}
                            {/*<FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.query.label"/>}
                            >
                                {getFieldDecorator('query', {
                                    rules: [
                                        {
                                            required: false,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.query.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <TextArea
                                        style={{minHeight: 32}}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.jdbc.query.placeholder',
                                        })}
                                        rows={4}
                                    />
                                )}
                            </FormItem>*/}
                        </div>
                    );
                    break;
                //rabbitMQ输入
                case 'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSourceConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}
                            >
                                {getFieldDecorator('port', {
                                    initialValue: '5672',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.port.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.port.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.username.label"/>}
                            >
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.username.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.username.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.password.label"/>}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.password.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        autoComplete="new-password"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.password.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.rabbitmq.queue.label"/>
                                }
                            >
                                {getFieldDecorator('queue', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.rabbitmq.queue.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.rabbitmq.queue.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.rabbitmq.vhost.label"/>
                                }
                            >
                                {getFieldDecorator('vhost', {
                                    initialValue: '/',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.rabbitmq.vhost.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.rabbitmq.vhost.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
            }
        } else {
            //数据目的地
            switch (name) {
                //FTP输出CSV文件
                case 'cn.gov.ytga.kafka.connect.file.FtpCsvSinkConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.dataSinkName.label"/>}
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}
                            >
                                {getFieldDecorator('port', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.port.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.port.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.username.label"/>}
                            >
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.username.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.username.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.password.label"/>}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.password.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        autoComplete="new-password"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.password.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.ftp.output.catalogue.label"/>
                                }
                            >
                                {getFieldDecorator('catalogue', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.coding.label"/>}
                            >
                                {getFieldDecorator('coding', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.ftp.coding.option.UTF8',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.coding.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select>
                                        <Option value="form.syncConfigDataOriginModal.ftp.coding.option.UTF8">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.UTF8"/>
                                        </Option>
                                        <Option value="form.syncConfigDataOriginModal.ftp.coding.option.GBK">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.GBK"/>
                                        </Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.csv.label"/>}
                            >
                                {getFieldDecorator('csv', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.ftp.csv.option.DEFAULT',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.csv.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select>
                                        <Option value="form.syncConfigDataOriginModal.ftp.csv.option.DEFAULT">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.csv.option.DEFAULT"/>
                                        </Option>
                                        <Option value="form.syncConfigDataOriginModal.ftp.csv.option.EXCEL">
                                            <FormattedMessage id="form.syncConfigDataOriginModal.ftp.csv.option.EXCEL"/>
                                        </Option>
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //FTP输出
                case 'ftpFileSinkConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.dataSinkName.label"/>}
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}
                            >
                                {getFieldDecorator('port', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.port.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.port.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.username.label"/>}
                            >
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.username.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.username.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.password.label"/>}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.password.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        autoComplete="new-password"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.password.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.ftp.output.catalogue.label"/>
                                }
                            >
                                {getFieldDecorator('catalogue', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.catalogue.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //kafka输出
                case 'cn.gov.ytga.kafka.connect.replicate.KafkaSinkConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.dataSourceName.label"/>
                                }
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.kafka.topic.label"/>}
                            >
                                {getFieldDecorator('topic', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.kafka.topic.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.kafka.topic.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //rabbitMQ输出
                case 'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSinkConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.dataSinkName.label"/>}
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}
                            >
                                {getFieldDecorator('serverAddress', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.serverAddress.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}
                            >
                                {getFieldDecorator('port', {
                                    initialValue: '5672',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.port.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.port.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.username.label"/>}
                            >
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.username.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.username.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.password.label"/>}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.password.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        autoComplete="new-password"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.password.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.rabbitmq.vhost.label"/>
                                }
                            >
                                {getFieldDecorator('vhost', {
                                    initialValue: '/',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.rabbitmq.vhost.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.rabbitmq.vhost.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.rabbitmq.routing.label"/>
                                }
                            >
                                {getFieldDecorator('routing', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.rabbitmq.routing.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.rabbitmq.routing.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.rabbitmq.exchange.label"/>
                                }
                            >
                                {getFieldDecorator('exchange', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.rabbitmq.exchange.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.rabbitmq.exchange.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                        </div>
                    );
                    break;
                //jdbc输出
                case 'io.confluent.connect.jdbc.JdbcSinkConnector':
                    return (
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.dataSinkName.label"/>}
                            >
                                {getFieldDecorator('dataSourceName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        disabled={isEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.url.label"/>}
                            >
                                {getFieldDecorator('connectionUrl', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.jdbc.url.placeholder',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.url.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.getDataManageTableByUrl.bind(this)}
                                            onChange={this.onChangeConnectionUrl.bind(this, "dataDestination", "connectionUrl")}
                                            disabled={isEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={metadataManageUrlListStatus}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.create.label"/>
                                        </Option>
                                        {this.renderSelectOption(metadataManageUrlList)}
                                    </Select>
                                    /* <Input
                                         autoComplete="off"
                                         placeholder={formatMessage({
                                             id: 'form.syncConfigDataOriginModal.jdbc.connectionUrl.placeholder',
                                         })}
                                     />*/
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={
                                    <FormattedMessage id="form.syncConfigDataOriginModal.jdbc.insertMode.label"/>
                                }
                            >
                                {getFieldDecorator('insert', {
                                    initialValue: 'upsert',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.insertMode.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Radio.Group disabled={isEdit ? true : false}>
                                        <Radio value="upsert">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.insertMode.option.upsert"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.insertMode.option.upsert"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>
                                        <Radio value="insert">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.insertMode.option.insert"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.insertMode.option.insert"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>
                                        <Radio value="update">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.insertMode.option.update"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.insertMode.option.update"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.format.label"/>}
                            >
                                {getFieldDecorator('format', {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.jdbc.format.placeholder',
                                    }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.format.label',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.getFieldByTableId.bind(this)}
                                            onChange={this.onChangeConnectionUrl.bind(this, "dataDestination", "format")}
                                            disabled={isEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={metadataManageTableListStatus}
                                    >
                                        {this.renderSelectOption(metadataManageTableList)}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.pkMode.label"/>}
                            >
                                {getFieldDecorator('pkMode', {
                                    initialValue: 'record_value',
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.pkMode.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Radio.Group onChange={this.onChangePkMode.bind(this)}
                                                 disabled={isEdit ? true : false}>
                                        <Radio value="none">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.pkMode.option.none.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.pkMode.option.none.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>
                                        <Radio value="record_value">
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.pkMode.option.record_value.label"/>
                                            <Tooltip
                                                title={
                                                    <FormattedMessage
                                                        id="form.syncConfigDataOriginModal.jdbc.pkMode.option.record_value.label"/>
                                                }
                                            >
                                                <Icon type="info-circle-o" style={{marginLeft: 3}}/>
                                            </Tooltip>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={<FormattedMessage id={pkModeLabel}/>}>
                                {getFieldDecorator(pkModeValue, {
                                    initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.record_value.placeholder',
                                    }),
                                    rules: [
                                        {
                                            required: pkModeState,
                                            message: formatMessage({id: pkModePlaceholder}),
                                        },
                                    ],
                                })(
                                    <Select disabled={isEdit ? true : !pkModeState}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={fieldByTableIdListStatus}
                                    >
                                        {this.renderSelectFieldOption(fieldByTableIdList)}
                                    </Select>
                                    /*<Input
                                        autoComplete="off"
                                        disabled={pkModeState ? false : true}
                                        placeholder={formatMessage({id: pkModePlaceholder})}
                                    />*/
                                )}
                            </FormItem>

                        </div>
                    );
                    break;
            }
        }
    };

    render() {
        const {
            dataSyncNewMission,
            createStatus,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {
            modalType,
            configDataModalVisible,
            currentDataInfo,
            isEdit,
            detailModalData,
            htmlType,
        } = dataSyncNewMission;
        const {submitFormLayout} = this.state;

        return (
            <Modal
                title={
                    (isEdit ? '编辑' : '新建') +
                    (modalType === 'dataOrigin' ? '数据源-' : '数据目的地-') +
                    (currentDataInfo.hasOwnProperty('name') ? currentDataInfo.name : '')
                }
                visible={configDataModalVisible}
                footer={null}
                centered={true}
                onCancel={this.closeModal}
                destroyOnClose={false}
                className={styles.configModal}
            >
                <div className={styles.modalTips}>
                    <span>填写信息前，请确认数据源配置要求，</span>
                    <a href="https://www.baidu.com" target="_blank">
                        查看配置规则。
                    </a>
                </div>
                <div>
                    <Form onSubmit={this.handleSubmit} hideRequiredMark className={styles.configModalForm}>
                        {this.renderConfigContent()}
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24}}>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                htmlType="submit"
                                loading={createStatus}
                            >
                                <FormattedMessage id="form.syncConfigDataOriginModal.connect"/>
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default SyncConfigDataOriginModal;
