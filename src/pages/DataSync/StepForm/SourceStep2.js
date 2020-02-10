import React, {PureComponent, Fragment, createRef} from 'react';
import {createForm, createFormField, formShape} from 'rc-form';
import {connect} from 'dva';
import T from './../../../utils/T';
import styles from './style.less';
import router from 'umi/router';
import ReactDOM from 'react-dom';

import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import {EnumIconSrc} from './../../../constants/dataSync/EnumSyncCommon';
import {
    EnumModalFormContent,
    EnumCreateProcessorSpecialParam,
} from './../../../constants/dataSync/EnumSyncConfigModal';
import SyncChangeDataResourceModal from '../SyncChangeDataResourceModal';
import {
    Form,
    Input,
    Button,
    Select,
    Icon,
    Spin,
    Tooltip,
    Modal,
    Radio
} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
import SyncAddDataSourceModal from './../SyncAddDataSourceModal';

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    getDataSourceStatus: loading.effects['dataSyncNewMission/getDataSourceListAction'],
    getDataSourceDestinationStatus: loading.effects['dataSyncNewMission/getDataSourceListDestinationAction'],
    getDataResourceStatus: loading.effects['dataSyncNewMission/getDataResourceByIdAction'],
    getFieldStatus: loading.effects['dataSyncNewMission/getFieldListAction'],
}))
@Form.create()
class SourceStep2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            formItemLayout: {
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 8},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 8},
                    md: {span: 8},
                },
            },
            submitFormLayout: {
                wrapperCol: {
                    xs: {span: 24, offset: 0},
                    sm: {span: 4, offset: 10},
                },
            },
            modeNameLabel: 'form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.label',//jdbc输入的轮询模式的选择框label（字段名）
            modeNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.placeholder',//jdbc输入的轮询模式的选择框placeholder（字段名）
            modeName: 'incrementing',//jdbc输入的轮询模式的选择框 变量名（字段名）
            // modeNameState: true,//jdbc输入的轮询模式的选择框 状态，可不可编辑（字段名）
            pkModeLabel: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.record_value.label',//jdbc输出的主键模式的选择框 label（字段名）
            pkModePlaceholder: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.record_value.placeholder',//jdbc输出的主键模式的选择框 placeholder（字段名）
            pkModeValue: 'fields',//jdbc输出的主键模式的选择框 变量名（字段名）
            pkModeState: true,//jdbc输出的主键模式的选择框 状态，可不可编辑（字段名）
            htmlType:T.storage.getStorage('HtmlType').modalType,
        };
        this.listRef = createRef();
    }

    componentDidMount() {
        const self = this;
        const {dataSyncNewMission, dispatch} = this.props;
        const {currentDataInfo, formData, isProcessorEdit, currentStep} = dataSyncNewMission;

        // console.log('currentDataInfo',currentDataInfo);
        //刷新界面 如果不是编辑状态可以退回第一步(新建)
        if (currentStep !== 1) {
            //新建
            if (!T.storage.getStorage('HtmlType').isProcessorEdit) {
                router.push({
                    pathname: T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? '/dataTask/step-form/sourceType' : '/dataDistribution',
                });
            } else {//编辑
                router.push({
                    pathname: T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? '/dataTask' : '/dataDistribution',
                });
            }
        }

        //判断数据源类型，根据数据源className显示不同的数据源
        let params = {};
        //cn.gov.ytga.kafka.connect.file.FtpCsvSourceConnector
        switch (currentDataInfo.className) {
            //jdbc数据源io.confluent.connect.jdbc.JdbcSourceConnector
            case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector':
                params = {
                    type: 'MySQL'
                };
                if(formData.hasOwnProperty('mode')){
                    self.setState({
                            modeNameLabel: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + formData['mode'] + '.label',
                            modeNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + formData['mode'] + '.placeholder',
                            modeName: formData['mode'],
                            // modeNameState: detailModalData['configuration']['config']['mode'] === 'bulk' ? false : true,
                        }
                    );
                }
                break;
            //JDBC数据目的地io.confluent.connect.jdbc.JdbcSinkConnector
            case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector':
                params = {
                    type: 'MySQL'
                };
                if(formData.hasOwnProperty('pkMode')){
                    self.setState({
                            pkModeState: formData['pkMode'] === 'none' ? false : true,
                            pkModeLabel:
                            'form.syncConfigDataOriginModal.jdbc.pkMode.fields.' +
                            formData['pkMode'] +
                            '.label',
                            pkModePlaceholder:
                            'form.syncConfigDataOriginModal.jdbc.pkMode.fields.' +
                            formData['pkMode'] +
                            '.placeholder',
                            pkModeValue:
                                formData['pkMode'] === 'none' ? 'noneFields' : 'fields',
                        }
                    );
                }
                break;
            //kafka数据源输入
            case 'cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector':
                params = {
                    type: 'Kafka'
                };
                break;
            //ftp输入CSV文件
            case 'cn.gov.ytga.kafka.connect.file.FtpCsvSourceConnector':
                params = {
                    type:'FTP'
                };
                break;
            //ftp输出CSV文件
            case 'cn.gov.ytga.kafka.connect.file.FtpCsvSinkConnector':
                params = {
                    type:'FTP'
                };
                break;
            //ftp输入XML文件
            case 'cn.gov.ytga.kafka.connect.xmlmanager.XmlSourceConnector':
                params = {
                  type:'FTP'
                };
                break;
            //RabbitMQ输入文件
            case 'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSourceConnector':
                params = {
                    type:'RabbitMQ'
                };
                break;
            //RabbitMQ输出文件
            case 'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSinkConnector':
                params = {
                    type:'RabbitMQ'
                };
                break;
            default: break;
        }

        //用于记录 新建数据源时数据源的类型，弹窗的显示与类型有关SyncAddDataSourceModal
        currentDataInfo.typeName = params.hasOwnProperty('type') ? params['type'] : '';
        // console.log('currentDataInfo',currentDataInfo);

        if(isProcessorEdit){
            //编辑未做
            let htmlType = T.storage.getStorage('HtmlType').modalType;
            //获取数据源列表和数据源详情（同时获取）
            const p1 = new Promise((resolve, reject) => {
                //获取数据源列表
                dispatch({
                    // type:'dataSyncNewMission/getDataSourceListAction',
                    type: T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? 'dataSyncNewMission/getDataSourceListAction' : 'dataSyncNewMission/getDataSourceListDestinationAction',
                    currentDataInfoClassName:currentDataInfo.className,
                    params,
                    resolve,
                    reject,
                });
            }).then(response => response.result);
            const p2 = new Promise((resolve, reject) => {
                //获取数据源详情
                dispatch({
                    type:  htmlType === 'dataOrigin'?'dataSyncNewMission/getProcessorsDetailsAction':'dataSyncNewMission/getSinkDetailsAction',
                    uuid: currentDataInfo.uuid,
                    resolve,
                    reject,
                });
            }).then(response => response.result);
            Promise.all([p1, p2])
                .then(res => {
                    if(res[0]&&res[1]){
                        self.setDefaultFormValue();
                    }
                })
                .catch(e => {T.prompt.error('获取失败！')});
        }else{
            // 新建数据源任务
            new Promise((resolve, reject) => {
                //获取数据源列表（根据params 获取不同类型的数据源列表）
                dispatch({
                    type: 'dataSyncNewMission/getDataSourceListAction',
                    params,
                    resolve,
                    reject,
                });
            }).then(response => {
                if (response.result === 'true') {
                    //如果是新建的话，要保存数据
                    if(currentStep !== 0){//防止内存泄漏，防止组件卸载后（刷新），还填充数据的情况
                        self.props.form.setFieldsValue(formData);
                    }
                    // self.props.form.setFieldsValue(formData);
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const {isSourceEdit,dataResourceRadio,detailModalData} = nextProps.dataSyncNewMission;
        //（暂定）
        /*if (dataResourceRadio !== this.props.dataSyncNewMission.dataResourceRadio) {
            // this.fetchJdbcDestinationField();
        }*/
    }

    componentWillUnmount() {
        //重置表单
        this.resetForm();
        //销毁异步请求
        this.setState = (state, callback) => {
            return;
        };
    }

    //上一步
    onPrev = () => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {
            modalType,
        } = dataSyncNewMission;

        dispatch({
            type: 'dataSyncNewMission/setCurrentStepAction',
            currentStep: 0,
        });

        router.push({
            pathname: modalType === 'dataDestination' ? '/dataDistribution/step-form/sourceType' : '/dataTask/step-form/sourceType',
        });
    };

    /**
     * 选中数据源url时 触发
     * @param {string} type 类型
     * @param {string} key  数据源id
     * @param {object} item  this
     */
    selectDataSource = (type, key, item) => {
        const {dispatch} = this.props;
        //选中新建数据源
        if (key === "create") {
            dispatch({
                type: 'dataSyncNewMission/changeDataSourceModalVisibleAction',
                dataSourceModalVisible: true,
            });
        } else {
            switch (type) {
                //jdbc输入和输出 选中数据源后需要用id去获取表格信息，其他的不用
                case 'JDBC':
                    dispatch({
                        type: 'dataSyncNewMission/getDataResourceByIdAction',
                        id: key,
                    });
                    break;
            }
        }

    };

    //下一步功能
    handleSubmit = () => {
        let self = this;
        const {dispatch, form, dataSyncNewMission} = this.props;
        const {
            modalType,
            currentDataInfo,
            metadataManageUrlList,
            htmlType,
            isProcessorEdit,
            detailModalData,
        } = dataSyncNewMission;
        form.validateFieldsAndScroll((err, values) => {
            // console.log('values',values);
            if (!err) {
                let valueArr = T.lodash.keys(values);

                //保存form表单数据(前端保存)
                dispatch({
                    type: 'dataSyncNewMission/setFormDataAction',
                    formData: values,
                });

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
                    //JDBC 输入io.confluent.connect.jdbc.JdbcSourceConnector
                    case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector':
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
                    //JDBC 输出io.confluent.connect.jdbc.JdbcSinkConnector
                    case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector':
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

                //除了数据源名、className 其他的遍历转化字段
                valueArr.map(val => {
                    if (val !== 'dataSourceName') {
                        params[EnumModalFormContent[modalType][currentDataInfo.className][val]['mapTo']] = values[val];
                    }
                });
                params['connector.class'] = currentDataInfo.className;

                //后台发送的参数
                let sendParams;
                let resourceName = '';//因为表名所用的字段不一样，用于存储表名（jdbc输入、输出）
                //编辑还是新建
                if (isProcessorEdit) {
                    //编辑要传递uuid(未做)
                    sendParams = {
                        config: {
                            ...params,
                            // name: detailModalData.hasOwnProperty('name') ? detailModalData.name : '',
                            // topic: detailModalData.hasOwnProperty("config") ? detailModalData["config"]["config"]["topic"] : ""
                        },
                        name: detailModalData.hasOwnProperty('name') ? detailModalData.name : '',
                        uuid: detailModalData.hasOwnProperty('uuid') ? detailModalData.uuid : '', //编辑和新建的区别，新建为null，编辑需要加上
                    };
                    // let topic = detailModalData.hasOwnProperty("config") ? detailModalData["config"]["config"]["kafka.topic"]||detailModalData["config"]["config"]["topic"]||detailModalData["config"]["config"]["topics"] : "";
                    let topic = detailModalData.hasOwnProperty('configuration')
                        ? detailModalData['configuration']['config'][EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]['key']]
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
                    /*if (sendParams['config']['connector.class'] === 'io.confluent.connect.jdbc.JdbcSourceConnector') {
                        sendParams['config']['topic.prefix'] = sendParams['config']['topic'].slice(0, 32);
                        metadataManageUrlList.map((item, index) => {
                            if (item.databaseName === sendParams['config']['connection.url']) {
                                sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                            }
                        });
                    }*/
                    //jdbc输入topic字符串拼接，url拼接
                    switch (sendParams['config']['connector.class']) {
                        //jdbc输入io.confluent.connect.jdbc.JdbcSourceConnector
                        case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.name === sendParams['config']['connection.url']) {
                                    sendParams['datasourceId'] = item.id;
                                    sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                                }
                            });
                            //存储表名
                            resourceName = values['whitelist'];
                            break;
                        //jdbc输出io.confluent.connect.jdbc.JdbcSinkConnector
                        case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.name === sendParams['config']['connection.url']) {
                                    sendParams['datasourceId'] = item.id;
                                    sendParams['config']['connection.url'] = item.url + 'user=' + item.userName + '&password=' + item.password;
                                }
                            });
                            //存储表名
                            resourceName = values['format'];
                            break;
                    }
                    // console.log('编辑sendParams',sendParams);
                    // console.log('编辑currentDataInfo',currentDataInfo);
                    //把详情的全部传回去，修改改过的
                    // console.log('编辑detailModalData',detailModalData);
                    let endParams = {
                        config: {
                            ...sendParams.config,
                        },
                        transform: detailModalData['configuration']['transform'],
                        connectorPlugin: currentDataInfo,//插件信息
                        datasourceId: values.hasOwnProperty('databaseInfoId') ? values['databaseInfoId'] : '',//存储选中数据源的id
                        name: values['dataSourceName'], //数据源名称
                        pluginId: currentDataInfo.id, //id
                        uuid: detailModalData['uuid'], //编辑和新建的区别，新建为null，编辑需要加上

                    };
                    // console.log('endParams',endParams);

                    // 本地保存
                    dispatch({
                        type: "dataSyncNewMission/saveProcessorParamInfoAction",
                        processorParamInfo: endParams,
                    });
                    //跳到第三步
                    dispatch({
                        type: 'dataSyncNewMission/setCurrentStepAction',
                        currentStep: 2,
                    });
                    router.push({
                        pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/rule' : '/dataDistribution/step-form/rule',
                        //数据源的id,数据资源（表）的名字
                        params: {
                            isRouterPush: true,
                            configParams: {
                                id: detailModalData['datasourceId'],
                                name: resourceName
                            }
                        },
                    });


                } else {
                    //新建功能
                    let newUuid = T.helper.createUuid(32, 16);
                    params['topic'] = newUuid;
                    sendParams = {
                        config: {
                            ...params,
                        },
                        connectorPlugin: currentDataInfo,//插件信息
                        datasourceId: values.hasOwnProperty('databaseInfoId') ? values['databaseInfoId'] : '',//存储选中数据源的id
                        createBy: T.auth.getLoginInfo().user.loginCode,
                        createDate: '',
                        des: '',
                        icon: '',
                        name: values['dataSourceName'], //数据源名称
                        pluginId: currentDataInfo.id, //id
                        status: '',
                        type: '',
                        updateBy: '',
                        updateDate: '',
                        uuid: '', //编辑和新建的区别，新建为null，编辑需要加上
                    };

                    //不同的数据源和数据目的地的topic的字段可能不一样，例如：有的可能叫topics
                    sendParams.config[EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]['key']] = newUuid;

                    //有些topic必须写死，比如kafka输入和kafka输出的
                   /* switch (currentDataInfo.className) {
                        //TODO 暂时去掉这个，需要跟后端确认
                        //kafka输入或者输出
                        // case "cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector" || "cn.gov.ytga.kafka.connect.replicate.KafkaSinkConnector":
                        //     sendParams.config[EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]["key"]] = "${kafka.topic}-copy";
                        //     break;
                        default:
                            sendParams.config[EnumCreateProcessorSpecialParam[modalType][currentDataInfo.className]['key']] = newUuid;
                    }*/

                    switch (sendParams['config']['connector.class']) {
                        //JDBC输入topic字符串拼接，url拼接
                        case "cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector":
                            sendParams['config']['topic.prefix'] = newUuid;//主题前缀名，后期修改的

                            //jdbc输入的topic 拼接表名
                            sendParams['config']['topic'] = sendParams['config']['topic'] + params['table.whitelist'];
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    let resConfig = JSON.parse(item.config);
                                    sendParams['config']['connection.url'] = resConfig['url'] + 'user=' + resConfig['userName'] + '&password=' + resConfig['password'];
                                }
                            });
                            //存储表名（用于跳转配置规则 - 表名信息）
                            resourceName = values['whitelist'];
                            break;
                        //JDBC输出url拼接
                        case "cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector":
                            // sendParams['config']['topic'] = sendParams['config']['topic'] + params['table.whitelist'];
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    let resConfig = JSON.parse(item.config);
                                    sendParams['config']['connection.url'] = resConfig['url'] + 'user=' + resConfig['userName'] + '&password=' + resConfig['password'];
                                }
                            });
                            //存储表名（用于跳转配置规则 - 表名信息）
                            resourceName = values['format'];
                            break;
                        //kafka数据源输入
                        case "cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector":
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    let databaseInfo = JSON.parse(item.config);//存储队列数据源注册时填写的信息
                                    let sendConfig = sendParams['config'];
                                    sendParams['config'] = {
                                        ...sendConfig,
                                        ...databaseInfo,
                                    };
                                    // console.log('sendParams',sendParams);
                                }
                            });
                            break;
                        //ftp输入CSV文件
                        case 'cn.gov.ytga.kafka.connect.file.FtpCsvSourceConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    let databaseInfo = JSON.parse(item.config);//存储队列数据源注册时填写的信息
                                    let sendConfig = sendParams['config'];
                                    sendParams['config'] = {
                                        ...sendConfig,
                                        ...databaseInfo,
                                    };
                                }
                            });
                            break;
                        //ftp输出CSV文件
                        case 'cn.gov.ytga.kafka.connect.file.FtpCsvSinkConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    let databaseInfo = JSON.parse(item.config);//存储队列数据源注册时填写的信息
                                    let sendConfig = sendParams['config'];
                                    sendParams['config'] = {
                                        ...sendConfig,
                                        ...databaseInfo,
                                    };
                                }
                            });
                            break;
                        //ftp输入xml文件
                        case 'cn.gov.ytga.kafka.connect.xmlmanager.XmlSourceConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    let databaseInfo = JSON.parse(item.config);//存储队列数据源注册时填写的信息
                                    let sendConfig = sendParams['config'];
                                    sendParams['config'] = {
                                        ...sendConfig,
                                        ...databaseInfo,
                                    };
                                }
                            });
                            break;
                        //RabbitMQ输入
                        case 'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSourceConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
                                    let databaseInfo = JSON.parse(item.config);//存储队列数据源注册时填写的信息
                                    let sendConfig = sendParams['config'];
                                    sendParams['config'] = {
                                        ...sendConfig,
                                        ...databaseInfo,
                                    };
                                }
                            });
                            break;
                        //RabbitMQ输出
                        case 'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSinkConnector':
                            metadataManageUrlList.map((item, index) => {
                                if (item.id === sendParams['config']['databaseInfoId']) {
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

                    //数据分发 - 要填写数据源的uuid
                    if (modalType === 'dataDestination') {
                        sendParams['source'] = T.storage.getStorage('processorId');
                    }
                    // 本地保存
                    dispatch({
                        type: "dataSyncNewMission/saveProcessorParamInfoAction",
                        processorParamInfo: sendParams,
                    });
                    //跳到第三步
                    dispatch({
                        type: 'dataSyncNewMission/setCurrentStepAction',
                        currentStep: 2,
                    });
                    // console.log('sendParams',sendParams);
                    router.push({
                        pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/rule' : '/dataDistribution/step-form/rule',
                        params: {
                            isRouterPush: true,
                            configParams: {
                                id: sendParams['datasourceId'],//数据源的id
                                name: resourceName,//JDBC的表名
                            }
                        },
                    });

                }

            }
        });
    };

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };

    //填充默认数据(编辑)
    setDefaultFormValue = () => {
        const {detailModalData, modalType, metadataManageUrlList} = this.props.dataSyncNewMission;
        // console.log('222222',detailModalData);
        //form表单需要的数据
        let formValue = {};
        //数据遍历成对应的数据
        let enumKeys = T.lodash.keys(EnumModalFormContent[modalType][detailModalData['configuration']['config']['connector.class']]);
        // let keysArr = detailModalData.hasOwnProperty('config') ? T.lodash.keys(detailModalData['config']) : [];
        let keysArr = detailModalData.hasOwnProperty('configuration') ? detailModalData['configuration'].hasOwnProperty('config') ? T.lodash.keys(detailModalData['configuration']['config']) : [] : [];
        //后台返回的config里,会有connector.class和name还有topic，都要从表单数据里去掉
        keysArr.map((item, idx) => {
            if (item !== 'connector.class') {
                enumKeys.map(val => {
                    if (EnumModalFormContent[modalType][detailModalData['configuration']['config']['connector.class']][val]['mapTo'] === item) {
                        formValue[EnumModalFormContent[modalType][detailModalData['configuration']['config']['connector.class']][val]['value']] = detailModalData['configuration']['config'][item];
                    }
                });
            }
        });
        formValue['dataSourceName'] = detailModalData['name'];
        let self = this;
        //根据connector.class，设置表单中数据的显示（请求返回的数据没有，而表单需要显示）
        switch (detailModalData['configuration']['config']['connector.class']) {
            //去掉了黑白名单选择 jdbc数据源io.confluent.connect.jdbc.JdbcSourceConnector
            case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector':
                this.setState({
                        // tableNameValue: detailModalData['config'].hasOwnProperty('table.whitelist') ? 'whitelist' : 'blacklist',
                        modeNameLabel: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + detailModalData['configuration']['config']['mode'] + '.label',
                        modeNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + detailModalData['configuration']['config']['mode'] + '.placeholder',
                        modeName: detailModalData['configuration']['config']['mode'],
                        // modeNameState: detailModalData['configuration']['config']['mode'] === 'bulk' ? false : true,
                    },
                    () => {
                        //详情页跳编辑页，数据源显示的是url地址，不是数据源的名称
                        metadataManageUrlList.map((item, index) => {
                            if (detailModalData['datasourceId']===item.id) {
                                formValue['databaseInfoId'] = item.id;
                            }
                        });
                        self.props.form.setFieldsValue(formValue);
                    }
                );

                break;
                //jdbc输出io.confluent.connect.jdbc.JdbcSinkConnector
            case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector':
                this.setState(
                    {
                        pkModeState: detailModalData['configuration']['config']['pk.mode'] === 'none' ? false : true,
                        pkModeLabel:
                        'form.syncConfigDataOriginModal.jdbc.pkMode.fields.' +
                        detailModalData['configuration']['config']['pk.mode'] +
                        '.label',
                        pkModePlaceholder:
                        'form.syncConfigDataOriginModal.jdbc.pkMode.fields.' +
                        detailModalData['configuration']['config']['pk.mode'] +
                        '.placeholder',
                        pkModeValue:
                            detailModalData['configuration']['config']['pk.mode'] === 'none' ? 'noneFields' : 'fields',
                    },
                    () => {
                        self.props.form.setFieldsValue(formValue);
                    }
                );
                break;
        }
        // console.log('formValue',formValue);
        this.props.form.setFieldsValue(formValue);
    };

    /**
     * JDBC 输入 选择数据资源时触发（通过表名获取字段名）
     */
    selectDataResource = () =>{
        const {dispatch, form, dataSyncNewMission} = this.props;
        const {currentDataInfo} = dataSyncNewMission;
        const {getFieldDecorator, getFieldValue} = form;
        let params = {};
        switch (currentDataInfo.className) {
            //jdbc数据源io.confluent.connect.jdbc.JdbcSourceConnector
            case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector':
                params = {
                    id: getFieldValue('databaseInfoId'),
                    name: getFieldValue('whitelist')
                };
                break;
            //JDBC数据目的地io.confluent.connect.jdbc.JdbcSinkConnector
             case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector':
                 params = {
                     id: getFieldValue('databaseInfoId'),
                     name: getFieldValue('format')
                 };
                 break;
            default:
                break;
        }
        dispatch({
            type: 'dataSyncNewMission/getFieldListAction',
            params,
        });
    };

    //通过单选按钮输入框显示不同的内容（jdbc输入的轮询模式）
    onChangeMode = e => {
        this.setState({
            modeNameLabel: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + e.target.value + '.label',
            modeNamePlaceholder: 'form.syncConfigDataOriginModal.jdbc.mode.option.' + e.target.value + '.placeholder',
            modeName: e.target.value,
            // modeNameState: e.target.value === 'bulk' ? false : true,
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

    //JDBC数据源orJDBC数据目的地 url/表/字段 下拉选项渲染
    renderSelectOption(metadataManageUrlList, type) {
        // console.log('metadataManageUrlList0',metadataManageUrlList);
        switch (type) {
            //数据源url
            case 'URL':
                return (
                    metadataManageUrlList.map(item => {
                        return (
                            <Option key={item.id}>
                                {item.name}
                            </Option>
                        )
                    })
                );
                break;
            //表格
            case 'TABLE':
                return (
                    metadataManageUrlList.map(item => {
                        return (
                            <Option key={item}>
                                {item}
                            </Option>
                        )
                    })
                );

                break;
            //字段
            case 'FIELD':
                return (
                    metadataManageUrlList.map(item => {
                        return (
                            <Option key={item.name}>
                                {item.name}
                            </Option>
                        )
                    })
                );
                break;
            default:
                break;
        }

    };

    //jdbc数据源或数据目的地connectionUrl或表名whitelist的选择框发生改变时，清空选择的表名和字段名
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
                if (type !== "whitelist") {//如果选择的是数据源
                    resetFields("whitelist");//清空数据资源
                }
                resetFields(modeName);//清空字段
                break;
            case 'dataDestination':
                if (type !== "format") {//如果选择的是数据源
                    resetFields("format");//清空数据资源
                }
                resetFields(pkModeValue);//清空字段
                break;
        }
    };

    //（jdbc目的地）数据资源输入框失去焦点
    inputOnBlur = (e)=>{
        if(e.target.value!==''){
            this.selectDataResource();
        }
    };

    //（jdbc目的地）数据库表名输入框改变，清空字段名（暂定）
    handleDataResource = (e) => {
        const {dispatch} = this.props;
        //暂定
        dispatch({
            type: 'dataSyncNewMission/setDataResourceRadioAction',
            dataResourceRadio: e.target.value,
        });
        // this.props.form.setFieldValue('format',e.target.value);
        const {
            modeName,
            pkModeValue,
        } = this.state;
        const {
            form: {resetFields},
        } = this.props;
        switch (T.storage.getStorage('HtmlType').modalType) {
            case 'dataOrigin':
                resetFields(modeName);
                break;
            case 'dataDestination':
                resetFields(pkModeValue);
                break;
        }
    };
    //（jdbc目的地）根据输入的数据源获取字段列表(暂定)
    fetchJdbcDestinationField = () => {
        const {dispatch, form, dataSyncNewMission} = this.props;
        const {getFieldDecorator, getFieldValue} = form;
        let params = {
            id: getFieldValue('databaseInfoId'),//数据源的id
            name: getFieldValue('format'),//数据资源的name
        };
        //获取字段
        dispatch({
            type: 'dataSyncNewMission/getFieldListAction',
            params,
        });
    };

    //（jdbc目的地）选择资源框（暂定）
    setFormValue = (type, value) => {
        this.props.form.setFieldsValue(type, value)
    };

    //（jdbc目的地）选择 - 显示数据资源弹窗（暂定）
    showDataResource = () => {
        const {dispatch, form, dataSyncNewMission} = this.props;
        let value = this.props.form.getFieldValue('databaseInfoId');
        const {
            dataResourceNameSelected
        } = dataSyncNewMission;
        dispatch({
            type: 'dataSyncNewMission/changeDataResourceModalVisibleAction',
            htmlType: 'chooseResource',
            modalVisible: true,
        });
        // 获取数据资源列表
        //TODO 调用接口，选择弹窗显示（未对接）
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/getDataResourceFromDataSourceAction',
                id: value,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                dispatch({
                    type: 'dataSyncNewMission/setDataResourceFromDataSourceAction',
                    dataResourceFromDataSource: response.data
                });
            }else {
                T.prompt.error(response.message)
            }
        });

    };

    //（jdbc目的地）关闭选择数据资源弹窗（暂定）
    closeDataResourceModel = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/changeDataResourceModalVisibleAction',
            htmlType: 'chooseResource',
            modalVisible: false,
        });
    };

    //（jdbc目的地）清空数据资源名（暂定）
    clearDataResource = () => {
        const {dispatch} = this.props;
        //选中的列表写入model
        dispatch({
            type: 'dataSyncNewMission/setDataResourceRadioAction',
            dataResourceRadio: '',
        });
    };


    //渲染模态框不同的内容
    renderConfigContent = () => {
        const {
            dataSyncNewMission,
            metadataManageUrlListStatus,
            metadataManageTableListStatus,
            fieldByTableIdListStatus,
            getDataSourceStatus,
            getDataSourceDestinationStatus,
            getDataResourceStatus,
            getFieldStatus,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {
            modalType,
            currentDataInfo,
            isProcessorEdit,
            metadataManageUrlList,
            metadataManageTableList,
            fieldByTableIdList,
        } = dataSyncNewMission;
        const name = currentDataInfo.hasOwnProperty('className') ? currentDataInfo.className : 'FTP';
        const {
            formItemLayout,
            modeNameLabel,
            modeNamePlaceholder,
            modeName,
            pkModeLabel,
            pkModePlaceholder,
            pkModeState,
            pkModeValue,
            // modeNameState,
        } = this.state;
        //数据源
        if (modalType === 'dataOrigin') {
            //数据源
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
                                        disabled={isProcessorEdit ? true : false}
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
                                        disabled={isProcessorEdit ? true : false}
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
                                    /*initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                    }),*/
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select
                                        // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                        onSelect={this.selectDataSource.bind(this, 'FTP')}
                                        disabled={isProcessorEdit ? true : false}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        loading={metadataManageUrlListStatus}
                                        placeholder={<FormattedMessage id="form.syncConfigDataOriginModal.databaseName.placeholder"/>}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.databaseName.option.create.label"/>
                                        </Option>
                                        {getDataSourceStatus ? <Option value="spin" key="spin" disabled>
                                                <Spin/></Option>
                                            : this.renderSelectOption(metadataManageUrlList, 'URL')}
                                        {/*{this.renderSelectOption(metadataManageUrlList)}*/}
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
                                        disabled={isProcessorEdit ? true : false}
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
                                    /*initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                    }),*/
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select
                                        // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                        onSelect={this.selectDataSource.bind(this, 'FTP')}
                                        disabled={isProcessorEdit ? true : false}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        loading={metadataManageUrlListStatus}
                                        placeholder={<FormattedMessage id="form.syncConfigDataOriginModal.databaseName.placeholder"/>}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.databaseName.option.create.label"/>
                                        </Option>
                                        {getDataSourceStatus ? <Option value="spin" key="spin" disabled>
                                                <Spin/></Option>
                                            : this.renderSelectOption(metadataManageUrlList, 'URL')}
                                        {/*{this.renderSelectOption(metadataManageUrlList)}*/}
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
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.xml.tag.label"/>}
                            >
                                {getFieldDecorator('tag', {
                                    rules: [
                                        {
                                            // required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.xml.tag.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.xml.tag.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.xml.schema.label"/>}
                            >
                                {getFieldDecorator('schema', {
                                    rules: [
                                        {
                                            required: getFieldValue('filed') === 'false' ? true : false,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.ftp.xml.schema.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <TextArea
                                        style={{minHeight: 32}}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.ftp.xml.schema.placeholder',
                                        })}
                                        rows={4}
                                    />
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
                                        disabled={isProcessorEdit ? true : false}
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
                                        disabled={isProcessorEdit ? true : false}
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
                                    /*initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                    }),*/
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select
                                        onSelect={this.selectDataSource.bind(this, 'Kafka')}
                                        // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                        disabled={isProcessorEdit ? true : false}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        loading={metadataManageUrlListStatus}
                                        placeholder={<FormattedMessage id="form.syncConfigDataOriginModal.databaseName.placeholder"/>}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.databaseName.option.create.label"/>
                                        </Option>
                                        {getDataSourceStatus ? <Option value="spin" key="spin" disabled>
                                            <Spin/>
                                        </Option> : this.renderSelectOption(metadataManageUrlList, 'URL')}
                                        {/*{this.renderSelectOption(metadataManageUrlList,'URL')}*/}
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
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.kafka.schema.label"/>}
                            >
                                {getFieldDecorator('schema', {
                                    rules: [
                                        {
                                            required: getFieldValue('filed') === 'false' ? true : false,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.kafka.schema.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <TextArea
                                        style={{minHeight: 32}}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.kafka.schema.placeholder',
                                        })}
                                        rows={4}
                                    />
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
                                        disabled={isProcessorEdit ? true : false}
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
                //jdbc输入io.confluent.connect.jdbc.JdbcSourceConnector（原先的）
                case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector':
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
                                        disabled={isProcessorEdit ? true : false}
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
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.url.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.selectDataSource.bind(this, 'JDBC')}
                                            onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "databaseInfoId")}
                                            disabled={isProcessorEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.jdbc.url.placeholder'})}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.create.label"/>
                                        </Option>
                                        {getDataSourceStatus ? <Option value="spin" key="spin" disabled>
                                            <Spin/>
                                        </Option> : this.renderSelectOption(metadataManageUrlList, 'URL')}
                                        {/*{this.renderSelectOption(metadataManageUrlList)}*/}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={<FormattedMessage
                                id='form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.label'/>}>
                                {getFieldDecorator('whitelist', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: 'form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.placeholder'}),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.selectDataResource}
                                            onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "whitelist")}
                                            disabled={isProcessorEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={metadataManageTableListStatus}
                                            placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.placeholder'})}
                                    >
                                        {getDataResourceStatus ? <Option value="spinTable" key="spinTable" disabled>
                                            <Spin/>
                                        </Option> : this.renderSelectOption(metadataManageTableList, 'TABLE')}
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
                                                 disabled={isProcessorEdit ? true : false}>
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
                            {modeName === 'bulk'
                                ? <FormItem {...formItemLayout} label={<FormattedMessage id='form.syncConfigDataOriginModal.jdbc.poll.label'/>}>
                                {getFieldDecorator('poll', {
                                    initialValue:300000,
                                    rules: [
                                        {
                                            required: false,
                                            message: formatMessage({id: 'form.syncConfigDataOriginModal.jdbc.poll.placeholder'}),
                                        },
                                    ],
                                })(
                                    <Radio.Group
                                                 disabled={isProcessorEdit ? true : false}
                                    >
                                        <Radio value={300000}>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.poll.option.fiveMin"/>
                                        </Radio>
                                        <Radio value={3600000}>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.poll.option.oneHour"/>
                                        </Radio>
                                        <Radio value={21600000}>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.poll.option.sixHour"/>
                                        </Radio>
                                        <Radio value={86400000}>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.jdbc.poll.option.oneDay"/>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                                : <FormItem {...formItemLayout} label={<FormattedMessage id={modeNameLabel}/>}>
                                {getFieldDecorator(modeName, {
                                    // initialValue: formatMessage({
                                    //     id: 'form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.placeholder',
                                    // }),
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({id: String(modeNamePlaceholder)}),
                                        },
                                    ],
                                })(
                                    <Select disabled={isProcessorEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={fieldByTableIdListStatus}
                                            placeholder={formatMessage({id: String(modeNamePlaceholder)})}
                                    >
                                        {getFieldStatus ? <Option value="spin" key="spin" disabled>
                                            <Spin/>
                                        </Option> : this.renderSelectOption(fieldByTableIdList, 'FIELD')}
                                        {/*{this.renderSelectFieldOption(fieldByTableIdList)}*/}
                                    </Select>

                                    // <Input
                                    //     autoComplete="off"
                                    //     disabled={modeNameState ? false : true}
                                    //     placeholder={formatMessage({id: modeNamePlaceholder})}
                                    // />
                                )}
                            </FormItem>}
                            {/*<FormItem {...formItemLayout} label={<FormattedMessage id={modeNameLabel}/>}>
                                {getFieldDecorator(modeName, {
                                    // initialValue: formatMessage({
                                    //     id: 'form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.placeholder',
                                    // }),
                                    rules: [
                                        {
                                            required: modeNameState,
                                            message: formatMessage({id: String(modeNamePlaceholder)}),
                                        },
                                    ],
                                })(
                                    <Select disabled={isProcessorEdit ? true : !modeNameState}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={fieldByTableIdListStatus}
                                            placeholder={modeName === 'bulk' ? '' : formatMessage({id: String(modeNamePlaceholder)})}
                                    >
                                        {getFieldStatus ? <Option value="spin" key="spin" disabled>
                                            <Spin/>
                                        </Option> : this.renderSelectOption(fieldByTableIdList, 'FIELD')}
                                        {this.renderSelectFieldOption(fieldByTableIdList)}
                                    </Select>

                                    // <Input
                                    //     autoComplete="off"
                                    //     disabled={modeNameState ? false : true}
                                    //     placeholder={formatMessage({id: modeNamePlaceholder})}
                                    // />
                                )}
                            </FormItem>*/}
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
                                    <Radio.Group disabled={isProcessorEdit ? true : false}>
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
                                        disabled={isProcessorEdit ? true : false}
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
                                    /*initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                    }),*/
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select
                                        // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                        onSelect={this.selectDataSource.bind(this, 'FTP')}
                                        disabled={isProcessorEdit ? true : false}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        loading={metadataManageUrlListStatus}
                                        placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.databaseName.placeholder'})}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.databaseName.option.create.label"/>
                                        </Option>
                                        {getDataSourceStatus ? <Option value="spin" key="spin" disabled>
                                                <Spin/></Option>
                                            : this.renderSelectOption(metadataManageUrlList, 'URL')}
                                        {/*{this.renderSelectOption(metadataManageUrlList)}*/}
                                    </Select>
                                )}
                            </FormItem>

                           {/* <FormItem
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
                            </FormItem>*/}

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
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.databaseName.label"/>}
                            >
                                {getFieldDecorator('databaseInfoId', {
                                    /*initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                    }),*/
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select
                                        // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                        onSelect={this.selectDataSource.bind(this, 'FTP')}
                                        disabled={isProcessorEdit ? true : false}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        loading={metadataManageUrlListStatus}
                                        placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.databaseName.placeholder'})}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.databaseName.option.create.label"/>
                                        </Option>
                                        {getDataSourceStatus ? <Option value="spin" key="spin" disabled>
                                                <Spin/></Option>
                                            : this.renderSelectOption(metadataManageUrlList, 'URL')}
                                        {/*{this.renderSelectOption(metadataManageUrlList)}*/}
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
                                        disabled={isProcessorEdit ? true : false}
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
                                        disabled={isProcessorEdit ? true : false}
                                        placeholder={formatMessage({
                                            id: 'form.syncConfigDataOriginModal.dataSinkName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.databaseName.label"/>}
                            >
                                {getFieldDecorator('databaseInfoId', {
                                    /*initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                    }),*/
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.databaseName.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select
                                        // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                        onSelect={this.selectDataSource.bind(this, 'FTP')}
                                        disabled={isProcessorEdit ? true : false}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        loading={metadataManageUrlListStatus}
                                        placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.databaseName.placeholder'})}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.databaseName.option.create.label"/>
                                        </Option>
                                        {getDataSourceStatus ? <Option value="spin" key="spin" disabled>
                                                <Spin/></Option>
                                            : this.renderSelectOption(metadataManageUrlList, 'URL')}
                                        {/*{this.renderSelectOption(metadataManageUrlList)}*/}
                                    </Select>
                                )}
                            </FormItem>
                           {/* <FormItem
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
                            </FormItem>*/}
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
                //jdbc输出io.confluent.connect.jdbc.JdbcSinkConnector（）
                case 'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector':
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
                                        disabled={isProcessorEdit ? true : false}
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
                                {getFieldDecorator('databaseInfoId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.url.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Select onSelect={this.selectDataSource.bind(this, 'JDBC')}
                                            onChange={this.onChangeConnectionUrl.bind(this, "dataDestination", "databaseInfoId")}
                                            disabled={isProcessorEdit ? true : false}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={metadataManageUrlListStatus}
                                            placeholder={formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.url.placeholder',
                                            })}
                                    >
                                        <Option value="create" key="create">
                                            <Icon type="plus" style={{marginRight: 5}}/>
                                            <FormattedMessage
                                                id="form.syncConfigDataOriginModal.ftp.coding.option.create.label"/>
                                        </Option>
                                        {getDataSourceStatus ? <Option value="spin" key="spin" disabled>
                                            <Spin/>
                                        </Option> : this.renderSelectOption(metadataManageUrlList, 'URL')}
                                        {/*{this.renderSelectOption(metadataManageUrlList)}*/}
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
                                    <Radio.Group disabled={isProcessorEdit ? true : false}>
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
                                label={<FormattedMessage id="form.syncConfigDataOriginModal.jdbc.resource.label"/>}
                            >
                                {getFieldDecorator('format', {
                                    rules: [
                                        {
                                            required: true,
                                            message: formatMessage({
                                                id: 'form.syncConfigDataOriginModal.jdbc.resource.placeholder',
                                            }),
                                        },
                                    ],
                                })(
                                    <Input
                                        className={styles.dataResourceInput}
                                        disabled={isProcessorEdit ? true : false}
                                        // value={dataResourceRadio}
                                        placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.jdbc.resource.placeholder'})}
                                        // onChange={this.handleDataResource}
                                        onChange={this.onChangeConnectionUrl.bind(this, "dataDestination", "format")}
                                        onBlur={this.inputOnBlur}
                                    />
                                    /*<div className={styles.dataResourceChoice}>
                                        <Input
                                            className={styles.dataResourceInput}
                                            value={dataResourceRadio}
                                            placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.jdbc.resource.placeholder'})}
                                            onChange={this.handleDataResource}
                                        />
                                        <Button
                                            className={styles.dataResourceBtn}
                                            type="primary"
                                            onClick={this.showDataResource}
                                        >
                                            <FormattedMessage id="metadataManage.btn.choice"/>
                                        </Button>
                                        <Button
                                            className={styles.dataResourceBtn}
                                            onClick={this.clearDataResource}
                                        >
                                            <FormattedMessage id="metadataManage.btn.clear"/>
                                        </Button>
                                        <Button
                                            className={styles.dataResourceBtn}
                                            type="primary"
                                            // onClick={this.createDataResource}
                                        >
                                            <FormattedMessage id="form.btn.create"/>
                                        </Button>
                                    </div>*/
                                    // <Select onSelect={this.selectDataResource.bind(this)}
                                    //         onChange={this.onChangeConnectionUrl.bind(this, "dataDestination", "format")}
                                    //         disabled={isProcessorEdit ? true : false}
                                    //         getPopupContainer={triggerNode => triggerNode.parentNode}
                                    //         loading={metadataManageTableListStatus}
                                    // >
                                    //     {getDataResourceStatus ? <Option value="spinTable" key="spinTable" disabled>
                                    //         <Spin/>
                                    //     </Option> : this.renderSelectOption(metadataManageTableList, 'TABLE')}
                                    // </Select>
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
                                                 disabled={isProcessorEdit ? true : false}>
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
                                    </Radio.Group>
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={<FormattedMessage id={pkModeLabel}/>}>
                                {getFieldDecorator(pkModeValue, {
                                    /*initialValue: formatMessage({
                                        id: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.record_value.placeholder',
                                    }),*/
                                    rules: [
                                        {
                                            required: pkModeState,
                                            message: formatMessage({id: pkModePlaceholder}),
                                        },
                                    ],
                                })(
                                    <Select disabled={isProcessorEdit ? true : !pkModeState}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            loading={fieldByTableIdListStatus}
                                            placeholder={formatMessage({
                                                id: pkModePlaceholder,
                                            })}
                                    >
                                        {/*{this.renderSelectFieldOption(fieldByTableIdList)}*/}
                                        {getFieldStatus ? <Option value="spin" key="spin" disabled>
                                            <Spin/>
                                        </Option> : this.renderSelectOption(fieldByTableIdList, 'FIELD')}
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
        const {form, dataSyncNewMission,getDataSourceStatus} = this.props;
        const {
            isProcessorEdit,
            dataResourceModalVisible,
        } = dataSyncNewMission;
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        const {submitFormLayout} = this.state;
        return (
            <Fragment>
                <div className={styles.configForm}>
                    <Form hideRequiredMark>
                        {getDataSourceStatus ? <Spin size='large' className={styles.missionStep} /> : this.renderConfigContent()}
                        <FormItem
                            {...submitFormLayout}
                            className={styles.step1}
                            style={{marginTop: 32, textAlign: 'right'}}
                        >
                            <Button onClick={this.onPrev} disabled={isProcessorEdit}>
                                上一步
                            </Button>
                            <Button
                                style={{marginLeft: 20}}
                                type="primary"
                                htmlType="submit"
                                onClick={this.handleSubmit}
                                // loading={createStatus}
                            >
                                <FormattedMessage id="form.syncConfigDataOriginModal.nextStep"/>
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <SyncAddDataSourceModal />
                <SyncChangeDataResourceModal
                    content={this}
                    closeDataResourceModel={this.closeDataResourceModel}
                    dataResourceModalVisible={dataResourceModalVisible}
                    setFormValue={this.setFormValue}
                />
            </Fragment>
        );
    }
}

// const SourceStep2 = Form.create({
//     mapPropsToFields (props) {
//         // console.log(props);
//     },
//     onValuesChange(props, changedFields, allValues){
//         // console.log(allValues,'allValues');
//         console.log(props,'props');
//         // props.dispatch({
//         //     type: 'setFormDataAction',
//         //     formData: allValues,
//         // });
//     }
// })(SourceStepForm);
export default SourceStep2;
