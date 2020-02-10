import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import T from './../../utils/T';
import router from 'umi/router';
import {
    EnumQuickRegisterParams,
} from './../../constants/dataSync/EnumSyncConfigModal';
import {EnumDataSyncPageInfo,EnumPluginListPageInfo} from './../../constants/EnumPageInfo';
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
} from 'antd';

const {TreeNode, DirectoryTree} = TreeSelect;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;

import SyncDataSourceDetailModal from './SyncDataSourceDetailModal';
import styles from './DataSourceManagement.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录

/* eslint react/no-multi-comp:0 */
@connect(({metadataManage, loading}) => ({
    metadataManage,
    loading: loading.models.metadataManageList,
    fetchDataSourceStatus: loading.effects['metadataManage/getDataSourceManagementListAction'],
    // savingStatus: loading.effects['metadataManage/saveQuickRegisterAction'],
    // testStatus: loading.effects['metadataManage/testQuickRegisterAction'],
}))
@Form.create()
class DataSourceManagement extends PureComponent {
    cacheOriginData = {};
    state = {
        currentPage: EnumPluginListPageInfo.defaultPage,//分页
        selectedRowKeys:[],//所选选中的key数组
        selectedRows:[],//多选选中的数组
        dataSourceDetail:{},//选中数据源的详细信息
        selectIdArray:'',//存储多选的id字符串
    };

    componentDidMount() {
        const {dispatch,location} = this.props;
        const {currentPage} = this.state;
        //判断是不是从详情页跳转的
        if(location.hasOwnProperty('params')&&location['params'].hasOwnProperty('name')&&location['params']['name']){
            this.props.form.setFieldsValue({
                dataSourceName: location['params']['name']
            });
        }
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/getDataSourceTypeTreeAction',
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                //获取数据源列表（分页）
                this.fetchDataList();
                //获取数据源列表（不分页）select框使用
               /* dispatch({
                    type: 'metadataManage/getDataSourceManagementSelectAction',
                });*/
            } else {
                T.prompt.error(response.message);
            }
        });

    }

    //快速注册数据源
    quickRegister = () => {
        router.push({
            pathname: '/metadataManage/dataSourceManagement/dataSourceQuickRegister',
            params: {
                isRouterPush: true,
            },
        });
    };

    //操作--注册资源
    resourceRegister = (e, data) => {
        const {dispatch} = this.props;
        //记录注册资源是从哪个界面跳转的
        dispatch({
            type: 'metadataManage/changeMetadataManageHtmlTypeAction',
            metadataManageHtmlType:'dataSourceManagement',
        });
        router.push({
            pathname: '/metadataManage/resourceManagement/resourceRegister',
            params: {
                isRouterPush: true,
                dataSourceInfo:data,//数据源的信息
            },
        });

    };

    //操作--编辑 显示模态框
    toggleEditable = (e, detail) => {
        e.preventDefault();
        const {dispatch} = this.props;
        this.setState({
            dataSourceDetail:detail
        },()=>{
            //弹出编辑弹窗
            dispatch({
                type: 'metadataManage/changeDataResourceModalVisibleAction',
                htmlType:'dataSourceManagement',
                modalVisible: true,
            });
            //重置表单
            this.resetForm();
        });

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

    //编辑 - 重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };


    //操作--删除(单个)
    remove = (data) => {
        console.log(data);
        let id = data.id;
        const {dispatch} = this.props;
        // dispatch({
        //     type: 'metadataManage/deleteDataSourceAction',
        //     id,
        // });
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/deleteDataSourceAction',
                id,
                resolve,
                reject,
            });
        }).then(response => {
            if(response.result === 'true'){
                T.prompt.success(response.data);
                this.fetchDataList();
            }else {
                T.prompt.error(response.message)
            }
        })


    };

    //操作--删除按钮(多选删除)
    removeMore =() =>{
        const {selectedRowKeys,selectedRows,selectIdArray} = this.state;
        let id = selectIdArray;
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/deleteDataSourceAction',
                id,
                resolve,
                reject,
            });
        }).then(response => {
            if(response.result === 'true'){
                T.prompt.success(response.data);
                this.fetchDataList();
            }else {
                T.prompt.error(response.message)
            }
        })

    };


    //查询数据源
    searchDataSource = (e) => {
        const {dispatch, form} = this.props;
        const {currentPage} = this.state;
        e.preventDefault();
        //查询分页从第一页开始
        this.setState({
            currentPage:EnumPluginListPageInfo.defaultPage
        },()=>{
            this.fetchDataList();
        });
    };

    //查询重置按钮
    resetDataSource = () => {
        this.props.form.resetFields();
        this.fetchDataList();

    };

    //获取当前页数数据
    fetchDataList = () => {
        const {dispatch,form} = this.props;
        const {currentPage} = this.state;

        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        let params = {
                            name:T.lodash.isUndefined(values.dataSourceName) ? '' : values.dataSourceName,
                            type:values.databaseType !== "ALL" ? T.lodash.isUndefined(values.databaseType) ? '' : values.databaseType:'',
                            status:values.status !== "ALL" ? T.lodash.isUndefined(values.status) ? '' : values.status:'',
                            page: currentPage,
                            pageSize: EnumPluginListPageInfo.defaultPageSize,
                        };
                        // 0：正常，1.禁用
                        dispatch({
                            type: 'metadataManage/getDataSourceManagementListAction',
                            params,
                        });
                    }
                });
            }
        });
    };

    //页码变换
    pageChange = page => {
        this.setState({
                currentPage: page,
            }, () => {
                this.fetchDataList();
            }
        );
    };

    //多选选择的值
    rowSelectionChange = (selectedRowKeys, selectedRows)=>{
        this.setState({
            selectedRowKeys:selectedRowKeys,
            selectedRows:selectedRows,
        });
        let selectIdArray = [];
        selectedRows.map((item)=>{
            selectIdArray.push(item.id);
        });
        this.setState({
            selectIdArray:selectIdArray.join(','),
        })
    };

    //查询-数据库类型/状态  渲染下拉选项
    renderSelectOption = (selectDataSource,selectType)=> {
        if(selectType === 'databaseType'){
            return (
                selectDataSource.map(item => {
                    return (
                        <Option key={item.id} value={item.id} title={item.name}>
                            {item.name}
                        </Option>
                    )
                })
            )
        }else if(selectType === 'status'){
            let arrKeys = T.lodash.keys(selectDataSource);
            return (
                arrKeys.map(item => {
                    return (
                        <Option key={item} value={item} title={EnumDataSourceStatus[item]["label"]}>
                            {EnumDataSourceStatus[item]["label"]}
                        </Option>
                    )
                })
            )

        }

    };



    render() {
        const {
            metadataManage,
            fetchDataSourceStatus,
            form: {getFieldDecorator},
        } = this.props;
        const {dataSourceLists,dataSourceTypeTreeData,dataSourceDetailModalVisible} = metadataManage;

        const {currentPage,dataSourceDetail} = this.state;


        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: '数据源名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '数据源类型',
                dataIndex: 'dataSourceType',
                key: 'dataSourceType',
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
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record)}>
                                <a>删除</a>
                            </Popconfirm>
                            <Divider type="vertical"/>
                            <a onClick={e => this.resourceRegister(e, record)}>注册资源</a>
                        </span>
                    );
                },
            }

        ];
        return (
            <PageHeaderWrapper title="数据源管理">
                <Row className={styles.dataSourceTitle} gutter={24}>
                    <Col xl={5} lg={5} md={5} sm={24} className={styles.dataSourceBtns}>
                        <Button type="primary" onClick={this.quickRegister}>
                            {/*<Icon type="plus"/>*/}
                            {/*<span>新建</span>*/}
                            <FormattedMessage id="metadataManage.btn.add"/>
                        </Button>
                        <Popconfirm title="是否要删除此行？" onConfirm={this.removeMore}>
                            <Button type="danger">
                                <FormattedMessage id="metadataManage.btn.delete"/>
                            </Button>
                        </Popconfirm>

                    </Col>

                    <Form layout="inline" onSubmit={this.searchDataSource}>
                        <Col xl={5} lg={5} md={5} sm={24}>
                            <FormItem
                                label={<FormattedMessage
                                    id="metadataManage.dataSourceManagement.dataSourceSearchForm.dataSourceName.label"/>}
                            >
                                {getFieldDecorator('dataSourceName', {
                                    initialValue: '',
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'metadataManage.dataSourceManagement.dataSourceSearchForm.dataSourceName.placeholder',
                                        })}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={5} lg={5} md={5} sm={24}>
                            <FormItem
                                label={<FormattedMessage
                                id="metadataManage.dataSourceManagement.dataSourceSearchForm.databaseType.label"/>}
                                >

                                {getFieldDecorator('databaseType', {
                                    // initialValue: '',
                                })(
                                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}
                                            placeholder={formatMessage({
                                                id: 'metadataManage.dataSourceManagement.dataSourceSearchForm.databaseType.placeholder',
                                            })}
                                    >
                                        {/*dataSourceTypeTreeData*/}
                                        {/*<Option value="" key="">
                                            <FormattedMessage
                                                id="metadataManage.dataSourceManagement.dataSourceSearchForm.databaseType.option.ALL"/>
                                        </Option>*/}
                                        {this.renderSelectOption(dataSourceTypeTreeData,'databaseType')}

                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col  xl={5} lg={5} md={5} sm={24}>
                            <FormItem
                                label={<FormattedMessage
                                    id="metadataManage.dataSourceManagement.dataSourceSearchForm.status.label"/>}
                            >

                                {getFieldDecorator('status', {
                                    initialValue: '0'
                                })(
                                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                       {/* <Option value="" key="">
                                            <FormattedMessage
                                                id="metadataManage.dataSourceManagement.dataSourceSearchForm.status.option.ALL"/>
                                        </Option>*/}
                                        {this.renderSelectOption(EnumDataSourceStatus,'status')}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={24} style={{textAlign: 'right'}}>
                            <FormItem className={styles.searchBtnWrapper}>
                                <Button htmlType="submit" style={{marginRight:10}}>
                                    <FormattedMessage id="metadataManage.btn.search"/>
                                </Button>
                                <Button onClick={this.resetDataSource} type="primary" style={{marginRight:10}}>
                                    <FormattedMessage id="metadataManage.btn.reset"/>
                                </Button>
                            </FormItem>
                        </Col>
                    </Form>
                </Row>
                <Row gutter={24} className={styles.dataSourceTableList}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Card bordered={false}>
                            <Table
                                loading={fetchDataSourceStatus}
                                columns={columns}
                                dataSource={dataSourceLists}
                                rowSelection={{
                                    onChange:this.rowSelectionChange,
                                }}
                                pagination={{
                                    current: currentPage,
                                    onChange: this.pageChange,
                                    pageSize: EnumPluginListPageInfo.defaultPageSize,
                                    // total: sourceProcessorsList.hasOwnProperty('total') ? Number(sourceProcessorsList.total) + 1 : 0,
                                }}
                                // rowClassName={record => (record.editable ? styles.editable : '')}
                            />
                        </Card>
                    </Col>

                </Row>
                <SyncDataSourceDetailModal
                    content={this}
                    closeAddMetadataModel={this.closeAddMetadataModel}
                    dataSourceDetailModalVisible={dataSourceDetailModalVisible}
                    dataSourceDetail = {dataSourceDetail}
                />
            </PageHeaderWrapper>
        );
    }
}


export default DataSourceManagement;
