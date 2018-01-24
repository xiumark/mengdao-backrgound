import React from 'react';
import './index.less';
import { Card, Table, Dropdown, Button, Menu, Row, Col, Form, Input, Select } from 'antd';
// import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class GiftPackage extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };
  columns = [
    {
      title: 'playerId',
      dataIndex: 'playerId',
    }, 
    {
      title: 'playerLv',
      dataIndex: 'playerLv',
    }, 
    {
    title: 'playerName',
    dataIndex: 'playerName',
    }, 
    {
      title: 'cityName',
      dataIndex: 'cityName',
    }, 
    {
      title: 'forceId',
      dataIndex: 'forceId',
    }, 
    {
    title: 'vipLv',
    dataIndex: 'vipLv',
    }
  ];
  menu = (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="1">giftType1</Menu.Item>
      <Menu.Item key="2">giftType2</Menu.Item>
      <Menu.Item key="3">giftType3</Menu.Item>
    </Menu>
  );
  getUserData = ()=>{
    let data = [];
    for (let i = 0; i < 12; i++) {
    data.push({
      key: `${i}`,
            playerId: `1900${i}0`,
            playerLv: '18',
            playerName: `jesies${i}`,
            cityName: `幽州${i}0`,
            forceId: '9',
            vipLv: '9',
    });
  }
  return data;
}
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  handleButtonClick=(e)=> {
    // message.info('Click on left button.');
    console.log('click left button', e);
  }
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }
    // const layout
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 4 }
    }
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <Card style={{ marginBottom: 0 }}>
            <Form>
              <Row>
                <Col span={12} offset={0}>
                  <FormItem {...formItemLayout} label="title"><Input placeholder="请输入礼包名称" /></FormItem>
                  <FormItem {...formItemLayout} label="serverId"><Input placeholder="请输入serverId" /></FormItem>
                  <FormItem {...formItemLayout} label="playerName"><Input placeholder="请输入playerName" /></FormItem>
                </Col>
                <Col span={12} offset={0}>
                  <FormItem label="GiftType" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }}>
                        <Select
                          placeholder="请选择礼物类型"
                          onChange={this.handleSelectChange}
                        >
                          {/* <Option value="type">请选择礼物类型</Option> */}
                          <Option value="type1">type1</Option>
                          <Option value="type2">type2</Option>
                        </Select>
                  </FormItem>
                  <FormItem label="GiftContent" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }}>
                        <Select
                          placeholder="请选择礼物内容"
                          onChange={this.handleSelectChange}
                        >
                          {/* <Option value="type">请选择礼物类型</Option> */}
                          <Option value="type1">金币</Option>
                          <Option value="type2">银币</Option>
                        </Select>
                  </FormItem>
                  <FormItem {...formItemLayout} label="duration"><Input placeholder="请输入持续时间" /></FormItem>
                </Col>
              </Row>
              <FormItem {...buttonItemLayout}>
                <Button onClick={this.handleButtonClick} type="primary">提交</Button>
              </FormItem>
            </Form>
          </Card>
          <Button
            type="primary"
            onClick={this.start}
            disabled={!hasSelected}
            loading={loading}
            style = {{marginTop:15}}
          >
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.getUserData()} />
      </div>
    );
  }
}

export default GiftPackage;
