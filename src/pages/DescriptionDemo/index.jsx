import React from 'react'
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Dropdown,
  Form,
  Input,
  List,
  Menu,
  Modal,
  Popconfirm,
  Tabs,
  Timeline
} from 'antd'
import {connect} from 'dva';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Link} from 'umi'
import Authorized from "@/utils/Authorized";
import {ExclamationCircleOutlined} from "@ant-design/icons";

const {confirm} = Modal;


class DescriptionDemo extends React.Component {
  state = {
    visible: false,
    actionType: '', more: ''
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

  formRefs = React.createRef();

  componentDidMount() {
    const {demo} = this.props.match.params;
    const {dispatch} = this.props;
    dispatch({
      type: 'demo/fetch',
      payload: demo,
    });
    dispatch({
      type: 'problem/fetch',
      payload: {order: demo, type: '首件'}
    });
    dispatch({
      type: 'progress/fetch',
      payload: {order: demo, type: '首件'}
    });
    dispatch({
      type: 'specialneed/fetch',
      payload: demo
    });
  }

  showModal = (type, more) => {
    this.setState(({visible: true, actionType: type, more}))
  };

  modalTitle = () => {
    const {actionType} = this.state;
    if (actionType === 'submitProblem')
      return '提交问题';
    if (actionType === 'submitProgress')
      return '提交进度';
    if (actionType === 'handleProblem')
      return '问题处理';
    if(actionType==='changeStatus')
      return'首件异常';
    return undefined;
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onFinish = () => {
    const {dispatch, currentDemo} = this.props;
    const {actionType, more} = this.state;
    if (actionType === 'changeStatus') {
      // 改变状态
      this.formRefs.current
        .validateFields().then(values => {
        dispatch({
          type: 'demo/submit',
          payload: {...values, id: currentDemo.id, orderid: currentDemo.orderId, status: more},
          outcallback: () => {
            dispatch({
              type: 'progress/fetch',
              payload: {order: currentDemo.order, type: '首件'}
            });
            dispatch({
              type: 'problem/fetch',
              payload: {order: currentDemo.order, type: '首件'}
            })
          }
        })
      })
    }
    if (actionType === 'handleProblem') {
      this.formRefs.current.validateFields().then(values => {
        dispatch({
          type: 'problem/submit',
          payload: {...values, id: more, order: currentDemo.order,type:'首件'},
          outcallback: () => {
            dispatch({
              type: 'progress/fetch',
              payload: {order: currentDemo.order, type: '首件'}
            });
            dispatch({
              type: 'problem/fetch',
              payload: {order: currentDemo.order, type: '首件'}
            })
          }
        })
      })
    }
    this.setState({visible: false})
  };


  changeStatus = (status) => {
    const {dispatch, currentDemo} = this.props;
    if (status.includes('首件异常'))
      this.showModal("changeStatus", status);
    else dispatch({
      type: 'demo/submit',
      payload: {id: currentDemo.id, orderid: currentDemo.orderId, status},
      outcallback: () => {
        dispatch({
          type: 'progress/fetch',
          payload: {order: currentDemo.order, type: '首件'}
        })

      }
    })
  };

  showConfirm = (title, content, onOk) => {
    confirm({
      title,
      icon: <ExclamationCircleOutlined/>,
      content,
      onOk,
      onCancel() {
      },
    });
  };

  handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        this.showConfirm("提交确认", "首件已经制作好，提交确认", ()=>this.changeStatus("首件已制作"));
        break;
      case "2":
        this.showConfirm("确认首件", "首件已检查合格，确认首件", ()=>this.changeStatus("首件已确认"));
        break;
      case "3":
        this.showConfirm("提交问题", "首件有异常，发起异常", ()=>this.changeStatus("首件异常"));
        break;
      default:
        break;
    }
  }

  render() {
    const {currentDemo, problems, progress, specialneed} = this.props;
    const {visible, actionType} = this.state;
    const menu =()=> {
      const {currentDemo:{status}}=this.props;
      return(
        status&&<Menu onClick={this.handleMenuClick}>
      {/*外协工艺*/}
      {(status === '首件待制作' || status === '首件异常' )
      && <Menu.Item key="1">提交确认</Menu.Item>}
      {/*十四所工艺*/}
      {status === '首件已制作'
      && <Menu.Item key="2">确认首件</Menu.Item>}
      {status === '首件已制作'
      && <Menu.Item key="3">提交问题</Menu.Item>}
        </Menu>
      )};

    const getModalContent = () => {
      if (actionType === 'changeStatus')
        return (
          <Form
            ref={this.formRefs}
            {...this.formLayout}
            onFinish={this.onFinish}
          >
            <Form.Item label="描述" name="description" rules={[{required: true, message: "请输入异常描述"}]}>
              <Input.TextArea/>
            </Form.Item>
          </Form>
        );
      if (actionType === 'submitProgress') {
        return (
          <Form ref={this.formRefs} {...this.formLayout}
                onFinish={this.onFinish}
          >
            <Form.Item label='描述' name='description'>
              <Input.TextArea/>
            </Form.Item>
          </Form>)
      }
      if (actionType === 'handleProblem')
        return (
          <Form
            ref={this.formRefs}
            {...this.formLayout}
            onFinish={this.onFinish}
          >
            <Form.Item label="处理方式" name="description" rules={[{required: true, message: "请输入异常描述"}]}>
              <Input.TextArea/>
            </Form.Item>
          </Form>
        );
      return undefined
    };

    return (
      <PageHeaderWrapper>
        <Card
          title={currentDemo.order}
          extra={<>
            <Authorized authority={['admin']} noMatch="">
              <Dropdown overlay={menu} trigger={['click']}>
                <Button>
                  更多操作
                </Button>
              </Dropdown>
            </Authorized>
            <Authorized authority={['wxgy']} noMatch="">
              {currentDemo.status === '首件待制作' || currentDemo.status === '首件异常' ? <Popconfirm
                title="首件已经制作好，提交确认？"
                onConfirm={() => this.changeStatus("首件已制作")}
                okText="确认"
                cancelText="取消"
              ><Button type='primary'>提交确认
              </Button></Popconfirm> : ''}
            </Authorized>

            <Authorized authority={['wdzgy']} noMatch="">
              {currentDemo.status === '首件已制作' ? <>
                <Button onClick={() => this.changeStatus("首件异常")}>提交问题</Button>{" "}
                <Popconfirm
                  title="确认首件完成？"
                  onConfirm={() => this.changeStatus('首件已确认')}
                  okText="确认"
                  cancelText="取消"
                ><Button type='primary'>确认首件</Button></Popconfirm>
              </> : ''}
            </Authorized>
          </>
          }
        >
          {currentDemo ?
            <Descriptions bordered>
              <Descriptions.Item label="订单号"><Link
                to={`/order/${currentDemo.order}`}>{currentDemo.order}</Link></Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(currentDemo.createtime).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="状态">{currentDemo.status}</Descriptions.Item>
            </Descriptions>
            : ""}

          <Divider/>

          <Tabs>
            <Tabs.TabPane tab="进展" key="1">
              <Timeline style={{margin: 8}}>
                {progress.map(item => <Timeline.Item color="blue" key={item.id}>
                  <div>{item.description}</div>
                  {new Date(item.createtime).toLocaleString()+` ${item.companyname}   ${item.createusername}`} </Timeline.Item>)}
              </Timeline>
            </Tabs.TabPane>
            <Tabs.TabPane tab="问题" key="2">
              <Timeline style={{margin: 8}}>
                {problems.map(item => <Timeline.Item key={item.id}
                                                     color="blue">
                  <div>{item.description}
                    <Authorized authority={['wxgy','admin']} noMatch="">
                      {item.solved ? '' :
                        <a style={{float: 'right'}}
                           onClick={() => this.showModal("handleProblem", item.id)}>处理</a>}</Authorized></div>
                  {new Date(item.createtime).toLocaleString()+`  ${item.createusername}`}
                  {item.solvedescription !== null ? <>
                    <div>解决方式:{item.solvedescription}</div>
                    <div>{new Date(item.solvetime).toLocaleString()+`  ${item.solveusername}`}</div>
                  </> : ''}
                </Timeline.Item>)}
              </Timeline>
            </Tabs.TabPane>
            <Tabs.TabPane tab="特殊要求" key="3">
              <List
                dataSource={specialneed}
                renderItem={(item, index) => (<List.Item>
                  {`${index + 1}. ${item.description}`}
                </List.Item>)}
              />
            </Tabs.TabPane>
          </Tabs>
        </Card>
        <Modal
          title={this.modalTitle(currentDemo.status)}
          width={640}
          bodyStyle={{padding: '28px 0 0'}}
          destroyOnClose
          visible={visible}
          okText='保存'
          onOk={this.onFinish}
          onCancel={this.handleCancel}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({demo, problem, progress, specialneed}) => ({
  currentDemo: demo.currentDemo,
  problems: problem.problems,
  progress: progress.progress,
  specialneed: specialneed.specialneed,
}))(DescriptionDemo);
