import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './../StepForm/index.less';
import router from 'umi/router';
import T from './../../../utils/T';

import RemoteDataStep1 from './RemoteDataStep1';
import RemoteDataStep2 from './RemoteDataStep2';
import RemoteDataStep3 from './RemoteDataStep3';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {Card, Steps, Form} from 'antd';

const {Step} = Steps;

@connect(({dataSyncNewMission}) => ({
    dataSyncNewMission,
}))
export default class RemoteDataStep extends PureComponent {

    constructor() {
        super();
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        //设置当前的进度
        dispatch({
            type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
            currentRemoteDataStep: 0,
        });
        //清空选中的集群平台和平台资源
        dispatch({
            type: 'dataSyncNewMission/setRemoteSelectedPlatformAction',
            remoteSelectedPlatformInfo: {},
        });
        dispatch({
            type: 'dataSyncNewMission/setRemoteSelectedResourceAction',
            remoteSelectedResourceInfo: {},
        });
    }

    onStepChange = current => {
        const {dataSyncNewMission, dispatch} = this.props;
        const {remoteSelectedPlatform, remoteSelectedResource} = dataSyncNewMission;

        //选择哪个类型
        switch (current) {
            case 0:
                //设置当前的进度
                dispatch({
                    type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
                    currentRemoteDataStep: current,
                });
                break;
            case 1:
                //必须要填字段才能跳
                if ( remoteSelectedPlatform !== '') {
                    //设置当前的进度
                    dispatch({
                        type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
                        currentRemoteDataStep: current,
                    });
                }else {
                    T.prompt.error('请选择集群平台！');
                }
                break;
            case 2:
                //必须要填字段才能跳
                if ( remoteSelectedResource !== '') {
                    //设置当前的进度
                    dispatch({
                        type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
                        currentRemoteDataStep: current,
                    });
                }else {
                    T.prompt.error('请选择平台资源！');
                }
                break;
        }
    };

    /**
     * 判断是否可跳转，不能跨俩步骤跳
     * @param {number} specialStep 自己本身的值
     * @param {number} currentRemoteDataStep 当前的步骤条值
     * @returns {boolean}
     */
    isEnabled = (specialStep, currentRemoteDataStep) => {
        //如果只是前后差一步，那么可以点击，不能跨两部点击， 因为是disabled 属性，所以要去取反
        if (specialStep >= (currentRemoteDataStep - 1) && specialStep <= (currentRemoteDataStep + 1)) {
            return false;
        } else {
            return true;
        }
    };

    render() {
        const {children, dataSyncNewMission} = this.props;
        const {
            currentRemoteDataStep,
        } = dataSyncNewMission;
        return (
            <Fragment>
                <Fragment>
                    <Steps
                        onChange={this.onStepChange}
                        current={currentRemoteDataStep}
                        className={styles.steps}
                    >
                        <Step title="选择集群平台" disabled={this.isEnabled(0, currentRemoteDataStep)}/>
                        <Step title="选择平台资源" disabled={this.isEnabled(1, currentRemoteDataStep)}/>
                        <Step title="激活" disabled={this.isEnabled(2, currentRemoteDataStep)}/>
                    </Steps>
                </Fragment>
                <Fragment>
                    {
                        currentRemoteDataStep === 0 ?
                            <RemoteDataStep1 /> :
                            currentRemoteDataStep === 1 ?
                                <RemoteDataStep2 /> :
                                    <RemoteDataStep3 />
                    }
                    {/*{*/}
                        {/*currentRemoteDataStep === 1 ?*/}
                            {/*<RemoteDataStep2 /> :*/}
                            {/*children*/}
                    {/*}*/}
                    {/*{children}*/}
                </Fragment>
            </Fragment>
        );
    }
}
