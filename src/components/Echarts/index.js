/**
 * Created by stephen on 2018/02/19
 */
import PropTypes from 'prop-types';
import echarts from 'echarts';
import debounce from 'lodash/debounce';
import React, {PureComponent, Fragment} from 'react';

export default class Chart extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        theme: PropTypes.string,
        style: PropTypes.object,
        extraOption: PropTypes.object,
        option: PropTypes.object.isRequired,
    };

    constructor() {
        super();
        this.chart = null;
        this.chartContainer = null;
    }

    get echartsInstance() {
        return this.chart;
    }

    componentDidMount() {
        const self = this;
        self.chart = echarts.init(self.chartContainer, self.props.theme || '', Object.assign({
            height: 300,
            width: 'auto',
        }, self.props.extraOption));
        self.chart.setOption(self.props.option);
        window.addEventListener('resize', debounce(() => {
            self.chart.resize();
        }, 300));
    }

    componentWillReceiveProps(nextProps) {
        //不传width 是undefined，但是不耽误
        if(nextProps.extraOption.height !== this.props.extraOption.height || nextProps.extraOption.width !== this.props.extraOption.width){
            this.chart.resize({
                height: nextProps.extraOption.height,
                width: nextProps.extraOption.width
            });
        }
    }

    render() {
        return (
            <div
                style={this.props.style}
                className={this.props.className}
                ref={chartContainer => this.chartContainer = chartContainer}
            />
        );
    }
}
