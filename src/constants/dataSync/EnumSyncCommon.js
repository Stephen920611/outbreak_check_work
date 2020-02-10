/**
 * @description
 * @Version Created by Stephen on 2019/8/22.
 * @Author Stephen
 * @license dongfangdianzi
 */
import csv from './../../../icons/csv.png';
import elasticsearch from './../../../icons/elasticsearch.png';
import ftp from './../../../icons/ftp.png';
import hbase from './../../../icons/hbase.png';
import kafka from './../../../icons/kafka.png';
import mysql from './../../../icons/mysql.png';
import oracle from './../../../icons/oracle.png';
import rabbitmq from './../../../icons/rabbitmq.png';

//数据接入和数据分发详情页面----处理器状态
export const EnumProcessorStatus = {
    "RUNNING": {
        "label": "正常（已激活）",
        "value": "RUNNING",
        "oldValue": "0",
        "color": "#52c41a",
    },
    "INACTIVED": {
        "label": "已保存（未激活）",
        "value": "INACTIVED",
        "oldValue": "1",
        "color": "#666",
    },
    "PAUSED": {
        "label": "暂停",
        "value": "PAUSED",
        "oldValue": "2",
        "color": "#faad14",
    },
    "FAILED": {
        "label": "异常",
        "value": "FAILED",
        "oldValue": "3",
        "color": "#f5222d",
    },
    "UNASSIGNED": {
        "label": "未分配",
        "value": "UNASSIGNED",
        "oldValue": "4",
        "color": "#b2b2b2",
    },
    "UNKNOWN": {
        "label": "未知",
        "value": "UNKNOWN",
        "oldValue": "999",
        "color": "#b2b2b2",
    },
};

//数据接入和分发列表以及详情页面各个图标激活状态的枚举
export const EnumSourceDataStatus = {
    "0": {
        "label": "已激活（运行中）",
        "value": "0",
        "color": "#52c41a",
    },
    "1": {
        "label": "已保存配置（未激活）",
        "value": "1",
        "color": "#666",
    },
    "2": {
        "label": "暂停",
        "value": "2",
        "color": "#faad14",
    },
    "3": {
        "label": "异常",
        "value": "3",
        "color": "#f5222d",
    },
    "4": {
        "label": "未保存",
        "value": "4",
        "color": "#b2b2b2",
    }
};

//数据接入和数据分发详情页面----运行中状态的枚举
export const EnumDataDistributeStatus = {
    "RUNNING": {
        "label": "正常（已激活）",
        "value": "RUNNING",
        "oldValue": "0",
        "color": "#52c41a",
    },
    "INACTIVED": {
        "label": "已保存（未激活）",
        "value": "INACTIVED",
        "oldValue": "1",
        "color": "#666",
    },
    "PAUSED": {
        "label": "暂停",
        "value": "PAUSED",
        "oldValue": "2",
        "color": "#faad14",
    },
    "FAILED": {
        "label": "异常",
        "value": "FAILED",
        "oldValue": "3",
        "color": "#f5222d",
    },
    "UNASSIGNED": {
        "label": "未分配",
        "value": "UNASSIGNED",
        "oldValue": "4",
        "color": "#b2b2b2",
    },
    "UNKNOWN": {
        "label": "未知",
        "value": "UNKNOWN",
        "oldValue": "999",
        "color": "#b2b2b2",
    },
    // "0": {
    //     "label": "正常",
    //     "value": "0",
    //     "color": "#52c41a",
    // },
    // "1": {
    //     "label": "停止",
    //     "value": "1",
    //     "color": "#666",
    // },
    // "2": {
    //     "label": "暂停",
    //     "value": "2",
    //     "color": "#faad14",
    // },
    // "3": {
    //     "label": "异常",
    //     "value": "3",
    //     "color": "#f5222d",
    // },
    // "4": {
    //     "label": "未保存",
    //     "value": "4",
    //     "color": "#b2b2b2",
    // }
};

//枚举数据任务-任务状态
export const EnumTaskStatus = {
    "0": {
        "label": "新建",
        "value": "0",
    },
    "1": {
        "label": "源成功",
        "value": "1",
    },
    "2": {
        "label": "目的成功",
        "value": "2",
    },
    "3": {
        "label": "新建任务成功",
        "value": "3",
    },
    "4": {
        "label": "任务设置",
        "value": "4",
    },
    "5": {
        "label": "配置规则",
        "value": "5",
    },
    "6": {
        "label": "激活",
        "value": "6",
    },
    "7": {
        "label": "运行中",
        "value": "7",
    },
};

//枚举数据任务-任务状态
export const EnumIconSrc = {
    "csv": {
        "label": "csv",
        "url": csv
    },
    "jdbc": {
        "label": "jdbc",
        "url": csv
    },
    "elasticsearch": {
        "label": "elasticsearch",
        "url": csv
    },
    "ftp": {
        "label": "ftp",
        "url": ftp
    },
    "hbase": {
        "label": "hbase",
        "url": hbase
    },
    "kafka": {
        "label": "kafka",
        "url": kafka
    },
    "mysql": {
        "label": "mysql",
        "url": mysql
    },
    "oracle": {
        "label": "oracle",
        "url": oracle
    },
    "rabbitmq": {
        "label": "rabbitmq",
        "url": rabbitmq
    },
    "FTP": {
        "label": "ftp",
        "url": ftp
    },
    "db2": {
        "label": "db2",
        "url": ftp
    },
};

//枚举元数据管理-数据源的状态
export const EnumDataSourceStatus = {
    "0": {
        "label": "正常",
        "value": "0",
    },
    "1": {
        "label": "禁用",
        "value": "1",
    },
};

//枚举集群管理 - 集群平台的的状态
export const EnumClusterStatus = {
    "1": {
        "label": "正常",
        "value": "1",
        "color": "#52c41a",
    },
    "2": {
        "label": "离线",
        "value": "2",
        "color": "#f5222d",
    },
    'UNKNOWN':{
        "label": "--",
        "value": "UNKNOWN",
    }
};

//枚举数据接入 - 远程数据接入的步骤条状态
export const EnumRemoteDataStepStatus = {
    "0": {
        "label": "选择集群平台",
        "value": 0,
    },
    "1": {
        "label": "选择平台资源",
        "value": 1,
    },
    "2": {
        "label": "激活",
        "value": 2,
    },
};

//枚举消息管理 - 审批消息的状态
export const EnumClusterMessageCheckStatus = {
    "0": {
        "label": "待审核",
        "color":"#1890ff",
        "value": "0",
        "status":"processing",
    },
    "1": {
        "label": "通过",
        "color":"#52c41a",
        "value": "1",
        "status":"success"

    },
    "2": {
        "label": "拒绝",
        "color":"#f5222d",
        "value": "2",
        "status":"error",
    },
    "UNKNOWN": {
        "label": "未知",
        "color":"#faad14",
        "value": "UNKNOWN",
        "status":"warning"
    },
};