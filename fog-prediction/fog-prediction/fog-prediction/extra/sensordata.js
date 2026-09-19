var arr = [];

$(document).ready(function() {
    var url1 = ""
    var apar = document.getElementById('response')
    apar.removeChild(apar.firstChild)
    var par = document.createElement("div")
    apar.appendChild(par)
    var arr = ['IMEINo', 'DeviceDate', 'MaxTemp', 'MinTemp', 'Rain', 'MinMoisture', 'MaxMoisture', 'WindSpeed', 'WindDirection', 'Sunshine', 'AtmosphericPressure', 'LogDate']
    var rdiv = document.createElement("div")
    rdiv.setAttribute("class", "row")
    par.appendChild(rdiv)
    for (var j = 0; j < arr.length; j += 1) {
        var cdiv = document.createElement("div")
        cdiv.setAttribute("class", "col")
        cdiv.innerHTML = arr[j]
        rdiv.appendChild(cdiv)
    }
    // url1 = "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/" + sdate + "/" + edate + "/862549045430298/DeviceDate"
    
     url1 = "apis/sensordata.php"
    //url1= "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-01-13/" + formatDate() + "/862549045430298/DeviceDate"

    $.ajax({
        //crossDomain: true,
        //dataType: 'jsonp',
        url: url1,
        success: function(result) {
            data = JSON.parse(result)
            console.log(data)

            for (var i = 0; i < data.length; i += 1) {
                var rdiv = document.createElement("div")
                rdiv.setAttribute("class", "row")
                par.appendChild(rdiv)
                for (var j = 0; j < arr.length; j += 1) {
                    var cdiv = document.createElement("div")
                    cdiv.setAttribute("class", "col")
                    cdiv.innerHTML = data[i][arr[j]]
                    rdiv.appendChild(cdiv)
                }
            }

        }
    })
    showdata()
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

function showdata() {
    $("#page").LoadingOverlay("show");

    var temperaturedata = Array(),
        humiditydata = Array(),
        winddata = Array(),
        sunshinedata=Array(),
        j = 0
    $.ajax({
        //crossDomain: true,
        //dataType: 'jsonp',
        //url: "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-01-13/" + formatDate() + "/862549045430298/DeviceDate",
         url:"apis/sensordata.php",
        async: false,
        success: function(result) {
            var data = JSON.parse(result)
		console.log(result)
            var dataLength = data.length,
                i = 0;
            prevEpoch =0
            for (i; i < dataLength; i += 1) {
                data[i]['DeviceDate'][10] = " "
                var myDate = new Date(data[i]['DeviceDate']); // Your timezone!
                var myEpoch = myDate.getTime() + 5.5 * 36 * 100000
                if(i!=0 && myEpoch-prevEpoch<300000)
                    continue
                // console.log(myEpoch)
                temperaturedata.push([
                    myEpoch,
                    // (data[i]['MaxTemp'] + data[i]['MinTemp']) / 2
                    (parseFloat(data[i]['MinTemp']) + parseFloat(data[i]['MaxTemp'])) / 2
                ]);
                humiditydata.push([
                    myEpoch,
                    // (data[i]['MinMoisture'] + data[i]['MaxMoisture']) / 2
                    (parseFloat(data[i]['MinMoisture']) + parseFloat(data[i]['MaxMoisture'])) / 2
                ]);
               winddata.push([
                    myEpoch,
                    parseFloat(data[i]['WindSpeed']),
                    parseFloat(data[i]['WindDirection'])
                ]);
                sunshinedata.push([
                    myEpoch,
                    parseFloat(data[i]['Sunshine'])
                ]);
                prevEpoch = myEpoch

            }
        }
    })
    console.log(temperaturedata, humiditydata, winddata)
    showchart(temperaturedata, humiditydata, winddata,sunshinedata)



};

function showchart(temperaturedata, humiditydata, winddata,sunshinedata) {
    var charts = []
    charts.push(
        Highcharts.stockChart('Temperature', {
                chart: {
                    height: 350,
                    panning: true
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
                                    k = charts[0].series[charts[0].hoverSeries._i].points[0].index;
                                    // console.log(charts[0])
                                    var store = []
                                    store.push(this.y)
                                    for (var i = 1; i < charts.length; i++) {
                                        // charts[i].series[0].points[this.index - k].setState('hover');
                                        charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])
                                        // console.log(charts[i])
                                        store.push(charts[i].series[0].points[this.index - k].y)
                                        if (i == 2)
                                            if (charts[i].series[0].points[this.index - k].z == null)
                                                store.push(0);
                                            else
                                                store.push(charts[i].series[0].points[this.index - k].z)
                                        charts[i].xAxis[0].addPlotLine({
                                            id: 'xPlotLine',
                                            value: this.x,
                                            width: 1,
                                            color: '#C0C0C0'
                                        });
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
                    max: temperaturedata[temperaturedata.length - 1][0],
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

                series: [

                    {
                        name: 'Temperature',
                        data: temperaturedata,
                        type: 'spline',
                        yAxis: 0,
                        tooltip: {
                            pointFormat: '{point.y}°C',
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
                            menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                        }
                    }
                }
            },
            function(chart) {

                // apply the date pickers
                setTimeout(function() {
                    $('input.highcharts-range-selector', $(chart.container).parent())
                        .datepicker();
                }, 0);
            }));
    charts.push(
        Highcharts.stockChart('Humidity', {
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
                min:temperaturedata[temperaturedata.length-1][0]-86400000
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
                                    charts[i].series[0].points[this.index - k].setState('hover');
                                    charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])

                                    charts[i].xAxis[0].addPlotLine({
                                        id: 'xPlotLine',
                                        value: this.x,
                                        width: 1,
                                        color: '#C0C0C0'
                                    });
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
                name: 'Humidity',
                data: humiditydata,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: '{point.y}%',
                    valueDecimals: 0
                },
                dataGrouping: {
                    approximation: 'average'
                }
            }],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                    }
                },
                enabled: false
            }
        })
    );
    charts.push(
        Highcharts.stockChart('Wind', {
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
                text: 'Wind (m/s)',
                align: 'left',
                style: {
                    fontSize: "16px",
                    color: "red"
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
                                    charts[i].series[0].points[this.index - k].setState('hover');
                                    charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])

                                    charts[i].xAxis[0].addPlotLine({
                                        id: 'xPlotLine',
                                        value: this.x,
                                        width: 1,
                                        color: '#C0C0C0'
                                    });
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
                min:temperaturedata[temperaturedata.length-1][0]-86400000

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
                name: 'Wind',
                data: winddata,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: '{point.y} ({point.z}°N)',
                    valueDecimals: 0
                },
                dataGrouping: {
                    approximation: 'average'
                },
                keys: ['x', 'y', 'z']
            }],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                    }
                },
                enabled: false
            }
        })
    );
    charts.push(
        Highcharts.stockChart('sunshine', {
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
                text: 'Solar Radiation (Wt/m²)',
                align: 'left',
                style: {
                    fontSize: "16px",
                    color: "red"
                }
            },
            xAxis: {
                // min: charts[0].series[0].processedXData[0]
                min:temperaturedata[temperaturedata.length-1][0]-86400000

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
                                    charts[i].series[0].points[this.index - k].setState('hover');
                                    charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])

                                    charts[i].xAxis[0].addPlotLine({
                                        id: 'xPlotLine',
                                        value: this.x,
                                        width: 1,
                                        color: '#C0C0C0'
                                    });
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
                min:0,
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
                name: 'Solar Radiation',
                data: sunshinedata,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: '{point.y} Wt/m²',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
            }],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                    }
                },
                enabled: false
            }
        })
    );
    // Highcharts.setOptions({
    //     time: {
    //         timezoneOffset: 5.5 * 60
    //     }
    // });
    $("#page").LoadingOverlay("hide");
    document.getElementById('response').style["display"] = "block";
    document.getElementById('chart-show').style["display"] = "block";
    document.getElementById('footr').style["display"] = "block";

}
$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});
