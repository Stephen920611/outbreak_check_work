import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import styles from './CheckRecordDetail.less';
import T from './../../utils/T';
import router from 'umi/router';
import {formatMessage} from 'umi-plugin-react/locale';

import {EnumPluginListPageInfo} from './../../constants/EnumPageInfo';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CustomBreadcrumb from '@/templates/ToolComponents/CustomBreadcrumb';

import {
    Button,
    Input,
    Row,
    Col,
    Icon,
    Table,
    Card,
    List,
    Spin,
    DatePicker,
} from 'antd';

/* eslint react/no-multi-comp:0 */
@connect(({dataDistribution, dataSyncNewMission, loading}) => ({
    dataDistribution,
    dataSyncNewMission,
}))
class CheckRecordDetail extends PureComponent {
    constructor() {
        super();
        this.state = {
            currentPage: EnumPluginListPageInfo.defaultPage,
            pageSize: EnumPluginListPageInfo.defaultPageSize,
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
        const {dispatch} = this.props;

    }

    componentWillUnmount(){
        const {dispatch} = this.props;
    }

    //获取当前页数数据
    fetchDataList = () => {
        const {dispatch, dataDistribution} = this.props;
        const {platformType} = dataDistribution;
        const {currentPage, inputValue, clusterActiveColor} = this.state;
        let self = this;
        //后台发送的参数
        let sendParams = {}
    };



    //页码变换
    pageChange = (page) => {
        this.setState({
            currentPage: page.current,
        }, () => {
            this.fetchDataList();
        });
    };

    render() {
        const {basicPersonnelInformation, currentPage, pageSize, } = this.state;
        return (
            <PageHeaderWrapper
                title={"疫情防控调查详情查看"}
                isSpecialBreadcrumb={true}
            >
                <div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailTitleName}>
                            人员基本信息
                        </div>
                        <Card style={{marginBottom: 20}}>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>县市区：</span>
                                    <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                      ? basicPersonnelInformation.member.hasOwnProperty('area')
                                        ?  basicPersonnelInformation.member.area : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>姓名：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                    ? basicPersonnelInformation.member.hasOwnProperty('name')
                                      ?  basicPersonnelInformation.member.name : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6}>
                                    <span>年龄：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                    ? basicPersonnelInformation.member.hasOwnProperty('age')
                                      ?  basicPersonnelInformation.member.age : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6}>
                                    <span>性别：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                    ? basicPersonnelInformation.member.hasOwnProperty('gender')
                                      ?  basicPersonnelInformation.member.gender : '---' : '---':'---'}
                                        </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>籍贯：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                    ? basicPersonnelInformation.member.hasOwnProperty('nativePlace')
                                      ?  basicPersonnelInformation.member.nativePlace : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>住址：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                    ? basicPersonnelInformation.member.hasOwnProperty('address')
                                      ?  basicPersonnelInformation.member.address : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6}>
                                    <span>身份证号码：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                    ? basicPersonnelInformation.member.hasOwnProperty('idCard')
                                      ?  basicPersonnelInformation.member.idCard : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6}>
                                    <span>联系电话：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                    ? basicPersonnelInformation.member.hasOwnProperty('phoneNum')
                                      ?  basicPersonnelInformation.member.phoneNum : '---' : '---':'---'}
                                        </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>被调查人基本情况：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('member')
                                    ? basicPersonnelInformation.member.hasOwnProperty('baseInfo')
                                      ?  basicPersonnelInformation.member.baseInfo : '---' : '---':'---'}
                                        </span>
                                </Col>
                            </Row>
                        </Card>
                        <div className={styles.detailTitleName}>
                            人员活动信息
                        </div>
                        <Card style={{marginBottom: 20}}>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>从何地来烟(返烟)：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('activities')
                                    ? basicPersonnelInformation.activities.hasOwnProperty('backFromWhere')
                                      ?  basicPersonnelInformation.activities.backFromWhere : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6} className={styles.detailBtns}>
                                    <span>来烟(返烟)时间：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('activities')
                                    ? basicPersonnelInformation.activities.hasOwnProperty('backTime')
                                      ?  basicPersonnelInformation.activities.backTime : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6}>
                                    <span>来烟(返烟)方式：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('activities')
                                    ? basicPersonnelInformation.activities.hasOwnProperty('backType')
                                      ?  basicPersonnelInformation.activities.backType : '---' : '---':'---'}
                                        </span>
                                </Col>
                                <Col span={6}>
                                    <span>航班/车次/船次/车牌号：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('activities')
                                    ? basicPersonnelInformation.activities.hasOwnProperty('carNum')
                                      ?  basicPersonnelInformation.activities.carNum : '---' : '---':'---'}
                                        </span>
                                </Col>
                            </Row>
                            <Row className={styles.detailTitle}>
                                <Col span={6}>
                                    <span>期间还到过哪些城市：</span>
                                  <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('activities')
                                    ? basicPersonnelInformation.activities.hasOwnProperty('wayCity')
                                      ?  basicPersonnelInformation.activities.wayCity : '---' : '---':'---'}
                                        </span>
                                </Col>
                            </Row>
                        </Card>
                      <div className={styles.detailTitleName}>
                        人员接触信息
                      </div>
                      <Card style={{marginBottom: 20}}>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>是否与确诊、疑似病例密切接触过：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('isTouchSuspect')
                                ?  basicPersonnelInformation.touch[0].isTouchSuspect : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>接触者姓名：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('suspectName')
                                  ?  basicPersonnelInformation.touch[0].suspectName : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>接触者身份证号：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('suspectIdCard')
                                  ?  basicPersonnelInformation.touch[0].suspectIdCard : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6} className={styles.detailBtns}>
                            <span>来接触时间</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('suspectTime')
                                  ?  basicPersonnelInformation.touch[0].suspectTime : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>接触地点：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('suspectPoint')
                                  ?  basicPersonnelInformation.touch[0].suspectPoint : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>是否与密切接触者共同生活、工作、学习、聚会过：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('isTouchIntimate')
                                  ?  basicPersonnelInformation.touch[0].isTouchIntimate : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>接触者姓名：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('intimateName')
                                  ?  basicPersonnelInformation.touch[0].intimateName : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>接触者身份证号：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('intimateIdCard')
                                  ?  basicPersonnelInformation.touch[0].intimateIdCard : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6} className={styles.detailBtns}>
                            <span>来接触时间</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('intimateTime')
                                  ?  basicPersonnelInformation.touch[0].intimateTime : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>接触地点：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('intimatePoint')
                                  ?  basicPersonnelInformation.touch[0].intimatePoint : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>是否与重点疫区人员接触过：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('isTouchInfector')
                                  ?  basicPersonnelInformation.touch[0].isTouchInfector : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>接触者姓名：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('infectorName')
                                  ?  basicPersonnelInformation.touch[0].infectorName : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>接触者身份证号：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('infectorIdCard')
                                  ?  basicPersonnelInformation.touch[0].infectorIdCard : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6} className={styles.detailBtns}>
                            <span>来接触时间</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('infectorTime')
                                  ?  basicPersonnelInformation.touch[0].infectorTime : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>接触地点：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('touch')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.touch[0].hasOwnProperty('infectorPoint')
                                  ?  basicPersonnelInformation.touch[0].infectorPoint : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                        </Row>
                      </Card>
                      <div className={styles.detailTitleName}>
                        人员当前状态
                      </div>
                      <Card style={{marginBottom: 20}}>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>身体状况：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('bodyCondition')
                                  ?  basicPersonnelInformation.currnets[0].bodyCondition : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6} className={styles.detailBtns}>
                            <span>是否就医：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('hasSeek')
                                  ?  basicPersonnelInformation.currnets[0].hasSeek : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>就医医院：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('seekHospital')
                                  ?  basicPersonnelInformation.currnets[0].seekHospital : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>就医时间</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('seekTime')
                                  ?  basicPersonnelInformation.currnets[0].seekTime : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>是否采取过防护措施：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('controlMeasures')
                                  ?  basicPersonnelInformation.currnets[0].controlMeasures : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={12} className={styles.detailBtns}>
                            <span>什么时间内采取的防护措施：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('controlTime')
                                  ?  basicPersonnelInformation.currnets[0].controlTime : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>下步拟采取措施：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('nextMeasures')
                                  ?  basicPersonnelInformation.currnets[0].nextMeasures : '---' : '---':'---':'---'}
                                        </span>
                          </Col>

                        </Row>
                        <Row className={styles.detailTitle}>
                          <Col span={6}>
                            <span>填报日期：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('createTime')
                                  ?  basicPersonnelInformation.currnets[0].createTime : '---' : '---':'---':'---'}
                                        </span>
                          </Col>
                          <Col span={6}>
                            <span>摸排人：</span>
                            <span>{basicPersonnelInformation ? basicPersonnelInformation.hasOwnProperty('currnets')
                              ? basicPersonnelInformation.touch.length > 0
                                ? basicPersonnelInformation.currnets[0].hasOwnProperty('fillUserName')
                                  ?  basicPersonnelInformation.currnets[0].fillUserName : '---' : '---':'---':'---'}
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
