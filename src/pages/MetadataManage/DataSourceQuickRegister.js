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
    Spin,
    Empty,
} from 'antd';

const {TreeNode, DirectoryTree} = Tree;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;

import styles from './DataSourceQuickRegister.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';


/* eslint react/no-multi-comp:0 */
@connect(({metadataManage, loading}) => ({
    metadataManage,
    loading: loading.models.metadataManageList,
    fetchTreeStatus: loading.effects['metadataManage/getDataSourceTypeTreeAction'],
    savingStatus: loading.effects['metadataManage/saveQuickRegisterAction'],
    testStatus: loading.effects['metadataManage/testQuickRegisterAction'],
}))
@Form.create()
class DataSourceQuickRegister extends PureComponent {
    state = {
        metadataType: {   //存储选择的数据源信息
            children: [],
            title: ""
        },
    };

    componentDidMount() {
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/getDataSourceTypeTreeAction',
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {

            } else {
                T.prompt.error(response.message);
            }
        });

    }

    //提交功能（全部）
    handleSubmit = e => {
        const {dispatch, form} = this.props;
        const {metadataType} = this.state;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let valueArr = T.lodash.keys(values);
                if (metadataType && !metadataType.hasOwnProperty('children')) {
                    // const name = metadataType.title;
                    const id = metadataType.id;
                    const info = T.auth.getLoginInfo();
                    let className = '';
                    let params = {};
                    switch (id) {
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
                        default:break;
                    }
                    let sendParams = {
                        configMap : {
                            ...params
                        }, //配置项，每种数据类型都有各自的基础配置信息
                        type : id, //数据源类型
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
                    // console.log('sendParams',sendParams);

                    dispatch({
                        type: 'metadataManage/saveQuickRegisterAction',
                        sendParams,
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
    /*testLinks = () => {
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
    };*/

    //测试连接(全部)（暂时不用）
    testLinks=()=>{

    };

    /**
     * 树选择
     * @param keys 选择的key值
     * @param event 树节点
     */
    onSelect = (keys, event) => {
        if(event.node.props.hasOwnProperty('dataRef')){
            const {metadataType} = this.state;
            //点击选中事件，属性可以打印查看
            const eventData = event.node.props;
            this.setState({
                metadataType: event.node.props.dataRef
            });
            //不是当前的就清空表单
            if (eventData.hasOwnProperty("title") && eventData.title !== metadataType.title) {
                this.props.form.resetFields();
            }
        }

    };

    //渲染树节点
    renderTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode {...item} dataRef={item} title={item.name} key={item.id}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} title={item.name} key={item.id} isLeaf/>;
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
        const {id} = metadataType;
        //数据源
        switch (id) {
            //队列-ftp数据源
            case 'FTP':
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
            //文件-kafka数据源
            case 'Kafka':
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
            //rabbitmq数据源
            case 'RabbitMQ':
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
            //MySQL
            case 'MySQL':
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
            //数据库-其他数据源
            default:
                return (
                    <div
                        className={styles.quickRegisterModal}
                    >
                        <Row
                            className={styles.subTitle}
                        >
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无该配置" style={{paddingBottom:150,paddingTop:150}}/>
                        </Row>
                    </div>
                );
                break;
        }
    };


    render() {
        const {
            fetchTreeStatus,
            metadataManage,
        } = this.props;
        const {dataSourceTypeTreeList} = metadataManage;
        const {metadataType} = this.state;
        const breadcrumb = [
            {
                linkTo: '/dashboard',
                name: '首页',
            },
            {
                name: '元数据管理',
            },
            {
                linkTo: '/metadataManage/dataSourceManagement/info',
                name: '数据源管理',
            },
            {
                name: '快速注册',
            },
        ];
        return (
            <PageHeaderWrapper
                breadcrumbName={<CustomBreadcrumb dataSource={breadcrumb}/>}
                title="快速注册"
                isSpecialBreadcrumb={true}
                // specialRoutes={{routes}}
            >
                <Row gutter={24}>
                    <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                        <Card
                            title="数据源类型"
                            bordered={false}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            {
                                fetchTreeStatus ? <Spin/> :
                                    <DirectoryTree multiple defaultExpandAll={true} onSelect={this.onSelect}>
                                        {this.renderTreeNodes(dataSourceTypeTreeList)}
                                    </DirectoryTree>
                            }
                        </Card>
                    </Col>
                    {
                        !metadataType.hasOwnProperty("children") && <Col xl={19} lg={19} md={19} sm={24} xs={24}>
                                {this.renderConfigContent()}
                        </Col>
                    }

                </Row>
            </PageHeaderWrapper>
        );
    }
}


export default DataSourceQuickRegister;
