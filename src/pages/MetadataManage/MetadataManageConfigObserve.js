import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import T from './../../utils/T';
import {
    EnumQuickRegisterParams,
} from './../../constants/dataSync/EnumSyncConfigModal';
import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Tooltip,
    InputNumber,
    DatePicker,
    Radio,
    Tree,
    Spin,
    Table
} from 'antd';

const {TreeNode, DirectoryTree} = Tree;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;

import styles from './DataSourceQuickRegister.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录

/* eslint react/no-multi-comp:0 */
@connect(({metadataManage, loading}) => ({
    metadataManage,
    loading: loading.models.metadataManageList,
}))
@Form.create()
class QuickRegister extends PureComponent {
    state = {
        metadataType: {   //存储选择的数据源信息
            children: [],
            title: ""
        },
        currentPage: EnumDataSyncPageInfo.defaultPage,//分页
    };

    componentDidMount() {
        const {dispatch} = this.props;
        //默认获取树接口
        dispatch({
            type: 'metadataManage/getTableListAction',
        });
    }

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };

    //页码变换
    pageChange = page => {
        this.setState(
            {
                currentPage: page,
            },
            () => {
                this.fetchDataList();
            }
        );
    };



    render() {
        const {
            fetchTreeStatus,
            savingStatus,
            testStatus,
            metadataManage,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {metadataManageList,tableDataList} = metadataManage;

        const {metadataType,currentPage} = this.state;
        const columns = [
            {
                title: 'id',
                dataIndex: 'key',
                key: 'key',
                // width: '10%',
            },
            {
                title: '字段名',
                dataIndex: 'columnName',
                key: 'columnName',
                // width: '20%',
                render: (text, record) => {
                    if (record.editable) {
                        return (
                            <Input
                                value={text}
                                autoFocus
                                onChange={e => this.handleFieldChange(e, 'columnName', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder="字段名"
                            />
                        );
                    }
                    return text;
                },
            },
            {
                title: '字段中文名',
                dataIndex: 'columnRemark',
                key: 'columnRemark',
                // width: '20%',
                render: (text, record) => {
                    if (record.editable) {
                        return (
                            <Input
                                value={text}
                                onChange={e => this.handleFieldChange(e, 'columnRemark', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder="字段中文名"
                            />
                        );
                    }
                    return text;
                },
            },
            {
                title: '数据类型',
                dataIndex: 'typeName',
                key: 'typeName',
                // width: '20%',
                render: (text, record) => {
                    if (record.editable) {
                        return (
                            <Input
                                value={text}
                                onChange={e => this.handleFieldChange(e, 'typeName', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder="数据类型"
                            />
                        );
                    }
                    return text;
                },
            },
            {
                title: '数据长度',
                dataIndex: 'columnSize',
                key: 'columnSize',
                // width: '15%',
                render: (text, record) => {
                    if (record.editable) {
                        return (
                            <Input
                                value={text}
                                onChange={e => this.handleFieldChange(e, 'columnSize', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder="数据长度"
                            />
                        );
                    }
                    return text;
                },
            },
            {
                title: '默认值',
                dataIndex: 'defaultNum',
                key: 'defaultNum',
                render: (text, record) => {
                    if (record.editable) {
                        return (
                            <Input
                                value={text}
                                onChange={e => this.handleFieldChange(e, 'defaultNum', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder="默认值"
                            />
                        );
                    }
                    return text;
                },
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                render: (text, record) => {
                    if (record.editable) {
                        return (
                            <Input
                                value={text}
                                onChange={e => this.handleFieldChange(e, 'updateTime', record.key)}
                                onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder="更新时间"
                            />
                        );
                    }
                    return text;
                },
            },
        ];


        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 7},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
                md: {span: 10},
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 10, offset: 7},
            },
        };
        return (
            <PageHeaderWrapper title="自动探查页">
                <Table
                    // loading={loading}
                    columns={columns}
                    dataSource={tableDataList}
                    pagination={false}
                    // pagination={{
                    //     current: currentPage,
                    //     onChange: this.pageChange,
                    //     pageSize: EnumDataSyncPageInfo.defaultPageSize,
                    //     // total: sourceProcessorsList.hasOwnProperty('total') ? Number(sourceProcessorsList.total) + 1 : 0,
                    // }}
                />
                <div style={{textAlign : 'center',marginTop:24}}>
                    <Button
                        style={{marginLeft: 8}}
                        type="primary"
                        htmlType="submit"
                    >
                        <FormattedMessage id="metadataManage.btn.save"/>
                    </Button>
                </div>
                {/*<Button
                                style={{width: '100%', marginTop: 16, marginBottom: 8}}
                                type="dashed"
                                onClick={this.newMember}
                                icon="plus"
                            >
                                添加
                            </Button>*/}

            </PageHeaderWrapper>
        );
    }
}


export default QuickRegister;
