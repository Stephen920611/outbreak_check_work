import React, {Component} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import Link from 'umi/link';
import {Checkbox, Alert, Modal, Icon} from 'antd';
import {postJSON, post, get} from "../../utils/core/requestTj";
import Login from '@/components/Login';
import router from 'umi/router';
import $ from 'jquery';
import desFunc from '../../utils/des';
import styles from './Login.less';
import * as crtpto from 'crypto-js';
import * as DES from "crypto-js/tripledes";
import * as UTF8 from "crypto-js/enc-utf8";
import "./../../config/ENV";

const {Tab, UserName, Password, Mobile, Captcha, Submit} = Login;

@connect(({login, loading}) => ({
    login,
    submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
    state = {
        type: 'account',
        autoLogin: true,
    };

    onTabChange = type => {
        this.setState({type});
    };

    onGetCaptcha = () =>
        new Promise((resolve, reject) => {
            this.loginForm.validateFields(['mobile'], {}, (err, values) => {
                if (err) {
                    reject(err);
                } else {
                    const {dispatch} = this.props;
                    dispatch({
                        type: 'login/getCaptcha',
                        payload: values.mobile,
                    })
                        .then(resolve)
                        .catch(reject);

                    Modal.info({
                        title: formatMessage({id: 'app.login.verification-code-warning'}),
                    });
                }
            });
        });

    handleSubmit = (err, values) => {
        // console.log(!err,'err');
        // console.log(values, 'values');
        // let desStr = "thinkgem,jeesite,com";
        // let username = "system";
        // let password = "admin";
        // //加密
        // let desUsername = DES.encrypt(username, desStr, {
        //     mode: crtpto.mode.ECB,
        //     padding: crtpto.pad.Pkcs7
        // }).toString();
        // let desPassword = DES.encrypt(password, desStr).toString();
        // console.log("desUsername",desUsername);
        // console.log("desPassword",desPassword);
        // $.ajax({
        //     type: 'get',
        //     url: "http://192.168.10.122:8080/datadist/a/login",
        //     data: {
        //         "username": "F3EDC7D2C193E0B8DCF554C726719ED2",
        //         "password": "235880C505ACCDA5C581A4F4CDB81DA0",
        //         // "validCode": "",
        //         "__login":true,
        //         "__ajax":"json"
        //         // "__url":""
        //     },
        //     async: true,
        //     dataType: "json",
        //     // contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //     success: function (resp) {
        //         console.log(resp,'resp');
        //     },
        // });
        /*=================================================================*/
        let secretKey = "thinkgem,jeesite,com";
        let username = DesUtils.encode(values["userName"], secretKey);
        let password = DesUtils.encode(values["password"], secretKey);
        // let username = DesUtils.encode('system', secretKey);
        // let password = DesUtils.encode('admin', secretKey);
        // // console.log('&username=' + username + '&password=' + password);
        // get("http://192.168.10.122:8080/datadist/a/login",{
        //     "username": username,
        //     "password": password,
        //     "__login":true,
        //     "__ajax":"json"
        //     }).then( resp => {
        //     console.log(resp,'resp');
        //     if(resp.result === "true"){
        //         // router.push('/dashboard/anyParams');
        //     }
        //
        // });
        /*=================================================================*/

        //解密（需要把得到的结果转化成utf-8格式的）
        // value = DES.decrypt(value, (thinkgem,jeesite,com)).toString(UTF8);
        // console.log("这个value就是解密后的结果",value)
        const {type} = this.state;

        let loginInfo = {
            "username": values["userName"],
            "password": values["password"],
            // "__ajax":"json",
        };
        if (!err) {
            const {dispatch} = this.props;
            dispatch({
                type: 'login/login',
                payload: {
                    ...loginInfo,
                    // type,
                },
            });
        }
    };

    changeAutoLogin = e => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };

    renderMessage = content => (
        <Alert style={{marginBottom: 24}} message={content} type="error" showIcon/>
    );

    render() {
        const {login, submitting} = this.props;
        const {type, autoLogin} = this.state;
        return (
            <div className={styles.main}>
                <Login
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    ref={form => {
                        this.loginForm = form;
                    }}
                >
                    <Tab key="account" tab={formatMessage({id: 'app.login.tab-login-credentials'})}>
                        <UserName
                            name="userName"
                            placeholder={`${formatMessage({id: 'app.login.userName'})}`}
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({id: 'validation.userName.required'}),
                                },
                            ]}
                        />
                        <Password
                            name="password"
                            placeholder={`${formatMessage({id: 'app.login.password'})}`}
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({id: 'validation.password.required'}),
                                },
                            ]}
                            onPressEnter={e => {
                                e.preventDefault();
                                this.loginForm.validateFields(this.handleSubmit);
                            }}
                        />
                    </Tab>
                    {/*<Tab key="mobile" tab={formatMessage({id: 'app.login.tab-login-mobile'})}>*/}
                        {/*{login.status === 'error' &&*/}
                        {/*login.type === 'mobile' &&*/}
                        {/*!submitting &&*/}
                        {/*this.renderMessage(*/}
                            {/*formatMessage({id: 'app.login.message-invalid-verification-code'})*/}
                        {/*)}*/}
                        {/*<Mobile*/}
                            {/*name="mobile"*/}
                            {/*placeholder={formatMessage({id: 'form.phone-number.placeholder'})}*/}
                            {/*rules={[*/}
                                {/*{*/}
                                    {/*required: true,*/}
                                    {/*message: formatMessage({id: 'validation.phone-number.required'}),*/}
                                {/*},*/}
                                {/*{*/}
                                    {/*pattern: /^1\d{10}$/,*/}
                                    {/*message: formatMessage({id: 'validation.phone-number.wrong-format'}),*/}
                                {/*},*/}
                            {/*]}*/}
                        {/*/>*/}
                        {/*<Captcha*/}
                            {/*name="captcha"*/}
                            {/*placeholder={formatMessage({id: 'form.verification-code.placeholder'})}*/}
                            {/*countDown={120}*/}
                            {/*onGetCaptcha={this.onGetCaptcha}*/}
                            {/*getCaptchaButtonText={formatMessage({id: 'form.get-captcha'})}*/}
                            {/*getCaptchaSecondText={formatMessage({id: 'form.captcha.second'})}*/}
                            {/*rules={[*/}
                                {/*{*/}
                                    {/*required: true,*/}
                                    {/*message: formatMessage({id: 'validation.verification-code.required'}),*/}
                                {/*},*/}
                            {/*]}*/}
                        {/*/>*/}
                    {/*</Tab>*/}
                    <div>
                        <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                            <FormattedMessage id="app.login.remember-me"/>
                        </Checkbox>
                        {/*<a style={{float: 'right'}} href="">*/}
                            {/*<FormattedMessage id="app.login.forgot-password"/>*/}
                        {/*</a>*/}
                    </div>
                    <Submit loading={submitting}>
                        <FormattedMessage id="app.login.login"/>
                    </Submit>
                    {/*<div className={styles.other}>*/}
                        {/*<FormattedMessage id="app.login.sign-in-with"/>*/}
                        {/*<Icon type="alipay-circle" className={styles.icon} theme="outlined"/>*/}
                        {/*<Icon type="taobao-circle" className={styles.icon} theme="outlined"/>*/}
                        {/*<Icon type="weibo-circle" className={styles.icon} theme="outlined"/>*/}
                        {/*<Link className={styles.register} to="/user/register">*/}
                            {/*<FormattedMessage id="app.login.signup"/>*/}
                        {/*</Link>*/}
                    {/*</div>*/}
                </Login>
            </div>
        );
    }
}

export default LoginPage;
