import React, {PureComponent} from 'react';
import styles from './ResourceRegister.less';
import router from 'umi/router';
import T from './../../utils/T';
import {connect} from 'dva';

import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import SyncChooseDataResourceModal from './SyncChooseDataResourceModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录
import {
    EnumQuickRegisterParams,
} from './../../constants/dataSync/EnumSyncConfigModal';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';
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
    Checkbox,
    TreeSelect,
} from 'antd';

const {TreeNode, DirectoryTree} = Tree;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;

/* eslint react/no-multi-comp:0 */
@connect(({metadataManage, loading}) => ({
    metadataManage,
    loading: loading.models.metadataManageList,
    fetchTreeStatus: loading.effects['metadataManage/getQuickRegisterTreeAction'],
    savingStatus: loading.effects['metadataManage/saveQuickRegisterAction'],
    testStatus: loading.effects['metadataManage/testQuickRegisterAction'],
}))
@Form.create()
class ResourceRegister extends PureComponent {
    state = {
        dataResourceModalState: false,
        dataSourceInfo: {},//存储数据源的详情
    };

    componentDidMount() {
        const self = this;
        const {location, dispatch, metadataManage, form} = this.props;
        const {dataResourceManageEditInfo, dataResourceManageEdit, dataSourceTypeTreeOldData, dataResourceTypeTreeList,metadataManageHtmlType} = metadataManage;
        // if (location.hasOwnProperty('params') && location.params.hasOwnProperty('dataSourceInfo')) {
        //     console.log('location', location);
        // }
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
                // self.fetchDataList();
            } else {
                T.prompt.error(response.message);
            }
        });
        //获取数据源列表
        dispatch({
            type: 'metadataManage/getDataSourceManagementSelectAction',
        });
        if(dataResourceManageEdit) {
            form.setFieldsValue({
                resourceName: dataResourceManageEditInfo.name,
                resourceType: dataResourceManageEditInfo.resourceType,
                resourceDescribe: dataResourceManageEditInfo.remarks,
                dataSourceName: dataResourceManageEditInfo.dataSourceId,
                dataResource: dataResourceManageEditInfo.code,
            });
        }
        if(metadataManageHtmlType === 'dataSourceManagement'){
            form.resetFields();
            form.setFieldsValue({
                dataSourceName:location.params.hasOwnProperty('dataSourceInfo')? location.params.dataSourceInfo.id:''
            });
        }
    }

    //重置form表单
    componentWillUnmount(){
        this.resetForm();
    }

    /**
     * 保存功能
     * @param e
     * @param {boolean} isConfigMetaData false是保存 true是保存并配置元数据，如果是保存并配置元数据，需要跳到元数据管理页面，否则跳回原来页面
     */
    handleSubmitQueueAndFile = (e, isConfigMetaData = false) => {
        const {dispatch, form, metadataManage} = this.props;
        const {
            dataSourceTypeTreeOldData,
            dataResourceManageEdit,
            dataResourceRadio,
            dataResourceManageEditInfo,
        } = metadataManage;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //资源类型的code
                let categoryCode = '';
                dataSourceTypeTreeOldData.map(val => {
                    if (values.resourceType === val.name) {
                        categoryCode = val.id;
                    }
                });

                //保存功能
                new Promise((resolve, reject) => {
                    dispatch({
                        type: dataResourceManageEdit ? 'metadataManage/updateDataResourceManagementAction' : 'metadataManage/addDataResourceManagementAction',
                        params: {
                            "name" : values.resourceName, //资源名称
                            "categoryCode" : categoryCode, //资源类型
                            "remarks" : values.resourceDescribe,//资源描述
                            "dataSourceId" : values.dataSourceName, //数据源ID
                            "code" : dataResourceRadio, //数据资源
                            "id" : dataResourceManageEdit ? dataResourceManageEditInfo.id :'',
                        },
                        resolve,
                        reject,
                    });
                }).then(response => {
                    if (response.result === 'true') {
                        T.prompt.success(response.message);
                        //如果是保存并配置元数据，需要跳到元数据管理页面，否则跳回原来页面
                        if(isConfigMetaData){
                            router.push({
                                pathname: '/metadataManage/metadataManageConfig/info',
                                params: {
                                    isRouterPush: true,
                                    key: {
                                        id: response.data
                                    }
                                },
                            });
                        }else {
                            router.push({
                                pathname: '/metadataManage/resourceManagement/info',
                                params: {
                                    isRouterPush: true,
                                },
                            });
                        }
                    }else {
                        T.prompt.error(response.message);
                    }
                });
            }
        });
    };

    //重置功能
    resetForm = () => {
        const { dispatch } = this.props;
        this.props.form.resetFields();
        //清空选择框
        dispatch({
            type: 'metadataManage/setDataResourceRadioAction',
            dataResourceRadio: '',
        });
    };

    //选择框选择
    selectChange = (value) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/changeResourceDataSourceNameAction',
            dataResourceNameSelected: value,
        });
    };

    //显示数据资源弹窗
    showDataResource = () => {
        const {dispatch, form} = this.props;
        let value = this.props.form.getFieldValue('dataSourceName');
        if (!T.lodash.isUndefined(value)) {
            dispatch({
                type: 'metadataManage/changeDataResourceModalVisibleAction',
                htmlType: 'ResourceRegister',
                modalVisible: true,
            });
            // 获取数据资源列表
            //TODO 测试的话，用下面固定的数值， 并且这个列表需要做成post请求，后台现在还没做，因为需要加条件查询
            new Promise((resolve, reject) => {
                dispatch({
                    type: 'metadataManage/getDataResourceFromDataSourceAction',
                    id: value,
                    // id: '1185023304682627072',
                    resolve,
                    reject,
                });
            }).then(response => {
                if (response.result === 'true') {
                    dispatch({
                        type: 'metadataManage/setDataResourceFromDataSourceAction',
                        dataResourceFromDataSource: response.data
                    });
                }else {
                    T.prompt.error(response.message)
                }
            });
        } else {
            T.prompt.error('请先选择数据源');
        }
    };

    //清空数据资源名
    clearDataResource = () => {
        const {dispatch} = this.props;
        //选中的列表写入model
        dispatch({
            type: 'metadataManage/setDataResourceRadioAction',
            dataResourceRadio: '',
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

    //渲染选择框内容
    renderSelectItem = (dataSource) => {
        return dataSource.map( val => {
            return  <Option key={val.id} value={val.id}>{val.name}</Option>
        })
    };

    render() {
        const {
            fetchTreeStatus,
            savingStatus,
            testStatus,
            metadataManage,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {
            metadataManageList,
            dataResourceModalVisible,
            dataResourceCheckedList,
            dataResourceCheckedListTitle,
            dataResourceTypeTreeList,
            dataResourceManageEdit,
            selectDataSource,
            dataResourceRadio,
            dataResourceManageEditInfo,
            dataResourceNameSelected
        } = metadataManage;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10},
                md: {span: 8},
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 10, offset: 7},
            },
        };

        const breadcrumb = [
            {
                linkTo: '/dashboard',
                name: '首页',
            },
            {
                name: '元数据管理',
            },
            {
                linkTo: '/metadataManage/resourceManagement/info',
                name: '资源管理',
            },
            {
                name: '注册资源',
            },
        ];
        return (
            <PageHeaderWrapper title="注册资源"
                               breadcrumbName={<CustomBreadcrumb dataSource={breadcrumb}/>}
                               isSpecialBreadcrumb={true}
            >
                <Form
                    onSubmit={this.handleSubmitQueueAndFile}
                    hideRequiredMark
                    className={styles.quickRegisterModal}
                >
                    <Row
                        className={styles.subTitle}
                    >
                        <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                            资源基本信息
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage
                                  id="metadataManage.resourceManagement.resourceSearchForm.resourceName.label"/>}>
                        {getFieldDecorator('resourceName', {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.resourceName.placeholder'}),
                                },
                            ],
                        })(<Input
                            placeholder={formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.resourceName.placeholder'})}/>)}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage
                                  id="metadataManage.resourceManagement.resourceSearchForm.resourceCode.label"/>}>
                        {getFieldDecorator('resourceCode', {
                            rules: [
                                {
                                    required: false,
                                    message: formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.resourceCode.placeholder'}),
                                },
                            ],
                        })(<Input
                            disabled={true}
                            placeholder={formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.resourceCode.placeholder'})}/>)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage
                            id="metadataManage.resourceManagement.resourceSearchForm.resourceType.label"/>}
                    >

                        {getFieldDecorator('resourceType', {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.resourceType.placeholder'}),
                                },
                            ],
                        })(
                            <TreeSelect
                                showSearch
                                // style={{ width: 300 }}
                                placeholder={formatMessage({
                                    id: 'metadataManage.resourceManagement.resourceSearchForm.resourceType.placeholder',
                                })}
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                allowClear
                                treeDefaultExpandAll
                            >
                                {this.renderSelectTreeNodes(dataResourceTypeTreeList)}
                            </TreeSelect>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage
                                  id="metadataManage.resourceManagement.resourceSearchForm.resourceDescribe.label"/>}>
                        {getFieldDecorator('resourceDescribe', {
                            rules: [
                                {
                                    message: formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.resourceDescribe.placeholder'}),
                                },
                            ],
                        })(
                            <TextArea
                                placeholder={formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.resourceDescribe.placeholder'})}
                                autoSize={{minRows: 2, maxRows: 6}}
                            />
                        )}
                    </FormItem>
                    <Row
                        className={styles.subTitle}
                    >
                        <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                            资源注册信息
                        </Col>
                    </Row>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage
                                  id="metadataManage.resourceManagement.resourceSearchForm.dataSourceName.label"/>}>
                        {getFieldDecorator('dataSourceName', {
                            rules: [
                                {
                                    required: true,
                                    message: formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.dataSourceName.placeholder'}),
                                },
                            ],
                        })(
                            <Select
                                onChange={this.selectChange}
                                // getPopupContainer={triggerNode => triggerNode.parentNode}
                                placeholder={formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.dataSourceName.placeholder'})}
                            >
                                {
                                    this.renderSelectItem(selectDataSource)
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}
                              label={<FormattedMessage id="metadataManage.resourceManagement.resourceSearchForm.dataResource.label"/>}>
                        {getFieldDecorator('dataResource', {
                            rules: [
                                {
                                    required: false,
                                    message: formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.dataResource.placeholder'}),
                                },
                            ],
                        })(
                            <div className={styles.dataResourceChoice}>
                                <Input
                                    className={styles.dataResourceInput}
                                    value={dataResourceRadio}
                                    placeholder={formatMessage({id: 'metadataManage.resourceManagement.resourceSearchForm.dataResource.placeholder'})}
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
                                    type="primary"
                                    onClick={this.clearDataResource}
                                >
                                    <FormattedMessage id="metadataManage.btn.clear"/>
                                </Button>
                            </div>
                        )}
                    </FormItem>
                    <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24}}>
                        <Button
                            style={{marginLeft: 16}}
                            type="primary"
                            htmlType="submit"
                            loading={savingStatus}
                        >
                            <FormattedMessage id="metadataManage.btn.save"/>
                        </Button>
                        <Button
                            style={{marginLeft: 8}}
                            type="primary"
                            onClick={(e) => this.handleSubmitQueueAndFile(e, true)}
                        >
                            <FormattedMessage id="metadataManage.btn.configure"/>
                        </Button>
                    </FormItem>
                </Form>
                <SyncChooseDataResourceModal
                    content={this}
                    closeDataResourceModel={this.closeDataResourceModel}
                    dataResourceModalVisible={dataResourceModalVisible}
                />
            </PageHeaderWrapper>
        );
    }
}


export default ResourceRegister;
