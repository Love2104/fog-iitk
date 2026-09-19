var arr = [];

$(document).ready(function() {
    // var url1 = ""
    // var apar = document.getElementById('response')
    // apar.removeChild(apar.firstChild)
    // var par = document.createElement("div")
    // apar.appendChild(par)
    // var arr = ['IMEINo', 'DeviceDate', 'MaxTemp', 'MinTemp', 'Rain', 'MinMoisture', 'MaxMoisture', 'WindSpeed', 'WindDirection', 'Sunshine', 'AtmosphericPressure', 'LogDate']
    // var rdiv = document.createElement("div")
    // rdiv.setAttribute("class", "row")
    // par.appendChild(rdiv)
    // for (var j = 0; j < arr.length; j += 1) {
    //     var cdiv = document.createElement("div")
    //     cdiv.setAttribute("class", "col")
    //     cdiv.innerHTML = arr[j]
    //     rdiv.appendChild(cdiv)
    // }
    // // url1 = "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/" + sdate + "/" + edate + "/862549045430298/DeviceDate"

    // //  url1 = "apis/sensordata.php"
    // url1 = "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-05-22/" + formatDate() + "/862549045430298/DeviceDate"

    // console.log(formatDate());
    // $.ajax({
    //     //crossDomain: true,
    //     //dataType: 'jsonp',
    //     url: url1,
    //     success: function(result) {
    //         data = JSON.parse(result)
    //         console.log(data)

    //         for (var i = 0; i < data.length; i += 1) {
    //             var rdiv = document.createElement("div")
    //             rdiv.setAttribute("class", "row")
    //             par.appendChild(rdiv)
    //             for (var j = 0; j < arr.length; j += 1) {
    //                 var cdiv = document.createElement("div")
    //                 cdiv.setAttribute("class", "col")
    //                 cdiv.innerHTML = data[i][arr[j]]
    //                 rdiv.appendChild(cdiv)
    //             }
    //         }

    //     }
    // })
    showdata()
});

function formatDate() {
    var d = new Date();
	d.setDate(d.getDate()-10);
       var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function showdata() {
    $("#page").LoadingOverlay("show");

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
            url: "apis/sensordata2.php?stime="+formatDate(),
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
    showchart(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time)



};

function showchart(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time) {
    var charts = []
    charts.push(
        Highcharts.stockChart('Layer-Temperature', {
                chart: {
                    height: 450,
                    panning: true
                    // events: {
                    //     load: function() {
                    //         setInterval(function() {
                    //             $.ajax({
                    //                 url: "apis/sensordata1.php?stime=" + last_time,
                    //                 success: function(result) {
                    //                     var data = JSON.parse(result),
                    //                         i = 0
                    //                         // console.log(data)
                    //                     var dataLength = data.length
                    //                     if (dataLength)
                    //                         last_time = data[dataLength - 1]['date_time']
                    //                     for (i; i < dataLength; i += 1) {
                    //                         var myDate = new Date(data[i]['date_time']); // Your timezone!
                    //                         var myEpoch = myDate.getTime() + 5.5 * 36 * 100000
                    //                         if (i != 0 && myEpoch - prevEpoch < 300000)
                    //                             continue
                    //                         charts[0].series[0].addPoint([myEpoch, (parseFloat(data[i]['max_temp']) + parseFloat(data[i]['min_temp'])) / 2], true, true)
                    //                         charts[1].series[0].addPoint([myEpoch, (parseFloat(data[i]['min_humidity']) + parseFloat(data[i]['max_humidity'])) / 2], true, true)
                    //                         charts[2].series[0].addPoint([myEpoch, parseFloat(data[i]['wind_speed']), parseFloat(data[i]['wind_direction'])], true, true)
                    //                         charts[3].series[0].addPoint([myEpoch, parseFloat(data[i]['sunshine'])], true, true)

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
                                    k = charts[0].series[0].points[0].index;
                                    for (var i = 1; i < charts.length; i++) {
                                        if( i== 1){
                                            var arr = Array()
                                            for (var j = 0; j < 3; j++) {
                                                charts[i].series[j].points[this.index - k].setState('hover');
                                                arr.push(charts[i].series[j].points[this.index - k])
                                            }
                                            charts[i].tooltip.refresh(arr)

                                            charts[i].xAxis[0].addPlotLine({
                                                id: 'xPlotLine',
                                                value: this.x,
                                                width: 1,
                                                color: '#C0C0C0'
                                            });
                                        }
                                        if(i == 2){
                                            var arr = Array()
                                            for (var j = 0; j < 4; j++) {
                                                charts[i].series[j].points[this.index - k].setState('hover');
                                                arr.push(charts[i].series[j].points[this.index - k])
                                            }
                                            charts[i].tooltip.refresh(arr)
                                            charts[i].xAxis[0].addPlotLine({
                                                id: 'xPlotLine',
                                                value: this.x,
                                                width: 1,
                                                color: '#C0C0C0'
                                            });
                                        }
                                        if(i==3){
                                            var arr = Array()
                                            for (var j = 0; j < 5; j++) {
                                                charts[i].series[j].points[this.index - k].setState('hover');
                                                arr.push(charts[i].series[j].points[this.index - k])
                                            }
                                            charts[i].tooltip.refresh(arr)
                                            charts[i].xAxis[0].addPlotLine({
                                                id: 'xPlotLine',
                                                value: this.x,
                                                width: 1,
                                                color: '#C0C0C0'
                                            });
                                        }
                                        
                                    }
                                    $(".highcharts-markers path").attr('visibility', 'visible')
                                },
                                mouseOut: function(e) {
                                    // console.log(e)
                                    k = charts[0].series[0].points[0].index;
                                    for (var i = 1; i < charts.length; i++) {
                                        charts[i].xAxis[0].removePlotLine('xPlotLine');
                                        charts[i].tooltip.hide();
                                    }
                                    $(".highcharts-markers path").attr('visibility', 'hidden')


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
                            menuItems: ["viewFullscreen","downloadPDF","downloadCSV"]
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
    charts.push(
        Highcharts.stockChart('Layer-Humidity', {
            chart: {
                height: 300
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
                inputEnabled: false,
                selected: 0,
                enabled: false
            },
            title: {
                text: 'Humidity (%)',
                align: 'left',
                style: {
                    fontSize: "16px",
                    color: "red"
                }
            },
            xAxis: {
                // min: charts[0].series[0].processedXData[0]
                min: L1_temperaturedata[L1_temperaturedata.length - 1][0] - 86400000
            },
            legend: {
                enabled: true,
                itemStyle:{
                    fontSize:"15px"
                }
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            mouseOver: function(e) {
                                k = charts[1].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 1)
                                        continue;
                                    if( i== 0){
                                        var arr = Array()
                                        for (var j = 0; j < 3; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)

                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    if(i == 2){
                                        var arr = Array()
                                        for (var j = 0; j < 4; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)
                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    if(i==3){
                                        var arr = Array()
                                        for (var j = 0; j < 5; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)
                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    
                                }
                                $(".highcharts-markers path").attr('visibility', 'visible')

                            },
                            mouseOut: function(e) {
                                k = charts[1].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 1)
                                        continue;
                                    charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    charts[i].tooltip.hide();
                                }
                                $(".highcharts-markers path").attr('visibility', 'hidden')

                            }
                        }
                    }
                }
            },
            yAxis: [{
                // min:0,
                // max:100,
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {

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
            series: [{
                name: 'Layer-1 Humidity',
                data: L1_humiditydata,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'Layer 1 : {point.y}%',
                    valueDecimals: 0
                },
                dataGrouping: {
                    approximation: 'average'
                }
            },
            {
                name: 'Layer-2 Humidity',
                data: L2_humiditydata,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'Layer 2 : {point.y}%',
                    valueDecimals: 0
                },
                dataGrouping: {
                    approximation: 'average'
                }
            },
            {
                name: 'Layer-3 Humidity',
                data: L3_humiditydata,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'Layer 3 : {point.y}%',
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
                        menuItems: ["viewFullscreen","downloadPDF","downloadCSV"]
                    }
                }
            }
        })
    );
    charts.push(
        Highcharts.stockChart('PM', {
            chart: {
                height: 300
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
                inputEnabled: false,
                selected: 0,
                enabled: false

            },
            title: {
                text: 'PM',
                align: 'left',
                style: {
                    fontSize: "16px",
                    color: "red"
                }

            },
            legend: {
                enabled: true,
                itemStyle:{
                    fontSize:"15px"
                }
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            mouseOver: function(e) {
                                k = charts[2].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 2)
                                        continue;
                                    if( i== 0){
                                        var arr = Array()
                                        for (var j = 0; j < 3; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)

                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    if(i == 1){
                                        var arr = Array()
                                        for (var j = 0; j < 3; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)
                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    if(i==3){
                                        var arr = Array()
                                        for (var j = 0; j < 5; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)
                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    
                                }
                                $(".highcharts-markers path").attr('visibility', 'visible')

                            },
                            mouseOut: function(e) {
                                k = charts[2].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 2)
                                        continue;
                                    charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    charts[i].tooltip.hide();
                                }
                                $(".highcharts-markers path").attr('visibility', 'hidden')

                            }
                        }
                    }
                }
            },
            xAxis: {
                // min: charts[0].series[0].processedXData[0]
                min: L1_temperaturedata[L1_temperaturedata.length - 1][0] - 86400000

            },
            yAxis: [{
                //    min:0,
                //    max:75,
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {
                    text: null
                },
                top: '0%',
                height: '100%',
                offset: 10,
                lineWidth: 0,
                opposite: false
            }],

            series: [{
                name: 'PM 1.0',
                data: PM_1,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'PM 1.0 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
                
            },
            {
                name: 'PM 2.5',
                data: PM_2_5,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'PM 2.5 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
                
            },
            {
                name: 'PM 4.0',
                data: PM_4,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'PM 4.0 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
                
            },
            {
                name: 'PM 10.0',
                data: PM_10,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'PM 10.0 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
                
            }

        ],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen","downloadPDF","downloadCSV"]
                    }
                }
            }
        })
    );
    charts.push(
        Highcharts.stockChart('NC', {
            chart: {
                height: 300
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
                inputEnabled: false,
                selected: 0,
                enabled: false
            },
            title: {
                text: 'NC',
                align: 'left',
                style: {
                    fontSize: "16px",
                    color: "red"
                }
            },
            xAxis: {
                // min: charts[0].series[0].processedXData[0]
                min: L1_temperaturedata[L1_temperaturedata.length - 1][0] - 86400000

            },
            legend: {
                enabled: true,
                itemStyle:{
                    fontSize:"15px"
                }
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            mouseOver: function(e) {
                                k = charts[3].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 3)
                                        continue;
                                    if( i== 0){
                                        var arr = Array()
                                        for (var j = 0; j < 3; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)

                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    if(i == 1){
                                        var arr = Array()
                                        for (var j = 0; j < 3; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)
                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    if(i==2){
                                        var arr = Array()
                                        for (var j = 0; j < 4; j++) {
                                            charts[i].series[j].points[this.index - k].setState('hover');
                                            arr.push(charts[i].series[j].points[this.index - k])
                                        }
                                        charts[i].tooltip.refresh(arr)
                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
                                    }
                                    
                                }
                                $(".highcharts-markers path").attr('visibility', 'visible')

                            },
                            mouseOut: function(e) {
                                k = charts[3].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 3)
                                        continue;
                                    charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    charts[i].tooltip.hide();
                                }
                                $(".highcharts-markers path").attr('visibility', 'hidden')

                            }
                        }
                    }
                }
            },
            yAxis: [{
                min: 0,
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {

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
            series: [{
                name: 'NC 0.5',
                data: NC_0_5,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'NC 0.5 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
            },
            {
                name: 'NC 1.0',
                data: NC_1,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'NC 1.0 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
            },
            {
                name: 'NC 2.5',
                data: NC_2_5,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'NC 2.5 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
            },
            {
                name: 'NC 4.0',
                data: NC_4,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'NC 4.0 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
            },
            {
                name: 'NC 10.0',
                data: NC_10,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: 'NC 10.0 : {point.y}',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
            }

        ],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen","downloadPDF","downloadCSV"]
                    }
                }
            }
        })
    );

    // Highcharts.setOptions({
    //     time: {
    //         timezoneOffset: 5.5 * 60
    //     }
    // });
    $("#page").LoadingOverlay("hide");
    // document.getElementById('response').style["display"] = "block";
    document.getElementById('chart-show2').style["display"] = "block";
    // document.getElementById('footr').style["display"] = "block";

}
$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});
