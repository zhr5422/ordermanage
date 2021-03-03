import {Alert, Form, Input, notification, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import LoginFrom from './components/Login';
import styles from './style.less';
import md5 from 'md5'

const {Password, Submit} = LoginFrom;

const LoginMessage = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const {userLogin = {}, submitting, company} = props;
  const {status,} = userLogin;
  const [type, setType] = useState('account');
  const [prefix, setprefix] = useState(1);

  useEffect(() => {
    const {dispatch} = props;
    dispatch({
      type: 'company/fetch',
    });
  }, [1]);

  const handleSubmit = values => {
    const {dispatch} = props;
    let password=md5(values.password);
    dispatch({
      type: 'login/login',
      payload: {...values, prefix,password},
    });
  };
  const openNotification = () => {
    notification.open({
      message: '消息',
      description:
        '忘记密码或者注册请咨询管理员',
      onClick: () => {
      },
    });
  };
  const changePrefix = (value) => {
    setprefix(value);
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        {status === 'error' && !submitting && (
          <LoginMessage content="帐户或密码错误"/>
        )}
        <Input.Group compact>
          <Select size="large" value={prefix} onChange={changePrefix} style={{width: '25%'}}>
            {company.map(item => <Select.Option value={item.id} key={item.id}>{item.company}</Select.Option>)}
          </Select>
          <Form.Item
            style={{width: '75%'}}
            name="account"
            rules={[
              {
                required: true,
                message: '请输入工号!',
              },
            ]}
          >
            <Input
              size="large"
              placeholder='请选择单位，输入工号'
            />
          </Form.Item>
        </Input.Group>
        <Password
          name="password"
          placeholder="请输入密码"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <div style={{textAlign: 'right'}}>
          <a
            onClick={openNotification}
          >
            忘记密码/注册
          </a>
        </div>
        <Submit loading={submitting}>登录</Submit>
      </LoginFrom>
    </div>
  );
};

export default connect(({login, loading, company}) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  company: company.company
}))(Login);
