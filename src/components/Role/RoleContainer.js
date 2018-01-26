import React from 'react';
import './index.less';
import { Card, Table, Dropdown, Button, Menu, Row, Col, Form, Input, Select } from 'antd';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
// import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
class RoleContainer extends React.Component {
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
  getUserData = () => {
    let data = [];
    for (let i = 0; i < 5; i++) {
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
  handleButtonClick = (e) => {
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
      wrapperCol: { span: 14 },
      style:{ marginBottom: 15 }
    }
    // const layout
    const buttonItemLayout = {
      wrapperCol: { span: 16, offset: 16 }
    }
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          {/* <Card style={{ marginBottom: 0 }}> */}
          <Form>
            <Row>
              <Col span={12} offset={0}>
                <Card title="玩家查询" className="card-container">
                  <FormItem {...formItemLayout} label="serverId"><Input placeholder="请输入serverId" /></FormItem>
                  <FormItem {...formItemLayout} label="playerName"><Input placeholder="请输入playerName" /></FormItem>
                  <FormItem {...buttonItemLayout}>
                    <Button onClick={this.handleButtonClick} type="primary">查询</Button>
                  </FormItem>
                  <span>查询成功！/查询失败！</span>
                </Card>
              </Col>
              <Col span={12} offset={0}>
                <Card title="操作" className="card-container" onChange={(e) => this.onChange(e)}>
                  <Tabs type="card" className="">
                      <TabPane tab="禁言" key="1">
                        <FormItem {...formItemLayout} label="serverId"><Input placeholder="请输入serverId" /></FormItem>
                        <FormItem {...formItemLayout} label="playerName"><Input placeholder="请输入playerName" /></FormItem>
                        <FormItem {...formItemLayout} label="禁言原因"><Input placeholder="请输入禁言原因" /></FormItem>
                        <FormItem {...formItemLayout} label="禁言时间"><Input placeholder="请输入禁言时间" /></FormItem>
                        <FormItem {...buttonItemLayout}>
                          <Button onClick={this.handleButtonClick} type="primary">确认</Button>
                        </FormItem>
                      </TabPane>
                      <TabPane tab="解除禁言" key="2">
                        <FormItem {...formItemLayout} label="serverId"><Input placeholder="请输入serverId" /></FormItem>
                        <FormItem {...formItemLayout} label="playerName"><Input placeholder="请输入playerName" /></FormItem>
                        <FormItem {...buttonItemLayout}>
                          <Button onClick={this.handleButtonClick} type="primary">确认</Button>
                        </FormItem>
                      </TabPane>
                      <TabPane tab="封禁角色" key="3">
                        <FormItem {...formItemLayout} label="serverId"><Input placeholder="请输入serverId" /></FormItem>
                        <FormItem {...formItemLayout} label="playerName"><Input placeholder="请输入playerName" /></FormItem>
                        <FormItem {...formItemLayout} label="封禁原因"><Input placeholder="请输入封禁原因" /></FormItem>
                        <FormItem {...formItemLayout} label="封禁时间"><Input placeholder="请输入封禁时间" /></FormItem>
                        <FormItem {...buttonItemLayout}>
                          <Button onClick={this.handleButtonClick} type="primary">确认</Button>
                        </FormItem>
                      </TabPane>
                      <TabPane tab="解禁角色" key="4">
                        <FormItem {...formItemLayout} label="serverId"><Input placeholder="请输入serverId" /></FormItem>
                        <FormItem {...formItemLayout} label="playerName"><Input placeholder="请输入playerName" /></FormItem>
                        <FormItem {...buttonItemLayout}>
                          <Button onClick={this.handleButtonClick} type="primary">确认</Button>
                        </FormItem>
                      </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
          </Form>
          {/* </Card> */}

          {/* <Button
            type="primary"
            onClick={this.start}
            disabled={!hasSelected}
            loading={loading}
            style = {{marginTop:12}}
          >
            Reload
          </Button> */}
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选中 ${selectedRowKeys.length} 项` : ''}
          </span>
        </div>
        <Card title="查询结果">
          <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.getUserData()} />
        </Card>
      </div>
    );
  }
}

export default RoleContainer;
