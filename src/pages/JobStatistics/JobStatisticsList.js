// ResourceList
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import T from './../../utils/T';
import router from 'umi/router';
import {
    EnumQuickRegisterParams,
} from './../../constants/dataSync/EnumSyncConfigModal';
import {EnumDataSyncPageInfo} from './../../constants/EnumPageInfo';
import {EnumDataSourceStatus} from './../../constants/dataSync/EnumSyncCommon';
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
    Table,
    Divider,
    Popconfirm,
    TreeSelect,
    Collapse,
} from 'antd';

const {TreeNode, DirectoryTree} = Tree;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;
const {Panel} = Collapse;

import styles from './JobStatisticsList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录

//数据分发页面
/* eslint react/no-multi-comp:0 */
@connect(({jobStatistics, loading}) => ({
    jobStatistics,
    fetchJobStatisticsListStatus: loading.effects['jobStatistics/fetchJobStatisticsListAction'],
}))
// class JobStatisticsList
@Form.create()
class JobStatisticsList extends PureComponent {
    state = {
        currentPage: EnumDataSyncPageInfo.defaultPage,//分页
        selectRows: [], //选择的数据列
        selectedKey: 'GA',//树节点默认选中的值
        selectedArea: '烟台市',//树节点默认选中的地区名字，用来后台获取参数
        tableData: [],  //表格数据
        treeData: [
            {
                children: [
                    {
                        id: "GA001",
                        key: "GA001",
                        name: "芝罘区",
                        pId: "GA",
                        title: "芝罘区",
                    },
                    {
                        id: "GA002",
                        key: "GA002",
                        name: "福山区",
                        pId: "GA",
                        title: "福山区",
                    },
                    {
                        id: "GA003",
                        key: "GA003",
                        name: "莱山区",
                        pId: "GA",
                        title: "莱山区",
                    },
                    {
                        id: "GA004",
                        key: "GA004",
                        name: "牟平区",
                        pId: "GA",
                        title: "牟平区",
                    },
                    {
                        id: "GA005",
                        key: "GA005",
                        name: "海阳市",
                        pId: "GA",
                        title: "海阳市",
                    },
                    {
                        id: "GA006",
                        key: "GA006",
                        name: "莱阳市",
                        pId: "GA",
                        title: "莱阳市",
                    },
                    {
                        id: "GA007",
                        key: "GA007",
                        name: "栖霞市",
                        pId: "GA",
                        title: "栖霞市",
                    },
                    {
                        id: "GA008",
                        key: "GA008",
                        name: "蓬莱市",
                        pId: "GA",
                        title: "蓬莱市",
                    },
                    {
                        id: "GA009",
                        key: "GA009",
                        name: "长岛县",
                        pId: "GA",
                        title: "长岛县",
                    },
                    {
                        id: "GA010",
                        key: "GA010",
                        name: "龙口市",
                        pId: "GA",
                        title: "龙口市",
                    },
                    {
                        id: "GA011",
                        key: "GA011",
                        name: "招远市",
                        pId: "GA",
                        title: "招远市",
                    },
                    {
                        id: "GA012",
                        key: "GA012",
                        name: "莱州市",
                        pId: "GA",
                        title: "莱州市",
                    },
                    {
                        id: "GA013",
                        key: "GA013",
                        name: "开发区",
                        pId: "GA",
                        title: "开发区",
                    },
                    {
                        id: "GA014",
                        key: "GA014",
                        name: "高新区",
                        pId: "GA",
                        title: "高新区",
                    },
                    {
                        id: "GA015",
                        key: "GA015",
                        name: "保税港区",
                        pId: "GA",
                        title: "保税港区",
                    },
                    {
                        id: "GA016",
                        key: "GA016",
                        name: "昆嵛山保护区",
                        pId: "GA",
                        title: "昆嵛山保护区",
                    },
                ],
                id: "GA",
                key: "GA",
                name: "烟台市",
                pId: "0",
                title: "烟台市",
            }
        ],
        dataSource: [
            {
                key: 1,
                totalNum: 10,
                returnNum: 20,
                closeContactsNum: 30,
                partyNum: 40,
                keyEpidemicAreasNum: 50,
                abnormalPhysicalConditionsNum: 60,
                quarantinedOnThatDayNum: 70,
                isolatedTotalNum: 80,
                quarantinedAtHomeOnThatDayNum: 90,
                atHomeTotalNum: 100,
                isolatedTotalNumEdit:false,
                isolatedTotalNumFirst:true,
                atHomeTotalNumEdit:false,
                atHomeTotalNumFirst:true,
            }
        ],
    };

    componentDidMount() {
        const {dispatch, location} = this.props;
        this.fetchDataList();
    }

    //获取当前页数数据
    fetchDataList = () => {
        const {dispatch, form} = this.props;
        const {currentPage, selectedArea} = this.state;
        let self = this;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let loginInfo = T.auth.getLoginInfo();

                let params = {
                    // current: currentPage,
                    // size: EnumDataSyncPageInfo.defaultPageSize,
                    start: T.lodash.isUndefined(values.startDate) ? '' : values.startDate === null ?  '' : T.helper.dateFormat(values.startDate,'YYYY-MM-DD'),      //开始时间
                    end: T.lodash.isUndefined(values.endDate) ? '' : values.endDate === null ?  '' : T.helper.dateFormat(values.endDate,'YYYY-MM-DD'),      //开始时间
                    area: T.auth.isAdmin() ? selectedArea === "烟台市" ? '' : selectedArea : loginInfo.data.area,           //县市区(烟台市传空)
                };
                new Promise((resolve, reject) => {
                    dispatch({
                        type: 'jobStatistics/fetchJobStatisticsListAction',
                        params,
                        resolve,
                        reject,
                    });
                }).then(response => {
                    if (response.code === 0) {
                        let endData = response.data.map( (val,idx) => {
                            return {
                                ...val,
                                key: idx + 1,
                                index: idx + 1,
                            }
                        });
                        self.setState({
                            tableData: endData,
                        })
                    } else {
                        T.prompt.error(response.msg);
                    }
                });
            }
        });
    };

    handleMapChange(e, fieldName, key) {
        const {tableData} = this.state;
        const newData = tableData.map(item => ({...item}));
        const target = this.getRowByKey(key, newData);
        if (target) {
            target[fieldName] = e.target.value;
            this.setState({tableData: newData});
        }
    };

    getRowByKey(key, newData) {
        const {dataSource} = this.state;
        return (newData || dataSource).filter(item => item.key === key)[0];
    }

    handleKeyPress(e,fieldName,key){
        const {dataSource} = this.state;
        const newData = dataSource.map(item => ({...item}));
        const target = this.getRowByKey(key, newData);
        if (target) {
            if(fieldName==='isolatedTotalNum'){
                target['isolatedTotalNumEdit'] = false;
                target['isolatedTotalNumFirst'] = false;
            }else{
                target['atHomeTotalNumEdit'] = false;
                target['atHomeTotalNumFirst'] = false;
            }

            this.setState({dataSource: newData});
        }
    }
    showEdit(e,fieldName, key) {
        const {dataSource} = this.state;
        const newData = dataSource.map(item => ({...item}));
        const target = this.getRowByKey(key, newData);
        if (target) {
            if(fieldName==='isolatedTotalNum'){
                target['isolatedTotalNumEdit'] = true;
                // target['isolatedTotalNumFirst'] = false;
            }else{
                target['atHomeTotalNumEdit'] = true;
                // target['atHomeTotalNumFirst'] = false;
            }
            // target['edit'] = true;
            this.setState({dataSource: newData});
        }
    };

    //重置表单
    resetDataSource = () => {
        this.props.form.setFieldsValue({
            startDate: null,
            endDate: null,
        });
        // this.props.form.resetFields();
        this.fetchDataList();
    };

    //树选择
    onSelect = (keys, event) => {
        //点击选中事件，属性可以打印查看
        const eventData = event.node.props;
        let self = this;
        this.setState({
            selectedKey: keys[0],
            selectedArea: eventData.name
        }, () => {
            self.fetchDataList()
        });
    };

    //渲染树节点
    renderTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode {...item} dataRef={item} title={item.name} key={item.id}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item} title={item.name} key={item.id} isLeaf/>;
        });
    };

    //渲染select树节点
    renderSelectTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeSelect.TreeNode {...item} dataRef={item} title={item.name} value={item.name} key={item.id}>
                        {this.renderSelectTreeNodes(item.children)}
                    </TreeSelect.TreeNode>
                );
            }
            return <TreeSelect.TreeNode {...item} dataRef={item} title={item.name} value={item.name} key={item.id}
                                        isLeaf/>;
        });
    };

    //查询
    searchDataSource = (e) => {
        const {dispatch, form} = this.props;
        e.preventDefault();
        this.fetchDataList();
    };

    //导出
    exportData = (e) => {
        e.preventDefault();
        // const {selectRows} = this.state;
        // if (selectRows.length > 0) {
        //     let ids = selectRows.map(val => {
        //         return val.id
        //     });
        //     let key = ids.join(',');
        //     this.removeData(key);
        // } else {
        //     T.prompt.error("请选择需要删除的行");
        // }
    };

    //树选择
    onTreeChange = (e, node) => {
        this.setState({
            selectedKey: node.props.id,
        });
    };

    render() {
        const {
            fetchTreeStatus,
            fetchJobStatisticsListStatus,
            form: {getFieldDecorator, getFieldValue, getFieldsValue},
        } = this.props;
        const {treeData, currentPage, selectedKey, tableData, selectedArea} = this.state;

        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: '5%',
            },
            {
                title: '地区',
                dataIndex: 'area',
                width: '8%',
            },
            {
                title: '摸排总人数',
                dataIndex: 'sum',
                width: '8%',
            },
            {
                title: '来烟（返烟）人数',
                dataIndex: 'backSum',
                width: '8%',
            },
            {
                title: '与确诊、疑似病例有过密切接触的人数',
                dataIndex: 'touchSuspectSum',
                width: '12%',
            },
            {
                title: '与密切接触者有过共同生活、工作、学习、聚会的人数',
                dataIndex: 'touchIntimateSum',
                width: '12%',
            },
            {
                title: '与重点疫区人员有过接触的人数',
                dataIndex: 'touchInfectorSum',
                width: '12%',
            },
            {
                title: '身体状况异常的人数',
                dataIndex: 'bodyAbnormalSum',
                width: '8%',
            },
            {
                title: '当日集中隔离人数',
                dataIndex: 'currentIsolateSum',
                width: '8%',
            },
            {
                title: '累计集中隔离人数（1月24日至今）',
                dataIndex: 'isolateSum',
                width: '12%',
                render: (text, record) => {
                    // if (record.isolatedTotalNumEdit && record.isolatedTotalNumFirst) {
                    //     return (
                    //         <Input
                    //             value={text}
                    //             autoFocus
                    //             onChange={e => this.handleMapChange(e, 'isolatedTotalNum', record.key)}
                    //             // onKeyPress={e => this.handleKeyPress(e, record.key)}
                    //             onBlur={e => this.handleKeyPress(e, 'isolatedTotalNum',record.key)}
                    //             placeholder="初始值录入"
                    //         />
                    //     );
                    // }
                    return (
                        <Input
                            value={text}
                            autoFocus
                            onChange={e => this.handleMapChange(e, 'isolateSum', record.key)}
                            placeholder="请输入人数"
                        />
                    )
                    // return (
                    //     <a onClick={(e) => this.showEdit(e,'isolatedTotalNum',record.key)}>{text}</a>
                    // );
                },
            },
            {
                title: '当日居家隔离人数',
                dataIndex: 'currentIsolateHomeSum',
                width: '8%',
            },
            {
                title: '累计居家隔离人数（1月24日至今）',
                dataIndex: 'isolateHomeSum',
                width: '12%',
                render: (text, record) => {
                    // if (record.atHomeTotalNumEdit && record.atHomeTotalNumFirst) {
                    //     return (
                    //         <Input
                    //             value={text}
                    //             autoFocus
                    //             onChange={e => this.handleMapChange(e, 'atHomeTotalNum', record.key)}
                    //             // onKeyPress={e => this.handleKeyPress(e, record.key)}
                    //             onBlur={e => this.handleKeyPress(e, 'atHomeTotalNum',record.key)}
                    //             placeholder="初始值录入"
                    //         />
                    //     );
                    // }
                    // return (
                    //     <a onClick={(e) => this.showEdit(e,'atHomeTotalNum',record.key)}>{text}</a>
                    // );
                    return (
                        <Input
                            value={text}
                            autoFocus
                            onChange={e => this.handleMapChange(e, 'isolateHomeSum', record.key)}
                            placeholder="请输入人数"
                        />
                    )
                },
            },

        ];
        const rowSelection = {
            //多选所选择的key值
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectRows: selectedRows
                })
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        let loginInfo = T.auth.getLoginInfo();

        //获取表单的value
        let formTimeValue = getFieldsValue();

        let formStart = T.lodash.isUndefined(formTimeValue.startDate) ? '' : formTimeValue.startDate === null ?  '' : T.helper.dateFormat(formTimeValue.startDate,'YYYY-MM-DD');
        let formEnd = T.lodash.isUndefined(formTimeValue.endDate) ? '' : formTimeValue.endDate === null ?  '' : T.helper.dateFormat(formTimeValue.endDate,'YYYY-MM-DD');

        let apiHref = window.ENV.apiDomain + "/excel/staticNum?area=" + (T.auth.isAdmin() ? selectedArea === "烟台市" ? '' : selectedArea : loginInfo.data.area) + "&start=" + formStart + "&end=" + formEnd;
        return (
            <PageHeaderWrapper title="摸排工作统计">
                <Row gutter={24}>
                    {
                        T.auth.isAdmin() ?
                            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
                                <Card
                                    title="资源列表"
                                    bordered={false}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    {
                                        fetchTreeStatus ? <Spin/> :
                                            <DirectoryTree
                                                multiple
                                                defaultExpandAll={true}
                                                onSelect={this.onSelect.bind(this)}
                                                selectedKeys={[selectedKey]}
                                            >
                                                {this.renderTreeNodes(treeData)}
                                            </DirectoryTree>
                                    }
                                </Card>
                            </Col>
                            :
                            null
                    }
                    <Col xl={T.auth.isAdmin() ? 20: 24} lg={T.auth.isAdmin() ? 20: 24} md={T.auth.isAdmin() ? 20: 24} sm={24} xs={24} className={styles.dataSourceTableList}>
                        <Form layout="inline" onSubmit={this.searchDataSource}>
                            <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`}
                                 style={{marginBottom: 10}}>
                                <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                                    <Form.Item
                                        label='起始时间'
                                    >
                                        {getFieldDecorator('startDate', {
                                            // rules: [
                                            //     {
                                            //         // required: true,
                                            //         // message:'请选择查询时间'
                                            //     },
                                            // ],
                                            initialValue: T.moment(new Date().getTime()),
                                        })(
                                            <DatePicker/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={5} lg={5} md={5} sm={5} xs={24}>
                                    <Form.Item
                                        label='结束时间'
                                    >
                                        {getFieldDecorator('endDate', {
                                            // rules: [
                                            //     {
                                            //         // required: true,
                                            //         // message:'请选择查询时间'
                                            //     },
                                            // ],
                                            // initialValue: T.moment(new Date().getTime()-24*60*60*1000),
                                            initialValue: T.moment(new Date().getTime()),
                                        })(
                                            <DatePicker/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={6} lg={8} md={8} sm={8} xs={24} style={{textAlign: 'left'}}>
                                    <Form.Item className={styles.searchBtnWrapper}>
                                        <Button htmlType="submit" style={{marginRight: 10}}>
                                            查询
                                        </Button>
                                        <Button onClick={this.resetDataSource} type="primary" style={{marginRight: 10}}>
                                            重置
                                        </Button>
                                        <Button type="primary">
                                            <a href={apiHref} target="_blank" >导出</a>
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Form>
                        <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`}
                             style={{marginBottom: 10}}>
                            统计结果
                        </Row>
                        <Row>
                            <Card bordered={false}>
                                <Table
                                    loading={fetchJobStatisticsListStatus}
                                    columns={columns}
                                    dataSource={tableData}
                                    rowSelection={rowSelection}
                                    pagination={false}
                                    scroll={{ y: 480 }}
                                    // rowClassName={record => (record.editable ? styles.editable : '')}
                                />
                            </Card>
                        </Row>

                    </Col>
                </Row>
            </PageHeaderWrapper>
        );
    }
}

export default JobStatisticsList;
