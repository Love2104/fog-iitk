#!/usr/bin/env node

var selectionObject = {
    "Delhi": {
        "Delhi": ["Delhi Airport"]
    },
    "Uttar Pradesh": {
        "Lucknow": ["Lucknow Airport"]
    }
}

// var lat = 28.7041;
// var long = 77.1025;
function checkCity(element,model) {

    cityname = document.getElementById("myInput").value;
    a = document.getElementById("myInput").value;
    getPos(cityname);
    // console.log("checkcity");
    if (a == "")
        return;
    cityid = 0;
    if (a == "Lucknow") {
        cityid = 2;
    } else if (a == "Delhi") {
        cityid = 1;
    }
    document.getElementById('cityname').innerHTML = "City: " + a;

    highChartFunc(cityname,model);
    chartmake(cityname);
}
function onModelChange(element){
    var cityname = document.getElementById("myInput").value;
    var model = element.getAttribute("modelno");
    highChartFunc(cityname,model);
    
}
function loaddata(model) {

    var cityname = document.getElementById("myInput").value;
    document.getElementById('cityname').innerHTML = "City :" + cityname;
    getPos(cityname);
    // console.log("breakpoint1");
    highChartFunc(cityname,model);
    // console.log("breakpoint2");
    chartmake(cityname);
    // console.log("breakpoint3");
}

function highChartFunc(cityid,model) {
    // console.log("highchartEnter");
    document.getElementById('other-section').style["display"] = "none";
    // Highcharts.getJSON('value.php?id='+cityid, function(data) {
    Highcharts.getJSON('apis/database.php?station=' + cityid, function(data) {
        var fogdata = [],
            temperaturedata = [],
            humiditydata = [],
            winddata = [],
            winddirectiondata = [],
            fogdata2 = [],
            dataLength = data.length,
            i = 0;
        for (i; i < dataLength; i += 1) {
            fogdata.push([
                data[i][0],
                data[i][1] * 1.60934
            ]);
            temperaturedata.push([
                data[i][0],
                (data[i][2] - 32) / 1.8
            ]);
            humiditydata.push([
                data[i][0],
                data[i][3]
            ]);
            winddata.push([
                data[i][0],
                data[i][4] * 1.852,
                data[i][5]
            ]);
            winddirectiondata.push([
                data[i][0],
                data[i][5]
            ]);
        }
        // console.log("fogdataCal")
        // console.log(fogdata);
        // console.log("fogdataCalover")
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(data[dataLength-1][0]/1000);
        // console.log(fogdata2)

        $.ajax({url: "apis/predict.php?stime="+d.toLocaleString()+"&station="+cityid+"&model="+model, async: false,success: function(data){
            // console.log(data)
            var data = JSON.parse(data)
            datalen = data.length
            for (i = 0 ; i < datalen; i += 1) {
                    fogdata2.push([
                        data[i][0],
                        data[i][1]
                    ]);
                    temperaturedata.push([
                        data[i][0],
                        null
                    ]);
                    humiditydata.push([
                        data[i][0],
                        null
                    ]);
                    winddata.push([
                        data[i][0],
                        null,
                       null
                    ]);
                    winddirectiondata.push([
                        data[i][0],
                        null
                    ]);
          }
        }});
        console.log(fogdata2)

        var current = []
        current.push(fogdata[dataLength - 1][1].toFixed(2));
        current.push(temperaturedata[dataLength - 1][1].toFixed(2))
        current.push(humiditydata[dataLength - 1][1].toFixed(2))
        current.push(winddata[dataLength - 1][1].toFixed(2))
        current.push(winddata[dataLength - 1][2])
        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Prediction Model: '+model+'</div><div>Current Values: </div><div style="color:red">Visibility: ' + fogdata[dataLength - 1][1].toFixed(2) + " km   </div><div>Temperature: " + temperaturedata[dataLength - 1][1].toFixed(2) + "°C    </div><div>Relative Humidity: " + humiditydata[dataLength - 1][1].toFixed(2) + "%    </div><div>Wind: " + winddata[dataLength - 1][1].toFixed(2) + "Km/h " + winddata[dataLength - 1][2] + "°N" + " </div></div>   ";
        document.getElementById('mapFog-section').style["display"] = "block";

        document.getElementById('Temperature-section').style["display"] = "block";
        document.getElementById('Humidity-section').style["display"] = "block";
        document.getElementById('Wind-section').style["display"] = "block";

        fogFunction(cityid, fogdata, fogdata2, temperaturedata, humiditydata, winddata, winddirectiondata, current,model)
    });

    Highcharts.setOptions({
        time: {
            timezoneOffset: -11 * 60
        }
    });
}

function fogFunction(cityid, fogdata, fogdata2, temperaturedata, humiditydata, winddata, winddirectiondata, current,model) {
    var charts = []
    // console.log(fogdata2[0][0],fogdata2[fogdata2.length-1][0])
    charts.push(
        Highcharts.stockChart('Fog', {
                chart: {
                    height: 350,
                    plotBackgroundColor: { //define bg gradient
                        linearGradient: [0, 0, 0, 320],
                        stops: [
                            [0.85, 'rgb(255,255,255)'],
                            [0.85001, 'rgb(255, 248, 238)'],
                            // [0.93, 'rgb(255, 248, 238)'],
                            // [0.9300001, 'rgb(255, 241, 220)'],
                            // [0.66, 'rgb(255, 242, 222)'],
                            // [0.6600001, 'rgb(255, 230, 193)'],
                            // [0.74, 'rgb(255, 230, 193)'],
                            // [0.7400001, 'rgb(255, 210, 140)'],
                            // [0.82, 'rgb(255, 210, 140)'],
                            // [0.8200001, 'rgb(255, 172, 102)']
                        ]
                    },
                    panning: false
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
                    inputEnabled: true,
                    selected: 0,


                },
                title: {
                    text: 'Visibility (km)',
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
                                    k = charts[0].series[charts[0].hoverSeries._i].points[0].index;

                                    if (charts[0].hoverSeries._i == 0) {
                                        console.log(charts[0])
                                        var store = []
                                        store.push(this.y)
                                        for (var i = 1; i < charts.length; i++) {
                                            // charts[i].series[0].points[this.index - k].setState('hover');
                                            charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])
                                            console.log(charts[i])
                                            store.push(charts[i].series[0].points[this.index - k].y)
                                            if (i == 3)
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
                                        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Prediction Model: '+model+'</div><div>Pointed Values:</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(2) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + "Km/h " + store[4] + "°N" + " </div></div>   ";
                                    } else if (charts[0].hoverSeries._i == 1) {
                                        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Prediction Model: '+model+'</div><div style="color:green">Predicted Visibility: ' + charts[0].series[1].points[this.index - k].y.toFixed(2) + " km</div><div>";

                                    }
                                },
                                mouseOut: function(e) {
                                    k = charts[0].series[0].points[0].index;
                                    for (var i = 1; i < charts.length; i++) {
                                        charts[i].xAxis[0].removePlotLine('xPlotLine');
                                        charts[i].tooltip.hide();
                                    }
                                    // document.getElementById("data-detail").innerHTML = "<h3><div>Prediction Model: "+model+"</div><div>Current Values:</div><div>Visibility: " + current[0] + " km   <\div><div>Temperature: " + current[1] + "°C    <\div><div>Relative Humidity: " + current[2] + "%    <\div><div>Wind: " + current[3] + "Km/h " + current[4] + "°N" + " <\div></h3>   ";
                                    document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Prediction Model: '+model+'</div><div>Current Values:</div><div style="color:red">Visibility: ' + current[0] + " km   </div><div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + "Km/h " + current[4] + "°N" + " </div></div>   ";
                                    
                                }
                            }
                        }
                    }
                },
                xAxis: {
                    plotLines: [{
                        color: '#FF0000', // Red
                        width: 2,
                        value: fogdata[fogdata.length - 1][0],
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
                    min: 0,
                    max: 6,
                    gridLineWidth: 0,
                    labels: {
                        align: 'right',
                        x: -5
                    },
                    plotLines: [{
                        value: 1,
                        width: 3,
                        color: '#f9a747',
                        label: {
                            text: '<div data-toggle="modal" class="line_allowable btn_toggle" href="#modal-form1"><span>Fog</span></div>',
                            useHTML: true,
                            style: {
                                color: 'rgb(255, 172, 102)',
                            },
                            align: 'right',
                            x: -10,
                            y: -10,
                            events: {
                                redraw: function() {
                                    alert('The chart is being redrawn');
                                }
                            }
                        },
                    }],
                    top: '0%',
                    height: '100%',
                    offset: 10,
                    lineWidth: 0,
                    opposite: false,
                    resize: {
                        enabled: true
                    }

                }],

                series: [{
                        name: 'Fog',
                        data: fogdata,
                        type: 'spline',
                        tooltip: {
                            pointFormat: '{point.y}',
                            valueDecimals: 2
                        },
                        yAxis: 0,
                        dataGrouping: {
                            approximation: 'average'
                        }

                    },
                    {
                        name: 'Fog_prediction',
                        data: fogdata2,
                        type: 'spline',
                        tooltip: {

                            pointFormat: '{point.y}',
                            valueDecimals: 2
                        },
                        yAxis: 0,
                        color: 'green',
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
        Highcharts.stockChart('Temperature', {
            chart: {
                height: 200
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
                // inputEnabled: true,
                selected: 0,
                enabled: false
            },
            title: {
                text: 'Temperature (°C)',
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

                            },
                            mouseOut: function(e) {
                                k = charts[1].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 1)
                                        continue;
                                    charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    charts[i].tooltip.hide();
                                }

                            }
                        }
                    }
                }
            },
            xAxis: {
                // plotLines: [{
                //     color: '#FF0000', // Red
                //     width: 2,
                //     value: 1579478400000
                // }]
                min: (fogdata2.length==0)?fogdata[fogdata.length-1][0]-86400000:fogdata2[fogdata2.length-1][0]-86400000
            },
            yAxis: [{
                    min: 0,
                    max: 50,
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
                    opposite: false,
                    resize: {
                        enabled: true
                    }
                }

            ],
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
                },
                enabled: false
            }
        })
    );
    charts.push(
        Highcharts.stockChart('Humidity', {
            chart: {
                height: 200
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
                // plotLines: [{
                //     color: '#FF0000', // Red
                //     width: 2,
                //     value: 1579478400000
                // // }]
                min: (fogdata2.length==0)?fogdata[fogdata.length-1][0]-86400000:fogdata2[fogdata2.length-1][0]-86400000,
                // max: fogdata2[fogdata2.length-1][0]+86400000
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

                            },
                            mouseOut: function(e) {
                                k = charts[2].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 2)
                                        continue;
                                    charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    charts[i].tooltip.hide();
                                }

                            }
                        }
                    }
                }
            },
            yAxis: [{
                min: 0,
                max: 100,
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
                height: 200
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
                text: 'Wind (km/h)',
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

                            },
                            mouseOut: function(e) {
                                k = charts[3].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 3)
                                        continue;
                                    charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    charts[i].tooltip.hide();
                                }

                            }
                        }
                    }
                }
            },
            xAxis: {
                // plotLines: [{
                //     color: '#FF0000', // Red
                //     width: 2,
                //     value: 1579478400000
                // }]
                min: (fogdata2.length==0)?fogdata[fogdata.length-1][0]-86400000:fogdata2[fogdata2.length-1][0]-86400000
            },
            yAxis: [{
                min: 0,
                max: 10,
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
}
arr =["Agartala", "Agatti Island", "Agra", "Ahmedabad", "Aizwal", "Allahabad", "Amritsar", "Aurangabad", "Baghdogra", "Kempegowda Bangalore ","HAL Airport Bangalore", "Baroda", "Belgaum", "Belgaum Airport", "Bhaunagar", "Bhopal", "Bhubaneswar", "Bhuj", "Calicut", "Chandigarh", "Coimbatore", "Cooch-behar", "Cuddapah", "Dehra Dun", "Indira Gandhi Delhi", "Safdarjung  Delhi", "Dimapur", "Durgapur", "Fursatganj", "Gaya", "Goa dabolim", "Gorakhpur","Guwahati", "Gwalior", "Hubli", "Begumpet  Hyderabad", "Rajiv Gandhi Hyderabad", "Imphal", "Indore", "Jabalpur", "Jaipur", "Jammu", "Jamshedpur", "Jharsuguda","Jodhpur", "Jorhat", "Kangra", "Kannur", "Khajuraho", "Kochi", "Kolhapur", "Kolkata", "Kota", "Kulu", "Leh", "Lilabari", "Lucknow", "Ludhiaha", "Madras","Madurai", "Mangalore", "Mohanbari", "Juhu Mumbai", "Chhatrapati Mumbai", "Mysore", "Nagpur", "Nainital", "Nanded", "Patina", "Pendicherry", "Porbandar","Port Blair", "Pune", "Swami Vivekananda Raipur", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Salem", "Shillong", "Shimla", "Shirdi", "Srinagar", "Surat","Tezpur", "Thoise", "Tiruchirappalli", "Tirupeti", "Trivandrum", "Tuticorin", "Udaipur", "Khajuraho ", "Unknown", "Varanasi", "Lal Bahadur Varanasi", "Vijayawada", "Vizagapatam"]

// arr = ["Bhandup","Mumbai","Visakhapatnam","Coimbatore","Delhi","Bangalore","Pune","Nagpur","Lucknow","Vadodara","Indore","Jalalpur","Bhopal","Kolkata","Kanpur","New Delhi","Faridabad","Rajkot","Ghaziabad","Chennai","Meerut","Agra","Jaipur","Jabalpur","Varanasi","Allahabad","Hyderabad","Noida","Howrah","Thane","Patiala","Chakan","Ahmedabad","Manipala","Mangalore","Panvel","Udupi","Rishikesh","Gurgaon","Mathura","Shahjahanpur","Bagpat","Sriperumbudur","Chandigarh","Ludhiana","Palakkad","Kalyan","Valsad","Ulhasnagar","Bhiwani","Shimla","Dehradun","Patna","Unnao","Tiruvallur","Kanchipuram","Jamshedpur","Gwalior","Karur","Erode","Gorakhpur","Ooty","Haldwani","Bikaner","Puducherry","Nalbari","Bellary","Vellore","Naraina","Mandi","Rupnagar","Jodhpur","Roorkee","Aligarh","Indraprast","Karnal","Tanda","Amritsar","Raipur","Pilani","Bilaspur","Srinagar","Guntur","Kakinada","Warangal","Tirumala - Tirupati","Nizamabad","Kadapa","Kuppam","Anantpur","Nalgonda","Potti","Nellore","Rajahmundry","Bagalkot","Kurnool","Secunderabad","Mahatma","Bharuch","Miraj","Nanded","Anand","Gandhinagar","Bhavnagar","Morvi","Aurangabad","Modasa","Patan","Solapur","Kolhapur","Junagadh","Akola","Bhuj","Karad","Jalgaon Jamod","Chandrapur","Maharaj","Dhule","Ponda","Dahod","Navsari","Panjim","Patel","Nashik","Amravati","Somnath","Ganpat","Karwar","Davangere","Raichur","Nagara","Kushalnagar","Hassan","Hubli","Bidar","Belgaum","Mysore","Dharwad","Kolar","TumkÅ«r","Tiruchi","Thiruvananthapuram","Kozhikode","Thrissur","Madurai","Thalassery","Kannur","Karaikudi","Thanjavur","Manor","Idukki","Thiruvarur","Alappuzha","Gandhigram","Kochi","Annamalainagar","Amet","Kottarakara","Kottayam","Tirunelveli","Mohan","Salem","Attingal","Chitra","Chengannur","Guwahati","Kalam","Ranchi","Shillong","Gangtok","Srikakulam","Tezpur","Bhubaneswar","Imphal","Sundargarh","Arunachal","Manipur","Bihar Sharif","Mandal","Dibrugarh","Darbhanga","Gaya","Bhagalpur","Kunwar","Barddhaman","Jadabpur","Kalyani","Cuttack","Barpeta","Jorhat","Kharagpur","Medinipur","Agartala","Saranga","Machilipatnam","Dhanbad","Silchar","Dumka","Kokrajhar","Bankura","Jalpaiguri","Durgapur","Kalinga","Palampur","Jammu","Dwarka","Faridkot","Udaipur","Raigarh","Hisar","Solan","Ajmer","Lala","Gurdaspur","Sultanpur","Jhansi","Vidisha","Jagdalpur","Dipas","Sawi","Etawah","Saharanpur","Ujjain","Kangra","Bhilai","Rohtak","Haryana","Ambala","Bareilly","Bhoj","Kapurthala Town","Sangrur","Pusa","Sagar","Rewa","Bhawan","Rampur","Bhadohi","Cuddalore","Khopoli","Bali","Bhiwandi","Vasai","Badlapur","Sambalpur","Raurkela","Brahmapur","Visnagar","Surendranagar","Ankleshwar","Dahanu","Silvassa","Jamnagar","Dhansura","Muzaffarpur","Wardha","Bodhan","Parappanangadi","Malappuram","Vizianagaram","Mavelikara","Pathanamthitta","Satara","Janjgir","Gold","Himatnagar","Bodinayakkanur","Gandhidham","Mahabalipuram","Nadiad","Virar","Bahadurgarh","Kaithal","Siliguri","Tiruppur","Ernakulam","Jalandhar","Barakpur","Kavaratti","Ratnagiri","Moga","Hansi","Sonipat","Bandra","Aizawl","Itanagar","Nagar","Ghatkopar","Chen","Powai","Bhimavaram","Bhongir","Medak","Karimnagar","Narsapur","Vijayawada","Markapur","Mancherial","Sangli","Moradabad","Alipur","Ichalkaranji","Devgarh","Yavatmal","Hinganghat","Madgaon","Verna","Katra","Bilaspur","Uttarkashi","Muktsar","Bhatinda","Pathankot","Khatauli","Vikasnagar","Kollam","Kovilpatti","Kovvur","Paloncha","Vasco","Alwar","Bijapur","Tinsukia","Ratlam","Kalka","Ladwa","Rajpura","Batala","Hoshiarpur","Katni","Bhilwara","Jhajjar","Lohaghat","Mohali","Dhuri","Thoothukudi","Sivakasi","Coonoor","Shimoga","Kayamkulam","Namakkal","Dharmapuri","Aluva","Antapur","Tanuku","Eluru","Balasore","Hingoli","Quepem","Assagao","Betim","Cuncolim","Ahmednagar","Goa","Caranzalem","Chopda","Petlad","Raipur","Villupuram","Shoranur","Dasua","Gonda","Yadgir","Palladam","Nuzvid","Kasaragod","Paonta Sahib","Sarangi","Anantapur","Kumar","Kaul","Panipat","Uppal","Teri","Tiruvalla","Jamal","Chakra","Narasaraopet","Dharamsala","Ranjan","Garhshankar","Haridwar","Chinchvad","Narela","Aurangabad","Sion","Kalamboli","Chittoor","Wellington","Nagapattinam","Karaikal","Pollachi","Thenkasi","Aranmula","Koni","Ariyalur","Ranippettai","Kundan","Lamba Harisingh","Surana","Ghana","Lanka","Kataria","Kotian","Khan","Salt Lake City","Bala","Vazhakulam","Paravur","Nabha","Ongole","Kaladi","Jajpur","Thenali","Mohala","Mylapore","Bank","Khammam","Ring","Maldah","Kavali","Andheri","Baddi","Mahesana","Nila","Gannavaram","Cumbum","Belapur","Phagwara","Rander","Siuri","Bulandshahr","Bilimora","Guindy","Pitampura","Baharampur","Dadri","Boisar","Shiv","Multi","Bhadath","Ulubari","Palghar","Puras","Sikka","Saha","Godhra","Dam Dam","Ekkattuthangal","Sahibabad","Kalol","Bardoli","Wai","Shirgaon","Nehra","Mangalagiri","Latur","Kottakkal","Rewari","Ponnani","Narayangaon","Hapur","Kalpetta","Khurja","Ramnagar","Neral","Sendhwa","Talegaon Dabhade","Kargil","Manali","Jalalabad","Palani","Sirkazhi","Krishnagiri","Hiriyur","Muzaffarnagar","Kashipur","Gampalagudem","Siruseri","Manjeri","Raniganj","Mahim","Bhusawal","Tirur","Sattur","Angul","Puri","Khurda","Dharavi","Ambur","Vashi","Arch","Colaba","Hosur","Kota","Hugli","Anantnag","Murshidabad","Jharsuguda","Jind","Neyveli","Vaniyambadi","Srikalahasti","Liluah","Pali","Bokaro","Sidhi","Asansol","Darjeeling","Kohima","Shahdara","Chandannagar","Nadgaon","Haripad","Sitapur","Vapi","Bambolim","Baidyabati","Connaught Place","Singtam","Shyamnagar","Sikar","Choolai","Mayapur","Puruliya","Habra","Kanchrapara","Goregaon","Tiptur","Kalpakkam","Serampore","Konnagar","Port Blair","Canning","Mahad","Alibag","Pimpri","Panchgani","Karjat","Vaikam","Mhow","Lakhimpur","Madhoganj","Kheri","Gudivada","Avanigadda","Nayagarh","Bemetara","Bhatapara","Ramgarh","Dhubri","Goshaingaon","Bellare","Puttur","Narnaul","Porbandar","Keshod","Dhrol","Kailaras","Morena","Deolali","Banda","Orai","Fatehpur","Mirzapur","Adilabad","Pithapuram","Ramavaram","Amalapuram","Champa","Ambikapur","Korba","Pehowa","Yamunanagar","Shahabad","Hamirpur","Gulbarga","Sagar","Bhadravati","Sirsi","Honavar","Siruguppa","Koppal","Gargoti","Kankauli","Jalna","Parbhani","Koraput","Barpali","Jaypur","Banswara","Tindivanam","Mettur","Srirangam","Deoria","Basti","Padrauna","Budaun","Bolpur","Gujrat","Balurghat","Binnaguri","Guruvayur","Chandauli","Madikeri","Piduguralla","Vinukonda","Berasia","Sultans Battery","Ramanagaram","Angadipuram","Mattanur","Gobichettipalayam","Banga","Sibsagar","Namrup","North Lakhimpur","Dhenkanal","Karanja","Cheyyar","Vandavasi","Arakkonam","Tiruvannamalai","Akividu","Tadepallegudem","Madanapalle","Puttur","Edavanna","Kodungallur","Marmagao","Sanquelim","Sakri","Shahdol","Satna","Thasra","Bundi","Kishangarh","Firozpur","Kot Isa Khan","Barnala","Sunam","Pithoragarh","Jaspur","Jhargram","Dimapur","Churachandpur","Raxaul","Motihari","Munger","Purnea","Mannargudi","Kumbakonam","Eral","Nagercoil","Kanniyakumari","Ramanathapuram","Sivaganga","Rajapalaiyam","Srivilliputhur","Suratgarh","Gohana","Sirsa","Fatehabad","Nurpur","Chamba","Khergam","Dindigul","Pudukkottai","Kaimganj","Tarn Taran","Khanna","Irinjalakuda","Sehore","Parra","Dicholi","Chicalim","Saligao","Changanacheri","Igatpuri","Sangamner","Ganganagar","Kanhangad","Chidambaram","Chittur","Nilambur","Arvi","Jalesar","Kasganj","Chandausi","Beawar","Bharatpur","Kathua","Chalisgaon","Karamsad","Peranampattu","Arani","Payyanur","Pattambi","Pattukkottai","Pakala","Vikarabad","Bhatkal","Rupnarayanpur","Kulti","Koch Bihar","Nongstoin","Budbud","Balangir","Kharar","Mukerian","Mansa","Punalur","Mandya","Nandyal","Dhone","Candolim","Aldona","Solim","Daman","Koothanallur","Sojat","Alanallur","Kagal","Jhunjhunun","Sirhind","Kurali","Khinwara","Machhiwara","Talwandi Sabo","Malpur","Dhar","Medarametla","Pileru","Yercaud","Ottappalam","Alangulam","Palus","Chiplun","Durg","Damoh","Ambarnath","Haveri","Mundgod","Mandvi","Behala","Fort","Bela","Balana","Odhan","Mawana","Firozabad","Bichpuri","Almora","Pauri","Azamgarh","Phaphamau","Nongpoh","Gangrar","Jhalawar","Nathdwara","Jaisalmer","Pushkar","Sirohi","Baroda","Ambah","Ambejogai","Ambad","Osmanabad","Betalbatim","Gangapur","Dindori","Yeola","Pandharpur","Neri","Umred","Patelguda","Patancheru","Singarayakonda","Peddapuram","Gadag","ChikmagalÅ«r","Chikodi","Amer","Chintamani","Tambaram","Palayam","Karamadai","Omalur","Kuzhithurai","Faizabad","Thirumangalam","Kodaikanal","Devipattinam","Dharapuram","Rudrapur","Talcher","Haldia","Karsiyang","Sandur","Bapatla","Shamsabad","Kandi","Ramapuram","Anchal","Trimbak","Calangute","Arpora","Khargone","Mandla","Kalan","Pachmarhi","Dhamtari","Kumhari","Aundh","Tala","Tuljapur","Botad","Sidhpur","Sanand","Nagwa","Mussoorie","Vadamadurai","Sholavandan","Pochampalli","Perundurai","Lalgudi","Ponneri","Mount Abu","Vadner","Shanti Grama","Nalagarh","Pahalgam","Dinanagar","Jatani","Ganga","Barmer","Hoshangabad","Khajuraho Group of Monuments","Betul","Sangola","Tirumala","Mirza Murad","Attur","Budha","Pala","Tonk","Koni","Rajpur","Shrigonda","Hazaribagh","Nagaur","Mandapeta","Nabadwip","Nandurbar","Nazira","Kasia","Bargarh","Kollegal","Shahkot","Jagraon","Channapatna","Madurantakam","Kamalpur","Ranaghat","Mundra","Mashobra","Rama","Chirala","Bawana","Dhaka","Mahal","Chitradurga","Mandsaur","Dewas","Sachin","Andra","Kalkaji Devi","Pilkhuwa","Mehra","Chhachhrauli","Samastipur","Bangaon","Ghatal","Jayanti","Belgharia","Kamat","Dhariwal","Morinda","Kottagudem","Suriapet","Mahesh","Sirwani","Kanakpura","Mahajan","Sodhi","Chand","Nagal","Hong","Raju","Tikamgarh","Parel","Jaynagar","Mill","Khambhat","Ballabgarh","Begusarai","Shahapur","Banka","Golaghat","Palwal","Kalra","Chandan","Maru","Nanda","Chopra","Kasal","Rana","Chetan","Charu","Arora","Chhabra","Bishnupur","Manu","Karimganj","Ellora Caves","Adwani","Amreli","Soni","Sarwar","Balu","Rawal","Darsi","Nandigama","Mathan","Panchal","Jha Jha","Hira","Manna","Amal","Kheda","Abdul","Roshan","Bhandari","Binavas","Hari","Nandi","Rajapur","Suman","Sakri","Khalapur","Dangi","Thiruthani","Bawan","Basu","Kosamba","Medchal","Kakdwip","Kamalpura","Dogadda","Charan","Basirhat","Nagari","Kangayam","Sopara","Nadia","Mahulia","Alipur","Hamirpur","Fatehgarh","Bagh","Naini","Karari","Ajabpur","Jaunpur","Iglas","Pantnagar","Dwarahat","Dasna","Mithapur","Bali","Nilokheri","Kolayat","Haripur","Dang","Chhota Udepur","Matar","Sukma","Guna","Dona Paula","Navelim","Vainguinim","Curchorem","Balaghat","Bhagwan","Vijapur","Sinnar","Mangaon","Hadadi","Bobbili","Yanam","Udaigiri","Balanagar","Kanigiri","Muddanuru","Panruti","Proddatur","Puliyur","Perambalur","Turaiyur","Tiruchchendur","Shadnagar","Markal","Sultan","Rayagada","Kaniyambadi","Vandalur","Sangam","Katoya","Gudur","Farakka","Baramati","Tohana"];
// arr = ["Palam,Delhi", "Agartala", "Agatti Island", "Agra", "Ahmedabad", "Aizwal", "Allahabad", "Amritsar", "Aurangabad", "Baghdogra", "Bangalore", "Bangalore", "Baroda", "Belgaum", "Belgaum", "Bhaunagar", "Bhopal", "Bhubaneswar", "Bhuj", "Calicut", "Chandigarh", "Coimbatore", "Cooch-behar", "Cuddapah", "Dehra Dun", "Safdarjung,Delhi", "Dimapur", "Durgapur", "Fursatganj", "Gaya", "Goa\/dabolim", "Gorakhpur", "Guwahati", "Gwalior", "Hubli", "Hyderabad", "Hyderabad", "Imphal", "Indore", "Jabalpur", "Jaipur", "Jammu", "Jamshedpur", "Jharsuguda", "Jodhpur", "Jorhat", "Kangra", "Kannur", "Khajuraho", "Kochi", "Kolhapur", "Kolkata", "Kota", "Kulu", "Leh", "Lilabari", "Lucknow", "Ludhiaha", "Madras", "Madurai", "Mangalore", "Mohanbari", "Mumbai", "Mumbai", "Mysore", "Nagpur", "Nainital", "Nanded", "Patina", "Pendicherry", "Porbandar", "Port Blair", "Pune", "Raipur", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Salem", "Shillong", "Shimla", "Shirdi", "Srinagar", "Surat", "Tezpur", "Thoise", "Tiruchirappalli", "Tirupeti", "Trivandrum", "Tuticorin", "Udaipur", "Unknown", "Unknown", "Varanasi", "Varanasi", "Vijayawada", "Vizagapatam"];
autocomplete(document.getElementById("myInput"));

function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    // console.log("enter autocomplete");

    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        pn = document.getElementById(this.id).parentElement;

        /*create a DIV element that will contain the items (values):*/

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items container ");
        /*append the DIV element as a child of the autocomplete container:*/
        pn.parentNode.appendChild(a);
        console.log(arr[0]);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                // b.setAttribute("class","shape shape-primary")
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

function chartmake(cityname) {
    // console.log(document.getElementById("latlong").value);
    var position = document.getElementById("latlong").value;
    // console.log("makechart");
    var jsonObj = {
        "type": "map",
        // "pathToImages": "http://www.amcharts.com/lib/3/images/",
        "addClassNames": true,
        "fontSize": 15,
        "color": "#FFFFFF",
        "projection": "mercator",
        "backgroundAlpha": 1,
        "backgroundColor": "rgba(238, 249, 235,1)",
        "balloonText": cityname,
        "dataProvider": {
            "map": "indiaLow",
            "getAreasFromMap": true,
            "images": [{
                "selectable": true,
                "longitude": position.lng,
                "latitude": position.lat - 0.43,
                "type": "circle",
                "labelPosition": "bottom",
                "color": "rgba(75,216,181,0.8)",
                "scale": 1,
                "rollOverScale": 1.5,
                "labelRollOverColor": "rgba(255,255,255,1)"
            }]
        },
        "areasSettings": {
            "color": "rgba(254, 94, 86,1)",
            "outlineColor": "rgba(80,80,80,1)",
            "rollOverOutlineColor": "rgba(80,80,80,1)",
            "rollOverBrightness": 20,
            "selectedBrightness": 20,
            "selectable": true,
            "unlistedAreasAlpha": 0,
            "unlistedAreasOutlineAlpha": 0
        },
        "imagesSettings": {
            "alpha": 1,
            "color": "rgba(129,129,129,1)",
            "outlineAlpha": 0,
            "rollOverOutlineAlpha": 0,
            "outlineColor": "rgba(80,80,80,1)",
            "rollOverBrightness": 20,
            "selectedBrightness": 20,
            "selectable": true
        },
        "linesSettings": {
            "color": "rgba(129,129,129,1)",
            "selectable": true,
            "rollOverBrightness": 20,
            "selectedBrightness": 20
        },
        "zoomControl": {
            "zoomControlEnabled": true,
            "homeButtonEnabled": true,
            "panControlEnabled": false,
            "right": 38,
            "bottom": 30,
            "minZoomLevel": 1,
            "gridHeight": 100,
            "gridAlpha": 0.1,
            "gridBackgroundAlpha": 0,
            "gridColor": "#FFFFFF",
            "draggerAlpha": 1,
            // "buttonCornerRadius": 2  
        }
    };
    jsonObj.dataProvider.images[0].label = cityname;
    var chart = AmCharts.makeChart('map1', jsonObj);
    console.log(chart);
}

// function getPos(cityname) {

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             console.log("getpos")
//             document.getElementById("latlong").value = JSON.parse(this.responseText).results[0].locations[0].latLng;
//         }
//     };
//     xhttp.open("GET", "http://www.mapquestapi.com/geocoding/v1/address?key=ZobdG7AfsnApjess0GyWup5ml94qG4uA&location=" + cityname, false);
//     xhttp.send();
//     // document.getElementById("latlong").value= JSON.parse(xhttp.responseText).results[0].locations[0].latLng;
// }
function getPos(cityname) {
    $.ajax({url: "apis/position.php?cityid="+cityname, async: false,success: function(data){
        // console.log(data)
        var data = JSON.parse(data)
        datalen = data.length
        document.getElementById("latlong").value = data;
      }
    });   
}
function downloadFile() {
    var sdate = document.getElementById("startDate").value;
    var edate = document.getElementById("endDate").value;
    var cName = document.getElementById("myInput").value;

    $.ajax({
        url: 'apis/download.php?station=' + cName + '&sdate=' + sdate + '&edate=' + edate,
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function(data) {

            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = cName + '.csv';
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    });

}

$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});

