import React, { Component } from 'react';

import echarts from 'echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class LineArea extends Component {
  constructor(props) {
    console.log(":here")
    super(props);
    this.renderChart = this.renderChart.bind(this);
  }

  componentDidMount() {
    this.renderChart()
  }
  componentDidUpdate() {
    this.renderChart()
  }
  renderChart() {
    const { data } = this.props;
    console.log("onLineNumData:", data);
    let datax = [];
    let datay = [];
    for(let i=0;i<data.length;i++){
      datax.push(data[i].time);
      datay.push(data[i].onlineNum);
    }
    console.log("datax:", datax);
    console.log("datay:", datay);
    // let option = {
    //   toolbox: {
    //     show: false,
    //     feature: {
    //       dataZoom: {
    //         yAxisIndex: 'none'
    //       },
    //       dataView: { readOnly: false },
    //       magicType: { type: ['line', 'bar'] },
    //       restore: {},
    //       saveAsImage: {}
    //     }
    //   },
    //   grid: {
    //     top: 25,
    //     left: 20,
    //     bottom: 30,
    //     right: 10
    //   },
    //   xAxis: {
    //     type: 'category',
    //     boundaryGap: false,
    //     data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    //     // data: dataX,
    //     axisTick: {
    //       show: true,
    //       length: 0,
    //       interval: 0
    //     },
    //     axisLabel: {
    //       formatter: '{value}月',
    //       fontSize: 16,
    //       color: 'rgb(100,100,100)',
    //       fontWeight: 500,
    //       interval: 0 //显示标签的数量，0强制显示所有，如果不设置，则默认适合为主
    //     }
    //   },
    //   yAxis: {
    //     show: true,
    //     type: 'value',
    //     axisLine: {
    //       show: false
    //     },
    //     axisTick: {
    //       show: false
    //     },
    //     axisLabel: {
    //       show: false
    //     },
    //     splitLine: {
    //       show: true,
    //       lineStyle: {
    //         color: 'rgb(50,50,50)'
    //       }
    //     }
    //   },
    //   series: [
    //     {
    //       name: '最高气温',
    //       type: 'line',
    //       areaStyle: {
    //         color: 'rgb(44,52,75)'
    //       },
    //       lineStyle: {
    //         color: 'rgb(72,102,252)',
    //         type: 'solid',
    //         width: 4
    //       },
    //       data: [18, 11, 19, 13, 16, 10, 11, 23, 12, 12, 19, 20],
    //       // data: dataY,
    //       symbolSize: '0',
    //       smooth: true,
    //       markPoint: {
    //         data: [
    //           { type: 'max', name: '最大值' },
    //           { type: 'min', name: '最小值' }
    //         ],
    //         symbol: 'pin',
    //         symbolSize: [100, 35],
    //         symbolOffset: [0, 0],
    //         itemStyle: {
    //           color: 'rgb(56,73,151)'
    //         },
    //         label: {
    //           formatter: function (param) {
    //             return `${param.data.value}kWh`;
    //           }
    //         }
    //       }
    //     }
    //   ]
    // };


    let option = {
      title: {
          text: '在线人数统计',
          left: '50%',
          textAlign: 'center'
      },
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              lineStyle: {
                  color: '#ddd'
              }
          },
          backgroundColor: 'rgba(255,255,255,1)',
          padding: [5, 10],
          textStyle: {
              color: '#7588E4',
          },
          extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
      },
      // legend: {
      //     right: 20,
      //     orient: 'vertical',
      //     data: ['今日','昨日']
      // },
      xAxis: {
          type: 'category',
          // data: ["2018-04-19 02:05:00", "2018-04-19 02:10:00", "2018-04-19 02:15:00", "2018-04-19 02:20:00", "2018-04-19 02:25:00", "2018-04-19 02:30:00", "2018-04-19 02:35:00", "2018-04-19 02:40:00", "2018-04-19 02:45:00", "2018-04-19 02:50:00", "2018-04-19 02:55:00", "2018-04-19 03:00:00",],
          data: datax,
          boundaryGap: false,
          splitLine: {
              show: true,
              interval: 'auto',
              lineStyle: {
                  color: ['#D4DFF5']
              }
          },
          axisTick: {
              show: false
          },
          axisLine: {
              lineStyle: {
                  color: '#609ee9'
              }
          },
          axisLabel: {
              margin: 10,
              textStyle: {
                  fontSize: 14
              }
          }
      },
      yAxis: {
          type: 'value',
          splitLine: {
              lineStyle: {
                  color: ['#D4DFF5']
              }
          },
          axisTick: {
              show: false
          },
          axisLine: {
              lineStyle: {
                  color: '#609ee9'
              }
          },
          axisLabel: {
              margin: 10,
              textStyle: {
                  fontSize: 14
              }
          }
      },
      series: [
      //   {
      //     name: '今日',
      //     type: 'line',
      //     smooth: true,
      //     showSymbol: false,
      //     symbol: 'circle',
      //     symbolSize: 6,
      //     data: ['1200', '1400', '1008', '1411', '1026', '1288', '1300', '800', '1100', '1000', '1118', '1322'],
      //     areaStyle: {
      //         normal: {
      //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      //                 offset: 0,
      //                 color: 'rgba(199, 237, 250,0.5)'
      //             }, {
      //                 offset: 1,
      //                 color: 'rgba(199, 237, 250,0.2)'
      //             }], false)
      //         }
      //     },
      //     itemStyle: {
      //         normal: {
      //             color: '#f7b851'
      //         }
      //     },
      //     lineStyle: {
      //         normal: {
      //             width: 3
      //         }
      //     }
      // }, 
      {
          name: '在线人数',
          type: 'line',
          smooth: true,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 2,
          // data: ['1200', '1400', '808', '811', '626', '488', '1600', '1100', '500', '300', '1998', '822'],
          data: datay,
          areaStyle: {
              normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(216, 244, 247,1)'
                  }, {
                      offset: 1,
                      color: 'rgba(216, 244, 247,1)'
                  }], false)
              }
          },
          itemStyle: {
              normal: {
                  color: '#58c8da'
              }
          },
          lineStyle: {
              normal: {
                  width: 3
              }
          }
      }]
  };


    const myChart = echarts.init(document.getElementById(`${this.props.id}`));
    myChart.setOption(option);
  }
  render() {
    const style = {
      width: '100%',
      height: '400px'
    };
    const { id, showLabel1, showLabel2 } = this.props;
    return (
      <div id={id} style={style}>
      </div>
    );
  }
}
