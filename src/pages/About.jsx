import React from "react";
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Card, Divider, Timeline, Typography} from "antd";
const { Title, Paragraph, Text } = Typography;

export default function About(props){
  return <PageHeaderWrapper>
    <Card>
        <Paragraph>
          基于 Springboot + mybatis 3 + React antd 开发
        </Paragraph>
      <Divider orientation="left">待做</Divider>
      <Paragraph>
        <ul>
          <li>订单浏览中的问题订单、按照日期查找订单</li>
          <li>参数配置目前是固定数值（2），后期改为数据库读取</li>
        </ul>
      </Paragraph>
      <Divider orientation="left">更新记录</Divider>
      <Timeline style={{marginTop:32}} reverse={true}>
        <Timeline.Item>方案初稿 2020-4-10</Timeline.Item>
        <Timeline.Item>网站试用 2020-6-01</Timeline.Item>
      </Timeline>
    </Card>
  </PageHeaderWrapper>
}
