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
function checkModel(element){

    var fs = document.getElementById("myInputFirst").value;
    if(fs==""){
        alert("Enter the city first");
        return;
    }
    // var mn = element.getAttribute("modelno");
    var tex=""
    var mn = element;
    if(mn==4)
        tex = "Gradient Boosting"
    else 
        tex = "Model "+mn
    document.getElementById("model-choose").textContent = tex
    // if(mn==4){
    //     document.getElementById('mod4').style["display"] = "block";
    // }
    // else{
    //     document.getElementById('mod4').style["display"] = "none";
    // }
    onModelChange(element)
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
    if(mn!=4){
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
        document.getElementById('rmsec').style["display"] = "block";
        $.ajax({
            url: "apis/findlast.php?station=" + fs,
            success: function(result) {
                var data = JSON.parse(result)
                var ent = new Date(0);
                ent.setUTCSeconds(data[0]/1000);
                $.ajax({
                    url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno=405&status=1",
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
                        $.ajax({
                            url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno=410&status=1",
                            success: function(result) {
                                var data = JSON.parse(result)
                                var dataLength = data.length,
                                    i = 0;
                    
                                for (i; i < dataLength; i += 1) {
                                    fogdata3.push([
                                        data[i][0],
                                        data[i][1]
                                    ]);
                    
                                }
                                $.ajax({
                                    url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno=415&status=1",
                                    success: function(result) {
                                        var data = JSON.parse(result)
                                        var dataLength = data.length,
                                            i = 0;
                            
                                        for (i; i < dataLength; i += 1) {
                                            fogdata4.push([
                                                data[i][0],
                                                data[i][1]
                                            ]);
                            
                                        }
                                        $.ajax({
                                            url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno=420&status=1",
                                            success: function(result) {
                                                var data = JSON.parse(result)
                                                var dataLength = data.length,
                                                    i = 0;
                                    
                                                for (i; i < dataLength; i += 1) {
                                                    fogdata5.push([
                                                        data[i][0],
                                                        data[i][1]
                                                    ]);
                                    
                                                }
                                                $.ajax({
                                                    url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno=425&status=1",
                                                    success: function(result) {
                                                        var data = JSON.parse(result)
                                                        var dataLength = data.length,
                                                            i = 0;
                                            
                                                        for (i; i < dataLength; i += 1) {
                                                            fogdata6.push([
                                                                data[i][0],
                                                                data[i][1]
                                                            ]);
                                            
                                                        }
                                                        $.ajax({
                                                            url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno=460&status=1",
                                                            success: function(result) {
                                                                var data = JSON.parse(result)
                                                                var dataLength = data.length,
                                                                    i = 0;
                                                    
                                                                for (i; i < dataLength; i += 1) {
                                                                    fogdata8.push([
                                                                        data[i][0],
                                                                        data[i][1]
                                                                    ]);
                                                    
                                                                }
                                                                $.ajax({
                                                                    url: "apis/curvspred.php?station=" + fs+"&etime="+ent.toUTCString()+"&modelno=4&status=1",
                                                                    success: function(result) {
                                                                        var data = JSON.parse(result)
                                                                        var dataLength = data.length,
                                                                            i = 0;
                                                            
                                                                        for (i; i < dataLength; i += 1) {
                                                                            fogdata7.push([
                                                                                data[i][0],
                                                                                data[i][1]
                                                                            ]);
                                                            
                                                                        }
                                                                        var stime = new Date(0); // The 0 there is the key, which sets the date to the epoch
                                                                        stime.setUTCSeconds(data[0][0]/1000);
                                                                        
                                                                        $.ajax({
                                                                            url: "apis/curvspred.php?station=" + fs+"&stime="+stime.toUTCString()+"&etime="+ent.toUTCString()+"&status=0",
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
                                                                                comparechart2(fs, fogdata1,fogdata2,fogdata3,fogdata4,fogdata5,fogdata6,fogdata7,fogdata8);
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                                    
                                            }
                                        })
                                                
                                    }
                                })
                                            
                            }
                        })
                                        
                    }
                })
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
    console.log(charts[0])
    
    

}
function comparechart2(fs, fogdata1,fogdata2,fogdata3,fogdata4,fogdata5,fogdata6,fogdata7,fogdata8) {
    document.getElementById('curvspred-div').style["display"] = "block";

    var charts = []
    charts.push(
        Highcharts.stockChart('curvspred', {
            chart: {
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
            plotOptions: {
                series: {
                    events: {
                        afterAnimate: function() {
                            var arr = []
                            var text="<div><b>RMSE for T+0.5 : "
                            var countn=0,
                            sum=0,
                            valu

                            for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                var k=charts[0].series[0].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                if(k!=-1){
                                    var tv = charts[0].series[1].processedYData[i];
                                    var pv = charts[0].series[0].processedYData[k];
                                    sum = sum + Math.pow(tv-pv,2)
                                    countn = countn + 1
                                }
                            }
                            sum = sum/countn;
                            valu = Math.pow(sum,0.5)
                            text += valu
                            arr.push(valu)
                            text +="</b></div><b><div>RMSE for T+1  : "
                            countn=0
                            sum=0
                            for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                var k=charts[0].series[2].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                if(k!=-1){
                                    var tv = charts[0].series[1].processedYData[i];
                                    var pv = charts[0].series[2].processedYData[k];
                                    sum = sum + Math.pow(tv-pv,2)
                                    countn = countn + 1
                                }
                            }
                            sum = sum/countn;
                            valu = Math.pow(sum,0.5)
                            text += valu
                            arr.push(valu)
                            text+="</b></div><div><b>RMSE for T+1.5 : "
                            countn=0
                            sum=0
                            for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                var k=charts[0].series[3].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                if(k!=-1){
                                    var tv = charts[0].series[1].processedYData[i];
                                    var pv = charts[0].series[3].processedYData[k];
                                    sum = sum + Math.pow(tv-pv,2)
                                    countn = countn + 1
                                }
                            }
                            sum = sum/countn;
                            valu = Math.pow(sum,0.5)
                            text += valu
                            arr.push(valu)
                            text+="</b></div><div><b>RMSE for T+2  : "
                            countn=0
                            sum=0
                            for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                var k=charts[0].series[4].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                if(k!=-1){
                                    var tv = charts[0].series[1].processedYData[i];
                                    var pv = charts[0].series[4].processedYData[k];
                                    sum = sum + Math.pow(tv-pv,2)
                                    countn = countn + 1
                                }
                            }
                            sum = sum/countn;
                            valu = Math.pow(sum,0.5)
                            text += valu
                            arr.push(valu)
                            text+="</b></div><div><b>RMSE for T+2.5 : "
                            countn=0
                            sum=0
                            for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                var k=charts[0].series[5].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                if(k!=-1){
                                    var tv = charts[0].series[1].processedYData[i];
                                    var pv = charts[0].series[5].processedYData[k];
                                    sum = sum + Math.pow(tv-pv,2)
                                    countn = countn + 1
                                }
                            }
                            sum = sum/countn;
                            valu = Math.pow(sum,0.5)
                            text += valu
                            arr.push(valu)
                            text+="</b></div><div><b>RMSE for T+3  : "
                            countn=0
                            sum=0
                            for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                var k=charts[0].series[6].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                if(k!=-1){
                                    var tv = charts[0].series[1].processedYData[i];
                                    var pv = charts[0].series[6].processedYData[k];
                                    sum = sum + Math.pow(tv-pv,2)
                                    countn = countn + 1
                                }
                            }
                            sum = sum/countn;
                            valu = Math.pow(sum,0.5)
                            text += valu
                            arr.push(valu)
                            text+="</b></div><div><b>RMSE for T+6  : "
                            countn=0
                            sum=0
                            for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                                var k=charts[0].series[7].processedXData.indexOf(charts[0].series[1].processedXData[i])
                                if(k!=-1){
                                    var tv = charts[0].series[1].processedYData[i];
                                    var pv = charts[0].series[7].processedYData[k];
                                    sum = sum + Math.pow(tv-pv,2)
                                    countn = countn + 1
                                }
                            }
                            sum = sum/countn;
                            valu = Math.pow(sum,0.5)
                            text += valu+"</b></div>"
                            arr.push(valu)
                            var sp = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            sp.setUTCSeconds(charts[0].series[1].processedXData[0]/1000 + 19800);
                            
                            var ep=new Date(0)
                            ep.setUTCSeconds(charts[0].series[1].processedXData[charts[0].series[1].processedXData.length-1]/1000 + 19800)
                            // console.log(text)
                            // document.getElementById('rmse').innerHTML = text
                            rmsechart(arr,sp.toLocaleString(),ep.toLocaleString())
                            
                        }
                    }
                }
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
                    afterSetExtremes: function(e) {
                        var arr = []
                        var text="<div><b>RMSE for T+0.5 : "
                        var countn=0,
                        sum=0,
                        valu

                        for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            var k=charts[0].series[0].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            if(k!=-1){
                                var tv = charts[0].series[1].processedYData[i];
                                var pv = charts[0].series[0].processedYData[k];
                                sum = sum + Math.pow(tv-pv,2)
                                countn = countn + 1
                            }
                        }

                        sum = sum/countn;
                        console.log(sum,countn)
                        valu = Math.sqrt(sum)
                        text += valu
                        arr.push(valu)
                        text +="</b></div><b><div>RMSE for T+1  : "
                        countn=0
                        sum=0
                        for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            var k=charts[0].series[2].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            if(k!=-1){
                                var tv = charts[0].series[1].processedYData[i];
                                var pv = charts[0].series[2].processedYData[k];
                                sum = sum + Math.pow(tv-pv,2)
                                countn = countn + 1
                            }
                        }
                        sum = sum/countn;
                        console.log(sum,countn)
                        valu = Math.sqrt(sum)
                        text += valu
                        arr.push(valu)
                        text+="</b></div><div><b>RMSE for T+1.5 : "
                        countn=0
                        sum=0
                        for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            var k=charts[0].series[3].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            if(k!=-1){
                                var tv = charts[0].series[1].processedYData[i];
                                var pv = charts[0].series[3].processedYData[k];
                                sum = sum + Math.pow(tv-pv,2)
                                countn = countn + 1
                            }
                        }
                        sum = sum/countn;
                        console.log(sum,countn)
                        valu = Math.sqrt(sum)
                        text += valu
                        arr.push(valu)
                        text+="</b></div><div><b>RMSE for T+2  : "
                        countn=0
                        sum=0
                        for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            var k=charts[0].series[4].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            if(k!=-1){
                                var tv = charts[0].series[1].processedYData[i];
                                var pv = charts[0].series[4].processedYData[k];
                                sum = sum + Math.pow(tv-pv,2)
                                countn = countn + 1
                            }
                        }
                        sum = sum/countn;
                        console.log(sum,countn)
                        valu = Math.sqrt(sum)
                        text += valu
                        arr.push(valu)
                        text+="</b></div><div><b>RMSE for T+2.5 : "
                        countn=0
                        sum=0
                        for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            var k=charts[0].series[5].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            if(k!=-1){
                                var tv = charts[0].series[1].processedYData[i];
                                var pv = charts[0].series[5].processedYData[k];
                                sum = sum + Math.pow(tv-pv,2)
                                countn = countn + 1
                            }
                        }
                        sum = sum/countn;
                        console.log(sum,countn)
                        valu = Math.sqrt(sum)
                        text += valu
                        arr.push(valu)
                        text+="</b></div><div><b>RMSE for T+3  : "
                        countn=0
                        sum=0
                        for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            var k=charts[0].series[6].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            if(k!=-1){
                                var tv = charts[0].series[1].processedYData[i];
                                var pv = charts[0].series[6].processedYData[k];
                                sum = sum + Math.pow(tv-pv,2)
                                countn = countn + 1
                            }
                        }
                        sum = sum/countn;
                        console.log(sum,countn)
                        valu = Math.sqrt(sum)
                        text += valu
                        arr.push(valu)
                        text+="</b></div><div><b>RMSE for T+6  : "
                        countn=0
                        sum=0
                        for(var i=0;i<charts[0].series[1].processedXData.length;i++){
                            var k=charts[0].series[7].processedXData.indexOf(charts[0].series[1].processedXData[i])
                            if(k!=-1){
                                var tv = charts[0].series[1].processedYData[i];
                                var pv = charts[0].series[7].processedYData[k];
                                sum = sum + Math.pow(tv-pv,2)
                                countn = countn + 1
                            }
                        }
                        sum = sum/countn;
                        console.log(sum,countn)
                        valu = Math.sqrt(sum)
                        text += valu+"</b></div>"
                        arr.push(valu)
                        var sp = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        sp.setUTCSeconds(charts[0].series[1].processedXData[0]/1000 + 19800);
                        
                        var ep=new Date(0)
                        ep.setUTCSeconds(charts[0].series[1].processedXData[charts[0].series[1].processedXData.length-1]/1000 + 19800)
                        // console.log(text)
                        // document.getElementById('rmse').innerHTML = text
                        // console.log(charts[0].series[1])
                        rmsechart(arr,sp.toLocaleString(),ep.toLocaleString())
                        
                    }

                },
                crosshair: true,
                max:fogdata1[fogdata1.length-1][0]
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
            series: [
                {
                    name: "Prediction (t+0.5)",
                    data: fogdata2,
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
                    data: fogdata3,
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
                    data: fogdata4,
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
                    data: fogdata5,
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
                    data: fogdata6,
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
                    data: fogdata7,
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
                    name: "Prediction (t+6)",
                    data: fogdata8,
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
    )
    

}
function rmsechart(arr,sp,ep){
    // console.log(arr)
    Highcharts.chart('rmsec',{
        chart:{
            type:'column',
            height: 400
        },
        title: {
            text: "RMSE Chart",
            style:{
                color: "#333333", 
                fontSize: "20px" 
            }
        },
        xAxis:{
            categories: ['T+0.5','T+1','T+1.5','T+2','T+2.5','T+3','T+6'],
            crosshair:true
        },
        legend: {
            enabled: true,
            itemStyle:{
                fontSize:"15px"
            }
        },
	yAxis:[{
	    min:0,
	    title:{
		    text: 'Visibility (in km)',
		    style: {
		        fontSize: "16px",
			color: "red"
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
