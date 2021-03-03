import React from 'react'
import {PageHeaderWrapper} from '@ant-design/pro-layout'
import {connect} from 'dva'
import {Card, Input, List, Progress, Select, Tag} from 'antd';
import {Link} from 'umi';
import Authorized from '@/utils/Authorized';
import styles from './style.less';

const {Search} = Input;

class BrowseOrder extends React.Component {
  state = {
    filteredData: []
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'order/fetch',
      callback: (e) => {
        this.setState({filteredData: e})
      }
    });
    dispatch({
      type: 'company/fetch'
    });
    dispatch({
      type: 'type/fetch'
    })
  }

  handleChange = (e) => {
    const raw = this.props.order;
    if (e === 'all')
      this.setState({filteredData: raw});
    if (e === 'delay')
      this.setState({filteredData: raw.filter(item => item.status!=='已完工'&&new Date(item.deadline) < new Date())});
    if (e === 'problem')
      this.setState({filteredData: raw.filter(item => item.status === '停止')});
    if(e==='prepare')
      this.setState({filteredData: raw.filter(item => item.currentflow === -1)});
    if (e === 'done')
      this.setState({filteredData: raw.filter(item => item.status === '已完工')});
    if (e === 'processing')
      this.setState({filteredData: raw.filter(item => item.status === '生产中')})
  };

  handleCompanyChange = (e) => {
    const raw = this.props.order;
    if (e === "全部")
      this.setState({filteredData: raw});
    else
      this.setState({filteredData: raw.filter(item => item.company === e)})
  };
  handleTypeChange=(e)=>{
    const raw = this.props.order;
    if (e === "全部")
      this.setState({filteredData: raw});
    else
      this.setState({filteredData: raw.filter(item => item.typeId === e)})
  }

  handleSearch = (e) => {
    const raw = this.props.order;
    if (e === "") {
      this.setState({
        filteredData: raw
      });
      return;
    }
    this.setState({
      filteredData: raw.filter(item => {
        return item.order.indexOf(e) > -1
      })
    })
  };


  render() {
    const {filteredData} = this.state;
    const {company,type} = this.props;
    const extraContent = (
      <div style={{textAlign: 'right'}}>
        <Select className={styles.extraControl} defaultValue="all"  onChange={this.handleChange}>
          <Select.Option value="all">全部</Select.Option>
          <Select.Option value="prepare">准备中</Select.Option>
          <Select.Option value="processing">生产中</Select.Option>
          <Select.Option value="done">已完工</Select.Option>
          {/*<Select.Option value="problem">问题</Select.Option>*/}
          <Select.Option value="delay">延期</Select.Option>
        </Select>
        <Authorized authority={['admin','wdzgy','wdzdd']} noMatch=''>
          <Select className={styles.extraControl} defaultValue="全部" onChange={this.handleCompanyChange}>
            <Select.Option value="全部" key={0}>全部</Select.Option>
            {company && company.filter(item=>{return item.id>1})
              .map(item => <Select.Option value={item.company} key={item.id}>{item.company}</Select.Option>)}
          </Select>
        </Authorized>
        <Authorized authority={['admin','wdzgy','wdzdd']} noMatch=''>
          <Select className={styles.extraControl} defaultValue="全部" onChange={this.handleTypeChange}>
            <Select.Option value="全部" key={0}>全部</Select.Option>
            {type && type.map(item =>
              <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}
          </Select>
        </Authorized>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入订单号"
          onSearch={this.handleSearch}
        />
      </div>
    );
    return (
      <PageHeaderWrapper>
        <Card extra={extraContent} style={{}} title="订单列表">
          <List
            pagination={{defaultPageSize: 10,hideOnSinglePage:true}}
            size="large"
            rowKey="id"
            dataSource={filteredData}
            renderItem={item => (
              <List.Item
                extra={item.company}>
                <Link to={`/order/${item.order}`}>
                <List.Item.Meta
                  title={<>{item.order}{' '}<Tag>{item.status}</Tag>{item.needdemo ? <Tag>包含首件</Tag> : ""}</>}
                  description={<Progress steps={item.roadmap.split(',').length}
                                         percent={Math.round((item.currentflow ) * 100 / item.roadmap.split(',').length)}
                                         format={() => `${item.currentflow!==item.roadmap.split(',').length
                                           ?'正在进行 ' +item.roadmap.split(',')[item.currentflow]
                                           :'已完成工序'}`}
                                         strokeColor="#1890ff"/>}
                /></Link>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({order, company,type}) => ({
  order: order.order,
  company: company.company,
  type:type.type,
}))(BrowseOrder);

