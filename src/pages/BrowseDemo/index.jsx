import React from 'react';
import {Card, Input, List, Tag} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'dva';
import {Link} from 'umi';

const {Search} = Input;

class DemoOrder extends React.PureComponent {
  state = {
    filteredData: []
  };
  componentDidMount() {
    const {dispatch} = this.props;

    dispatch({
      type: 'demo/fetch',
      callback: (e) => {
        this.setState({filteredData: e})
      }
    });
  }

  handleSearch=(e)=>{
    const raw = this.props.demos;
    if (e === "") {
      this.setState({
        filteredData: raw
      });
      return;
    }
    this.setState({
      filteredData: raw.filter(item => {
        return item.status.indexOf(e) > -1
          ||item.order.indexOf(e) > -1
          // ||item.company.indexOf(e) > -1
      })
    })
  }

  render() {
    const {filteredData} = this.state;
    const {demos} = this.props;
    const extraSearch = (
      <Search
        placeholder="状态、订单号"
        onSearch={this.handleSearch}
      />
    );
    return (
      <PageHeaderWrapper>
        <Card title="首件列表" extra={extraSearch}>
          <List
            size="small"
            dataSource={filteredData}
            pagination={{defaultPageSize: 10,hideOnSinglePage:true}}
            renderItem={(item) => (
              <List.Item
                extra={item.company}><Link to={`/demo/${item.order}`}>
                <List.Item.Meta
                  title={
                    <>
                      {item.order}{' '}
                      <Tag>{item.status}</Tag>
                    </>
                  }
                  description={new Date(item.createtime).toLocaleString()}
                /></Link>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({demo}) => ({
  demos: demo.demos,
}))(DemoOrder);
