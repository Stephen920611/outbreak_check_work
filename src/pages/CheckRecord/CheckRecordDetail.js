import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './CheckRecordDetail.less';
import T from './../../utils/T';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';

import {
    Row,
    Col,
    Card,
} from 'antd';

/* eslint react/no-multi-comp:0 */
@connect(({checkRecord, loading}) => ({
    checkRecord,
    fetchStatus: loading.effects['checkRecord/fetchMemberInfoAction'],
}))
class CheckRecordDetail extends PureComponent {
    constructor() {
        super();
        this.state = {
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
            }
        }
    }

    componentDidMount() {
        const {dispatch, location} = this.props;
        let self = this;
        //验证是否刷新页面
        T.auth.returnSpecialMainPage(location, '/checkRecord');
        if (location.hasOwnProperty("params") && location["params"].hasOwnProperty("data")) {
            new Promise((resolve, reject) => {
                dispatch({
                    type: 'checkRecord/fetchMemberInfoAction',
                    id: location["params"]["data"]["id"],
                    resolve,
                    reject,
                });
            }).then(response => {
                const {currnets, member, touch, activities} = response.data;
                if (response.code === 0) {
                    self.setState({
                        activities: T.lodash.isUndefined(activities[0]) ? {} : activities[0],
                        currentInfo: T.lodash.isUndefined(currnets[0]) ? {} : currnets[0],
                        member,
                        touch: T.lodash.isUndefined(touch[0]) ? {} : touch[0],
                    })
                } else {
                    T.prompt.error(response.msg);
                }
            });
        }
    }

    render() {
        const {fetchStatus} = this.props;
        const {
            activities,
            currentInfo,
            member,
            touch,
        } = this.state;
        const breadcrumbDetail = [
            {
                linkTo: '/checkRecord',
                name: '摸排记录查询',
            },
            {
                name: '疫情防控调查详情查看',
            },
        ];
        return (
            <PageHeaderWrapper
                title={"疫情防控调查详情查看"}
                isSpecialBreadcrumb={true}
                breadcrumbName={<CustomBreadcrumb dataSource={breadcrumbDetail}/>}
            >
                <div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailTitleName}>
                            人员基本信息
                        </div>
                        <Card
                            style={{marginBottom: 20}}
                            loading={fetchStatus}
                        >
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>县市区：</span>
                                    <span>
                                        {
                                            member.hasOwnProperty('area') ? member.area : '---'
                                        }
                                    </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>姓名：</span>
                                    <span>
                                        {
                                            member.hasOwnProperty('name') ? member.name : '---'
                                        }
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>年龄：</span>
                                    <span>
                                        {
                                            member.hasOwnProperty('age') ? member.age : '---'
                                        }
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>性别：</span>
                                    <span>
                                        {
                                            member.hasOwnProperty('gender') ? member.gender : '---'
                                        }
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>籍贯：</span>
                                    <span>
                                        {
                                            member.hasOwnProperty('nativePlace') ? member.nativePlace : '---'
                                        }
                                    </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>住址：</span>
                                    <span>
                                        {member.hasOwnProperty('address') ? member.address : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>身份证号码：</span>
                                    <span>
                                        {member.hasOwnProperty('idCard') ? member.idCard : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>联系电话：</span>
                                    <span>
                                        {member.hasOwnProperty('phoneNum') ? member.phoneNum : '---'}
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>被调查人基本情况：</span>
                                    <span>
                                        {member.hasOwnProperty('baseInfo') ? member.baseInfo : '---'}
                                    </span>
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
                                    <span>从何地来烟(返烟)：</span>
                                    <span>
                                        {activities.hasOwnProperty('backFromWhere') ? activities.backFromWhere : '---'}
                                    </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>来烟(返烟)时间：</span>
                                    <span>
                                        {activities.hasOwnProperty('backTime') ? activities.backTime : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>来烟(返烟)方式：</span>
                                    <span>
                                        {activities.hasOwnProperty('backType') ? activities.backType : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>航班/车次/船次/车牌号：</span>
                                    <span>
                                        {activities.hasOwnProperty('carNum') ? activities.carNum : '---'}
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>期间还到过哪些城市：</span>
                                    <span>
                                        {activities.hasOwnProperty('wayCity') ? activities.wayCity : '---'}
                                    </span>
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
                                <Col span={6}>
                                    <span>是否与确诊、疑似病例密切接触过：</span>
                                    <span>
                                        {touch.hasOwnProperty('isTouchSuspect') ? touch.isTouchSuspect : '---'}
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>接触者姓名：</span>
                                    <span>
                                        {touch.hasOwnProperty('suspectName') ? touch.suspectName : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>接触者身份证号：</span>
                                    <span>
                                        {touch.hasOwnProperty('suspectIdCard') ? touch.suspectIdCard : '---'}
                                    </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>接触时间：</span>
                                    <span>
                                        {touch.hasOwnProperty('suspectTime') ? touch.suspectTime : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>接触地点：</span>
                                    <span>
                                        {touch.hasOwnProperty('suspectPoint') ? touch.suspectPoint : '---'}
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>是否与密切接触者共同生活、工作、学习、聚会过：</span>
                                    <span>
                                        {touch.hasOwnProperty('isTouchIntimate') ? touch.isTouchIntimate : '---'}
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>接触者姓名：</span>
                                    <span>
                                        {touch.hasOwnProperty('intimateName') ? touch.intimateName : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>接触者身份证号：</span>
                                    <span>
                                        {touch.hasOwnProperty('intimateIdCard') ? touch.intimateIdCard : '---'}
                                    </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>接触时间：</span>
                                    <span>
                                        {touch.hasOwnProperty('intimateTime') ? touch.intimateTime : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>接触地点：</span>
                                    <span>
                                        {touch.hasOwnProperty('intimatePoint') ? touch.intimatePoint : '---'}
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>是否与重点疫区人员接触过：</span>
                                    <span>
                                        {touch.hasOwnProperty('isTouchInfector') ? touch.isTouchInfector : '---'}
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>接触者姓名：</span>
                                    <span>
                                        {touch.hasOwnProperty('infectorName') ? touch.infectorName : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>接触者身份证号：</span>
                                    <span>
                                        {touch.hasOwnProperty('infectorIdCard') ? touch.infectorIdCard : '---'}
                                    </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>接触时间：</span>
                                    <span>
                                        {touch.hasOwnProperty('infectorTime') ? touch.infectorTime : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>接触地点：</span>
                                    <span>
                                        {touch.hasOwnProperty('infectorPoint') ? touch.infectorPoint : '---'}
                                    </span>
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
                                    <span>身体状况：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('bodyCondition') ? currentInfo.bodyCondition : '---'}
                                    </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>是否就医：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('hasSeek') ? currentInfo.hasSeek : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>就医医院：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('seekHospital') ? currentInfo.seekHospital : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>就医时间：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('seekTime') ? currentInfo.seekTime : '---'}
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>是否采取过防护措施：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('controlMeasures') ? currentInfo.controlMeasures : '---'}
                                    </span>
                                </Col>
                                <Col span={12} className={styles.detailBtns}>
                                    <span>什么时间内采取的防护措施：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('controlTime') ? currentInfo.controlTime : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>下步拟采取措施：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('nextMeasures') ? currentInfo.nextMeasures : '---'}
                                    </span>
                                </Col>

                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>填报日期：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('createTime') ? currentInfo.createTime : '---'}
                                    </span>
                                </Col>
                                <Col span={6}>
                                    <span>摸排人：</span>
                                    <span>
                                        {currentInfo.hasOwnProperty('fillUserName') ? currentInfo.fillUserName : '---'}
                                    </span>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default CheckRecordDetail;
