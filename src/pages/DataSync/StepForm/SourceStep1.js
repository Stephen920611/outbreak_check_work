import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import T from './../../../utils/T';
import styles from './style.less';
import router from 'umi/router';
import ReactDOM from 'react-dom';

import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import {EnumIconSrc} from './../../../constants/dataSync/EnumSyncCommon';
import {
    Form,
    Button,
    Divider,
    Card,
    List,
    Tooltip,
} from 'antd';

import testMysql from './../imgs/testMysql.jpg';

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    fetchListStatus: loading.effects['dataSyncNewMission/fetchDataSourcePluginsAction'],
    fetchSinkListStatus: loading.effects['dataSyncNewMission/fetchDataDestinationPluginsAction'],
}))
@Form.create()
class SourceStep1 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            originActiveColor: '', //选中数据源的uuid，用来区分颜色，点击当前高亮
            submitFormLayout: {
                wrapperCol: {
                    xs: {span: 24, offset: 0},
                    sm: {span: 4, offset: 10},
                },
            },
            htmlType: '',
        };
        this.listRef = createRef();
    }

    componentDidMount() {
        const {dispatch, dataSyncNewMission, location} = this.props;
        const {modalType,originActiveColor,isProcessorEdit} = dataSyncNewMission;

        dispatch({
            type: modalType === 'dataOrigin'?'dataSyncNewMission/fetchDataSourcePluginsAction':'dataSyncNewMission/fetchDataDestinationPluginsAction',
        });

        //刷新前页面从哪里跳过来，获取缓存
        dispatch({
            type: 'dataSyncNewMission/changeModalTypeAction',
            modalType: T.storage.getStorage('HtmlType').modalType,
        });
        //如果是数据目的地，直接跳转到分发首页（刷新后数据源的信息也不存在）
        T.storage.getStorage('HtmlType').modalType === 'dataDestination' ? T.auth.returnSpecialMainPage(location, '/dataDistribution'):'';

        // T.auth.returnSpecialMainPage(location, '/dataTask/step-form/sourceType');
        // console.log('step1',location.params.htmlType);

    }

    componentWillReceiveProps(nextProps) {
        // const {getMissionDetail} = nextProps.dataSyncNewMission;

        // //新建完成，选中状态
        // if (getMissionDetail !== this.props.dataSyncNewMission.getMissionDetail) {
        //     this.setState({
        //         originActiveColor: getMissionDetail.hasOwnProperty('source') ? getMissionDetail.source : '',
        //         destinationActiveColor: getMissionDetail.hasOwnProperty('sink') ? getMissionDetail.sink : '',
        //         sourceUuid: getMissionDetail.hasOwnProperty('source') ? getMissionDetail.source : '',
        //         sinkUuid: getMissionDetail.hasOwnProperty('sink') ? getMissionDetail.sink : '',
        //     });
        // }
    }

    componentWillUnmount() {
        // //销毁异步请求
        this.setState = (state, callback) => {
            return;
        };
        /*const {dispatch} =  this.props;
        //重置表与字段（第二步）
        dispatch({
            type: 'dataSyncNewMission/getDataResourceById',
            metadataManageTableList:[],
        });
        dispatch({
            type: 'dataSyncNewMission/getFieldList',
            fieldByTableIdList:[],
        });*/

    }

    /**
     * 点击选中数据源触发
     * @param key
     */
    onSelectOrigin = key => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {modalType} = dataSyncNewMission;
        //综合
        //更新选中的颜色和sourceType
        dispatch({
            type: 'dataSyncNewMission/changeProcessorTypeInfoAction',
            params: {
                originActiveColor: key.id,
                processorUuid: key.id,
            },
        });

        /*if (modalType === 'dataDestination') {
            dispatch({
                type: 'dataSyncNewMission/changeSinkTypeInfoAction',
                params: {
                    originActiveColor: key.id,
                    sinkUuid: key.id,
                },
            });
        } else {
            //更新选中的颜色和sourceType
            dispatch({
                type: 'dataSyncNewMission/changeSourceTypeInfoAction',
                params: {
                    originActiveColor: key.id,
                    sourceUuid: key.id,
                },
            });
        }*/

        dispatch({
            //更新选中的信息
            type: 'dataSyncNewMission/changeCurrentDataInfoAction',
            currentDataInfo: key,
        });

    };

    /**
     * 双击直接模拟下一步
     * @param key
     */
    onDoubleSelectOrigin = key => {
        const {dispatch,dataSyncNewMission} = this.props;
        const {modalType} = dataSyncNewMission;
        this.onSelectOrigin(key);
        //更改编辑状态
        dispatch({
            type: 'dataSyncNewMission/changeProcessorEditAction',
            isProcessorEdit: false
        });
        //更改编辑状态
        /*dispatch({
            type: 'dataSyncNewMission/changeSourceEditAction',
            isSourceEdit: false
        });*/
        dispatch({
            type: 'dataSyncNewMission/setCurrentStepAction',
            currentStep: 1,
        });
        router.push({
            pathname: modalType === 'dataDestination' ? '/dataDistribution/step-form/config' : '/dataTask/step-form/config',
            params: {
                isRouterPush: true,
            },
        });
    };

    /**
     * 点击下一步
     */
    onValidateForm = () => {
        const {form, dataSyncNewMission, dispatch} = this.props;
        const {getNewTaskData, sourceUuid, originActiveColor, modalType, sinkUuid,processorUuid} = dataSyncNewMission;
        const {getFieldDecorator, validateFields, getFieldValue} = form;
        // dataOrigin是数据任务，dataDestination是数据分发
        if (processorUuid !== '') {
            validateFields((err, values) => {
                // let params = {
                //     createBy: '',
                //     createDate: '',
                //     des: '',
                //     status: '',
                //     step: '3',
                //     updateBy: T.auth.getLoginInfo().user.loginCode,
                //     updateDate: '',
                //     source: sourceUuid,
                //     uuid: T.storage.getStorage('taskId'),
                // };
                // if (!err) {
                //     dispatch({
                //         //完善任务接口
                //         type: 'dataSyncNewMission/firstUpdateTaskByIdAction',
                //         params,
                //     });
                // }

                //更改编辑状态
                dispatch({
                    type: 'dataSyncNewMission/changeProcessorEditAction',
                    isProcessorEdit: false
                });
                dispatch({
                    type: 'dataSyncNewMission/setCurrentStepAction',
                    currentStep: 1,
                });
                //跳路由
                router.push({
                    pathname: modalType === 'dataDestination' ? '/dataDistribution/step-form/config' : '/dataTask/step-form/config',
                    params: {
                        isRouterPush: true,
                    },
                });
            });
        } else {
            T.prompt.error(modalType === 'dataDestination' ? '请选择数据目的地类型！' : '请选择数据源类型！');
        }
        /*if (modalType === 'dataDestination' ? sinkUuid !== '': sourceUuid !== '') {
            validateFields((err, values) => {
                // let params = {
                //     createBy: '',
                //     createDate: '',
                //     des: '',
                //     status: '',
                //     step: '3',
                //     updateBy: T.auth.getLoginInfo().user.loginCode,
                //     updateDate: '',
                //     source: sourceUuid,
                //     uuid: T.storage.getStorage('taskId'),
                // };
                // if (!err) {
                //     dispatch({
                //         //完善任务接口
                //         type: 'dataSyncNewMission/firstUpdateTaskByIdAction',
                //         params,
                //     });
                // }

                //更改编辑状态
                dispatch({
                    type: 'dataSyncNewMission/changeProcessorEditAction',
                    isProcessorEdit: false
                });
                dispatch({
                    type: 'dataSyncNewMission/setCurrentStepAction',
                    currentStep: 1,
                });
                //跳路由
                router.push({
                    pathname: modalType === 'dataDestination' ? '/dataDistribution/step-form/config' : '/dataTask/step-form/config',
                    params: {
                        isRouterPush: true,
                    },
                });
            });
        } else {
            T.prompt.error(modalType === 'dataDestination' ? '请选择数据目的地类型！' : '请选择数据源类型！');
        }*/
    };


    render() {
        const {dataSyncNewMission, fetchListStatus,fetchSinkListStatus} = this.props;
        const {
            dataOriginList,
            originActiveColor,
            dataDestinationList,
            modalType,
        } = dataSyncNewMission;
        const { submitFormLayout} = this.state;
        return (
            <Fragment>
                <Form layout="horizontal" hideRequiredMark  style={{marginTop: 32}}>
                    <Form.Item>
                        <Card>
                            {modalType === 'dataDestination' ? <div ref="city">选择数据目的地类型</div> : <div ref="city">选择数据源类型</div>}
                            {/*<div ref="city">选择数据源类型</div>*/}
                            <Divider style={{margin: '20px 0 20px'}}/>
                            <div className={styles.cardList}>
                                <List
                                    rowKey="id"
                                    loading={modalType ==='dataDestination' ? fetchSinkListStatus : fetchListStatus}
                                    ref={this.listRef}
                                    grid={{gutter: 24, lg: 6, md: 4, sm: 3, xs: 2}}
                                    dataSource={modalType ==='dataDestination' ? dataDestinationList : dataOriginList}
                                    renderItem={item =>
                                        (
                                            <List.Item
                                                key={item.id}
                                                onClick={this.onSelectOrigin.bind(this, item)}
                                                className={styles.card}
                                                onDoubleClick={this.onDoubleSelectOrigin.bind(this, item)}
                                            >
                                                <Tooltip placement="top" title={item.title}>
                                                    <Card
                                                        hoverable
                                                        size="default"
                                                        id={item.hasOwnProperty('id') ? item.id : ''}
                                                        className={
                                                            originActiveColor === item.id ? styles.activeColor : null
                                                        }
                                                    >
                                                        <Card.Meta
                                                            avatar={
                                                                <img
                                                                    alt=""
                                                                    className={styles.cardAvatar}
                                                                    src={
                                                                        item.hasOwnProperty('icon')
                                                                            ?
                                                                            T.lodash.isUndefined(EnumIconSrc[item.icon]) ?
                                                                                testMysql: EnumIconSrc[item.icon].url
                                                                            : testMysql
                                                                    }
                                                                />
                                                            }
                                                            title={
                                                                <div className={styles.title}>
                                                                    <div className={styles.name}>{item.name}</div>
                                                                </div>
                                                            }
                                                        ></Card.Meta>
                                                    </Card>
                                                </Tooltip>
                                            </List.Item>
                                        )
                                    }
                                />
                            </div>
                        </Card>
                    </Form.Item>
                    <Form.Item
                        {...submitFormLayout}
                        style={{textAlign: 'right'}}
                        className={styles.step1}
                    >
                        <Button type="primary" onClick={this.onValidateForm}>
                            <FormattedMessage id="form.syncConfigDataOriginModal.nextStep"/>
                        </Button>
                    </Form.Item>
                </Form>
            </Fragment>
        );
    }
}

export default SourceStep1;
