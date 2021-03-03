import React from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Button, Card, DatePicker, Form, Input, InputNumber, Select, Switch, message, notification, List} from 'antd';
import moment from 'moment';
import {connect} from 'dva';
import md5 from 'md5'

const formItemLayout = {
  labelCol: {xs: {span: 24}, sm: {span: 7}},
  wrapperCol: {xs: {span: 24}, sm: {span: 12}, md: {span: 10}},
};
const buttonLayout = {
  wrapperCol: {
    sm: {span: 10, offset: 7},
    xs: {span: 10},
  },
};

const {Option} = Select;

class AddOrder extends React.Component {
  form =React.createRef();
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'company/fetch',
    });
    dispatch({
      type: 'type/fetch',
    });
    dispatch({
      type: 'roadmap/fetchRoadmap'
    })
  }

  onFinish = (values) => {
    const {dispatch} = this.props;
    let figure=this.form.current.getFieldValue("figure");
    figure=md5(figure);
    dispatch({
      type: 'order/submit',
      payload: {...values,figure},
    });
  };

  onFinishFailed = (errorInfo) => {};

  onInputBlur=()=>{
    const {dispatch} = this.props;
    let figure=this.form.current.getFieldValue("figure");
    figure=md5(figure);
    // dispatch({
    //   type: 'specialneed/fetchByFigure',
    //   payload:figure
    // });
    const companyId=this.form.current.getFieldValue("companyId");
    if(!companyId) return;
    dispatch({
      type: 'order/needdemo',
      payload: {figure,companyId:companyId},
      callback:(e)=>{
        this.form.current.setFieldsValue({needdemo: e});
        if(e===true)
          message.info("已设置需要首件");
        else
          message.info("该单位承制过该图号产品，已设置不需要首件")
      }
    });


  }

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };
  checkNeedDemo=(e)=>{
    const {dispatch} = this.props;
    let figure=this.form.current.getFieldValue("figure");
    figure=md5(figure);
    dispatch({
      type: 'order/needdemo',
      payload: {figure,companyId:e},
      callback:(e)=>{
        this.form.current.setFieldsValue({needdemo: e});
        if(e===true)
          message.info("根据图号和外协单位，已设置需要首件");
        else
          message.info("该单位承制过该图号产品，不需要制作首件")
      }
    });
  }

  render() {
    const {
      company=[],
      type=[], roadmap=[]
    } = this.props;
    return (
      <PageHeaderWrapper content="按照下表提供外协订单的信息">
        <Card>
          <Form
            scrollToFirstError
            ref={this.form}
            {...formItemLayout}
            name="basic"
            initialValues={{remember: true}}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="订单号"
              name="order"
              rules={[{required: true, message: '请输入订单号'}]}
            >
              <Input placeholder='输入订单号' />
            </Form.Item>
            <Form.Item
              label="图号"
              name="figure"
              rules={[{required: true, message: '请输入图号'}]}
            >
              <Input placeholder='输入图号' onBlur={this.onInputBlur}/>
            </Form.Item>
            {/*{specialneed.length!==0 &&<Card>*/}
            {/*<List*/}
            {/*  size="large"*/}
            {/*  rowKey="key"*/}
            {/*  header={<div>{this.form.current&&this.form.current.getFieldValue("figure")+' 特殊需求'}</div>}*/}
            {/*  pagination={{defaultPageSize: 10, hideOnSinglePage: true}}*/}
            {/*  dataSource={specialneed}*/}
            {/*  renderItem={(item) => (*/}
            {/*    <List.Item>*/}
            {/*      {item.description}*/}
            {/*    </List.Item>*/}
            {/*  )}/></Card>}*/}
            <Form.Item
              label="承制外协单位"
              name="companyId"
              rules={[{required: true, message: '选择外协单位'}]}
            >
              <Select placeholder='选择外协单位' onSelect={this.checkNeedDemo}>
                {company.filter(item => {
                    return item.id > 1
                  }).map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.company}
                      </Option>
                    ))}
              </Select>
            </Form.Item>
            <Form.Item label="订单类型"
                       name="typeId"
                       rules={[{required: true, message: '请选择订单类型'}]}
            >
              <Select placeholder='选择订单类型'>
                { type.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label='工艺路线(可到配置页面增加)'
                       name='roadmap'
                       rules={[{required: true, message: '请选择工艺路线'}]}>
              <Select placeholder='选择工艺路线'
              >
                { roadmap.map(item => (
                  <Select.Option key={item.id} value={item.name}>
                    {item.name}
                  </Select.Option>
                )) }
              </Select>
            </Form.Item>
            <Form.Item
              label="图纸版本号"
              name="figureversion"
              rules={[{required: true, message: '请输入图纸版本号'}]}
            >
              <Input placeholder='输入图纸版本号'/>
            </Form.Item>
            <Form.Item label="数量"
                       name="number"
                       rules={[{type: 'number', required: true, message: '请输入数量'}]}
            >
              <InputNumber min={1} style={{width: '100%'}} placeholder='输入数量'/>
            </Form.Item>
            <Form.Item label="要求完工时间"
                       name="deadline"
                       rules={[{required: true, message: '请选择完工日期'}]}
            >
              <DatePicker disabledDate={this.disabledDate} inputReadOnly style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item label="是否需要首件"
                       name="needdemo"
                       valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item {...buttonLayout}>
              <Button type="primary" block htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({roadmap, company, type,specialneed}) => ({
  specialneed:specialneed.specialneed,
  roadmap: roadmap.roadmap,
  company: company.company,
  type: type.type
}))(AddOrder);

