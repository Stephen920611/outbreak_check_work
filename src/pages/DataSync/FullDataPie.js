import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import T from './../../utils/T';
import Chart from './../../components/Echarts';

/* eslint react/no-multi-comp:0 */
@connect(({}) => ({
}))
class FullData extends PureComponent {
    constructor(props) {
        super(props);
        this.chart = null;
        this.state = {
            height: 80,
            width: 200,
        };
    }

    componentWillReceiveProps(nextProps) {
    }

    setOptions = (gtOneHundredMillion) => {

        let sortData = T.lodash.sortBy(gtOneHundredMillion, function (o) {
            return -o.cnt
        });
        const dataSource = sortData.map((val) => ({
            value: val.cnt,
            name: EnumCodeToProvinceMap['00' + val.report_prov]
        }));
        const values = sortData.map((val) => val.cnt);
        const province = [];
        sortData.map((val) => {
            if (EnumCodeToProvinceMap['00' + val.report_prov]) province.push(EnumCodeToProvinceMap['00' + val.report_prov]);
        });
        this.chart.echartsInstance.setOption({
            // grid:{
            //     width: 32 * dataSource.length
            // },
            xAxis: {
                data: province
            },
            yAxis: {
                max: _.max(values)
            },
            series: [{data: dataSource}]
        });
    };

    get defaultOption() {
        return {
            title: {
                text: '55%',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#0580f2',
                    fontSize: '16'
                }
            },
            color: ['rgba(176, 212, 251, 1)'],
            legend: {
                show: false,
            },
            series: [{
                name: 'Line 1',
                type: 'pie',
                clockWise: true,
                radius: ['70%', '90%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false,
                data: [{
                    value: 55,
                    name: '01',
                    itemStyle: {
                        normal: {
                            color: { // 完成的圆环的颜色
                                colorStops: [{
                                    offset: 0,
                                    color: '#00cefc' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#367bec' // 100% 处的颜色
                                }]
                            },
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }, {
                    name: '02',
                    value: 45
                }]
            }]
        }
    }

    render() {
        const {width, height} = this.state;
        return (
            <div
                // className={}
            >
                <div
                    ref={container => this.container = container}
                >
                    <Chart
                        ref={chart => this.chart = chart}
                        option={this.defaultOption}
                        extraOption={{height, width}}
                    />
                </div>
            </div>
        );
    }
}

export default FullData;
