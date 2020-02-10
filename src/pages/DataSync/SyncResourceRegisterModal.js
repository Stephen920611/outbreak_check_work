import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import styles from './SyncResourceRegisterModal.less';
import {
    Form,
    Modal,
    Input,
    Button,
    Row,
    Col,
    Card,
    Select,
    Icon,
    Tooltip,
    InputNumber,
    DatePicker,
    Radio,
    Tree,
    Spin,
    Checkbox,
    TreeSelect,
} from 'antd';
const FormItem = Form.Item;
const {TextArea} = Input;
const {TreeNode, DirectoryTree} = Tree;
const {RangePicker} = DatePicker;

@connect(({metadataManage,dataSyncNewMission, loading}) => ({
    metadataManage,
    dataSyncNewMission,
}))
@Form.create()
class SyncResourceRegisterModal extends PureComponent {
    state = {
        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 17},
                md: {span: 17},
            },
        },
        submitFormLayout: {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 24, offset: 0},
            },
        },
    };

    //保存新建数据源
    onSubmitData = (e) => {
        let self = this;
        const {dispatch, form, addRow} = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //增加一行
                addRow(values);
                //重置表单
                self.resetForm();
                dispatch({
                    type: 'metadataManage/changeDataResourceModalVisibleAction',
                    htmlType:'metadataManageConfig',
                    modalVisible: false,
                });
            }
        })
    };

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };

    //关闭弹窗
    closeCreateDataResourceModel = () =>{
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/changeDataResourceModalVisibleAction',
            htmlType:'ResourceRegister',
            modalVisible: false,
        });
        //重置表单
        // this.resetForm();
    };

    render() {
        const {
            metadataManage,
            dataSyncNewMission,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {createDataResourceModalVisible} = dataSyncNewMission;
        const {formItemLayout,submitFormLayout} = this.state;

        return (
            <Modal
                title="新建数据库表"
                visible={createDataResourceModalVisible}
                footer={null}
                onCancel={this.closeCreateDataResourceModel}
                centered={true}
                className={styles.dataResourceModal}
            >
                <div>
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
                        {/*<FormItem
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
                        </FormItem>*/}
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
                                        // this.renderSelectItem(selectDataSource)
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
                                        // value={dataResourceRadio}
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
                        <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24,textAlign:'center'}}>
                            <Button
                                style={{marginLeft: 16}}
                                type="primary"
                                htmlType="submit"
                                // loading={savingStatus}
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
                </div>
            </Modal>
        );
    }
}
export default SyncResourceRegisterModal;
