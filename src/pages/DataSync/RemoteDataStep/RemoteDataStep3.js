import React, {PureComponent, Fragment, createRef} from 'react';
import {createForm, createFormField, formShape} from 'rc-form';
import {connect} from 'dva';
import T from './../../../utils/T';
import styles from './style.less';
import router from 'umi/router';
import ReactDOM from 'react-dom';

import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';

import {EnumRemoteDataStepStatus} from './../../../constants/dataSync/EnumSyncCommon';

import {
    Form,
    Button,
    Card,
    Radio,
    Input,
} from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    activateBtnStatus: loading.effects['dataSyncNewMission/activateRemoteResourceAction'],
    applyBtnStatus: loading.effects['dataSyncNewMission/applyRemoteResourceAction'],
}))
@Form.create()
class RemoteDataStep3 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            formItemLayout: {
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 9},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 7,},
                    md: {span: 7},
                },
            },
            submitFormLayout: {
                wrapperCol: {
                    xs: {span: 24, offset: 0},
                    sm: {span: 4, offset: 10},
                },
            },
            radioValue: '', //单选按钮值，后台需要的参数：1、字符串true为全量数据,对应前端为globalData 2、字符串false为增量数据,对应前端为incrementalData
        };
        this.listRef = createRef();
    }

    //同步范围：全量数据or增量数据
    onRadioChange = e => {
        this.setState({
            radioValue: e.target.value,
        });
    };

    /**
     * 激活
     */
    onActivateForm = () => {
        const {form, dataSyncNewMission, dispatch} = this.props;
        const {remoteSelectedPlatform, remoteSelectedResource, remoteSelectedResourceInfo} = dataSyncNewMission;
        const {validateFields} = form;
        validateFields((err, values) => {
            if (!err) {
                //获取当前用户信息
                const currentUserInfo =  T.auth.getLoginInfo();
                new Promise((resolve, reject) => {
                    dispatch({
                        type: 'dataSyncNewMission/activateRemoteResourceAction',
                        params: {
                            clusterId: remoteSelectedPlatform,
                            resourceId: remoteSelectedResource,
                            name: values.name,
                            createBy: currentUserInfo.user.id,
                            description: values.description,
                            fromBeginning: values.taskConfig === 'globalData' ? 'true' : 'false',
                            topic: remoteSelectedResourceInfo.topic,
                        },
                        resolve,
                        reject,
                    });
                }).then(response => {
                    if (response.result === 'true') {
                        T.prompt.success(response.data);
                        router.push({
                            pathname: '/dataTask',
                        });
                    } else {
                        T.prompt.error(response.message);
                    }
                });
            }
        });
    };
    /**
     * 申请
     */
    onApplyForm = () => {
        const {form, dataSyncNewMission, dispatch} = this.props;
        const {remoteSelectedPlatform, remoteSelectedResource, remoteSelectedResourceInfo} = dataSyncNewMission;
        const {validateFields} = form;
        validateFields((err, values) => {
            if (!err) {
                new Promise((resolve, reject) => {
                    dispatch({
                        type: 'dataSyncNewMission/applyRemoteResourceAction',
                        params: {
                            clusterId: remoteSelectedPlatform,
                            resourceId: remoteSelectedResource,
                            name: values.name,
                            fromBeginning: values.taskConfig === 'globalData' ? 'true' : 'false',
                            applyDescription: values.description ? values.description : '',
                            topic: remoteSelectedResourceInfo.topic,
                        },
                        resolve,
                        reject,
                    });
                }).then(response => {
                    if (response.result === 'true') {
                        T.prompt.success(response.data);
                        router.push({
                            pathname: '/dataTask',
                        });
                    } else {
                        T.prompt.error(response.message);
                    }
                });
            }

        });
    };

    //上一步
    onClusterPrev = () => {
        const {dispatch} = this.props;
        //设置当前的进度
        dispatch({
            type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
            currentRemoteDataStep: EnumRemoteDataStepStatus['1'].value,
        });
    };

    render() {
        const {form, dataSyncNewMission, activateBtnStatus, applyBtnStatus} = this.props;
        const {remoteSelectedResourceInfo, remoteSelectedPlatformInfo, localClusterInfo} = dataSyncNewMission;
        const {submitFormLayout, formItemLayout} = this.state;
        const {getFieldDecorator, getFieldValue} = form;

        //本地层级
        let localLevel = localClusterInfo.hasOwnProperty('level') ? Number(localClusterInfo.level) : 1;
        //远程层级
        let remoteLevel = remoteSelectedPlatformInfo.hasOwnProperty('level') ? Number(remoteSelectedPlatformInfo.level) : 1;

        return (
            <Fragment>
                <Form
                    layout="horizontal"
                    hideRequiredMark={true}
                    style={{marginTop: 32}}
                >
                    <Card>
                        <FormItem
                            {...formItemLayout}
                            label={
                                <span>
                                     <span
                                         className={styles.remoteCardStep3}
                                     >
                                         {remoteSelectedResourceInfo.hasOwnProperty('name') ? remoteSelectedResourceInfo.name.substring(0, 1) : '-'}
                                     </span>
                                </span>
                            }
                            colon={false}
                        >
                            {getFieldDecorator('name', {
                                initialValue: remoteSelectedResourceInfo.hasOwnProperty('name') ? remoteSelectedResourceInfo.name : '-',
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({
                                            id: 'form.remoteDataStep3.name.placeholder',
                                        }),
                                    },
                                ],
                            })(
                                <Input
                                    autoComplete="off"
                                    className={styles.remoteStep3SpecialInput}
                                    placeholder={formatMessage({
                                        id: 'form.remoteDataStep3.name.placeholder',
                                    })}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={
                                <FormattedMessage id="form.quickRegister.remarks.label"/>
                            }
                        >
                            {getFieldDecorator('description')(
                                <TextArea
                                    autoComplete="off"
                                    placeholder={formatMessage({
                                        id: 'form.quickRegister.remarks.placeholder',
                                    })}
                                    rows={4}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="同步范围"
                            {...formItemLayout}
                            help={<FormattedMessage id={getFieldValue('taskConfig') === 'incrementalData' ? "form.remoteDataStep3.incrementalData.content" : "form.remoteDataStep3.globalData.content"}/>}
                        >
                            {getFieldDecorator('taskConfig', {
                                initialValue: 'globalData'
                            })(
                                <Radio.Group onChange={this.onRadioChange}>
                                    <Radio value="globalData">全量数据</Radio>
                                    <Radio value="incrementalData">增量数据</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                    </Card>
                    <FormItem
                        {...submitFormLayout}
                        style={{textAlign: 'right'}}
                        className={styles.step1}
                    >
                        <Button onClick={this.onClusterPrev}>
                            上一步
                        </Button>
                        {/*<Button*/}
                            {/*type="primary"*/}
                            {/*onClick={this.onActivateForm}*/}
                            {/*style={{marginLeft: 20}}*/}
                            {/*loading={activateBtnStatus}*/}
                        {/*>*/}
                            {/*<FormattedMessage id="form.remoteDataStep3.activate.label"/>*/}
                        {/*</Button>*/}
                        {
                            localLevel < remoteLevel ?
                                <Button
                                    type="primary"
                                    onClick={this.onActivateForm}
                                    style={{marginLeft: 20}}
                                    loading={activateBtnStatus}
                                >
                                    <FormattedMessage id="form.remoteDataStep3.activate.label"/>
                                </Button>
                                : null
                        }
                        {
                            localLevel >= remoteLevel ?
                                <Button
                                    type="primary"
                                    onClick={this.onApplyForm}
                                    style={{marginLeft: 20}}
                                    loading={applyBtnStatus}
                                >
                                    <FormattedMessage id="form.remoteDataStep3.apply.label"/>
                                </Button>
                                : null
                        }
                        {/*<Button*/}
                            {/*type="primary"*/}
                            {/*onClick={this.onApplyForm}*/}
                            {/*style={{marginLeft: 20}}*/}
                            {/*loading={applyBtnStatus}*/}
                        {/*>*/}
                            {/*<FormattedMessage id="form.remoteDataStep3.apply.label"/>*/}
                        {/*</Button>*/}
                    </FormItem>
                </Form>
            </Fragment>
        );
    }
}

export default RemoteDataStep3;
