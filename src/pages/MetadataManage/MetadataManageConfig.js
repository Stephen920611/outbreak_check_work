import React, {Component, PureComponent} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import T from './../../utils/T';
import styles from './MetadataManageConfig.less';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Tree,
    message,
    Divider,
    Button,
    Table,
    Popconfirm,
    Avatar,
    Spin,
    Layout,
    Affix,
} from 'antd';

const {TreeNode, DirectoryTree} = Tree;
const {Meta} = Card;
const {Search} = Input;
const {Sider, Content} = Layout;
const FormItem = Form.Item;

import SyncAddMetadataModal from './SyncAddMetadataModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录
import testMysql from './../DataSync/imgs/testMysql.jpg';

/* eslint react/no-multi-comp:0 */
@connect(({metadataManage, loading}) => ({
    metadataManage,
    fetchDataStatus: loading.effects['metadataManage/getDataResourceAction'],
    fetchTreeStatus: loading.effects['metadataManage/getDataResourceTreeAction'],
    fetchTreeNodeStatus: loading.effects['metadataManage/getTableOrViewByIdAction'],
}))
@Form.create()
class DataManage extends PureComponent {
    cacheOriginData = {};

    state = {
        loading: false,
        dataType: {
            children: [],
            name: ""
        },
        tableOrViewDetail: {},//视图或者表的详情
        dataManageSourceList: [],//数据源列表

        //上面的是之前用的，暂时不删除，跟保存功能都没删除，防止用到
        treeHeight: '100%', //树高度
        tableData: [],//存储列表与model的tableDataList一样
        newData: [],    //过滤的数组
        keyIndex: 0,    //序号下标
        selectedRowKeys: [],    //多选的key值
        autoExpandParent: true,     //是否自动展开
    };

    componentDidMount() {
        const {dispatch, location} = this.props;
        this.screenChange();
        //获取树
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/getMetaDataTreeAction',
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                this.setState({
                    treeHeight: window.innerHeight - 141,
                })
            } else {
                T.prompt.error(response.message);
            }
        });
        //如果是跳转过来的路由，默认获取跳转过来的查看元数据的信息
        if ((location.hasOwnProperty("params") && location.params.hasOwnProperty("isRouterPush") && location.params.isRouterPush)) {
            this.fetchData(location.params.key.id)
        }
    };

    componentWillReceiveProps(nextProps) {
        const {metadataManage} = nextProps;
        const {metaDataTableList} = metadataManage;
        if (metaDataTableList !== this.props.metadataManage.metaDataTableList) {
            this.setState({
                tableData: metaDataTableList,
                keyIndex: metaDataTableList.length
            })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize.bind(this));//移除监听窗口变化
        //销毁异步请求
        this.setState = (state, callback) => {
            return;
        };
    };

    /**
     * 根据树的id获取所有信息
     * @param id
     */
    fetchData = (id) => {
        const {dispatch, metadataManage} = this.props;
        const {metaDataOldTreeData,} = metadataManage;
        //树选择的key
        let treeKey = [];
        treeKey.push(id);
        //展开的数据
        let expandTreeKeys = T.helper.getTreeExpandKeys(id, metaDataOldTreeData, []);
        dispatch({
            type: 'metadataManage/setMetaDataSelectTreeKeyAction',
            metaDataSelectTreeKey: treeKey,
        });
        dispatch({
            type: 'metadataManage/setMetaDataExpandTreeKeyAction',
            metaDataExpandTreeKey: expandTreeKeys,
        });
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/getDataResourceAction',
                id: id,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                let tableList = response.data.dataFieldList.map( (val,idx) => {
                    return {
                        ...val,
                        columnName: val.name,   // 字段名
                        columnRemark: val.description,  // 中文名称
                        typeName: val.type,   // 字段类型
                        columnSize: val.length,   // 长度
                        rank: val.order,   // 排序
                        key: idx + 1,
                    }
                });
                dispatch({
                    type: 'metadataManage/setMetaDataByIdAction',
                    metaDataById: response.data,
                });
                dispatch({
                    type: 'metadataManage/setMetaDataTableListAction',
                    metaDataTableList: tableList,
                });
            } else {
                T.prompt.error(response.message);
                dispatch({
                    type: 'metadataManage/setMetaDataByIdAction',
                    metaDataById: {},
                });
            }

        });
    };

    //添加事件监听
    screenChange = () => {
        window.addEventListener('resize', this.handleResize.bind(this));//监听窗口变化
    };

    //监听屏幕变化，获取屏幕的宽度和高度
    handleResize = e => {
        this.setState({
            treeHeight: e.target.innerHeight - 141
        })
    };

    //新增加一条记录
    addRow = (values) => {
        const {tableData, keyIndex} = this.state;
        tableData.push({
            key: keyIndex + 1,
            columnName: values.columnName,
            columnRemark: values.columnRemark,
            typeName: values.typeName,
            columnSize: values.columnSize,
            defaultValue: values.defaultValue,
            updateDate: '',
            editable: true,
        });
        this.setState({
            tableData,
            keyIndex: keyIndex + 1
        });
    };

    //保存当前所有记录
    saveData = () => {
        const {tableData} = this.state;
        const {dispatch, location, metadataManage} = this.props;
        const {metaDataById} = metadataManage;
        //TODO 未完成，没有接口现在
        console.log('tableData',tableData);
        console.log('metaDataById',metaDataById);
        let params = {
            id:metaDataById.id,
            tableData:tableData
        };
        //发送接口
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/saveResourceMetaDataAction',
                // params:params,
                id:metaDataById.id,
                dataFields:tableData,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                T.prompt.success(response.data);
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //搜索框更改
    onSearchChangeValue = (value) => {
        // const { value } = e.target;
        console.log(value);
    };

    //显示新建数据源弹窗
    showAddMetadataModel = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/changeDataResourceModalVisibleAction',
            htmlType: 'metadataManageConfig',
            modalVisible: true,
        });
    };

    //TODO
    //自动探查
    detection = () => {
        const {dispatch,metadataManage} = this.props;
        const {metaDataById} = metadataManage;
        const {tableData,} = this.state;
        let params = {
            id:metaDataById.hasOwnProperty('dataSourceId') ? metaDataById.dataSourceId : '',
            name:metaDataById.hasOwnProperty('name') ? metaDataById.name : '',
        };
        new Promise((resolve, reject) => {
            dispatch({
                type: 'metadataManage/mataDataAutoExplorationAction',
                params,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                //将两个数组拼接起来
                let endData = T.lodash.concat(tableData, response.data);
                this.setState({
                    tableData: endData
                })
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    //TODO
    //差异分析
    compareData = () => {
        router.push({
            pathname: '/metadataManage/metadataManageConfig/metadataManageConfigDifferent',
            params: {
                isRouterPush: true,
            },
        });
    };

    //TODO 暂时不需要
    //保存更改的字段名
    saveRow = (e, key) => {
        e.persist();
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            if (this.clickedCancel) {
                this.clickedCancel = false;
                return;
            }
            const target = this.getRowByKey(key) || {};
            if (!target.columnName || !target.columnRemark || !target.typeName || !target.columnSize || !target.defaultValue || !target.updateDate) {
                T.prompt.error('请填写完整成员信息。');
                e.target.focus();
                this.setState({
                    loading: false,
                });
                return;
            }
            delete target.isNew;
            this.toggleEditable(e, key);
            // const { tableData } = this.state;
            // const { onChange } = this.props;

            // onChange(tableData);
            this.setState({
                loading: false,
            });
        }, 500);
    };

    //TODO 暂时不需要
    //handleKeyPress:键盘事件，Enter 保存
    handleKeyPress = (e, key) => {
        if (e.key === 'Enter') {
            this.saveRow(e, key);
        }
    };

    //修改（暂时不用）
    handleFieldChange = (e, fieldName, key) => {
        const {tableData} = this.state;
        const newData = tableData.map(item => ({...item}));
        const target = this.getRowByKey(key, newData);
        if (target) {
            target[fieldName] = e.target.value;
            this.setState({tableData: newData});
        }
    };

    //getRowByKey:通过key值获取整行数据
    getRowByKey = (key, newData) => {
        const {tableData} = this.state;
        return (newData || tableData).filter(item => item.key === key)[0];
    };

    //TODO 暂时不需要
    //编辑
    toggleEditable = (e, key) => {
        e.preventDefault();
        const {tableData} = this.state;
        const newData = tableData.map(item => ({...item}));
        const target = this.getRowByKey(key, newData);
        if (target) {
            // 进入编辑状态时保存原始数据
            if (!target.editable) {
                this.cacheOriginData[key] = {...target};
            }
            target.editable = !target.editable;
            this.setState({tableData: newData});
        }
    };

    /**
     * 删除
     * @param {boolean} isSingle 是否是删除一行，
     * @param key 如果是删除一行的话，就需要key
     */
    remove = (isSingle = false, key) => {
        const {tableData, selectedRowKeys} = this.state;
        //单选删除
        if (isSingle) {
            const newData = tableData.filter(item => item.key !== key);
            this.setState({tableData: newData});
        } else {
            //多选删除
            let endData = [];
            tableData.map(val => {
                if (selectedRowKeys.indexOf(val.key) === -1) {
                    endData.push(val)
                }
            });
            this.setState({tableData: endData});
        }
    };

    /**
     * 展开树操作
     * @param {array} expandedKeys
     */
    onExpand = expandedKeys => {
        const {dispatch} = this.props;
        this.setState({
            autoExpandParent: false,
        });
        let endData = [];
        endData.push(expandedKeys[expandedKeys.length - 1]);
        dispatch({
            type: 'metadataManage/setMetaDataExpandTreeKeyAction',
            metaDataExpandTreeKey: expandedKeys,
        });
    };

    // 选择树的子节点
    onSelect = (key, event) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'metadataManage/setMetaDataSelectTreeKeyAction',
            metaDataSelectTreeKey: key,
        });
        if( !(event.node.props.children.length > 0) ){
            this.fetchData(event.node.props.id)
        }
        //TODO 之前的，留着备份，防止以后还要用
        // const {dataManageSourceList} = this.state;
        // //判断是否是表和视图，不是获取数据库下表和视图列表，追加到树中
        // if (event.node.props.databaseName) {
        //     console.log(event.node.props,'event.node.props');
        //     dispatch({
        //         type: 'metadataManage/getTableOrViewByIdAction',
        //         params: {
        //             datasourceId: key[0],
        //         },
        //     });
        // }
        //
        // //判断点击的是否为表tableName或视图columnName
        // if (event.node.props.tableName || event.node.props.columnName) {
        //     // console.log('event',event.node.props.datasourceId);
        //     //根据点击，表的datasourceId 来显示数据源的信息
        //     dataManageSourceList.map((item, index) => {
        //         if (item.id === event.node.props.datasourceId) {
        //             console.log(item,'item');
        //         }
        //     });
        //     //表格的详细信息
        //     this.setState({
        //         tableOrViewDetail: event.node.props,
        //     });
        //
        //     //获取表格列表
        //     let params = {
        //         id: key[0]
        //     };
        //     new Promise((resolve, reject) => {
        //         dispatch({
        //             type: 'metadataManage/getTableInfosByIdAction',
        //             params,
        //             resolve,
        //             reject,
        //         });
        //     }).then(response => {
        //         if (response.result === 'true') {
        //
        //         } else {
        //             T.prompt.error(response.message);
        //         }
        //     });
        //
        // } else {
        //     this.setState({
        //         tableOrViewDetail: {}
        //     });
        // }
        //
        // //暂时未使用
        // const {dataType} = this.state;
        // //点击选中事件，属性可以打印查看
        // const eventData = event.node.props;
        // this.setState({
        //     dataType: eventData
        // });
        // //不是当前的就清空表单
        // if (eventData.hasOwnProperty("title") && eventData.title !== dataType.title) {
        //     this.props.form.resetFields();
        // }
        // this.setState({
        //     dataType: eventData
        // });

    };

    //renderTreeNodes:渲染树（暂时不用）
    /*renderTreeNodes1 = data => {
        return data.map(item => {
            if (item.children) {
                if (item.databaseName) {
                    return (
                        <TreeNode {...item} dataRef={item} title={item.databaseName ? item.databaseName : '---'} key={item.key ? item.key : item.id}>
                            {this.renderTreeNodes(item.children)}
                        </TreeNode>)
                }
                return (
                    <TreeNode {...item} dataRef={item} title={item.title ? item.title : item.name} key={item.key ? item.key : item.id || item.code}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            if (item.databaseName) {
                return <TreeNode {...item} isLeaf title={item.databaseName ? item.databaseName : item.name} key={item.key ? item.key : item.id}/>;
            } else {
                return <TreeNode  {...item} isLeaf title={item.title ? item.title : item.name} key={item.key ? item.key : item.id}/>;
            }
        });
    };*/

    //渲染树
    renderTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode {...item} dataRef={item} title={item.title} key={item.key}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>)
            }
            return <TreeNode {...item} isLeaf title={item.title} key={item.key}/>;
        });
    };

    // 单位树点击父节点异步加载子单位的数据（暂时不用）
    onLoadData = (treeNode) => {
        // console.log('treeNode',treeNode);
        // props 中的数据源 unitTreeData
        const {dispatch, metadataManageList} = this.props;

        if (treeNode.props.dataRef.databaseName) {
            dispatch({
                type: 'metadataManage/getTableOrViewListAction',
                params: {
                    key: treeNode.props.eventKey
                },
            });

        }
        /*if(T.lodash.startsWith(key, 'TABLE')&&event.node.props.databaseId){
            dispatch({
                type: 'metadataManage/getTablesOrViewsByIdAction',
                params:{
                    tableType:'TABLE',
                    datasourceId:event.node.props.databaseId
                } ,
            });
        }*/
        // 调后台接口传递的参数
        const params = {
            // 点击的节点Id
            parentId: treeNode.props.dataRef.value
        };
        // 发送 action 请求
        // 遍历 unitTreeData 将其 value 属性值赋予 key ,使 key 等于 value
        // metadataManageList.forEach( item => {item.key = item.value});
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            // unitTree为命名空间，fetch 为effects 中的方法
            dispatch({
                type: 'unitTree/fetch',
                payload: params,

                // 回调函数，防止请求的数据不同步
                callback: () => {
                    const {metadataManageList} = this.props;

                    treeNode.props.dataRef.children = metadataManageList;
                    // treeData 为数据源
                    this.setState({treeData: metadataManageList});
                }
            });
            resolve()
        });
    };

    render() {
        const {tableData, autoExpandParent} = this.state;
        const {
            metadataManage,
            fetchTreeStatus,
            fetchDataStatus
        } = this.props;
        const {
            metaDataTreeData,
            metaDataById,
            metaDataSelectTreeKey,
            metaDataExpandTreeKey,
        } = metadataManage;
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
                editable: true,
                render: (text, record) => {
                    if (record.editable) {
                        return (
                            <Input
                                value={text}
                                onChange={e => this.handleFieldChange(e, 'columnRemark', record.key)}
                                // onKeyPress={e => this.handleKeyPress(e, record.key)}
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
            {
                title: '排序',
                dataIndex: 'rank',
                key: 'rank',
                // width: '20%',
                editable: true,
                render: (text, record) => {
                    if (record.editable) {
                        return (
                            <Input
                                value={text}
                                onChange={e => this.handleFieldChange(e, 'rank', record.key)}
                                // onKeyPress={e => this.handleKeyPress(e, record.key)}
                                placeholder="排序"
                            />
                        );
                    }
                    return text;
                },
            },
            {
                title: '操作',
                key: 'action',
                width: '15%',
                render: (text, record) => {
                    return (
                        <span>
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(true, record.key)}>
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                    );
                },
            },
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                //多选所选择的key值
                this.setState({
                    selectedRowKeys
                })
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        // console.log('metaDataById',metaDataById);
        const {treeHeight} = this.state;
        return (
            <PageHeaderWrapper title="管理元数据">
                <Row gutter={24}>
                    <Col xl={6} lg={7} md={8} sm={24} xs={24}
                         className={styles.treeContent}
                    >
                        <Affix offsetTop={90}>
                            <Card
                                title='数据源类型'
                                bordered={false}
                                style={{
                                    width: '100%',
                                    // height: treeHeight,
                                    height: treeHeight,
                                    maxHeight: treeHeight
                                }}
                                className={styles.tree}
                            >
                                {
                                    fetchTreeStatus && (treeHeight === '100%') ? <Spin/> :
                                        <div>
                                            <Search
                                                style={{marginBottom: 8}}
                                                placeholder="Search"
                                                onSearch={this.onSearchChangeValue}
                                            />
                                            <DirectoryTree
                                                multiple
                                                defaultExpandAll
                                                onSelect={this.onSelect}
                                                onExpand={this.onExpand}
                                                selectedKeys={metaDataSelectTreeKey}
                                                expandedKeys={metaDataExpandTreeKey}
                                                autoExpandParent={autoExpandParent}
                                            >
                                                {this.renderTreeNodes(metaDataTreeData)}
                                            </DirectoryTree>
                                        </div>
                                }
                            </Card>
                        </Affix>
                    </Col>
                    {/*// !dataType.hasOwnProperty("children") && <Col xl={19} lg={18} md={17} sm={24} xs={24}>*/}
                    <Col xl={18} lg={17} md={16} sm={24} xs={24}>
                        <Card loading={fetchDataStatus}>
                            <div>
                                <Meta
                                    avatar={
                                        <Avatar src={testMysql}/>
                                    }
                                    title={"数据源：" + (metaDataById.hasOwnProperty('dataSource') ? metaDataById.dataSource.hasOwnProperty('name') ? metaDataById.dataSource.name : '---' : '---')}
                                    // title={tableOrViewData.dataSourceName?tableOrViewData.dataSourceName:'---'}
                                    description={
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <div>
                                                    创建人: {metaDataById.hasOwnProperty('dataSource') ? metaDataById.dataSource.hasOwnProperty('createBy') ? metaDataById.dataSource.createBy : '---' : '---'}</div>
                                            </Col>
                                            <Col span={12}>
                                                <div>
                                                    创建时间: {metaDataById.hasOwnProperty('dataSource') ? metaDataById.dataSource.hasOwnProperty('createDate') ? metaDataById.dataSource.createDate : '---' : '---'}</div>
                                            </Col>
                                        </Row>
                                    }
                                />
                            </div>
                        </Card>
                        <Card
                            bordered={false}
                            style={{marginTop: 24}}
                            className={styles.card}
                            loading={fetchDataStatus}
                        >
                            <div className={styles.title}>
                                资源名称：{metaDataById.hasOwnProperty('name') ? metaDataById.name : '---'}</div>
                            <div className={styles.cardLine}>
                                <Row gutter={24}>
                                    <Col
                                        span={12}>资源类型：{metaDataById.hasOwnProperty('dataResourceCategory') ? metaDataById.dataResourceCategory.hasOwnProperty('treeNames') ? metaDataById.dataResourceCategory.treeNames : '---' : '---'}</Col>
                                    <Col
                                        span={12}>资源编码：{metaDataById.hasOwnProperty('dataResourceCategory') ? metaDataById.dataResourceCategory.hasOwnProperty('id') ? metaDataById.dataResourceCategory.id : '---' : '---'}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col
                                        span={12}>创建人：{metaDataById.hasOwnProperty('createBy') ? metaDataById.createBy : '---'}</Col>
                                    <Col
                                        span={12}>创建时间：{metaDataById.hasOwnProperty('createDate') ? metaDataById.createDate : '---'}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col
                                        span={24}>资源描述：{metaDataById.hasOwnProperty('remarks') ? metaDataById.remarks : '---'}</Col>
                                </Row>
                            </div>
                        </Card>
                        {/*<div className={styles.metaDataTitle}>元数据信息</div>*/}
                        <Row gutter={24} className={styles.metadataManageBtn}>
                            <Button type="primary" onClick={this.showAddMetadataModel} disabled={metaDataById.hasOwnProperty('name') ? false : true}>
                                <FormattedMessage id="metadataManage.btn.add"/>
                            </Button>
                            <Button type="default" onClick={this.saveData} disabled={metaDataById.hasOwnProperty('name') ? false : true}>
                                <FormattedMessage id="metadataManage.btn.save"/>
                            </Button>
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove()}>
                                <Button type="danger" disabled={metaDataById.hasOwnProperty('name') ? false : true}>
                                    <FormattedMessage id="metadataManage.btn.delete"/>
                                </Button>
                            </Popconfirm>
                            <Button
                                type="primary"
                                onClick={this.detection}
                                disabled={metaDataById.hasOwnProperty('name') ? false : true}
                                // disabled={tableData.length > 0 ? true : false}
                            >
                                <FormattedMessage id="metadataManage.btn.detection"/>
                            </Button>
                            <Button
                                type="primary"
                                onClick={this.compareData}
                                disabled={metaDataById.hasOwnProperty('name') ? false : true}
                            >
                                <FormattedMessage id="metadataManage.btn.compare"/>
                            </Button>
                        </Row>
                        <div className={styles.dataSourceTableList}>
                            <Card bordered={false}>
                                <Table
                                    loading={fetchDataStatus}
                                    columns={columns}
                                    rowSelection={rowSelection}
                                    dataSource={tableData}
                                    pagination={false}
                                    rowClassName={record => (record.editable ? styles.editable : '')}
                                />
                                {/*<Button
                                style={{width: '100%', marginTop: 16, marginBottom: 8}}
                                type="dashed"
                                onClick={this.newMember}
                                icon="plus"
                            >
                                添加
                            </Button>*/}
                            </Card>
                        </div>


                    </Col>
                </Row>
                <SyncAddMetadataModal
                    addRow={this.addRow}
                />
            </PageHeaderWrapper>
        );
    }
}


export default DataManage;
