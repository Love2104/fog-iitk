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
// $(document).on({
//     ajaxStart: function(){
//         $("#body_").LoadingOverlay("show");

//     },
//     ajaxStop: function(){
//         $("#body_").LoadingOverlay("hide");
//     }    
// });
$("#compare-button").click(function() {
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
                        fogdata[j].push([
                            data[i][0],
                            data[i][1] * 1.60934
                        ]);
                        temperaturedata.push([]);
                        temperaturedata[j].push([
                            data[i][0],
                            (data[i][2] - 32) / 1.8
                        ]);
                        humiditydata.push([]);
                        humiditydata[j].push([
                            data[i][0],
                            data[i][3]
                        ]);
                        winddata.push([]);
                        winddata[j].push([
                            data[i][0],
                            data[i][4] * 1.852,
                            data[i][5]
                        ]);
                        winddirectiondata.push([]);
                        winddirectiondata[j].push([
                            data[i][0],
                            data[i][5]
                        ]);
        
                    }
                    console.log(fogdata[j])
                }
            })     
        }
        comparechart(selected,fogdata, temperaturedata, humiditydata, winddata)
        
        
      
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
                barBackgroundColor: 'gray',
                barBorderRadius: 7,
                barBorderWidth: 0,
                buttonBackgroundColor: 'gray',
                buttonBorderWidth: 0,
                buttonBorderRadius: 7,
                trackBackgroundColor: 'none',
                trackBorderWidth: 1,
                trackBorderRadius: 8,
                trackBorderColor: '#CCC'
            },
            rangeSelector: {
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
                align: 'left',
                style: {
                    fontSize: "18px",
                    color: "red"
                }
            },
            xAxis: {
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
                gridLineWidth:0,
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
                plotBands:[
                {
                    from:1,
                    to:0,
                    color:'rgb(255, 248, 238)'
                }
            ],
            plotLines: [{
                value: 1,
                width: 1,
                color: 'red',
                label: {
                    text: '<div data-toggle="modal" class="line_allowable btn_toggle" href="#modal-form1"><span>Fog</span></div>',
                    useHTML: true,
                    style: {
                        color: 'red',
                    },
                    align: 'left',
                    x: -25,
                    y: 12,
                    events: {
                        redraw: function() {
                            alert('The chart is being redrawn');
                        }
                    }
                },
            }]

            }],
            legend: {
                enabled: true,
                itemStyle:{
                    fontSize:"14px"
                },
                symbolHeight:100 

            },
            series: [],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
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
                barBackgroundColor: 'gray',
                barBorderRadius: 7,
                barBorderWidth: 0,
                buttonBackgroundColor: 'gray',
                buttonBorderWidth: 0,
                buttonBorderRadius: 7,
                trackBackgroundColor: 'none',
                trackBorderWidth: 1,
                trackBorderRadius: 8,
                trackBorderColor: '#CCC',
                enabled: false
            },
            navigator: {
                enabled: false
            },
            rangeSelector: {
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
                align: 'left',
                style: {
                    fontSize: "18px",
                    color: "red"
                }
            },
            legend: {
                enabled: true,
                itemStyle:{
                    fontSize:"14px"
                }
            },
            xAxis: {
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
            yAxis: [{
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
                    }
                }

            ],
            series: [],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                    }
                }
            }
        })
    );
    charts.push(
        Highcharts.stockChart('HumidityComp', {
            chart: {
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
                barBackgroundColor: 'gray',
                barBorderRadius: 7,
                barBorderWidth: 0,
                buttonBackgroundColor: 'gray',
                buttonBorderWidth: 0,
                buttonBorderRadius: 7,
                trackBackgroundColor: 'none',
                trackBorderWidth: 1,
                trackBorderRadius: 8,
                trackBorderColor: '#CCC',
                enabled: false
            },
            rangeSelector: {
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
                align: 'left',
                style: {
                    fontSize: "18px",
                    color: "red"
                }
            },
            legend: {
                enabled: true,
                itemStyle:{
                    fontSize:"14px"
                },
                symbolHeight:100
            },
            xAxis: {

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
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -5
                },
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
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                    }
                }
            }
        })
    );
    charts.push(
        Highcharts.stockChart('WindComp', {
            chart: {
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
                barBackgroundColor: 'gray',
                barBorderRadius: 7,
                barBorderWidth: 0,
                buttonBackgroundColor: 'gray',
                buttonBorderWidth: 0,
                buttonBorderRadius: 7,
                trackBackgroundColor: 'none',
                trackBorderWidth: 1,
                trackBorderRadius: 8,
                trackBorderColor: '#CCC',
                enabled: false
            },
            rangeSelector: {
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
                align: 'left',
                style: {
                    fontSize: "18px",
                    color: "red"
                }
            },
            legend: {
                enabled: true,
                itemStyle:{
                    fontSize:"14px"
                }
            },

            xAxis: {
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
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -5
                },
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
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
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
