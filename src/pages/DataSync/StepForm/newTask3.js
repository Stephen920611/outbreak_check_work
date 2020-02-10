import React, {Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import T from './../../../utils/T';
import styles from './style.less';
import {Button, Row, Col , Spin} from 'antd';

//分步界面- 配置规则
@connect(({dataSyncNewMission,loading}) => ({
    dataSyncNewMission,
    data: dataSyncNewMission.step,
    getMissionDetailStatus:loading.effects['dataSyncNewMission/getTaskDetailByIdAction'],
}))
class newTask3 extends React.PureComponent {

    componentDidMount() {
        const {dispatch, dataSyncNewMission, location} = this.props;
        //验证是否刷新页面
        T.auth.returnSpecialMainPage(location, '/dataTask/dataSync');
        const {getNewTaskData} = dataSyncNewMission;
        let params = {
            taskId: T.storage.getStorage('taskId'),
        };
        dispatch({
            type: 'dataSyncNewMission/getTaskDetailByIdAction',
            params,
        });
    }

    /**
     * 点击保存，修改任务状态
     */
    onFinish = () => {
        const {dataSyncNewMission} = this.props;
        const {getNewTaskData, getMissionDetail} = dataSyncNewMission;
        let params = {
            createBy: '',
            createDate: '',
            des: '',
            name: getMissionDetail.taskName,
            status: '',
            step: '5',
            updateBy: T.auth.getLoginInfo().user.loginCode,
            updateDate: '',
            sink: getMissionDetail.sink,
            source: getMissionDetail.source,
            uuid: T.storage.getStorage('taskId'),
        };
        const {dispatch} = this.props;
        new Promise((resolve, reject) => {
            dispatch({
                type: 'dataSyncNewMission/updateTaskByIdAction',
                params,
                resolve,
                reject,
            });
        }).then(response => {
            if (response.result === 'true') {
                router.push({
                    pathname: '/dataTask/missionDetail',
                    params: {
                        data: {
                            ...getMissionDetail,
                            step:'5',
                            taskId:T.storage.getStorage('taskId')
                        },
                        isRouterPush: true,
                    },
                });
            } else {
                T.prompt.error(response.message);
            }
        });
    };

    render() {
        const {getMissionDetailStatus, dataSyncNewMission} = this.props;
        const {getNewTaskData} = dataSyncNewMission;
        return (
            <Fragment>
                {getMissionDetailStatus ? <Spin size='large' className={styles.missionStep} /> :
                <Row gutter={24}>
                    <Col xl={24} lg={24} md={8} sm={24} xs={24} style={{textAlign: 'center'}}>
                        <Button type="primary" onClick={this.onFinish}>
                            保存
                        </Button>
                    </Col>
                </Row>}
            </Fragment>
        );
    }
}

export default newTask3;
