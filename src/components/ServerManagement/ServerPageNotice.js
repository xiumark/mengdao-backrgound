import React from 'react';
import { Card, Form, Select, Button, message, Row, Col, Input, Table, Radio, DatePicker, TimePicker, Popconfirm  } from 'antd';
import './index.less';
const FormItem = Form.Item;
const Option = Select.Option;
import { getServiceList, requestAddUpdateNotice, removeUpdateNotice, getAllUpdateNotice } from '../../api/service';

class ServerPageNotice extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            optionValue:'0',
            isPersonal:false,
            filteredServiceList: [
                {yx:'渠道1', serverId: "1", serverName: "sg_banshu", serverState: 0 },
                {yx:'渠道1', serverId: "2", serverName: "sg_dev", serverState: 0 },
            ],
            yxList:[
                // {yx:'渠道1' ,key:1},
                // {yx:'渠道2' ,key:1},
            ],
            serverId:'',
            timeModeState:1,
            yx:'',
            allUpdateNoticeData: [       //选服页公告信息
                // {"vid": 105,"yx": "aa","startTime": "2019-01-18 05:00:00","content": "3445765"},
                // {"vid": 106,"yx": "aa","startTime": "2019-01-18 05:00:00","content": "3445765"}
            ],
            stateContent:'666'
            
        };

        //模板
        this.initialContent = "第一行默认为标题\n"+
        "[size=24]\n"+
        "\n"+
        "内容默认24号大小\n"+
        "[color=#ff0000]红色文字#ff0000[/color]\n"+
        "[color=#00ff00]绿色文字#00ff00[/color]\n"+
        "[color=#0000ff]蓝色文字#0000ff[/color]\n"+
        "[color=#ffff00]橙色文字#ffff00[/color]\n"+
        "[color=#ff0000][size=40]红色40号文字#ff0000[/size][/color]\n"+
        "普通文字\n"+
        "\n"+
        "——————————————\n"+
        "臉書粉絲團：《我在三國當城主》\n"+
        "Line：wzsgdcz\n"+
        "客服郵箱：guaimaokefu@gmail.com\n"+
        "[/size]\n",

        this.columns = [
            {
                title: '公告ID',
                dataIndex: 'vid',
                key: 'vid',
            },
            {
                title: '渠道',
                dataIndex: 'yx',
                key: 'yx',
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
            },
            {
                title: '公告内容',
                dataIndex: 'content',
                key: 'content',
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key:'handle',
                width: '15%',
                render: (textValue, tableItem) => {
                    return (
                        <Popconfirm title="删除这项活动?" onConfirm={() => this.onDeleteUpdateNotice(textValue, tableItem, 'handle')}>
                          <a href="javascript:;">删除公告</a>
                        </Popconfirm>
                    );
                  },
            },
        ];
        this.onDeleteUpdateNotice = this.onDeleteUpdateNotice.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    componentDidMount() {
        getServiceList((res) => {
            this.getYxList(res);
        })
        this.props.form.setFieldsValue({content: this.initialContent});
        setTimeout(()=>{
            this.openPreview(this.initialContent);
        },500)
        // this.openPreview(this.initialContent);

    }

    checkChange(e){
        this.props.form.setFieldsValue({
            timeMode:e.target.value
          });
        this.setState({timeModeState:e.target.value});   //时间模式
    }

    onYxChange=(value)=>{//渠道列表变换引起服务列表更新
        this.setState({yx:value});
        this.getAllUpdateNotice()

    }

    getYxList=(data)=>{//获取渠道列表
        this.getYxListContentAll(data,(yxList)=>{
         this.setState({yxList:yxList});
        });
     }

    getYxListContentAll=(data,cb)=>{
     //获取渠道列表
        let dataArray = data.map((item,index)=>{
            return item.yx;
        })
        let yxArrayList=[];
        for(let i = 0;i<dataArray.length;i++){
            if(yxArrayList.indexOf(data[i].yx)==-1){//不重复
                yxArrayList.push(data[i].yx);
            }
        }
        let yxList = yxArrayList.map((item, index)=>{
            return {yx:item,key:index}
        });
        yxList.unshift({yx:'全部渠道' ,key:-1})    //添加全部渠道下拉菜单
        cb&&cb(yxList);
    }

    //获取选服页公告
    getAllUpdateNotice=()=>{
        let {yx} = this.state;
        getAllUpdateNotice(yx,(list)=>{
            this.setState({allUpdateNoticeData:list})
        })
    }

    //创建选服页公告
    onAddUpdateNotice = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {yx, startTime,content} = values;
                if(startTime){
                    startTime=startTime.format('YYYY-MM-DD HH:mm:ss');  
                }
                requestAddUpdateNotice(yx, startTime,content,()=>{
                    this.getAllUpdateNotice();//刷新列表
                });  //请求开启活动
            }
        });
    }

     //监听公告变化
    onContentChange=(e)=>{
        e.preventDefault();
        this.setState({stateContent:e.currentTarget.value},()=>{
            this.openPreview(this.state.stateContent);
        })
        // this.onPreviewNotice(e);
    }
    //预览公告
    onPreviewNotice=(e)=>{
        e.preventDefault();
        // let content = this.props.form.getFieldValue('content');
        // this.openPreview(content);

        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {content} = values;
                //设置缓存，打开新界面
                this.openPreview(content);
            }
        });
    }

    //设置缓存，打开新界面
    openPreview=(content)=>{
        // localStorage.SgServerAnnounce = encodeURIComponent(content);
        // // window.open("#/serverManagement/serverPageNotice','preview.html")
        // let url = window.location.href;
        // let split = url.split('index.html#');
        // let newUrl = split[0] + '/preview/index.html';
        // window.open(newUrl);
        // window.open(url)    //新窗口中打开预览界面
        // window.location.href=url   //新窗口中打开预览界面
        try{document.getElementById('sgPreview').contentWindow.flushContent(encodeURIComponent(content))
    }catch(e){
        
    }
    }

    //删除选服页公告
    onDeleteUpdateNotice(event, tableItem, index){
        let vid = tableItem.vid;
        removeUpdateNotice(vid,()=>{
            this.getAllUpdateNotice();//刷新列表
        })
    }

    render() {
        const { yxList, allUpdateNoticeData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
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
                    offset: 9,
                },
            },
        };

        return <div>
            <Card title="新建选服页公告">
                <Form id="requestAddUpdateNotice">
                    <Row>
                        <Col className="gutter-row"  md={12} sm={12} xs={24}>
                            <FormItem {...formItemLayout} label="渠道" >
                                {getFieldDecorator('yx', {
                                    rules: [
                                        { required: false, message: '请选择渠道' },
                                    ],
                                })( 
                                    <Select placeholder="请选择渠道" onChange = {(value)=>this.onYxChange(value)}>
                                        {yxList.map((item, index) => {
                                            return <Option key={index} value={`${item.yx=='全部渠道'?'':item.yx}`}>{item.yx}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="公告生效时间"
                                >
                                {getFieldDecorator('startTime', {
                                    rules: [{ type: 'object', required: false, message: '请选择公告生效时间!' }]})(
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label={"公告内容"} >
                                {getFieldDecorator('content', {
                                    rules: [{ required: true, message: '请输入公告内容' }],
                                })(
                                    <textarea style={{ minHeight: 120, width: "100%" }} onChange = {this.onContentChange} placeholder="请输入公告内容" />
                                )}
                            </FormItem>
                        </Col>
                        <Col className="gutter-row"  md={12} sm={12} xs={24}>
                            {/* 线上 */}
                            <iframe id='sgPreview' style={{border:0,width:"100%",height:630}} src="preview/index.html"/>
                            {/* 本地 */}
                            {/* <iframe id='sgPreview' style={{border:0,width:"100%",height:630}} src="/preview/index.html"/> */}
                        </Col>
                    </Row>
                    <Row>
                        <FormItem {...tailFormItemLayout} >
                            <Button type="primary" htmlType="submit" onClick = {this.onAddUpdateNotice}>创建公告</Button>
                            {/* <Button type="primary"  style={{ marginLeft: 60}} onClick = {this.onPreviewNotice}>预览公告</Button> */}
                        </FormItem>
                    </Row>
                </Form>
            </Card>
            <Card title="选服页公告操作">
                <Button type="primary"  style={{ marginBottom: 20}} onClick = {this.getAllUpdateNotice}>获取选服页公告</Button>
                <Table pagination={{ pageSize: 10 }} columns={this.columns} dataSource={allUpdateNoticeData} size={'small'} />
            </Card>

        </div>;
    }
}
export default Form.create()(ServerPageNotice);
