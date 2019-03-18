import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { getServiceList, getYxList, getAuthList, handleAuthGroup,AuthManageType,getAuthGroupList } from '../../api/service';

import CommonFormCanconfig from '../common/CommonFormCanconfig';    //通用的组件

const buttonStyle = {
    margin: '10px',
    marginLeft:'0px',
    width: '40px',
  };
const buttonAddStyle = {
    margin: '10px',
    marginLeft:'0px',
    width: '80px',
};
const pStyle={
    paddingTop: '6px',
}

const flex = {
    display:"flex",
}

const EditableCell = ({ editable, value, onChange, onClick}) => (
    <div style={flex}>
        {/* <button id="decrece" style={buttonStyle} onClick = {e =>onClick(e)}>-</button> */}
        {/* <Input style={{ margin: '7px 7px 7px -4px',textAlign:'center' }} value={value} onChange={e => onChange(e)}/> */}
        {/* <button id="increce" style={buttonStyle} onClick = {e =>onClick(e)}>+</button> */}
        <button id="add" style={buttonAddStyle} onClick = {e =>onClick(e)}>添加</button>
    </div>
  );


class ComponentTest extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
        };
        this.configData = {         //配置的数据
            
        }
    }

    componentDidMount() {

    }

    onRdioClick = (e)=>{

    }

    onButtonClick = (e)=>{

    }
    


    render() {
        return <div>
            {/* <CommonFormCanconf
                [ig configData = {this.configData}/> */}
            <CommonFormCanconfig></CommonFormCanconfig>
        </div >;
    }
}

export default Form.create()(ComponentTest);