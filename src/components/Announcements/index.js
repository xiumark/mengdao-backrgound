import React from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import './index.less';

class Announcements extends React.Component {
    onChange = (e)=>{
        console.log("key:",e.target.value)
    }
    render() {
        
        return <div className="card-container" onChange = {(e) => this.onChange(e)}>
                <Tabs type="card">
                    <TabPane tab="系统公告" key="1">
                    <p>这里是系统公告这里是系统公告这里是系统公告这里是系统公告</p>
                    <p>这里是系统公告这里是系统公告这里是系统公告这里是系统公告</p>
                    <p>这里是系统公告这里是系统公告这里是系统公告这里是系统公告</p>

                    </TabPane>
                    <TabPane tab="新服公告" key="2">
                    <p>这里是新服公告这里是新服公告这里是新服公告这里是新服公告</p>
                    <p>这里是新服公告这里是新服公告这里是新服公告这里是新服公告</p>
                    <p>这里是新服公告这里是新服公告这里是新服公告这里是新服公告</p>
                    </TabPane>
                    <TabPane tab="其他公告" key="3">
                    <p>这里是其他公告这里是其他公告这里是其他公告这里是其他公告</p>
                    <p>这里是其他公告这里是其他公告这里是其他公告这里是其他公告</p>
                    <p>这里是其他公告这里是其他公告这里是其他公告这里是其他公告</p>
                    </TabPane>
                </Tabs>
            </div>
            }
}

export default Announcements;