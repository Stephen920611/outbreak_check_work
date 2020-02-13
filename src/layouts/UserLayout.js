import React, {Component, Fragment} from 'react';
import {formatMessage} from 'umi-plugin-react/locale';
import {connect} from 'dva';
import Link from 'umi/link';
import {Icon} from 'antd';
import DocumentTitle from 'react-document-title';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import getPageTitle from '@/utils/getPageTitle';
import WeChat from './../assets/wechat.png';

// const links = [
//   {
//     key: 'help',
//     title: formatMessage({ id: 'layout.user.link.help' }),
//     href: '',
//   },
//   {
//     key: 'privacy',
//     title: formatMessage({ id: 'layout.user.link.privacy' }),
//     href: '',
//   },
//   {
//     key: 'terms',
//     title: formatMessage({ id: 'layout.user.link.terms' }),
//     href: '',
//   },
// ];
//暂时去掉三个条款
const links = [];

const copyright = (
    <Fragment>
        Copyright <Icon type="copyright"/> 2020 大数据局
    </Fragment>
);

class UserLayout extends Component {
    componentDidMount() {
        const {
            dispatch,
            route: {routes, authority},
        } = this.props;
        dispatch({
            type: 'menu/getMenuData',
            payload: {routes, authority},
        });
    }

    render() {
        const {
            children,
            location: {pathname},
            breadcrumbNameMap,
        } = this.props;
        return (
            <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
                <div className={styles.container}>
                    <div className={styles.lang}>
                        <SelectLang/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.top}>
                            <div className={styles.header} style={{marginBottom: 30}}>
                                {/*<Link to="/">*/}
                                <img alt="logo" className={styles.logo} src={logo}/>
                                <span className={styles.title}>烟台市疫情防控调查管理系统</span>
                                {/*</Link>*/}
                            </div>
                            {/*<div className={styles.desc}>智慧警务实验室</div>*/}
                        </div>
                        {children}
                        <div className={styles.bottom}>
                            <div
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    width: '600px',
                                    margin: '0 auto',
                                }}
                            >
                                如果已在手机APP上注册帐号，请直接输入帐号密码登录；如果没有注册帐号，请扫描如下二维码下载APP进行账号注册。注册时使用的各县市区授权账号请咨询各自任务委派部门
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: 20,
                                }}
                            >
                                <img src={WeChat} alt=""/>
                            </div>
                        </div>
                    </div>
                    <GlobalFooter links={links} copyright={copyright}/>
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(({menu: menuModel}) => ({
    menuData: menuModel.menuData,
    breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
