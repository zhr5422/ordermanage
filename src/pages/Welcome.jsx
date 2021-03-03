import React from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Alert, Badge, Card, Collapse, List, Tag} from 'antd';
import {connect} from 'dva'
import {Link} from "umi";

const {Panel} = Collapse;

function WelcomePanel(props) {
  return <Collapse style={{marginTop: 16}} accordion>
    {props.data4Panel.map((item, index) => {
      let badgeStyle={backgroundColor:'#108ee9'}
      if(item.name.includes('异常')){
        badgeStyle={backgroundColor:'#ffa72a'}
      }
      if(item.name.includes('超期')){
        badgeStyle={backgroundColor:'#eb0700'}
      }
      if(item.name.includes('未')){
        badgeStyle={backgroundColor: '#fff',
        color: '#999',
        boxShadow: '0 0 0 1px #d9d9d9 inset'}
      }
      if (item.name.includes('首件'))
        return item.data.length && <Panel key={index}
                                          header={<><span>{item.name} </span>
                                              <Badge count={item.data.length} style={badgeStyle}/></>}>
          <List
            size="small"
            bordered={false}
            dataSource={item.data}
            renderItem={(item) => (
              <List.Item extra={item.company}>
                <List.Item.Meta
                  title={
                    <>
                      <Link
                        to={`/demo/${item.order}`}>{item.order}</Link>{' '}
                    </>
                  }
                  description={new Date(item.createtime).toLocaleString()}
                />
              </List.Item>
            )}
          />
        </Panel>
      if (item.name.includes('问题'))
        return item.data.length && <Panel key={index}
                                          header={<><span>{item.name} </span>
                                            <Badge count={item.data.length} style={badgeStyle}/></>}>
          <List
            size="small"
            bordered={false}
            dataSource={item.data}
            renderItem={(item) => (
              <List.Item extra={item.order}>
                <List.Item.Meta
                  title={
                    <>
                      <Link
                        to={`/${item.type === '首件' ? 'demo' : 'order'}/${item.order}`}>{item.description}</Link>{" "}
                      <Tag>{item.type}</Tag>
                    </>
                  }
                  description={new Date(item.createtime).toLocaleString()}
                />
              </List.Item>
            )}
          />
        </Panel>
      return item.data.length && <Panel key={index}
                                        header={<><span>{item.name} </span>
                                            <Badge count={item.data.length} style={badgeStyle}/></>}
      >
        <List
          size="small"
          bordered={false}
          dataSource={item.data}
          renderItem={(item) => (
            <List.Item extra={item.company}>
              <List.Item.Meta
                title={<><Link to={`/order/${item.order}`}>{item.order}</Link>{' '}</>}
                description={new Date(item.createtime).toLocaleString()}
              />
            </List.Item>
          )}
        />
      </Panel>
    })}
  </Collapse>
}


class Welcome extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user/welcome',
    })
  }

  render() {

    const {
      welcome: {
        undoneOrders = [],
        undoneDemos = [],
        unsolvedProblems = [],

        undoneOrdersOfCompany = [],
        undoneDemosOfCompany = [],
        unsolvedProblemsOfCompany = [],

        //wdzdd
        waitingDistribute = [],
        waitingPrepareMaterial = [],
        waitingConfirmOrderDone = [],
        DistributeException = [],
        MaterialException = [],
        outofDateDistribute = [],
        outofDatePrepareMaterial = [],
        outofDateConfirmOrderDone = [],
        outofDateOrder = [],
        // wdzgy
        undoneOrdersByType = [],
        undoneDemosByType = [],
        unsolvedProblemsByType = [],
        waitingConfirmDemoDone = [],
        outofDateConfirmDemoDone = [],
        // wxjh
        needReceiveFigure = [],
        feedbackEstimatedFinishDate = [],
        outofDateReceiveFigure = [],
        outofDateFeedbackEstimatedFinishDate = [],
        // wxll
        needLL = [],
        outofDateLL = [],
        //wxgy
        demoException = [],
      },
      currentUser
    } = this.props;
    const data4CollapsePanel =
      [
        {
          name: '未完成订单',
          data: undoneOrders,
        }, {
          name: '未完成首件',
          data: undoneDemos
        }, {
          name: '未解决问题',
          data: unsolvedProblems
        }, {
          name: '本单位未完成订单',
          data: undoneOrdersOfCompany
        }, {
          name: '本单位未完成首件',
          data: undoneDemosOfCompany
        }, {
          name: '本单位未解决问题',
          data: unsolvedProblemsOfCompany
        },

        //wdzdd
        {
          name: '待配发订单',
          data: waitingDistribute
        }, {
        name: '待备料订单',
        data: waitingPrepareMaterial
        }, {
        name: '待确认订单完工',
        data: waitingConfirmOrderDone
        }, {
          name: '图纸异常',
          data: DistributeException
        }, {
        name: '领料异常',
        data: MaterialException
        }, {
          name: '超期配发图纸',
          data: outofDateDistribute
        }, {
        name: '超期备料订单',
        data: outofDatePrepareMaterial
        }, {
        name: '超期确认订单完工',
        data: outofDateConfirmOrderDone
        }, {
        name: '超期订单',
        data: outofDateOrder
        },
        //wdzgy
        {
          name: '待确认首件完成',
          data: waitingConfirmDemoDone
        }, {
        name: '超期确认订单完成',
        data: outofDateConfirmDemoDone
        }, {
        name: '我的订单',
        data: undoneOrdersByType
        }, {
        name: '我的首件',
        data: undoneDemosByType
        }, {
        name: '待处理问题',
        data: unsolvedProblemsByType
        },
        //wxjh
        {
          name: '待确认图纸',
          data: needReceiveFigure
        }, {
          name: '待反馈完工时间',
          data: feedbackEstimatedFinishDate
        }, {
          name: '超期确认图纸',
          data: outofDateReceiveFigure
        }, {
          name: '超期反馈完工时间',
          data: outofDateFeedbackEstimatedFinishDate
        },
        //wxll
        {
          name: '待确认领料',
          data: needLL
        }, {
        name: '超期确认领料',
        data: outofDateLL
        }, {
          name: '异常首件',
          data: demoException
        },
      ];


    return (
      <PageHeaderWrapper>
        <Card>
          <Alert
            message="欢迎使用 外协订单管理系统 "
            type="success"
            showIcon
            banner
            style={{
              margin: -12,
              marginBottom: 24,
            }}
          />
          <span>你好 {currentUser.company+" "+currentUser.username}</span>

          {/*<Collapse style={{marginTop: 16}}>*/}
          <WelcomePanel data4Panel={data4CollapsePanel}/>


        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default connect(({user}) => ({
  welcome: user.welcome,
  currentUser: user.currentUser
}))(Welcome)

