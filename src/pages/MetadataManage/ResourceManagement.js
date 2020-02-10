import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import T from './../../utils/T';
import router from 'umi/router';
import {
    EnumQuickRegisterParams,
} from './../../constants/dataSync/EnumSyncConfigModal';
import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import {EnumDataSourceStatus} from './../../constants/dataSync/EnumSyncCommon';
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
    Table,
    Divider,
    Popconfirm,
    TreeSelect,
    Collapse,
} from 'antd';

const {TreeNode, DirectoryTree} = Tree;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;
const {Panel} = Collapse;

import styles from './ResourceManagement.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录

/* eslint react/no-multi-comp:0 */
@connect(({metadataManage, loading}) => ({
    metadataManage,
    loading: loading.models.metadataManageList,
    fetchTreeStatus: loading.effects['metadataManage/getDataResourceTreeAction'],
}))
@Form.create()
class ResourceManagement extends PureComponent {
    cacheOriginData = {};
    state = {
        currentPage: EnumDataSyncPageInfo.defaultPage,//分页
        selectRows: [], //选择的数据列
        selectedKey:'',//树节点默认选中的值
    };

    componentDidMount() {
        const {dispatch,location} = this.props;
        //判断是不是从详情页跳转的
        if(location.hasOwnProperty('params')&&location['params'].hasOwnProperty('name')&&location['params']['name']){
            this.props.form.setFieldsValue({
                resourceName: location['params']['name']
            });
        }
        //默认获取数据资源树接口
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/getDataResourceTreeAction',
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                //获取数据源列表
                this.fetchDataList();
            } else {
                T.prompt.error(response.message);
            }
        });
    }

    //获取当前页数数据
    fetchDataList = () => {
        const {dispatch, form, metadataManage} = this.props;
        const {dataSourceTypeTreeOldData} = metadataManage;
        const {currentPage} = this.state;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //数据资源分类
                let categoryCode = '';
                dataSourceTypeTreeOldData.map(val => {
                    if (values.resourceType === val.name) {
                        categoryCode = val.id;
                    }
                });
                dispatch({
                    type: 'metadataManage/getDataResourceManagementListAction',
                    params: {
                        page: currentPage,
                        pageSize: EnumDataSyncPageInfo.defaultPageSize,
                        "dataSourceId": T.lodash.isUndefined(values.dataSourceName) ? '' : values.dataSourceName, //数据源ID 非必填
                        "categoryCode": categoryCode, //数据资源分类 非必填
                        "code": T.lodash.isUndefined(values.resourceCode) ? '' : values.resourceCode, //资源编码 非必填
                        "name": T.lodash.isUndefined(values.resourceName) ? '' : values.resourceName, //资源名称 非必填
                        "status": T.lodash.isUndefined(values.status) ? '' : values.status, //资源名称 非必填
                    },
                });
            }
        });

    };

    //重置表单
    resetDataSource = () => {
        this.props.form.resetFields();
        this.setState({
            selectedKey:''
        });
        this.fetchDataList();
    };

    //树选择
    onSelect = (keys, event) => {
        //点击选中事件，属性可以打印查看
        const eventData = event.node.props;
        this.props.form.setFieldsValue({
            resourceType: eventData.name
        });
        this.setState({
            selectedKey:keys[0]
        });
        this.fetchDataList();
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

    //渲染select树节点
    renderSelectTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeSelect.TreeNode {...item} dataRef={item} title={item.name} value={item.name} key={item.id}>
                        {this.renderSelectTreeNodes(item.children)}
                    </TreeSelect.TreeNode>
                );
            }
            return <TreeSelect.TreeNode {...item} dataRef={item} title={item.name} value={item.name} key={item.id}
                                        isLeaf/>;
        });
    };

    //注册资源
    quickRegister = () => {
        const {dispatch} = this.props;
        //更改编辑状态
        dispatch({
            type: "metadataManage/changeResourceEditAction",
            dataResourceManageEdit: false,
        });
        //判断页面跳转路径
        dispatch({
            type: 'metadataManage/changeMetadataManageHtmlTypeAction',
            metadataManageHtmlType:'resourceManagement',
        });
        //路由跳转
        router.push({
            pathname: '/metadataManage/resourceManagement/resourceRegister',
            params: {
                isRouterPush: true,
            },
        });
    };

    //操作--编辑
    toggleEditable = (e, key) => {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch({
            type: 'metadataManage/changeResourceEditAction',
            dataResourceManageEdit: true
        });
        //设置编辑的内容
        dispatch({
            type: 'metadataManage/changeDataResourceManageEditInfoAction',
            dataResourceManageEditInfo: key
        });
        //判断页面跳转路径
        dispatch({
            type: 'metadataManage/changeMetadataManageHtmlTypeAction',
            metadataManageHtmlType:'resourceManagement',
        });
        //路由跳转
        router.push({
            pathname: '/metadataManage/resourceManagement/resourceRegister',
            params: {
                isRouterPush: true,
            },
        });
    };

    getDataManageTableByUrl = () => {

    };

    //查询数据源
    searchDataSource = (e) => {
        const {dispatch, form} = this.props;
        e.preventDefault();
        this.setState({
            currentPage: EnumDataSyncPageInfo.defaultPage,
        }, () => {
            this.fetchDataList();
        });
        // this.fetchDataList();
    };

    //页码变换
    pageChange = page => {
        this.setState({
            currentPage: page,
        }, () => {
            this.fetchDataList();
        });
    };

    //移除多个
    removeAll = () => {
        const {selectRows} = this.state;
        if (selectRows.length > 0) {
            let ids = selectRows.map(val => {
                return val.id
            });
            let key = ids.join(',');
            this.removeData(key);
        } else {
            T.prompt.error("请选择需要删除的行");
        }
    };

    //删除功能
    removeData = (key) => {
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/deleteDataResourceAction',
                id: key,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                T.prompt.success(response.data);
                this.fetchDataList();
            }else {
                T.prompt.error(response.message);
            }
        });
    };

    //查看元数据
    showMetadataManage = (e, key) => {
        router.push({
            pathname: '/metadataManage/metadataManageConfig/info',
            params: {
                isRouterPush: true,
                key: key
            },
        });
    };

    //树选择
    // onTreeChange = (e) => {
    //     // console.log(e,'sssss');
    // };
    onTreeChange = (e,node) => {
        this.setState({
            selectedKey : node.props.id,
        });
    };
    //查询-数据库类型 渲染下拉选项
    renderSelectOption = (selectDataSource)=> {
            let arrKeys = T.lodash.keys(selectDataSource);
            return (
                arrKeys.map(item => {
                    return (
                        <Option key={item} value={item}>
                            {EnumDataSourceStatus[item]["label"]}
                        </Option>
                    )
                })
            )

    };

    render() {
        const {
            fetchTreeStatus,
            savingStatus,
            testStatus,
            metadataManage,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {metadataManageList, dataResourceLists, dataResourceTypeTreeList, dataSourceTypeTreeOldData} = metadataManage;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: '资源名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '资源类型',
                dataIndex: 'resourceType',
                key: 'resourceType',
            },
            {
                title: '数据源',
                dataIndex: 'dataSourceName',
                key: 'dataSourceName',
            },
            {
                title: '创建人',
                dataIndex: 'createBy',
                key: 'createBy',
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
            },
            {
                title: '状态',
                dataIndex: 'dataSourceStatus',
                key: 'dataSourceStatus',
            },
            {
                title: '操作',
                key: 'action',
                // width: '15%',
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={e => this.toggleEditable(e, record)}>编辑</a>
                            <Divider type="vertical"/>
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeData(record.id)}>
                                <a>删除</a>
                            </Popconfirm>
                            <Divider type="vertical"/>
                            <a onClick={e => this.showMetadataManage(e, record)}>查看元数据</a>
                        </span>
                    );
                },
            }

        ];
        const rowSelection = {
            //多选所选择的key值
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectRows: selectedRows
                })
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        const {currentPage,selectedKey} = this.state;
        return (
            <PageHeaderWrapper title="资源管理">
                <Row gutter={24}>
                    <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                        <Card
                            title="资源目录"
                            bordered={false}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            {
                                fetchTreeStatus ? <Spin/> :
                                    <DirectoryTree
                                        multiple
                                        defaultExpandAll={true}
                                        onSelect={this.onSelect.bind(this)}
                                        selectedKeys = {[selectedKey]}
                                    >
                                        {this.renderTreeNodes(dataResourceTypeTreeList)}
                                    </DirectoryTree>
                            }
                        </Card>
                    </Col>
                    <Col xl={19} lg={19} md={19} sm={24} xs={24} className={styles.dataSourceTableList}>
                        <Row className={styles.dataSourceTitle}>
                            <Col span={24} className={styles.dataSourceBtns}>
                                <Button type="primary" onClick={this.quickRegister}>
                                    {/*<span>注册资源</span>*/}
                                    <FormattedMessage id="metadataManage.btn.register"/>
                                </Button>
                                <Popconfirm title="是否要删除选中行？" onConfirm={this.removeAll}>
                                    <Button type="danger">
                                        <FormattedMessage id="metadataManage.btn.delete"/>
                                    </Button>
                                </Popconfirm>
                            </Col>
                        </Row>
                        <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`}>
                            <Form layout="inline" onSubmit={this.searchDataSource}>
                                <Col xl={4} lg={8} md={8} sm={8} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="metadataManage.resourceManagement.resourceSearchForm.resourceName.label"/>}
                                    >

                                        {getFieldDecorator('resourceName', {
                                            rules: [
                                                {
                                                    message: formatMessage({
                                                        id: 'metadataManage.resourceManagement.resourceSearchForm.resourceName.placeholder',
                                                    }),
                                                },
                                            ],
                                        })(
                                            <Input
                                                autoComplete="off"
                                                placeholder={formatMessage({
                                                    id: 'metadataManage.resourceManagement.resourceSearchForm.resourceName.placeholder',
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={4} lg={8} md={8} sm={8} xs={24} style={{textAlign: 'left'}}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="metadataManage.resourceManagement.resourceSearchForm.resourceType.label"/>}
                                    >
                                        {getFieldDecorator('resourceType', {})(
                                            <TreeSelect
                                                showSearch
                                                // style={{ width: 300 }}
                                                // value={this.state.value}
                                                placeholder={formatMessage({
                                                    id: 'metadataManage.resourceManagement.resourceSearchForm.resourceType.placeholder',
                                                })}
                                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                                allowClear
                                                treeDefaultExpandAll
                                                // onChange={this.onTreeChange.bind(this)}
                                                onSelect={this.onTreeChange.bind(this)}
                                            >
                                                {this.renderSelectTreeNodes(dataResourceTypeTreeList)}
                                            </TreeSelect>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={4} lg={8} md={8} sm={8} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="metadataManage.resourceManagement.resourceSearchForm.resourceCode.label"/>}
                                    >

                                        {getFieldDecorator('resourceCode', {
                                            rules: [
                                                {
                                                    message: formatMessage({
                                                        id: 'metadataManage.resourceManagement.resourceSearchForm.resourceCode.placeholder',
                                                    }),
                                                },
                                            ],
                                        })(
                                            <Input
                                                autoComplete="off"
                                                placeholder={formatMessage({
                                                    id: 'metadataManage.resourceManagement.resourceSearchForm.resourceCode.placeholder',
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={4} lg={8} md={8} sm={8} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="metadataManage.dataSourceManagement.dataSourceSearchForm.dataSourceName.label"/>}
                                    >
                                        {getFieldDecorator('dataSourceName', {})(
                                            <Input
                                                autoComplete="off"
                                                placeholder={formatMessage({
                                                    id: 'metadataManage.dataSourceManagement.dataSourceSearchForm.dataSourceName.placeholder',
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={4} lg={8} md={8} sm={8} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="metadataManage.dataSourceManagement.dataSourceSearchForm.status.label"/>}
                                    >

                                        {getFieldDecorator('status', {
                                            initialValue: '0'
                                        })(
                                            <Select onSelect={this.getDataManageTableByUrl.bind(this)}
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                            >
                                                {/*<Option value="ALL" key="ALL">
                                                    <FormattedMessage
                                                        id="metadataManage.dataSourceManagement.dataSourceSearchForm.status.option.ALL"/>
                                                </Option>
                                                <Option value="enable" key="enable">
                                                    <FormattedMessage
                                                        id="metadataManage.dataSourceManagement.dataSourceSearchForm.status.option.enable"/>
                                                </Option>
                                                <Option value="disable" key="disable">
                                                    <FormattedMessage
                                                        id="metadataManage.dataSourceManagement.dataSourceSearchForm.status.option.disable"/>
                                                </Option>*/}
                                                {this.renderSelectOption(EnumDataSourceStatus)}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={4} lg={8} md={8} sm={8} xs={24} style={{textAlign: 'right'}}>
                                    <Form.Item className={styles.searchBtnWrapper}>
                                        <Button htmlType="submit" style={{marginRight: 10}}>
                                            <FormattedMessage id="metadataManage.btn.search"/>
                                        </Button>
                                        <Button onClick={this.resetDataSource} type="primary">
                                            <FormattedMessage id="metadataManage.btn.reset"/>
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Form>
                        </Row>
                        <Row>
                            <Card bordered={false}>
                                <Table
                                    columns={columns}
                                    dataSource={dataResourceLists}
                                    rowSelection={rowSelection}
                                    pagination={{
                                        current: currentPage,
                                        onChange: this.pageChange,
                                        pageSize: EnumDataSyncPageInfo.defaultPageSize,
                                        // total: sourceProcessorsList.hasOwnProperty('total') ? Number(sourceProcessorsList.total) + 1 : 0,
                                    }}
                                    // rowClassName={record => (record.editable ? styles.editable : '')}
                                />
                            </Card>
                        </Row>

                    </Col>
                </Row>
            </PageHeaderWrapper>
        );
    }
}


export default ResourceManagement;
