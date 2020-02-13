
export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            {path: '/user', redirect: '/user/login'},
            {path: '/user/login', name: 'login', component: './User/Login'},
            {path: '/user/register', name: 'register', component: './User/Register'},
            {
                path: '/user/register-result',
                name: 'register.result',
                component: './User/RegisterResult',
            },
            {
                component: '404',
            },
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
            // dashboard
            {path: '/', redirect: '/jobStatistics', authority: ['admin']},
            /*----------------- 首页 -------------------*/
            // {
            //     path: '/dashboard',
            //     name: 'dashboard',
            //     icon: 'home',
            //     component: './Dashboard/Index',
            // },

            /*----------------- 摸排工作统计 -------------------*/
            {
                path: '/jobStatistics',
                name: 'jobStatistics',
                icon: 'home',
                component: './JobStatistics/JobStatisticsList',
                authority: ['admin']
            },
            {
                path: '/checkRecord/showDetail',
                component: './CheckRecord/CheckRecordDetail',
                authority: ['admin']
            },

            /*----------------- 摸排记录查询 -------------------*/
            {
                path: '/checkRecord',
                name: 'checkRecord',
                icon: 'home',
                component: './CheckRecord/CheckRecordList',
                authority: ['admin']
            },
            {
                path: '/checkRecord/showDetail',
                component: './CheckRecord/CheckRecordDetail',
                authority: ['admin']
            },
            /*----------------- 摸排记录查询 -------------------*/
            {
                path: '/addInfo',
                name: 'addInfo',
                icon: 'home',
                component: './AddInfo/AddInfo',
                // authority: ['user','admin'],
                authority: ['user'],
            },
            {
                path: '/addInfo/addInfoList',
                component: './AddInfo/AddInfoList',
                // authority: ['user','admin'],
                authority: ['user'],
            },
            {
                path: '/addInfo/addInfoDetail',
                component: './AddInfo/AddInfoDetail',
                // authority: ['user','admin'],
                authority: ['user'],
            },
            {
                path: '/addInfo/addInfoEdit',
                component: './AddInfo/AddInfoEdit',
                // authority: ['user','admin'],
                authority: ['user'],
            },
            /*----------------- 摸排工作统计表 -------------------*/
            // {
            //     path: '/touchStatisticsPage',
            //     name: 'touchStatisticsPage',
            //     icon: 'home',
            //     component: './TouchStatisticsPage/StatisticsList',
            // },
            // /*----------------- 元数据管理 -------------------*/
            // {
            //     path: '/metadataManage',
            //     name: 'metadataManage',
            //     icon: 'appstore',
            //     routes: [
            //         {
            //             path: '/metadataManage/dataSourceManagement',
            //             name: 'dataSourceManagement',
            //             hideChildrenInMenu: true,
            //             routes: [
            //                 {
            //                     path: '/metadataManage/dataSourceManagement',
            //                     redirect: '/metadataManage/dataSourceManagement/info',
            //                 },
            //                 {
            //                     path: '/metadataManage/dataSourceManagement/info',
            //                     component: './MetadataManage/DataSourceManagement',
            //                 },
            //                 {
            //                     path: '/metadataManage/dataSourceManagement/dataSourceQuickRegister',
            //                     name: 'dataSourceQuickRegister',
            //                     component: './MetadataManage/DataSourceQuickRegister',
            //                 },
            //             ],
            //         },
            //         {
            //             path: '/metadataManage/resourceManagement',
            //             name: 'resourceManagement',
            //             // component: './MetadataManage/ResourceManagement',
            //             hideChildrenInMenu: true,
            //             routes: [
            //                 {
            //                     path: '/metadataManage/resourceManagement',
            //                     redirect: '/metadataManage/resourceManagement/info',
            //                 },
            //                 {
            //                     path: '/metadataManage/resourceManagement/info',
            //                     component: './MetadataManage/ResourceManagement',
            //                 },
            //                 {
            //                     path: '/metadataManage/resourceManagement/resourceRegister',
            //                     name: 'resourceRegister',
            //                     component: './MetadataManage/ResourceRegister',
            //                 },
            //             ],
            //         },
            //         {
            //             path: '/metadataManage/metadataManageConfig',
            //             name: 'metadataManageConfig',
            //             // component: './MetadataManage/DataManage',
            //             hideChildrenInMenu: true,
            //             routes: [
            //                 {
            //                     path: '/metadataManage/metadataManageConfig',
            //                     redirect: '/metadataManage/metadataManageConfig/info',
            //                 },
            //                 {
            //                     path: '/metadataManage/metadataManageConfig/info',
            //                     component: './MetadataManage/MetadataManageConfig',
            //                 },
            //                 {
            //                     path: '/metadataManage/metadataManageConfig/metadataManageConfigObserve',
            //                     name: 'metadataManageConfigObserve',
            //                     component: './MetadataManage/MetadataManageConfigObserve',
            //                 },
            //                 {
            //                     path: '/metadataManage/metadataManageConfig/metadataManageConfigDifferent',
            //                     name: 'metadataManageConfigDifferent',
            //                     component: './MetadataManage/MetadataManageConfigDifferent',
            //                 },
            //             ],
            //         },
            //         /*{
            //             path: '/metadataManage/dataManage',
            //             name: 'dataManage',
            //             component: './MetadataManage/DataManage',
            //         },*/
            //         {
            //             path: '/metadataManage/metadataManageSearch',
            //             name: 'metadataManageSearch',
            //             component: './MetadataManage/MetadataManageSearch',
            //         },
            //     ],
            // },
            // /*----------------- 数据接入 -------------------*/
            // {
            //     path: '/dataTask',
            //     name: 'dataTask',
            //     icon: 'container',
            //     component: './DataSync/DataSyncList',
            // },
            // {
            //     path: '/dataTask/newTaskFlow',
            //     component: './DataSync/NewTaskFlow',
            // },
            // {
            //     path: '/dataTask/accessDetail',
            //     component: './DataSync/AccessDetail',
            // },
            // {
            //     path: '/dataTask/missionDetail',
            //     component: './DataSync/SyncMissionDetail',
            // },
            // {
            //     path: '/dataTask/step-form',
            //     component: './DataSync/StepForm',
            //     routes: [
            //         {
            //             path: '/dataTask/step-form/sourceType',
            //             name: 'sourceType',
            //             component: './DataSync/StepForm/SourceStep1',
            //         },
            //         {
            //             path: '/dataTask/step-form/config',
            //             name: 'config',
            //             component: './DataSync/StepForm/SourceStep2',
            //         },
            //         {
            //             path: '/dataTask/step-form/rule',
            //             name: 'rule',
            //             component: './DataSync/StepForm/SourceStep3',
            //         },
            //         {
            //             path: '/dataTask/step-form/active',
            //             name: 'active',
            //             component: './DataSync/StepForm/SourceStep4',
            //         }
            //     ],
            // },
            // {
            //     path: '/dataTask/remoteStep',
            //     component: './DataSync/RemoteDataStep',
            //     routes: [
            //         {
            //             path: '/dataTask/remoteStep/step1',
            //             component: './DataSync/RemoteDataStep/RemoteDataStep1',
            //         },
            //         {
            //             path: '/dataTask/remoteStep/step2',
            //             component: './DataSync/RemoteDataStep/RemoteDataStep2',
            //         },
            //         {
            //             path: '/dataTask/remoteStep/step3',
            //             component: './DataSync/RemoteDataStep/RemoteDataStep3',
            //         },
            //     ],
            // },
            // /*----------------- 数据分发 -------------------*/
            // {
            //     path: '/dataDistribution',
            //     name: 'dataDistribution',
            //     icon: 'deployment-unit',
            //     component: './DataDistribution/DataDistributionList',
            // },
            // {
            //     path: '/dataDistribution/distributeConfig',
            //     component: './DataDistribution/DistributeConfig',
            // },
            // {
            //     path: '/dataDistribution/accessDetail',
            //     component: './DataSync/AccessDetail',
            // },
            // {
            //     path: '/dataDistribution/distributeDetail',
            //     component: './DataDistribution/DistributeDetail',
            // },
            // {
            //     path: '/dataDistribution/step-form',
            //     component: './DataSync/StepForm',
            //     routes: [
            //         {
            //             path: '/dataDistribution/step-form/sourceType',
            //             name: 'sourceType',
            //             component: './DataSync/StepForm/SourceStep1',
            //         },
            //         {
            //             path: '/dataDistribution/step-form/config',
            //             name: 'config',
            //             component: './DataSync/StepForm/SourceStep2',
            //         },
            //         {
            //             path: '/dataDistribution/step-form/rule',
            //             name: 'rule',
            //             component: './DataSync/StepForm/SourceStep3',
            //         },
            //         {
            //             path: '/dataDistribution/step-form/active',
            //             name: 'active',
            //             component: './DataSync/StepForm/SourceStep4',
            //         }
            //     ],
            // },
            // /*----------------- 运行监控 -------------------*/
            // {
            //     path: '/operateMonitor',
            //     name: 'operateMonitor',
            //     icon: 'dashboard',
            //     routes: [
            //         {
            //             path: '/operateMonitor/pluginsSetting',
            //             name: 'pluginsSetting',
            //             component: './PluginManage/PluginList',
            //         },
            //     ],
            // },
            // /*----------------- 集群管理 -------------------*/
            // {
            //     path: '/clusterManage',
            //     name: 'clusterManage',
            //     icon: 'cluster',
            //     routes: [
            //         {
            //             path: '/clusterManage/clusterManageList',
            //             name: 'clusterManagement',
            //             component: './ClusterManage/ClusterManageList',
            //         },
            //         {
            //             path: '/clusterManage/clusterMessage',
            //             name: 'clusterMessage',
            //             component: './ClusterManage/ClusterMessage',
            //         },
            //     ],
            // },
            // /*----------------- 系统管理 -------------------*/
            // {
            //     path: '/systemManage',
            //     name: 'systemManage',
            //     icon: 'setting',
            //     routes: [
            //         {
            //             path: '/systemManage/webTools',
            //             icon: 'folder',
            //             name: 'webTools',
            //             routes: [
            //                 {
            //                     path: '/systemManage/webTools/dashboard',
            //                     name: 'dashboard',
            //                     icon: 'dashboard',
            //                     routes: [
            //                         {
            //                             path: '/systemManage/webTools/dashboard/analysis',
            //                             name: 'analysis',
            //                             component: './Dashboard/Analysis',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/dashboard/monitor',
            //                             name: 'monitor',
            //                             component: './Dashboard/Monitor',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/dashboard/workplace',
            //                             name: 'workplace',
            //                             component: './Dashboard/Workplace',
            //                         },
            //                     ],
            //                 },
            //                 {
            //                     path: '/systemManage/webTools/editor',
            //                     name: 'editor',
            //                     icon: 'highlight',
            //                     routes: [
            //                         {
            //                             path: '/systemManage/webTools/editor/flow',
            //                             name: 'flow',
            //                             component: './Editor/GGEditor/Flow',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/editor/mind',
            //                             name: 'mind',
            //                             component: './Editor/GGEditor/Mind',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/editor/koni',
            //                             name: 'koni',
            //                             component: './Editor/GGEditor/Koni',
            //                         },
            //                     ],
            //                 },
            //                 // forms
            //                 {
            //                     path: '/systemManage/webTools/form',
            //                     icon: 'form',
            //                     name: 'form',
            //                     routes: [
            //                         {
            //                             path: '/systemManage/webTools/form/basic-form',
            //                             name: 'basicform',
            //                             component: './Forms/BasicForm',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/form/step-form',
            //                             name: 'stepform',
            //                             component: './Forms/StepForm',
            //                             hideChildrenInMenu: true,
            //                             routes: [
            //                                 {
            //                                     path: '/systemManage/webTools/form/step-form',
            //                                     redirect: '/systemManage/webTools/form/step-form/info',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/form/step-form/info',
            //                                     name: 'info',
            //                                     component: './Forms/StepForm/Step1',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/form/step-form/confirm',
            //                                     name: 'confirm',
            //                                     component: './Forms/StepForm/Step2',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/form/step-form/result',
            //                                     name: 'result',
            //                                     component: './Forms/StepForm/Step3',
            //                                 },
            //                             ],
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/form/advanced-form',
            //                             name: 'advancedform',
            //                             authority: ['admin'],
            //                             component: './Forms/AdvancedForm',
            //                         },
            //                     ],
            //                 },
            //                 // list
            //                 {
            //                     path: '/systemManage/webTools/list',
            //                     icon: 'table',
            //                     name: 'list',
            //                     routes: [
            //                         {
            //                             path: '/systemManage/webTools/list/table-list',
            //                             name: 'searchtable',
            //                             component: './List/TableList',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/list/basic-list',
            //                             name: 'basiclist',
            //                             component: './List/BasicList',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/list/card-list',
            //                             name: 'cardlist',
            //                             component: './List/CardList',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/list/search',
            //                             name: 'searchlist',
            //                             component: './List/List',
            //                             routes: [
            //                                 {
            //                                     path: '/systemManage/webTools/list/search',
            //                                     redirect: '/systemManage/webTools/list/search/articles',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/list/search/articles',
            //                                     name: 'articles',
            //                                     component: './List/Articles',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/list/search/projects',
            //                                     name: 'projects',
            //                                     component: './List/Projects',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/list/search/applications',
            //                                     name: 'applications',
            //                                     component: './List/Applications',
            //                                 },
            //                             ],
            //                         },
            //                     ],
            //                 },
            //                 {
            //                     path: '/systemManage/webTools/profile',
            //                     name: 'profile',
            //                     icon: 'profile',
            //                     routes: [
            //                         // profile
            //                         {
            //                             path: '/systemManage/webTools/profile/basic',
            //                             name: 'basic',
            //                             component: './Profile/BasicProfile',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/profile/basic/:id',
            //                             hideInMenu: true,
            //                             component: './Profile/BasicProfile',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/profile/advanced',
            //                             name: 'advanced',
            //                             authority: ['admin'],
            //                             component: './Profile/AdvancedProfile',
            //                         },
            //                     ],
            //                 },
            //                 {
            //                     name: 'result',
            //                     icon: 'check-circle-o',
            //                     path: '/systemManage/webTools/result',
            //                     routes: [
            //                         // result
            //                         {
            //                             path: '/systemManage/webTools/result/success',
            //                             name: 'success',
            //                             component: './Result/Success',
            //                         },
            //                         {path: '/systemManage/webTools/result/fail', name: 'fail', component: './Result/Error'},
            //                     ],
            //                 },
            //                 {
            //                     name: 'exception',
            //                     icon: 'warning',
            //                     path: '/systemManage/webTools/exception',
            //                     routes: [
            //                         // exception
            //                         {
            //                             path: '/systemManage/webTools/exception/403',
            //                             name: 'not-permission',
            //                             component: './Exception/403',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/exception/404',
            //                             name: 'not-find',
            //                             component: './Exception/404',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/exception/500',
            //                             name: 'server-error',
            //                             component: './Exception/500',
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/exception/trigger',
            //                             name: 'trigger',
            //                             hideInMenu: true,
            //                             component: './Exception/TriggerException',
            //                         },
            //                     ],
            //                 },
            //                 {
            //                     path: '/systemManage/webTools/account',
            //                     name: 'account',
            //                     icon: 'user',
            //                     routes: [
            //                         {
            //                             path: '/systemManage/webTools/account/center',
            //                             name: 'center',
            //                             component: './Account/Center/Center',
            //                             routes: [
            //                                 {
            //                                     path: '/systemManage/webTools/account/center',
            //                                     redirect: '/systemManage/webTools/account/center/articles',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/account/center/articles',
            //                                     component: './Account/Center/Articles',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/account/center/applications',
            //                                     component: './Account/Center/Applications',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/account/center/projects',
            //                                     component: './Account/Center/Projects',
            //                                 },
            //                             ],
            //                         },
            //                         {
            //                             path: '/systemManage/webTools/account/settings',
            //                             name: 'settings',
            //                             component: './Account/Settings/Info',
            //                             routes: [
            //                                 {
            //                                     path: '/systemManage/webTools/account/settings',
            //                                     redirect: '/systemManage/webTools/account/settings/base',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/account/settings/base',
            //                                     component: './Account/Settings/BaseView',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/account/settings/security',
            //                                     component: './Account/Settings/SecurityView',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/account/settings/binding',
            //                                     component: './Account/Settings/BindingView',
            //                                 },
            //                                 {
            //                                     path: '/systemManage/webTools/account/settings/notification',
            //                                     component: './Account/Settings/NotificationView',
            //                                 },
            //                             ],
            //                         }
            //                     ],
            //                 },
            //
            //
            //             ],
            //         },
            //     ],
            // },
            {
                component: '404',
            },
        ],
    },
];
