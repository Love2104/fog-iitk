var charts = []
function comparechart2(allfogdata) {
    document.getElementById('curvspred-div').style["display"] = "block";

    charts = []
    
   var chart = Highcharts.stockChart('curvspred', {
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
                            var text="<div><b>RMSE for T+6hr : "
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
                            text +="</b></div><b><div>RMSE for T+1d  : "
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
                            text+="</b></div><div><b>RMSE for T+3d : "
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
                            text+="</b></div><div><b>RMSE for T+5d  : "
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
                             text += valu+"</b></div>"
                            // arr.push(valu)
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
                text: ' Real-Data VS Predicted-Data',
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
                        var text="<div><b>RMSE for T+6hr : "
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
                        text +="</b></div><b><div>RMSE for T+1d  : "
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
                        text+="</b></div><div><b>RMSE for T+3d : "
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
                        text+="</b></div><div><b>RMSE for T+5d  : "
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
                max:allfogdata[0][allfogdata[0].length-1][0]
            },
            yAxis: [{
                gridLineWidth: 2,
                min: 0,
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {
                    text: 'Visibility(km)',
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
                    name: "Real Values",
                    data: allfogdata[0],
                    type: 'spline',
                    tooltip: {
                        pointFormat: 't+0: <b>{point.y}</b> km',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    },
                     color:'black'

                },
                {
                    name: "Prediction (t+6hr)",
                    data: allfogdata[1],
                    type: 'spline',
                    tooltip: {
                        pointFormat: 't+6hr: <b>{point.y}</b> km',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    }

                },
                
                {
                    name: "Prediction (t+1d)",
                    data: allfogdata[2],
                    type: 'spline',
                    tooltip: {
                        pointFormat: 't+1d: <b>{point.y}</b> km',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    }

                },
                {
                    name: "Prediction (t+3d)",
                    data: allfogdata[3],
                    type: 'spline',
                    tooltip: {
                        pointFormat: 't+3d: <b>{point.y}</b> km',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    }

                },
                {
                    name: "Prediction (t+5d)",
                    data: allfogdata[4],
                    type: 'spline',
                    tooltip: {
                        pointFormat: 't+5d: <b>{point.y}</b> km',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    }

                },
                

            ],
            exporting: {
                buttons: {
                    contextButton: {
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
    
    return chart
    

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
            categories: ['T+6hr','T+1d','T+3d','T+5d'],
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
        gridLineWidth: 2,
	    title:{
		    text: 'Visibility(km)',
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
                pointFormat: '<b>{point.y}</b> km',
                valueDecimals: 6
            }
        }]

    })

    
}
function checkar(cityname){
    let f=0
    for(let i=0;i<arr.length;i++){
        
        if(arr[i]==cityname){
            f=1;
            break
        }
    }
    if(f==1)
        return true
    return false
}
function loaddata(){
    cityname = document.getElementById("myInput").value;
    console.log(cityname,arr)   
    if(!checkar(cityname)){
        alert('Please Enter valid city name')
        return
    }
    cityid=cityname
    var allfogdata=[],
    fogdata1 = [],
        fogdata2 = [],
        fogdata3=[],
        fogdata4=[],
        fogdata5=[]
    $.ajax({
        url: "apis/long_pred_comp.php?station=Lucknow",
        success: function(result) {
            console.log(result)
            var data = JSON.parse(result)
            console.log(data[0].length)
            var dataLength = data.length,
                i = 0;
            for(let j=1;j<data[0].length;j++){
                allfogdata.push([])
            }
            for (i; i < dataLength; i += 1) {
                let adds=[0,0,6,24,3*24,5*24]
                for(let j=1;j<data[i].length;j++){
                    let y=parseFloat(data[i][j]);
                    if(y>0.05 && y<=2 ){
                    
                    y=-0.05*3/Math.log(1-y);
                    }
                     else if(y>2){
                        y=2;
                      }
                    else{
                      y=0.1;
                      continue
                    }
                    if(y>2){
                        y=2;
                      }

                    allfogdata[j-1].push([
                        data[i][0]+adds[j]*3600000,
                        y,
                        data[i][j]
                    ]);
                    //.push(arr)
                }
            }
            console.log(allfogdata)
            //     fogdata2.push([
            //         data[i][0]+6*3600000,
            //         data[i][2]
            //     ]);
            //     fogdata3.push([
            //         data[i][0]+24*3600000,
            //         data[i][3]
            //     ]);
            //     fogdata4.push([
            //         data[i][0]+3*24*3600000,
            //         data[i][4]
            //     ]);
            //     fogdata5.push([
            //         data[i][0]+5*24*3600000,
            //         data[i][5]
            //     ]);

            // }
            // comparechart2(fogdata1,fogdata2,fogdata3,fogdata4,fogdata5)
            console.log(allfogdata[0].length,allfogdata[0][allfogdata[0].length-70][0], allfogdata[0][allfogdata[0].length-50][0])
            let chartn=comparechart2(allfogdata)
            chartn.xAxis[0].setExtremes(allfogdata[0][allfogdata[0].length-75][0], allfogdata[0][allfogdata[0].length-55][0])
            chartn.reflow()
            charts.push(chartn);
            var renderTime = Date.now() - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');

        }
    })
}