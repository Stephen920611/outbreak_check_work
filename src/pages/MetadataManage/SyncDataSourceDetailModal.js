import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import styles from './SyncDataSourceDetailModal.less';
import T from './../../utils/T';
import {EnumIconSrc} from './../../constants/dataSync/EnumSyncCommon';
import {EnumQuickRegisterParams} from './../../constants/dataSync/EnumSyncConfigModal';
import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import {
    Form,
    Modal,
    Spin,
    Input,
    Button,
    Row,
    Col,
    Checkbox,
    Divider,
} from 'antd';
const FormItem = Form.Item;
const { Search,TextArea } = Input;

@connect(({metadataManage, loading}) => ({
    metadataManage,
    // loading: loading.models.dataSyncNewForm,
}))
@Form.create()
class SyncAddMetadataModal extends PureComponent {
    state = {
        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
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
                sm: {span: 24, offset: 0},
            },
        },
    };

    componentDidMount(){
        const {dispatch,dataSourceDetail} = this.props;
        // 获取数据资源列表

    };

    // componentWillReceiveProps(nextProps) {
    //     const {dataSourceDetail} = nextProps;
    //     //如果是可编辑状态的，那么需要更新表单值
    //     if (dataSourceDetail !== this.props.dataSourceDetail && dataSourceDetail) {
    //         this.setDefaultFormValue(nextProps);
    //     }
    // }

    //填充表单默认数据
    // setDefaultFormValue = nextProps => {
    //     const {dataSourceDetail} = nextProps;
    //     console.log('2134245',dataSourceDetail);
    //     console.log('config',dataSourceDetail.config);
    // };


    //保存新建数据源
    onSubmitData = (e) => {
        let self = this;
        const {dispatch,form,dataSourceDetail} = this.props;
        const {name,config} = dataSourceDetail;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('values',values);
                let valueArr = T.lodash.keys(values);
                if (dataSourceDetail && config) {
                    // const name = metadataType.title;
                    const databaseId = config.databaseId;
                    const id = dataSourceDetail.id;
                    const info = T.auth.getLoginInfo();
                    let className = '';
                    let params = {};
                    switch (id) {
                        //kafka 输出
                        case 'Kafka':
                            className = 'kafka';
                            valueArr.map(val => {
                                params[EnumQuickRegisterParams[className][val]['mapTo']] = values[val];

                            });
                            break;
                        //rabbitmq
                        case 'RabbitMq':
                            className = 'RabbitMQ';
                            valueArr.map(val => {
                                params[EnumQuickRegisterParams[className][val]['mapTo']] = values[val];

                            });
                            break;
                        //ftp
                        case 'FTP':
                            className = 'ftp';
                            valueArr.map(val => {
                                params[EnumQuickRegisterParams[className][val]['mapTo']] = values[val];

                            });
                            break;
                        //MySQL
                        case 'MySQL':
                            params = {
                                // databaseId: id,
                                // databaseName: values.databaseName,
                                userName: values.username,
                                password: values.password,
                                url: values.url,
                                // type: values.connectType,
                                loginCode:info.user.loginCode
                            };
                            break;
                        default:
                            break;
                    }
                    let sendParams = {
                        configMap : {
                            ...params
                        }, //配置项，每种数据类型都有各自的基础配置信息
                        name : values.databaseName, //数据源名称
                        remarks : values.remarks, //描述信息
                        id:id,
                        type:dataSourceDetail.type

                    };
                    new Promise((resolve, reject) => {
                        //更新数据源信息
                        dispatch({
                            type: 'metadataManage/updateDataSourceConfigAction',
                            sendParams,
                            resolve,
                            reject,
                        });
                    }).then(response => {
                        if(response.result === 'true'){
                            T.prompt.success(response.data);
                            //关闭弹窗
                            dispatch({
                                type: 'metadataManage/changeDataResourceModalVisibleAction',
                                htmlType:'dataSourceManagement',
                                modalVisible: false,
                            });
                            //重置表单
                            self.resetForm();
                            //重新获取数据源列表
                            dispatch({
                                type: 'metadataManage/getDataSourceManagementListAction',
                                params: {
                                    page: EnumDataSyncPageInfo.defaultPage,
                                    pageSize: EnumDataSyncPageInfo.defaultPageSize,
                                },
                            });
                        }else {
                            T.prompt.error(response.message)
                        }
                    })

                }
            }
        })
    };

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };

    //关闭弹窗
    closeAddMetadataModel = () =>{
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/changeDataResourceModalVisibleAction',
            htmlType:'dataSourceManagement',
            modalVisible: false,
        });

        //重置表单
        this.resetForm();
    };

    //（队列、文件、数据库）根据不同的队列和文件显示不同的注册表
    renderConfigContent = (dataSourceDetail) => {
        const {formItemLayout,submitFormLayout} = this.state;
        const {
            savingStatus,
            testStatus,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {metadataType} = this.state;
        const {type,config,remarks,} = dataSourceDetail;
        //数据源
        switch (type) {
            //队列-ftp数据源1152064551561629696
            case 'FTP':
                return (
                    <div>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}>
                            {getFieldDecorator('serverAddress', {
                                initialValue:config ? config['ftp.server']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.syncConfigDataOriginModal.serverAddress.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.serverAddress.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}>
                            {getFieldDecorator('port', {
                                initialValue:config ? config['ftp.port']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.syncConfigDataOriginModal.port.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.port.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.username.label"/>}>
                            {getFieldDecorator('username', {
                                initialValue:config ? config['ftp.username']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.username.placeholder'}),
                                    },
                                ],
                            })(<Input autoComplete="off"
                                      placeholder={formatMessage({id: 'form.quickRegister.username.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.password.label"/>}>
                            {getFieldDecorator('password', {
                                initialValue:config ? config['ftp.password']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.password.placeholder'}),
                                    },
                                ],
                            })(<Input.Password autoComplete="new-password"
                                               placeholder={formatMessage({id: 'form.quickRegister.password.placeholder'})}/>)}
                        </FormItem>
                    </div>
                );
                break;
            //文件-kafka数据源1152064318895198208
            case 'Kafka':
                return (
                    <div>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}>
                            {getFieldDecorator('serverAddress', {
                                initialValue:config ? config['kafka.server']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.syncConfigDataOriginModal.serverAddress.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.serverAddress.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.kafka.register.label"/>}>
                            {getFieldDecorator('registry', {
                                initialValue:config ? config['kafka.schema.registry']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.syncConfigDataOriginModal.kafka.register.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.kafka.register.placeholder'})}/>)}
                        </FormItem>
                    </div>
                );
                break;
            //rabbitmq数据源1182096720551337984
            case 'RabbitMQ':
                return (
                    <div>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}>
                            {getFieldDecorator('serverAddress', {
                                initialValue:config ? config['rabbitmq.host']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.syncConfigDataOriginModal.serverAddress.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.serverAddress.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.port.label"/>}>
                            {getFieldDecorator('port', {
                                initialValue:config ? config['rabbitmq.port']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.syncConfigDataOriginModal.port.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.port.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.username.label"/>}>
                            {getFieldDecorator('username', {
                                initialValue:config ? config['rabbitmq.username']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.username.placeholder'}),
                                    },
                                ],
                            })(<Input autoComplete="off"
                                      placeholder={formatMessage({id: 'form.quickRegister.username.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.password.label"/>}>
                            {getFieldDecorator('password', {
                                initialValue:config ? config['rabbitmq.password']:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.password.placeholder'}),
                                    },
                                ],
                            })(<Input.Password autoComplete="new-password"
                                               placeholder={formatMessage({id: 'form.quickRegister.password.placeholder'})}/>)}
                        </FormItem>
                    </div>
                );
                break;
            //数据库-其他数据源
            default:
                return (
                    <div>
                        {/*<FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.name.label"/>}>
                            {getFieldDecorator('databaseName', {
                                initialValue:dataSourceDetail ? dataSourceDetail.name:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.name.placeholder'}),
                                    },
                                ],
                            })(<Input
                                autoComplete="off"
                                placeholder={formatMessage({id: 'form.quickRegister.name.placeholder'})}/>)}
                        </FormItem>*/}
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.url.label"/>}>
                            {getFieldDecorator('url', {
                                initialValue:config ? config.url:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.url.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.quickRegister.url.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.username.label"/>}>
                            {getFieldDecorator('username', {
                                initialValue:config ? config.userName:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.username.placeholder'}),
                                    },
                                ],
                            })(<Input autoComplete="off"
                                      placeholder={formatMessage({id: 'form.quickRegister.username.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.password.label"/>}>
                            {getFieldDecorator('password', {
                                initialValue:config ? config.password:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.password.placeholder'}),
                                    },
                                ],
                            })(<Input.Password autoComplete="new-password"
                                               placeholder={formatMessage({id: 'form.quickRegister.password.placeholder'})}/>)}
                        </FormItem>
                    </div>
                );
                break;
        }
    };

    render() {
        const {
            metadataManage,
            dataSourceDetail,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {type,config,remarks} = dataSourceDetail;
        const {dataSourceDetailModalVisible} = metadataManage;
        const {formItemLayout,submitFormLayout} = this.state;
        return (
            <Modal
                title="编辑数据源"
                visible={dataSourceDetailModalVisible}
                footer={null}
                onCancel={this.closeAddMetadataModel}
                centered={true}
                className={styles.dataResourceModal}
            >
                <div>
                    <Form onSubmit={this.onSubmitData} hideRequiredMark>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.name.label"/>}>
                            {getFieldDecorator('databaseName', {
                                initialValue:dataSourceDetail ? dataSourceDetail.name:'',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.name.placeholder'}),
                                    },
                                ],
                            })(<Input
                                autoComplete="off"
                                placeholder={formatMessage({id: 'form.quickRegister.name.placeholder'})}/>)}
                        </FormItem>
                        {this.renderConfigContent(dataSourceDetail)}
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.remarks.label"/>}>
                            {getFieldDecorator('remarks', {
                                initialValue:remarks ? remarks:'',
                                rules: [
                                    {
                                        // required: true,
                                        message: formatMessage({id: 'form.quickRegister.remarks.placeholder'}),
                                    },
                                ],
                            })(<TextArea autoSize={4} placeholder={formatMessage({id: 'form.quickRegister.remarks.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{marginTop: 24,textAlign:'center'}}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                // loading={submitLoading}
                            >
                                <FormattedMessage id="metadataManage.btn.save"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                onClick={this.closeAddMetadataModel}
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
export default SyncAddMetadataModal;
