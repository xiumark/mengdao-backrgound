import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import './index.less';
import { apiFetch } from '../../api/api'
import { constants } from 'zlib';
// import { getServiceList } from '../../api/service'
/**
 * 测试用
 */
class GiftCard extends React.Component {
    state = {
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
            },
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
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { vidname, num, scope} = values;
                let {giftName,giftVid} = this.state;
                let querystring = `vid=${giftVid}&num=${num}&scope=${scope}`
                let url = "/root/generateGiftCode.action"
                let method = 'POST'
                let successmsg = '成功生成礼品码'
                apiFetch(url, method, querystring, successmsg, (res) => {
                    // let { giftCode } = this.state;
                    // giftCode = res.data.giftCode.split(";");
                    // this.setState({ giftCode: giftCode })
                })
            }
        });
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
                    this.setState({ giftCode: giftCode }, ()=>{
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
                <Table onRowClick={this.onClick} rowKey="batch" columns={columns} dataSource={giftCode} size="small" />
            </Card>
        </div >;
    }
}

export default Form.create()(GiftCard);
