/**
 * @description
 * @Version Created by Stephen on 2019/8/22.
 * @Author Stephen
 * @license dongfangdianzi
 */

/**
 *
 * {
     *        "dataSourceName": {
                "mapTo": "dataSourceName",  //映射到后台需要的参数
                "formatValue": "form.syncConfigDataOriginModal.dataSourceName.label",   //统一的用枚举的label名字
                "value": "dataSourceName",      //本身的value值，用来映射到详情
            },
     * }
 */
//枚举数据任务-数据同步-新建数据源信息
export const EnumModalFormContent = {
    //数据源
    dataOrigin: {
        //ftp-csv输入
        'cn.gov.ytga.kafka.connect.file.FtpCsvSourceConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            databaseInfoId:{
                mapTo: 'databaseInfoId',
                formatValue: 'form.syncConfigDataOriginModal.databaseName.label',
                value: 'databaseInfoId',
            },
            serverAddress: {
                mapTo: 'ftp.server',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            port: {
                mapTo: 'ftp.port',
                formatValue: 'form.syncConfigDataOriginModal.port.label',
                value: 'port',
            },
            username: {
                mapTo: 'ftp.username',
                formatValue: 'form.syncConfigDataOriginModal.username.label',
                value: 'username',
            },
            password: {
                mapTo: 'ftp.password',
                formatValue: 'form.syncConfigDataOriginModal.password.label',
                value: 'password',
            },
            catalogue: {
                mapTo: 'ftp.dir',
                formatValue: 'form.syncConfigDataOriginModal.ftp.catalogue.label',
                value: 'catalogue',
            },
            filename: {
                mapTo: 'ftp.filename.regex',
                formatValue: 'form.syncConfigDataOriginModal.ftp.filename.label',
                value: 'filename',
            },
            csv: {
                mapTo: 'csv.format',
                formatValue: 'form.syncConfigDataOriginModal.ftp.csv.label',
                value: 'csv',
            },
            filed: {
                mapTo: 'csv.first.header.line',
                formatValue: 'form.syncConfigDataOriginModal.ftp.filed.label',
                value: 'filed',
            },
            header: {
                mapTo: 'csv.header.line',
                formatValue: 'form.syncConfigDataOriginModal.ftp.header.label',
                value: 'header',
            },
            coding: {
                mapTo: 'file.encode',
                formatValue: 'form.syncConfigDataOriginModal.ftp.coding.label',
                value: 'coding',
            },
        },
        //ftp-xml输入
        'cn.gov.ytga.kafka.connect.xmlmanager.XmlSourceConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            databaseInfoId:{
                mapTo: 'databaseInfoId',
                formatValue: 'form.syncConfigDataOriginModal.databaseName.label',
                value: 'databaseInfoId',
            },
            serverAddress: {
                mapTo: 'ftp.server',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            port: {
                mapTo: 'ftp.port',
                formatValue: 'form.syncConfigDataOriginModal.port.label',
                value: 'port',
            },
            username: {
                mapTo: 'ftp.username',
                formatValue: 'form.syncConfigDataOriginModal.username.label',
                value: 'username',
            },
            password: {
                mapTo: 'ftp.password',
                formatValue: 'form.syncConfigDataOriginModal.password.label',
                value: 'password',
            },
            catalogue: {
                mapTo: 'ftp.dir',
                formatValue: 'form.syncConfigDataOriginModal.ftp.catalogue.label',
                value: 'catalogue',
            },
            type: {
                mapTo: 'xml.type',
                formatValue: 'form.syncConfigDataOriginModal.ftp.xml.type.label',
                value: 'type',
            },
            code: {
                mapTo: 'xml.code',
                formatValue: 'form.syncConfigDataOriginModal.ftp.xml.code.label',
                value: 'code',
            },
            schema: {
                mapTo: 'xml.schema',
                formatValue: 'form.syncConfigDataOriginModal.ftp.xml.schema.label',
                value: 'schema',
            },
            tag: {
                mapTo: 'xml.tag',
                formatValue: 'form.syncConfigDataOriginModal.ftp.xml.tag.label',
                value: 'tag',
            },
        },
        //ftp输入
        ftpFileSourceConnector: {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            serverAddress: {
                mapTo: 'ftp.server',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            port: {
                mapTo: 'ftp.port',
                formatValue: 'form.syncConfigDataOriginModal.port.label',
                value: 'port',
            },
            username: {
                mapTo: 'ftp.username',
                formatValue: 'form.syncConfigDataOriginModal.username.label',
                value: 'username',
            },
            password: {
                mapTo: 'ftp.password',
                formatValue: 'form.syncConfigDataOriginModal.password.label',
                value: 'password',
            },
            catalogue: {
                mapTo: 'ftp.dir',
                formatValue: 'form.syncConfigDataOriginModal.ftp.catalogue.label',
                value: 'catalogue',
            },
            filename: {
                mapTo: 'ftp.filename.regex',
                formatValue: 'form.syncConfigDataOriginModal.ftp.filename.label',
                value: 'filename',
            },
            coding: {
                mapTo: 'file.encode',
                formatValue: 'form.syncConfigDataOriginModal.ftp.coding.label',
                value: 'coding',
            },
        },
        //rabbitmq输入
        'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSourceConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            databaseInfoId:{
                mapTo: 'databaseInfoId',
                formatValue: 'form.syncConfigDataOriginModal.databaseName.label',
                value: 'databaseInfoId',
            },
            serverAddress: {
                mapTo: 'rabbitmq.host',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            port: {
                mapTo: 'rabbitmq.port',
                formatValue: 'form.syncConfigDataOriginModal.port.label',
                value: 'port',
            },
            username: {
                mapTo: 'rabbitmq.username',
                formatValue: 'form.syncConfigDataOriginModal.username.label',
                value: 'username',
            },
            password: {
                mapTo: 'rabbitmq.password',
                formatValue: 'form.syncConfigDataOriginModal.password.label',
                value: 'password',
            },
            queue: {
                mapTo: 'rabbitmq.queue',
                formatValue: 'form.syncConfigDataOriginModal.rabbitmq.queue.label',
                value: 'queue',
            },
            vhost: {
                mapTo: 'rabbitmq.virtual.host',
                formatValue: 'form.syncConfigDataOriginModal.vhost.label',
                value: 'vhost',
            },
        },
        //jdbc输入
        'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            databaseInfoId:{
                mapTo: 'databaseInfoId',
                formatValue: 'form.syncConfigDataOriginModal.databaseName.label',
                value: 'databaseInfoId',
            },
            connectionUrl: {
                mapTo: 'connection.url',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.url.label',
                value: 'connectionUrl',
            },
            mode: {
                mapTo: 'mode',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.mode.label',
                value: 'mode',
            },
            /*bulk: {
                mapTo: 'bulk.column.name',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.mode.option.bulk.label',
                value: 'bulk',
            },*/
            poll: {
                mapTo: 'poll.interval.ms',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.mode.option.bulk.label',
                value: 'bulk',
            },
            incrementing: {
                mapTo: 'incrementing.column.name',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.mode.option.incrementing.label',
                value: 'incrementing',
            },
            timestamp: {
                mapTo: 'timestamp.column.name',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.mode.option.timestamp.label',
                value: 'timestamp',
            },
            /*"timestamp+incrementing": {
                      "mapTo": "timestamp+incrementing.column.name",
                      "formatValue": "form.syncConfigDataOriginModal.jdbc.mode.option.timestampIncrementing.label",
                      "value": "timestamp+incrementing",
                  },*/
            whitelist: {
                mapTo: 'table.whitelist',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.tableList.option.whitelist.label',
                value: 'whitelist',
            },
            /*blacklist: {
                mapTo: 'table.blacklist',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.tableList.option.blacklist.label',
                value: 'blacklist',
            },*/
            /*table: {
                mapTo: 'table.tablelist',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.tableList.label',
                value: 'table',
            },*/
            /*topicPrefix: {
                mapTo: 'topic.prefix',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.prefix.label',
                value: 'topicPrefix',
            },*/
            /*query: {
                mapTo: 'query',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.query.label',
                value: 'query',
            },*/
            types: {
                mapTo: 'table.types',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.types.label',
                value: 'types',
            },
        },
        //kafka输入
        'cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            databaseInfoId:{
                mapTo: 'databaseInfoId',
                formatValue: 'form.syncConfigDataOriginModal.databaseName.label',
                value: 'databaseInfoId',
            },
            topic: {
                mapTo: 'kafka.topic',
                formatValue: 'form.syncConfigDataOriginModal.kafka.topic.label',
                value: 'topic',
            },
            /*serverAddress: {
                mapTo: 'kafka.server',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            register: {
                mapTo: 'kafka.schema.registry',
                formatValue: 'form.syncConfigDataOriginModal.kafka.register.label',
                value: 'register',
            },*/
            dataFormat: {
                mapTo: 'kafka.data.format.config',
                formatValue: 'form.syncConfigDataOriginModal.kafka.dataFormat.label',
                value: 'dataFormat',
            },
            isBeginning: {
                mapTo: 'kafka.from.beginning',
                formatValue: 'form.syncConfigDataOriginModal.kafka.isBeginning.label',
                value: 'isBeginning',
            },
            schema: {
                mapTo: 'kafka.schema',
                formatValue: 'form.syncConfigDataOriginModal.kafka.schema.label',
                value: 'schema',
            },
        },
        //kafka输入-可能会过期
        'io.confluent.connect.replicator.ReplicatorSourceConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            sourceAddress: {
                mapTo: 'src.kafka.bootstrap.servers',
                formatValue: 'form.syncConfigDataOriginModal.kafka.sourceAddress.label',
                value: 'sourceAddress',
            },
            sinkAddress: {
                mapTo: 'dest.kafka.bootstrap.servers',
                formatValue: 'form.syncConfigDataOriginModal.kafka.sinkAddress.label',
                value: 'sinkAddress',
            },
            copyTopic: {
                mapTo: 'topic.whitelist',
                formatValue: 'form.syncConfigDataOriginModal.kafka.copyTopic.label',
                value: 'copyTopic',
            },
        },
        //MySQL输入
        'io.debezium.connector.mysql.MySqlConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            server: {
                mapTo: 'database.hostname',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'server',
            },
            port: {
                mapTo: 'database.port',
                formatValue: 'form.syncConfigDataOriginModal.port.label',
                value: 'port',
            },
            username: {
                mapTo: 'database.user',
                formatValue: 'form.syncConfigDataOriginModal.username.label',
                value: 'username',
            },
            password: {
                mapTo: 'database.password',
                formatValue: 'form.syncConfigDataOriginModal.password.label',
                value: 'password',
            },
            serverId: {
                mapTo: 'database.server.id',
                formatValue: 'form.syncConfigDataOriginModal.mysql.serverId.label',
                value: 'serverId',
            },
            serverName: {
                mapTo: 'database.server.name',
                formatValue: 'form.syncConfigDataOriginModal.mysql.serverName.label',
                value: 'serverName',
            },
            whiteList: {
                mapTo: 'database.whitelist',
                formatValue: 'form.syncConfigDataOriginModal.mysql.whiteList.label',
                value: 'whiteList',
            },
        },
    },
    //数据目的地
    dataDestination: {
        //ftp-csv输出
        'cn.gov.ytga.kafka.connect.file.FtpCsvSinkConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            databaseInfoId:{
                mapTo: 'databaseInfoId',
                formatValue: 'form.syncConfigDataOriginModal.databaseName.label',
                value: 'databaseInfoId',
            },
            serverAddress: {
                mapTo: 'ftp.server',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            port: {
                mapTo: 'ftp.port',
                formatValue: 'form.syncConfigDataOriginModal.port.label',
                value: 'port',
            },
            username: {
                mapTo: 'ftp.username',
                formatValue: 'form.syncConfigDataOriginModal.username.label',
                value: 'username',
            },
            password: {
                mapTo: 'ftp.password',
                formatValue: 'form.syncConfigDataOriginModal.password.label',
                value: 'password',
            },
            catalogue: {
                mapTo: 'ftp.dir',
                formatValue: 'form.syncConfigDataOriginModal.ftp.catalogue.label',
                value: 'catalogue',
            },
            csv: {
                mapTo: 'csv.format',
                formatValue: 'form.syncConfigDataOriginModal.ftp.csv.label',
                value: 'csv',
            },
            coding: {
                mapTo: 'file.encode',
                formatValue: 'form.syncConfigDataOriginModal.ftp.coding.label',
                value: 'coding',
            },
        },
        //ftp输出
        ftpFileSinkConnector: {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            serverAddress: {
                mapTo: 'ftp.server',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            port: {
                mapTo: 'ftp.port',
                formatValue: 'form.syncConfigDataOriginModal.port.label',
                value: 'port',
            },
            username: {
                mapTo: 'ftp.username',
                formatValue: 'form.syncConfigDataOriginModal.username.label',
                value: 'username',
            },
            password: {
                mapTo: 'ftp.password',
                formatValue: 'form.syncConfigDataOriginModal.password.label',
                value: 'password',
            },
            catalogue: {
                mapTo: 'ftp.dir',
                formatValue: 'form.syncConfigDataOriginModal.ftp.catalogue.label',
                value: 'catalogue',
            },
        },
        //rabbitmq输出
        'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSinkConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSinkName.label',
                value: 'dataSourceName',
            },
            databaseInfoId:{
                mapTo: 'databaseInfoId',
                formatValue: 'form.syncConfigDataOriginModal.databaseName.label',
                value: 'databaseInfoId',
            },
            serverAddress: {
                mapTo: 'rabbitmq.host',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            port: {
                mapTo: 'rabbitmq.port',
                formatValue: 'form.syncConfigDataOriginModal.port.label',
                value: 'port',
            },
            username: {
                mapTo: 'rabbitmq.username',
                formatValue: 'form.syncConfigDataOriginModal.username.label',
                value: 'username',
            },
            password: {
                mapTo: 'rabbitmq.password',
                formatValue: 'form.syncConfigDataOriginModal.password.label',
                value: 'password',
            },
            vhost: {
                mapTo: 'rabbitmq.virtual.host',
                formatValue: 'form.syncConfigDataOriginModal.vhost.label',
                value: 'vhost',
            },
            routing: {
                mapTo: 'rabbitmq.routing.key',
                formatValue: 'form.syncConfigDataOriginModal.rabbitmq.routing.label',
                value: 'routing',
            },
            exchange: {
                mapTo: 'rabbitmq.exchange',
                formatValue: 'form.syncConfigDataOriginModal.rabbitmq.exchange.label',
                value: 'exchange',
            },
        },
        //jdbc输出
        'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSinkName.label',
                value: 'dataSourceName',
            },
            /*connectionUrl: {
                mapTo: 'connection.url',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.url.label',
                value: 'connectionUrl',
            },*/
            databaseInfoId: {
                mapTo: 'databaseInfoId',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.url.label',
                value: 'databaseInfoId',
            },
            insert: {
                mapTo: 'insert.mode',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.insertMode.label',
                value: 'insert',
            },
            pkMode: {
                mapTo: 'pk.mode',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.pkMode.label',
                value: 'pkMode',
            },
            noneFields: {
                mapTo: 'noneFields',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.none.label',
                value: 'noneFields',
            },
            fields: {
                mapTo: 'pk.fields',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.pkMode.fields.record_value.label',
                value: 'fields',
            },
            format: {
                mapTo: 'table.name.format',
                formatValue: 'form.syncConfigDataOriginModal.jdbc.format.label',
                value: 'format',
            },
        },
        //kafka输出
        'cn.gov.ytga.kafka.connect.replicate.KafkaSinkConnector': {
            dataSourceName: {
                mapTo: 'dataSourceName',
                formatValue: 'form.syncConfigDataOriginModal.dataSourceName.label',
                value: 'dataSourceName',
            },
            serverAddress: {
                mapTo: 'kafka.server',
                formatValue: 'form.syncConfigDataOriginModal.serverAddress.label',
                value: 'serverAddress',
            },
            topic: {
                mapTo: 'kafka.topic',
                formatValue: 'form.syncConfigDataOriginModal.kafka.topic.label',
                value: 'topic',
            },
        },
    },
};

//枚举数据任务-数据同步-新建数据源和目的地后台需要的不同的参数
export const EnumCreateProcessorSpecialParam = {
    //数据源
    dataOrigin: {
        //ftp-csv输入
        'cn.gov.ytga.kafka.connect.file.FtpCsvSourceConnector': {
            key: 'topic',
        },
        //ftp-xml输入
        'cn.gov.ytga.kafka.connect.xmlmanager.XmlSourceConnector':{
            key: 'topic',
        },
        //ftp输入
        ftpFileSourceConnector: {
            key: 'topic',
        },
        //rabbitmq输入
        'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSourceConnector': {
            key: 'kafka.topic',
        },
        //jdbc输入
        'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector': {
            key: 'topic',
        },
        //kafka输入
        'cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector': {
            key: 'topic',
        },
        //kafka输入-可能会过期
        'io.confluent.connect.replicator.ReplicatorSourceConnector': {
            key: 'topic',
        },
        //debezium-mysql输入
        'io.debezium.connector.mysql.MySqlConnector': {
            key: 'database.history.kafka.topic',
        },
    },
    //数据目的地
    dataDestination: {
        //ftp-csv输出
        'cn.gov.ytga.kafka.connect.file.FtpCsvSinkConnector': {
            key: 'topics',
        },
        //ftp输出
        ftpFileSinkConnector: {
            key: 'topics',
        },
        //rabbitmq输出
        'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSinkConnector': {
            key: 'topics',
        },
        //jdbc输出
        'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector': {
            key: 'topics',
        },
        //kafka输出
        'cn.gov.ytga.kafka.connect.replicate.KafkaSinkConnector': {
            key: 'topic',
        },
    },
};

//有些参数是固定写死加上的，但是后端也会返回，前端不需要显示，所以需要按照种类去掉
export const EnumProcessorNoShowParams = {
    //rabbitmq输入
    'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSourceConnector': ['tasks.max'],
    //rabbitmq 输出
    'com.github.jcustenborder.kafka.connect.rabbitmq.RabbitMQSinkConnector': [
        'key.converter.schemas.enable',
        'value.converter.schemas.enable',
        'value.converter',
        'key.converter',
    ],
    //debezium-mysql 输入
    'io.debezium.connector.mysql.MySqlConnector': [
        'tasks.max',
        'database.history.kafka.bootstrap.servers',
    ],
    //jdbc 输出
    'cn.gov.ytga.kafka.connect.jdbc.JdbcSinkConnector': [
        'tasks.max',
        'key.converter.schemas.enable',
        'value.converter.schemas.enable',
        'value.converter',
        'key.converter',
    ],
    //jdbc 输入
    'cn.gov.ytga.kafka.connect.jdbc.JdbcSourceConnector': [
        'tasks.max',
        'key.converter.schemas.enable',
        'value.converter.schemas.enable',
        'value.converter',
        'key.converter',
        'topic.prefix',
        'table.tablelist',
    ],
    //kafka输入
    'cn.gov.ytga.kafka.connect.replicate.KafkaSourceConnector': [
        'key.converter.schemas.enable',
        'value.converter',
        'tasks.max',
        'key.converter',
        'header.converter',
        'value.converter.schemas.enable',
        'databaseName',
        'kafka.server',
        'kafka.schema.registry',

    ],
    //ftp-xml输入
    'cn.gov.ytga.kafka.connect.xmlmanager.XmlSourceConnector': [
        'tasks.max',
        'ftp.filename.regex'
    ],
};

//快速注册 - 队列or文件，枚举数据任务向后端传递
export const EnumQuickRegisterParams = {
    'ftp': {
        serverAddress: {
            mapTo: 'ftp.server',
            value: 'serverAddress',
        },
        port: {
            mapTo: 'ftp.port',
            value: 'port',
        },
        username: {
            mapTo: 'ftp.username',
            value: 'username',
        },
        password: {
            mapTo: 'ftp.password',
            value: 'password',
        },
        remarks:{
            mapTo: 'remarks',
            value: 'remarks',
        }
    },
    'kafka': {
        serverAddress: {
            mapTo: 'kafka.server',
            value: 'serverAddress',
        },
        /*registry: {
            mapTo: 'kafka.schema.registry',
            value: 'registry',
        },*/
        remarks:{
            mapTo: 'remarks',
            value: 'remarks',
        }
    },
    'rabbitmq': {
        serverAddress: {
            mapTo: 'rabbitmq.host',
            value: 'serverAddress',
        },
        port: {
            mapTo: 'rabbitmq.port',
            value: 'port',
        },
        username: {
            mapTo: 'rabbitmq.username',
            value: 'username',
        },
        password: {
            mapTo: 'rabbitmq.password',
            value: 'password',
        },
        remarks:{
            mapTo: 'remarks',
            value: 'remarks',
        }
    },
};
