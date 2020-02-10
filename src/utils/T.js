/**
 * Created by stephen on 2019/8/13.
 */
import lodash from 'lodash';
import prompt from './core/prompt';
import auth from './core/auth';
import helper from './core/helper';
import Socket from './core/socket';
import moment from 'moment';
import classNames from 'classnames';
import { get, post, postJSON, upload, all, del, put, formatUrlParams } from './core/requestTj';
import { setStorage, getStorage, clearStorage, keepStorage, removeStorage } from './core/storage';

/**
 * @type {{classNames: classNames, prompt: Prompt, request: {get: get, post: post, postJSON: postJSON, upload: upload, all: all, del: del, put: put, formatUrlParams: formatUrlParams}, storage: {setStorage: setStorage, getStorage: getStorage, clearStorage: clearStorage, keepStorage: keepStorage, removeStorage: removeStorage}, lodash, }}
 */

const T = {
    classNames,
    //提示框
    prompt,
    //时间
    moment,
    //websocket
    Socket,
    //针对当前系统做的存取storage已经失效验证
    auth,
    //公共方法
    helper,
    //请求
    request: {
        get,
        post,
        postJSON,
        upload,
        all,
        del,
        put,
        formatUrlParams
    },
    //storage
    storage: {
        setStorage,
        getStorage,
        clearStorage,
        keepStorage,
        removeStorage
    },

    // 说明文档:http://www.css88.com/doc/lodash/
    lodash: lodash,
};

export default T;

