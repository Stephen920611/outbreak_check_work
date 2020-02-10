import React, {PureComponent, Fragment} from 'react';
import T from './../../utils/T';
import Chart from './../../components/Echarts';
import {Divider} from 'antd';
import styles from './Index.less';

export default class LineData extends PureComponent {
    constructor(props) {
        super(props);
        this.chart = null;
        this.state = {
            height: 286,
        };
    }

    componentDidMount(){
        this.setOptions(this.props.pieData,this.props.pieTotal);
    }
    componentWillReceiveProps(nextProps) {
        const {pieData,pieTotal} = nextProps;
        if (pieData !== this.props.pieData) {
            this.setOptions(pieData,pieTotal);
        }
    }
    getArrayValue = (array, key) =>{
        let keys = key || "value";
        let res = [];
        if (array) {
            array.forEach(function(t) {
                res.push(t[keys]);
            });
        }
        return res;
    };
    array2obj = (array,key) => {
        let resObj = {};
        for(let i=0;i<array.length;i++){
            resObj[array[i][key]] = array[i];
        }
        return resObj;
    };

    /**
     * 设置配置项
     * @param dataSource
     */
    setOptions = (dataSource,pieTotal) => {
        let arr = ['middleLost', 0.6, dataSource];
        let arrName = this.getArrayValue(dataSource, "name");

        let objData = this.array2obj(dataSource, "name");

        this.chart.echartsInstance.setOption({
            title: {
                text: '数据源类型',
                subtext: pieTotal,
                textStyle:{
                    fontSize:14,
                    color:"#8c8c8c",
                    lineHeight: 25,
                    fontWeight:'normal',
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#595959',
                    lineHeight: 56,
                },
                textAlign:"center",
                textVerticalAlign:"center",
                x: '30%',
                y: '42%',
            },
            tooltip: {
                trigger: 'item',
                backgroundColor:'rgba(255, 255, 255, 0.9)',
                textStyle:{
                    color: 'rgb(87, 87, 87)',
                },
                extraCssText:'box-shadow:rgb(174, 174, 174) 0px 0px 10px',
                formatter: function(res) {
                    if (res.componentSubType === 'pie') {
                        return '<span class='+ styles.ii +' style="background:' + res.color + ' "></span>' + res.name + ': ' + (res.value * 100 / pieTotal).toFixed(2) + '%';
                    } else {
                        return '<span class='+ styles.ii +' style="background:' + res.color + ' "></span>' + res.name + ': ' + res.data.value;
                    }
                }
            },
            legend: {
                show: true,
                icon:"circle",
                top: "center",
                right: '15%',
                data: arrName,
                width:100,
                padding: [0, 5],
                itemGap: 25,
                formatter: function(name) {
                    // return "{title|" + name + "} {value|" + (objData[name].value) +"} {title|项}"
                    return "{title|" + name + "}{value|" + ' | ' + (objData[name].value * 100 / pieTotal).toFixed(2) + '%' + ' | ' + "}{title|"+  (objData[name].value) +"个}"
                    // return name + ' | ' + (objData[name].value * 100 / pieTotal).toFixed(2) + '%' + '<Divider type="vertical"/>' + (objData[name].value) +"个"
                },
                textStyle: {
                    rich: {
                        title: {
                            fontSize: 14,
                            lineHeight: 8,
                        },
                        value: {
                            fontSize: 13,
                            lineHeight: 15,
                            color: "#888888"
                        }
                    }
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['60%', '78%'],
                    color: ['#1890FF', '#13C2C2','#2FC25B','#8543E0', '#FACC14','#F04864'],
                    center:['30%', '50%'],
                    hoverAnimation: false, ////设置饼图默认的展开样式
                    label:{
                        show:false,
                    },

                    itemStyle: { // 此配置
                        normal: {
                            borderWidth: 2,
                            borderColor: '#fff',
                        },
                        emphasis: {
                            borderWidth: 0,
                            shadowBlur: 2,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    data: arr[2]
                }
            ]
        });
    };

    //默认数据
    get defaultOption() {
        let pieTotal = 0;//总量
        let dataSource = [];
        let arr = ['middleLost', 0.6, dataSource];
        let arrName = this.getArrayValue(dataSource, "name");
        let objData = this.array2obj(dataSource, "name");
        return {
            title: {
                text: '数据源类型',
                subtext: pieTotal,
                textStyle:{
                    fontSize:20,
                    color:"#8c8c8c"
                },
                subtextStyle: {
                    fontSize: 26,
                    color: '#595959',
                    lineHeight: 56,
                },
                textAlign:"center",
                textVerticalAlign:"center",
                x: '30%',
                y: '44%',
            },
            tooltip: {
                trigger: 'item',
                formatter: function(res) {
                    console.log('res',res);
                    if (res.componentSubType === 'pie') {
                        return '<span class="ii" style="background:' + res.color + ' "></span>' + res.name + ': ' + (res.value * 100 / pieTotal).toFixed(2) + '%';
                    } else {
                        return '<span class="ii" style="background:' + res.color + ' "></span>' + res.name + ': ' + res.data.value;
                    }
                }
            },
            legend: {
                show: true,
                icon:"circle",
                top: "center",
                right: '15%',
                data: arrName,
                width:100,
                padding: [0, 5],
                itemGap: 25,
                /*formatter: function(name) {
                    // return "{title|" + name + "}\n{value|" + (objData[name].value) +"}  {title|项}"
                    return "{title|" + name + "}{value|" + ' | ' + (objData[name].value * 100 / pieTotal).toFixed(2) + '%' + ' | ' + (objData[name].value) +"}  {title|个}"
                },*/
                textStyle: {
                    rich: {
                        title: {
                            fontSize: 12,
                            lineHeight: 8,
                        },
                        value: {
                            fontSize: 13,
                            lineHeight: 15,
                            // color: "#fff"
                        }
                    }
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['60%', '78%'],
                    color: ['#1890FF', '#13C2C2','#2FC25B','#8543E0', '#FACC14','#F04864'],
                    center:['30%', '50%'],
                    hoverAnimation: false, ////设置饼图默认的展开样式
                    label:{
                        show:false,
                    },

                    itemStyle: { // 此配置
                        normal: {
                            borderWidth: 2,
                            borderColor: '#fff',
                        },
                        emphasis: {
                            borderWidth: 0,
                            shadowBlur: 2,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    data: arr[2]
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

