#!/usr/bin/env node

var interval=''
function checkCity(element,model) {

    cityname = document.getElementById("myInput").value;
    a = document.getElementById("myInput").value;
    getPos(cityname);
    if (a == "")
        return;
    cityid = 0;
    if (a == "Lucknow") {
        cityid = 2;
    } else if (a == "Delhi") {
        cityid = 1;
    }
    document.getElementById('cityname').innerHTML = "Location: " + a;
    highChartFunc(cityname,model,'1 DAY');
    chartmake(cityname);
}
function onModelChange(element){
    $("#page").LoadingOverlay("show");
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
    var mod=[model]
    $("#page").LoadingOverlay("show");
    
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
            if (a == ""){
                $("#page").LoadingOverlay("hide");
                return;
            }
            document.getElementById('cityname').innerHTML = "Location: " + a;
 
            highChartFunc(cityname,mod[0],'1 DAY'); 
 
            chartmake(cityname, arra);
        }
    })
    $("#page").LoadingOverlay("hide");
}
function formatDate(val) {
    var utcSeconds = val/1000 +(5.5*3600) //+ 19800;
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
                            var d=new Date(e.max)
                            console.log(d)
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

var charts=[]
function getchart(name,unit,data,ind,israin,current,cityname,mod){
    // console.log(name,unit,data,ind,israin,current)
    // console.log(cityname)
     return Highcharts.stockChart(name[0], {
        chart: {
            height: 350,
            panning: (ind==0)?true:false
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
            enabled: (ind==0)?true:false,
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
        rangeSelector: (ind==0)?{
            
            buttons: [{
                // type: 'day',
                count: 1,
                text: '1d',
                events:{
                    click: function() {
                        if(interval=='day')
                            return
                        interval='day'
                        
                        
                        highChartFunc(cityname,mod[0],'1 DAY');
                     
                       
                    }
                }
            }, {
                //type: 'week',
                count: 1,
                text: '1w',
                events:{
                    click: function() {
                        if(interval=='week')
                            return
                        interval='week'
                        
                        highChartFunc(cityname,mod[0],'7 DAY');
                    
                    }
                },
            },
            {
                // type: 'month',
                count: 1,
                text: '1m',
                events:{
                    click: function() {
                        if(interval=='month')
                            return
                        interval='month'
                    
                        highChartFunc(cityname,mod[0],'1 MONTH');
                       
                        
                       
                    }
                },
            }, {
                // type: 'year',
                count: 1,
                text: '1y',
                events:{
                    click: function() {
                        if(interval=='year')
                            return
                        interval='year'
                        
                        highChartFunc(cityname,mod[0],'1 YEAR');
                        
                       
                    }
                },
            }, {
                // type: 'all',
                text: 'All',
                events:{
                    click: function() {
                        if(interval=='all')
                            return
                        interval='all'
                        highChartFunc(cityname,mod[0],"10 YEAR");
                        
                       
                    }
                },
                
            }
        ],
    
            inputEnabled: true,
            selected: 0,


        }:{
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
            text: name[0]+ "("+unit[0]+")",
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
                           
                            if (this.series.points.length>15) {
                                
                                var store = [],time=0;
                                // store.push(this.y)
                                for (var i = 0; i < charts.length; i++) {
                                    if(i==ind){
                                        store.push(this.y)
                                        if(ind==3){
                                            if (this.z == null)
                                                store.push(0);
                                            else
                                                store.push(this.z)
                                        }
                                    }
                                    else{
                                        var p=[]
                                        var xs=this.x
                                        if(charts[i].series[0].points==undefined){
                                            // p.push()
                                            store.push(0)
                                            if(i==3)
                                                store.push(0)
                                        }else{
                                        var xr=charts[i].series[0].points
                                        var f=0
                                           
                                        for(var j=1;j<xr.length-1;j++){
                                              
                                            if(xr[j].x==xs ){ //||(xr[j+1].x>=xs && xr[j-1].x<=xs)
                                                p.push(xr[j])
                                                f=1
                                                break
                                            }

                                        }
                                        if(f==0)
                                            p.push(xr[0])
                                        
                                        charts[i].tooltip.refresh(p)
                                        store.push(p[0].y)
                                        if (i == 3){
                                            if (p.z == null)
                                                store.push(0);
                                            else
                                                store.push(p[0].z)}
                                        }
                                    }
                                    
                                    
                                    
                                }
                                if(israin==1)
                                document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(this.x)+'</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(0) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + " km/h</div><div>Wind direction: " + store[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4]+"deg)'></i></span> </div> <div>Rainfall: " + store[5] + "mm    </div></div>   ";
                                else
                                document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(this.x)+'</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(0) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + " km/h</div><div>Wind direction: " + store[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4]+"deg)'></i></span> </div> </div>   ";

                            } else if(ind==0) {
                                document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div style="color:green">Predicted Visibility: ' + this.y.toFixed(2) + " km</div><div>";

                            }
                        
                            // console.clear()
                            $(".highcharts-markers path").attr('visibility', 'visible')
                        },
                        mouseOut: function(e) {
                            for (var i = 1; i < charts.length; i++) {
                                // charts[i].series[0].markerGroup.visibility="none"
                                // charts[i].xAxis[0].removePlotLine('xPlotLine');
                                charts[i].tooltip.hide();
                            }
                            if(israin==1)
                            document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(current[5])+'</div><div style="color:red">Visibility: ' + current[0] + " km   </div><div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + " km/h</div><div>Wind direction: " + current[4] +"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span> </div><div>Rainfall: " + current[6] + "mm   </div></div>   ";
                            else
                            document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(current[5])+'</div><div style="color:red">Visibility: ' + current[0] + " km   </div><div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + " km/h</div><div>Wind direction: " + current[4] +"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span> </div></div>   ";
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
            plotBands:(ind==0)?[
            {
                from:1,
                to:0,
                color:'rgb(255, 248, 238)'
            }
        ]:[],
        gridLineColor: '#ed7d31',
        lineColor: '#F3F5F6',
        minorGridLineColor: '#ed7d31',
        tickColor: '#F3F5F6',
        visible:true,

        plotLines: (ind==0)?[{
            value: 1,
            width: 2,
            color: 'red',
            label: {
                text: '<div data-toggle="modal" class="line_allowable btn_toggle" href="#modal-form1"><span>'+name[0]+'</span></div>',
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
        }]:[{color: '#ed7d31'}]

        }],

        xAxis: {
            // min: fogdata[0][0],
            // max:fogdata2[fogdata2.length-1][0],
            
            plotLines: (ind==0)?[{
                color: 'rgb(255,170,20)', // Red
                width: 2,
                value: data[0][data[0].length - 1][0],
                zIndex:1
            }]:[],
            crosshair: true
        },

        series: getdata(name,unit,data),
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                }
            }
        }
    },
    (ind==0)?function(chart) {

        // apply the date pickers
        setTimeout(function() {
            $('input.highcharts-range-selector', $(chart.container).parent())
                .datepicker();
        }, 0);
    }: function(chart){});
}

function getdata(name,unit,data){
    var all=[]
    for(var i=0;i<name.length;i++){
        all.push({
            name: name[i],
            data: data[i],
            type: 'spline',
            tooltip: {
                pointFormat: '{point.y}'+unit[i],
                valueDecimals: 2
            },
            yAxis: 0,
            dataGrouping: {
                approximation: 'average'
            }
        })
    }
    return all
}
function highChartFunc(cityid,model,interval, all=1) {
    if(cityid=="IIT Kanpur"){
        iitdata(cityid,model)
        return
    }
    var fogdata = [],
        temperaturedata = [],
        humiditydata = [],
        winddata = [],
        winddirectiondata = [],
        fogdata2 = [],
        fogdata3=[],
        rainfall=[];
        var current = [];
    //Highcharts.getJSON('apis/database.php?station=' + cityid, function(alldata) {
        $.ajax({url: "apis/database1.php?station=" + cityid+"&interval="+interval, async: false,
        success: function(alldata){
            
        var list=alldata.split(';')
        if(list[0].substring(0,5))
            var data=JSON.parse(list[0].substring(5))
        else
        var data=JSON.parse(list[0])
        var data2=JSON.parse(list[1])
       var dataLength2=data2.length,
            dataLength = data.length;
       var epoch
        for (var i=0; i < dataLength2; i += 1) {
            epoch=data2[i][0]  
            rainfall.push([
                epoch,
                data2[i][1] // data[i][1]==null?data[i-1][1]:data[i][1]
            ]);
        }
        
        for (var i=0; i < dataLength; i += 1) {
            epoch=data[i][0] 
            fogdata.push([
                epoch,
                data[i][1] * 1.60934 // data[i][1]==null?data[i-1][1]:data[i][1]
            ]);
            temperaturedata.push([
                epoch,
                (data[i][2] - 32) / 1.8
            ]);
            humiditydata.push([
                epoch,
                data[i][3]
            ]);
            winddata.push([
                epoch,
                data[i][4] * 1.852,
                data[i][5]
            ]);
            winddirectiondata.push([
                epoch,
                data[i][5]
            ]);
        }
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(data[dataLength-1][0]/1000);

        $.ajax({url: "apis/newpred.php?stime="+d.toUTCString()+"&station="+cityid+"&model="+model, async: false,success: function(data){
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
        if(fogdata3.length>0 && fogdata3[0][0]!=fogdata[fogdata.length-1][0])
            fogdata3.unshift(fogdata[fogdata.length-1])
        else if(fogdata3.length>0)
            fogdata3[0]=fogdata[fogdata.length-1]
        

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
        if(rainfall.length>20)
        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at: '+formatDate(fogdata[dataLength - 1][0])+'</div><div style="color:red">Visibility: ' + fogdata[dataLength - 1][1].toFixed(2) + " km   </div><div>Temperature: " + temperaturedata[dataLength - 1][1].toFixed(0) + "°C    </div><div>Relative Humidity: " + humiditydata[dataLength - 1][1].toFixed(2) + "%    </div><div>Wind: " + winddata[dataLength - 1][1].toFixed(2) + "km/h</div><div>Wind direction: " + winddata[dataLength - 1][2] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+winddata[dataLength - 1][2]+"deg)'></i></span></div><div>Rainfall: " + rainfall[dataLength2 - 1][1] + "mm    </div></div>   ";
        else
        document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at: '+formatDate(fogdata[dataLength - 1][0])+'</div><div style="color:red">Visibility: ' + fogdata[dataLength - 1][1].toFixed(2) + " km   </div><div>Temperature: " + temperaturedata[dataLength - 1][1].toFixed(0) + "°C    </div><div>Relative Humidity: " + humiditydata[dataLength - 1][1].toFixed(2) + "%    </div><div>Wind: " + winddata[dataLength - 1][1].toFixed(2) + "km/h</div><div>Wind direction: " + winddata[dataLength - 1][2] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+winddata[dataLength - 1][2]+"deg)'></i></span></div></div>   ";
        document.getElementById('mapFog-section').style["display"] = "block";
        document.getElementById('Temperature-section').style["display"] = "block";
        document.getElementById('Humidity-section').style["display"] = "block";
        document.getElementById('Wind-section').style["display"] = "block";
            
        

        fogFunction(cityid, fogdata, fogdata2,fogdata3, temperaturedata, humiditydata, winddata, winddirectiondata,rainfall, current,model)
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
    // var charts = []
    var mod=[model]
    var israin=0
    if(rainfall.length>20){
        israin=1
    }
    charts=[]
    charts.push(
        getchart(["Visibility","Visibility_Prediction"],["km","km"],[fogdata,fogdata2],0,israin,current,cityid,mod));
    charts.push(
        getchart(["Temperature"],["°C"],[temperaturedata],1,israin,current,cityid,mod));
    charts.push(
        getchart(["Humidity"],["%"],[humiditydata],2,israin,current,cityid,mod));
    charts.push(
        getchart(["Wind"],["km/h"],[winddata],3,israin,current,cityid,mod));
    if(israin==1)
        charts.push(
            getchart(["Rainfall"],["mm"],[rainfall],4,israin,current,cityid,mod));
    
           
   
    $("#page").LoadingOverlay("hide");
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
                highChartFunc(ev.mapObject.title,4,'1 DAY')
            }
            else{
                console.log("not image point")
                return;
            }
            

    })
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
//2300 before
//1218 after
