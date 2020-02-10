import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import T from './../../utils/T';
import Chart from './../../components/Echarts';

/* eslint react/no-multi-comp:0 */
@connect(({}) => ({}))
class AddDataLine extends PureComponent {
    constructor(props) {
        super(props);
        this.chart = null;
        this.state = {
            optionData: {
                dataSource: [],//数据
                yTime: [],//x轴时间数据
            },
        };
    }


    componentWillReceiveProps(nextProps) {
        const {showDataModal} = nextProps;
        // console.log('showDataModal', showDataModal);
        // 更新图表数据
        this.setOptions(showDataModal);
        this.setState({
            optionState:false
        })
    }

    setOptions = (data) => {
        const {fakeData, type, minutesValue} = data;
        const {optionData} = this.state;
        const {dataSource, yTime} = optionData;
        let updateData = '';
        //根据type,来添加更新的数据
        switch (type) {
            case 'MessagesInPerSec':
                updateData = fakeData.hasOwnProperty('rate') ? fakeData.rate[0].data : {};
                break;
            case 'BytesInPerSec':
                updateData = fakeData.hasOwnProperty('rate') ? fakeData.rate[1].data : {};
                break;
            case 'BytesOutPerSec':
                updateData = fakeData.hasOwnProperty('rate') ? fakeData.rate[2].data : {};
                break;
        }

        /* let sortData = T.lodash.sortBy(gtOneHundredMillion, function (o) {
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
         });*/
        //判断数据是否为七条
        if (dataSource.length >= 7 && updateData) {
            dataSource.shift();
            yTime.shift();
        }
        //追加数据
        dataSource.push(updateData[minutesValue]);
        yTime.push(T.helper.dateFormat(fakeData.time));

        this.chart.echartsInstance.setOption({
            xAxis: {
                data: yTime
            },
            yAxis: {
                // max: _.max(values)
                type: 'value',
                name: type == 'MessagesInPerSec' ? '(单位：行)' : '(单位：字节)',
            },
            // series: [{data: dataSource}]
            series: [{
                name: type,
                type: 'line',
                data: dataSource
            },]
        });
    };

    get defaultOption() {
        return {
            color: ["#4E9D8E"],
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: false,
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: []
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#DDD'
                    }
                },
                nameGap: 15,
                nameLocation: "end",
                nameTextStyle: {
                    padding: [0, 0, 10, -30],
                },
                name: "",
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
            },
        }
    }

    render() {
        const {optionData} = this.state;
        const {optionState} = optionData;
        return (
            <div
                loading = {optionState}
                // className={}
            >
                <div
                    ref={container => this.container = container}
                >
                    <Chart
                        ref={chart => this.chart = chart}
                        option={this.defaultOption}
                        extraOption={{height: 300}}
                    />
                </div>
            </div>
        );
    }
}

export default AddDataLine;
