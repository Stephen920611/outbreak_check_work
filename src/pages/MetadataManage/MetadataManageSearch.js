import React, {Component, Fragment} from 'react';
import router from 'umi/router';
import {connect} from 'dva';
import {Input, Switch, Route, Card, Form, Select, Table, Tabs, message, Popconfirm, Button} from 'antd';
import {FormattedMessage} from 'umi-plugin-react/locale';
import styles from './MetadataManageSearch.less'
import T from '../../utils/T';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardFormRow from '@/components/StandardFormRow';

import TagSelect from '@/components/TagSelect';
import ArticleListContent from '@/components/ArticleListContent';

const {Option} = Select;
const FormItem = Form.Item;
//固定数据

const {TabPane} = Tabs;
const columnSource = [
    {
        title: '数据源名称',
        dataIndex: 'databaseName',
        key: 'databaseName',
        width: '20%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        autoFocus
                        onChange={e => this.handleFieldChange(e, 'databaseName', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="数据源名称"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '数据源类型',
        dataIndex: 'newSourceData',
        key: 'sdataType',
        width: '20%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'sdataType', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="数据源类型"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '创建人',
        dataIndex: 'createBy',
        key: 'sperson',
        width: '20%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'sperson', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="创建人"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '创建时间',
        dataIndex: 'newDate',
        key: 'stime',
        width: '20%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'stime', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="创建时间"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '连接信息',
        dataIndex: 'url',
        key: 'sconnectInfo',
        width: '15%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'sconnectInfo', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="连接信息"
                    />
                );
            }
            return text;
        },
    },
];
const columnsTable = [
    {
        title: '表名',
        dataIndex: 'tableName',
        key: 'tableName',
        width: '20%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'tableName', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="表名"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '表描述',
        dataIndex: 'tableDes',
        key: 'tableDescribe',
        width: '15%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'tableDescribe', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="表描述"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '数据源名称',
        dataIndex: 'datasourceId',
        key: 'sname',
        width: '20%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        autoFocus
                        onChange={e => this.handleFieldChange(e, 'sname', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="数据源名称"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '数据源类型',
        dataIndex: 'newSourceData',
        key: 'sdataType',
        width: '20%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'sdataType', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="数据源类型"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '创建人',
        dataIndex: 'createBy',
        key: 'tperson',
        width: '20%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'tperson', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="创建人"
                    />
                );
            }
            return text;
        },
    },
];
const columnView = [
    {
        title: '字段名称',
        dataIndex: 'column_name',
        key: 'vname',
        width: '15%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        autoFocus
                        onChange={e => this.handleFieldChange(e, 'vname', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="字段名"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '字段描述',
        dataIndex: 'column_remark',
        key: 'vDescribe',
        width: '15%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'vDescribe', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="字段描述"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '表名',
        dataIndex: 'tableId',
        key: 'vtableName',
        width: '10%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        autoFocus
                        onChange={e => this.handleFieldChange(e, 'vtableName', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="表名"
                        disabled='true'
                    />
                );
            }
            return text;
        },
    },
    {
        title: '数据源名称',
        dataIndex: 'database',
        key: 'sname',
        width: '15%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'sname', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="数据源名称"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '数据源类型',
        dataIndex: 'newSourceData',
        key: 'dataType',
        width: '15%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'dataType', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="数据源类型"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '创建人',
        dataIndex: 'create_by',
        key: 'vperson',
        width: '10%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'vperson', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="字段中文名"
                    />
                );
            }
            return text;
        },
    },
    {
        title: '创建时间',
        dataIndex: 'newDate',
        key: 'vtime',
        width: '10%',
        render: (text, record) => {
            if (record.editable) {
                return (
                    <Input
                        value={text}
                        onChange={e => this.handleFieldChange(e, 'vtime', record.key)}
                        onKeyPress={e => this.handleKeyPress(e, record.key)}
                        placeholder="创建时间"
                    />
                );
            }
            return text;
        },
    },
];

@connect(({metadataManage, loading}) => ({
    metadataManage,
    loading: loading.models.searchData,
}))
class SearchList extends Component {
    state = {
        tableData: [],
        dataType: false,
        loading: false,
        columns: columnSource,
        inputText:'',
        tagData:[],

        dataSourceType: '',
        page: 1,
        pageSize: 10,
        text: '',
        type: '1',
        total:'',
        currentPage:'1'

    };

    getDataSourceList = ()=> {
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/getDataSourceListAction',
        });
        const {
            metadataManage,
        } = this.props;
        const {dataSourceTypeList} = metadataManage;
        // console.log(dataSourceTypeList,'dataSourceTypeList');
        this.setState({
            tagData:dataSourceTypeList
        })
    };


    handleTabChange = key => {
        const {match} = this.props;
        console.log(key);

    };
    //根据type搜索
    dataSearch = (type)=>{
        this.setState({
            type:type
        });
        let params = {
            dataSourceType: this.state.dataSourceType,
            page: this.state.page,
            pageSize: this.state.pageSize,
            text: this.state.text,
            type: type
        };
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/getDataSourceInfosAction',
            params,
        });
    };

    //搜索
    handleFormSubmit = value => {
        if(typeof (value)!="string"){
            value = '';
        }
        this.setState({
            loading:true
        });
        this.getDataSourceList();
        // 输入框的内容,1:数据源 2:表 4:字段
        // console.log(value);
        this.setState({
            inputText:value,
            text:value,
            page: 1,
        });
        let params = {
            dataSourceType: this.state.dataSourceType,
            page: this.state.page,
            pageSize: this.state.pageSize,
            text: value,
            type: this.state.type
        };
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/getDataSourceInfosAction',
            params,
        });
        this.setState({
            // data:tableData2,
            dataType: true
        })
    };
    //页码改变
    pageChange = (page) => {
        this.setState({
            currentPage: page,
        });
        // console.log(page,'page');
        let params = {
            dataSourceType: this.state.dataSourceType,
            page: page,
            pageSize: this.state.pageSize,
            text: this.state.text,
            type: this.state.type
        };
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/getDataSourceInfosAction',
            params,
        });

    };
    //给数据添加key
    dataAddKey = (datas)=>{
        let arr2=[];
        datas.map(((item, index)=> {
            arr2.push(Object.assign({},item,{key:item.id}))
        }));
        return arr2;
    };

    tagChange =(keys)=>{
        // console.log(keys.toString(),'tag');
        let params = {
            dataSourceType: keys.toString(),
            page: this.state.page,
            pageSize: this.state.pageSize,
            text: this.state.text,
            type: this.state.type
        };
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/getDataSourceInfosAction',
            params,
        });


    };

    callback = (key) => {
        //tab的key
        // console.log(key);
        switch (key) {
            case '2':
                this.setState({
                    columns: columnsTable
                });
                this.dataSearch(key);
                break;
            case '4':
                this.setState({
                    columns: columnView
                });
                this.dataSearch(key);
                break;
            case '1':
                this.setState({
                    columns: columnSource
                });
                this.dataSearch(key);
                break;

        }
    };


    render() {
        const {
            form,
            loading,
            metadataManage,
        } = this.props;
        const {searchList,searchData,dataSourceTypeList} = metadataManage;
        const total = searchData.total;

        const tabData = [
            {
                id: '1',
                title: '数据源'
            },
            {
                id: '2',
                title: '表'
            },
            // {
            //     id:'views',
            //     title:'视图'
            // },
            {
                id: '4',
                title: '字段'
            },
        ];

        const mainSearch = (
            <div style={{textAlign: 'center'}}>
                <Input.Search
                    placeholder="请输入关键词(数据源、表、字段名称)"
                    enterButton="搜索"
                    size="large"
                    onSearch={this.handleFormSubmit}
                    // style={{ maxWidth: 522, width: '100%' }}
                    style={{maxWidth: 722, width: '100%'}}
                />
            </div>
        );
        const actionsTextMap = {
            expandText: <FormattedMessage id="component.tagSelect.expand" defaultMessage="Expand"/>,
            collapseText: (
                <FormattedMessage id="component.tagSelect.collapse" defaultMessage="Collapse"/>
            ),
            selectAllText: <FormattedMessage id="component.tagSelect.all" defaultMessage="All"/>,
        };

        const {match, children, location} = this.props;
        // const {getFieldDecorator} = form;
        const {data, dataType} = this.state;


        return (
            <Fragment>
                <PageHeaderWrapper
                    title="搜索列表"
                    content={mainSearch}
                    // tabList={tabList}
                    // tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
                    onTabChange={this.handleTabChange}
                >
                </PageHeaderWrapper>
                {
                    dataType ? <Fragment>
                            <Card bordered={false} style={{marginTop: 24}}>
                                <Form layout="inline">
                                    <StandardFormRow title="所属类目" block style={{paddingBottom: 11}}>
                                        <FormItem>
                                            <TagSelect expandable actionsText={actionsTextMap} onChange={this.tagChange}>
                                                {dataSourceTypeList.map(dataSourceTypeList => (
                                                    <TagSelect.Option value={dataSourceTypeList.id}
                                                                      key={dataSourceTypeList.id}>{dataSourceTypeList.name}</TagSelect.Option>
                                                ))}
                                            </TagSelect>
                                        </FormItem>
                                    </StandardFormRow>
                                </Form>
                            </Card>
                            <Tabs defaultActiveKey="datas" onChange={this.callback}>
                                {tabData.map(tabData => (
                                    <TabPane key={tabData.id} tab={tabData.title}>
                                        <Table
                                            className={styles.tableColor}
                                            loading={loading}
                                            columns={this.state.columns}
                                            dataSource={this.dataAddKey(searchList)}
                                            // dataSource={this.state.tableData}
                                            pagination={{
                                                // current: this.state.page,
                                                onChange: this.pageChange,
                                                pageSize: this.state.pageSize,
                                                // pageSize: 1,
                                                total:total,
                                                showTotal:total => `共 ${total} 条数据`,
                                            }}
                                            rowClassName={record => (record.editable ? styles.editable : '')}
                                        />
                                    </TabPane>
                                ))}
                            </Tabs>,
                        </Fragment>
                        : <Fragment>
                            <div className={styles.allBtn}>
                                <Button type="primary" className={styles.btn} onClick={this.handleFormSubmit}>查看总览</Button>
                                <p>查看所有已创建的数据库信息</p>
                            </div>
                        </Fragment>
                }
            </Fragment>
        );
    }
}

export default SearchList;
