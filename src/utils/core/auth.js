/**
 * @description
 * @Version Created by Stephen on 2019/8/14.
 * @Author Stephen
 * @license dongfangdianzi
 */
import * as store from './storage';
import "./../../config/ENV";
import router from 'umi/router';

class Auth {

    constructor(){
    }
    /**
     * 验证sid是否失效
     * @param response
     * @returns {boolean}
     */
    isSidInvalid(response) {
        return response.result === "true" ? true : false;
    }

    /**
     * 保存登录信息
     * @param loginInfo
     */
    setLoginInfo(loginInfo){
        store.setStorage(window.ENV.login.loginInfoKey, loginInfo);
    }

    /**
     * 获取登录信息
     * @return {*}
     */
    getLoginInfo(){
        return store.getStorage(window.ENV.login.loginInfoKey);
    }

    /**
     * 清除登录信息
     */
    clearLoginInfo(){
        store.removeStorage(window.ENV.login.loginInfoKey);
    }

    /**
     * 获取当前sessionid
     * @returns {{}}
     */
    isAdmin(){
        const info = store.getStorage(window.ENV.login.loginInfoKey);
        let isYT = (info.data.area === '' || info.data.area === null) && (info.data.static_auth === 1);
        return isYT
    }

    /**
     * 获取当前sessionid
     * @returns {{}}
     */
    getCurrentSessionId(){
        const info = store.getStorage(window.ENV.login.loginInfoKey);
        return {
            __sid: info.sessionid
        }
    }

    /**
     * 验证子页面是否是刷新时候返回当前的高级页面（防止用户刷新报错）
     * @param {object} location router里的location
     * @param {string} pathName 路径名字
     */
    returnSpecialMainPage(location, pathName){
        //如果不是通过路由正常跳过去的，需要踢回数据任务列表页面
        if(!(location.hasOwnProperty("params") && location.params.hasOwnProperty("isRouterPush") && location.params.isRouterPush) ){
            router.push({
                pathname: pathName,
            });
        }
    }

}

export default new Auth();
