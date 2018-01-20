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
                                <span>绑定平台用户：</span>
                                <Dropdown.Button onClick={this.handleButtonClick} overlay={menu2}>
                                请选择账号
                                </Dropdown.Button>
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card title="选择运营商权限" bordered={true}>
                                {/* <ModalForm /> */}
                            </Card>
                        </div>
                    </Col>
                </Row>
        </div>;
    }

}

export default User;
