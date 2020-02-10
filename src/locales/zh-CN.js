import analysis from './zh-CN/analysis';
import exception from './zh-CN/exception';
import form from './zh-CN/form';
import globalHeader from './zh-CN/globalHeader';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import monitor from './zh-CN/monitor';
import result from './zh-CN/result';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';
import component from './zh-CN/component';
import editor from './zh-CN/editor';
import metadataManage from './zh-CN/metadataManage';
import webTools from './zh-CN/webTools';
import dataDistribution from './zh-CN/dataDistribution';
import dashboard from './zh-CN/dashboard';
import clusterManage from './zh-CN/clusterManage';
import checkRecord from './zh-CN/checkRecord';

export default {
    'navBar.lang': '语言',
    'layout.user.link.help': '帮助',
    'layout.user.link.privacy': '隐私',
    'layout.user.link.terms': '条款',
    'app.home.introduce': '介绍',
    'app.forms.basic.title': '基础表单',
    'app.forms.basic.description': '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
    ...analysis,
    //元数据管理
    ...metadataManage,
    ...webTools,
    ...exception,
    //数据同步
    ...form,
    ...globalHeader,
    ...login,
    ...menu,
    ...monitor,
    ...result,
    ...settingDrawer,
    ...settings,
    ...pwa,
    ...component,
    ...editor,
    //数据分发
    ...dataDistribution,
    //首页
    ...dashboard,
    //集群管理
    ...clusterManage,
    ...checkRecord
};
