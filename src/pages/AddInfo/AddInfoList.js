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
@connect(({addInfo, loading}) => ({
    addInfo,
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
                    sm: {span: 15},
                    md: {span: 15},
                },
            },
            submitFormLayout: {
                wrapperCol: {
                    xs: {span: 24, offset: 0},
                    sm: {span: 24, offset: 0},
                },
            },
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


            nextMeasuresValue: "",
        }
    }

    componentDidMount() {
        const {dispatch, location} = this.props;
        let self = this;
    }
    onSubmitData = (e) => {
        let self = this;
        const {dispatch, form, addRow} = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            console.log('values',values);
            if (!err) {

            }
        })
    };
    //重置功能
    resetForm = () => {
        this.props.form.resetFields();
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
            submitFormLayout
        } = this.state;

        return (
            <PageHeaderWrapper
                title={"信息录入"}
                isSpecialBreadcrumb={true}
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
                                                }
                                            )(
                                                <Select
                                                    // onChange={this.onChangeConnectionUrl.bind(this, "dataOrigin", "connectionUrl")}
                                                    // onSelect={this.selectDataSource.bind(this, 'FTP')}
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    placeholder="请选择县市区"
                                                >
                                                    <Option value="create" key="create">
                                                        芝罘区
                                                    </Option>
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
                                                    ],
                                                }
                                            )(
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
                                                            required: true,
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
                                    <Col span={12}>
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
                                                    <Option value="create" key="create">
                                                        正常
                                                    </Option>
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
                                    <Col span={8}>
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
                                    <Col span={20}>
                                        <Form.Item
                                            {...formItemLayout}
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
                                    <Col span={20}>
                                        <Form.Item
                                            {...formItemLayout}
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
                                                <DatePicker/>
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
                                    <Col span={20}>
                                        <Form.Item
                                            {...formItemLayout}
                                            label='是否与重点疫区人员接触过：'
                                        >
                                            {getFieldDecorator('isTouchIntimate', {
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
                                                <DatePicker/>
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
                                                    initialValue:'normal'
                                                }
                                            )(
                                                <Select
                                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                                    placeholder="请选择身体状况"
                                                >
                                                    <Option value="normal" key="normal">
                                                        正常
                                                    </Option>
                                                    <Option value="n" key="n">
                                                        否
                                                    </Option>
                                                    {/*{this.renderSelectOption(metadataManageUrlList)}*/}
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
                                            {getFieldDecorator('hasSeek', {
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
