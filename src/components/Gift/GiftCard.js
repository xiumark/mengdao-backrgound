import React from 'react';
import { Card, Form, Button, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
import './index.less';
import { generateGiftCode,getGiftCodeContents } from '../../api/service';
/**
 * 礼品卡
 */
class GiftCard extends React.Component {
    state = {
        isPersonal:false,
        vid:'',
        giftCode: [
            // {
            //     // batch:"758",
            //     // canRepeat:true,
            //     // createTime:"2018-04-13 20:33:06",
            //     // expireTime:"2018-04-14 07:52:06",
            //     // giftContent:"sysDiamond:2:1000:1:0:0:0",
            //     // vid:1,
            //     // children: [{
            //     //     batch:"758",
            //     //     canRepeat:true,
            //     //     createTime:"2018-04-13 20:33:06",
            //     //     expireTime:"2018-04-14 07:52:06",
            //     //     giftContent:"sysDiamond:2:1000:1:0:0:0",
            //     //     vid:11,
            //     //   }, {
            //     //     batch:"758",
            //     //     canRepeat:true,
            //     //     createTime:"2018-04-13 20:33:06",
            //     //     expireTime:"2018-04-14 07:52:06",
            //     //     giftContent:"sysDiamond:2:1000:1:0:0:0",
            //     //     vid:12,
            //     //   }],
            // },
        ],
        cardWidth: '',
    }
    componentWillMount() {
        this.getGiftCodeContents();
    }


    onClick = (item)=>{
        this.setState({vidname:item.name,giftVid:item.vid});
        this.props.form.setFieldsValue({
            vidname: item.name,
          });
    }

    /**
     * 生成礼品卡
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['vidname','num'],(err, values) => {
            if (!err) {
                let { vidname, num, scope} = values;
                let {giftName,giftVid} = this.state;
                //生成礼品码
                generateGiftCode(giftVid, num, scope);
            }
        });
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
        getGiftCodeContents((list)=>{
            let { giftCode } = this.state;
            giftCode = list.map((item,index)=>{
                item.canRepeat = item.canRepeat?'可以':'不可';
                item.downloadUrl = item.canDownload?item.downloadUrl:''
                return item;
            });

            let newGiftCode=this.handleBatch(giftCode); //数据处理
            this.setState({ giftCode: newGiftCode }, ()=>{
            })
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { giftCode, cardWidth, isPersonal } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
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
        }, {
            title: '礼品内容',
            dataIndex: 'giftContent',
        }, {
            title: '链接',
            dataIndex: 'downloadUrl',
            render: link => {return link!==''?<a href={link}>{'下载礼品码'}</a>:''}
          }];
        return <div>
            <Card title="">
                <Row>
                    <Col className="gutter-row" md={12} sm={24}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label={"礼品编号"} >
                                {getFieldDecorator('vidname', {
                                    rules: [{ required: true, message: '请输入礼品编号!' }],
                                })(
                                    <Input placeholder="输入礼品编号" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"礼品码数量"} >
                                {getFieldDecorator('num', {
                                    rules: [{ required: true, message: '请输入礼品码数量!' }],
                                })(
                                    <Input placeholder="输入礼品码数量" />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label={"区服范围"} >
                                {getFieldDecorator('scope', {
                                    rules: [{ required: false, message: '请输入区服范围!' }],
                                })(
                                    <Input placeholder="输入区服范围" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} >
                                <Button type="primary" htmlType="submit">创建礼品</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Card>
            <Card title="可添加的礼品列表" id="giftList" style={{ minHeight: 380 }}>
                <Table onRowClick={this.onClick} rowKey="vid" columns={columns} dataSource={giftCode} size="small" />
            </Card>
        </div >;
    }
}

export default Form.create()(GiftCard);
