import './icon/iconfont.css';
// import styles from './index.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';
import iconFont from './icon/iconfont'

import React from 'react';

//TODO 三种方法暂时都不好使，回头再弄，只有createFromIconfontCN换成线上地址能用
// const CustomIcon = props => {
//     const { type } = props;
//     return <i className={`iconfont icon-${type}`} />;
// };
/**
 * 自定义icon
 * @param type
 * @param className
 * @param spin
 * @param rest
 * @return {*}
 * @constructor
 */
/*const CustomIcon = ({ type, className, spin, ...rest }) => {
    const classString = classNames({
        iconfont: true,
        // [styles['custom-icon-spin']]: !!spin,
        [`icon-${type}`]: true,
        // anticon: true,
    }, className);

    return <i className={classString} {...rest} />;
};*/
/*CustomIcon.propTypes = {
    type: PropTypes.string.isRequired,      // icon类型
    className: PropTypes.string,            // 类名
    spin: PropTypes.bool,                   // 是否旋转
    style: PropTypes.object,                // 样式
};*/

// const CustomIcon = Icon.createFromIconfontCN({
//     scriptUrl: '/iconfont.js',
// });
const CustomIcon = ({ type, className, spin, ...rest }) => {
    const IconFont = Icon.createFromIconfontCN({
        scriptUrl: iconFont,
    });
    const classString = classNames({
        iconfont: true,
        // [styles['custom-icon-spin']]: !!spin,
        [`icon-${type}`]: true,
        // anticon: true,
    }, className);
    // return <i className={classString} {...rest} />;
    return <IconFont type={type} {...rest} />;
};

export default CustomIcon;
