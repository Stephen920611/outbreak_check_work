import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import T from './../../../utils/T';
import styles from './style.less';
import router from 'umi/router';
import ReactDOM from 'react-dom';

import {FormattedMessage} from 'umi-plugin-react/locale';
import {EnumRemoteDataStepStatus} from './../../../constants/dataSync/EnumSyncCommon';
import {
    Form,
    Button,
    Divider,
    Card,
    List,
    Tooltip,
} from 'antd';

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    fetchListStatus: loading.effects['dataSyncNewMission/fetchClusterManageListServicesAction'],
}))
@Form.create()
class RemoteDataStep1 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            submitFormLayout: {
                wrapperCol: {
                    xs: {span: 24, offset: 0},
                    sm: {span: 4, offset: 10},
                },
            },
        };
        this.listRef = createRef();
    }

    componentDidMount() {
        this.fetchListData();
    }

    //获取列表数据和本地信息
    fetchListData = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/fetchLocalClusterAction',
        });
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/fetchClusterManageListServicesAction',
                params: {
                    page: 1,
                    pageSize: 999,
                    // status: 1
                },
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {

            } else {
                T.prompt.error(response.message);
            }
        });
    };

    /**
     * 更改远程数据选择的集群平台
     * @param key
     */
    onSelectOrigin = key => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/setRemoteSelectedPlatformAction',
            remoteSelectedPlatformInfo: key,
        });
    };

    /**
     * 双击直接模拟下一步
     * @param key
     */
    onDoubleSelectOrigin = key => {
        const {dispatch} = this.props;
        this.onSelectOrigin(key);
        dispatch({
            type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
            currentRemoteDataStep: EnumRemoteDataStepStatus['1'].value,
        });
    };

    /**
     * 点击下一步
     */
    onValidateForm = () => {
        const {form, dataSyncNewMission, dispatch} = this.props;
        const {remoteSelectedPlatform} = dataSyncNewMission;
        const {validateFields} = form;
        //如果不选择的话不让选择下一步
        if (remoteSelectedPlatform !== '') {
            validateFields((err, values) => {
                dispatch({
                    type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
                    currentRemoteDataStep: EnumRemoteDataStepStatus['1'].value,
                });
            });
        } else {
            T.prompt.error('请选择集群平台！');
        }
    };

    render() {
        const {dataSyncNewMission, fetchListStatus} = this.props;
        const {
            clusterPlatformList,
            remoteSelectedPlatform,
        } = dataSyncNewMission;
        const {submitFormLayout} = this.state;
        return (
            <Fragment>
                <Form layout="horizontal" hideRequiredMark style={{marginTop: 32}}>
                    <Form.Item>
                        <Card>
                            <div ref="city">选择集群平台</div>
                            <Divider style={{margin: '20px 0 20px'}}/>
                            <div className={styles.cardList}>
                                <List
                                    rowKey="id"
                                    loading={fetchListStatus}
                                    ref={this.listRef}
                                    grid={{gutter: 24, lg: 6, md: 4, sm: 3, xs: 2}}
                                    dataSource={clusterPlatformList}
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
                                                            remoteSelectedPlatform === item.id ? styles.activeColor : null
                                                        }
                                                    >
                                                        <Card.Meta
                                                            avatar={
                                                                <div
                                                                    className={styles.cardAvatar}
                                                                >
                                                                    {item.hasOwnProperty('name') ? item.name.substring(0, 1) : '-'}
                                                                </div>
                                                            }
                                                            title={
                                                                <div className={styles.title}>
                                                                    <div
                                                                        title={item.name}
                                                                        className={styles.name}
                                                                    >
                                                                        {item.name}
                                                                    </div>
                                                                </div>
                                                            }
                                                            description={`已接入${item.numberResourcesAccessed}个资源`}
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

export default RemoteDataStep1;
