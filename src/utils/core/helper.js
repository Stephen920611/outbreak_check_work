/**
 * Created by stephen on 2019/8/21.
 */
import moment from 'moment';
import _ from 'lodash';
import {render as reactDomRender, unmountComponentAtNode} from 'react-dom';
import identity from 'lodash/identity';
import each from 'lodash/each';
import isString from 'lodash/isString';
import IsFinite from 'lodash/isFinite';

class Helper {

    /**
     * 将后台返回的数据转换成json格式
     * @param {*} str
     * @return {Boolean}
     */
    toJSON(str) {
        return JSON.parse(str);
    }

    /**
     * 生成随机uuid
     * @param len 长度
     * @param radix 基于多少位，比如16位就是0-f
     * @returns {string}
     */
    createUuid (len, radix) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }

    /**
     * @param {*} data
     * @param {Function} callback
     * @param {Boolean} enumerable 属性是否可以枚举
     * @return {*}
     */
    immutable(data, callback = identity, enumerable = true) {
        const self = this;
        return (function fn(_data) {
            let result = _data;
            if (self.isPureObject(_data) || Array.isArray(_data)) {
                result = Array.isArray(_data) ? [] : {};
                each(_data, (value, key) => {
                    Object.defineProperty(result, key, {
                        value: fn(callback(value, key)),
                        enumerable,
                    });
                });
            }
            return result;
        }(data));
    }

    /**
     * 字符串类型的渲染默认值
     * @param {String}    val  检测的字段
     * @param {String}    defaultVal  不满足条件的默认值
     * @return {String}
     */
    showValue(val, defaultVal = '-') {
        return (this.checkString(val) || IsFinite(val)) ? val : defaultVal;
    }

    /**
     * 检测长度大于0的数组或者类数组对象---Array,nodeList
     * @param {*} x
     * @return {Boolean}
     */
    checkArray(x) {
        return Array.isArray(x) && x.length > 0;
    }

    /**
     * 检测去除左右空白后长度大于0的字符串
     * @param {*} x
     * @return {Boolean}
     */
    checkString(x) {
        return isString(x) && x.trim().length > 0;
    }

    /**
     * 是否为纯的对象
     * @param x
     * @return {boolean}
     */
    isPureObject(x) {
        return Object.prototype.toString.call(x) === '[object Object]';
    }

    /**
     * 去除尾部下划线
     * @param {String} x
     */
    removeTrailingSlash(x) {
        return /\/$/.test(x) ? x.slice(0, x.length - 1) : x;
    }

    /**
     * 去除字符串的空白
     * @param {String} x
     * @return {* || String}
     */
    removeBlank(x) {
        return isString(x) ? x.replace(/\s/g, '') : x;
    }

    /**
     * @param {HTMLElement} domElement
     */
    layout(domElement) {
        const scaleX = document.body.clientWidth / window.ENV.width;
        const scaleY = document.body.clientHeight / window.ENV.height;
        domElement.style.transform = `scale(${scaleX}, ${scaleY})`;
        domElement.style.transformOrigin = '0 0';
    }

    /**
     * 渲染弹出窗Modal
     * @param component //reactElement react组件
     */
    renderModal(component) {
        const domId = 'tj-render-dom';

        let domObject = document.querySelector('#' + domId);
        if (!domObject) {
            const el = document.createElement('div');
            el.setAttribute('id', domId);
            document.querySelector('body').appendChild(el);
            domObject = el;
        }

        unmountComponentAtNode(domObject);

        reactDomRender(component, domObject);
    }

    /**
     * 模拟request api数据
     * @param data
     * @param type "success" | "error"
     * @param time 延迟时间
     * @return {Promise<any>}
     */
    simulateData(data, type = 'success', time = 500) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (type == 'success') {
                    resolve({
                        code: window.ENV.apiSuccessCode,
                        data,
                        msg: 'success'
                    });
                } else {
                    reject({
                        code: 'error',
                        data,
                        msg: 'error'
                    });
                }
            }, time);
        });
    }

    /**
     * 跳转页面
     * @param url
     * @param timeout
     */
    redirect(url, timeout) {
        if (_.isNumber(url) && typeof timeout === 'undefined') {
            timeout = url;
            url = null;
        }

        setTimeout(function () {
            location.href = url || location.href;
        }, timeout || 0);
    }

    /**
     * 获取包“immutability-helper”中的update内容
     * @param {String | Array}  keyPath "str1.str2..." //依点分割key 或 [key1,key2]
     * @param {Mixed} value
     * @param {String} updateType //可填写类型：$set,$push,$unshift,$splice,$unset,$merge,$apply
     * @return {{}}
     */
    getImmutabilityHelperContent(keyPath, value, updateType = '$set') {
        let keyArr = Array.isArray(keyPath) ? keyPath : keyPath.split('.');
        let keyLen = keyArr.length;
        let result = {};

        /* eslint no-eval:0 */
        /* eslint no-return-assign:0 */
        const getTmpRes = (keys, val = null) => {
            let res = 'result';
            keys.forEach(key => res += '[\'' + key + '\']');
            res += '={}';
            eval(res);
            return eval(res.replace('={}', ''));
        };

        let usedKeys = [];
        keyArr.forEach((key, index) => {
            const currentLen = index + 1;
            usedKeys.push(key);

            if (currentLen === keyLen) {
                getTmpRes(usedKeys)[updateType] = value;
            } else {
                getTmpRes(usedKeys);
            }
        });

        return result;
    }

    /**
     * 浮点型保留小数
     * @param {Number} num
     * @param {Number} fixNum
     * @param {Mixed} defaultVal 格式化错误的默认值
     * @return {string}
     */
    toFixed(num, fixNum = 2, defaultVal = '-') {
        let result = Number(num).toFixed(fixNum);
        return _.isNaN(result) || result === 'NaN' ? defaultVal : result;
    }

    /**
     * 是否是一个真实的数值字符串
     * @param value
     */
    isRealNumeric(value) {
        return /^(\d+\.)?\d+$/.test(value);
    }

    /**
     * Mb转换成Gb
     * @param {Number} value
     * @param {Number} fixNum  保留小数的位数
     * @param {Mixed} defaultVal  格式化错误的默认值
     * @return {*}
     * @constructor
     */
    MbToGb(value, fixNum = 2, defaultVal = '-') {
        let result = value / 1024;
        return fixNum ? (_.isNaN(result) || result === 'NaN' ? defaultVal : result) : this.toFixed(result, fixNum, defaultVal);
    }

    /**
     * 时间格式化
     * @param {Date|number|Moment} date
     * @param {string} template
     * @return {string}
     */
    dateFormat(date = _.now(), template = 'YYYY-MM-DD HH:mm:ss') {
        if (this.isRealNumeric(date)) {
            date = parseInt(date);
        }

        return moment(date).format(template);
    }

    /**
     * 回调一个函数,并应用context和一个参数数组
     * @param {function} func 函数
     * @param {?*=} context
     * @param {Array=} args
     * @return {*}
     */
    apply(func, context, args = []) {
        if (_.isFunction(func)) {
            return func.apply(context, args);
        }

        return null;
    }

    /**
     * 回调一个函数,并应用context和一个参数列表
     * @param {function} func 函数
     * @param {?*=} context
     * @param {...*} args
     * @return {*}
     */
    call(func, context, ...args) {
        return this.apply(func, context, args);
    }

    /**
     * 获取queryString
     *
     * @returns {Object}
     */
    getUrlParams() {
        let urlParams = {};
        const queryString = decodeURIComponent(window.location.search.substr(1));
        if (queryString) {
            _.each(queryString.split('&'), (paramString) => {
                const param = paramString.split('=');
                urlParams[param[0]] = param[1];
            });
        }

        return urlParams;
    }

    /**
     * 获取URL参数
     *
     * @param {string} name
     * @returns {string}
     */
    getUrlParam(name) {
        return this.getUrlParams()[name];
    }

    /**
     * 生成class
     * @param {...*=} args
     */
    classNames(...args) {

        const classList = [];

        _.each(args, (arg) => {

            if (_.isString(arg)) {

                classList.push(arg);

            } else if (_.isObject(arg)) {

                _.each(arg, (value, key) => {
                    if (value) {
                        classList.push(key);
                    }
                });
            }
        });

        return _.uniq(classList).join(' ');
    }

    /**
     * 数字格式化
     * @param {number} number
     * @param {number=} decimals
     * @param {string=} decimalPoint
     * @param {string=} thousandsSep
     * @return {string}
     */
    numberFormat(number, decimals = 0, decimalPoint = '.', thousandsSep = ',') {

        /* eslint-disable no-param-reassign */

        number = _.toNumber(number);
        decimals = _.clamp(decimals, 0, 10);

        const origDec = (number.toString().split('.')[1] || '').length;
        const absNumber = Math.abs(number);

        let decimalComponent;
        let ret;

        if (decimals === -1) {

            decimals = Math.min(origDec, 20);

        } else if (!_.isNumber(decimals)) {

            decimals = 2;
        }

        const strinteger = String(parseInt(absNumber.toFixed(decimals), 10));

        // 需要几个千分位分隔符
        const thousands = strinteger.length > 3 ? strinteger.length % 3 : 0;

        // 负数
        ret = number < 0 ? '-' : '';

        ret += thousands ? strinteger.substr(0, thousands) + thousandsSep : '';

        // 在千分位加上分隔符
        ret += strinteger.substr(thousands).replace(/(\d{3})(?=\d)/g, `$1${thousandsSep}`);

        // 小数点
        if (decimals) {

            /* eslint-disable no-restricted-properties */
            decimalComponent = Math.abs((absNumber - strinteger) + (Math.pow(10, -Math.max(decimals, origDec) - 1)));
            /* eslint-enable no-restricted-properties */

            ret += decimalPoint + decimalComponent.toFixed(decimals).slice(2);
        }

        /* eslint-enable no-param-reassign */
        return ret;
    }

    /**
     * 将对象的value转化为key
     * @param obj
     * @param prefix
     */
    mapValueToKey(obj, prefix) {
        let newObj = {};
        _.forEach(obj, (v, k) => {
            if (prefix) {
                newObj[String(prefix) + String(v)] = k
            } else {
                newObj[v] = k
            }
        })
        return newObj;
    }

    /**
     * 取小数
     * @param {number} number
     * @param {number=} fixed
     * @return {string}
     */
    round(number, fixed = 2) {
        const value = _.round(number, fixed);
        return value === 'NaN' ? '-' : value;
    }

    /**
     * 生成树的结构
     * @param {array} parentData 最外层父节点
     * @param {array} allData 所有数据
     * @returns {*}
     */
    createTreeStructure(parentData, allData){
        let self = this;
        parentData.map( item => {
            let children = [];
            //自身属性
            item.title = item.name;
            item.key = item.id;
            //造子节点
            allData.map(val => {
                if (val.pId === item.id) {
                    val.title = val.name;
                    val.key = val.id;
                    children.push(val);
                }
            });
            item.children = children;
            //如果存在子节点，循环遍历，如果没有子节点，那么它本身就是子节点
            if(item.children.length > 0){
                self.createTreeStructure(item.children, allData)
            }
        });
        return parentData;
    }

    /**
     * 返回展开的key数组
     * @param {string} id 当前层级的id
     * @param {array} allData 所有的数据，都是平级
     * @param {array} endData 最后返回的数据，按照树的层级从前到后
     * @returns {Array}
     */
    getTreeExpandKeys(id, allData, endData = []){
        endData.unshift(id);
        allData.map( val => {
            if( id === val.id && val.pId !== '0'){
                this.getTreeExpandKeys(val.pId, allData, endData)
            }
        });
        return endData;
    }

}

export default new Helper();

