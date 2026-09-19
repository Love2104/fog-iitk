var arr = [];

$(document).ready(function() {
    showdata2()
});

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function showdata2() {
    // $("#page").LoadingOverlay("show");

    var L1_temperaturedata = Array(),
        L2_temperaturedata = Array(),
        L3_temperaturedata = Array(),
        L1_humiditydata = Array(),
        L2_humiditydata = Array(),
        L3_humiditydata = Array(),

        PM_1 = Array(),
        PM_2_5 = Array(),
        PM_4 = Array(),
        PM_10 = Array(),

        NC_0_5 = Array(),
        NC_1 = Array(),
        NC_2_5 = Array(),
        NC_4 = Array(),
        NC_10 = Array(),
        battery_voltage= Array()
        j = 0,
        last_time = 2021 - 07 - 14
    $.ajax({
            //crossDomain: true,
            //dataType: 'jsonp',
            // url: "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-03-22/" + formatDate() + "/862549045430298/DeviceDate",
            url: "apis/sensordata2.php?stime=2021-07-14",
            async: false,
            success: function(result) {
                var data = JSON.parse(result)
                console.log(result)
                var dataLength = data.length,
                    i = 0
                last_time = data[dataLength - 1][0]
                prevEpoch = 0
                for (i; i < dataLength; i += 1) {
                    var myEpoch = data[i][0]*1000 + 5.5 * 36 * 100000
                    
                    L1_temperaturedata.push([
                        myEpoch,
                        data[i][2]
                    ]);
                    L2_temperaturedata.push([
                        myEpoch,
                        data[i][4]
                    ]);
                    L3_temperaturedata.push([
                        myEpoch,
                        data[i][6]
                    ]);
                    L1_humiditydata.push([
                        myEpoch,
                        data[i][1]
                    ]);
                    L2_humiditydata.push([
                        myEpoch,
                        data[i][3]
                    ]);
                    L3_humiditydata.push([
                        myEpoch,
                        data[i][5]
                    ]);
                    PM_1.push([
                        myEpoch,
                        data[i][7]
                        
                    ]);
                    PM_2_5.push([
                        myEpoch,
                        data[i][8]
                        
                    ]);
                    PM_4.push([
                        myEpoch,
                        data[i][9]
                    ]);
                    PM_10.push([
                        myEpoch,
                        data[i][10]
                    ]);
                    NC_0_5.push([
                        myEpoch,
                        data[i][11]
                    ]);
                    NC_1.push([
                        myEpoch,
                        data[i][12]
                    ]);
                    NC_2_5.push([
                        myEpoch,
                        data[i][13]
                    ]);
                    NC_4.push([
                        myEpoch,
                        data[i][14]
                    ]);
                    NC_10.push([
                        myEpoch,
                        data[i][15]
                    ]);
                    battery_voltage.push([
                        myEpoch,
                        data[i][16]
                        
                    ]);
                    prevEpoch = myEpoch

                }
            }
        })
        // console.log(temperaturedata, humiditydata, winddata)
    showchart2(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time)



};
// function afterSetExtremes(e) {
//     const { chart } = e.target;
//     chart.showLoading('Loading data from server...');
//     fetch(`${dataURL}?start=${Math.round(e.min)}&end=${Math.round(e.max)}`)
//         .then(res => res.ok && res.json())
//         .then(data => {
//             chart.series[0].setData(data);
//             chart.hideLoading();
//         }).catch(error => console.error(error.message));
// }
function showchart2(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time) {
    var charts = []
    charts.push(
        Highcharts.stockChart('Layer-Temperature', {
                chart: {
                    height: 450,
                    zoomType:'x'
                    // events: {
                    //     load: function() {
                    //         setInterval(function() {
                    //             $.ajax({
                    //                 url: "apis/sensordata1.php?stime=" + last_time+"&select=2",
                    //                 success: function(result) {
                    //                     var data = JSON.parse(result)
                    //                         i = 0
                    //                         // console.log(data)
                    //                     var dataLength = data.length
                    //                     if (dataLength)
                    //                         last_time = data[dataLength - 1]["Timestamp"]
                    //                     for (i; i < dataLength; i += 1) {
                    //                         var myDate = new Date(data[i]['Time']); // Your timezone!
                    //                         var myEpoch = myDate.getTime() + 5.5 * 36 * 100000
                    //                         // var myEpoch = data[i]["Timestamp"] * 1000
                    //                         // if (i != 0 && myEpoch - prevEpoch < 300000)
                    //                         //     continue
                    //                         charts[0].series[0].addPoint([myEpoch, parseFloat(data[i]["L1_Temperature"])], true, true)
                    //                         charts[0].series[1].addPoint([myEpoch, parseFloat(data[i]["L2_Temperature"])], true, true)
                    //                         charts[0].series[2].addPoint([myEpoch, parseFloat(data[i]["L3_Temperature"])], true, true)

                    //                         // charts[1].series[0].addPoint([myEpoch, parseFloat(data[i]["L1_Humidity"])], true, true)
                    //                         // charts[1].series[1].addPoint([myEpoch, parseFloat(data[i]["L2_Humidity"])], true, true)
                    //                         // charts[1].series[2].addPoint([myEpoch, parseFloat(data[i]["L3_Humidity"])], true, true)

                    //                         // charts[2].series[0].addPoint([myEpoch, parseFloat(data[i]["PM_1.0"])], true, true)
                    //                         // charts[2].series[1].addPoint([myEpoch, parseFloat(data[i]["PM_2.5"])], true, true)
                    //                         // charts[2].series[2].addPoint([myEpoch, parseFloat(data[i]["PM_4.0"])], true, true)
                    //                         // charts[2].series[3].addPoint([myEpoch, parseFloat(data[i]["PM_10.0"])], true, true)

                    //                         // charts[3].series[0].addPoint([myEpoch, parseFloat(data[i]["NC_0.5"])], true, true)
                    //                         // charts[3].series[1].addPoint([myEpoch, parseFloat(data[i]["NC_1.0"])], true, true)
                    //                         // charts[3].series[2].addPoint([myEpoch, parseFloat(data[i]["NC_2.5"])], true, true)
                    //                         // charts[3].series[3].addPoint([myEpoch, parseFloat(data[i]["NC_4.0"])], true, true)
                    //                         // charts[3].series[4].addPoint([myEpoch, parseFloat(data[i]["NC_10.0"])], true, true)



                                            
                    //                         console.log(result);
                    //                     }
                    //                 }
                    //             })
                    //         }, 20000);
                    //     }
                    // }
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
                    enabled: true
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
                    inputEnabled: true,
                    selected: 0,


                },
                title: {
                    text: 'Temperature (°C) ',
                    align: 'left',
                    style: {
                        fontSize: "20px",
                        color: "red"
                    }
                },
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                mouseOver: function(e) {
                                    console.log(e)
                                    k = charts[0].series[0].points[0].index;
                                    console.log(charts[0]);
                                    // for (var i = 1; i < charts.length; i++) {
                                    //     if( i== 1){
                                    //         var arr = Array()
                                    //         for (var j = 0; j < 3; j++) {
                                    //             charts[i].series[j].points[this.index - k].setState('hover');
                                    //             arr.push(charts[i].series[j].points[this.index - k])
                                    //         }
                                    //         charts[i].tooltip.refresh(arr)

                                    //         charts[i].xAxis[0].addPlotLine({
                                    //             id: 'xPlotLine',
                                    //             value: this.x,
                                    //             width: 1,
                                    //             color: '#C0C0C0'
                                    //         });
                                    //     }
                                    //     if(i == 2){
                                    //         var arr = Array()
                                    //         for (var j = 0; j < 4; j++) {
                                    //             charts[i].series[j].points[this.index - k].setState('hover');
                                    //             arr.push(charts[i].series[j].points[this.index - k])
                                    //         }
                                    //         charts[i].tooltip.refresh(arr)
                                    //         charts[i].xAxis[0].addPlotLine({
                                    //             id: 'xPlotLine',
                                    //             value: this.x,
                                    //             width: 1,
                                    //             color: '#C0C0C0'
                                    //         });
                                    //     }
                                    //     if(i==3){
                                    //         var arr = Array()
                                    //         for (var j = 0; j < 5; j++) {
                                    //             charts[i].series[j].points[this.index - k].setState('hover');
                                    //             arr.push(charts[i].series[j].points[this.index - k])
                                    //         }
                                    //         charts[i].tooltip.refresh(arr)
                                    //         charts[i].xAxis[0].addPlotLine({
                                    //             id: 'xPlotLine',
                                    //             value: this.x,
                                    //             width: 1,
                                    //             color: '#C0C0C0'
                                    //         });
                                    //     }
                                        
                                    // }
                                    // $(".highcharts-markers path").attr('visibility', 'visible')
                                    console.log(k)
                                },
                                mouseOut: function(e) {
                                    // console.log(e)
                                    // k = charts[0].series[0].points[0].index;
                                    // console.log("abc",k)
                                    // for (var i = 1; i < charts.length; i++) {
                                    //     charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    //     charts[i].tooltip.hide();
                                    // }
                                    // $(".highcharts-markers path").attr('visibility', 'hidden')


                                }
                            }
                        }
                    }
                },
                yAxis: [{
                    // min: -20,
                    // max:80,
                    gridLineWidth: 0,
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

                }],

                xAxis: {
                    max: L1_temperaturedata[L1_temperaturedata.length - 1][0],
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
                legend: {
                    enabled: true,
                    itemStyle:{
                        fontSize:"15px"
                    }
                },
                series: [

                    {
                        name: 'Layer-1 Temperature',
                        data: L1_temperaturedata,
                        type: 'spline',
                        yAxis: 0,
                        tooltip: {
                            pointFormat: 'Layer 1 : {point.y}°C',
                            valueDecimals: 0
                        },
                        dataGrouping: {
                            approximation: 'average'
                        }
                    },
                    {
                        name: 'Layer-2 Temperature',
                        data: L2_temperaturedata,
                        type: 'spline',
                        yAxis: 0,
                        tooltip: {
                            pointFormat: 'Layer 2 : {point.y}°C',
                            valueDecimals: 0
                        },
                        dataGrouping: {
                            approximation: 'average'
                        }
                    },
                    {
                        name: 'Layer-3 Temperature',
                        data: L3_temperaturedata,
                        type: 'spline',
                        yAxis: 0,
                        tooltip: {
                            pointFormat: 'Layer 3 : {point.y}°C',
                            valueDecimals: 0
                        },
                        dataGrouping: {
                            approximation: 'average'
                        }
                    }

                ],
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: ["downloadPDF","downloadCSV"]
                        }
                    }
                }
            }
            ,
            function(chart) {

                // apply the date pickers
                setTimeout(function() {
                    $('input.highcharts-range-selector', $(chart.container).parent())
                        .datepicker();
                }, 0);
            }
            ));


}

// fetch(dataURL)
//     .then(res => res.ok && res.json())
//     .then(data => {

//         // Add a null value for the end date
//         // data.push([Date.UTC(2011, 9, 14, 18), null, null, null, null]);

//         // create the chart
//         Highcharts.stockChart('container', {
//             chart: {
//                 type: 'candlestick',
//                 zoomType: 'x'
//             },

//             navigator: {
//                 adaptToUpdatedData: false,
//                 series: {
//                     data: data
//                 }
//             },

//             scrollbar: {
//                 liveRedraw: false
//             },

//             title: {
//                 text: 'AAPL history by the minute from 1998 to 2011',
//                 align: 'left'
//             },

//             subtitle: {
//                 text: 'Displaying 1.7 million data points in Highcharts Stock by async server loading',
//                 align: 'left'
//             },

//             rangeSelector: {
//                 buttons: [{
//                     type: 'hour',
//                     count: 1,
//                     text: '1h'
//                 }, {
//                     type: 'day',
//                     count: 1,
//                     text: '1d'
//                 }, {
//                     type: 'month',
//                     count: 1,
//                     text: '1m'
//                 }, {
//                     type: 'year',
//                     count: 1,
//                     text: '1y'
//                 }, {
//                     type: 'all',
//                     text: 'All'
//                 }],
//                 inputEnabled: false, // it supports only days
//                 selected: 4 // all
//             },

//             xAxis: {
//                 events: {
//                     afterSetExtremes: afterSetExtremes
//                 },
//                 minRange: 3600 * 1000 // one hour
//             },

//             yAxis: {
//                 floor: 0
//             },

//             series: [{
//                 data: data,
//                 dataGrouping: {
//                     enabled: false
//                 }
//             }]
//         });
//     }).catch(error => console.error(error.message));
$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});
