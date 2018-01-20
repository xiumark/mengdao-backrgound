import React from 'react';
import { Card, Form, Tooltip, Cascader, Select, Checkbox, Button } from 'antd';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;
//单选框
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
//下拉菜单
import { Menu, Dropdown, Icon } from 'antd';
import { Row, Col } from 'antd';
const SubMenu = Menu.SubMenu;

import { Input } from 'antd';

import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
/**
 * 测试用
 */
class User extends React.Component {
    state = {
        value1: 1,
        value2: 1
      }
      onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
          value1: e.target.value,
        }, ()=>{console.log("value1:", this.state.value1)});
      }
      onChange2 = (e) =>{
        this.setState({
            value2: e.target.value,
          }, ()=>{console.log("value1:", this.state.value2)});
      }

      onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
      }
      onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
      }
    //   func1 = function handleButtonClick(e) {
    //     message.info('Click on left button.');
    //     console.log('click left button', e);
    //   }
      
    //   func2 = function handleMenuClick(e) {
    //     message.info('Click on menu item.');
    //     console.log('click', e);
    //   }
    // menu = (
    // <Menu>
    //     <Menu.Item>
    //     <a target="_blank" rel="noopener noreferrer" href="#">账号1</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //     <a target="_blank" rel="noopener noreferrer" href="#">账号2</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //     <a target="_blank" rel="noopener noreferrer" href="#">账号3</a>
    //     </Menu.Item>
    // </Menu>
    // );

    render() {
        // const menu = (
        //     <Menu>
        //         <Menu.Item>
        //         <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        //         </Menu.Item>
        //         <Menu.Item>
        //         <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        //         </Menu.Item>
        //         <Menu.Item>
        //         <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
        //         </Menu.Item>
        //     </Menu>
        //     );
        // let {menu} = this.menu;
        const menu = (
            <Menu onClick={handleMenuClick}>
              <Menu.Item key="1">账号1</Menu.Item>
              <Menu.Item key="2">账号2</Menu.Item>
              <Menu.Item key="3">账号3</Menu.Item>
            </Menu>
          );
        const menu2 = (
        <Menu>
            <Menu.Item>1st menu item</Menu.Item>
            <Menu.Item>2nd menu item</Menu.Item>
            <SubMenu title="sub menu">
            <Menu.Item>3rd menu item</Menu.Item>
            <Menu.Item>4th menu item</Menu.Item>
            </SubMenu>
            <SubMenu title="disabled sub menu" disabled>
            <Menu.Item>5d menu item</Menu.Item>
            <Menu.Item>6th menu item</Menu.Item>
            </SubMenu>
        </Menu>
        );
          function handleButtonClick(e) {
            message.info('Click on left button.');
            console.log('click left button', e);
          }
          
          function handleMenuClick(e) {
            message.info('Click on menu item.');
            console.log('click', e);
          }
        return <div>
            {/* <h1 className="testStyle">Hello, User!</h1> */}
                <Card title="平台">
                    <span>是否绑定平台：</span>
                    <RadioGroup onChange={this.onChange} value={this.state.value1}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </RadioGroup>
                    {/* <Dropdown overlay={this.menu}>
                        <a className="ant-dropdown-link" href="#">
                        选择账号 <Icon type="down" />
                        </a>
                    </Dropdown> */}
                    <span>绑定平台用户：</span>
                    <Dropdown.Button onClick={this.handleButtonClick} overlay={menu}>
                    请选择账号
                    </Dropdown.Button>
                </Card>
                <Card title="服务器">
                    <span>所有服务器权限：</span>
                    <RadioGroup onChange={this.onChange2} value={this.state.value2}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </RadioGroup>
                    <Row>
                        <Col className="gutter-row" md={2}>
                        <span>描述：</span>
                        </Col>
                        <Col className="gutter-row" md={22}>
                        <Input placeholder="Basic usage" />
                        </Col>
                    </Row>
                </Card>
                <Row gutter={16}>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card title="选择功能权限" bordered={true}>
                                {/* <HorizontalForm /> */}
                                {/* <span>绑定平台用户：</span>
                                <Dropdown.Button onClick={this.handleButtonClick} overlay={menu2}>
                                请选择账号
                                </Dropdown.Button> */}
                                <Tree
                                    checkable
                                    defaultExpandedKeys={['0-0', '0-1', '0-2']}
                                    defaultSelectedKeys={['0-0-0', '0-0-1']}
                                    defaultCheckedKeys={['0-0', '0-2']}
                                    onSelect={this.onSelect}
                                    onCheck={this.onCheck}
                                >
                                    <TreeNode title="用户管理" key="0-0">
                                        <TreeNode title="用户管理" key="0-0-0"/>
                                    </TreeNode>    
                                    <TreeNode title="运维管理" key="0-1">
                                        <TreeNode title="服务器管理" key="0-1-0" />
                                        <TreeNode title="运营商管理" key="0-1-1" />
                                    </TreeNode>
                                    <TreeNode title="运营管理" key="0-2">
                                        <TreeNode title="报表" key="0-2-0" />
                                        <TreeNode title="月度结算" key="0-2-1" />
                                        <TreeNode title="游戏管理" key="0-2-2" />
                                        <TreeNode title="礼品管理" key="0-2-3" />
                                    </TreeNode>
                                </Tree>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card title="选择运营商权限" bordered={true}>
                                {/* <ModalForm /> */}
                                <Tree
                                    checkable
                                    defaultExpandedKeys={['0-0', '0-1', '0-2']}
                                    defaultSelectedKeys={['0-0-0', '0-0-1']}
                                    defaultCheckedKeys={['0-0', '0-2']}
                                    onSelect={this.onSelect}
                                    onCheck={this.onCheck}
                                >
                                    <TreeNode title="运营商名称" key="0-0" >
                                        <TreeNode title="傲世堂" key="0-0-0" />
                                        <TreeNode title="37" key="0-0-1" />
                                        <TreeNode title="5599" key="0-0-2" />
                                        <TreeNode title="602游戏" key="0-0-3" />
                                        <TreeNode title="起点" key="0-0-4" />
                                        <TreeNode title="贪玩游戏" key="0-0-5" />
                                        <TreeNode title="酷我" key="0-0-6" />
                                        <TreeNode title="酷狗" key="0-0-7" />
                                        <TreeNode title="好豆游戏" key="0-0-8" />
                                    </TreeNode>
                                </Tree>
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Button type="primary" style={{ float: "right",marginRight:'0px',marginTop:'10px' }}>提交</Button>
        </div>;
    }

}

export default User;
