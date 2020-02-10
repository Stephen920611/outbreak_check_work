import React, {PureComponent, Fragment, createRef} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import styles from './SyncChangeDataResourceModal.less';
import T from './../../utils/T';
import {EnumIconSrc} from './../../constants/dataSync/EnumSyncCommon';
import {
    Form,
    Modal,
    Spin,
    Input,
    Button,
    Row,
    Col,
    Checkbox,
    Divider,
    Radio,
} from 'antd';

const FormItem = Form.Item;
const {Search} = Input;
const plainOptions = [
    {
        title: 'Apple',
        key: 1
    },
    {
        title: 'Pear',
        key: 2
    },
    {
        title: 'Orange',
        key: 3
    },
    {
        title: 'Apple',
        key: 4
    }];
const defaultCheckedList = ['Apple', 'Orange'];

@connect(({metadataManage,dataSyncNewMission, loading}) => ({
    metadataManage,
    dataSyncNewMission,
    // loading: loading.models.dataSyncNewForm,
    dataResourceStatus: loading.effects['metadataManage/getDataResourceFromDataSourceAction'],
}))
@Form.create()
class SyncChangeDataResourceModal extends PureComponent {
    state = {
        dataResourceChecked: "",//选中的数据资源(未定义默认选中)
        // submitLoading: false,
        indeterminate: true,//全选样式控制
        checkAll: false,//点击全选
    };

    componentDidMount() {
        const {dispatch, dataSyncNewMission} = this.props;
        const {
            dataResourceNameSelected
        } = dataSyncNewMission;
        // console.log('dataResourceNameSelected',dataResourceNameSelected);

    };

    //确定所选择的数据资源
    onSubmitDataResource = (e) => {
        const {dispatch, form, setFormValue} = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            // console.log('values.checkboxGroup',values.checkboxGroup);
            if (!err) {
                if (values.checkboxGroup) {
                    //选中的列表写入model
                    dispatch({
                        type: 'dataSyncNewMission/setDataResourceRadioAction',
                        dataResourceRadio: values.checkboxGroup,
                    });
                    this.setState({
                        dataResourceChecked: ''
                    },() => {
                        //关闭弹窗
                        dispatch({
                            type: 'dataSyncNewMission/changeDataResourceModalVisibleAction',
                            htmlType: 'chooseResource',
                            modalVisible: false,
                        });
                        setFormValue('format',values.checkboxGroup)
                    });

                }
            }
        })
    };

    //单选
    onRadioChange = e => {
        // const {dispatch} = this.props;
        // //选中的列表写入model
        // dispatch({
        //     type: 'metadataManage/setDataResourceRadioAction',
        //     dataResourceRadio: e.target.value,
        // });
        this.setState({
            dataResourceChecked: e.target.value
        });
    };

    //全选
    onCheckAllChange = e => {
        const {
            metadataManage,
        } = this.props;
        const {dataResourceList} = metadataManage;
        this.setState({
            dataResourceChecked: e.target.checked ? dataResourceList : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    //数据资源列表
    renderCheckbox = data => {
        return data.map(item => {
            return (
                <Col span={12} key={item.key}>
                    <Checkbox
                        // options={item.title}
                        value={item}
                        onChange={this.onChange}
                    >{item.title}</Checkbox>
                </Col>
            );
        });
    };

    //渲染单选框
    renderRadioBox = data => {
        if(data && data.length>0){
            return data.map( (item,idx) => {
                return (
                    <Col span={12} key={idx}>
                        <Radio
                            // options={item.title}
                            value={item}
                        >
                            {item}
                        </Radio>
                    </Col>
                );
            });
        }

    };

    //搜索
    searchResource = (value) => {
        console.log(value);
    };

    //关闭弹窗
    closeDataResourceModel = (type) => {
        const {dispatch} = this.props;
        console.log(type);
        dispatch({
            type: 'dataSyncNewMission/changeDataResourceModalVisibleAction',
            htmlType: 'chooseResource',
            modalVisible: false,
        });
        //TODO 不确定要不要清空
        // //清空选择框
        // dispatch({
        //     type: 'metadataManage/setDataResourceRadioAction',
        //     dataResourceRadio: '',
        // });
    };

    render() {
        const {
            dataResourceModalState,
            closeDataResourceModel,
            dataSyncNewMission,
            metadataManage,
            form: {getFieldDecorator, getFieldValue},
            dataResourceStatus,
        } = this.props;
        const {dataResourceList, dataResourceModalVisible, selectDataSource, dataResourceRadio,dataResourceFromDataSource} = dataSyncNewMission;
        // const {dataResourceFromDataSource} = metadataManage;
        const {checkAll, dataResourceChecked, indeterminate} = this.state;
        return (
            <Modal
                title="选择数据资源"
                visible={dataResourceModalVisible}
                footer={null}
                onCancel={this.closeDataResourceModel}
                centered={true}
                className={styles.dataResourceModal}
            >
                <div>
                    <Search
                        onSearch={value => this.searchResource(value)}
                        // style={{ width: 200 }}
                        placeholder={formatMessage({id: "metadataManage.resourceManagement.resourceSearchForm.dataResource.placeholder"})}
                    />
                    <Form onSubmit={this.onSubmitDataResource} hideRequiredMark>
                        <FormItem>
                            {getFieldDecorator('checkboxGroup', {})(
                                <div>
                                    {/*<Row style={{marginBottom:10}}>*/}
                                    {/*<div style={{ borderBottom: '1px solid #E9E9E9' }}>*/}
                                    {/*<Checkbox*/}
                                    {/*value='all'*/}
                                    {/*indeterminate={indeterminate}*/}
                                    {/*onChange={this.onCheckAllChange}*/}
                                    {/*checked={checkAll}*/}
                                    {/*>*/}
                                    {/*全选*/}
                                    {/*</Checkbox>*/}
                                    {/*<Divider type="vertical"/>*/}
                                    {/*<span>已勾选total项</span>*/}
                                    {/*</div>*/}
                                    {/*</Row>*/}
                                    {/*<Checkbox.Group
                                        value={checkAll ? dataResourceList:dataResourceChecked}
                                        onChange={this.onChange}
                                        className={styles.dataResourceCheckbox}
                                        style={{ width: '100%' }}
                                    >
                                        <Row>
                                            {this.renderCheckbox(dataResourceList)}
                                        </Row>
                                    </Checkbox.Group>*/}
                                    <Radio.Group
                                        value={dataResourceChecked}
                                        onChange={this.onRadioChange}
                                        className={styles.dataResourceCheckbox}
                                        style={{width: '100%'}}
                                    >
                                        <Row>
                                            {dataResourceStatus ? <Spin /> : this.renderRadioBox(dataResourceFromDataSource)}
                                        </Row>
                                    </Radio.Group>
                                </div>
                            )}
                        </FormItem>
                        <FormItem className={styles.dataResourceSubmit}>
                            <Button
                                style={{marginLeft: 8}}
                                type="primary"
                                htmlType="submit"
                                // loading={submitLoading}
                            >
                                <FormattedMessage id="form.syncConfigDataOriginModal.submit"/>
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                onClick={this.closeDataResourceModel}
                                // loading={createStatus}
                            >
                                <FormattedMessage id="form.syncConfigDataOriginModal.clear"/>
                            </Button>
                        </FormItem>

                    </Form>
                </div>
            </Modal>
        );
    }
}

export default SyncChangeDataResourceModal;
