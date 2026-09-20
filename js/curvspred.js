
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

var arr=[]
$(document).ready(function(){
    $.ajax({
        url: "apis/map.php",
        async: "false",
        success: function(result) {
            arr=[]
            data = JSON.parse(result)
            var datalen = data.length
            for (i = 0; i < datalen; i += 1) {
                arr.push(data[i][0])
            }
            
        }
    })

});
function loaddata(model,modelname){
    document.getElementById("model-choose").textContent = modelname
    
    if(model!=7){
        onModelChange(model);
    }
    else{
        lstm()
    }
    
}
function checkModel(element){

    var fs = document.getElementById("myInputFirst").value;
    if(fs==""){
        alert("Enter the city first");
        return;
    }
    // var mn = element.getAttribute("modelno");
    var mn = element;
    document.getElementById("model-choose").textContent = mn.innerHTML
    // if(mn==4){
    //     document.getElementById('mod4').style["display"] = "block";
    // }
    // else{
    //     document.getElementById('mod4').style["display"] = "none";
    // }
    var model=element.getAttribute("modelno")
    if(model!=7)
        onModelChange(model)
    else
        lstm()
}
function lstm(){
    var fs = document.getElementById("myInputFirst").value;
    if(fs==""){
        alert("Enter the city first");
        $("#page").LoadingOverlay("hide");

        return;
    }
    var models=Array(), fogdata1=Array()
    var end,start
    for(var i=0;i<12;i++){
        models.push([]);
    }
    $.ajax({url: "apis/lstm.php?status=1",
            success: function(result) {
                var data = JSON.parse(result)
                for(var i=12;i<data.length;i++){
                    for(var j=1;j<=12;j++){
                        models[j-1].push([
                            data[i][0],
                            data[i-j][j]
                        ]);
                    }
                }
                
                var d = new Date(data[12][0])
                start=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
                var d = new Date(data[data.length-1][0])
                end=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
                
                $.ajax({
                    url: "apis/lstm.php?station=Lucknow&stime="+start+"&etime="+end+"&status=0",
                    success: function(result) {
                        
                        var data = JSON.parse(result)
                        var dataLength = data.length,
                            i = 0;
            
                        for (i; i < dataLength; i += 1) {
                            fogdata1.push([
                                data[i][0],
                                data[i][1] * 1.60934
                            ]);
            
                        }
                        var charts = []
                        charts.push(
                            Highcharts.stockChart('curvspred', {
                                chart: {
    backgroundColor: '#FFFFFF',
    style: { fontFamily: "'Inter', 'Roboto', sans-serif" },
    height: 600,
                                    events: {
                                        load: function () {
                                            $(".highcharts-legend-item path").attr('stroke-width', 4);
                                            
                                        },
                                        redraw: function () {
                                            $(".highcharts-legend-item path").attr('stroke-width', 4);
                                            
                                        }
                                    },
                                    spacingRight:0
                                },
                                responsive: {
                                    rules: [{
                                        condition: {
                                            maxWidth: 500
                                        },
                                        chartOptions: {
                                            chart: {
                                                height: 400
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
    maskFill: 'rgba(15, 23, 42, 0.05)',
    outlineColor: '#CBD5E1',
    outlineWidth: 1,
    handles: {
        backgroundColor: '#FFFFFF',
        borderColor: '#94A3B8'
    }
},
                                plotOptions: {
                                    series: {
                                        events: {
                                            // afterAnimate: function() {
                                            //     var arr = []
                                            //     var text="<div><b>RMSE for T+0.5 : "
                                            //     var countn=0,
                                            //     sum=0,
                                            //     valu
                    
                                            //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                            //         var k=charts[0].series[0].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                            //         if(k!=-1){
                                            //             var tv = charts[0].series[1].processedYData[i];
                                            //             var pv = charts[0].series[0].processedYData[k];
                                            //             sum = sum + Math.pow(tv-pv,2)
                                            //             countn = countn + 1
                                            //         }
                                            //     }
                                            //     sum = sum/countn;
                                            //     valu = Math.pow(sum,0.5)
                                            //     text += valu
                                            //     arr.push(valu)
                                            //     text +="</b></div><b><div>RMSE for T+1  : "
                                            //     countn=0
                                            //     sum=0
                                            //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                            //         var k=charts[0].series[2].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                            //         if(k!=-1){
                                            //             var tv = charts[0].series[1].processedYData[i];
                                            //             var pv = charts[0].series[2].processedYData[k];
                                            //             sum = sum + Math.pow(tv-pv,2)
                                            //             countn = countn + 1
                                            //         }
                                            //     }
                                            //     sum = sum/countn;
                                            //     valu = Math.pow(sum,0.5)
                                            //     text += valu
                                            //     arr.push(valu)
                                            //     text+="</b></div><div><b>RMSE for T+1.5 : "
                                            //     countn=0
                                            //     sum=0
                                            //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                            //         var k=charts[0].series[3].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                            //         if(k!=-1){
                                            //             var tv = charts[0].series[1].processedYData[i];
                                            //             var pv = charts[0].series[3].processedYData[k];
                                            //             sum = sum + Math.pow(tv-pv,2)
                                            //             countn = countn + 1
                                            //         }
                                            //     }
                                            //     sum = sum/countn;
                                            //     valu = Math.pow(sum,0.5)
                                            //     text += valu
                                            //     arr.push(valu)
                                            //     text+="</b></div><div><b>RMSE for T+2  : "
                                            //     countn=0
                                            //     sum=0
                                            //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                            //         var k=charts[0].series[4].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                            //         if(k!=-1){
                                            //             var tv = charts[0].series[1].processedYData[i];
                                            //             var pv = charts[0].series[4].processedYData[k];
                                            //             sum = sum + Math.pow(tv-pv,2)
                                            //             countn = countn + 1
                                            //         }
                                            //     }
                                            //     sum = sum/countn;
                                            //     valu = Math.pow(sum,0.5)
                                            //     text += valu
                                            //     arr.push(valu)
                                            //     text+="</b></div><div><b>RMSE for T+2.5 : "
                                            //     countn=0
                                            //     sum=0
                                            //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                            //         var k=charts[0].series[5].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                            //         if(k!=-1){
                                            //             var tv = charts[0].series[1].processedYData[i];
                                            //             var pv = charts[0].series[5].processedYData[k];
                                            //             sum = sum + Math.pow(tv-pv,2)
                                            //             countn = countn + 1
                                            //         }
                                            //     }
                                            //     sum = sum/countn;
                                            //     valu = Math.pow(sum,0.5)
                                            //     text += valu
                                            //     arr.push(valu)
                                            //     text+="</b></div><div><b>RMSE for T+3  : "
                                            //     countn=0
                                            //     sum=0
                                            //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                            //         var k=charts[0].series[6].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                            //         if(k!=-1){
                                            //             var tv = charts[0].series[1].processedYData[i];
                                            //             var pv = charts[0].series[6].processedYData[k];
                                            //             sum = sum + Math.pow(tv-pv,2)
                                            //             countn = countn + 1
                                            //         }
                                            //     }
                                            //     sum = sum/countn;
                                            //     valu = Math.pow(sum,0.5)
                                            //     text += valu
                                            //     arr.push(valu)
                                            //     text+="</b></div><div><b>RMSE for T+6  : "
                                            //     countn=0
                                            //     sum=0
                                            //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                            //         var k=charts[0].series[7].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                            //         if(k!=-1){
                                            //             var tv = charts[0].series[1].processedYData[i];
                                            //             var pv = charts[0].series[7].processedYData[k];
                                            //             sum = sum + Math.pow(tv-pv,2)
                                            //             countn = countn + 1
                                            //         }
                                            //     }
                                            //     sum = sum/countn;
                                            //     valu = Math.pow(sum,0.5)
                                            //     text += valu+"</b></div>"
                                            //     arr.push(valu)
                                            //     var sp = new Date(0); // The 0 there is the key, which sets the date to the epoch
                                            //     sp.setUTCSeconds(charts[0].series[1].processedXData[0]/1000 + 19800);
                                                
                                            //     var ep=new Date(0)
                                            //     ep.setUTCSeconds(charts[0].series[1].processedXData[charts[0].series[1].processedXData.length-1]/1000 + 19800)
                                            //     // document.getElementById('rmse').innerHTML = text
                                            //     rmsechart(arr,sp.toLocaleString(),ep.toLocaleString())
                                                
                                            // }
                                        }
                                    }
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
                                    selected: 0
                    
                                },
                                title: {
                                    text: fs + ' Real-Data VS Forecasted-Data',
                                    style:{
                                        color: "#0F172A", 
                                        fontSize: "16px",
                                        fontFamily: "sans-serif",
                                        fontWeight: "500" 
                                    }
                                },
                                xAxis: {
                                    lineColor: '#CBD5E1',
                                    lineWidth: 1,
                                    gridLineWidth: 0,
                                    labels: {
                                        style: {
                                            color: '#64748B',
                                            fontSize: '11px'
                                        }
                                    },
                                    plotLines: [{
                                        color: '#FF0000', // Red
                                        width: 2,
                                        // value: fogdata1[fogdata1.length-1][0],
                                    }],
                                    // events: {
                                    //     afterSetExtremes: function(e) {
                                    //         charts.forEach(function(chart, i) {
                                    //             if (i !== 0) {
                                    //                 chart.xAxis[0].setExtremes(e.min, e.max)
                                    //             }
                                    //         })
                                    //     }
                    
                                    // },
                                    events: {
                                        // afterSetExtremes: function(e) {
                                        //     var arr = []
                                        //     var text="<div><b>RMSE for T+0.5 : "
                                        //     var countn=0,
                                        //     sum=0,
                                        //     valu
                    
                                        //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                        //         var k=charts[0].series[0].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                        //         if(k!=-1){
                                        //             var tv = charts[0].series[1].processedYData[i];
                                        //             var pv = charts[0].series[0].processedYData[k];
                                        //             sum = sum + Math.pow(tv-pv,2)
                                        //             countn = countn + 1
                                        //         }
                                        //     }
                    
                                        //     sum = sum/countn;
                                        //     valu = Math.sqrt(sum)
                                        //     text += valu
                                        //     arr.push(valu)
                                        //     text +="</b></div><b><div>RMSE for T+1  : "
                                        //     countn=0
                                        //     sum=0
                                        //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                        //         var k=charts[0].series[2].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                        //         if(k!=-1){
                                        //             var tv = charts[0].series[1].processedYData[i];
                                        //             var pv = charts[0].series[2].processedYData[k];
                                        //             sum = sum + Math.pow(tv-pv,2)
                                        //             countn = countn + 1
                                        //         }
                                        //     }
                                        //     sum = sum/countn;
                                        //     console.log(sum,countn)
                                        //     valu = Math.sqrt(sum)
                                        //     text += valu
                                        //     arr.push(valu)
                                        //     text+="</b></div><div><b>RMSE for T+1.5 : "
                                        //     countn=0
                                        //     sum=0
                                        //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                        //         var k=charts[0].series[3].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                        //         if(k!=-1){
                                        //             var tv = charts[0].series[1].processedYData[i];
                                        //             var pv = charts[0].series[3].processedYData[k];
                                        //             sum = sum + Math.pow(tv-pv,2)
                                        //             countn = countn + 1
                                        //         }
                                        //     }
                                        //     sum = sum/countn;
                                        //     console.log(sum,countn)
                                        //     valu = Math.sqrt(sum)
                                        //     text += valu
                                        //     arr.push(valu)
                                        //     text+="</b></div><div><b>RMSE for T+2  : "
                                        //     countn=0
                                        //     sum=0
                                        //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                        //         var k=charts[0].series[4].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                        //         if(k!=-1){
                                        //             var tv = charts[0].series[1].processedYData[i];
                                        //             var pv = charts[0].series[4].processedYData[k];
                                        //             sum = sum + Math.pow(tv-pv,2)
                                        //             countn = countn + 1
                                        //         }
                                        //     }
                                        //     sum = sum/countn;
                                        //     console.log(sum,countn)
                                        //     valu = Math.sqrt(sum)
                                        //     text += valu
                                        //     arr.push(valu)
                                        //     text+="</b></div><div><b>RMSE for T+2.5 : "
                                        //     countn=0
                                        //     sum=0
                                        //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                        //         var k=charts[0].series[5].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                        //         if(k!=-1){
                                        //             var tv = charts[0].series[1].processedYData[i];
                                        //             var pv = charts[0].series[5].processedYData[k];
                                        //             sum = sum + Math.pow(tv-pv,2)
                                        //             countn = countn + 1
                                        //         }
                                        //     }
                                        //     sum = sum/countn;
                                        //     console.log(sum,countn)
                                        //     valu = Math.sqrt(sum)
                                        //     text += valu
                                        //     arr.push(valu)
                                        //     text+="</b></div><div><b>RMSE for T+3  : "
                                        //     countn=0
                                        //     sum=0
                                        //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                        //         var k=charts[0].series[6].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                        //         if(k!=-1){
                                        //             var tv = charts[0].series[1].processedYData[i];
                                        //             var pv = charts[0].series[6].processedYData[k];
                                        //             sum = sum + Math.pow(tv-pv,2)
                                        //             countn = countn + 1
                                        //         }
                                        //     }
                                        //     sum = sum/countn;
                                        //     console.log(sum,countn)
                                        //     valu = Math.sqrt(sum)
                                        //     text += valu
                                        //     arr.push(valu)
                                        //     text+="</b></div><div><b>RMSE for T+6  : "
                                        //     countn=0
                                        //     sum=0
                                        //     for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                        //         var k=charts[0].series[7].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                        //         if(k!=-1){
                                        //             var tv = charts[0].series[1].processedYData[i];
                                        //             var pv = charts[0].series[7].processedYData[k];
                                        //             sum = sum + Math.pow(tv-pv,2)
                                        //             countn = countn + 1
                                        //         }
                                        //     }
                                        //     sum = sum/countn;
                                        //     console.log(sum,countn)
                                        //     valu = Math.sqrt(sum)
                                        //     text += valu+"</b></div>"
                                        //     arr.push(valu)
                                        //     var sp = new Date(0); // The 0 there is the key, which sets the date to the epoch
                                        //     sp.setUTCSeconds(charts[0].series[1].processedXData[0]/1000 + 19800);
                                            
                                        //     var ep=new Date(0)
                                        //     ep.setUTCSeconds(charts[0].series[1].processedXData[charts[0].series[1].processedXData.length-1]/1000 + 19800)
                                        //     // console.log(text)
                                        //     // document.getElementById('rmse').innerHTML = text
                                        //     // console.log(charts[0].series[1])
                                        //     rmsechart(arr,sp.toLocaleString(),ep.toLocaleString())
                                            
                                        // }
                    
                                    },
                                    crosshair: true,
                                    //max:fogdata1[fogdata1.length-1][0]
                                },
                                yAxis: [{
                                    gridLineColor: '#F1F5F9',
                                    gridLineWidth: 1,
                                    lineColor: '#CBD5E1',
                                    lineWidth: 1,
                                    min: 0,
                                    labels: {
                                        align: 'right',
                                        x: -5,
                                        style: {
                                            color: '#64748B',
                                            fontSize: '11px'
                                        }
                                    },
                                    title: {
                                        text: 'Visibility(in km)',
                                        style: {
                                            fontSize: "11px",
                                            color: "#64748B",
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            fontWeight: '600'
                                        }
                    
                                    },
                                    top: '0%',
                                    height: '100%',
                                    offset: 10,
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
}],
                                    plotLines: [{
                                        value: 1,
                                        width: 1,
                                        color: '#94A3B8',
                                        dashStyle: 'Dash',
                                        label: {
                                            text: '<div data-toggle="modal" class="line_allowable btn_toggle" href="#modal-form1"><span>Fog</span></div>',
                                            useHTML: true,
                                            style: {
                                                color: '#94A3B8',
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
                                    backgroundColor: '#FFFFFF',
                                    itemStyle:{
                                        color: '#334155',
                                        fontSize:"13px",
                                        fontWeight: "normal"
                                    }
                                },
                                series: [
                                    {
                                        name: "Prediction (t+0.5)",
                                        data: models[0],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+0.5: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Real Values",
                                        data: fogdata1,
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+0: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        },
                                        // color:'black'
                    
                                    },
                                    {
                                        name: "Prediction (t+1)",
                                        data: models[1],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+1: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+1.5)",
                                        data: models[2],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+1.5: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+2)",
                                        data: models[3],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+2: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+2.5)",
                                        data: models[4],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+2.5: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+3)",
                                        data: models[5],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+3: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+3.5)",
                                        data: models[6],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+3.5: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+4)",
                                        data: models[7],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+4: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+4.5)",
                                        data: models[8],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+4.5: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+5)",
                                        data: models[9],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+5: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+5.5)",
                                        data: models[10],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+5.5: {point.y}</b>',
                                            valueDecimals: 2
                                        },
                                        yAxis: 0,
                                        dataGrouping: {
                                            approximation: 'average'
                                        }
                    
                                    },
                                    {
                                        name: "Prediction (t+6)",
                                        data: models[11],
                                        type: 'spline',
                                        tooltip: {
                                            pointFormat: '<b>t+6: {point.y}</b>',
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
                        )
                        
                        
                        //comparechart2(fs, fogdata1,fogdata2,fogdata3,fogdata4,fogdata5,fogdata6,fogdata7,fogdata8);
                    }
                })
            }
        });
    

    
        
    
    
}
$(document).on({
    ajaxStart: function(){
        $("#page").LoadingOverlay("show");

    },
    ajaxStop: function(){
        $("#page").LoadingOverlay("hide");
    document.getElementById('footr').style["display"] = "block";

    }    
});
function apicalls(url1,url2,models,mod_itr,status){
    if(mod_itr==models.length)
        if(status!=7)
            return []
        else
            return [[],[],[]]
    let ans=[]
    
    $.ajax({
        url: url1+models[mod_itr]+url2,
        async:false,
        success: function(result) {
            // console.log(result)
            let data = JSON.parse(result)
            let dataLength = data.length;
            let fogpred=[],std1=[],std2=[]
            if(status!=7){
                
                
                for (let i=0; i < dataLength; i += 1) {
                    fogpred.push([
                        data[i][0],
                        data[i][1]
                    ]);

                }
            }
            else{
                for (let i=0; i < dataLength; i += 1) {
                    fogpred.push([
                        data[i][0],
                        data[i][2]
                    ]);
                    std1.push([
                        data[i][0],
                        data[i][1]
                    ]);
                    std2.push([
                        data[i][0],
                        data[i][3]
                    ]);

                }
            }
            ans=apicalls(url1,url2,models,mod_itr+1,status)
            if(status!=7)
                ans.unshift(fogpred)
            else{
                ans[0].unshift(std1)
                ans[1].unshift(fogpred)
                ans[2].unshift(std2)
            }
            
             
        }
    })
    
    return ans
    
}
function onModelChange(element){

    var fs = document.getElementById("myInputFirst").value;
    if(fs==""){
        alert("Enter the city first");
        $("#page").LoadingOverlay("hide");

        return;
    }
    
    
    console.log(document.getElementById("model-choose"));
    // var mn = element.getAttribute("modelno");
    var mn = element;
    // if(mn>400)
    // document.getElementById("hr-choose").textContent = element.text;
    // else if(mn==4)
    // document.getElementById("hr-choose").textContent = "3 hour";

    // var fs = document.getElementById("myInputFirst").value;
    var fogdata1 = [],
        fogdata2 = [],
        fogdata3=[],
        fogdata4=[],
        fogdata5=[],
        fogdata6=[],
        fogdata7=[],
        fogdata8=[] 
    var url1=""
    // if(mn==460){
    //     url1 = "apis/curvspred.php?station=" + fs+"&modelno=4&status=2";
    // }
    // else{
        // url1 = 
    // }
    if(mn<4 && mn>12){
        document.getElementById('rmsec').style["display"] = "none";
        $.ajax({
            url: "apis/findlast.php?station=" + fs,
            success: function(result) {
                
                var data = JSON.parse(result)
                var ent = new Date(0);
                ent.setUTCSeconds(data[0]/1000);
                $.ajax({
                    url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn+"&status=1",
                    success: function(result) {
                        var data = JSON.parse(result)
                        var dataLength = data.length,
                            i = 0;
            
                        for (i; i < dataLength; i += 1) {
                            fogdata2.push([
                                data[i][0],
                                data[i][1]
                            ]);
            
                        }
                        var stime = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        stime.setUTCSeconds(data[0][0]/1000);
                        var etime = new Date(0);
                        etime.setUTCSeconds(data[dataLength-1][0]/1000);
                        
                        $.ajax({
                            url: "apis/curvspred.php?station=" + fs+"&stime="+stime.toUTCString()+"&etime="+etime.toUTCString()+"&status=0",
                            success: function(result) {
                                var data = JSON.parse(result)
                                var dataLength = data.length,
                                    i = 0;
                    
                                for (i; i < dataLength; i += 1) {
                                    fogdata1.push([
                                        data[i][0],
                                        data[i][1] * 1.60934
                                    ]);
                    
                                }
                                comparechart(fs, fogdata1,fogdata2);
                            }
                        }) 
                    }    
                });
            }
        })
    }
    else{
        // alert(mn)
        var status=1
        if(mn==6){
            status=3
            mn=4
        }
        else if(mn==8){
            status=4
            mn=4
        }
        else if(mn==9){
            status=5
            mn=4
        }
        else if(mn==10){
            status=6
            mn=4
        }
        else if(mn==11){
            status=7
            mn=4
        }
        else if(mn==12){
            status=8
            mn=4
            fs='IIT Kanpur'
        }
        else{
            status=1
        }
        document.getElementById('rmsec').style["display"] = "block";
        $.ajax({
            url: "apis/findlast.php?station=" + fs,
            success: function(result) {
                var data = JSON.parse(result)
                var ent = new Date();
                // ent.setUTCSeconds(data[0]/1000);
                if(status!=7)
                    var models=['05','10','15','20','25','','60']
                else
                    var models=['05','15','25','60']
                var fog=apicalls("apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn,"&status="+status,models,0,status)
                var stime = new Date(0); // The 0 there is the key, which sets the date to the epoch
                if(status!=7){
                    
                    
                    stime.setUTCSeconds( fog[0][0][0]/1000);
                }
                else
                stime.setUTCSeconds(fog[0][0][0][0]/1000);
                $.ajax({
                    url: "apis/curvspred.php?station=" + fs+"&stime="+stime.toUTCString()+"&etime="+ent.toUTCString()+"&status=0",
                    async:false,
                    success: function(result) {
                        // console.log(result)
                        var data = JSON.parse(result)

                        var dataLength = data.length,
                            i = 0;
            
                        for (i; i < dataLength; i += 1) {
                            fogdata1.push([
                                data[i][0],
                               (fs=='IIT Kanpur')?data[i][1]: data[i][1] * 1.60934
                            ]);
            
                        }
                        
                    }
                })
                if(status!=7){
                    fog.unshift(fogdata1)
                    let mn=10**10
                    for(let r=0;r<fog.length;r++){
                        if(fog[r].length<mn)
                            mn=fog[r].length
                    }
                    for(let r=0;r<fog.length;r++){
                        fog[r]=fog[r].slice(fog[r].length-mn)
                    }
                    
                   // console.log(fog)
                    comparechart2(fs, fog,['t+0','t+0.5','t+1','t+1.5','t+2','t+2.5','t+3','t+6'],['black','red','orange','yellow','green','blue','indigo','violet'],status)
                }
                else{
                    fog=fog[1].concat(fog[0]).concat(fog[2])
                    fog.unshift(fogdata1)
                    //console.log(fog)
                    let mn=10**10
                    for(let r=0;r<fog.length;r++){
                        if(fog[r].length<mn)
                            mn=fog[r].length
                    }
                    for(let r=0;r<fog.length;r++){
                        fog[r]=fog[r].slice(fog[r].length-mn)
                    }
                    comparechart2(fs, fog,['t+0','t+0.5','t+1.5','t+2.5','t+6','t+0.5','t+1.5','t+2.5','t+6','t+0.5','t+1.5','t+2.5','t+6',],['black','red','yellow','green','blue','#FFCCCB','#FFD580','#90EE90','#5F9EA0','#FFCCCB','#FFD580','#90EE90','#5F9EA0'],status)
                }
                console.log('Overall render time:' +( Date.now()-window.performance.timing.navigationStart) + ' milliseconds')
    //             $.ajax({
    //                 url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn+"05&status="+status,
    //                 success: function(result) {
    //                     var data = JSON.parse(result)
                        
    //                     var dataLength = data.length,
    //                         i = 0;
            
    //                     for (i; i < dataLength; i += 1) {
    //                         fogdata2.push([
    //                             data[i][0],
    //                             data[i][1]
    //                         ]);
            
    //                     }
                        
    //                     $.ajax({
    //                         url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn+"10&status="+status,
    //                         success: function(result) {
    //                             var data = JSON.parse(result)
    //                             var dataLength = data.length,
    //                                 i = 0;
                    
    //                             for (i; i < dataLength; i += 1) {
    //                                 fogdata3.push([
    //                                     data[i][0],
    //                                     data[i][1]
    //                                 ]);
                    
    //                             }
    //                             $.ajax({
    //                                 url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn+"15&status="+status,
    //                                 success: function(result) {
    //                                     var data = JSON.parse(result)
    //                                     var dataLength = data.length,
    //                                         i = 0;
                            
    //                                     for (i; i < dataLength; i += 1) {
    //                                         fogdata4.push([
    //                                             data[i][0],
    //                                             data[i][1]
    //                                         ]);
                            
    //                                     }
    //                                     $.ajax({
    //                                         url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn+"20&status="+status,
    //                                         success: function(result) {
    //                                             var data = JSON.parse(result)
    //                                             var dataLength = data.length,
    //                                                 i = 0;
                                    
    //                                             for (i; i < dataLength; i += 1) {
    //                                                 fogdata5.push([
    //                                                     data[i][0],
    //                                                     data[i][1]
    //                                                 ]);
                                    
    //                                             }
    //                                             $.ajax({
    //                                                 url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn+"25&status="+status,
    //                                                 success: function(result) {
    //                                                     var data = JSON.parse(result)
    //                                                     var dataLength = data.length,
    //                                                         i = 0;
                                            
    //                                                     for (i; i < dataLength; i += 1) {
    //                                                         fogdata6.push([
    //                                                             data[i][0],
    //                                                             data[i][1]
    //                                                         ]);
                                            
    //                                                     }
    //                                                     $.ajax({
    //                                                         url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn+"60&status="+status,
    //                                                         success: function(result) {
    //                                                             var data = JSON.parse(result)
    //                                                             var dataLength = data.length,
    //                                                                 i = 0;
                                                    
    //                                                             for (i; i < dataLength; i += 1) {
    //                                                                 fogdata8.push([
    //                                                                     data[i][0],
    //                                                                     data[i][1]
    //                                                                 ]);
                                                    
    //                                                             }
    //                                                             if(mn==5){
    //                                                                 mn=530;
    //                                                             }
    //                                                             $.ajax({

    //                                                                 url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno="+mn+"&status="+status,
    //                                                                 success: function(result) {
    //                                                                     var data = JSON.parse(result)
    //                                                                     var dataLength = data.length,
    //                                                                         i = 0;
                                                            
    //                                                                     for (i; i < dataLength; i += 1) {
    //                                                                         fogdata7.push([
    //                                                                             data[i][0],
    //                                                                             data[i][1]
    //                                                                         ]);
                                                            
    //                                                                     }
                                                                        
                                                                        
                                                                        
    //                                                                     $.ajax({
    //                                                                         url: "apis/curvspred.php?station=" + fs+"&stime="+stime.toUTCString()+"&etime="+ent.toUTCString()+"&status=0",
    //                                                                         success: function(result) {
    //                                                                             var data = JSON.parse(result)

    //                                                                             var dataLength = data.length,
    //                                                                                 i = 0;
                                                                    
    //                                                                             for (i; i < dataLength; i += 1) {
    //                                                                                 fogdata1.push([
    //                                                                                     data[i][0],
    //                                                                                     data[i][1] * 1.60934
    //                                                                                 ]);
                                                                    
    //                                                                             }
    //                                                                             comparechart2(fs, fogdata1,fogdata2,fogdata3,fogdata4,fogdata5,fogdata6,fogdata7,fogdata8);
    //                                                                         }
    //                                                                     })
    //                                                                 }
    //                                                             })
    //                                                         }
    //                                                     })
    //                                                 }
    //                                             })
                                                    
    //                                         }
    //                                     })
                                                
    //                                 }
    //                             })
                                            
    //                         }
    //                     })
                                        
    //                 }
    //             })
            }
        })
                            
    }
    Highcharts.setOptions({
        time: {
            timezoneOffset: -11 * 60
        },
        lang: {
            // Pre-v9 legacy settings
            rangeSelectorFrom: 'From',
            rangeSelectorTo: 'To'
        }
    });
}
function comparechart(fs, fogdata1,fogdata2) {
    document.getElementById('curvspred-div').style["display"] = "block";

    var charts = []
    charts.push(
        Highcharts.stockChart('curvspred', {
            chart: {
    backgroundColor: '#FFFFFF',
    style: { fontFamily: "'Inter', 'Roboto', sans-serif" },
    height: 600,
                events: {
                    load: function () {
                        $(".highcharts-legend-item path").attr('stroke-width', 4);
                    },
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
                            height: 400
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
                selected: 0

            },
            title: {
                text: fs + ' Real-Data VS Predicted-Data',
                style:{
                    color: "#333333", 
                    fontSize: "20px" 
                }
            },
            plotOptions:{
                series:{
                    lineWidth:3
                }
            },
            xAxis: {
                plotLines: [{
                    color: '#FF0000', // Red
                    width: 2,
                    // value: fogdata1[fogdata1.length-1][0],
                }],
                // events: {
                //     afterSetExtremes: function(e) {
                //         charts.forEach(function(chart, i) {
                //             if (i !== 0) {
                //                 chart.xAxis[0].setExtremes(e.min, e.max)
                //             }
                //         })
                //     }

                // },
                crosshair: true
            },
            yAxis: [{
                min: 0,
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {
                    text: 'Visibility(in km)',
                    style: {
                        fontSize: "16px",
                        color: "red"
                    }

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
}],
                plotLines: [{
                    value: 1,
                    width: 2,
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
                    fontSize:"15px"
                }
            },
            series: [{
                    name: "Real Values",
                    data: fogdata1,
                    type: 'spline',
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    }

                },
                {
                    name: "Predicted Values",
                    data: fogdata2,
                    type: 'spline',
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>',
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
                        symbolStroke: '#334155',
                        theme: { fill: 'transparent' },
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
    
    

}
function comparechart2(fs, fog,names,colors,status) {
    document.getElementById('curvspred-div').style["display"] = "block";

    var charts = []
    charts.push(
        Highcharts.stockChart('curvspred', {
            chart: {
    backgroundColor: '#FFFFFF',
    style: { fontFamily: "'Inter', 'Roboto', sans-serif" },
    height: 600,
                events: {
                    load: function () {
                        $(".highcharts-legend-item path").attr('stroke-width', 4);
                        
                    },
                    redraw: function () {
                        $(".highcharts-legend-item path").attr('stroke-width', 4);
                        
                    
                    },
                   
                    
                },
                spacingRight:0
                },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 400
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
            plotOptions: {
                series: {
                    events: {
                        afterAnimate: function() {
                            console.log('in')
                            var arr = []
                            var texts=["<div><b>RMSE for T+0.5 : ","</b></div><b><div>RMSE for T+1  : ","</b></div><div><b>RMSE for T+1.5 : ","</b></div><div><b>RMSE for T+2  : ","</b></div><div><b>RMSE for T+2.5 : ","</b></div><div><b>RMSE for T+3  : ","</b></div><div><b>RMSE for T+6  : "]
                            var text =""
                            for(let ser=1;ser<charts[0].series.length;ser++){
                                text+=texts[ser-1]
                                var countn=0,sum=0,valu=0
                                
                                for(var i=0;i<charts[0].series[ser].data.length;i++){
                                    if(charts[0].series[ser].data[i]==undefined){
                                        continue
                                    }
                                    var k=charts[0].series[0].data.findIndex(obj => obj != undefined && obj.x==charts[0].series[ser].data[i].x)
                                    if(k!=-1){
                                        var tv = charts[0].series[ser].data[i].y;
                                        var pv = charts[0].series[0].data[k].y;
                                        sum = sum + Math.pow(tv-pv,2)
                                        countn = countn + 1
                                    }
                                }
                                //console.log(sum,countn)
                                sum = (countn>0)?sum/countn:0;
                                valu = Math.pow(sum,0.5)
                                text += valu
                                arr.push(valu)
                            }
                            text +="</b></div>"
                            // var countn=0,
                            // sum=0,
                            // valu

                            // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            //     var k=charts[0].series[0].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            //     if(k!=-1){
                            //         var tv = charts[0].series[1].processedYData[i];
                            //         var pv = charts[0].series[0].processedYData[k];
                            //         sum = sum + Math.pow(tv-pv,2)
                            //         countn = countn + 1
                            //     }
                            // }
                            // sum = sum/countn;
                            // valu = Math.pow(sum,0.5)
                            // text += valu
                            // arr.push(valu)
                            // text +=
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            //     var k=charts[0].series[2].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            //     if(k!=-1){
                            //         var tv = charts[0].series[1].processedYData[i];
                            //         var pv = charts[0].series[2].processedYData[k];
                            //         sum = sum + Math.pow(tv-pv,2)
                            //         countn = countn + 1
                            //     }
                            // }
                            // sum = sum/countn;
                            // valu = Math.pow(sum,0.5)
                            // text += valu
                            // arr.push(valu)
                            // text+=
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            //     var k=charts[0].series[3].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            //     if(k!=-1){
                            //         var tv = charts[0].series[1].processedYData[i];
                            //         var pv = charts[0].series[3].processedYData[k];
                            //         sum = sum + Math.pow(tv-pv,2)
                            //         countn = countn + 1
                            //     }
                            // }
                            // sum = sum/countn;
                            // valu = Math.pow(sum,0.5)
                            // text += valu
                            // arr.push(valu)
                            // text+="</b></div><div><b>RMSE for T+2  : "
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            //     var k=charts[0].series[4].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            //     if(k!=-1){
                            //         var tv = charts[0].series[1].processedYData[i];
                            //         var pv = charts[0].series[4].processedYData[k];
                            //         sum = sum + Math.pow(tv-pv,2)
                            //         countn = countn + 1
                            //     }
                            // }
                            // sum = sum/countn;
                            // valu = Math.pow(sum,0.5)
                            // text += valu
                            // arr.push(valu)
                            // text+="</b></div><div><b>RMSE for T+2.5 : "
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            //     var k=charts[0].series[5].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            //     if(k!=-1){
                            //         var tv = charts[0].series[1].processedYData[i];
                            //         var pv = charts[0].series[5].processedYData[k];
                            //         sum = sum + Math.pow(tv-pv,2)
                            //         countn = countn + 1
                            //     }
                            // }
                            // sum = sum/countn;
                            // valu = Math.pow(sum,0.5)
                            // text += valu
                            // arr.push(valu)
                            // text+="</b></div><div><b>RMSE for T+3  : "
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            //     var k=charts[0].series[6].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            //     if(k!=-1){
                            //         var tv = charts[0].series[1].processedYData[i];
                            //         var pv = charts[0].series[6].processedYData[k];
                            //         sum = sum + Math.pow(tv-pv,2)
                            //         countn = countn + 1
                            //     }
                            // }
                            // sum = sum/countn;
                            // valu = Math.pow(sum,0.5)
                            // text += valu
                            // arr.push(valu)
                            // text+="</b></div><div><b>RMSE for T+6  : "
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            //     var k=charts[0].series[7].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            //     if(k!=-1){
                            //         var tv = charts[0].series[1].processedYData[i];
                            //         var pv = charts[0].series[7].processedYData[k];
                            //         sum = sum + Math.pow(tv-pv,2)
                            //         countn = countn + 1
                            //     }
                            // }
                            // sum = sum/countn;
                            // valu = Math.pow(sum,0.5)
                            // text += valu+"</b></div>"
                            // arr.push(valu)
                            var sp = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            var dat=charts[0].series[1].data.filter(x => x!=undefined)
                            console.log(dat,dat[0].x)
                            sp.setUTCSeconds(dat[0].x/1000 + 19800);
                            
                            var ep=new Date(0)
                            ep.setUTCSeconds(dat[dat.length-1].x/1000 + 19800)
                            // document.getElementById('rmse').innerHTML = text
                            rmsechart(arr,sp.toLocaleString(),ep.toLocaleString())
                            
                        }
                        
                    }
                }
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
                selected: 0

            },
            title: {
                text: fs + ' Real-Data VS Predicted-Data',
                style:{
                    color: "#333333", 
                    fontSize: "20px" 
                }
            },
            xAxis: {
                plotLines: [{
                    color: '#FF0000', // Red
                    width: 2,
                    // value: fogdata1[fogdata1.length-1][0],
                }],
                // events: {
                //     afterSetExtremes: function(e) {
                //         charts.forEach(function(chart, i) {
                //             if (i !== 0) {
                //                 chart.xAxis[0].setExtremes(e.min, e.max)
                //             }
                //         })
                //     }

                // },
                events: {
                    afterSetExtremes:  function(e) {
                        console.log('extreme')
                        var arr = []
                        var texts=["<div><b>RMSE for T+0.5 : ","</b></div><b><div>RMSE for T+1  : ","</b></div><div><b>RMSE for T+1.5 : ","</b></div><div><b>RMSE for T+2  : ","</b></div><div><b>RMSE for T+2.5 : ","</b></div><div><b>RMSE for T+3  : ","</b></div><div><b>RMSE for T+6  : "]
                            var text =""
                            for(let ser=1;ser<charts[0].series.length;ser++){
                                text+=texts[ser-1]
                                var countn=0,sum=0,valu=0
                                
                                for(var i=0;i<charts[0].series[ser].data.length;i++){
                                    if(charts[0].series[ser].data[i]==undefined){
                                        continue
                                    }
                                    var k=charts[0].series[0].data.findIndex(obj => obj != undefined && obj.x==charts[0].series[ser].data[i].x)
                                    if(k!=-1){
                                        var tv = charts[0].series[ser].data[i].y;
                                        var pv = charts[0].series[0].data[k].y;
                                        sum = sum + Math.pow(tv-pv,2)
                                        countn = countn + 1
                                    }
                                }
                                //console.log(sum,countn)
                                sum = (countn>0)?sum/countn:0;
                                valu = Math.pow(sum,0.5)
                                text += valu
                                arr.push(valu)
                            }
                            text +="</b></div>"
                        // var text="<div><b>RMSE for T+0.5 : "
                        // var countn=0,
                        // sum=0,
                        // valu

                        // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                        //     var k=charts[0].series[0].processedXData.indexOf(charts[0].series[1].processedXData[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[0].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }

                        // sum = sum/countn;
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text +="</b></div><b><div>RMSE for T+1  : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                        //     var k=charts[0].series[2].processedXData.indexOf(charts[0].series[1].processedXData[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[2].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text+="</b></div><div><b>RMSE for T+1.5 : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                        //     var k=charts[0].series[3].processedXData.indexOf(charts[0].series[1].processedXData[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[3].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text+="</b></div><div><b>RMSE for T+2  : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                        //     var k=charts[0].series[4].processedXData.indexOf(charts[0].series[1].processedXData[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[4].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text+="</b></div><div><b>RMSE for T+2.5 : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                        //     var k=charts[0].series[5].processedXData.indexOf(charts[0].series[1].processedXData[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[5].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text+="</b></div><div><b>RMSE for T+3  : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                        //     var k=charts[0].series[6].processedXData.indexOf(charts[0].series[1].processedXData[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[6].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text+="</b></div><div><b>RMSE for T+6  : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                        //     var k=charts[0].series[7].processedXData.indexOf(charts[0].series[1].processedXData[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[7].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // valu = Math.sqrt(sum)
                        // text += valu+"</b></div>"
                        // arr.push(valu)
                        var sp = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        var dat=charts[0].series[1].data.filter(x => x!=undefined)
                        console.log(dat,dat[0].x)
                        sp.setUTCSeconds(dat[0].x/1000 + 19800);
                        
                        var ep=new Date(0)
                        ep.setUTCSeconds(dat[dat.length-1].x/1000 + 19800)
                        // document.getElementById('rmse').innerHTML = text
                        rmsechart(arr,sp.toLocaleString(),ep.toLocaleString())
                        
                    }
                },
                crosshair: true,
                max:fog[0][fog[0].length-1][0]
            },
            yAxis: [{
                min: 0,
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {
                    text: 'Visibility(in km)',
                    style: {
                        fontSize: "16px",
                        color: "red"
                    }

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
}],
                plotLines: [{
                    value: 1,
                    width: 2,
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
                    fontSize:"15px"
                }
            },
            series: getfogdata(fog,names,colors,status),
            // [
            //     {
            //         name: "Prediction (t+0.5)",
            //         data: fogdata2,
            //         type: 'spline',
            //         tooltip: {
            //             pointFormat: '<b>t+0.5: {point.y}</b>',
            //             valueDecimals: 2
            //         },
            //         yAxis: 0,
            //         dataGrouping: {
            //             approximation: 'average'
            //         }

            //     },
            //     {
            //         name: "Real Values",
            //         data: fogdata1,
            //         type: 'spline',
            //         tooltip: {
            //             pointFormat: '<b>t+0: {point.y}</b>',
            //             valueDecimals: 2
            //         },
            //         yAxis: 0,
            //         dataGrouping: {
            //             approximation: 'average'
            //         },
            //         color:'black'

            //     },
            //     {
            //         name: "Prediction (t+1)",
            //         data: fogdata3,
            //         type: 'spline',
            //         tooltip: {
            //             pointFormat: '<b>t+1: {point.y}</b>',
            //             valueDecimals: 2
            //         },
            //         yAxis: 0,
            //         dataGrouping: {
            //             approximation: 'average'
            //         }

            //     },
            //     {
            //         name: "Prediction (t+1.5)",
            //         data: fogdata4,
            //         type: 'spline',
            //         tooltip: {
            //             pointFormat: '<b>t+1.5: {point.y}</b>',
            //             valueDecimals: 2
            //         },
            //         yAxis: 0,
            //         dataGrouping: {
            //             approximation: 'average'
            //         }

            //     },
            //     {
            //         name: "Prediction (t+2)",
            //         data: fogdata5,
            //         type: 'spline',
            //         tooltip: {
            //             pointFormat: '<b>t+2: {point.y}</b>',
            //             valueDecimals: 2
            //         },
            //         yAxis: 0,
            //         dataGrouping: {
            //             approximation: 'average'
            //         }

            //     },
            //     {
            //         name: "Prediction (t+2.5)",
            //         data: fogdata6,
            //         type: 'spline',
            //         tooltip: {
            //             pointFormat: '<b>t+2.5: {point.y}</b>',
            //             valueDecimals: 2
            //         },
            //         yAxis: 0,
            //         dataGrouping: {
            //             approximation: 'average'
            //         }

            //     },
            //     {
            //         name: "Prediction (t+3)",
            //         data: fogdata7,
            //         type: 'spline',
            //         tooltip: {
            //             pointFormat: '<b>t+3: {point.y}</b>',
            //             valueDecimals: 2
            //         },
            //         yAxis: 0,
            //         dataGrouping: {
            //             approximation: 'average'
            //         }

            //     },
            //     {
            //         name: "Prediction (t+6)",
            //         data: fogdata8,
            //         type: 'spline',
            //         tooltip: {
            //             pointFormat: '<b>t+6: {point.y}</b>',
            //             valueDecimals: 2
            //         },
            //         yAxis: 0,
            //         dataGrouping: {
            //             approximation: 'average'
            //         }

            //     }

            // ],
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
    )
    

}
function getfogdata(fog,names,colors,status){
    let ans=[],fl=fog.length
    for(let i=0;i<fl;i++){
        ans.push({
                name:(i==0)?'Real Values': ("Prediction ("+names[i]+")"+(status==7?(i<fl/3?'(mean)':i<2*fl/3?('(mean - std)'):('(mean + std)')):'')),
                data: fog[i],
                type: 'spline',
                tooltip: {
                    pointFormat: '<b>'+names[i]+': {point.y}</b>',
                    valueDecimals: 2
                },
                yAxis: 0,
                dataGrouping: {
                    approximation: 'average'
                },
                color:colors[i]

            },)
    }
    return ans
}
function rmsechart(arr,sp,ep){
    // console.log(arr)
    Highcharts.chart('rmsec',{
        chart:{
            backgroundColor: '#FFFFFF',
            type:'column',
            height: 400
        },
        title: {
            text: "RMSE Chart",
            style:{
                color: "#0F172A", 
                fontSize: "16px",
                fontFamily: "sans-serif",
                fontWeight: "500" 
            }
        },
        xAxis:{
            lineColor: '#CBD5E1',
            lineWidth: 1,
            gridLineWidth: 0,
            labels: {
                style: {
                    color: '#64748B',
                    fontSize: '11px'
                }
            },
            categories: ['T+0.5','T+1','T+1.5','T+2','T+2.5','T+3','T+6'],
            crosshair:true
        },
        legend: {
            enabled: true,
            backgroundColor: '#FFFFFF',
            itemStyle:{
                color: '#334155',
                fontSize:"13px",
                fontWeight: "normal"
            }
        },
	yAxis:[{
        gridLineColor: '#F1F5F9',
        gridLineWidth: 1,
        lineColor: '#CBD5E1',
        lineWidth: 1,
        labels: {
            style: {
                color: '#64748B',
                fontSize: '11px'
            }
        },
	    min:0,
	    title:{
		    text: 'Visibility (in km)',
		    style: {
		        fontSize: "11px",
			    color: "#64748B",
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '600'
		    }
	    }
	}],
        series:[{
	    name: "Time Range: "+sp+" to "+ep,
            data: arr,
            tooltip: {
                pointFormat: '<b>{point.y}</b>',
                valueDecimals: 6
            }
        }]

    })

    
}

autocomplete(document.getElementById("myInputFirst"));

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


$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});
