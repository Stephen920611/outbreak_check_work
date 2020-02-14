import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './AddInfoList.less';
import T from './../../utils/T';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';

import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Radio,
} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;

/* eslint react/no-multi-comp:0 */
@connect(({addInfo, checkRecord, loading}) => ({
    addInfo,
    checkRecord,
    // fetchStatus: loading.effects['checkRecord/fetchMemberInfoAction'],
}))
@Form.create()
class AddInfoList extends PureComponent {
    constructor() {
        super();
        this.state = {
            formItemLayout: {
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 6},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                    md: {span: 16},
                },
            },
            formItemHalf: {
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 12},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 12},
                    md: {span: 12},
                },
            },
            submitFormLayout: {
                wrapperCol: {
                    xs: {span: 24, offset: 0},
                    sm: {span: 24, offset: 0},
                },
            },
            baseInfoSelect: [],     //被调查人基本情况
            bodyConditionSelect: [],     //身体状况
            activities: {},
            currentInfo: {},
            member: {},
            touch: [],
            basicPersonnelInformation: {
                "msg": "success",
                "code": 0,
                "activities": [
                    {
                        "id": 1362,
                        "memberId": 2476,
                        "backFromWhere": "省内",
                        "backTime": "2020-02-02 17:37",
                        "backType": "自驾",
                        "carNum": "鲁fb7l21",
                        "wayCity": "淄博临淄区",
                        "createTime": "2020-02-11 11:40",
                        "fillUserId": 1103,
                        "fillUserName": "测试刘"
                    }
                ],
                "currnets": [
                    {
                        "id": 1494,
                        "memberId": 2476,
                        "bodyCondition": "正常",
                        "hasSeek": "是",
                        "seekHospital": "莱山毓璜顶",
                        "seekTime": "2020-02-08 08:39",
                        "controlMeasures": "居家隔离",
                        "controlTime": "2020-02-05 11:40",
                        "nextMeasures": "居家隔离",
                        "createTime": "2020-02-11 11:42",
                        "fillUserId": 1103,
                        "fillUserName": "测试刘"
                    }
                ],
                "member": {
                    "id": 2476,
                    "area": "莱山区",
                    "name": "刘晓晨",
                    "address": "莱山河西城市花园",
                    "idCard": "370781199312257865",
                    "phoneNum": "17862886396",
                    "age": 26,
                    "gender": "男",
                    "nativePlace": "山东潍坊",
                    "baseInfo": "正常",
                    "createTime": "2020-02-11 11:39",
                    "fillUserId": 1103,
                    "fillUserName": "测试刘"
                },
                "touch": [
                    {
                        "id": 1128,
                        "memberId": 2476,
                        "isTouchSuspect": "是",
                        "suspectName": "测试1",
                        "suspectIdCard": "838288281873322",
                        "suspectTime": "2020-02-01 11:38",
                        "suspectPoint": "临淄博临淄区",
                        "isTouchIntimate": "是",
                        "intimateName": "测试2",
                        "intimateIdCard": "就是就是锦江大酒店",
                        "intimateTime": "2020-01-01 11:39",
                        "intimatePoint": "青州市公安局",
                        "isTouchInfector": "否",
                        "infectorName": "测试3",
                        "infectorIdCard": "这孩子就是就是就是",
                        "infectorTime": "2020-02-09 11:39",
                        "infectorPoint": "莱山河西走廊",
                        "createTime": "2020-02-11 11:41",
                        "fillUserId": 1103,
                        "fillUserName": "测试刘"
                    }
                ]
            },

        }
    }

    componentDidMount() {
        const {dispatch, location} = this.props;

        let self = this;
        //获取被调查人基本情况
        new Promise((resolve, reject) => {
            dispatch({
                type: 'checkRecord/fetchSelectInfoAction',
                params: {
                    type: 'BASE_INFO'
                },
                resolve,
                reject,
            });
        }).then(response => {
            if (response.code === 0) {
                self.setState({
                    baseInfoSelect: response.data
                })
            } else {
                T.prompt.error(response.msg);
            }
        });

        //获取身体情况列表
        new Promise((resolve, reject) => {
            dispatch({
                type: 'checkRecord/fetchSelectInfoAction',
                params: {
                    type: 'BODY_CONDITION'
                },
                resolve,
                reject,
            });
        }).then(response => {
            if (response.code === 0) {
                self.setState({
                    bodyConditionSelect: response.data
                });
            } else {
                T.prompt.error(response.msg);
            }
        });
    }

    //提交功能
    onSubmitData = (e) => {
        let self = this;
        const {dispatch, form, addRow} = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let loginInfo = T.auth.getLoginInfo();
                let userId = loginInfo.data.id;
                let params = {
                    member: {
                        area: values.area,	//县市区名字
                        name: T.lodash.isUndefined(values.name) ? '' : values.name,
                        age: T.lodash.isUndefined(values.age) ? '' : values.age,
                        gender: T.lodash.isUndefined(values.gender) ? '' : values.gender,
                        nativePlace: T.lodash.isUndefined(values.nativePlace) ? '' : values.nativePlace,
                        address: T.lodash.isUndefined(values.address) ? '' : values.address,
                        idCard: T.lodash.isUndefined(values.idCard) ? '' : values.idCard,
                        phoneNum:T.lodash.isUndefined(values.phoneNum) ? '' : values.phoneNum,
                        baseInfo:T.lodash.isUndefined(values.baseInfo) ? '' : values.baseInfo,	//名字
                        fillUserId: userId  //后端返回
                    },
                    memberActivity: {
                        backFromWhere: T.lodash.isUndefined(values.backFromWhere) ? '' : values.backFromWhere,
                        backTime: T.lodash.isUndefined(values.backTime) ? '' : T.helper.dateFormat(values.backTime),
                        backType:T.lodash.isUndefined(values.backType) ? '' : values.backType,
                        carNum:T.lodash.isUndefined(values.carNum) ? '' : values.carNum,
                        wayCity:T.lodash.isUndefined(values.wayCity) ? '' : values.wayCity,
                        fillUserId: userId  //后端返回
                    },
                    memberTouch: {
                        isTouchSuspect: T.lodash.isUndefined(values.isTouchSuspect) ? '' : values.isTouchSuspect,	  //是否
                        suspectName:T.lodash.isUndefined(values.suspectName) ? '' : values.suspectName,
                        suspectIdCard:T.lodash.isUndefined(values.suspectIdCard) ? '' : values.suspectIdCard,
                        suspectTime: T.lodash.isUndefined(values.suspectTime) ? '' : T.helper.dateFormat(values.suspectTime),
                        suspectPoint:T.lodash.isUndefined(values.suspectPoint) ? '' : values.suspectPoint,

                        isTouchIntimate: T.lodash.isUndefined(values.isTouchIntimate) ? '' : values.isTouchIntimate,	  //是否
                        intimateName:T.lodash.isUndefined(values.intimateName) ? '' : values.intimateName,
                        intimateIdCard:T.lodash.isUndefined(values.intimateIdCard) ? '' : values.intimateIdCard,
                        intimateTime: T.lodash.isUndefined(values.intimateTime) ? '' : T.helper.dateFormat(values.intimateTime),
                        intimatePoint:T.lodash.isUndefined(values.intimatePoint) ? '' : values.intimatePoint,

                        isTouchInfector: T.lodash.isUndefined(values.isTouchInfector) ? '' : values.isTouchInfector,	  //是否
                        infectorName:T.lodash.isUndefined(values.infectorName) ? '' : values.infectorName,
                        infectorIdCard:T.lodash.isUndefined(values.infectorIdCard) ? '' : values.infectorIdCard,
                        infectorTime: T.lodash.isUndefined(values.infectorTime) ? '' : T.helper.dateFormat(values.infectorTime),
                        infectorPoint:T.lodash.isUndefined(values.infectorPoint) ? '' : values.infectorPoint,

                        fillUserId: userId  //后端返回
                    },
                    memberCurstate: {
                        bodyCondition: T.lodash.isUndefined(values.bodyCondition) ? '' : values.bodyCondition,	//名字
                        hasSeek: T.lodash.isUndefined(values.hasSeek) ? '' : values.hasSeek,	//名字
                        seekHospital: T.lodash.isUndefined(values.seekHospital) ? '' : values.seekHospital,	//名字
                        seekTime: T.lodash.isUndefined(values.seekTime) ? '' : T.helper.dateFormat(values.seekTime),	//名字
                        controlMeasures: T.lodash.isUndefined(values.controlMeasures) ? '' : values.controlMeasures,	//名字
                        controlTime: T.lodash.isUndefined(values.controlTime) ? '' : T.helper.dateFormat(values.controlTime),	//名字
                        nextMeasures: T.lodash.isUndefined(values.nextMeasures) ? '' : values.nextMeasures,	//名字
                        fillUserId: userId  //后端返回
                    },
                };
                new Promise((resolve, reject) => {
                    dispatch({
                        type: 'addInfo/addInfoAction',
                        params,
                        resolve,
                        reject,
                    });
                }).then(response => {
                    if (response.code === 0) {
                        T.prompt.success("提交成功");
                        self.resetForm();
                    } else {
                        T.prompt.error(response.msg);
                    }
                });
            }
        })
    };

    //验证年龄
    checkAge = (rule, value, callback) => {
        // const { getFieldValue } = this.props.form;
        let reg=/^(?:[0-9][0-9]?|1[01][0-9]|200)$/;//年龄是0-200之间有
        if(!reg.test(value)){
            callback("年龄输入不合法！");
            return;
        }
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
    };

    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
    };

    //渲染不同的下拉框
    renderSelect = (dataSource, isArea = false) => {
        let loginInfo = T.auth.getLoginInfo();
        return (
            dataSource.map((item,idx) => {
                return (
                    <Option key={idx} value={item.name} disabled={isArea ? loginInfo.data.area === item.name ? false : true : false}>
                        {item.name}
                    </Option>
                )
            })
        )
    };

    render() {
        const {
            fetchStatus,
            form: {getFieldDecorator, getFieldValue},
        } = this.props;
        const {
            activities,
            currentInfo,
            member,
            touch,
            formItemLayout,
            formItemHalf,
            submitFormLayout,
            bodyConditionSelect,
            baseInfoSelect
        } = this.state;
        let loginInfo = T.auth.getLoginInfo();

        let areaSelect = [
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
                value: "福山区",
            },
            {
                id: "GA003",
                key: "GA003",
                name: "莱山区",
                pId: "GA",
                value: "莱山区",
            },
            {
                id: "GA004",
                key: "GA004",
                name: "牟平区",
                pId: "GA",
                value: "牟平区",
            },
            {
                id: "GA005",
                key: "GA005",
                name: "海阳市",
                pId: "GA",
                value: "海阳市",
            },
            {
                id: "GA006",
                key: "GA006",
                name: "莱阳市",
                pId: "GA",
                value: "莱阳市",
            },
            {
                id: "GA007",
                key: "GA007",
                name: "栖霞市",
                pId: "GA",
                value: "栖霞市",
            },
            {
                id: "GA008",
                key: "GA008",
                name: "蓬莱市",
                pId: "GA",
                value: "蓬莱市",
            },
            {
                id: "GA009",
                key: "GA009",
                name: "长岛县",
                pId: "GA",
                value: "长岛县",
            },
            {
                id: "GA010",
                key: "GA010",
                name: "龙口市",
                pId: "GA",
                value: "龙口市",
            },
            {
                id: "GA011",
                key: "GA011",
                name: "招远市",
                pId: "GA",
                value: "招远市",
            },
            {
                id: "GA012",
                key: "GA012",
                name: "莱州市",
                pId: "GA",
                value: "莱州市",
            },
            {
                id: "GA013",
                key: "GA013",
                name: "开发区",
                pId: "GA",
                value: "开发区",
            },
            {
                id: "GA014",
                key: "GA014",
                name: "高新区",
                pId: "GA",
                value: "高新区",
            },
            {
                id: "GA015",
                key: "GA015",
                name: "保税港区",
                pId: "GA",
                value: "保税港区",
            },
            {
                id: "GA016",
                key: "GA016",
                name: "昆嵛山保护区",
                pId: "GA",
                value: "昆嵛山保护区",
            },
        ];

        const breadcrumbDetail = [
            {
                linkTo: '/addInfo',
                name: '信息管理',
            },
            {
                name: '新增信息',
            },
        ];

        return (
            <PageHeaderWrapper
                title={"新增信息"}
                isSpecialBreadcrumb={true}
                breadcrumbName={<CustomBreadcrumb dataSource={breadcrumbDetail}/>}
            >
                <div>
                    <div className={styles.detailItem}>
                        <Form
                            onSubmit={this.onSubmitData}
                            hideRequiredMark
                        >
                            <div className={styles.detailTitleName}>
                                人员基本信息
                            </div>
                            <Card
                                style={{marginBottom: 20}}
                                loading={fetchStatus}
                            >
                                <Row className={styles.detailTitle}>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='县市区：'
                                        >
                                            {getFieldDecorator('area', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请选择县市区",
                                                        },
                                                    ],
                                                    initialValue: T.auth.getLoginInfo().data.area
                                                }
                                            )(
                                                <Select
                                                    // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                                    // onSelect={this.selectDataSource.bind(this, 'FTP')}
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    placeholder="请选择县市区"
                                                >
                                                    {
                                                        this.renderSelect(areaSelect, true)
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} className={styles.detailBtns}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='姓名：'
                                        >
                                            {getFieldDecorator('name', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入姓名",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入姓名"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='年龄：'
                                        >
                                            {getFieldDecorator('age', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: "请输入年龄",
                                                    },
                                                    {
                                                        validator: this.checkAge
                                                    }
                                                ],
                                            })(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入年龄"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='性别：'
                                        >
                                            {getFieldDecorator('gender', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: "请选择性别",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Radio.Group >
                                                    <Radio value={"男"}>男</Radio>
                                                    <Radio value={"女"}>女</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='籍贯：'
                                        >
                                            {getFieldDecorator('nativePlace', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: "请输入籍贯",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入籍贯"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} className={styles.detailBtns}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='住址：'
                                        >
                                            {getFieldDecorator('address', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入住址",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入住址"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='身份证号码：'
                                        >
                                            {getFieldDecorator('idCard', {
                                                    rules: [
                                                        {
                                                            // required: true,
                                                            message: "请输入身份证号码",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入身份证号码"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='联系电话：'
                                        >
                                            {getFieldDecorator('phoneNum', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请输入联系电话",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入联系电话"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='被调查人基本情况：'
                                        >
                                            {getFieldDecorator('baseInfo', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: "请选择被调查人基本情况",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Select
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    placeholder="请选择被调查人基本情况"
                                                >
                                                    {
                                                        this.renderSelect(baseInfoSelect)
                                                    }
                                                    {/*{this.renderSelectOption(metadataManageUrlList)}*/}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                            <div className={styles.detailTitleName}>
                                人员活动信息
                            </div>
                            <Card
                                style={{marginBottom: 20}}
                                loading={fetchStatus}
                            >
                                <Row className={styles.detailTitle}>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='从何地来烟(返烟)：'
                                        >
                                            {getFieldDecorator('backFromWhere', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: "请选择从何地来烟(返烟)",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Radio.Group>
                                                    <Radio value={"武汉"}>武汉</Radio>
                                                    <Radio value={"湖北"}>湖北</Radio>
                                                    <Radio value={"外省"}>外省</Radio>
                                                    <Radio value={"省内"}>省内</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} className={styles.detailBtns}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='来烟(返烟)时间：'
                                        >
                                            {getFieldDecorator('backTime', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: "请选择来烟(返烟)时间",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <DatePicker showTime={true}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='来烟(返烟)方式：'
                                        >
                                            {getFieldDecorator('backType', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: "请选择来烟(返烟)方式",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Select
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    placeholder="请选择来烟(返烟)方式"
                                                >
                                                    <Option value="飞机" key="飞机">
                                                        飞机
                                                    </Option>
                                                    <Option value="火车" key="火车">
                                                        火车
                                                    </Option>
                                                    <Option value="船" key="船">
                                                        船
                                                    </Option>
                                                    <Option value="客车" key="客车">
                                                        客车
                                                    </Option>
                                                    <Option value="自驾" key="自驾">
                                                        自驾
                                                    </Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='航班/车次/船次/车牌号：'
                                        >
                                            {getFieldDecorator('carNum', {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: "请输入航班/车次/船次/车牌号",
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入航班/车次/船次/车牌号"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={12}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='期间还到过哪些城市'
                                        >
                                            {getFieldDecorator('wayCity', {

                                                }
                                            )(
                                                <TextArea
                                                    placeholder="请输入期间还到过哪些城市"
                                                    autoSize={{minRows: 2, maxRows: 6}}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                            <div className={styles.detailTitleName}>
                                人员接触信息
                            </div>
                            <Card
                                style={{marginBottom: 20}}
                                loading={fetchStatus}
                            >
                                <Row className={styles.detailTitle}>
                                    <Col span={12}>
                                        <Form.Item
                                            {...formItemHalf}
                                            label='是否与确诊、疑似病例密切接触过：'
                                        >
                                            {getFieldDecorator('isTouchSuspect', {
                                                    initialValue:'否',
                                                    // rules: [
                                                    //         {
                                                    //             required: false,
                                                    //             message: "请选择是否与确诊、疑似病例密切接触过",
                                                    //         },
                                                    //     ],
                                                }
                                            )(
                                                <Radio.Group>
                                                    <Radio value={"是"}>是</Radio>
                                                    <Radio value={"否"}>否</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触者姓名：'
                                        >
                                            {getFieldDecorator('suspectName', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触者姓名"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触者身份证号：'
                                        >
                                            {getFieldDecorator('suspectIdCard', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触者身份证号"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} className={styles.detailBtns}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触时间：'
                                        >
                                            {getFieldDecorator('suspectTime', {
                                                }
                                            )(
                                                <DatePicker showTime={true}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触地点：'
                                        >
                                            {getFieldDecorator('suspectPoint', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触地点"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={12}>
                                        <Form.Item
                                            {...formItemHalf}
                                            label='是否与密切接触者共同生活、工作、学习、聚会过：'
                                        >
                                            {getFieldDecorator('isTouchIntimate', {
                                                    initialValue:'否',
                                                    // rules: [
                                                    //         {
                                                    //             required: false,
                                                    //             message: "请选择是否与确诊、疑似病例密切接触过",
                                                    //         },
                                                    //     ],
                                                }
                                            )(
                                                <Radio.Group>
                                                    <Radio value={"是"}>是</Radio>
                                                    <Radio value={"否"}>否</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={6}>

                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触者姓名：'
                                        >
                                            {getFieldDecorator('intimateName', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触者姓名"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触者身份证号：'
                                        >
                                            {getFieldDecorator('intimateIdCard', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触者身份证号"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} className={styles.detailBtns}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触时间：'
                                        >
                                            {getFieldDecorator('intimateTime', {
                                                }
                                            )(
                                                <DatePicker showTime={true}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触地点：'
                                        >
                                            {getFieldDecorator('intimatePoint', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触地点"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={12}>
                                        <Form.Item
                                            {...formItemHalf}
                                            label='是否与重点疫区人员接触过：'
                                        >
                                            {getFieldDecorator('isTouchInfector', {
                                                    initialValue:'否'
                                                }
                                            )(
                                                <Radio.Group>
                                                    <Radio value={"是"}>是</Radio>
                                                    <Radio value={"否"}>否</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触者姓名：'
                                        >
                                            {getFieldDecorator('infectorName', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触者姓名"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触者身份证号：'
                                        >
                                            {getFieldDecorator('infectorIdCard', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触者身份证号"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} className={styles.detailBtns}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触时间：'
                                        >
                                            {getFieldDecorator('infectorTime', {
                                                }
                                            )(
                                                <DatePicker showTime={true}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='接触地点：'
                                        >
                                            {getFieldDecorator('infectorPoint', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入接触地点"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                            <div className={styles.detailTitleName}>
                                人员当前状态
                            </div>
                            <Card
                                style={{marginBottom: 20}}
                                loading={fetchStatus}
                            >
                                <Row className={styles.detailTitle}>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='身体状况：'
                                        >
                                            {getFieldDecorator('bodyCondition', {
                                                }
                                            )(
                                                <Select
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    placeholder="请选择身体状况"
                                                >
                                                    {
                                                        this.renderSelect(bodyConditionSelect)
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} className={styles.detailBtns}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='是否就医：'
                                        >
                                            {getFieldDecorator('hasSeek', {
                                                    // initialValue:'n'
                                                }
                                            )(
                                                <Radio.Group>
                                                    <Radio value={"是"}>是</Radio>
                                                    <Radio value={"否"}>否</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='就医医院：'
                                        >
                                            {getFieldDecorator('seekHospital', {
                                                }
                                            )(
                                                <Input
                                                    autoComplete="off"
                                                    placeholder="请输入就医医院"

                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='就医时间：'
                                        >
                                            {getFieldDecorator('seekTime', {
                                                }
                                            )(
                                                <DatePicker showTime={true}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row className={styles.detailTitle}>
                                    <Col span={12}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='是否采取过防护措施：'
                                        >
                                            {getFieldDecorator('controlMeasures', {
                                                    // initialValue:'n'
                                                }
                                            )(
                                                <Radio.Group>
                                                    <Radio value={"居家隔离"}>居家隔离</Radio>
                                                    <Radio value={"集中隔离"}>集中隔离</Radio>
                                                    <Radio value={"否"}>否</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} className={styles.detailBtns}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='何时采取措施'
                                        >
                                            {getFieldDecorator('controlTime', {
                                                }
                                            )(
                                                <DatePicker showTime={true}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='下步拟采取措施：'
                                        >
                                            {getFieldDecorator('nextMeasures', {
                                                    // initialValue:'n'
                                                }
                                            )(
                                                <Radio.Group>
                                                    <Radio value={"居家隔离"}>居家隔离</Radio>
                                                    <Radio value={"集中隔离"}>集中隔离</Radio>
                                                </Radio.Group>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                {/*<Row className={styles.detailTitle}>*/}
                                    {/*<Col span={6}>*/}
                                        {/*<Form.Item*/}
                                            {/*{...formItemLayout}*/}
                                            {/*label='摸排人：'*/}
                                        {/*>*/}
                                            {/*{getFieldDecorator('fillUserName', {*/}
                                                {/*}*/}
                                            {/*)(*/}
                                                {/*<Input*/}
                                                    {/*autoComplete="off"*/}
                                                    {/*placeholder="请输入摸排人"*/}
                                                {/*/>*/}
                                            {/*)}*/}
                                        {/*</Form.Item>*/}
                                    {/*</Col>*/}
                                {/*</Row>*/}
                            </Card>
                            <FormItem {...submitFormLayout} style={{marginTop: 32, paddingBottom: 24,textAlign:'center'}}>
                                <Button
                                    style={{marginLeft: 16}}
                                    type="primary"
                                    htmlType="submit"
                                    // loading={savingStatus}
                                >
                                    保存
                                </Button>
                                <Button
                                    style={{marginLeft: 8}}
                                    type="primary"
                                    onClick={this.resetForm}
                                >
                                    清空
                                </Button>
                            </FormItem>
                        </Form>

                    </div>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default AddInfoList;
