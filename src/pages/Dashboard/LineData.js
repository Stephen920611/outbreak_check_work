import React, {PureComponent, Fragment} from 'react';
import T from './../../utils/T';
import Chart from './../../components/Echarts';

export default class LineData extends PureComponent {
    constructor(props) {
        super(props);
        this.chart = null;
        this.state = {
            height: 300,
        };
    }

    componentDidMount(){
        this.setOptions(this.props.rateLineData)
    }

    componentWillReceiveProps(nextProps) {
        const {rateLineData} = nextProps;
        if (rateLineData !== this.props.rateLineData) {
            this.setOptions(rateLineData);
        }
    }

    /**
     * 设置配置项
     * @param dataSource
     */
    setOptions = (dataSource) => {
        //x轴数据
        let xData = [];
        //数据列数据
        //数据接入速度
        let messageInData = [];
        //数据接入数据量
        let bytesInData = [];
        //数据分发数据量
        let bytesOutData = [];
        dataSource.map((val) => {
            messageInData.push(val.messagesIn);
            bytesInData.push(val.bytesIn);
            bytesOutData.push(val.bytesOut);
            xData.push(val.time)
        });
        this.chart.echartsInstance.setOption({
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                show: false,
            },
            toolbox: {
                show: false,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            grid: {
                // right: 20,
                // left: 20,
                top: 40,
                // bottom: 20,
                // containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    name: '数据接入速度',
                    type: 'line',
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#128dff'
                    },
                    data: messageInData
                },
                {
                    name: '数据接入数据量',
                    type: 'line',
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#1dbd4c'
                    },
                    data: bytesInData
                },
                {
                    name: '数据分发数据量',
                    type: 'line',
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#975fe5'
                    },
                    data: bytesOutData
                }
            ]
        });
    };

    //默认数据
    get defaultOption() {
        //x轴-时间
        let date = [];
        //y轴-数据
        //数据接入速度
        let messageInData = [];
        //数据接入数据量
        let bytesInData = [];
        //数据分发数据量
        let bytesOutData = [];

        return {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            legend: {
                show: true,
                icon: 'rect',
                itemWidth: 20,
                itemHeight: 4,
                // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                selected: {
                    "数据接入数据量": false,
                    "数据分发数据量": false,
                }
            },
            title: {
                show: false,
            },
            toolbox: {
                show: false,
            },
            grid: {
                right: 50,
                left: 80,
                top: 40,
                // bottom: 20,
                // containLabel: true
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#DBDBDB',
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#C9C9C9',
                    }
                },
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        // 使用深浅的间隔色
                        color: '#ccc',
                        type: 'dashed'
                    }
                },
                axisTick: {
                    show: false
                },
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    name: '数据接入速度',
                    type: 'line',
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#128dff'
                    },
                    data: messageInData
                },
                {
                    name: '数据接入数据量',
                    type: 'line',
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#1dbd4c'
                    },
                    data: bytesInData
                },
                {
                    name: '数据分发数据量',
                    type: 'line',
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#975fe5'
                    },
                    data: bytesOutData
                }
            ]
        }
    }

    render() {
        const {height} = this.state;
        return (
            <div
                ref={container => this.container = container}
                style={{height: '100%', width: '100%'}}
            >
                <Chart
                    ref={chart => this.chart = chart}
                    option={this.defaultOption}
                    extraOption={{height}}
                />
            </div>
        );
    }
}

