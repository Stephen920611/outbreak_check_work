import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import T from './../../utils/T';
import router from 'umi/router';
import {
    EnumQuickRegisterParams,
} from './../../constants/dataSync/EnumSyncConfigModal';
import {EnumDataSyncPageInfo,EnumPluginListPageInfo} from './../../constants/EnumPageInfo';
import {EnumDataSourceStatus,EnumClusterStatus} from './../../constants/dataSync/EnumSyncCommon';

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

import SyncDataSourceDetailModal from './../MetadataManage/SyncDataSourceDetailModal';
import styles from './ClusterManageList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录

/* eslint react/no-multi-comp:0 */
@connect(({clusterManage, loading}) => ({
    clusterManage,
    loading: loading.models.clusterManageList,
    fetchClusterManageListStatus: loading.effects['clusterManage/fetchClusterManageListAction'],
}))
@Form.create()
class DataSourceManagement extends PureComponent {
    state = {
        currentPage: EnumDataSyncPageInfo.defaultPage,//分页
        selectedRowKeys:[],//所选选中的key数组
        selectedRows:[],//多选选中的数组
        dataSourceDetail:{},//选中数据源的详细信息
        selectIdArray:'',//存储多选的id字符串
    };

    componentDidMount() {
        const {dispatch} = this.props;
        const {currentPage} = this.state;

        //获取当前集群列表
        this.fetchClusterPlatformList();

    };

    //获取当前页数数据
    fetchClusterPlatformList = () => {
        const {dispatch} = this.props;
        const {currentPage} = this.state;
        dispatch({
            type: 'clusterManage/fetchClusterManageListAction',
            params: {
                page: currentPage,
                pageSize: EnumPluginListPageInfo.defaultPageSize,
            },
        });
    };

    //页码变换
    pageChange = page => {
        this.setState({
                currentPage: page,
            }, () => {
                this.fetchClusterPlatformList();
            }
        );
    };




    //操作--编辑 显示模态框（未完成）
    toggleEditable = (e, detail) => {
        e.preventDefault();
        const {dispatch} = this.props;
        /*this.setState({
            dataSourceDetail:detail
        },()=>{
            dispatch({
                type: 'clusterManage/changeDataResourceModalVisibleAction',
                htmlType:'dataSourceManagement',
                modalVisible: true,
            });
            //重置表单
            this.resetForm();
        });*/

    };

    /*//关闭弹窗
    closeAddMetadataModel = () =>{
        const {dispatch} = this.props;
        dispatch({
            type: 'clusterManage/changeDataResourceModalVisibleAction',
            htmlType:'dataSourceManagement',
            modalVisible: false,
        });

        //重置表单
        this.resetForm();
    };

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };*/

    //操作--删除(单个)
    remove = (data) => {
        console.log(data);
        let id = data.id;
        const {dispatch} = this.props;

        //删除接口
        /*new Promise((resolve, reject) => {
            dispatch({
                type: 'clusterManage/deleteDataSourceAction',
                id,
                resolve,
                reject,
            });
        }).then(response => {
            if(response.result === 'true'){
                T.prompt.success(response.data);
                this.fetchClusterPlatformList();
            }else {
                T.prompt.error(response.message)
            }
        })*/


    };

    //操作--删除按钮(多选删除)
    removeMore =() =>{
        const {dataSource,selectedRowKeys,selectedRows,selectIdArray} = this.state;
        let id = selectIdArray;
        const {dispatch} = this.props;
        //删除接口
       /* new Promise((resolve, reject) => {
            dispatch({
                type: 'clusterManage/deleteDataPlatformAction',
                id,
                resolve,
                reject,
            });
        }).then(response => {
            if(response.result === 'true'){
                T.prompt.success(response.data);
                this.fetchClusterPlatformList();
            }else {
                T.prompt.error(response.message)
            }
        })*/

    };



    //查询数据平台
    searchDataPlatform = (e) => {
        const {dispatch, form} = this.props;
        const {currentPage} = this.state;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let params = {
                    name:values.clusterName,
                    status:values.status !== "ALL" ? values.status:'',
                    page: currentPage,
                    pageSize: EnumPluginListPageInfo.defaultPageSize,
                };
                dispatch({
                    type: 'clusterManage/fetchClusterManageListAction',
                    params,
                });


            }
        });
    };

    //重置表单
    resetDataSource = () => {
        this.props.form.resetFields();
        this.fetchClusterPlatformList();

    };


    //多选选择的值
    rowSelectionChange = (selectedRowKeys, selectedRows)=>{
        this.setState({
            selectedRowKeys:selectedRowKeys,
            selectedRows:selectedRows,
        });
        console.log('selectedRows',selectedRows);
        let selectIdArray = [];
        selectedRows.map((item)=>{
            selectIdArray.push(item.id);
        });
        this.setState({
            selectIdArray:selectIdArray.join(','),
        })
        // console.log(`11selectedRowKeys: ${selectedRowKeys}`, '11selectedRows: ', selectedRows);
    };

    //查询-状态类型 渲染下拉选项
    renderSelectOption = (selectDataSource,selectType)=> {
       if(selectType === 'status'){
            let arrKeys = T.lodash.keys(selectDataSource);
            return (
                arrKeys.map(item => {
                    if(item !== 'UNKNOWN'){
                        return (
                            <Option key={item} value={item}>
                                {EnumClusterStatus[item]["label"]}
                            </Option>
                        )
                    }
                })
            )

        }

    };

    //连接数据平台（未完成）
    connectPlatform = (e, data)=>{
        console.log('连接平台');
    };

    //断开连接数据平台（未完成）
    disconnectPlatform = (e, data)=>{
        console.log('断开连接平台');
    };

    fetchSynchronization = ()=>{
        const {dispatch} = this.props;
        const {currentPage} = this.state;
        let self = this;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'clusterManage/fetchSynchronizationAction',
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                T.prompt.success(response.data);
                self.setState({
                    currentPage: EnumDataSyncPageInfo.defaultPage,//分页
                },()=>{
                    self.fetchClusterPlatformList();
                });
            }else {
                T.prompt.error(response.message);
            }
        });


    };





    render() {
        const {
            clusterManage,
            fetchClusterManageListStatus,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {clusterManageList} = clusterManage;

        const {currentPage} = this.state;

        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: '集群名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '接入资源数',
                dataIndex: 'numberResourcesAccessed',
                key: 'numberResourcesAccessed',
            },
            {
                title: '可接入资源数',
                dataIndex: 'numberResourcesAccessible',
                key: 'numberResourcesAccessible',
            },
            {
                title: '连接时间',
                dataIndex: 'connectTime',
                key: 'connectTime',
                render: text => <span>{T.moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
            },
            {
                title: '心跳时间',
                dataIndex: 'heartTime',
                key: 'heartTime',
                render: text => <span>{T.moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
            },
            {
                title: '状态',
                dataIndex: 'connectStatus',
                key: 'connectStatus',
                render: text => <span style={{color: !T.lodash.isUndefined(EnumClusterStatus[text]) ? EnumClusterStatus[text]["color"] : '#000'}}>{!T.lodash.isUndefined(EnumClusterStatus[text]) ? EnumClusterStatus[text]["label"] : EnumClusterStatus['UNKNOWN']["label"]}</span>
            },
            /*{
                title: '操作',
                key: 'action',
                // width: '15%',
                render: (text, record) => {
                    return (
                        <span>
                            <a onClick={e => this.connectPlatform(e, record)}>连接</a>
                            <Divider type="vertical"/>
                            <a onClick={e => this.disconnectPlatform(e, record)}>断开连接</a>
                            <Divider type="vertical"/>
                            <a onClick={e => this.toggleEditable(e, record)}>编辑</a>
                            <Divider type="vertical"/>
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record)}>
                                <a>删除</a>
                            </Popconfirm>
                            <Divider type="vertical"/>
                        </span>
                    );
                },
            }*/

        ];
        return (
            <PageHeaderWrapper title="集群管理">
                {/*<Row className={styles.dataSourceTitle}>
                    <Col span={10} className={styles.dataSourceBtns}>
                        <Button type="primary" onClick={this.fetchSynchronization} >
                            <FormattedMessage id="clusterManage.clusterManageList.title.synchronization"/>
                        </Button>
                    </Col>
                    <Form layout="inline" onSubmit={this.searchDataPlatform}>
                        <Col xl={{span:5,offset:0}} lg={{span:5,offset:0}} md={9} sm={9} xs={9}>
                            <Form.Item
                                label={<FormattedMessage
                                    id="clusterManage.clusterManageList.form.clusterName.label"/>}
                            >
                                {getFieldDecorator('clusterName', {
                                    initialValue: '',
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'clusterManage.clusterManageList.form.clusterName.placeholder',
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col  xl={5} lg={5} md={9} sm={9} xs={9}>
                            <Form.Item
                                label={<FormattedMessage
                                    id="clusterManage.clusterManageList.form.status.label"/>}
                            >

                                {getFieldDecorator('status', {
                                    initialValue: ''
                                })(
                                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                        <Option value="" key="">
                                            <FormattedMessage
                                                id="clusterManage.clusterManageList.form.status.option.ALL"/>
                                        </Option>
                                        {this.renderSelectOption(EnumClusterStatus,'status')}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col xl={3} lg={3} md={9} sm={9} xs={9} style={{textAlign: 'right'}}>
                            <Form.Item className={styles.searchBtnWrapper}>
                                <Button htmlType="submit" style={{marginRight:10}}>
                                    <FormattedMessage id="metadataManage.btn.search"/>
                                </Button>
                                <Button onClick={this.resetDataSource} type="primary">
                                    <FormattedMessage id="metadataManage.btn.reset"/>
                                </Button>
                            </Form.Item>
                        </Col>
                    </Form>
                </Row>*/}
                <Row className={styles.dataSourceTitle} gutter={24}>
                    <Form layout="inline" onSubmit={this.searchDataPlatform}>
                        <Col xl={5} lg={5} md={8} sm={8} xs={8}>
                            <Form.Item
                                label={<FormattedMessage
                                    id="clusterManage.clusterManageList.form.clusterName.label"/>}
                            >
                                {getFieldDecorator('clusterName', {
                                    initialValue: '',
                                })(
                                    <Input
                                        autoComplete="off"
                                        placeholder={formatMessage({
                                            id: 'clusterManage.clusterManageList.form.clusterName.placeholder',
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col  xl={5} lg={5} md={8} sm={8} xs={8}>
                            <Form.Item
                                label={<FormattedMessage
                                    id="clusterManage.clusterManageList.form.status.label"/>}
                            >

                                {getFieldDecorator('status', {
                                    initialValue: ''
                                })(
                                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                        <Option value="" key="">
                                            <FormattedMessage
                                                id="clusterManage.clusterManageList.form.status.option.ALL"/>
                                        </Option>
                                        {this.renderSelectOption(EnumClusterStatus,'status')}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col xl={{span:12,offset:2}} lg={{span:12,offset:2}} md={8} sm={8} xs={8} style={{textAlign: 'left'}}>
                            <Form.Item className={styles.searchBtnWrapper}>
                                <Button htmlType="submit" style={{marginRight:10}}>
                                    <FormattedMessage id="metadataManage.btn.search"/>
                                </Button>
                                <Button type="primary" onClick={this.fetchSynchronization} style={{marginRight:10}}>
                                    <FormattedMessage id="clusterManage.clusterManageList.title.synchronization"/>
                                </Button>
                                <Button onClick={this.resetDataSource} type="primary" >
                                    <FormattedMessage id="metadataManage.btn.reset"/>
                                </Button>
                            </Form.Item>
                        </Col>
                    </Form>
                </Row>
                <Row gutter={24} className={styles.dataSourceTableList}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Card bordered={false}>
                            <Table
                                loading={fetchClusterManageListStatus}
                                columns={columns}
                                dataSource={clusterManageList}
                                // rowSelection={{
                                //     onChange:this.rowSelectionChange,
                                // }}
                                pagination={{
                                    current: currentPage,
                                    onChange: this.pageChange,
                                    pageSize: EnumDataSyncPageInfo.defaultPageSize,
                                }}
                            />
                        </Card>
                    </Col>

                </Row>
                {/*<SyncDataSourceDetailModal
                    content={this}
                    closeAddMetadataModel={this.closeAddMetadataModel}
                    dataSourceDetailModalVisible={dataSourceDetailModalVisible}
                    dataSourceDetail = {dataSourceDetail}
                />*/}
            </PageHeaderWrapper>
        );
    }
}


export default DataSourceManagement;
