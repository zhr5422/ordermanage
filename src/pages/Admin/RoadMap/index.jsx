import React from 'react';
import {Button, Card, Form, Input, List, Modal, Popconfirm, Select, Tabs} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'dva';

const {TabPane} = Tabs;
const FormItem = Form.Item;
const SelectOption = Select.Option;

class RoadMap extends React.Component {
  formRef = React.createRef();

  state = {
    visible: false,
    done: false,
    current: undefined,
    tab: '工艺路线',
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
      type: 'roadmap/fetchRoadmap',
    });
    dispatch({
      type: 'roadmap/fetchFlow',
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

  callback = (e) => {
    this.setState({tab: e})
  };

  onFinish = () => {
    const {tab, current} = this.state;
    const {dispatch} = this.props;
    if (tab === '工艺路线')
      this.formRef.current
        .validateFields()
        .then(values => {
          dispatch({
            type: 'roadmap/submitRoadmap',
            payload: current ? {id: current.id, name: values.name.join(',')} : {name: values.name.join(',')}
          });
          this.setState({visible: false});
        });
    if (tab === '工序')
      this.formRef.current
        .validateFields()
        .then(values => {
          dispatch({
            type: 'roadmap/submitFlow',
            payload: current ? {id: current.id, ...values} : values
          });
          this.setState({visible: false});
        });
  };

  handleEditClick = (item) => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  confirm = (e) => {
    const {tab} = this.state;
    const {dispatch} = this.props;
    if (tab === '工序')
      dispatch({
        type: 'roadmap/submitFlow',
    payload:{ id:e}
      });
    if (tab === '工艺路线')
      dispatch({
        type: 'roadmap/submitRoadmap',
        payload: { id:e}
      })
  };

  render() {
    const {
      roadmap, flow
    } = this.props;
    const {visible, done, current, tab} = this.state;
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
      if (tab === '工艺路线')
        return (
          <Form
            ref={this.formRef}
            initialValues={{
              name: current ? current.name.split(',') : [],
            }}
          >
            <FormItem
              name="name"
              label="工艺路线"
              {...this.formLayout}
              rules={[{required:true,message:'请选择多个工序，以形成工艺路线'}]}>
              <Select
                mode="tags"
                style={{width: '100%'}}
              >
                {flow.map(item => (
                  <Select.Option key={item.id} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
          </Form>
        );
      if (tab === '工序')
        return (
          <Form
            ref={this.formRef}
            initialValues={{
              name: current ? current.name : '',
            }}
          >
            <FormItem name="name"
                      label="工艺路线" {...this.formLayout}
                      rules={[{required:true,message:'请输入工序名称'}]}>
              <Input/>
            </FormItem>
          </Form>
        )
    };
    return (
      <PageHeaderWrapper>
        <Card>
          <Tabs onChange={this.callback}>
            <TabPane tab='工艺路线' key='工艺路线'>
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
                dataSource={roadmap}
                pagination={{defaultPageSize: 10, hideOnSinglePage: true}}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <a key="edit" onClick={() => this.handleEditClick(item)}>编辑</a>
                      , <Popconfirm
                        title="确认删除吗"
                        onConfirm={() => this.confirm(item.id)}
                        okText="确认"
                        cancelText="取消"
                      >
                        <a href="#">删除</a>
                      </Popconfirm>
                    ]}>
                    <List.Item.Meta
                      title={<div>{item.name}</div>}
                    />
                  </List.Item>
                )}
              />

            </TabPane>
            <TabPane tab='工序' key='工序'>
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
                dataSource={flow}
                pagination={{defaultPageSize: 10, hideOnSinglePage: true}}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <a key="edit" onClick={() => this.handleEditClick(item)}>编辑</a>
                      , <Popconfirm
                        title="确认删除吗"
                        onConfirm={() => this.confirm(item.id)}
                        okText="确认"
                        cancelText="取消"
                      >
                        <a href="#">删除</a>
                      </Popconfirm>
                    ]}>
                    <List.Item.Meta
                      title={<div>{item.name}</div>}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title={done ? null : `${tab}${current ? '编辑' : '添加'}`}
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

export default connect(({roadmap}) => ({
  roadmap: roadmap.roadmap,
  flow: roadmap.flow,
}))(RoadMap);
