import React from 'react';
import './index.less';
import { Card } from 'antd';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';

class EditableCell extends React.Component {//可编辑的单元格
    state = {
      value: this.props.value,
      editable: false,
    }
    handleChange = (e) => {
      const value = e.target.value;
      this.setState({ value });
    }
    check = () => {
      this.setState({ editable: false });
      if (this.props.onChange) {
        this.props.onChange(this.state.value);
      }
    }
    edit = () => {
      this.setState({ editable: true });
    }
    render() {
      const { value, editable } = this.state;
      return (
        <div className="editable-cell">
          {
            editable ?
              <div className="editable-cell-input-wrapper">
                <Input
                  value={value}
                  onChange={this.handleChange}
                  onPressEnter={this.check}
                />
                <Icon
                  type="check"
                  className="editable-cell-icon-check"
                  onClick={this.check}
                />
              </div>
              :
              <div className="editable-cell-text-wrapper">
                {value || ' '}
                <Icon
                  type="edit"
                  className="editable-cell-icon"
                  onClick={this.edit}
                />
              </div>
          }
        </div>
      );
    }
  } 








class RoleContainer extends React.Component {//表格
    constructor(props) {
        super(props);
        this.columns = [
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
        //   width: '20%',
          // render: (text, record) => (
          //   <EditableCell
          //     value={text}
          //     onChange={this.onCellChange(record.key, 'name')}
          //   />
          // ),
        }, 
        {
            title: 'cityName',
            dataIndex: 'cityName',
        }, {
            title: 'forceId',
            dataIndex: 'forceId',
        }, {
          title: 'vipLv',
          dataIndex: 'vipLv',
        }, {
          title: '删除',
          dataIndex: 'delete',
          render: (text, record) => {
            return (
              this.state.dataSource.length > 1 ?
              (
                <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(record.key)}>
                  <a href="#">删除</a>
                </Popconfirm>
              ) : null
            );
          },
        }, {
            title: '禁言',
            dataIndex: 'wordBan',
            render: (text, record) => {
              return (
                this.state.dataSource.length > 1 ?
                (
                  <Popconfirm title="确认禁言?" onConfirm={() => this.onWordBan(record.key)}>
                    <a href="#">禁言</a>
                  </Popconfirm>
                ) : null
              );
            },
          }, {
            title: '解除禁言',
            dataIndex: 'liftWordBan',
            render: (text, record) => {
              return (
                this.state.dataSource.length > 1 ?
                (
                  <Popconfirm title="确认解除禁言?" onConfirm={() => this.onLiftWordBan(record.key)}>
                    <a href="#">解除禁言</a>
                  </Popconfirm>
                ) : null
              );
            },
          }, {
            title: '封禁角色',
            dataIndex: 'roleBan',
            render: (text, record) => {
              return (
                this.state.dataSource.length > 1 ?
                (
                  <Popconfirm title="确认封禁角色?" onConfirm={() => this.onRoledBan(record.key)}>
                    <a href="#">封禁角色</a>
                  </Popconfirm>
                ) : null
              );
            },
          }, {
            title: '解禁角色',
            dataIndex: 'liftRoleBan',
            render: (text, record) => {
              return (
                this.state.dataSource.length > 1 ?
                (
                  <Popconfirm title="确认解禁角色?" onConfirm={() => this.onLiftRoledBan(record.key)}>
                    <a href="#">解禁角色</a>
                  </Popconfirm>
                ) : null
              );
            },
          }
    ];
    
        this.state = {
          dataSource: [{
            key: '0',
            playerId: '19001',
            playerLv: '18',
            playerName: 'jesies',
            cityName: '幽州',
            forceId: '9',
            vipLv: '9',
          }, {
            key: '1',
            playerId: '19002',
            playerLv: '18',
            playerName: '耶稣',
            cityName: '良州',
            forceId: '9',
            vipLv: '9',
          }, {
            key: '2',
            playerId: '19003',
            playerLv: '18',
            playerName: '如来',
            cityName: '苏州',
            forceId: '9',
            vipLv: '12',
          }, {
            key: '3',
            playerId: '19004',
            playerLv: '18',
            playerName: '神奇女侠',
            cityName: '良州',
            forceId: '6',
            vipLv: '6',
          }
        ],
          count: 4,
        };
      }
      onCellChange = (key, dataIndex) => {
        return (value) => {
          const dataSource = [...this.state.dataSource];
          const target = dataSource.find(item => item.key === key);
          if (target) {
            target[dataIndex] = value;
            this.setState({ dataSource });
          }
        };
      }
      onDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
      }


      onWordBan = () =>{//禁言

      }

      onLiftWordBan = () => {//解禁

      }

      onRoledBan = () => {//角色封禁

      }

      onLiftRoledBan = () => {//角色解禁

      }
  


      handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: `10${count}`,
            playerId: `2018${count}`,
            playerLv: '18',
            playerName: `新增玩家 ${count}`,
            cityName: '良州',
            forceId: '9',
            vipLv: '9',
        };
        this.setState({
          dataSource: [...dataSource, newData],
          count: count + 1,
        });
      }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return <div>
                <Card title="玩家查询"></Card>
                <Card title="玩家列表">
                <Button className="editable-add-btn" onClick={this.handleAdd}>添加角色</Button>
                <Table bordered dataSource={dataSource} columns={columns} />
                </Card>
        </div>;
    }
}

export default RoleContainer;




