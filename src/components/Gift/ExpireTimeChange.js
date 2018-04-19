import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, DatePicker, TimePicker, Popconfirm } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch,apiFetchNomsg } from '../../api/api'
import { constants } from 'zlib';
// import { getServiceList } from '../../api/service'
/**
 * 
 */


const EditableCell = ({ editable, value, onChange }) => (
    <div>
      {editable
        // ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
        ? <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange = {(e)=>onChange(e)}/>
            // <FormItem
            //     {...formItemLayout}
            //     label="过期时间"
            //     >
            //     {getFieldDecorator('expireTime', {
            //         rules: [{ type: 'object', required: true, message: '请选择过期时间!' }]})(
            //         <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            //     )}
            // </FormItem>
        : value
      }
    </div>
  );


class ExpireTimeChange extends React.Component {
    state = {
        vidTochange:'',
        expireTimeTochange:'',
        data:{},   
        isPersonal:false,
        vid:'',
        giftCode: [
            {
                batch:"758",
                canRepeat:true,
                createTime:"2018-04-13 20:33:06",
                expireTime:"2018-04-14 07:52:06",
                giftContent:"sysDiamond:2:1000:1:0:0:0",
                vid:1,
                children: [{
                    batch:"758",
                    canRepeat:true,
                    createTime:"2018-04-13 20:33:06",
                    expireTime:"2018-04-14 07:52:06",
                    giftContent:"sysDiamond:2:1000:1:0:0:0",
                    vid:11,
                  }, {
                    batch:"758",
                    canRepeat:true,
                    createTime:"2018-04-13 20:33:06",
                    expireTime:"2018-04-14 07:52:06",
                    giftContent:"sysDiamond:2:1000:1:0:0:0",
                    vid:12,
                  }],
            },
        ],
        newGiftCode:[],
        cardWidth: '',
    }
    componentWillMount() {
        this.getGiftCodeContents();
    }



    renderColumns=(text, record, column)=> {
        return (
            <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.vid, column)}
            />
        );
    }

    handleChange=(value, key, column)=> {
        value=value.format('YYYY-MM-DD HH:mm:ss');
        const {vidTochange,expireTimeTochange} = this.state;
        this.setState({vidTochange:key,expireTimeTochange:value});
        // this.changeGiftCodeExpireTime(key,value)
    }

    onClick = (item)=>{
        this.setState({vidname:item.name,giftVid:item.vid});
        this.props.form.setFieldsValue({
            vidname: item.name,
          });
    }

    edit=(key)=> {
        const {giftCode} = this.state;
        const target = giftCode.filter(item => key === item.vid)[0];
        if (target) {
          target.editable = true;
          this.setState({ giftCode: giftCode },()=>{
          });
        }
    }

    save=(key)=> {
        const {giftCode, vidTochange, expireTimeTochange} = this.state;
        const target = giftCode.filter(item => key === item.vid)[0];
        if (target) {
            delete target.editable;
            this.setState({ giftCode: giftCode });
        }
        this.changeGiftCodeExpireTime(vidTochange,expireTimeTochange)
    }

    cancel=(key)=> {
        const {giftCode} = this.state;
        const target = giftCode.filter(item => key === item.vid)[0];
        if (target) {
            delete target.editable;
        }
        this.setState({ giftCode: giftCode });
    }

    handleBatch=(data)=>{
        let map = {},  //唯一键值对
        batchArray = [];  //处理后的数组
        for(let i = 0; i < data.length; i++){
            let item = data[i];
            if(!map[item.batch]){
                batchArray.push(item);
                map[item.batch] = item;
            }else{
                for(let j = 0; j < batchArray.length; j++){
                    let batchItem = batchArray[j];
                    if(batchItem.batch == item.batch){
                        if(batchItem.children==undefined){
                            batchItem.children=[];
                        }
                        batchItem.children.push(item);
                        break;   //唯一的batch，后续不需要再执行
                    }
                }
            }
        }
        return batchArray;
    }
    /** 
     * 获取可选礼品列表
     */
    getGiftCodeContents = (e) => {
                let url = "/root/getGiftCodeContents.action"
                let method = 'POST'
                let successmsg = '礼品获取成功'
                let querystring=''
                apiFetch(url, method, querystring, successmsg, (res) => {
                    let { giftCode } = this.state;
                    giftCode = res.data.contentList.map((item,index)=>{
                        item.canRepeat = item.canRepeat?'可以':'不可';
                        item.downloadUrl = item.canDownload?item.downloadUrl:''
                        return item;
                    });

                    let newGiftCode=this.handleBatch(giftCode); //数据处理
                    this.setState({ giftCode: newGiftCode }, ()=>{
                    })
                });
    }

    changeGiftCodeExpireTime=(vid,expireTime)=>{
        const{giftCode} = this.state;
        //vid duration
        let url = "/root/changeGiftCodeExpireTime.action"
            let method = 'POST'
            let successmsg = '过期时间修改成功'
            const querystring =`vid=${vid}&expireTime=${expireTime}`
            apiFetch(url, method, querystring, successmsg, (res) => {
                this.getGiftCodeContents()
            });
    }

    render() {
        const { giftCode } = this.state;
        const columns = [{
            title: '礼品名称',
            dataIndex: 'name',
          }, {
            title: '礼品编号',
            dataIndex: 'vid',
          }, {
            title: '礼品批次',
            dataIndex: 'batch',
        }, {
            title: '是否可重复领取',
            dataIndex: 'canRepeat',
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
        }, {
            title: '过期时间',
            dataIndex: 'expireTime',
            render: (text, record) => this.renderColumns(text, record, 'expireTime')
        },{
            title: '编辑',
            dataIndex: 'operation',
            render: (text, record) => {
              const { editable } = record;
              return (
                <div className="editable-row-operations">
                  {
                    editable ?
                      <span>
                        <a onClick={() => this.save(record.vid)}>保存</a>
                        <a className='cancel' onClick={() => this.cancel(record.vid)}>取消</a>
                      </span>
                      : <a onClick={() => this.edit(record.vid)}>编辑</a>
                  }
                </div>
              );
            },
          },
         {
            title: '礼品内容',
            dataIndex: 'giftContent',
        }, {
            title: '链接',
            dataIndex: 'downloadUrl',
            render: link => {return link!==''?<a href={link}>{'下载礼品码'}</a>:''}
          },
        ];
        return <div>
            <Card title="修改过期时间" id="expireTimeChange" style={{ minHeight: 380 }}>
                <Table rowKey="vid" columns={columns} dataSource={giftCode} size="small" />
            </Card>
        </div >;
    }
}

export default Form.create()(ExpireTimeChange);
