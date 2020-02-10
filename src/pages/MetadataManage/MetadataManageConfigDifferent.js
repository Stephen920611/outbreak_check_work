import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import T from './../../utils/T';
import {
    EnumQuickRegisterParams,
} from './../../constants/dataSync/EnumSyncConfigModal';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Tooltip,
    InputNumber,
    DatePicker,
    Radio,
    Tree,
    Spin
} from 'antd';

const {TreeNode, DirectoryTree} = Tree;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;

import styles from './DataSourceQuickRegister.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录

/* eslint react/no-multi-comp:0 */
@connect(({metadataManage, loading}) => ({
    metadataManage,
    loading: loading.models.metadataManageList,
    fetchTreeStatus: loading.effects['metadataManage/getQuickRegisterTreeAction'],
    savingStatus: loading.effects['metadataManage/saveQuickRegisterAction'],
    testStatus: loading.effects['metadataManage/testQuickRegisterAction'],
}))
@Form.create()
class QuickRegister extends PureComponent {
    state = {
        metadataType: {   //存储选择的数据源信息
            children: [],
            title: ""
        },
    };

    componentDidMount() {
        const {dispatch} = this.props;
        //默认获取树接口
        dispatch({
            type: 'metadataManage/getQuickRegisterTreeAction',
        });
    }

    //提交功能（数据库）
    handleSubmit = e => {
        const {dispatch, form} = this.props;
        const {metadataType} = this.state;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (metadataType && !metadataType.hasOwnProperty('children')) {
                    const name = metadataType.title;
                    const id = metadataType.eventKey;
                    let params = {
                        databaseId: id,
                        databaseName: values.name,
                        userName: values.username,
                        password: values.password,
                        url: values.url,
                        type: values.connectType,
                    };
                    dispatch({
                        type: 'metadataManage/saveQuickRegisterAction',
                        params,
                    });
                }

            }
        });
    };

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };

    //测试链接(数据库)
    testLinks = () => {
        const {dispatch, form} = this.props;
        const {metadataType} = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (metadataType && !metadataType.hasOwnProperty('children')) {
                    const name = metadataType.title;
                    const id = metadataType.eventKey;
                    let params = {
                        databaseId: id,
                        databaseName: values.name,
                        userName: values.username,
                        password: values.password,
                        url: values.url,
                        type: values.connectType,
                    };
                    dispatch({
                        type: 'metadataManage/testQuickRegisterAction',
                        params,
                    });
                }
            }
        });
    };

    //提交功能（队列、文件）
    handleSubmitQueueAndFile = (e)=> {
        const {dispatch, form} = this.props;
        const {metadataType} = this.state;
        const {eventKey} = metadataType;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let valueArr = T.lodash.keys(values);
                let params = {};
                let className = '';
                switch(eventKey) {
                    //ftp数据源
                    case '9':
                        className = 'ftp';
                        break;
                    //kafka数据源
                    case '8':
                        className = 'kafka';
                        break;
                    //rabbitmq 数据源
                    // case '8':
                    //     className = 'rabbitmq';
                    //     break;

                }
                valueArr.map(val => {
                    params[EnumQuickRegisterParams[className][val]['mapTo']] = values[val];

                });
                let sendParams = {
                    // config: {
                    //     ...params
                    // },
                    config:JSON.stringify(params),
                    createBy: T.auth.getLoginInfo().user.loginCode,
                    createDate: "",
                    databaseId: eventKey,
                    databaseName: values.databaseName,
                    id: 0,
                    password: "",
                    remarks: "",
                    status: "",
                    type: "",
                    updateBy: "",
                    updateDate: "",
                    url: "",
                    userName: ""
                };
                dispatch({
                    type: 'metadataManage/saveRegisterQueueAndFileAction',
                    sendParams,
                });
            }
        });
    };

    //测试连接(队列or文件)（暂时不用）
    testLinksQueueAndFile=()=>{

    };


    //树选择
    onSelect = (keys, event) => {
        console.log(event.node.props,'eventKey');
        const {metadataType} = this.state;
        //点击选中事件，属性可以打印查看
        const eventData = event.node.props;
        this.setState({
            metadataType: eventData
        });
        //不是当前的就清空表单
        if (eventData.hasOwnProperty("title") && eventData.title !== metadataType.title) {
            this.props.form.resetFields();
        }
    };

    //渲染树节点
    renderTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode {...item} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} isLeaf/>;
        });
    };

    //（队列、文件、数据库）根据不同的队列和文件显示不同的注册表
    renderConfigContent = () => {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
                md: {span: 10},
            },
        };
        const submitFormLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 10, offset: 7},
            },
        };
        const {
            savingStatus,
            testStatus,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {metadataType} = this.state;
        const {eventKey} = metadataType;
        //数据源
        switch (eventKey) {
            //队列-ftp数据源
            case '9':
                return (
                    <Form
                        onSubmit={this.handleSubmitQueueAndFile}
                        hideRequiredMark
                        className={styles.quickRegisterModal}
                    >
                        <Row
                            className={styles.subTitle}
                        >
                            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                                连接设置
                            </Col>
                        </Row>
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
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24}}>
                            <Button
                                type="primary"
                                onClick={this.testLinksQueueAndFile}
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
            case '8':
                return (
                    <Form
                        onSubmit={this.handleSubmitQueueAndFile}
                        hideRequiredMark
                        className={styles.quickRegisterModal}
                    >
                        <Row
                            className={styles.subTitle}
                        >
                            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                                连接设置
                            </Col>
                        </Row>
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
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24}}>
                            <Button
                                type="primary"
                                onClick={this.testLinksQueueAndFile}
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
            /*case '8':
                return (
                    <Form
                        onSubmit={this.handleSubmitQueueAndFile}
                        hideRequiredMark
                        className={styles.quickRegisterModal}
                    >
                        <Row
                            className={styles.subTitle}
                        >
                            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                                连接设置
                            </Col>
                        </Row>
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
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24}}>
                            <Button
                                type="primary"
                                onClick={this.testLinksQueueAndFile}
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
                break;*/
            //数据库-其他数据源
            default:
                return (
                    <Form
                        onSubmit={this.handleSubmit}
                        hideRequiredMark
                        className={styles.quickRegisterModal}
                    >
                        <Row
                            className={styles.subTitle}
                        >
                            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                                数据源配置
                            </Col>
                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage id="form.quickRegister.connectType.label"/>}
                        >
                            <div>
                                {getFieldDecorator('connectType', {
                                    initialValue: 'JDBC',
                                })(
                                    <Radio.Group>
                                        <Radio value="JDBC">
                                            JDBC
                                        </Radio>
                                        <Radio value="other">
                                            其他
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </div>
                        </FormItem>
                        <Row
                            className={styles.subTitle}
                        >
                            <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                                连接设置
                            </Col>
                        </Row>
                        <FormItem {...formItemLayout}
                                  label={<FormattedMessage id="form.quickRegister.name.label"/>}>
                            {getFieldDecorator('name', {
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
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24}}>
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
            fetchTreeStatus,
            savingStatus,
            testStatus,
            metadataManage,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {metadataManageList} = metadataManage;

        const {metadataType} = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
                md: {span: 10},
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 10, offset: 7},
            },
        };
        return (
            <PageHeaderWrapper title="差异分析页">
                <Row gutter={24}>
                    <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                        <Card
                            title="差异分析"
                            bordered={false}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                        </Card>
                    </Col>

                </Row>
            </PageHeaderWrapper>
        );
    }
}


export default QuickRegister;
