/**
 * @description
 * @Version Created by Qina on 2019/8/20.
 * @Author Qina
 * @license dongfangdianzi
 */
import React from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import styles from './NewTaskFlow.less';

import {Button, Row, Col} from 'antd';
import T from '../../utils/T';
import showImg from './imgs/404.svg'

//新建任务界面
@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
}))
class Exception extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    //新建本地数据接入
    createNewTask = () => {
        const {dispatch} = this.props;
        //更改页面类型
        dispatch({
            type: 'dataSyncNewMission/changeModalTypeAction',
            modalType: 'dataOrigin',
        });
        router.push({
            pathname: '/dataTask/step-form/sourceType',
            params: {
                isRouterPush: true,
            },
        })
    };

    //新建远程数据接入
    createRemoteDataAccess = () => {
        router.push({
            pathname: '/dataTask/remoteStep/step1',
            params: {
                isRouterPush: true,
            },
        })
    };

    render() {
        const {
            img,
        } = this.props;
        const pageType = '欢迎使用数据分发平台';
        return (
            <div className={styles.exception}>
                <Row gutter={24}>
                    <div className={styles.content}>
                        <h1>{pageType}</h1>
                        <div
                            className={styles.actions}
                        >
                            <Button size="large" onClick={this.createNewTask}>本地数据接入</Button>
                            <Button size="large" onClick={this.createRemoteDataAccess}>远程数据接入</Button>
                        </div>
                        <div className={styles.desc}>立即点击“数据接入”，用数据分发平台解决您的数据工作。</div>
                    </div>
                </Row>
                <Row gutter={24} type="flex" justify="center">
                    <Col xl={4} lg={4} md={4} sm={4} className={styles.titleText}>
                        <div>本地数据接入</div>
                    </Col>
                    <Col xl={2} lg={3} md={4} sm={5} className={styles.imgBlock}>
                        <img src={showImg} alt="" className={styles.imgEle}/>
                        <div className={styles.imgText}>1.选择数据源类型</div>
                    </Col>
                    <Col xl={2} lg={3} md={4} sm={5} className={styles.imgBlock} offset={1}>
                        <img src={img || showImg} alt="" className={styles.imgEle}/>
                        <div className={styles.imgText}>2.数据源配置</div>
                    </Col>
                    <Col xl={2} lg={3} md={4} sm={5} className={styles.imgBlock} offset={1}>
                        <img src={img || showImg} alt="" className={styles.imgEle}/>
                        <div className={styles.imgText}>3.规则配置</div>
                    </Col>
                    <Col xl={2} lg={3} md={4} sm={5} className={styles.imgBlock} offset={1}>
                        <img src={img || showImg} alt="" className={styles.imgEle}/>
                        <div className={styles.imgText}>4.激活</div>
                    </Col>
                </Row>
                <Row gutter={24} type="flex" justify="center" style={{marginTop: 20}}>
                    <Col xl={4} lg={4} md={4} sm={4} className={styles.titleText}>
                        <div>远程数据接入</div>
                    </Col>
                    <Col xl={2} lg={3} md={4} sm={5} className={styles.imgBlock}>
                        <img src={img || showImg} alt="" className={styles.imgEle}/>
                        <div className={styles.imgText}>1.选择集群平台</div>
                    </Col>
                    <Col xl={2} lg={3} md={4} sm={5} className={styles.imgBlock} offset={1}>
                        <img src={img || showImg} alt="" className={styles.imgEle}/>
                        <div className={styles.imgText}>2.选择平台资源</div>
                    </Col>
                    <Col xl={2} lg={3} md={4} sm={5} className={styles.imgBlock} offset={1}>
                        <img src={img || showImg} alt="" className={styles.imgEle}/>
                        <div className={styles.imgText}>3.激活</div>
                    </Col>
                    <Col xl={2} lg={3} md={4} sm={5} className={styles.imgBlock} offset={1}>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Exception;
