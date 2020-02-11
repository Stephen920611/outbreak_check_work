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

import styles from './CheckRecordList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'; // @ 表示相对于源文件根目录


//数据分发页面
/* eslint react/no-multi-comp:0 */
@connect(({checkRecord, loading}) => ({
    checkRecord,
    // fetchTreeStatus: loading.effects['checkRecord/getDataResourceTreeAction'],
    fetchCheckRecordListStatus: loading.effects['checkRecord/fetchCheckRecordListAction'],
}))
// class CheckRecordList
@Form.create()
class CheckRecordList extends PureComponent {

    state = {
        currentPage: EnumDataSyncPageInfo.defaultPage,//分页
        selectRows: [], //选择的数据列
        selectedKey: '',//树节点默认选中的值
        selectedArea: '',//树节点默认选中的地区名字，用来后台获取参数
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
        fakeData: {
            "total": 2371,
            "pages": null,
            "members": [
                {
                    "id": 2456,
                    "area": "莱阳市",
                    "name": "柳爱玲",
                    "address": "古柳街道柳沟村",
                    "idCard": "370682198711291121",
                    "phoneNum": "13361324284",
                    "age": 34,
                    "gender": "女",
                    "nativePlace": "山东莱阳",
                    "baseInfo": "外地来烟",
                    "createTime": "2020-02-10 17:34",
                    "fillUserId": 1049,
                    "fillUserName": "梁帅帅"
                },
                {
                    "id": 2455,
                    "area": "莱阳市",
                    "name": "柳爱玲",
                    "address": "古柳街道柳沟村",
                    "idCard": "370682198711291121",
                    "phoneNum": "13361324284",
                    "age": 34,
                    "gender": "女",
                    "nativePlace": "山东莱阳",
                    "baseInfo": "外地来烟",
                    "createTime": "2020-02-10 17:34",
                    "fillUserId": 1049,
                    "fillUserName": "梁帅帅"
                },
                {
                    "id": 2454,
                    "area": "莱阳市",
                    "name": "陈国宏",
                    "address": "山东省莱阳市城厢街道办事处盛世广场",
                    "idCard": "532401197507052017",
                    "phoneNum": "15106588986",
                    "age": 45,
                    "gender": "男",
                    "nativePlace": "云南省玉溪市",
                    "baseInfo": "正常",
                    "createTime": "2020-02-10 17:34",
                    "fillUserId": 366,
                    "fillUserName": "王骏"
                },
                {
                    "id": 2453,
                    "area": "莱阳市",
                    "name": "董常云",
                    "address": "莱阳市龙旺庄街道田格庄村",
                    "idCard": "370682198808153526",
                    "phoneNum": "13553129100",
                    "age": 32,
                    "gender": "男",
                    "nativePlace": "",
                    "baseInfo": "外地来烟",
                    "createTime": "2020-02-10 17:34",
                    "fillUserId": 1094,
                    "fillUserName": "崔雪梅"
                },
                {
                    "id": 2452,
                    "area": "莱州市",
                    "name": "周艳磊",
                    "address": "莱州市前北流村",
                    "idCard": "370625197607210027",
                    "phoneNum": "13953588225",
                    "age": 44,
                    "gender": "女",
                    "nativePlace": "",
                    "baseInfo": "已被居家隔离",
                    "createTime": "2020-02-10 17:34",
                    "fillUserId": 1091,
                    "fillUserName": "宋琳"
                },
                {
                    "id": 2451,
                    "area": "海阳市",
                    "name": "辛德泽",
                    "address": "大辛家",
                    "idCard": "370629195308050672",
                    "phoneNum": "3682200",
                    "age": null,
                    "gender": "男",
                    "nativePlace": "",
                    "baseInfo": "正常",
                    "createTime": "2020-02-10 17:34",
                    "fillUserId": 848,
                    "fillUserName": "辛浩"
                },
                {
                    "id": 2450,
                    "area": "龙口市",
                    "name": "李腾",
                    "address": "龙口市针织厂小区",
                    "idCard": "370681199810062218",
                    "phoneNum": "17852357218",
                    "age": 23,
                    "gender": "男",
                    "nativePlace": "山东省烟台市龙口市",
                    "baseInfo": "正常",
                    "createTime": "2020-02-10 17:33",
                    "fillUserId": 1093,
                    "fillUserName": "李腾"
                },
                {
                    "id": 2449,
                    "area": "莱州市",
                    "name": "石潇丹",
                    "address": "莱州市永安街道花园北流082号",
                    "idCard": "370683198905242244",
                    "phoneNum": "15376590967",
                    "age": 31,
                    "gender": "女",
                    "nativePlace": "莱州市永安街道花园北流082号",
                    "baseInfo": "正常",
                    "createTime": "2020-02-10 17:33",
                    "fillUserId": 405,
                    "fillUserName": "张莲"
                },
                {
                    "id": 2448,
                    "area": "栖霞市",
                    "name": "路亚楠",
                    "address": "烟台市芝罘区信达小区",
                    "idCard": "370686199211138227",
                    "phoneNum": "15166862381",
                    "age": 28,
                    "gender": "女",
                    "nativePlace": "山东省栖霞市松山街道北路家沟村",
                    "baseInfo": "正常",
                    "createTime": "2020-02-10 17:33",
                    "fillUserId": 1096,
                    "fillUserName": "路亚楠"
                },
                {
                    "id": 2447,
                    "area": "莱州市",
                    "name": "孙修",
                    "address": "莱州市安邦名人家园1号楼3单元1301室",
                    "idCard": "371323198905078411",
                    "phoneNum": "18364458532",
                    "age": 31,
                    "gender": "男",
                    "nativePlace": "临沂沂水",
                    "baseInfo": "外出返烟",
                    "createTime": "2020-02-10 17:33",
                    "fillUserId": 406,
                    "fillUserName": "潘羽敏"
                }
            ],
            "activities": null,
            "touchs": null,
            "currnets": null
        },
        tableData: [
            {
                key: 1,
                address: '县市区',
                name: '姓名',
                age: 18,
                sex: '性别',
                createDate: '创建时间',
                pId: '123456787',
                status: '基本状况',
            },

        ]
    };

    componentDidMount() {

    }

    //获取当前页数数据
    fetchDataList = () => {
        const {dispatch, form, checkRecord} = this.props;
        const {currentPage, selectedKey, treeData, selectedArea} = this.state;
        let self = this;

        form.validateFieldsAndScroll((err, values) => {
            console.log(values,'values');
            if (!err) {
                //地区分类
                let categoryCode = '';
                treeData.map(val => {
                    if (values.resourceType === val.name) {
                        categoryCode = val.id;
                    }
                });

                let params = {
                    page: currentPage,
                    pageSize: EnumDataSyncPageInfo.defaultPageSize,
                    startTime: "",      //开始时间
                    endTime: "",        //结束时间
                    area: selectedArea === "烟台市" ? '' : selectedArea,           //县市区(烟台市传空)
                    name: "",           //被调查人姓名
                    gender: "",         //性别
                    idCard: "",         //身份证号
                    baseInfo: "",         //被调查人基本情况
                    bodyCondition: "",         //身体状况
                    fillUserName: "",   //摸排人
                    // "selectedKey":selectedKey,//categoryCode  点击的树节点
                    // "person": T.lodash.isUndefined(values.person) ? '' : values.person, //被调查人姓名
                    // "sex": T.lodash.isUndefined(values.sex) ? '' : values.sex, //被调查人性别
                    // "startDate": T.lodash.isUndefined(values.startDate) ? '' : values.startDate, //开始时间
                    // "endDate": T.lodash.isUndefined(values.endDate) ? '' : values.endDate, //结束时间
                    // "base": T.lodash.isUndefined(values.base) ? '' : values.base, //被调查人基本情况
                    // "status": T.lodash.isUndefined(values.status) ? '' : values.status, //身体状况
                    // "head": T.lodash.isUndefined(values.head) ? '' : values.head, //摸排人
                };
                new Promise((resolve, reject) => {
                    dispatch({
                        type: 'checkRecord/fetchMemberInfoAction',
                        params,
                        resolve,
                        reject,
                    });
                }).then(response => {
                    console.log(response, 'response');
                    const {currnets, member, touch, activities} = response.data;
                    if (response.code === 0) {
                        // self.setState({
                        //     activities: T.lodash.isUndefined(activities[0]) ? {} : activities[0],
                        //     currentInfo: T.lodash.isUndefined(currnets[0]) ? {} : currnets[0],
                        //     member,
                        //     touch: T.lodash.isUndefined(touch[0]) ? {} : touch[0],
                        // })
                    } else {
                        T.prompt.error(response.msg);
                    }
                });
            }
        });

    };

    //重置表单
    resetDataSource = () => {
        this.props.form.resetFields();
        // this.fetchDataList();
    };

    //树选择
    onSelect = (keys, event) => {
        //点击选中事件，属性可以打印查看
        const eventData = event.node.props;
        // this.props.form.setFieldsValue({
        //     resourceType: eventData.name
        // });
        this.setState({
            selectedKey: keys[0],
            selectedArea: eventData.name
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
        this.setState({
            currentPage: EnumDataSyncPageInfo.defaultPage,
        }, () => {
            this.fetchDataList();
        });
        // this.fetchDataList();
    };

    //页码变换
    pageChange = page => {
        this.setState({
            currentPage: page,
        }, () => {
            this.fetchDataList();
        });
    };

    //导出
    exportData = () => {

    };


    //查看详情
    showMetadataManage = (e, key) => {
        router.push({
            pathname: '/checkRecord/showDetail',
            params: {
                isRouterPush: true,
                key: key
            },
        });
    };

    //树选择

    onTreeChange = (e, node) => {
        this.setState({
            selectedKey: node.props.id,
        });
    };
    //查询-数据库类型 渲染下拉选项
    renderSelectOption = (selectDataSource) => {
        let arrKeys = T.lodash.keys(selectDataSource);
        return (
            arrKeys.map(item => {
                return (
                    <Option key={item} value={item}>
                        {EnumDataSourceStatus[item]["label"]}
                    </Option>
                )
            })
        )

    };

    render() {
        const {
            fetchTreeStatus,
            savingStatus,
            testStatus,
            metadataManage,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        // const {dataResourceLists, dataResourceTypeTreeList, dataSourceTypeTreeOldData} = metadataManage;
        const {treeData, tableData, fakeData, selectedArea} = this.state;
        console.log(selectedArea,'selectedArea');
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: '县市区',
                dataIndex: 'area',
                key: 'area',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
            },
            {
                title: '身份证号',
                dataIndex: 'idCard',
                key: 'idCard',
            },

            {
                title: '被调查人基本情况',
                dataIndex: 'baseInfo',
                key: 'baseInfo',
            },
            {
                title: '身体状况',
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: '摸排人',
                dataIndex: 'fillUserName',
                key: 'fillUserName',
            },
            {
                title: '操作',
                key: 'action',
                // width: '15%',
                render: (text, record) => {
                    return (
                        <span><a onClick={e => this.showMetadataManage(e, record)}>查看详情</a></span>
                    );
                },
            }
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
        const {currentPage, selectedKey} = this.state;
        return (
            <PageHeaderWrapper title="摸排记录查询">
                <Row gutter={24}>
                    <Col xl={5} lg={5} md={5} sm={24} xs={24}>
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
                    <Col xl={19} lg={19} md={19} sm={24} xs={24} className={styles.dataSourceTableList}>
                        <Form layout="inline" onSubmit={this.searchDataSource}>
                            <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`}
                                 style={{marginBottom: 10}}>
                                <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="checkRecord.resourceList.person.label"/>}
                                    >
                                        {getFieldDecorator('person', {})(
                                            <Input
                                                autoComplete="off"
                                                placeholder={formatMessage({
                                                    id: 'checkRecord.resourceList.person.placeholder',
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} xs={24} style={{textAlign: 'left'}}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="checkRecord.resourceList.sex.label"/>}
                                    >
                                        {getFieldDecorator('sex', {})(
                                            <Radio.Group onChange={this.onChange} value={this.state.value}>
                                                <Radio value={1}>男</Radio>
                                                <Radio value={2}>女</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="checkRecord.resourceList.startDate.label"/>}
                                    >

                                        {getFieldDecorator('startDate', {})(
                                            <DatePicker/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="checkRecord.resourceList.endDate.label"/>}
                                    >

                                        {getFieldDecorator('endDate', {})(
                                            <DatePicker/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`}
                                 style={{marginBottom: 10}}>

                                <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="checkRecord.resourceList.base.label"/>}
                                    >

                                        {getFieldDecorator('base', {
                                            initialValue: 'normal'
                                        })(
                                            <Select
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                            >
                                                <Option key='normal' value='normal'>
                                                    <FormattedMessage id="checkRecord.resourceList.base.option.normal"/>
                                                </Option>
                                                <Option key='abnormal' value='abnormal'>
                                                    <FormattedMessage
                                                        id="checkRecord.resourceList.base.option.abnormal"/>
                                                </Option>

                                                {/*{this.renderSelectOption(EnumDataSourceStatus)}*/}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="checkRecord.resourceList.status.label"/>}
                                    >

                                        {getFieldDecorator('status', {
                                            initialValue: 'normal'
                                        })(
                                            <Select
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                            >
                                                <Option key='normal' value='normal'>
                                                    <FormattedMessage id="checkRecord.resourceList.base.option.normal"/>
                                                </Option>
                                                <Option key='abnormal' value='abnormal'>
                                                    <FormattedMessage
                                                        id="checkRecord.resourceList.base.option.abnormal"/>
                                                </Option>

                                                {/*{this.renderSelectOption(EnumDataSourceStatus)}*/}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                                    <Form.Item
                                        label={<FormattedMessage
                                            id="checkRecord.resourceList.head.label"/>}
                                    >

                                        {getFieldDecorator('head', {})(
                                            <Input
                                                autoComplete="off"
                                                placeholder={formatMessage({
                                                    id: 'checkRecord.resourceList.person.placeholder',
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xl={6} lg={8} md={8} sm={8} xs={24} style={{textAlign: 'left'}}>
                                    <Form.Item className={styles.searchBtnWrapper}>
                                        <Button htmlType="submit" style={{marginRight: 10}}>
                                            <FormattedMessage id="checkRecord.btn.search"/>
                                        </Button>
                                        <Button onClick={this.resetDataSource} type="primary" style={{marginRight: 10}}>
                                            <FormattedMessage id="checkRecord.btn.reset"/>
                                        </Button>
                                        <Button onClick={this.exportData} type="primary">
                                            <FormattedMessage id="checkRecord.btn.output"/>
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`}
                             style={{marginBottom: 10}}>
                            检索结果：{fakeData.hasOwnProperty("total") ? fakeData.total : '-----'}
                        </Row>
                        <Row>
                            <Card bordered={false}>
                                <Table
                                    columns={columns}
                                    dataSource={fakeData.hasOwnProperty("members") ? fakeData.members : []}
                                    rowSelection={rowSelection}
                                    pagination={{
                                        current: currentPage,
                                        onChange: this.pageChange,
                                        pageSize: EnumDataSyncPageInfo.defaultPageSize,
                                        // total: sourceProcessorsList.hasOwnProperty('total') ? Number(sourceProcessorsList.total) + 1 : 0,
                                    }}
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

export default CheckRecordList;
