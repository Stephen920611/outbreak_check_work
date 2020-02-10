import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './index.less';
import router from 'umi/router';
import T from './../../../utils/T';
import NavLink from 'umi/navlink';

import SourceStep1 from './SourceStep1';
import SourceStep2 from './SourceStep2';
import SourceStep3 from './SourceStep3';
import SourceStep4 from './SourceStep4';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {Card, Steps, Form} from 'antd';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';

const {Step} = Steps;

@connect(({dataSyncNewMission}) => ({
    dataSyncNewMission,
}))
export default class StepForm extends PureComponent {

    constructor() {
        super();
        this.state = {
            currentStep: 0,
        };
        //第二部form表单验证
        this.formRef = null;
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        //设置当前的进度
        dispatch({
            type: 'dataSyncNewMission/setCurrentStepAction',
            currentStep: 0,
        });
    }

    onChange = current => {
        const {dataSyncNewMission, dispatch} = this.props;
        const {sourceUuid, sinkUuid, modalType ,processorUuid,isProcessorEdit} = dataSyncNewMission;
        //选择哪个类型
        switch (current) {
            case 0:
                //设置当前的进度
                dispatch({
                    type: 'dataSyncNewMission/setCurrentStepAction',
                    currentStep: current,
                });
                router.push({
                    pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/sourceType' : '/dataDistribution/step-form/sourceType',
                    params: {
                        isRouterPush: true
                    }
                });
                break;
            case 1:
                //必须要填字段才能跳
                if ( processorUuid !== '' && (modalType === 'dataOrigin' || modalType === 'dataDestination')) {
                    //设置当前的进度
                    dispatch({
                        type: 'dataSyncNewMission/setCurrentStepAction',
                        currentStep: current,
                    });
                    //跳路由
                    router.push({
                        pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/config' : '/dataDistribution/step-form/config',
                        params: {
                            isRouterPush: true
                        }
                    });
                } else {
                    if(isProcessorEdit){
                        //设置当前的进度
                        dispatch({
                            type: 'dataSyncNewMission/setCurrentStepAction',
                            currentStep: current,
                        });
                        //跳路由
                        router.push({
                            pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/config' : '/dataDistribution/step-form/config',
                            params: {
                                isRouterPush: true
                            }
                        });
                    }else{//新建
                        modalType === 'dataOrigin' ? T.prompt.error('请选择数据源类型！') : T.prompt.error('请选择数据目的地类型！');
                    }
                }
                break;
            case 2:
                //下一步功能
                if(this.formRef){
                    this.formRef.handleSubmit();
                }else {
                    //设置当前的进度
                    dispatch({
                        type: 'dataSyncNewMission/setCurrentStepAction',
                        currentStep: current,
                    });
                    router.push({
                        pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/rule' : '/dataDistribution/step-form/rule',
                        params: {
                            isRouterPush: true
                        }
                    });
                }
                //设置当前的进度
                // dispatch({
                //     type: 'dataSyncNewMission/setCurrentStepAction',
                //     currentStep: current,
                // });
                // router.push({
                //     pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/rule' : '/dataDistribution/step-form/rule'
                // });
                break;
            case 3:
                //设置当前的进度
                dispatch({
                    type: 'dataSyncNewMission/setCurrentStepAction',
                    currentStep: current,
                });
                router.push({
                    pathname: modalType === 'dataOrigin' ? '/dataTask/step-form/active' : '/dataDistribution/step-form/active',
                    params: {
                        isRouterPush: true
                    }
                });
                break;
        }
    };

    /**
     * 判断是否可跳转，不能跨俩步骤跳
     * @param {number} specialStep 自己本身的值
     * @param {number} currentStep 当前的步骤条值
     * @returns {boolean}
     */
    isEnabled = (specialStep, currentStep) => {
        //如果只是前后差一步，那么可以点击，不能跨两部点击， 因为是disabled 属性，所以要去取反
        if (specialStep >= (currentStep - 1) && specialStep <= (currentStep + 1)) {
            return false;
        } else {
            return true;
        }
    };

    render() {
        const {location, children, dataSyncNewMission} = this.props;
        const {
            isSourceEdit,
            sourceUuid,
            currentStep,
            modalType,
            formData,
            isProcessorEdit,
        } = dataSyncNewMission;

        const breadcrumb = [
            {
                linkTo: '/dashboard',
                name: '首页',
            },
            {
                linkTo: '/dataTask',
                name: '数据接入',
            },
            {
                name: '新建数据源',
            },
        ];

        return (
            <Fragment>
                {/*<PageHeaderWrapper*/}
                    {/*isSpecialBreadcrumb={true}*/}
                    {/*title={""}*/}
                    {/*breadcrumbName={<CustomBreadcrumb dataSource={breadcrumb}/>}*/}
                {/*/>*/}
                <Fragment>
                    <Steps
                        onChange={this.onChange}
                        current={currentStep}
                        className={styles.steps}
                    >
                        <Step title={modalType === 'dataDestination' ? "选择数据目的地类型":"选择数据源类型"} disabled={isProcessorEdit || this.isEnabled(0, currentStep)}/>
                        <Step title={modalType === 'dataDestination' ? "数据目的地配置":"数据源配置"} disabled={this.isEnabled(1, currentStep)}/>
                        <Step title="配置规则" disabled={this.isEnabled(2, currentStep)}/>
                        <Step title="激活" disabled={this.isEnabled(3, currentStep)}/>
                    </Steps>
                </Fragment>
                <Fragment>
                    {/*{*/}
                        {/*currentStep === 0 ?*/}
                            {/*<SourceStep1 /> :*/}
                            {/*currentStep === 1 ?*/}
                                {/*<SourceStep2 /> :*/}
                                {/*currentStep === 2 ?*/}
                                    {/*<SourceStep3 /> :*/}
                                    {/*<SourceStep4 />*/}
                    {/*}*/}
                    {
                        currentStep === 1 ?
                            <SourceStep2 wrappedComponentRef={(e) => this.formRef = e}/> :
                            children
                    }
                    {/*{children}*/}
                </Fragment>
            </Fragment>
        );
    }
}
