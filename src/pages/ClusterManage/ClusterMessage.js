import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import moment from 'moment';
import T from './../../utils/T';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import {connect} from 'dva';

import {EnumDataSyncPageInfo, EnumPluginListPageInfo} from './../../constants/EnumPageInfo';
import {
    EnumProcessorStatus,
    EnumIconSrc,
    EnumClusterMessageCheckStatus
} from './../../constants/dataSync/EnumSyncCommon';
import {
    List,
    Card,
    Row,
    Col,
    Radio,
    Input,
    Progress,
    Button,
    Icon,
    Dropdown,
    Menu,
    Avatar,
    Modal,
    Form,
    DatePicker,
    Select,
    Spin,
    Badge,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './ClusterMessage.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {Search, TextArea} = Input;

@connect(({list, clusterManage, loading}) => ({
    list,
    clusterManage,
    loading: loading.models.list,
    fetchClusterMessageListStatus: loading.effects['clusterManage/fetchMessageListAction'],
}))
@Form.create()
class BasicList extends PureComponent {
    state = {
        visible: false,
        done: false,
        currentPage: EnumPluginListPageInfo.defaultPage,//分页
        messageType: 'check',//tab键（消息的类型）
        keyword: '',//搜索 - 关键字
        checkDescription:'',//待审批，审批结果描述
    };

    formLayout = {
        labelCol: {span: 7},
        wrapperCol: {span: 13},
    };

    componentDidMount() {
        const {dispatch} = this.props;
        //获取头部接口,获取全部的任务列表
        this.fetchMessageList();
        //待审批消息
        /*dispatch({
            type: 'clusterManage/changeMessageType',
            messageType: 'check',
        });*/

    }
    //获取消息列表（待办/申请）
    fetchMessageList = () => {
        const {dispatch,clusterManage} = this.props;
        // const {messageType} = clusterManage;
        const {currentPage,keyword,messageType} = this.state;
        dispatch({
            type: 'clusterManage/fetchMessageListAction',
            messageType: messageType,
            params: {
                keyword: keyword,
                type: messageType,
                page: currentPage,
                pageSize: EnumPluginListPageInfo.defaultPageSize,
            }
        });
    };
    //页码变换
    pageChange = page => {
        this.setState({
                currentPage: page,
            }, () => {
                this.fetchMessageList();
            }
        );
    };
    //tab - 根据类型获取任务列表
    changeMessageType = (e) => {
        //待审批消息
        const {dispatch} = this.props;
        /*dispatch({
            type: 'clusterManage/changeMessageType',
            messageType: e.target.value,
        });*/
        this.setState({
            messageType: e.target.value
        }, () => {
            this.fetchMessageList()
        });

    };


    //编辑(暂时不做)
    showEditModal = item => {
        this.setState({
            visible: true,
            current: item,
        });
    };


    //关闭弹窗
    handleCancel = () => {
        // setTimeout(() => this.addBtn.blur(), 0);
        this.setState({
            visible: false,
        });
    };
    //同意/拒绝申请（0：待审批，1：同意，2：拒绝）
    handleSubmit = (type) => {
        const {dispatch} = this.props;
        const {current,checkDescription} = this.state;
        let self = this;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'clusterManage/fetchMessageStatueAction',
                params:{
                    applyId:current && current.hasOwnProperty('applyId') ? current.applyId : '',
                    checkStatus:type,
                    checkDescription:checkDescription,
                    id:current && current.hasOwnProperty('id') ? current.id : '',
                },
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                type === '1' ? T.prompt.success("同意申请") : T.prompt.success("驳回申请成功！");
                self.setState({
                    visible: false,
                });
                self.fetchMessageList();
                //更改编辑状态
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //删除
    deleteItem = id => {
        const {dispatch} = this.props;
        dispatch({
            type: 'list/submit',
            payload: {id},
        });
    };

    //查询
    searchMessage = (value) => {
        this.setState({
            keyword: value
        }, () => {
            this.fetchMessageList();
        });

    };
    //弹出框-审批描述
    changeTextArea = (e)=>{
        this.setState({
            checkDescription:e.target.value
        })
    };

    //弹出的主要内容
    renderMessageModalContent = (current) => {
        const {clusterManage} = this.props;
        // const {messageType} = clusterManage;
        const {messageType} = this.state;
        return (
            <div className={styles.modalBottom}>
                <Row className={styles.modalBottomItem}>
                    <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                        标题：
                    </Col>
                    <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                        {current.hasOwnProperty('name') ? current.name:'---'}
                    </Col>
                </Row>
                <Row className={styles.modalBottomItem}>
                    <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                        申请时间：
                    </Col>
                    <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                        {current.hasOwnProperty('createTime') ? T.moment(current.createTime).format('YYYY-MM-DD HH:mm'):'---'}

                    </Col>
                </Row>
                <Row className={styles.modalBottomItem}>
                    <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                        申请描述：
                    </Col>
                    <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                        {current.hasOwnProperty('applyDescription') ? current.applyDescription : '---'}
                    </Col>
                </Row>
                <Row className={styles.modalBottomItem}>
                    <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                        申请状态：
                    </Col>
                    <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                        {current.hasOwnProperty('checkStatus') ?
                            <Badge status={T.lodash.isUndefined(EnumClusterMessageCheckStatus[current.checkStatus])? EnumClusterMessageCheckStatus['UNKNOWN'].status:EnumClusterMessageCheckStatus[current.checkStatus].status}
                                   text={current.hasOwnProperty('checkStatus') ?
                                       T.lodash.isUndefined(EnumClusterMessageCheckStatus[current.checkStatus]) ?
                                           EnumClusterMessageCheckStatus['UNKNOWN'].label
                                           : EnumClusterMessageCheckStatus[current.checkStatus].label
                                       : EnumClusterMessageCheckStatus['UNKNOWN'].label}
                            />
                            // T.lodash.isUndefined(EnumClusterMessageCheckStatus[current.checkStatus]) ? EnumClusterMessageCheckStatus['UNKNOWN'].label : EnumClusterMessageCheckStatus[current.checkStatus].label
                            : EnumClusterMessageCheckStatus['UNKNOWN'].label}
                    </Col>
                </Row>
                {messageType === 'check' ?
                    <div>
                        <Row className={styles.modalBottomItem}>
                            <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                                申请人：
                            </Col>
                            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                                {current.hasOwnProperty('applyClusterName') ? current.applyClusterName:'---'}
                            </Col>
                        </Row>
                        {
                            current.checkStatus === '0' ?
                                <Row className={styles.modalBottomItem}>
                                    <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                                        审批描述：
                                    </Col>
                                    <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                                        <TextArea rows={4} onChange={this.changeTextArea} />
                                    </Col>
                                </Row>
                                :
                                <Row className={styles.modalBottomItem}>
                                    <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                                        审批描述：
                                    </Col>
                                    <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                                        {current.hasOwnProperty('checkDescription') ? current.checkDescription:'---'}
                                    </Col>
                                </Row>
                        }
                        <Row style={{textAlign: 'center', marginTop: 28}}>
                            <Button onClick={this.handleSubmit.bind(this,'2')} disabled={current.hasOwnProperty('checkStatus') ? current.checkStatus === '0' ? false : true: false}>
                                拒绝
                            </Button>
                            <Button
                                style={{marginLeft: 20}}
                                type="primary"
                                htmlType="submit"
                                onClick={this.handleSubmit.bind(this,'1')}
                                disabled={current.hasOwnProperty('checkStatus') ? current.checkStatus === '0' ? false : true: false}
                                // loading={createStatus}
                            >
                                同意
                            </Button>
                        </Row>
                    </div>
                    :
                    <div>
                        <Row className={styles.modalBottomItem}>
                            <Col className={styles.modalBottomItemLeft} xl={8} lg={8} md={8} sm={8} xs={8}>
                                申请平台：
                            </Col>
                            <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                                {current.hasOwnProperty('remoteClusterName') ? current.remoteClusterName:'---'}
                            </Col>
                        </Row>
                    </div>
                    }

            </div>
        );
    };

    render() {
        const {
            list: {list},
            loading,
            fetchClusterMessageListStatus,
        } = this.props;
        const {
            clusterManage,
            form: {getFieldDecorator},
        } = this.props;
        const {clusterMessage} = clusterManage;
        // const {visible, done, current = {}, data, currentPage} = this.state;
        const {visible, done, current = {}, data, currentPage, messageType} = this.state;

        const editAndDelete = (key, currentItem) => {
            if (key === 'edit') this.showEditModal(currentItem);
            else if (key === 'delete') {
                Modal.confirm({
                    title: '删除任务',
                    content: '确定删除该任务吗？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => this.deleteItem(currentItem.id),
                });
            }
        };

        //消息列表的单个信息
        const Info = ({title, value, bordered}) => (
            <div className={styles.headerInfo}>
                <span>{title}</span>
                <p>{value}</p>
                {bordered && <em/>}
            </div>
        );

        //消息类型- tab
        const extraContent = (
            <div className={styles.extraContent}>
                <RadioGroup defaultValue="check" onChange={this.changeMessageType}>
                    <RadioButton value="all" disabled>全部</RadioButton>
                    <RadioButton value="check">我的待办</RadioButton>
                    <RadioButton value="apply">我的申请</RadioButton>
                </RadioGroup>
                <Search className={styles.extraContentSearch} placeholder="请输入" allowClear
                        onSearch={this.searchMessage}/>
            </div>
        );

        /*const getModalContent = () => {
            if (done) {
                return (
                    <Result
                        type="success"
                        title="操作成功"
                        description="一系列的信息描述，很短同样也可以带标点。"
                        actions={
                            <Button type="primary" onClick={this.handleDone}>
                                知道了
                            </Button>
                        }
                        className={styles.formResult}
                    />
                );
            }
            return (
                <Form onSubmit={this.handleSubmit}>
                    <FormItem label="任务名称" {...this.formLayout}>
                        {getFieldDecorator('title', {
                            rules: [{required: true, message: '请输入任务名称'}],
                            initialValue: current.title,
                        })(<Input placeholder="请输入"/>)}
                    </FormItem>
                    <FormItem label="开始时间" {...this.formLayout}>
                        {getFieldDecorator('createdAt', {
                            rules: [{required: true, message: '请选择开始时间'}],
                            initialValue: current.createdAt ? moment(current.createdAt) : null,
                        })(
                            <DatePicker
                                showTime
                                placeholder="请选择"
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{width: '100%'}}
                            />
                        )}
                    </FormItem>
                    <FormItem label="任务负责人" {...this.formLayout}>
                        {getFieldDecorator('owner', {
                            rules: [{required: true, message: '请选择任务负责人'}],
                            initialValue: current.owner,
                        })(
                            <Select placeholder="请选择">
                                <SelectOption value="付晓晓">付晓晓</SelectOption>
                                <SelectOption value="周毛毛">周毛毛</SelectOption>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...this.formLayout} label="产品描述">
                        {getFieldDecorator('subDescription', {
                            rules: [{message: '请输入至少五个字符的产品描述！', min: 5}],
                            initialValue: current.subDescription,
                        })(<TextArea rows={4} placeholder="请输入至少五个字符"/>)}
                    </FormItem>
                </Form>
            );
        };*/

        return (
            <PageHeaderWrapper>
                <div className={styles.standardList}>
                    <Card bordered={false}>
                        <Row>
                            <Col sm={8} xs={24}>
                                <Info title={<FormattedMessage id="clusterManage.clusterMessage.title.backlog"/>}
                                      value={clusterMessage.hasOwnProperty('checkCount') ? clusterMessage.checkCount : '---'}
                                      bordered/>
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title={<FormattedMessage id="clusterManage.clusterMessage.title.apply"/>}
                                      value={clusterMessage.hasOwnProperty('applyCount') ? clusterMessage.applyCount : '---'}
                                      bordered/>
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title={<FormattedMessage id="clusterManage.clusterMessage.title.complete"/>}
                                      value={clusterMessage.hasOwnProperty('finishedCount') ? clusterMessage.finishedCount : '---'}/>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        className={styles.listCard}
                        bordered={false}
                        title="任务列表"
                        style={{marginTop: 24}}
                        bodyStyle={{padding: '0 32px 40px 32px'}}
                        extra={extraContent}
                    >
                        <List
                            size="large"
                            rowKey="id"
                            loading={fetchClusterMessageListStatus}
                            // pagination={paginationProps}
                            pagination={{
                                current: currentPage,
                                onChange: this.pageChange,
                                pageSize: EnumPluginListPageInfo.defaultPageSize,
                                total: clusterMessage.hasOwnProperty('pageData') ?
                                    clusterMessage['pageData'].hasOwnProperty('count') ?
                                        Number(clusterMessage['pageData']['count'])
                                        : 0
                                    : 0
                            }}
                            dataSource={clusterMessage.hasOwnProperty('pageData') ?
                                clusterMessage['pageData'].hasOwnProperty('list') ? clusterMessage['pageData']['list'] :[]:[]}

                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <a
                                            onClick={e => {
                                                e.preventDefault();
                                                this.showEditModal(item);
                                            }}
                                        >
                                            操作
                                        </a>,
                                        <Dropdown overlay={
                                            <Menu onClick={({key}) => editAndDelete(key, item)}>
                                                <Menu.Item key="edit">编辑</Menu.Item>
                                                <Menu.Item key="delete">删除</Menu.Item>
                                            </Menu>
                                        }
                                        >
                                            <a>
                                                更多 <Icon type="down"/>
                                            </a>
                                        </Dropdown>

                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            messageType === 'check'?
                                            <Avatar size="large" style={{ color: '#fff', backgroundColor: '#3aa1ff', fontSize:'20px'}}>{item.hasOwnProperty('applyClusterName') ? T.lodash.slice(item.applyClusterName,0,1) : '-'}</Avatar>
                                                :<Avatar size="large" style={{ color: '#fff', backgroundColor: '#3aa1ff', fontSize:'20px'}}>申</Avatar>
                                        }
                                        title={<a href={item.href}>{item.name}</a>}
                                        description={item.hasOwnProperty('applyDescription') ? item.applyDescription : '---'
                                        }
                                        /*description={
                                            messageType === 'check'? item.hasOwnProperty('checkDescription') ? item.checkDescription : '---'
                                            :item.hasOwnProperty('applyDescription') ? item.applyDescription : '---'
                                        }*/
                                    />
                                    <div className={styles.listContent}>
                                        <div className={styles.listContentItem} style={{width: '150px'}}>
                                            <span>状态</span>
                                            <p><Badge status={item.hasOwnProperty('checkStatus')? EnumClusterMessageCheckStatus[item.checkStatus].status:EnumClusterMessageCheckStatus['UNKNOWN'].status}
                                                      text={item.hasOwnProperty('checkStatus') ?
                                                          T.lodash.isUndefined(EnumClusterMessageCheckStatus[item.checkStatus]) ?
                                                              EnumClusterMessageCheckStatus['UNKNOWN'].label
                                                              : EnumClusterMessageCheckStatus[item.checkStatus].label
                                                          : EnumClusterMessageCheckStatus['UNKNOWN'].label}
                                            /></p>
                                        </div>
                                        {messageType === 'check'?
                                            <div className={styles.listContentItem} style={{width: '150px'}}>
                                                <span>申请人</span>
                                                <p>{item.hasOwnProperty('applyClusterName')? item.applyClusterName:'---'}</p>
                                            </div>
                                            :<div className={styles.listContentItem} style={{width: '150px'}}>
                                                <span>申请平台</span>
                                                <p>{item.hasOwnProperty('remoteClusterName')? item.remoteClusterName:'---'}</p>
                                            </div>
                                        }

                                        <div className={styles.listContentItem}>
                                            <span>申请时间</span>
                                            <p>{item.hasOwnProperty('createTime')? T.moment(item.createTime).format('YYYY-MM-DD HH:mm'):'---'}</p>
                                        </div>
                                        <div className={styles.listContentItem}>
                                            {/*<Progress percent={item.percent} status={item.status} strokeWidth={6} style={{width: 180}}/>*/}
                                        </div>
                                    </div>
                                    {/*<ListContent data={item}/>*/}
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>

                <Modal
                    title={messageType === 'check' ? '任务操作' : '申请查看'}
                    className={styles.standardListForm}
                    width={640}
                    bodyStyle={done ? {padding: '72px 0'} : {padding: '28px '}}
                    destroyOnClose
                    visible={visible}
                    // visible={ClusterVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                    //{...modalFooter}
                >
                    {this.renderMessageModalContent(current)}

                    {/*{getModalContent()}*/}
                </Modal>
            </PageHeaderWrapper>
        );
    }
}

export default BasicList;
