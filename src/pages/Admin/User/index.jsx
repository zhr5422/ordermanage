import React from 'react';
import {Button, Card, Form, Input, List, message, Modal, Popconfirm, Select, Tag} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'dva';
import md5 from 'md5'
const FormItem = Form.Item;
const SelectOption = Select.Option;

class User extends React.Component {
  formRef = React.createRef();

  state = {
    visible: false,
    done: false,
    current: undefined,
  };

  formLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
    style: {
      paddingLeft: 16,
      paddingRight: 16
    }
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/fetch',
    });
    dispatch({
      type: 'company/fetch',
    });
    dispatch({
      type: 'authority/fetch',
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleEditClick = (item) => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  confirm = (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/submit',
      payload: {id:e}
    })
  };

  onFinish = () => {
    const {current} = this.state;
    const {dispatch} = this.props;
    this.formRef.current
      .validateFields()
      .then(values => {
        let password=md5(values.password);
        const a1=values.authority;
        let a2=[];
        a1.forEach((item, index) => {
          let a2Item={};
          a2Item.id = item;
          a2.push(a2Item)
        });
        dispatch({
          type:  'user/submit',
          payload: current ? {id: current.id, ...values,authority:a2,password} : {...values,authority:a2,password}
        });
        this.setState({visible: false});
      }).catch(info => {
      message.error(info)
    });
  };

  render() {
    const {user: {users}, company,authorities=[]} = this.props;
    const {visible, done, current={}} = this.state;
    const modalFooter = done
      ? {
        footer: null,
        onCancel: this.handleDone,
      }
      : {
        okText: '保存',
        onOk: this.onFinish,
        onCancel: this.handleCancel,
      };

    const getModalContent = () => {
      return (
        <Form
          ref={this.formRef}
          initialValues={{
            username:  current.username ,
            account: current.account ,
            password:  current.password ,
            authority: current.authority?current.authority.map(item=>item.id):undefined,
            companyId: current.companyId ,
          }}
        >
          <FormItem
            name="username"
            label="姓名"
            {...this.formLayout}
            rules={[{required:true,message:'请输入姓名'}]}
          >
            <Input placeholder="请输入姓名"/>
          </FormItem>
          <FormItem
            name="account"
            label="帐户"
            {...this.formLayout}
                    rules={[{required:true,message:'请输入帐户'}]}>
            <Input placeholder="请输入帐户"/>
          </FormItem>
          <FormItem
            name="password"
            label="密码"
            {...this.formLayout}
                    rules={[{required:!current.username,message:'请输入密码'}]}>
            <Input placeholder="请输入密码"/>
          </FormItem>
          <FormItem
            name="companyId"
            label="单位"
            {...this.formLayout}
                    rules={[{required:true,message:'请选择单位'}]}>
            <Select placeholder="请选择单位">
              {company.map(item => <SelectOption key={item.id} value={item.id}>{item.company}</SelectOption>)}
            </Select>
          </FormItem>
          <FormItem
            name="authority"
            label="权限"
            {...this.formLayout}
                    rules={[{required:true,message:'请选择权限'}]}>
            <Select placeholder="请选择权限" mode="multiple">
              {authorities
                .map(item=><SelectOption value={item.id} key={item.id}>{item.name}</SelectOption>)}
            </Select>
          </FormItem>
        </Form>
      )
    };

    return (
      <PageHeaderWrapper>
        <Card>
          <Button
            type="dashed"
            style={{
              width: '100%',
              marginBottom: 8,
            }}
            icon={<PlusOutlined/>}
            onClick={this.showModal}
          >
            添加
          </Button>
          <List
            size="large"
            rowKey="key"
            pagination={{defaultPageSize: 10, hideOnSinglePage: true}}
            dataSource={users||[]}
            renderItem={(item) => (
              <List.Item
                actions={[
                    <a key="edit" onClick={() => this.handleEditClick(item)}>编辑</a>
                    ,
                    // <Popconfirm
                    //   title="确认删除吗"
                    //   onConfirm={() => this.confirm(item.id)}
                    //   onCancel={this.cancel}
                    //   okText="确认"
                    //   cancelText="取消"
                    //   >
                    //     <a href="#">删除</a>
                    // </Popconfirm>
                ]}>
                <List.Item.Meta
                  title={
                    <div>
                      {item.username} {item.authority.map(item=><Tag key={item.id}>{item.name}</Tag>)}
                    </div>
                  }
                  description={item.company}
                />
              </List.Item>
            )}
          />
        </Card>
        <Modal
          title={ `人员${current.username ? '编辑' : '添加'}`}
          width={640}
          bodyStyle={{padding: '28px 0 0'}}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    )
  }
}

export default connect(({user,authority, company}) => ({
  authorities:authority.authorities,
  user,
  company: company.company
}))(User);
