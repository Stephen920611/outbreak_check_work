import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import styles from './SyncAddDataSourceModal.less';
import T from './../../utils/T';
import {
    EnumQuickRegisterParams,
} from './../../constants/dataSync/EnumSyncConfigModal';
import {
    Form,
    Modal,
    Input,
    Button,
} from 'antd';
const FormItem = Form.Item;
const {TextArea} = Input;

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    savingStatus: loading.effects['dataSyncNewMission/saveQuickRegisterAction'],
    testStatus: loading.effects['metadataManage/testQuickRegisterAction'],
}))
@Form.create()
class SyncAddDataSourceModal extends PureComponent {
    state = {};

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };

    //关闭弹窗
    closeAddFieldModel = () =>{
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/changeDataSourceModalVisibleAction',
            dataSourceModalVisible: false,
        });
        //重置表单
        this.resetForm();
    };

    //提交功能（全部）
    handleSubmitDataSource = e => {
        const {dispatch, form,dataSyncNewMission} = this.props;
        const {currentDataInfo} = dataSyncNewMission;
        let self = this;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let valueArr = T.lodash.keys(values);
                if (currentDataInfo && currentDataInfo.hasOwnProperty('typeName')) {
                    const info = T.auth.getLoginInfo();
                    const name = currentDataInfo.hasOwnProperty('typeName') ? currentDataInfo.typeName : 'FTP';
                    let className = '';
                    let params = {};
                    switch (name) {
                        //kafka 输出
                        case 'Kafka':
                            className = 'kafka';
                            valueArr.map(val => {
                                if(val !=='databaseName'){
                                    params[EnumQuickRegisterParams[className][val]['mapTo']] = values[val];
                                }

                            });
                            break;
                        //rabbitmq
                        case 'RabbitMQ':
                            className = 'rabbitmq';
                            valueArr.map(val => {
                                if(val !=='databaseName'){
                                    params[EnumQuickRegisterParams[className][val]['mapTo']] = values[val];
                                }

                            });
                            break;
                        //ftp
                        case 'FTP':
                            className = 'ftp';
                            valueArr.map(val => {
                                if(val !== 'databaseName'){
                                    params[EnumQuickRegisterParams[className][val]['mapTo']] = values[val];
                                }

                            });
                            break;
                        default:
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
                    };
                    let sendParams = {
                        configMap : {
                            ...params
                        }, //配置项，每种数据类型都有各自的基础配置信息
                        type : name, //数据源类型
                        name : values.databaseName, //数据源名称
                        remarks : values.remarks, //描述信息
                        createBy: "",
                        createByName: "",
                        createDate: "",
                        createDate_between: "",
                        createDate_gte: "",
                        createDate_lte: "",
                        id: "",
                        id_in: [],
                        isNewRecord: true,
                        lastUpdateDateTime: 0,
                        orderBy: "",
                        pageNo: 0,
                        pageSize: 0,
                        status: "",
                        status_in: [],
                        updateBy: "",
                        updateByName: "",
                        updateDate: "",
                        updateDate_between: "",
                        updateDate_gte: "",
                        updateDate_lte: ""
                    };
                    //保存数据源
                    new Promise((resolve,reject)=>{
                        dispatch({
                            // type: T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? 'dataSyncNewMission/saveQuickRegisterAction' : 'dataSyncNewMission/saveQuickRegisterDestinationAction',
                            type: 'dataSyncNewMission/saveQuickRegisterAction',
                            sendParams,
                            resolve,
                            reject,
                        });

                    }).then(response => {
                        //提示信息
                        if (response.result === 'true') {
                            let id = response.data;
                            // console.log('response.data',response.data);
                            T.prompt.success(response.data);
                            //重新获取数据源的列表
                            new Promise((resolve, reject) => {
                                dispatch({
                                    // type: T.storage.getStorage('HtmlType').modalType === 'dataOrigin' ? 'dataSyncNewMission/getDataSourceListAction' : 'dataSyncNewMission/getDataSourceListDestinationAction',
                                    type: 'dataSyncNewMission/getDataSourceListAction',
                                    params:{
                                        type:name
                                    },
                                    resolve,
                                    reject,
                                });
                            }).then(response => {
                                if (response.result === 'true') {
                                    //新建成功后，设置数据源为默认
                                    // console.log('response.data',response.data);
                                    // self.props.form.setFieldsValue('databaseInfoId',response.data);
                                    //关闭弹窗
                                    dispatch({
                                        type: 'dataSyncNewMission/changeDataSourceModalVisibleAction',
                                        dataSourceModalVisible: false,
                                    });
                                }
                            });

                        } else {
                            T.prompt.error(response.message)
                        }
                    })
                }

            }
        });
    };

    //测试连接(全部)（暂时不用）
    testLinks=()=>{

    };

    //（队列、文件、数据库）根据不同的队列和文件显示不同的注册表
    renderConfigContent = () => {
        const formItemLayout ={
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 15},
                md: {span: 15},
            },
        };
        const submitFormLayout ={
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 24, offset: 0},
            },
        };
        const {
            savingStatus,
            testStatus,
            dataSyncNewMission,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {currentDataInfo} = dataSyncNewMission;
        const name = currentDataInfo.hasOwnProperty('typeName') ? currentDataInfo.typeName : 'FTP';
        //数据源
        switch (name) {
            //队列-ftp数据源
            case 'FTP':
                return (
                    <Form
                        onSubmit={this.handleSubmitDataSource}
                        hideRequiredMark
                        className={styles.quickRegisterModal}
                    >
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.name.label"/>}>
                            {getFieldDecorator('databaseName', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.name.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.quickRegister.name.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}>
                            {getFieldDecorator('serverAddress', {
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
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.password.placeholder'}),
                                    },
                                ],
                            })(<Input.Password autoComplete="new-password"
                                               placeholder={formatMessage({id: 'form.quickRegister.password.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.remarks.label"/>}>
                            {getFieldDecorator('remarks', {
                                rules: [
                                    {
                                        required: false,
                                        message: formatMessage({id: 'form.quickRegister.remarks.placeholder'}),
                                    },
                                ],
                            })(<TextArea rows={4} placeholder={formatMessage({id: 'form.quickRegister.remarks.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24, textAlign:'center'}}>
                            <Button
                                type="primary"
                                onClick={this.testLinks}
                                loading={testStatus}
                            >
                                <FormattedMessage id="form.test-link"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                htmlType="submit"
                                loading={savingStatus}
                            >
                                <FormattedMessage id="form.submit"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                onClick={this.resetForm}
                            >
                                <FormattedMessage id="form.reset"/>
                            </Button>
                        </FormItem>
                    </Form>
                );
                break;
            //文件-kafka数据源
            case 'Kafka':
                return (
                    <Form
                        onSubmit={this.handleSubmitDataSource}
                        hideRequiredMark
                        className={styles.quickRegisterModal}
                    >
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.name.label"/>}>
                            {getFieldDecorator('databaseName', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.name.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.quickRegister.name.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}>
                            {getFieldDecorator('serverAddress', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.syncConfigDataOriginModal.serverAddress.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.serverAddress.placeholder'})}/>)}
                        </FormItem>
                        {/*<FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.kafka.register.label"/>}>
                            {getFieldDecorator('registry', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.syncConfigDataOriginModal.kafka.register.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.syncConfigDataOriginModal.kafka.register.placeholder'})}/>)}
                        </FormItem>*/}
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.remarks.label"/>}>
                            {getFieldDecorator('remarks', {
                                rules: [
                                    {
                                        required: false,
                                        message: formatMessage({id: 'form.quickRegister.remarks.placeholder'}),
                                    },
                                ],
                            })(<TextArea rows={4} placeholder={formatMessage({id: 'form.quickRegister.remarks.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24, textAlign:'center'}}>
                            <Button
                                type="primary"
                                onClick={this.testLinks}
                                loading={testStatus}
                            >
                                <FormattedMessage id="form.test-link"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                htmlType="submit"
                                loading={savingStatus}
                            >
                                <FormattedMessage id="form.submit"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                onClick={this.resetForm}
                            >
                                <FormattedMessage id="form.reset"/>
                            </Button>
                        </FormItem>
                    </Form>
                );
                break;
            //rabbitmq数据源
            case 'RabbitMQ':
                return (
                    <Form
                        onSubmit={this.handleSubmitDataSource}
                        hideRequiredMark
                        className={styles.quickRegisterModal}
                    >
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.name.label"/>}>
                            {getFieldDecorator('databaseName', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.name.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.quickRegister.name.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.syncConfigDataOriginModal.serverAddress.label"/>}>
                            {getFieldDecorator('serverAddress', {
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
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.password.placeholder'}),
                                    },
                                ],
                            })(<Input.Password autoComplete="new-password"
                                               placeholder={formatMessage({id: 'form.quickRegister.password.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.remarks.label"/>}>
                            {getFieldDecorator('remarks', {
                                rules: [
                                    {
                                        required: false,
                                        message: formatMessage({id: 'form.quickRegister.remarks.placeholder'}),
                                    },
                                ],
                            })(<TextArea rows={4} placeholder={formatMessage({id: 'form.quickRegister.remarks.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24,textAlign:'center'}}>
                            <Button
                                type="primary"
                                onClick={this.testLinks}
                                loading={testStatus}
                            >
                                <FormattedMessage id="form.test-link"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                htmlType="submit"
                                loading={savingStatus}
                            >
                                <FormattedMessage id="form.submit"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                onClick={this.resetForm}
                            >
                                <FormattedMessage id="form.reset"/>
                            </Button>
                        </FormItem>
                    </Form>
                );
                break;
            //数据库-其他数据源
            default:
                return (
                    <Form
                        onSubmit={this.handleSubmitDataSource}
                        hideRequiredMark
                        className={styles.quickRegisterModal}
                    >
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.name.label"/>}>
                            {getFieldDecorator('databaseName', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.name.placeholder'}),
                                    },
                                ],
                            })(<Input
                                placeholder={formatMessage({id: 'form.quickRegister.name.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.url.label"/>}>
                            {getFieldDecorator('url', {
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
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'form.quickRegister.password.placeholder'}),
                                    },
                                ],
                            })(<Input.Password autoComplete="new-password"
                                               placeholder={formatMessage({id: 'form.quickRegister.password.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.remarks.label"/>}>
                            {getFieldDecorator('remarks', {
                                rules: [
                                    {
                                        required: false,
                                        message: formatMessage({id: 'form.quickRegister.remarks.placeholder'}),
                                    },
                                ],
                            })(<TextArea rows={4} placeholder={formatMessage({id: 'form.quickRegister.remarks.placeholder'})}/>)}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24, textAlign:'center'}}>
                            <Button
                                type="primary"
                                onClick={this.testLinks}
                                loading={testStatus}
                            >
                                <FormattedMessage id="form.test-link"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                htmlType="submit"
                                loading={savingStatus}
                            >
                                <FormattedMessage id="form.submit"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                onClick={this.resetForm}
                            >
                                <FormattedMessage id="form.reset"/>
                            </Button>
                        </FormItem>
                    </Form>
                );
                break;
        }
    };


    render() {
        const {
            dataSyncNewMission,
        } = this.props;
        const {dataSourceModalVisible} = dataSyncNewMission;
        return (
            <Modal
                title={<FormattedMessage id="form.syncConfigDataOriginModal.ftp.coding.option.create.label"/>}
                visible={dataSourceModalVisible}
                footer={null}
                onCancel={this.closeAddFieldModel}
                centered={true}
                className={styles.dataResourceModal}
            >
                <div>
                    {this.renderConfigContent()}
                </div>
            </Modal>
        );
    }
}
export default SyncAddDataSourceModal;
