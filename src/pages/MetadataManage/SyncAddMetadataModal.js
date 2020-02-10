import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import styles from './SyncAddMetadataModal.less';
import {
    Form,
    Modal,
    Input,
    Button,
} from 'antd';
const FormItem = Form.Item;

@connect(({metadataManage, loading}) => ({
    metadataManage,
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
    closeAddMetadataModel = () =>{
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/changeDataResourceModalVisibleAction',
            htmlType:'metadataManageConfig',
            modalVisible: false,
        });
        //重置表单
        this.resetForm();
    };

    render() {
        const {
            metadataManage,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {addMetadataModalVisible} = metadataManage;
        const {formItemLayout,submitFormLayout} = this.state;

        return (
            <Modal
                title="新建元数据"
                visible={addMetadataModalVisible}
                footer={null}
                onCancel={this.closeAddMetadataModel}
                centered={true}
                className={styles.dataResourceModal}
            >
                <div>
                    <Form onSubmit={this.onSubmitData} hideRequiredMark>
                        <FormItem
                            {...formItemLayout}
                            label={
                                <FormattedMessage id="metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnName.label"/>
                            }
                        >
                            {getFieldDecorator('columnName', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({
                                            id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnName.placeholder',
                                        }),
                                    },
                                ],
                            })(
                                <Input
                                    autoComplete="off"
                                    placeholder={formatMessage({
                                        id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnName.placeholder',
                                    })}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage id="metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnRemark.label"/>}
                        >
                            {getFieldDecorator('columnRemark', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({
                                            id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnRemark.placeholder',
                                        }),
                                    },
                                ],
                            })(
                                <Input
                                    autoComplete="off"
                                    placeholder={formatMessage({
                                        id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnRemark.placeholder',
                                    })}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage id="metadataManage.metadataManageConfig.syncAddMetadataModal.form.typeName.label"/>}
                        >
                            {getFieldDecorator('typeName', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({
                                            id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.typeName.placeholder',
                                        }),
                                    },
                                ],
                            })(
                                <Input
                                    autoComplete="off"
                                    placeholder={formatMessage({
                                        id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.typeName.placeholder',
                                    })}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage id="metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnSize.label"/>}
                        >
                            {getFieldDecorator('columnSize', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({
                                            id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnSize.placeholder',
                                        }),
                                    },
                                ],
                            })(
                                <Input
                                    autoComplete="off"
                                    placeholder={formatMessage({
                                        id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.columnSize.placeholder',
                                    })}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<FormattedMessage id="metadataManage.metadataManageConfig.syncAddMetadataModal.form.defaultNum.label"/>}
                        >
                            {getFieldDecorator('defaultValue', {
                                rules: [
                                    {
                                        required: false,
                                        message: formatMessage({
                                            id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.defaultNum.placeholder',
                                        }),
                                    },
                                ],
                            })(
                                <Input
                                    autoComplete="off"
                                    placeholder={formatMessage({
                                        id: 'metadataManage.metadataManageConfig.syncAddMetadataModal.form.defaultNum.placeholder',
                                    })}
                                />
                            )}
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
