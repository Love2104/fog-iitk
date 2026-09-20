
Highcharts.setOptions({
    chart: {
        backgroundColor: '#FFFFFF',
        style: {
            fontFamily: "'Inter', 'Roboto', sans-serif"
        }
    },
    title: {
        style: { color: '#0F172A', fontSize: '16px', fontWeight: '500' }
    },
    xAxis: {
        lineColor: '#CBD5E1',
        tickColor: '#CBD5E1',
        labels: {
            style: { color: '#64748B' }
        }
    },
    yAxis: {
        gridLineColor: '#F1F5F9', // Faint horizontal lines
        gridLineWidth: 1,
        lineColor: '#CBD5E1',
        labels: {
            style: { color: '#64748B' }
        },
        title: {
            style: { 
                color: '#64748B', 
                fontSize: '11px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                fontWeight: '600' 
            }
        }
    },
    legend: {
        backgroundColor: 'transparent',
        itemStyle: { color: '#334155', fontWeight: '500', cursor: 'pointer' },
        itemHoverStyle: { color: '#0F172A' },
        itemHiddenStyle: { color: '#CBD5E1' }
    },
    rangeSelector: {
        buttonTheme: {
            fill: '#F8FAFC',
            stroke: '#CBD5E1',
            'stroke-width': 1,
            r: 4, // border radius
            style: { color: '#334155', fontWeight: '500' },
            states: {
                hover: {
                    fill: '#E2E8F0',
                    style: { color: '#0F172A' }
                },
                select: {
                    fill: '#0F172A',
                    style: { color: '#FFFFFF' }
                }
            }
        },
        inputBoxBorderColor: '#CBD5E1',
        inputStyle: { color: '#334155' },
        labelStyle: { color: '#64748B', fontWeight: '500' }
    },
    navigator: {
        maskFill: 'rgba(15, 23, 42, 0.05)',
        outlineColor: '#CBD5E1',
        outlineWidth: 1,
        handles: {
            backgroundColor: '#FFFFFF',
            borderColor: '#94A3B8'
        }
    },
    scrollbar: {
        barBackgroundColor: '#F1F5F9',
        barBorderColor: '#CBD5E1',
        buttonArrowColor: '#64748B',
        buttonBackgroundColor: '#F8FAFC',
        buttonBorderColor: '#CBD5E1',
        trackBackgroundColor: '#FFFFFF',
        trackBorderColor: '#E2E8F0'
    }
});

var arr=[];
// $(document).load(function(){
//     $("#page-info").LoadingOverlay("show");
// });
$(document).ready(function(){
    $.ajax({
        url: "apis/map.php",
        async: "false",
        success: function(result) {
            arr=[]
            data = JSON.parse(result)
            var sel = document.getElementById("stations_in");
            
            var datalen = data.length
            for (i = 0; i < datalen; i += 1) {
                arr.push(data[i][0])
                op = document.createElement("option");
                op.setAttribute("value",data[i][0]);
                op.innerHTML = data[i][0];
                sel.appendChild(op);
            }
            
        }
    })
    
    document.getElementById('sel-div').style["display"] = "block";
});
$(document).on({
    ajaxStart: function(){
        $("#body_").LoadingOverlay("show");

    },
    ajaxStop: function(){
        $("#body_").LoadingOverlay("hide");
    }    
});
$("#compare-button").click(function() {
    var getstart=Date.now();
    document.getElementById('footr').style["display"] = "none";
        var select = document.getElementById('stations_in');
        document.getElementById('compchart-div').style["display"] = "none";
        document.getElementById('TempComp-div').style["display"] = "none";
        document.getElementById('HumidityComp-div').style["display"] = "none";
        document.getElementById('WindComp-div').style["display"] = "none";
        var selected = [...select.options]
                          .filter(option => option.selected)
                          .map(option => option.value);
        console.log(selected);
        var fogdata = Array(),
        temperaturedata = Array(),
        humiditydata = Array(),
        winddata = Array(),
        winddirectiondata = Array(),
        j=0
        if(selected.length==1 || selected.length==0)
        {
            alert("Please select atleast 2 stations");
            $("#page").LoadingOverlay("hide");
            return;
        }
        for(j;j<selected.length;j++){
            $.ajax({
                url: "apis/compare2.php?station=" + selected[j],
                async:false,
                success: function(result) {
                    var data = JSON.parse(result)
                    var dataLength = data.length,
                        i = 0;
        
                    for (i; i < dataLength; i += 1) {
                        fogdata.push([]);
                        const vis =(selected[j]=='IIT Kanpur')?data[i][1]:data[i][1] * 1.60934
                        fogdata[j].push([
                            data[i][0],
                            vis > 4 ? 4 : vis
                        ]);
                        temperaturedata.push([]);
                        temperaturedata[j].push([
                            data[i][0],
                            (selected[j]=='IIT Kanpur')?data[i][2]:(data[i][2] - 32) / 1.8
                        ]);
                        humiditydata.push([]);
                        humiditydata[j].push([
                            data[i][0],
                            data[i][3]
                        ]);
                        winddata.push([]);
                        winddata[j].push([
                            data[i][0],
                            (selected[j]=='IIT Kanpur')?data[i][4]:data[i][4] * 1.852,
                            data[i][5]
                        ]);
                        winddirectiondata.push([]);
                        winddirectiondata[j].push([
                            data[i][0],
                            data[i][5]
                        ]);
        
                    }
                   // console.log(temperaturedata[j])
                }
            })     
        }
        comparechart(selected,fogdata, temperaturedata, humiditydata, winddata)
        console.log('Overall render time:' +(( Date.now()-getstart)+(window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) )+ ' milliseconds')
        
        
      
});

function comparechart(selected, fogdata, temperaturedata, humiditydata, winddata) {
    document.getElementById('compchart-div').style["display"] = "block";
        document.getElementById('TempComp-div').style["display"] = "block";
        document.getElementById('HumidityComp-div').style["display"] = "block";
        document.getElementById('WindComp-div').style["display"] = "block";

    var charts = []
    charts.push(
        Highcharts.stockChart('compchart', {
            chart: {
    backgroundColor: '#FFFFFF',
    style: { fontFamily: "'Inter', 'Roboto', sans-serif" },
    height: 500,
                events: {
                    redraw: function () {
                        $(".highcharts-legend-item path").attr('stroke-width', 4);
                    }
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 500
                        },
                        subtitle: {
                            text: null
                        },
                        navigator: {
                            enabled: false
                        }
                    }
                }]
            },
            scrollbar: {
    barBackgroundColor: '#F1F5F9',
    barBorderColor: '#CBD5E1',
    buttonArrowColor: '#64748B',
    buttonBackgroundColor: '#F8FAFC',
    buttonBorderColor: '#CBD5E1',
    trackBackgroundColor: '#FFFFFF',
    trackBorderColor: '#E2E8F0'
},
            rangeSelector: {
    buttonTheme: {
        fill: '#F8FAFC',
        stroke: '#CBD5E1',
        'stroke-width': 1,
        r: 4,
        style: { color: '#334155', fontWeight: '500' },
        states: {
            hover: { fill: '#E2E8F0', style: { color: '#0F172A' } },
            select: { fill: '#0F172A', style: { color: '#FFFFFF' } }
        }
    },
    inputBoxBorderColor: '#CBD5E1',
    inputStyle: { color: '#334155' },
    labelStyle: { color: '#64748B', fontWeight: '500' },
    buttons: [{
                        type: 'day',
                        count: 1,
                        text: '1d'
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }
                ],
                inputEnabled: true,
                selected: 0,

            },
            title: {
                text: 'Visibility (km)',
                style: { fontSize: "16px", color: "#0F172A", fontWeight: "500", fontFamily: "'Inter', 'Roboto', sans-serif" }
            },
            xAxis: { lineColor: '#CBD5E1', lineWidth: 1, gridLineWidth: 0, labels: { style: { color: '#64748B', fontSize: '11px' } },
                plotLines: [{
                    color: '#FF0000', // Red
                    width: 2
                    // value: fogdata1[fogdata1.length-1][0],
                }],
                events: {
                    afterSetExtremes: function(e) {
                        charts.forEach(function(chart, i) {
                            if (i !== 0) {
                                chart.xAxis[0].setExtremes(e.min, e.max)
                            }
                        })
                    }

                },
                crosshair: true
            },
            yAxis: [{
                gridLineColor: '#F1F5F9', gridLineWidth: 1, lineColor: '#CBD5E1', lineWidth: 1,
                labels: {
                    align: 'right',
                    x: -5
                },
                top: '0%',
                height: '100%',
                offset: 10,
                lineWidth: 0,
                opposite: false,
                resize: {
                    enabled: true
                },
                
                plotBands: [{
    from: 0,
    to: 1,
    color: 'rgba(254, 243, 199, 0.4)', // Soft transparent amber
    label: {
        text: '1 km — Fog Threshold',
        align: 'right',
        x: -10,
        style: {
            color: '#64748B',
            fontSize: '11px',
            fontWeight: '500'
        }
    }
}]

            }],
            legend: {
                enabled: true,
                itemStyle: { color: '#334155', fontSize: '13px', fontWeight: 'normal' },
                symbolHeight:100 

            },
            series: [],
            exporting: {
                buttons: {
                    contextButton: {
                        symbolStroke: '#334155',
                        theme: { fill: 'transparent' },
                        menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                    }
                }
            }
        }, function(chart) {

            // apply the date pickers
            setTimeout(function() {
                $('input.highcharts-range-selector', $(chart.container).parent())
                    .datepicker();
            }, 0);
        })
    );
    charts.push(
        Highcharts.stockChart('TempComp', {
            chart: {
    backgroundColor: '#FFFFFF',
    style: { fontFamily: "'Inter', 'Roboto', sans-serif" },
    height: 300,
                events: {
                    redraw: function () {
                        $(".highcharts-legend-item path").attr('stroke-width', 4);
                    }
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 300
                        },
                        subtitle: {
                            text: null
                        },
                        navigator: {
                            enabled: false
                        }
                    }
                }]
            },

            scrollbar: {
    barBackgroundColor: '#F1F5F9',
    barBorderColor: '#CBD5E1',
    buttonArrowColor: '#64748B',
    buttonBackgroundColor: '#F8FAFC',
    buttonBorderColor: '#CBD5E1',
    trackBackgroundColor: '#FFFFFF',
    trackBorderColor: '#E2E8F0'
},
            navigator: {
                enabled: false
            },
            rangeSelector: {
    buttonTheme: {
        fill: '#F8FAFC',
        stroke: '#CBD5E1',
        'stroke-width': 1,
        r: 4,
        style: { color: '#334155', fontWeight: '500' },
        states: {
            hover: { fill: '#E2E8F0', style: { color: '#0F172A' } },
            select: { fill: '#0F172A', style: { color: '#FFFFFF' } }
        }
    },
    inputBoxBorderColor: '#CBD5E1',
    inputStyle: { color: '#334155' },
    labelStyle: { color: '#64748B', fontWeight: '500' },
    buttons: [{
                        type: 'day',
                        count: 1,
                        text: '1d'
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }
                ],
                enabled: false,
                selected: 0
            },
            title: {
                text: 'Temperature (°C)',
                style: { fontSize: "16px", color: "#0F172A", fontWeight: "500", fontFamily: "'Inter', 'Roboto', sans-serif" }
            },
            legend: {
                enabled: true,
                itemStyle: { color: '#334155', fontSize: '13px', fontWeight: 'normal' }
            },
            xAxis: { lineColor: '#CBD5E1', lineWidth: 1, gridLineWidth: 0, labels: { style: { color: '#64748B', fontSize: '11px' } },
                // events: {
                //     afterSetExtremes: function(e) {
                //         charts.forEach(function(chart, i) {
                //             if (i !== 1) {
                //                 chart.xAxis[0].setExtremes(e.min, e.max)
                //             }
                //         })
                //     }

                // }
            },
            yAxis: [{ labels: { align: 'right', x: -5, style: { color: '#64748B', fontSize: '11px' } },
                    top: '0%',
                    height: '100%',
                    offset: 10,
                    lineWidth: 0,
                    opposite: false,
                    resize: {
                        enabled: true
                    }
                }

            ],
            series: [],
            exporting: {
                buttons: {
                    contextButton: {
                        symbolStroke: '#334155',
                        theme: { fill: 'transparent' },
                        menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                    }
                }
            }
        })
    );
    charts.push(
        Highcharts.stockChart('HumidityComp', {
            chart: {
    backgroundColor: '#FFFFFF',
    style: { fontFamily: "'Inter', 'Roboto', sans-serif" },
    height: 300,
                events: {
                    redraw: function () {
                        $(".highcharts-legend-item path").attr('stroke-width', 4);
                    }
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 300
                        },
                        subtitle: {
                            text: null
                        },
                        navigator: {
                            enabled: false
                        }
                    }
                }]
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
    barBackgroundColor: '#F1F5F9',
    barBorderColor: '#CBD5E1',
    buttonArrowColor: '#64748B',
    buttonBackgroundColor: '#F8FAFC',
    buttonBorderColor: '#CBD5E1',
    trackBackgroundColor: '#FFFFFF',
    trackBorderColor: '#E2E8F0'
},
            rangeSelector: {
    buttonTheme: {
        fill: '#F8FAFC',
        stroke: '#CBD5E1',
        'stroke-width': 1,
        r: 4,
        style: { color: '#334155', fontWeight: '500' },
        states: {
            hover: { fill: '#E2E8F0', style: { color: '#0F172A' } },
            select: { fill: '#0F172A', style: { color: '#FFFFFF' } }
        }
    },
    inputBoxBorderColor: '#CBD5E1',
    inputStyle: { color: '#334155' },
    labelStyle: { color: '#64748B', fontWeight: '500' },
    buttons: [{
                        type: 'day',
                        count: 1,
                        text: '1d'
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }
                ],
                enabled: false,
                selected: 0
            },
            
            title: {
                text: 'Humidity (%)',
                style: { fontSize: "16px", color: "#0F172A", fontWeight: "500", fontFamily: "'Inter', 'Roboto', sans-serif" }
            },
            legend: {
                enabled: true,
                itemStyle: { color: '#334155', fontSize: '13px', fontWeight: 'normal' },
                symbolHeight:100
            },
            xAxis: { lineColor: '#CBD5E1', lineWidth: 1, gridLineWidth: 0, labels: { style: { color: '#64748B', fontSize: '11px' } },

                // events: {
                //     afterSetExtremes: function(e) {
                //         charts.forEach(function(chart, i) {
                //             if (i !== 2) {
                //                 chart.xAxis[0].setExtremes(e.min, e.max)
                //             }
                //         })
                //     }

                // }
            },
            yAxis: [{ labels: { align: 'right', x: -5, style: { color: '#64748B', fontSize: '11px' } },
                top: '0%',
                height: '100%',
                offset: 10,
                lineWidth: 0,
                resize: {
                    enabled: true
                },
                opposite: false
            }],
            series: [],
            exporting: {
                buttons: {
                    contextButton: {
                        symbolStroke: '#334155',
                        theme: { fill: 'transparent' },
                        menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                    }
                }
            }
        })
    );
    charts.push(
        Highcharts.stockChart('WindComp', {
            chart: {
    backgroundColor: '#FFFFFF',
    style: { fontFamily: "'Inter', 'Roboto', sans-serif" },
    height: 300,
                events: {
                    redraw: function () {
                        $(".highcharts-legend-item path").attr('stroke-width', 4);
                    }
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 300
                        },
                        subtitle: {
                            text: null
                        },
                        navigator: {
                            enabled: false
                        }
                    }
                }]
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
    barBackgroundColor: '#F1F5F9',
    barBorderColor: '#CBD5E1',
    buttonArrowColor: '#64748B',
    buttonBackgroundColor: '#F8FAFC',
    buttonBorderColor: '#CBD5E1',
    trackBackgroundColor: '#FFFFFF',
    trackBorderColor: '#E2E8F0'
},
            rangeSelector: {
    buttonTheme: {
        fill: '#F8FAFC',
        stroke: '#CBD5E1',
        'stroke-width': 1,
        r: 4,
        style: { color: '#334155', fontWeight: '500' },
        states: {
            hover: { fill: '#E2E8F0', style: { color: '#0F172A' } },
            select: { fill: '#0F172A', style: { color: '#FFFFFF' } }
        }
    },
    inputBoxBorderColor: '#CBD5E1',
    inputStyle: { color: '#334155' },
    labelStyle: { color: '#64748B', fontWeight: '500' },
    buttons: [{
                        type: 'day',
                        count: 1,
                        text: '1d'
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }
                ],
                enabled: false,
                selected: 0

            },
            title: {
                text: 'Wind (km/h)',
                style: { fontSize: "16px", color: "#0F172A", fontWeight: "500", fontFamily: "'Inter', 'Roboto', sans-serif" }
            },
            legend: {
                enabled: true,
                itemStyle: { color: '#334155', fontSize: '13px', fontWeight: 'normal' }
            },

            xAxis: { lineColor: '#CBD5E1', lineWidth: 1, gridLineWidth: 0, labels: { style: { color: '#64748B', fontSize: '11px' } },
                // events: {
                //     afterSetExtremes: function(e) {
                //         charts.forEach(function(chart, i) {
                //             if (i !== 3) {
                //                 chart.xAxis[0].setExtremes(e.min, e.max)
                //             }
                //         })
                //     }

                // }
            },
            yAxis: [{ labels: { align: 'right', x: -5, style: { color: '#64748B', fontSize: '11px' } },
                top: '0%',
                height: '100%',
                offset: 10,
                lineWidth: 0,
                opposite: false
            }],
            series: [],
            exporting: {
                buttons: {
                    contextButton: {
                        symbolStroke: '#334155',
                        theme: { fill: 'transparent' },
                        menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                    }
                }
            }
        })
    );
    Highcharts.setOptions({
        time: {
            timezoneOffset: -11 * 60
        }
    });
    for(var i=0;i<selected.length;i++){
        charts[0].addSeries(
            {
                name: selected[i],
                data: fogdata[i],
                type: 'spline',
                tooltip: {
                    pointFormat: selected[i]+': <b>{point.y}</b> km',
                    valueDecimals: 2
                },
                yAxis: 0,
                dataGrouping: {
                    approximation: 'average'
                }
            },false)
    }
    
    for(var i=0;i<selected.length;i++){
        charts[1].addSeries(
            {
                name: selected[i],
                data: temperaturedata[i],
                type: 'spline',
                tooltip: {
                    pointFormat: selected[i]+': <b>{point.y}</b> °C',
                    valueDecimals: 0
                },
                yAxis: 0,
                dataGrouping: {
                    approximation: 'average'
                }
        })
    }

    for(var i=0;i<selected.length;i++){
        charts[2].addSeries(
            {
                name: selected[i],
                data: humiditydata[i],
                type: 'spline',
                tooltip: {
                    pointFormat: selected[i]+': <b>{point.y}</b> %',
                    valueDecimals: 2
                },
                yAxis: 0,
                dataGrouping: {
                    approximation: 'average'
                }
        })
    }

    for(var i=0;i<selected.length;i++){
        charts[3].addSeries(
            {
                name: selected[i],
                data: winddata[i],
                type: 'spline',
                tooltip: {
                    pointFormat: selected[i]+': <b>{point.y}</b> ( {point.z} °N )',
                    valueDecimals: 2
                },
                yAxis: 0,
                dataGrouping: {
                    approximation: 'average'
                },
                keys:['x', 'y', 'z']
        })
    }
    charts[1].redraw();
    charts[2].redraw();
    charts[3].redraw();
    charts[0].redraw();

    document.getElementById('footr').style["display"] = "block";
}
$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});
