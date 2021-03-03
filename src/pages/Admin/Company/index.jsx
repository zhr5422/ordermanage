import React from 'react';
import {Button, Card, Form, Input, List, Modal, Popconfirm, Select} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'dva';

const FormItem = Form.Item;
const SelectOption = Select.Option;

class Company extends React.Component {
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
      type: 'company/fetch',
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
      type: 'company/submit',
      payload: {id:e}
    })
  };

  onFinish = () => {
    const {current} = this.state;
    const {dispatch} = this.props;
    this.formRef.current
      .validateFields()
      .then(values => {
        dispatch({
          type: 'company/submit',
          payload: current ? {id: current.id, ...values} : values
        });
        this.setState({visible: false});
      });
  };

  render() {
    const {visible, done, current} = this.state;
    const {company, type} = this.props;
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
            company: current ? current.company : '',
            typeId: current ? current.typeId : ''
          }}
        >
          <FormItem name="company"
                    label="单位名称" {...this.formLayout}
                    rules={[{required:true,message:'请输入单位名称'}]}>
            <Input placeholder="请输入"/>
          </FormItem>
          <FormItem name="typeId"
                    label="类型" {...this.formLayout}
                    rules={[{required:true,message:'请选择工艺类型'}]}>
            <Select placeholder="请选择">
              {type.map(item => <SelectOption key={item.id} value={item.id}>{item.name}</SelectOption>)}
            </Select>
          </FormItem>
        </Form>
      );
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
            dataSource={company.filter(item=>{return item.id>1})}
            pagination={{defaultPageSize: 10, hideOnSinglePage: true}}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key="edit" onClick={() => this.handleEditClick(item)}>编辑</a>
                  ,
                  // <Popconfirm
                  //   title="确认删除吗"
                  //   onConfirm={() => this.confirm(item.id)}
                  //   okText="确认"
                  //   cancelText="取消"
                  // >
                  //   <a href="#">删除</a>
                  // </Popconfirm>
                ]}>
                <List.Item.Meta
                  title={<div>{item.company}</div>}
                  description={item.type ? item.type : ''}
                />
              </List.Item>
            )}
          />
        </Card>
        <Modal
          title={done ? null : `外协单位${current ? '编辑' : '添加'}`}
          width={640}
          bodyStyle={
            done
              ? {
                padding: '72px 0',
              }
              : {
                padding: '28px 0 0',
              }
          }
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

export default connect(({company, type}) => ({
  company: company.company,
  type: type.type,
}))(Company);
