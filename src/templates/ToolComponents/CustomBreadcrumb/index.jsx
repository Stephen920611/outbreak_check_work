import NavLink from 'umi/navlink';
import PropTypes from 'prop-types';
import styles from './index.less';

import {Breadcrumb, Icon} from 'antd';
import Link from 'umi/link';

/**
 * 自定义面包屑
 * @param {array} dataSource
 *          {
                linkTo: '/dashboard',
                name: '首页',
                icon: 'home',
            },
 * @param rest 面包屑自带的其他属性，或者是className什么的都可以
 * @return {*}
 * @constructor
 */
const CustomBreadcrumb = ({ dataSource = [], ...rest }) => {
    // return (
    //     <div className={styles.breadcrumbWrapper}>
    //         <Breadcrumb {...rest}>
    //             {
    //                 renderItem(dataSource)
    //             }
    //         </Breadcrumb>
    //     </div>
    // )
    return (
        <Breadcrumb {...rest}>
            {
                renderItem(dataSource)
            }
        </Breadcrumb>
    )
};

//渲染Item
const renderItem = (dataSource) => {
    return dataSource.map( (val,idx) => {
        return (
            <Breadcrumb.Item key={idx}>
                {val.hasOwnProperty('icon') ? <Icon type={val.icon} /> : null}
                {val.hasOwnProperty('linkTo')
                    ?
                    <Link
                        to={{
                            pathname: val['linkTo'],
                            params: {...val['params']}
                        }}
                    >
                        {val.hasOwnProperty('name') ? val.name : null}
                    </Link>
                    :
                    val.hasOwnProperty('name') ? val.name : null
                }
            </Breadcrumb.Item>
        )
    })
};

CustomBreadcrumb.propTypes = {
    dataSource: PropTypes.array.isRequired,      //面包屑的数据
};

export default CustomBreadcrumb;
