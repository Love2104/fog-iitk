#!/usr/bin/env node

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
    document.getElementById('cityname').innerHTML = "Location: " + a;

    highChartFunc(cityname,model);
    chartmake(cityname);
}
function onModelChange(element){
    // $("#page").LoadingOverlay("show");
    var cityname = document.getElementById("myInput").value;
    var model = element.getAttribute("modelno");
    highChartFunc(cityname,model);
    // $("#page").LoadingOverlay("hide");
    
}
var arra=[]
var arr=[]
$(document).ready(function() {
    $.ajax({
        url: "apis/map.php",
        async: "false",
        success: function(result) {
            arr=[]
            data = JSON.parse(result)
            var datalen = data.length
            for (i = 0; i < datalen; i += 1) {
                arra.push([data[i][0], data[i][1], data[i][2]])
                arr.push(data[i][0])
            }
        }
});
})
function loaddata(model) {
    //var model= element.getAttribute("modelno");
    //document.getElementById("model-choose").textContent = t;
    // $("#page").LoadingOverlay("show");
    // var arra = []
    $.ajax({
        url: "apis/map.php",
        async: "false",
        success: function(result) {
            arr=[]
            data = JSON.parse(result)
            var datalen = data.length
            for (i = 0; i < datalen; i += 1) {
                arra.push([data[i][0], data[i][1], data[i][2]])
                arr.push(data[i][0])
            }
            cityname = document.getElementById("myInput").value;
            a = document.getElementById("myInput").value;
            getPos(cityname);
            console.log("checkcity");
            if (a == ""){
                // $("#page").LoadingOverlay("hide");
                return;
            }
                
            document.getElementById('cityname').innerHTML = "Location: " + a;

            highChartFunc(cityname,model);
            chartmake(cityname, arra);
        }
    })
    // $("#page").LoadingOverlay("hide");
}
function formatDate(val) {
    var utcSeconds = val/1000+19800;
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds)

    return d.toLocaleString(navigator.language, {day:'2-digit', month:'2-digit', year:'numeric' ,hour: '2-digit', minute:'2-digit'})
}

function iitdata(cityid,model){
    var fogdata=Array(),mor_inst=Array(),fogdata2=Array(),fogdata3=Array();
    var d=new Date()
    var end=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
    $.ajax({url: "apis/iitdata.php?stime=2022-01-08 21:59:30&etime="+end, async: false,
        success: function(data){
            //console.log(data);
            var data = JSON.parse(data)
            datalen = data.length
            for (i = 0 ; i < datalen; i += 1) {
                if(data[i][1]==0){
                    fogdata.push([
                        data[i][0]*1000-2* 5.5 * 36 * 100000,
                        data[i][2]
                    ]);
                    mor_inst.push([
                        data[i][0]*1000-2* 5.5 * 36 * 100000,
                        data[i][3]
                    ]);
                }
                else{
                    fogdata.push([
                        (data[i][0]+1800)*1000-2* 5.5 * 36 * 100000,
                        data[i][2]
                    ]);
                    mor_inst.push([
                        (data[i][0]+1800)*1000-2* 5.5 * 36 * 100000,
                        data[i][3]
                    ]);
                }

            }
            //console.log(data[datalen-1][0]- 2*5.5 * 36 * 100)
            d.setUTCSeconds(data[datalen-1][0]+(data[datalen-1][1]*1800)- 2*5.5 * 36 * 100);
        }
        
    });
   
       
    $.ajax({url: "apis/newpred.php?stime="+d.toUTCString()+"&station="+cityid+"&model="+model, async: false,success: function(data){
       // console.log(data)
        var data = JSON.parse(data)
        datalen = data.length
        for (i = 0 ; i < datalen; i += 1) {
                fogdata2.push([
                    data[i][0],
                    data[i][1]
                ]);
      }
    }});
    $.ajax({url: "apis/newpred.php?stime="+d.toUTCString()+"&station="+cityid+"&model="+6, async: false,success: function(data){
        //console.log(data)
        var data = JSON.parse(data)
        datalen = data.length
        for (i = 0 ; i < datalen; i += 1) {
                fogdata3.push([
                    data[i][0],
                    data[i][1]
                ]);
            }
    }});
   // console.log(fogdata2,fogdata3)
    if(fogdata2.length>0 && fogdata2[0][0]!=fogdata[fogdata.length-1][0])
        fogdata2.unshift(fogdata[fogdata.length-1])
    else if(fogdata2.length>0)
        fogdata2[0]=fogdata[fogdata.length-1]
    //console.log(fogdata2)
    if(fogdata3.length>0 && fogdata3[0][0]!=fogdata[fogdata.length-1][0])
        fogdata3.unshift(fogdata[fogdata.length-1])
    else if(fogdata3.length>0)
        fogdata3[0]=fogdata[fogdata.length-1]
    //console.log(fogdata3)
    //console.log(mor_inst);
    var charts = []
    charts.push(
        Highcharts.stockChart('Fog', {
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
                    enabled: true,
                    height:30
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
                        fontSize: "20px",
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
                                // mouseOver: function(e) {
                                //     k = charts[0].series[charts[0].hoverSeries._i].points[0].index;
					
                                //     if (charts[0].hoverSeries._i == 0) {
                                //         console.log(charts[0])
                                //         var store = [],time=0;
                                //         store.push(this.y)
                                //         for (var i = 1; i < charts.length; i++) {
                                //             // charts[i].series[0].points[this.index - k].setState('hover');
                                //             charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])
                                //             console.log(charts[i])
                                //             store.push(charts[i].series[0].points[this.index - k].y)
                                //             if (i == 3)
                                //                 if (charts[i].series[0].points[this.index - k].z == null)
                                //                     store.push(0);
                                //                 else
                                //                     store.push(charts[i].series[0].points[this.index - k].z)
                                //             charts[i].xAxis[0].addPlotLine({
                                //                 id: 'xPlotLine',
                                //                 value: this.x,
                                //                 width: 1,
                                //                 color: '#C0C0C0'
                                //             });
                
                                //         }
                                //         document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(this.x)+'</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(0) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + " km/h</div><div>Wind direction: " + store[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4]+"deg)'></i></span> </div></div>   ";
                                //     } else if (charts[0].hoverSeries._i == 1) {
                                //         document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div style="color:green">Predicted Visibility: ' + charts[0].series[1].points[this.index - k].y.toFixed(2) + " km</div><div>";

                                //     }
                                //     $(".highcharts-markers path").attr('visibility', 'visible')
                                // },
                                // mouseOut: function(e) {
                                //     k = charts[0].series[0].points[0].index;
                                //     for (var i = 1; i < charts.length; i++) {
                                //         charts[i].series[0].markerGroup.visibility="none"
                                //         charts[i].xAxis[0].removePlotLine('xPlotLine');
                                //         charts[i].tooltip.hide();
                                //     }
                                //     //document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(current[5])+'</div><div style="color:red">Visibility: ' + current[0] + " km   </div><div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + " km/h</div><div>Wind direction: " + current[4] +"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span> </div></div>   ";
                                //     $(".highcharts-markers path").attr('visibility', 'hidden')
                                // }
                            }
                        }
                    }
                },
                yAxis: [{
                    min: 0,
                    // max: 6,
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
                    width: 2,
                    color: 'red',
                    label: {
                        text: '<div data-toggle="modal" class="line_allowable btn_toggle" href="#modal-form1"><span>Fog</span></div>',
                        useHTML: true,
                        style: {
                            color: 'rgb(255, 172, 102)',
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

                xAxis: {
                    plotLines: [{
                        color: 'rgb(255,170,20)', // Red
                        width: 2,
                        value: fogdata[fogdata.length - 1][0],
                        zIndex:1
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
                        name: 'Fog prediction',
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
                    ,
                    {
                        name: 'Fog prediction rolling_mean',
                        data: fogdata3,
                        type: 'spline',
                        tooltip: {

                            pointFormat: '{point.y}',
                            valueDecimals: 2
                        },
                        yAxis: 0,
                        dataGrouping: {
                            approximation: 'average'
                        }

                    }
                ],
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
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
            $("#Temperature").empty();
            $("#Humidity").empty();
            $("#Wind").empty();
            $("#page").LoadingOverlay("hide");
}

function highChartFunc(cityid,model) {
    if(cityid=="IIT Kanpur"){
        iitdata(cityid,model)
        return
    }
    console.log(cityid);
    //Highcharts.getJSON('apis/database.php?station=' + cityid, function(alldata) {
        $.ajax({url: "apis/database.php?station=" + cityid, async: false,
        success: function(alldata){
            //console.log(alldata)
        var list=alldata.split(';')
        var data=JSON.parse(list[0])
        var data2=JSON.parse(list[1])
        //console.log(list[1])
        var fogdata = [],
            temperaturedata = [],
            humiditydata = [],
            winddata = [],
            winddirectiondata = [],
            fogdata2 = [],
            fogdata3=[],
            rainfall=[],
            dataLength2=data2.length,
            dataLength = data.length;
        console.log(dataLength,dataLength2)
        for (var i=0; i < dataLength2; i += 1) {
            rainfall.push([
                data2[i][0],
                data2[i][1] // data[i][1]==null?data[i-1][1]:data[i][1]
            ]);
        }
        for (var i=0; i < dataLength; i += 1) {
            fogdata.push([
                data[i][0],
                data[i][1] * 1.60934 // data[i][1]==null?data[i-1][1]:data[i][1]
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
    
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(data[dataLength-1][0]/1000);
        // console.log(fogdata2)

        $.ajax({url: "apis/newpred.php?stime="+d.toUTCString()+"&station="+cityid+"&model="+model, async: false,success: function(data){
            //console.log(data)
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
                    rainfall.push([
                        data[i][0],
                        null
                    ]);
          }
        }});
        $.ajax({url: "apis/newpred.php?stime="+d.toUTCString()+"&station="+cityid+"&model="+6, async: false,success: function(data){
            //console.log(data)
            var data = JSON.parse(data)
            datalen = data.length
            for (i = 0 ; i < datalen; i += 1) {
                    fogdata3.push([
                        data[i][0],
                        data[i][1]
                    ]);
                }
        }});
        if(fogdata2.length>0 && fogdata2[0][0]!=fogdata[fogdata.length-1][0])
            fogdata2.unshift(fogdata[fogdata.length-1])
        else if(fogdata2.length>0)
            fogdata2[0]=fogdata[fogdata.length-1]
        //console.log(fogdata2)
        if(fogdata3.length>0 && fogdata3[0][0]!=fogdata[fogdata.length-1][0])
            fogdata3.unshift(fogdata[fogdata.length-1])
        else if(fogdata3.length>0)
            fogdata3[0]=fogdata[fogdata.length-1]
        //console.log(fogdata3)
        

        var current = []
        current.push(fogdata[dataLength - 1][1].toFixed(2));
        current.push(temperaturedata[dataLength - 1][1].toFixed(0))
        current.push(humiditydata[dataLength - 1][1].toFixed(2))
        current.push(winddata[dataLength - 1][1].toFixed(2))
        current.push(winddata[dataLength - 1][2])
        current.push(fogdata[dataLength-1][0])
        if(dataLength2!=0){
            current.push(rainfall[dataLength2-1][1])
            document.getElementById('Rainfall-section').style["display"] = "block";
            
        }
        else{
            current.push('-')
            document.getElementById('Rainfall-section').style["display"] = "none";
            rainfall.push([0,'-'])
            dataLength2=rainfall.length
        }
        console.log(rainfall,dataLength2)
        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at: '+formatDate(fogdata[dataLength - 1][0])+'</div><div style="color:red">Visibility: ' + fogdata[dataLength - 1][1].toFixed(2) + " km   </div><div>Temperature: " + temperaturedata[dataLength - 1][1].toFixed(0) + "°C    </div><div>Relative Humidity: " + humiditydata[dataLength - 1][1].toFixed(2) + "%    </div><div>Wind: " + winddata[dataLength - 1][1].toFixed(2) + "km/h</div><div>Wind direction: " + winddata[dataLength - 1][2] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+winddata[dataLength - 1][2]+"deg)'></i></span></div><div>Rainfall: " + rainfall[dataLength2 - 1][1] + "mm    </div></div>   ";
        document.getElementById('mapFog-section').style["display"] = "block";
        document.getElementById('Temperature-section').style["display"] = "block";
        document.getElementById('Humidity-section').style["display"] = "block";
        document.getElementById('Wind-section').style["display"] = "block";
        //if(dataLength2!=0)
            
        

        fogFunction(cityid, fogdata, fogdata2,fogdata3, temperaturedata, humiditydata, winddata, winddirectiondata,rainfall, current,model)
        var renderTime = Date.now() - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    document.getElementById('other-section').style["display"] = "none";
    }   
    });

    Highcharts.setOptions({
        time: {
            timezoneOffset: -11 * 60
        }
    });
}

function fogFunction(cityid, fogdata, fogdata2,fogdata3, temperaturedata, humiditydata, winddata, winddirectiondata, rainfall, current,model) {
    var charts = []
    charts.push(
        Highcharts.stockChart('Visibility', {
                chart: {
                    height: 350,
                    panning: true,
                    events:{
                        load: function(){
                            
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
                    enabled: true,
                    height:30
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
                    // selected: 1,


                },
                title: {
                    text: 'Visibility (km)',
                    align: 'left',
                    style: {
                        fontSize: "20px",
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
                                    k = charts[0].series[charts[0].hoverSeries._i].points[0].index;
					
                                    if (charts[0].hoverSeries._i == 0) {
                                        //console.log(charts[0])
                                        var store = [],time=0;
                                        store.push(this.y)
                                        for (var i = 1; i < charts.length; i++) {
                                            // charts[i].series[0].points[this.index - k].setState('hover');
                                            charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])
                                            //console.log(charts[i])
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
                                        if(rainfall.length>100)
                                        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(this.x)+'</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(0) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + " km/h</div><div>Wind direction: " + store[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4]+"deg)'></i></span> </div> <div>Rainfall: " + store[5] + "mm    </div></div>   ";
                                        else
                                        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(this.x)+'</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(0) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + " km/h</div><div>Wind direction: " + store[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4]+"deg)'></i></span> </div> <div>Rainfall: - mm    </div></div>   ";

                                    } else if (charts[0].hoverSeries._i == 1) {
                                        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div style="color:green">Predicted Visibility: ' + charts[0].series[1].points[this.index - k].y.toFixed(2) + " km</div><div>";

                                    }
                                    $(".highcharts-markers path").attr('visibility', 'visible')
                                },
                                mouseOut: function(e) {
                                    k = charts[0].series[0].points[0].index;
                                    for (var i = 1; i < charts.length; i++) {
                                        charts[i].series[0].markerGroup.visibility="none"
                                        charts[i].xAxis[0].removePlotLine('xPlotLine');
                                        charts[i].tooltip.hide();
                                    }
                                    document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(current[5])+'</div><div style="color:red">Visibility: ' + current[0] + " km   </div><div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + " km/h</div><div>Wind direction: " + current[4] +"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span> </div><div>Rainfall: " + current[6] + "mm   </div></div>   ";
                                    $(".highcharts-markers path").attr('visibility', 'hidden')
                                }
                            }
                        }
                    }
                },
                yAxis: [{
                    min: 0,
                    // max: 6,
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
                    width: 2,
                    color: 'red',
                    label: {
                        text: '<div data-toggle="modal" class="line_allowable btn_toggle" href="#modal-form1"><span>Fog</span></div>',
                        useHTML: true,
                        style: {
                            color: 'rgb(255, 172, 102)',
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

                xAxis: [{
                    min:fogdata[fogdata.length - 1][0] - (18 * 3600 * 1000) ,
                    max: fogdata[fogdata.length - 1][0] + (6 * 3600 * 1000),
                    plotLines: [{
                        color: 'rgb(255,170,20)', // Red
                        width: 2,
                        value: fogdata[fogdata.length - 1][0],
                        zIndex:1
                    }],
                    events: {
                        afterSetExtremes: function(e) {
                            console.log(e)
                            console.log(fogdata[fogdata.length-1][0]+(6*3600000))
                            charts.forEach(function(chart, i) {
                                console.log(i)
                                if (i !== 0) {
                                    // console.log(e.min)
                                    chart.xAxis[0].setExtremes(fogdata[fogdata.length - 1][0] - (24 * 3600 * 1000),fogdata[fogdata.length - 1][0]+( 6 * 3600 * 1000))
                                    
                                }
                            })
                        }

                    },
                    crosshair: true
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
                        name: 'Fog prediction',
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
                    ,
                    // {
                    //     name: 'Fog prediction rolling mean',
                    //     data: fogdata3,
                    //     type: 'spline',
                    //     tooltip: {

                    //         pointFormat: '{point.y}',
                    //         valueDecimals: 2
                    //     },
                    //     yAxis: 0,
                    //     dataGrouping: {
                    //         approximation: 'average'
                    //     }

                    // }
                ],
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
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
    console.log( new Date(fogdata[fogdata.length - 1][0]))
    // charts.forEach(function(chart, i) {
    //     console.log(i)
    //     if (i !== 0) {
    //         console.log(e.min)
    //         chart.xAxis[0].setExtremes(e.min, e.max)
    //     }
    
    // console.log(fogdata[fogdata.length - 1][0] - (24 * 3600 * 1000),fogdata[fogdata.length - 1][0]+( 6 * 3600 * 1000))
    // console.log(charts[0].rangeSelector)
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
            xAxis: {
                min: (fogdata2.length==0)?fogdata[fogdata.length-1][0]-86400000:fogdata2[fogdata2.length-1][0]-86400000
            },
            yAxis: [{
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
                        menuItems: ["viewFullscreen", "downloadPDF",  "downloadCSV"]
                    }
                }
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
                min: (fogdata2.length==0)?fogdata[fogdata.length-1][0]-86400000:fogdata2[fogdata2.length-1][0]-86400000,
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
            yAxis: [{
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
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                }
            }],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                    }
                }
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
                                    //console.log(this.index,k)
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
                                $(".highcharts-markers path").attr('visibility', 'false')

                            }
                        }
                    }
                }
            },
            xAxis: {
                min: (fogdata2.length==0)?fogdata[fogdata.length-1][0]-86400000:fogdata2[fogdata2.length-1][0]-86400000
            },
            yAxis: [{
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
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                },
                keys: ['x', 'y', 'z']
            }],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                    }
                }
            }
        })
    );
    if(rainfall.length>100){
    charts.push(
        Highcharts.stockChart('Rainfall', {
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
                text: 'Rainfall (mm)',
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
                                k = charts[4].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 4)
                                        continue;
                                    //console.log(this.index,k)
                                    charts[i].series[0].points[Math.floor((this.index - k)/2)].setState('hover');
                                    charts[i].tooltip.refresh([charts[i].series[0].points[Math.floor((this.index - k)/2)]])

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
                                k = charts[4].series[0].points[0].index;
                                for (var i = 0; i < charts.length; i++) {
                                    if (i == 4)
                                        continue;
                                    charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    charts[i].tooltip.hide();
                                }
                                $(".highcharts-markers path").attr('visibility', 'false')

                            }
                        }
                    }
                }
            },
            xAxis: {
                min: (fogdata2.length==0)?fogdata[fogdata.length-1][0]-86400000:fogdata2[fogdata2.length-1][0]-86400000
            },
            yAxis: [{
                min:0,
                //max:10,
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
                name: 'Rainfall',
                data: rainfall,
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: '{point.y}(mm)',
                    valueDecimals: 2
                },
                dataGrouping: {
                    approximation: 'average'
                },
                keys: ['x', 'y', 'z']
            }],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                    }
                }
            }
        })
    );
    }
    // charts.forEach(function(chart, i) {
    //     console.log(i)
    //     if (i !== 0) {
    //         // console.log(e.min)
    //         charts[0].xAxis[0].setExtremes(fogdata[fogdata.length - 1][0] - (18 * 3600 * 1000),fogdata[fogdata.length - 1][0]+( 6 * 3600 * 1000));
    //     }})
    // charts[0].xAxis[0].setExtremes(fogdata[fogdata.length - 1][0] - (18 * 3600 * 1000),fogdata[fogdata.length - 1][0]+( 7 * 3600 * 1000));

    setTimeout(function () {
        charts[0].xAxis[0].setExtremes(fogdata[fogdata.length - 1][0] - (24 * 3600 * 1000),fogdata[fogdata.length - 1][0]+( 6 * 3600 * 1000));
        // charts[0].redraw()
      }, 1000)
    // $("#page").LoadingOverlay("hide");
}
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
        //console.log(arr[0]);
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

function chartmake(cityname,arra) {
    // console.log(document.getElementById("latlong").value);
    var position = document.getElementById("latlong").value;
    // console.log("makechart");
    var jsonObj = {
        "type": "map",
        // "pathToImages": "process/Fog_for__website.jpg",
        "addClassNames": true,
        "fontSize": 15,
        "color": "#FFFFFF",
        "projection": "mercator",
        "backgroundAlpha": 1,
        "backgroundColor": "rgba(238, 249, 235,255)",
        
        "dataProvider": {
            "map": "india2019High",
            "getAreasFromMap": true,
            "images": []
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
            "buttonCornerRadius": 2  
        }

    };
    var j=0;
    for(i=0;i<arra.length;i++){
        if(arra[i][0]==cityname)
            j=i;
        jsonObj.dataProvider.images.push({
                      "selectable": true,
                      "longitude": arra[i][2],
                      "latitude": arra[i][1]+0.68,
                      "type": "circle",
                      "labelPosition": "bottom",
                      "labelColor":"white",
                      "labelFontSize":15,
                      "color": "rgba(75,216,181,0.8)",
                      "scale": 0.7,
                      "rollOverScale": 1.5,
                      "labelRollOverColor": "rgba(255,255,255,1)",
                      "accessibleLabel":arra[i][0],
                       "balloonText":arra[i][0],
                       "bringForwardOnHover":true,
                        // "description":place[i],
                        "rollOverColor":"red",
                        "title":arra[i][0]
          
                
                  })
      }
    jsonObj.dataProvider.images[j].label = cityname;
    jsonObj.dataProvider.images[j].color="rgba(255,255,255,1)";
    var chart = AmCharts.makeChart('map1', jsonObj);
    chart.addListener("clickMapObject",function(ev){
        // console.log(ev)
        
            if(ev.mapObject.cname=="MapImage")
            {
                // $("#page").LoadingOverlay("show");
                document.getElementById('myInput').value = ev.mapObject.title;
                document.getElementById('cityname').innerHTML = "Location: " + ev.mapObject.title;
                
                chart.dataProvider.images[j].label="";
                chart.dataProvider.images[j].color="rgba(75,216,181,0.8)"
                chart.dataProvider.images[ev.mapObject.index].label=ev.mapObject.title;
                
                chart.dataProvider.images[ev.mapObject.index].labelFontSize=15;
                chart.dataProvider.images[ev.mapObject.index].labelColor="rgba(255,255,255,1)";
                chart.dataProvider.images[ev.mapObject.index].color="rgba(255,255,255,1)";
                j=ev.mapObject.index
                chart.validateData();
                highChartFunc(ev.mapObject.title,4)
                // console.log(chart);
            }
            else{
                console.log("not image point")
                return;
            }
            

    })
    //console.log('k',chart);
}
function getPos(cityname) {
    $.ajax({url: "apis/position.php?cityid="+cityname, async: false,success: function(data){
        // console.log(data)
        var data = JSON.parse(data)
        datalen = data.length
        document.getElementById("latlong").value = data;
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
