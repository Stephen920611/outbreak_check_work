import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import styles from './SyncAddFieldModal.less';
import {
    Form,
    Modal,
    Input,
    Button,
} from 'antd';
const FormItem = Form.Item;

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
}))
@Form.create()
class SyncAddFieldModal extends PureComponent {
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
    closeAddFieldModel = () =>{
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/changeFieldModalVisibleAction',
            modalVisible: false,
        });
        //重置表单
        this.resetForm();
    };

    render() {
        const {
            dataSyncNewMission,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {addFieldModalVisible} = dataSyncNewMission;
        const {formItemLayout,submitFormLayout} = this.state;

        return (
            <Modal
                title="新建字段"
                visible={addFieldModalVisible}
                footer={null}
                onCancel={this.closeAddFieldModel}
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
                            {getFieldDecorator('fieldName', {
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
                            label={
                                <FormattedMessage id="metadataManage.metadataManageConfig.syncAddMetadataModal.form.defaultNum.label"/>
                            }
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
                                onClick={this.closeAddFieldModel}
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
export default SyncAddFieldModal;
