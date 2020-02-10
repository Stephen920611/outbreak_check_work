import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import T from './../../utils/T';
import {EnumPluginListPageInfo} from './../../constants/EnumPageInfo';
import Link from 'umi/link';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Table,
    Badge,
    Divider,
    Steps,
    Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './PluginList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');
const statusMap = ['success', 'error'];
const status = ['正常', '停用'];

const CreateForm = Form.create()(props => {
    const { modalVisible, form, handleAdd, handleModalVisible } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            destroyOnClose
            title="新建规则"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                {form.getFieldDecorator('desc', {
                    rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
                })(<Input placeholder="请输入" />)}
            </FormItem>
        </Modal>
    );
});

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
    rule,
    loading: loading.models.rule,
}))
@Form.create()
class PluginList extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        tableList: [],
    };

    columns = [
        {
            title: '',
            dataIndex: 'id',
            render(val,item) {
                return <div>{val}</div>;
            },
        },
        {
            title: '插件名称',
            dataIndex: 'pluginName',
            sorter: true,
            render: text => <Link to={`/profile/basic/${text.replace(/\s+/gi, '-')}`}>{text}</Link>,
        },
        {
            title: '类名',
            dataIndex: 'typeName',
            sorter: true,
            render(val) {
                return <div className={styles.textOverflow} title={val}>{val}</div>;
            },
        },
        {
            title: '类型',
            dataIndex: 'pluginType',
            sorter: true,
        },
        {
            title: '版本',
            sorter: true,
            dataIndex: 'versions',
        },
        {
            title: '标签',
            sorter: true,
            dataIndex: 'label',
        },
        {
            title: '状态',
            dataIndex: 'status',
            filters: [
                {
                    text: status[0],
                    value: 0,
                },
                {
                    text: status[1],
                    value: 1,
                },
            ],
            render(val) {
                return <Badge status={statusMap[val]} text={status[val]} />;
            },
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: true,
            render: val => <span>{T.moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑插件</a>*/}
                    <a href="">编辑插件</a>
                    <Divider type="vertical" />
                    <a href="">删除插件</a>
                </Fragment>
            ),
        },
    ];

    componentDidMount() {
        const { dispatch } = this.props;

        let tableListDataSource = [];
        for (let i = 0; i < 46; i += 1) {
            tableListDataSource.push({
                key: i,
                href: 'https://ant.design',
                avatar: [
                    'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
                    'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
                ][i % 2],
                typeName: 'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
                pluginName: `TradeCode ${i}`,
                title: `一个任务名称 ${i}`,
                owner: '曲丽丽',
                desc: '这是一段描述',
                label: '这是标签',
                pluginType: '输入',
                versions: '1.2.1',
                callNo: Math.floor(Math.random() * 1000),
                status: Math.floor(Math.random() * 10) % 2,
                updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
                createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
                progress: Math.ceil(Math.random() * 100),
            });
        }
        this.setState({
            tableList: tableListDataSource
        })

    }

    //重置功能
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        // dispatch({
        //     type: 'rule/fetch',
        //     payload: {},
        // });
    };

    //查询功能
    handleSearch = e => {
        e.preventDefault();

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
                formValues: values,
            });

            // dispatch({
            //     type: 'rule/fetch',
            //     payload: values,
            // });
        });
    };

    //新建模态框显示
    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    handleAdd = fields => {
        const { dispatch } = this.props;
        // dispatch({
        //     type: 'rule/add',
        //     payload: {
        //         desc: fields.desc,
        //     },
        // });

        message.success('添加成功');
        this.handleModalVisible();
    };

    //行多选功能
    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };


    //表格页码切换功能
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const {dispatch} = this.props;
        const {formValues} = this.state;
        //
        // const filters = Object.keys(filtersArg).reduce((obj, key) => {
        //     const newObj = {...obj};
        //     newObj[key] = getValue(filtersArg[key]);
        //     return newObj;
        // }, {});
        //
        // const params = {
        //     currentPage: pagination.current,
        //     pageSize: pagination.pageSize,
        //     ...formValues,
        //     ...filters,
        // };
        // if (sorter.field) {
        //     params.sorter = `${sorter.field}_${sorter.order}`;
        // }

        // dispatch({
        //     type: 'rule/fetch',
        //     payload: params,
        // });
    };

    //渲染查询条件dom节点
    renderSearchForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={4} sm={24}>
                        <FormItem label="插件名称">
                            {getFieldDecorator('pluginName')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="类名">
                            {getFieldDecorator('typeName')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="插件类型">
                            {getFieldDecorator('pluginType')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">输入</Option>
                                    <Option value="1">输出</Option>
                                    <Option value="2">未知</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="标签">
                            {getFieldDecorator('labelName')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <FormItem label="状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">正常</Option>
                                    <Option value="1">停用</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <div style={{ marginBottom: 24 }}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const {
            loading,
        } = this.props;
        const {modalVisible, tableList, selectedRows } = this.state;

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };

        return (
            <PageHeaderWrapper title="插件管理">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                                注册新插件
                            </Button>
                        </div>
                        <StandardTable
                            data={{
                                list: tableList,
                                pagination: {
                                    total: tableList.length,
                                    pageSize: 10,
                                    current: 1,
                                },
                            }}
                            columns={this.columns}
                            selectedRows={selectedRows}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                {/*<CreateForm {...parentMethods} modalVisible={modalVisible} />*/}
                {/*{stepFormValues && Object.keys(stepFormValues).length ? (*/}
                    {/*<UpdateForm*/}
                        {/*{...updateMethods}*/}
                        {/*updateModalVisible={updateModalVisible}*/}
                        {/*values={stepFormValues}*/}
                    {/*/>*/}
                {/*) : null}*/}
            </PageHeaderWrapper>
        );
    }
}

export default PluginList;
