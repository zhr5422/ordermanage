import React from 'react'
import {Button, Card, Form, Input, Tabs} from "antd";
import {connect} from 'dva'
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import md5 from 'md5'

class AccountSetting extends React.Component {
  formRef = React.createRef();

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetchCurrent'
    })
  }

  onFinishInformation = (values) => {
    const {dispatch, currentUser} = this.props;
    dispatch({
      type: 'user/updateInformation',
      payload: {...values, id: currentUser.id}
    });
  };

  onFinishPassword = (values) => {
    const {dispatch, currentUser} = this.props;
    let password=md5(values.password);
    let current_password=md5(values.current_password);
    dispatch({
      type: 'user/updatePassword',
      payload: {...values, id: currentUser.id,password,current_password}
    });
  };

  checkConfirm = (_, value) => {
    const promise = Promise;
    if (value && value !== this.formRef.current.getFieldValue('password')) {
      return promise.reject("两次输入的密码不匹配!");
    }
    return promise.resolve();
  };

  render() {
    const {currentUser} = this.props;
    return (
      <PageHeaderWrapper>
        <Card>
          <Tabs>
            <Tabs.TabPane tab='基本信息' key='1'>
              <Form {...this.formLayout}
                    onFinish={this.onFinishInformation}
                    initialValues={{
                      account: currentUser.account,
                      mail: currentUser.mail,
                      phone: currentUser.phone
                    }}
              >
                <Form.Item name="account" label="工号">
                  <Input placeholder="请输入帐户" disabled={true}/>
                </Form.Item>
                <Form.Item name="mail" label="邮箱">
                  <Input placeholder="请输入邮箱"/>
                </Form.Item>
                <Form.Item name="phone" label="电话">
                  <Input placeholder="请输入电话"/>
                </Form.Item>
                <Button type="primary" htmlType="submit">更新个人信息</Button>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab='修改密码' key='2'>
              <Form
                onFinish={this.onFinishPassword}
                ref={this.formRef}
              >
                <Form.Item
                  label='当前密码'
                  name="current_password"
                >
                  <Input
                    type="password"
                    placeholder='请输入当前密码'
                  />
                </Form.Item>
                <Form.Item
                  label='新密码'
                  name="password"
                  rules={[
                    {
                      message: '请输入新密码',
                    },]}
                >
                  <Input
                    type="password"
                    placeholder='请输入新密码'
                  />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  rules={[
                    {
                      message: '需要确认密码',
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ]}
                >
                  <Input
                    type="password"
                    placeholder='确认密码'
                  />
                </Form.Item>
                <Button type="primary" htmlType="submit">修改密码</Button>
              </Form>
            </Tabs.TabPane>
          </Tabs>

        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default connect(({user}) => (
  {
    currentUser: user.currentUser
  }
))(AccountSetting)
