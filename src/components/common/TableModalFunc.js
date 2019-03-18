/**
 * Created by maxun on 2011/2/15.
 */
import React,{Component} from 'react';
import { Card, Form, Button, Row, Col, Input, Table, message,Modal } from 'antd';
import { connect } from 'echarts';

/**
 *  弹出具有table表的面板
 *  使用函数的方式
 */ 
const TableModalFunc =({...props})=>{
    return <Modal
        title="已创建用户"
        visible={props.visible}
        onOk={props.onOk}
        onCancel={props.onCancel}
        >
        <Table pagination={props.pagination?props.pagination:'10'} columns={props.columns} dataSource={props.dataSource} size={props.size?props.size:'small'} />
    </Modal>
}


/**
 * 使用redux的情形
 */
// const mapStateToPros = (state,owmProps)=>{
//     pagination:state.pagination;
//     dataSource:state.dataSource;
// }

// // const mapDispatchToProps = (dispatch,ownProps)=>{
// //     return {
// //         onIncreaseClick: () => dispatch(increaseAction),
// //         onClick: (filter) => {
// //             return {
// //                 type: 'SET_VISIBILITY_FILTER',
// //                 filter: filter
// //             }
// //           }
// //     }
// // }

// const mapDispatchToProps= {
//     onClick: (filter) => {
//         type: 'SET_VISIBILITY_FILTER';
//         filter: filter
//       }
// }
// export default connect(mapStateToPros,mapDispatchToProps)(TableModalFunc);

export default TableModalFunc
