import {getMenuData, getPageTitle} from '@ant-design/pro-layout';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {connect, Link, useIntl} from 'umi';
import React from 'react';
import DefaultFooter from '@/components/DefaultFooter';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import {ThunderboltTwoTone} from "@ant-design/icons";

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const {routes = []} = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const {} = useIntl();
  const {breadcrumb} = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title}/>
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>{/* <SelectLang /> */}</div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <ThunderboltTwoTone twoToneColor="#1890ff"  style={{fontSize:35,marginRight:8}}/>
                {/*<img alt="logo" className={styles.logo} src={logo}/>*/}
                <span className={styles.title}>制造管理系统</span>
              </Link>
            </div>
            {/*<div className={styles.desc}>提供外协单位和室内计划员的协同的方式</div>*/}
            <div className={styles.desc}> </div>
          </div>
          {children}
        </div>
        <DefaultFooter/>
      </div>
    </HelmetProvider>
  );
};

export default connect(({settings}) => ({...settings}))(UserLayout);
