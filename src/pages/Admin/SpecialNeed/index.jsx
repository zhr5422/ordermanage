import React from 'react';
import {Button, Card, Form, Input, List, Modal, Popconfirm, Select, Tabs} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'dva';
import md5 from 'md5'

const {TabPane} = Tabs;
const FormItem = Form.Item;
const SelectOption = Select.Option;

class SpecialNeed extends React.Component {
  formRef = React.createRef();

  state = {
    visible: false,
    done: false,
    current: undefined,
    searchText:''
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
      type: 'specialneed/fetch',
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

  confirm = (e) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'specialneed/submit',
      payload: {id:e}
    })
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

  onFinish = () => {
    const {current} = this.state;
    const {dispatch} = this.props;
    this.formRef.current
      .validateFields()
      .then(values => {
        let figure=md5(values.figure);
        dispatch({
          type: 'specialneed/submit',
          payload: current ? {id: current.id, ...values,figure} : {...values,figure}
        });
        this.setState({visible: false});
      });
  };

  handleSearch=(value)=>{
    this.setState({searchText:value})
  }

  render() {
    const {specialneed} = this.props;
    const {visible, done, current,searchText} = this.state;
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
          figure: current ? current.figure : '',
          description: current ? current.description : ''
        }}
      >
        <FormItem
          name="figure"
          label="图号"
          {...this.formLayout}
          rules={[{required:true,message:'请输入图号'}]}
        >
          <Input placeholder="请输入"/>
        </FormItem>
        <FormItem
          name="description"
          label="描述"
          {...this.formLayout}
          rules={[{required:true,message:'请输入需求描述'}]}
        >
          <Input.TextArea placeholder="请输入需求"/>
        </FormItem>
      </Form>)
    };
    const filterData=searchText===''?specialneed:specialneed.filter(item=>item.figure===md5(searchText));
    return (
      <PageHeaderWrapper>
        <Card extra={<Input.Search placeholder='搜索图号' onSearch={this.handleSearch}/>}>
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
            dataSource={filterData}
            renderItem={(item) => (
              <List.Item actions={[
                <a key="edit" onClick={() => this.handleEditClick(item)}>编辑</a>
                , <Popconfirm
                  title="确认删除吗"
                  onConfirm={() => this.confirm(item.id)}
                  onCancel={this.cancel}
                  okText="确认"
                  cancelText="取消"
                >
                  <a href="#">删除</a>
                </Popconfirm>]}>
                <List.Item.Meta
                  title={
                    <div>
                      {item.description}
                    </div>
                  }
                  description={item.figure}
                />
              </List.Item>
            )}
          />
        </Card>
        <Modal
          title={done ? null : `特别要求${current ? '编辑' : '添加'}`}
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

export default connect(({specialneed}) => ({
  specialneed: specialneed.specialneed,
}))(SpecialNeed);
