import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import styles from './StepForm/style.less';
import {EnumIconSrc} from './../../constants/dataSync/EnumSyncCommon';
import testMysql from './imgs/testMysql.jpg';
import {
    Form,
    Modal,
    Spin,
} from 'antd';

//分步界面- 新建任务界面
@connect(({dataSyncNewMission, loading}) => ({
    dataSyncNewMission,
    dataSourceStatus: loading.effects['dataSyncNewMission/fetchDataSourcePluginsAction'],
    dataDestinationStatus: loading.effects['dataSyncNewMission/fetchDataDestinationPluginsAction'],
}))
@Form.create()
class SyncChooseDataTypeModal extends PureComponent {

    //选择类型
    chooseType = currentDataInfo => {
        const {dispatch, dataSyncNewMission} = this.props;
        const {configDataModalVisible} = dataSyncNewMission;
        dispatch({
            type: 'dataSyncNewMission/changeCurrentDataInfoAction',
            currentDataInfo,
        });
        dispatch({
            type: 'dataSyncNewMission/changeConfigDataModalAction',
            configDataModalVisible: !configDataModalVisible,
        });
        //关闭当前模态框
        this.closeDataModal();
    };

    //关闭当前模态框
    closeDataModal = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'dataSyncNewMission/changeDataModalVisibleAction',
            dataModalVisible: false,
        });
    };

    //渲染dom节点
    renderAllItems = data => {
        const {dataSyncNewMission, dataSourceStatus, dataDestinationStatus} = this.props;
        const {modalType} = dataSyncNewMission;
        return (modalType === 'dataOrigin' ? (
            dataSourceStatus
        ) : (
            dataDestinationStatus
        )) ? (
            <Spin/>
        ) : (
            <ul
                className={styles.dataOrigin + ' clearfix'}
                style={{
                    height: modalType === 'dataOrigin' ? 530 : 632,
                }}
            >
                {data.map((val, idx) => {
                    return (
                        <li key={idx} onClick={() => this.chooseType(val)}>
                            {/*<img src={require("./../imgs/"+ val.icon + ".jpg")} alt=""/>*/}
                            <img
                                src={val.hasOwnProperty('icon') ? EnumIconSrc[val.icon].url : testMysql}
                                alt=""
                            />
                            <span>{val.name}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };

    render() {
        const {dataSyncNewMission} = this.props;
        const {modalType, dataOriginList, dataDestinationList, dataModalVisible} = dataSyncNewMission;
        return (
            <Modal
                title={modalType === 'dataOrigin' ? '选择数据源类型' : '选择数据目的地类型'}
                visible={dataModalVisible}
                footer={null}
                onCancel={this.closeDataModal}
                centered={true}
                className={styles.dataOriginModal}
            >
                {modalType === 'dataOrigin' ? this.renderAllItems(dataOriginList) : this.renderAllItems(dataDestinationList)}
            </Modal>
        );
    }
}

export default SyncChooseDataTypeModal;
