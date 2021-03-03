import React from 'react'
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Menu,
  Modal,
  Popconfirm, Popover,
  Select,
  Steps,
  Switch,
  Tabs,
  Timeline,
} from 'antd';
import {connect} from 'dva';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import Authorized from '@/utils/Authorized';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import moment from "moment";
import {Link} from 'umi'

const {confirm} = Modal;
const {Step} = Steps;

class OrderDescription extends React.Component {
  formRefs = React.createRef();

  state = {
    visible: false,
    actionType: '',
    more: ''
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
    const {order} = this.props.match.params;
    const {dispatch} = this.props;
    dispatch({
      type: 'order/fetch',
      payload: order
    });
    dispatch({
      type: 'problem/fetch',
      payload: {order, type: '订单'}
    });
    dispatch({
      type: 'progress/fetch',
      payload: {order, type: '订单'}
    });
    dispatch({
      type: 'specialneed/fetch',
      payload: order
    });
    dispatch({
      type: 'type/fetch',
    });
    dispatch({
      type: 'company/fetch',
    })
  }

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
      case "0":
        this.showConfirm("确认删除", "删除此订单？", ()=>this.deleteOrder());
        break;
      case "1":
        this.showModal("editOrder");
        break;
      case "2":
        this.showConfirm("确认配发", "确认图纸完整，可以配发", ()=>this.changeStatus("已配发"));
        break;
      case "3":
        this.showConfirm("确认接收", "图纸完整，确认接收", ()=>this.changeStatus("确认图纸"));
        break;
      case "4":
        this.showConfirm("图纸异常", "图纸异常,请求重发",() => this.changeStatus("图纸异常"));
        break;
      case "5":
        this.showConfirm("确认备料", "物料已备齐，接受领料", ()=>this.changeStatus("已备料"));
        break;
      case "6":
        this.showConfirm("确认领料", "已齐套，确认领料", ()=>this.changeStatus("确认领料"));
        break;
      case "7":
        this.showConfirm("领料异常", "领料异常，请求重新备料",()=>this.changeStatus("领料异常"));
        break;
      case "8":
        this.showModal("submitProblem");
        break;
      case "9":
        this.showModal("submitProgress");
        break;
      case "10":
        this.showConfirm("确认完工", "确认订单完工",()=>this.changeStatus("已完工"));
        break;
      case "11":
        this.showConfirm("完工异常", "完工异常，请求重新提交完工",()=>this.changeStatus("完工异常"));
        break;
      default:
        break;
    }
  };

  modalTitle = () => {
    const {actionType, more} = this.state;
    if (actionType === 'editOrder')
      return '修改信息';
    if (actionType === 'handleProblem')
      return '问题处理';
    if (actionType === 'changeStatus') {
      if (more === '已备料')
        return '重新备料描述';
      if (more === '已配发')
        return '重新配发描述';
      return more;
    }
    if (actionType === 'submitProblem')
      return '提交问题';
    if (actionType === 'submitProgress')
      return '反馈进度';
    if (actionType === 'deadline')
      return '反馈完工时间';
    return '未定义';
  };

  showModal = (type, more) => {
    this.setState({
      visible: true,
      actionType: type,
      more
    })
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  onFinish = () => {
    const {dispatch, currentOrder} = this.props;
    const {actionType, more} = this.state;
    if (actionType === 'changeStatus') {
      // 改变状态
      this.formRefs.current
        .validateFields().then(values => {
        dispatch({
          type: 'order/submit',
          payload: {...values, id: currentOrder.id, status: more},
          outcallback:()=>{
            dispatch({
              type:'progress/fetch',
              payload:{order: currentOrder.order, type: '订单'}
            });
          }
        })
      })
    }
    if (actionType === 'submitProgress') {
      // 反馈进度
      this.formRefs.current
        .validateFields().then(values => {
        dispatch({
          type: 'progress/submit',
          payload: {
            ...values,
            orderid: currentOrder.id,
            type: '订单',
            status: currentOrder.roadmap.split(',')[values.currentflow],
            currentflow:values.currentflow+1,
            order: currentOrder.order,
          },
          outcallback: () => {
            dispatch(
              {
                type: 'order/fetch',
                payload: currentOrder.order,
              }
            )
          }
        })
      })
    }
    if (actionType === 'submitProblem') {
      // 提交问题
      this.formRefs.current
        .validateFields().then(values => {
        dispatch({
          type: 'problem/submit',
          payload: {...values, orderid: currentOrder.id, type: '订单', order: currentOrder.order}
        })
      })
    }
    if (actionType === 'handleProblem') {
      // 处理问题
      this.formRefs.current
        .validateFields().then(values => {
        dispatch({
          type: 'problem/submit',
          payload: {...values, id: more, order: currentOrder.order, type: '订单'}
        })
      })
    }
    if (actionType === 'editOrder') {
      this.formRefs.current
        .validateFields().then(values => {
        dispatch({
          type: 'order/submit',
          payload: {...values, id: currentOrder.id}
        })
      })
    }
    if (actionType === 'deadline') {
      this.formRefs.current
        .validateFields().then(values => {
        dispatch({
          type: 'order/deadline',
          payload: {...values, id: currentOrder.id},
          outcallback:()=>{
              dispatch({
                type:'progress/fetch',
                payload:{order: currentOrder.order, type: '订单'}
              });
          }
        })
      })
    }

    this.setState({visible: false})
  };

  changeStatus = (status) => {
    const {dispatch, currentOrder} = this.props;

    if (status.includes('图纸异常') || status.includes("领料异常")||status.includes("完工异常")
      || currentOrder.status.includes('图纸异常') || currentOrder.status.includes('领料异常')|| currentOrder.status.includes('完工异常'))
      this.showModal("changeStatus", status);
    else dispatch({
      type: 'order/submit',
      payload: {id: currentOrder.id, status},
      outcallback:()=>{
        dispatch({
          type:'progress/fetch',
          payload:{order: currentOrder.order, type: '订单'}
        });
      }
    })
  };



  deleteOrder=()=>{
    const {dispatch, currentOrder} = this.props;
    dispatch({
      type:'order/submit',
      payload:{id: currentOrder.id}
    });
  }

  render() {
    const {currentOrder , problems, progress, specialneed, company, type,
      currentOrder:{status="",needdemo=false,roadmap=',',currentflow=0}} = this.props;
    const {visible, actionType} = this.state;
    const getModalContent = () => {
      if (actionType === 'editOrder') {
        return (
          <Form
            size="middle"
            ref={this.formRefs}
            scrollToFirstError
            {...this.formLayout}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={currentOrder ? {
              order: currentOrder.order,
              figure: currentOrder.figure,
              companyId: currentOrder.companyId,
              figureversion: currentOrder.figureversion,
              number: currentOrder.number,
              deadline: moment(currentOrder.deadline),
              typeId: currentOrder.typeId,
              needdemo: currentOrder.needdemo,
            } : ''}
          >
            <Form.Item
              label="订单号"
              name="order"
              rules={[{required: true, message: '请输入订单号'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="图号"
              name="figure"
              rules={[{required: true, message: '请输入图号'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="承制外协单位"
              name="companyId"
              rules={[{required: true, message: '选择外协单位'}]}
            >
              <Select>
                {company
                  ? company.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.company}
                    </Select.Option>
                  ))
                  : ''}
              </Select>
            </Form.Item>
            <Form.Item
              label="图纸版本号"
              name="figureversion"
              rules={[{required: true, message: '请输入图纸版本号'}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="订单数量"
              name="number"
              rules={[{type: 'number', required: true, message: '请输入数量'}]}
            >
              <InputNumber min={1} style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item
              label="完工时间"
              name="deadline"
              rules={[{required: true, message: '请选择完工日期'}]}
            >
              <DatePicker disabledDate={this.disabledDate} inputReadOnly style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item
              label="订单类型"
              name="typeId"
              rules={[{required: true, message: '请选择订单类型'}]}
            >
              <Select>
                {type
                  ? type.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))
                  : ''}
              </Select>
            </Form.Item>
            <Form.Item label="是否需要首件" name="needdemo" valuePropName="checked">
              <Switch/>
            </Form.Item>
          </Form>

        )
      }
      if (actionType === 'submitProblem') {
        return (
          <Form
            ref={this.formRefs}
            {...this.formLayout}
            onFinish={this.onFinish}
          >
            <Form.Item label="问题描述" name="description" rules={[{required: true, message: "请输入问题描述"}]}>
              <Input.TextArea/>
            </Form.Item>
          </Form>
        )
      }
      if (actionType === 'handleProblem')
        return (
          <Form
            ref={this.formRefs}
            {...this.formLayout}
            onFinish={this.onFinish}
          >
            <Form.Item label="处理方式" name="description" rules={[{required: true, message: "请输入问题描述"}]}>
              <Input.TextArea/>
            </Form.Item>
          </Form>
        );
      if (actionType === 'submitProgress') {
        return (
          <Form
            ref={this.formRefs}
            {...this.formLayout}
            onFinish={this.onFinish}
            initialValues={{
              currentflow: currentOrder.currentflow
            }}
          >
            <Form.Item label="已完成进度" name="currentflow" rules={[{required: true, message: "请选择工序进度"}]}>
              <Select>
                { currentOrder.roadmap.split(",")
                  .filter((item, index) => {
                    return index >= currentOrder.currentflow})
                  .map((item, index) =>
                    <Select.Option
                    value={currentOrder.currentflow+index}
                    key={index}>{item}</Select.Option>) }
              </Select>
            </Form.Item>
            <Form.Item label="进度描述" name="description" >
              <Input.TextArea/>
            </Form.Item>
          </Form>
        )
      }

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
      if (actionType === 'deadline')
        return (
          <Form
            ref={this.formRefs}
            {...this.formLayout}
            onFinish={this.onFinish}
          >
            <Form.Item label="预计完工日期" name="deadline" rules={[{required: true, message: "请选择完工日期"}]}>
              <DatePicker disabledDate={this.disabledDate} inputReadOnly style={{width: '100%'}} />
            </Form.Item>
          </Form>
        );

      return undefined;
    };

    const menu =()=> {
      return(
        <Menu onClick={this.handleMenuClick}>
          {/*修改信息*/}
          {status.includes('待配发/待备料')&&<Menu.Item key="0">删除订单</Menu.Item>}
         {/*修改信息*/}
          {status.includes('待配发/待备料')&&<Menu.Item key="1">修改信息</Menu.Item>}
         {/*十四所调度员 图纸*/}
        {(status.includes('待配发') || status.includes('图纸异常'))
        && <Menu.Item key="2">确认配发</Menu.Item>}
         {/*外协计划    图纸*/}
        {status.includes('已配发')
        && <Menu.Item key="3">确认图纸</Menu.Item>}
        {status.includes('已配发')
        && <Menu.Item key="4">图纸异常</Menu.Item>}
         {/*十四所调度员 物料*/}
        {(status.includes('待备料') || status.includes('领料异常'))
        && <Menu.Item key="5">确认备料</Menu.Item>}
         {/*外协领料    物料*/}
        {status.includes('已备料')
        && <Menu.Item key="6">确认领料</Menu.Item>}
        {status.includes('已备料')
        && <Menu.Item key="7">领料异常</Menu.Item>}
         {/*外协计划 反馈进度*/}
        {(status.includes('生产中')// 生产中
          || status.includes('首件已确认')// 首件已确认
          || (status.includes('确认图纸/确认领料') && !needdemo)// 图纸，领料已确认，不需要首件
        )
        && <Menu.Item key="8">提交问题</Menu.Item>}
         {/*外协工艺 提交问题*/}
        {(status.includes('生产中')// 生产中
          || status.includes('首件已确认')// 首件已确认
          || (status.includes('确认图纸/确认领料') && !needdemo)// 图纸，领料已确认，不需要首件
        )
        && <Menu.Item key="9">反馈进度</Menu.Item>}
          {status.includes('提交完工')
          && <Menu.Item key="10">确认完工</Menu.Item>}
          {status.includes('提交完工')
          && <Menu.Item key="11">完工异常</Menu.Item>}
      </Menu>);
    }

    const timelineDot=(type)=>{
      if(type==='成功')
        return 'green';
      if(type==='异常')
        return 'red';
      if(type==='生产中')
        return 'blue'
    }

    return (
      <PageHeaderWrapper>
        <Card
          title={currentOrder.order}
          extra={
            <>
              <Authorized authority={['admin']} noMatch="">
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button>
                    更多操作
                  </Button>
                </Dropdown>
              </Authorized>

              <Authorized authority={['wdzdd']} noMatch="">
                {status.includes('待配发/待备料')&&<Button onClick={() => this.showModal("editOrder")}>修改</Button>}{" "}</Authorized>

              <Authorized authority={['wdzdd']} noMatch="">
                  {(status.includes('待备料') || status.includes('领料异常')) &&
                  <Popconfirm
                    title="确认接受领料？"
                    onConfirm={() => this.changeStatus("已备料")}
                    okText="确认"
                    cancelText="取消">
                    <Button
                      type={status.includes('已配发')||status.includes('确认图纸') ? "primary" : ""}>确认备料</Button>{" "}
                  </Popconfirm>}
                  {(status.includes('待配发') || status.includes('图纸异常')) &&
                  <Popconfirm title="确认配发材料？"
                              onConfirm={() => this.changeStatus("已配发")}
                              okText="确认"
                              cancelText="取消">
                    <Button type="primary">确认配发</Button>
                  </Popconfirm>}
                {status.includes('提交完工') &&<>
                  <Button onClick={() => this.changeStatus("完工异常")}>完工异常</Button>{" "}
                  <Popconfirm title="确认外协完工？"
                            onConfirm={() => this.changeStatus("已完工")}
                            okText="确认"
                            cancelText="取消">
                  <Button type="primary">确认完工</Button>
                </Popconfirm>
                </>}
              </Authorized>

              <Authorized authority={['wxjh']} noMatch="">
                  {status.includes('已配发')
                  && <>
                    <Button onClick={() => this.changeStatus("图纸异常")}>图纸异常</Button>{" "}
                    <Popconfirm
                      title="确认图纸完整？"
                      onConfirm={() => this.changeStatus("确认图纸")}
                      okText="确认"
                      cancelText="取消">
                      <Button type="primary">确认图纸</Button>
                    </Popconfirm>
                  </>
                  }</Authorized>

              <Authorized authority={['wxll']} noMatch="">{status.includes('已备料')
                && <>
                  <Button onClick={() => this.changeStatus("领料异常")}>提交异常</Button>{" "}
                  <Popconfirm
                    title="确认领料完成？"
                    onConfirm={() => this.changeStatus("确认领料")}
                    okText="确认"
                    cancelText="取消">
                    <Button type="primary">确认物料</Button></Popconfirm>
                </>
                }</Authorized>

              <Authorized authority={['wxgy']} noMatch="">
                  {status.includes('生产中') &&
                  <Button type="primary" onClick={() => this.showModal("submitProblem")}>提交问题</Button>
                }</Authorized>

              <Authorized authority={['wxjh']} noMatch=""> {(roadmap.split(',').length !== currentflow&&status.includes('生产中')// 生产中
                  || status.includes('首件已确认')// 首件已确认
                  || (status.includes('确认图纸/确认领料') && !needdemo)// 图纸，领料已确认，不需要首件

              )
                &&
                <Button type="primary" onClick={() => this.showModal("submitProgress")}>反馈进度</Button>
                }</Authorized>

            </>
          }>
            <Descriptions
              bordered
              style={{
                marginBottom: 32,
              }}
            >
              <Descriptions.Item label="图号">
                {currentOrder.figure?currentOrder.figure.slice(0,15)+"...":''}
              </Descriptions.Item>
              <Descriptions.Item label="订单号">
                {currentOrder.order}
              </Descriptions.Item>
              <Descriptions.Item label="图纸版本号">
                {currentOrder.figureversion}
              </Descriptions.Item>
              <Descriptions.Item label="数量">
                {currentOrder.number}
              </Descriptions.Item>
              <Descriptions.Item label="类型">
                {currentOrder.type}
              </Descriptions.Item>
              <Descriptions.Item label="承制外协单位">
                {currentOrder.company}
              </Descriptions.Item>
              {currentOrder.actualdeadline?
                <Descriptions.Item label="厂家预计日期">
                {currentOrder.actualdeadline}
              </Descriptions.Item>:
                <Descriptions.Item label="要求完成日期">
                {currentOrder.deadline}
              </Descriptions.Item>}
              <Descriptions.Item label="状态">
                <Badge status='processing' text={currentOrder.status}/>
              </Descriptions.Item>
              <Descriptions.Item label="需要首件">
                {currentOrder.needdemo ? <>是 <Link to={`/demo/${currentOrder.order}`}>链接</Link></> : "否"}
              </Descriptions.Item>
            </Descriptions>

          <Authorized authority={['wxjh', 'admin']} noMatch="">
            {roadmap.split(',').length === currentflow  &&
              !status.includes('提交完工')&&!status.includes('已完工')&&
            <Popconfirm
              title={'确认提交完工？'}
              onConfirm={() => this.changeStatus("提交完工")}
              okText="确认"
              cancelText="取消">
              <Button type='primary' block>提交完工</Button>
            </Popconfirm>}
            {(
              status.includes('生产中')&&!currentOrder.actualdeadline
              // Math.floor((new Date().getTime()-new Date(currentOrder.updatetime).getTime())/(24*3600*1000))>2
            )
            &&
            <Authorized authority={['wxjh', 'admin']} noMatch="">
              <Button block type={'primary'} onClick={()=>this.showModal("deadline")} style={{marginTop:8}}>反馈完工日期</Button>
            </Authorized>
            }
          </Authorized>

          <Divider/>

          {/*标签页*/}

          <div style={{minHeight:300}}>
            <Tabs >
            <Tabs.TabPane tab="进展" key="1">
              {progress.length?<Timeline style={{margin: 8}}>
                {progress.map(item => <Timeline.Item color={timelineDot(item.infotype)} key={item.id}>
                  <div>{item.description}</div>
                  {new Date(item.createtime).toLocaleString()+` ${item.companyname}  ${item.createusername}`} </Timeline.Item>)}
              </Timeline>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            </Tabs.TabPane>
            <Tabs.TabPane tab="问题" key="2">
              {problems.length? <Timeline style={{margin: 8}}>
                {problems.map(item => <Timeline.Item key={item.id}
                                                     color="red">
                  <div>{item.description}
                    <Authorized authority={['wdzgy','admin']} noMatch="">
                      {item.solved ? '' :
                        <a style={{float: 'right'}} onClick={() => this.showModal("handleProblem", item.id)}>处理</a>}
                    </Authorized></div>
                  {new Date(item.createtime).toLocaleString()+`  ${item.createusername}`}
                  {item.solvedescription !== null ? <>
                    <div>解决方式:{item.solvedescription}</div>
                    <div>{new Date(item.solvetime).toLocaleString()+`  ${item.solveusername}`}</div>
                  </> : ''}
                </Timeline.Item>)}
              </Timeline>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            </Tabs.TabPane>
            <Tabs.TabPane tab="特殊要求" key="3">
              <List
                dataSource={specialneed}
                renderItem={(item, index) => (<List.Item>
                  {`${index + 1}. ${item.description}`}
                </List.Item>)}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="工序进度" key="4">
              <Steps direction="vertical" size="small" current={currentOrder.currentflow}>
                { roadmap.split(',').map((item, index) => <Step title={item}
                                                                                                   key={index}/>)}
              </Steps>
            </Tabs.TabPane>
          </Tabs>
          </div>
        </Card>
        <Modal
          title={this.modalTitle()}
          width={640}
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

export default connect(({order, user, problem, progress, specialneed, company, type}) => ({
  currentOrder: order.currentOrder,
  currentUser: user.currentUser,
  problems: problem.problems,
  progress: progress.progress,
  specialneed: specialneed.specialneed,
  company: company.company,
  type: type.type,
}))((OrderDescription))
