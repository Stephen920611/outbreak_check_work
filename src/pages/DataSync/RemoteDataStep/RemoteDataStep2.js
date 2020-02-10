import React, {PureComponent, Fragment, createRef} from 'react';
import {createForm, createFormField, formShape} from 'rc-form';
import {connect} from 'dva';
import T from './../../../utils/T';
import styles from './style.less';
import router from 'umi/router';
import ReactDOM from 'react-dom';

import {FormattedMessage} from 'umi-plugin-react/locale';
import {EnumIconSrc, EnumRemoteDataStepStatus} from './../../../constants/dataSync/EnumSyncCommon';

import {
    Form,
    Button,
    Divider,
    Card,
    List,
    Tooltip,
    Modal,
    Table,
    Row,
    Col,
} from 'antd';
import testMysql from './../imgs/testMysql.jpg';

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
}))
class SyncAddFieldModal extends PureComponent {

    render() {
        const {
            dataSyncNewMission,
            visible,
            closeDetailModal,
            modalTitleName,
            fetchDataFieldListStatus,
        } = this.props;
        const {resourceDataFieldList} = dataSyncNewMission;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                // width: '10%',
            },
            {
                title: '字段名',
                dataIndex: 'columnName',
                key: 'columnName',
                // width: '20%',
            },
            {
                title: '字段中文名',
                dataIndex: 'columnRemark',
                key: 'columnRemark',
                // width: '20%',
            },
            {
                title: '数据类型',
                dataIndex: 'typeName',
                key: 'typeName',
                // width: '20%',
            },
            {
                title: '数据长度',
                dataIndex: 'columnSize',
                key: 'columnSize',
                // width: '15%',
            },
            {
                title: '默认值',
                dataIndex: 'defaultValue',
                key: 'defaultValue',
            },
            {
                title: '更新时间',
                dataIndex: 'updateDate',
                key: 'updateDate',
            },
        ];
        return (
            <Modal
                title={modalTitleName}
                visible={visible}
                width={'auto'}
                footer={null}
                onCancel={closeDetailModal}
                centered={true}
                className={styles.remoteModal}
            >
                <div className={styles.remoteModalContent}>
                    <Table
                        loading={fetchDataFieldListStatus}
                        columns={columns}
                        dataSource={resourceDataFieldList}
                        pagination={false}
                    />
                </div>
            </Modal>
        );
    }
}

@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    fetchListStatus: loading.effects['dataSyncNewMission/fetchRemoteClusterResourceListAction'],
    fetchDataFieldListStatus: loading.effects['dataSyncNewMission/fetchRemoteClusterDataFieldListAction'],
}))
@Form.create()
class RemoteDataStep2 extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,     //模态框是否可见
            submitFormLayout: {
                wrapperCol: {
                    xs: {span: 24, offset: 0},
                    sm: {span: 4, offset: 10},
                },
            },
            modalTitleName: "",  //模态框标题内容
        };
        this.listRef = createRef();
    }

    componentDidMount() {
        const {dispatch, dataSyncNewMission} = this.props;
        const {remoteSelectedPlatform} = dataSyncNewMission;
        dispatch({
            type: 'dataSyncNewMission/fetchRemoteClusterResourceListAction',
            params: {
                clusterId: remoteSelectedPlatform
            }
        });
    }

    /**
     * 点击选中数据源触发
     * @param key
     */
    onSelectOrigin = key => {
        const {dispatch} = this.props;
        //更新选中的平台资源id
        dispatch({
            type: 'dataSyncNewMission/setRemoteSelectedResourceAction',
            remoteSelectedResourceInfo: key,
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
            currentRemoteDataStep: EnumRemoteDataStepStatus['2'].value,
        });
    };

    //上一步
    onClusterPrev = () => {
        const {dispatch} = this.props;
        //设置当前的进度
        dispatch({
            type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
            currentRemoteDataStep: EnumRemoteDataStepStatus['0'].value,
        });
    };

    /**
     * 点击下一步
     */
    onValidateForm = () => {
        const {form, dataSyncNewMission, dispatch} = this.props;
        const {remoteSelectedResource} = dataSyncNewMission;
        const {validateFields} = form;
        //如果不选择平台资源的话不让选择下一步
        if (remoteSelectedResource !== '') {
            validateFields((err, values) => {
                dispatch({
                    type: 'dataSyncNewMission/setCurrentRemoteDataStepAction',
                    currentRemoteDataStep: EnumRemoteDataStepStatus['2'].value,
                });
            });
        } else {
            T.prompt.error('请选择平台资源！');
        }
    };

    //展示详情
    showDetailModal = (data) => {
        this.setState({
            visible: true,
            modalTitleName: data.hasOwnProperty('name') ? data.name : '-'
        }, () => {
            const {dispatch, dataSyncNewMission} = this.props;
            const {remoteSelectedResource, remoteSelectedPlatform} = dataSyncNewMission;
            if (remoteSelectedResource !== '') {
                dispatch({
                    type: 'dataSyncNewMission/fetchRemoteClusterDataFieldListAction',
                    params: {
                        clusterId: remoteSelectedPlatform,
                        resourceId: remoteSelectedResource
                    }
                });
            }
        })
    };

    //关闭详情
    closeDetailModal = () => {
        this.setState({
            visible: false
        })
    };

    render() {
        const {dataSyncNewMission, fetchListStatus, fetchDataFieldListStatus} = this.props;
        const {
            platformResourceList,
            remoteSelectedResource,
        } = dataSyncNewMission;
        const {submitFormLayout, visible, modalTitleName} = this.state;
        return (
            <Fragment>
                <Form layout="horizontal" hideRequiredMark style={{marginTop: 32}}>
                    <Form.Item>
                        <Card>
                            <div ref="city">选择平台资源</div>
                            <Divider style={{margin: '20px 0 20px'}}/>
                            <div className={styles.resourceList}>
                                <List
                                    rowKey="id"
                                    loading={fetchListStatus}
                                    ref={this.listRef}
                                    grid={{gutter: 24, lg: 6, md: 4, sm: 3, xs: 2}}
                                    dataSource={platformResourceList}
                                    renderItem={item =>
                                        (
                                            <List.Item
                                                key={item.id}
                                                onClick={this.onSelectOrigin.bind(this, item)}
                                                className={styles.card}
                                                onDoubleClick={this.onDoubleSelectOrigin.bind(this, item)}
                                            >
                                                <Tooltip placement="top" title={item.name}>
                                                    <Card
                                                        hoverable
                                                        size="default"
                                                        id={item.hasOwnProperty('id') ? item.id : ''}
                                                        className={
                                                            remoteSelectedResource === item.id ? styles.activeColor : null
                                                        }
                                                        extra={<span onClick={this.showDetailModal.bind(this, item)}>详情</span>}
                                                    >
                                                        <Card.Meta
                                                            avatar={
                                                                <div
                                                                    className={styles.remoteCardStep2}
                                                                >
                                                                    {item.hasOwnProperty('name') ? item.name.substring(0, 1) : '-'}
                                                                </div>
                                                            }
                                                            title={
                                                                <div className={styles.remoteCardStep2Title}>
                                                                    <div
                                                                        title={item.name}
                                                                        className={styles.remoteCardStep2Name}
                                                                    >
                                                                        {item.name}
                                                                    </div>
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
                        style={{
                            textAlign: 'right',
                            display: 'flex',
                        }}
                        className={styles.step1}
                    >
                        <Button onClick={this.onClusterPrev}>
                            上一步
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.onValidateForm}
                            style={{marginLeft: 20}}
                        >
                            <FormattedMessage id="form.syncConfigDataOriginModal.nextStep"/>
                        </Button>
                    </Form.Item>
                </Form>
                <SyncAddFieldModal
                    visible={visible}
                    modalTitleName={modalTitleName}
                    fetchDataFieldListStatus={fetchDataFieldListStatus}
                    closeDetailModal={this.closeDetailModal}
                />
            </Fragment>
        );
    }
}

export default RemoteDataStep2;
