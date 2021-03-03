import React from 'react';
import {Button, Card, Form, Input, List, Modal, Popconfirm, Select, Tabs, Tag} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'dva';

const {TabPane} = Tabs;
const FormItem = Form.Item;
const SelectOption = Select.Option;

class OrderType extends React.Component {
  formRef = React.createRef();

  state = {
    visible: false,
    done: false,
    current: {},
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
      type: 'user/fetchCraftMan'
    });
    dispatch({
      type: 'type/fetch',
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
      type: 'type/submit',
      payload: {id:e}
    })
  };

  onFinish = () => {
    const {current} = this.state;
    const {dispatch} = this.props;
    this.formRef.current
      .validateFields()
      .then(values => {
        const a1=values.craftman;
        let a2=[];
        a1.forEach((item, index) => {
          let a2Item={};
          a2Item.id = item;
          a2.push(a2Item)
        });
        dispatch({
          type: 'type/submit',
          payload: current ? {id: current.id, ...values,craftman:a2} : {...values,craftman:a2}
        });
        this.setState({visible: false});
      });
  };

  render() {
    const {
      user: {craftMan=[]}, type
    } = this.props;
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
      return (<Form
        ref={this.formRef}
        initialValues={{
          name: current.name ,
          craftman:  current.craftman?current.craftman.map(item=>item.id):undefined,
        }}
      >
        <FormItem name="name" label="工艺类型" {...this.formLayout} rules={[{required:true,message:'请输入工艺类型'}]}>
          <Input placeholder="请输入"/>
        </FormItem>
        <FormItem name="craftman" label="工艺负责人" {...this.formLayout} rules={[{required:true,message:'请选择工艺人员'}]}>
          <Select placeholder="请选择" mode="multiple" >
            {craftMan.map(item =>
              <SelectOption value={item.id} key={item.id}>{item.username}</SelectOption>)}
          </Select>
        </FormItem>
      </Form>)

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
            rowKey="id"
            pagination={{defaultPageSize: 10, hideOnSinglePage: true}}
            dataSource={type}
            renderItem={(item) => (
              <List.Item actions={[
                <a key="edit" onClick={() => this.handleEditClick(item)}>编辑</a>
                , <Popconfirm
                  title="确认删除吗"
                  onConfirm={() => this.confirm(item.id)}
                  okText="确认"
                  cancelText="取消"
                >
                  <a href="#">删除</a>
                </Popconfirm>]}>
                <List.Item.Meta
                  title={
                    <div>
                      {item.name}
                    </div>
                  }
                  description={item.craftman.map(item=><Tag key={item.id}>{item.username}</Tag>)}
                />
                {/* <ListContent data={item} /> */}
              </List.Item>
            )}
          />
        </Card>
        <Modal
          title={`订单类型${current.name ? '编辑' : '添加'}`}
          width={640}
          bodyStyle={ {padding: '28px 0 0'}}
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

export default connect(({user, type}) => ({
  user,
  type: type.type,
}))(OrderType);

