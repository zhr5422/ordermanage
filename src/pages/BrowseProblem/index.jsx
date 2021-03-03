import React from 'react'
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Card, Input, List, Tag} from "antd";
import {connect} from 'dva'
import {Link} from "umi";

const {Search} = Input;

class BrowseProblem extends React.Component {
  state = {
    filteredData: []
  };
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'problem/fetch',
      callback: (e) => {
        this.setState({filteredData: e})
      }
    })
  }
  handleSearch=(e)=>{
    const raw = this.props.problems;
    if (e === "") {
      this.setState({
        filteredData: raw
      });
      return;
    }
    this.setState({
      filteredData: raw.filter(item => {
        return item.description.indexOf(e) > -1
             ||item.order.indexOf(e) > -1
             ||item.type.indexOf(e) > -1
      })
    })
  }
  render() {
    const {filteredData} = this.state;
    const {problems} = this.props;
    const extraSearch = (
      <Search
        placeholder="描述、订单号、问题类型"
        onSearch={this.handleSearch}
      />
    );
    return (
      <PageHeaderWrapper>
        <Card title='问题列表' extra={extraSearch}>
          <List
            itemLayout='horizontal'
            pagination={{defaultPageSize: 10,hideOnSinglePage:true}}
            dataSource={filteredData}
            renderItem={(item) => (
              <List.Item extra={<div>{item.order}</div>}
              >
                <Link to={`/${item.type === "首件" ? 'demo' : 'order'}/${item.order}`}>
                <List.Item.Meta
                  title={<>{item.description}{' '}<Tag>{item.type}</Tag></>}
                  description={new Date(item.createtime).toLocaleString()}
                />
                </Link>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default connect(({problem}) => ({
    problems: problem.problems
  }
))(BrowseProblem);
