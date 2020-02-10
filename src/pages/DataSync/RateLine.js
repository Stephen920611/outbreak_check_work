import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import T from './../../utils/T';
import Chart from './../../components/Echarts';

/* eslint react/no-multi-comp:0 */
@connect(({}) => ({}))
export default class RateLine extends PureComponent {
    constructor(props) {
        super(props);
        this.chart = null;
        this.state = {
            height: 300,
        };
    }

    componentWillReceiveProps(nextProps) {
        const {rateLineData,} = nextProps;
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
        let seriesData = [];
        dataSource.map((val) => {
            seriesData.push(val.num);
            xData.push(val.time)
        });
        this.chart.echartsInstance.setOption({
            xAxis: {
                data: xData
            },
            series: [{data: seriesData}]
        });
    };

    //默认数据
    get defaultOption() {
        //x轴-时间
        let date = [];
        //y轴-数据
        let data = [];
        let allData = [];
        allData.map( (val,idx) => {
            data.push(val.num);
            date.push(val.time)
        });
        return {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                show: false,
                left: 'center',
                text: '大数据量面积图',
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
                data: date
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
                    name: '速率数据',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: 'rgb(255, 158, 68)'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)' // 100% 处的颜色
                            }],
                        },
                    },
                    data: data
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

