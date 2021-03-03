import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Menu, Spin, Tag} from 'antd';
import React from 'react';
import {connect, history} from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const {key} = event;

    if (key === 'logout') {
      const {dispatch} = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined/>
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined/>
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider/>}

        <Menu.Item key="logout">
          <LogoutOutlined/>
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <span>
          {currentUser.authority
            .map(item=><Tag
              key={item.id}
              color={item.name.includes("十四所")?"#108ee9":""}>
              {item.name.includes("十四所")?item.name.slice(3):item.name.slice(2)} </Tag>)}
          {currentUser.username}
          </span>
          <Avatar size="small" className={styles.avatar} icon={<UserOutlined/>}/>
          <span className={styles.name}> {currentUser.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({user}) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
