const c = {
    IMAGE_URL: './img/'
};

var App = function(){
    this.init();
};

App.prototype = {
    init: function(){
        this.bindEvents();
        this.addChart();
    },
    
    bindEvents: function(){
        $('.button-list').on('click', 'button', this.togglePanel.bind(this));
    },
    
    togglePanel: function(e){
        e.preventDefault();
        
        var $panel = $('#' + e.currentTarget.getAttribute('data-target'));
        var $panels = $('.panel');
        var $target = $panel.find('.highchart');
        
        this.addChart($target);
        
        $panels.removeClass('active');
        $panel.addClass('active');
    },
    
    addChart: function($target) {
        var $target = ($target instanceof jQuery) ? $target : $('.highchart');

        var add = function(){
            var $this = $(this);
            var scrollable = !!$this.data('scrollable');
            var animationTime = $this.data('animation-time');
            var title = $this.data('title') || $this.attr('title') || '';
            var dataX = $this.data('x');
            var dataY = $this.data('y');
            var cols = dataX.length-1 || $this.data('cols') || 3;
            var target = $this.data('target');
            var unit = $this.data('unit') || '';
            var type = $this.data('type');
            var max = $this.data('max') || (!!target) ? Math.max.apply(null, dataY.concat(target)) : Math.max.apply(null, dataY);

            if (dataX === void 0 || dataX.length === 0) throw 'data-x attribute must exist and contain data';
            if (dataY === void 0 || dataY.length === 0) throw 'data-y attribute must exist and contain data';

            if (cols === void 0) cols = 4;
            if (animationTime === void 0) animationTime = 400;

            var opts = {
                chart: { type: 'column' },
                tooltip: {
                    formatter: function() {
                        return this.x + ': ' + this.y + unit;
                    }
                },
                credits: { enabled: false },
                exporting: { enabled: false },

                // GRAPH VARIABLES
                title: {
                    text: title
                },
                xAxis: {
                    categories: dataX,
                    min: 0,
                    max: cols,
                    labels: {
                        style: {
                            color: '#000000'
                        }
                    }
                },
                yAxis: {
                    title: { text: null },
                    max: max,
                    labels: {
                        format: '{value} ' + unit,
                    },
                    plotLines: [{
                        value: [target],
                        zIndex: 5,
                        color: 'rgb(67, 67, 72)',
                        width: 1,
                        dashStyle: 'Dash',
                        label: {
                           text: 'Target'
                        }
                    },{ 
                        value: 0,
                        zIndex: 10,
                        color: '#343437',
                        width: 1
                    }]
                },
                series: [{
                    name: 'Funds',
                    showInLegend: false,
                    data: dataY,
                    colorByPoint: true,
                    color: '#88c634',
                    colors: ['#82bbad','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634','#88c634'],
                    borderRadiusTopLeft: 2,
                    borderRadiusTopRight: 2,
                    animation: {
                        duration: animationTime
                    }
                }, {
                    name: 'Target',
                    showInLegend: false,
                    data: [target],
                    visible: false
                }]
            };

            var postRender = function (chart) {
                if (target === void 0) return;
        
                // Get width of chart
                var plotRight;
                var setPlotRight = function(){
                    plotRight = $this.width() - 20;
                }();
                $(window).resize(setPlotRight);

                var plotlinePixels = chart.yAxis[0].toPixels(chart.yAxis[0].plotLinesAndBands[0].options.value);
                var zeroY = chart.yAxis[0].toPixels(0);

                var createIndicator = function(){
                    // Create text box
                    var point = chart.series[1].points[0];
                    var text = chart.renderer.text(target, 14, plotlinePixels + 4).attr({
                        zIndex: 51,
                    }).css({
                        color: '#ffffff'
                    }).add();
                    var box = text.getBBox();

                    // Add text box
                    chart.renderer.rect(box.x - 5, plotlinePixels - 13, box.width + 10, 25, 5)
                    .attr({
                        fill: 'rgb(52, 52, 55)',
                        stroke: 'rgb(52, 52, 55)',
                        'stroke-width': 0,
                        r: 2,
                        zIndex: 50
                    })
                    .add();

                    // Add text box pointer
                    chart.renderer.image(c.IMAGE_URL + 'chart/total_pointer.svg', box.x + box.width + 4, plotlinePixels - 13, 11, 25)
                    .add();
                };

                if (type === 'contributions') {
                    createIndicator();

                    chart.renderer.image(c.IMAGE_URL + 'chart/too_little_lower.svg', plotRight, zeroY - 604, 16, 600)
                    .attr({
                        zIndex: 4
                    })
                    .add();

                    chart.renderer.image(c.IMAGE_URL + 'chart/too_little_upper.svg', plotRight, plotlinePixels - 406, 16, 415)
                    .attr({
                        zIndex: 4
                    })
                    .add();
                }

                if (type === 'performance') {
                    chart.renderer.image(c.IMAGE_URL + 'chart/overperformance.svg', plotRight, zeroY - 143, 16, 140)
                    .attr({
                        zIndex: 4
                    })
                    .add();

                    chart.renderer.image(c.IMAGE_URL + 'chart/underperformance.svg', plotRight, zeroY + 4, 16, 140)
                    .attr({
                        zIndex: 4
                    })
                    .add();
                }

                if (type === 'charges') {
                    createIndicator();

                    chart.renderer.image(c.IMAGE_URL + 'chart/too_high.svg', plotRight, plotlinePixels - 417, 16, 415)
                    .attr({
                        zIndex: 4
                    })
                    .add();

                    chart.renderer.image(c.IMAGE_URL + 'chart/too_high_top.svg', plotRight, 0, 16, 125)
                    .attr({
                        zIndex: 4
                    })
                    .add();
                }

                if (type === 'risk') {
                    createIndicator();

                    chart.renderer.image(c.IMAGE_URL + 'chart/up_arrow.svg', plotRight, plotlinePixels - 123, 16, 120)
                    .attr({
                        zIndex: 4
                    })
                    .add();

                    chart.renderer.image(c.IMAGE_URL + 'chart/down_arrow.svg', plotRight, plotlinePixels + 4, 16, 120)
                    .attr({
                        zIndex: 4
                    })
                    .add();
                }
            };

            var $container = $('<div style="width:100%; height:100%;"></div>');
            $this.html($container);

            var chart = Highcharts.chart($container[0], opts, postRender);
            $this.data('chart', chart);
        };
        
        $target.each(add);
    }
}

window.tpl = new App();
