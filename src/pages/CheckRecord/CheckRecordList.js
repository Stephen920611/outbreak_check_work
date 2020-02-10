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
@connect(({metadataManage, loading}) => ({
  metadataManage,
  loading: loading.models.metadataManageList,
  fetchTreeStatus: loading.effects['metadataManage/getDataResourceTreeAction'],
}))
// class CheckRecordList
@Form.create()
class CheckRecordList extends PureComponent {
  cacheOriginData = {};
  state = {
    currentPage: EnumDataSyncPageInfo.defaultPage,//分页
    selectRows: [], //选择的数据列
    selectedKey:'',//树节点默认选中的值
    treeData:[
      {
        children: [
          {
            children: [],
            id: "GA001",
            key: "GA001",
            name: "芝罘区",
            pId: "GA",
            title: "芝罘区",
          }
        ],
        id: "GA",
        key: "GA",
        name: "烟台市",
        pId: "0",
        title: "烟台市",
      }
    ],
    tableData:[
      {
        key:1,
        address:'县市区',
        name:'姓名',
        age:18,
        sex:'性别',
        createDate:'创建时间',
        pId:'123456787',
        status:'基本状况',
      }
    ]
  };

  componentDidMount() {
    const {dispatch,location} = this.props;
    //判断是不是从详情页跳转的
    if(location.hasOwnProperty('params')&&location['params'].hasOwnProperty('name')&&location['params']['name']){
      this.props.form.setFieldsValue({
        resourceName: location['params']['name']
      });
    }
    //默认获取数据资源树接口
    new Promise((resolve, reject) => {
      dispatch({
        type: 'metadataManage/getDataResourceTreeAction',
        resolve,
        reject,
      });
    }).then(response => {
      if (response.result === 'true') {
        //获取数据源列表
        this.fetchDataList();
      } else {
        T.prompt.error(response.message);
      }
    });
  }

  //获取当前页数数据
  fetchDataList = () => {
    const {dispatch, form, metadataManage} = this.props;
    const {dataSourceTypeTreeOldData} = metadataManage;
    const {currentPage} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //数据资源分类
        let categoryCode = '';
        dataSourceTypeTreeOldData.map(val => {
          if (values.resourceType === val.name) {
            categoryCode = val.id;
          }
        });
        dispatch({
          type: 'metadataManage/getDataResourceManagementListAction',
          params: {
            page: currentPage,
            pageSize: EnumDataSyncPageInfo.defaultPageSize,
            "dataSourceId": T.lodash.isUndefined(values.dataSourceName) ? '' : values.dataSourceName, //数据源ID 非必填
            "categoryCode": categoryCode, //数据资源分类 非必填
            "code": T.lodash.isUndefined(values.resourceCode) ? '' : values.resourceCode, //资源编码 非必填
            "name": T.lodash.isUndefined(values.resourceName) ? '' : values.resourceName, //资源名称 非必填
            "status": T.lodash.isUndefined(values.status) ? '' : values.status, //资源名称 非必填
          },
        });
      }
    });

  };

  //重置表单
  resetDataSource = () => {
    this.props.form.resetFields();
    this.setState({
      selectedKey:''
    });
    this.fetchDataList();
  };

  //树选择
  onSelect = (keys, event) => {
    //点击选中事件，属性可以打印查看
    const eventData = event.node.props;
    this.props.form.setFieldsValue({
      resourceType: eventData.name
    });
    this.setState({
      selectedKey:keys[0]
    });
    this.fetchDataList();
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
    const {selectRows} = this.state;
    if (selectRows.length > 0) {
      let ids = selectRows.map(val => {
        return val.id
      });
      let key = ids.join(',');
      this.removeData(key);
    } else {
      T.prompt.error("请选择需要删除的行");
    }
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

  onTreeChange = (e,node) => {
    this.setState({
      selectedKey : node.props.id,
    });
  };
  //查询-数据库类型 渲染下拉选项
  renderSelectOption = (selectDataSource)=> {
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
    const {treeData,tableData}=this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '县市区',
        dataIndex: '',
        key: 'address',
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
        title:'性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '身份证号',
        dataIndex: 'pId',
        key: 'pId',
      },

      {
        title: '被调查人基本情况',
        dataIndex: 'base',
        key: 'base',
      },
      {
        title: '身体状况',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '摸排人',
        dataIndex: 'head',
        key: 'head',
      },
      {
        title: '操作',
        key: 'action',
        // width: '15%',
        render: (text, record) => {
          return (
            <span>

              <a onClick={e => this.showMetadataManage(e, record)}>查看详情</a>
            </span>
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
    const {currentPage,selectedKey} = this.state;
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
                    selectedKeys = {[selectedKey]}
                  >
                    {this.renderTreeNodes(treeData)}
                  </DirectoryTree>
              }
            </Card>
          </Col>
          <Col xl={19} lg={19} md={19} sm={24} xs={24} className={styles.dataSourceTableList}>

            <Form layout="inline" onSubmit={this.searchDataSource}>
              <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`} style={{marginBottom:10}}>
                <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                  <Form.Item
                    label={<FormattedMessage
                      id="checkRecord.resourceList.person.label"/>}
                  >

                    {getFieldDecorator('person', {
                      rules: [
                        {
                          message: formatMessage({
                            id: 'checkRecord.resourceList.person.placeholder',
                          }),
                        },
                      ],
                    })(
                      <Input
                        autoComplete="off"
                        placeholder={formatMessage({
                          id:'checkRecord.resourceList.person.placeholder',
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

                    {getFieldDecorator('startDate', {
                      rules: [
                        {
                          message: formatMessage({
                            id: 'checkRecord.resourceList.startDate.placeholder',
                          }),
                        },
                      ],
                    })(
                      <DatePicker  />
                    )}
                  </Form.Item>
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={24}>
                  <Form.Item
                    label={<FormattedMessage
                      id="checkRecord.resourceList.endDate.label"/>}
                  >

                    {getFieldDecorator('endDate', {
                      rules: [
                        {
                          message: formatMessage({
                            id: 'checkRecord.resourceList.endDate.placeholder',
                          }),
                        },
                      ],
                    })(
                      <DatePicker  />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`} style={{marginBottom:10}}>

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
                          <FormattedMessage id="checkRecord.resourceList.base.option.abnormal"/>
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
                          <FormattedMessage id="checkRecord.resourceList.base.option.abnormal"/>
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

                    {getFieldDecorator('head', {
                      rules: [
                        {
                          message: formatMessage({
                            id: 'checkRecord.resourceList.head.placeholder',
                          }),
                        },
                      ],
                    })(
                      <Input
                        autoComplete="off"
                        placeholder={formatMessage({
                          id:'checkRecord.resourceList.person.placeholder',
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
            <Row className={`${styles.dataSourceTitle} ${styles.tableListForms}`} style={{marginBottom:10}}>
              检索结果：1024
            </Row>

            <Row>
              <Card bordered={false} >
                <Table
                  columns={columns}
                  dataSource={tableData}
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
