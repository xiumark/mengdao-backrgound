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
class DeleteUser extends React.Component {
    state = {
        value1: 1,
        value2: 1,
        
      }


      onSelect = (selectedKeys, info) => {
        // console.log('selected', selectedKeys, info);
      }
      submit = () =>{
        //   this.setState({})
      }

    render() {
        const menu = (
            <Menu onClick={handleMenuClick}>
              <Menu.Item key="1">账号1</Menu.Item>
              <Menu.Item key="2">账号2</Menu.Item>
              <Menu.Item key="3">账号3</Menu.Item>
            </Menu>
          );
          function handleButtonClick(e) {
            message.info('Click on left button.');
            // console.log('click left button', e);
          }
          
          function handleMenuClick(e) {
            message.info('Click on menu item.');
            // console.log('click', e);
          }
        return <div>

                <Card title="选择用户">
                    <span>请选择要删除的用户：</span>
                    <Dropdown.Button onClick={this.handleButtonClick} overlay={menu}>
                    请选择账号
                    </Dropdown.Button>
                    <Button type="primary" onClick = {this.submit} style={{ float: "right",marginRight:'0px',marginTop:'10px' }}>删除用户</Button>
                </Card>
        </div>;
    }
}

export default DeleteUser;
