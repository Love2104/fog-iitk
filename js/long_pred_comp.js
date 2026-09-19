var charts = []
function comparechart2(allfogdata) {
    document.getElementById('curvspred-div').style["display"] = "block";

    
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
                            var texts=["<div><b>RMSE for T+6hr : ","</b></div><b><div>RMSE for T+1d  : ","</b></div><div><b>RMSE for T+3d : ","</b></div><div><b>RMSE for T+5d  : "]
                            var text=""
                            
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
                                console.log(sum,countn)
                                sum = (countn>0)?sum/countn:0;
                                valu = Math.pow(sum,0.5)
                                text += valu
                                arr.push(valu)
                            }
                            text +="</b></div>"
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].data.length;i++){
                            //     var k=charts[0].series[2].data.indexOf(charts[0].series[1].data[i])
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
                            //text+=""
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].data.length;i++){
                            //     var k=charts[0].series[3].data.indexOf(charts[0].series[1].data[i])
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
                            //text+=""
                            // countn=0
                            // sum=0
                            // for(var i=0;i<charts[0].series[1].data.length;i++){
                            //     var k=charts[0].series[4].data.indexOf(charts[0].series[1].data[i])
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
                            // for(var i=0;i<charts[0].series[1].data.length;i++){
                            //     var k=charts[0].series[5].data.indexOf(charts[0].series[1].data[i])
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
                            // for(var i=0;i<charts[0].series[1].data.length;i++){
                            //     var k=charts[0].series[6].data.indexOf(charts[0].series[1].data[i])
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
                            // for(var i=0;i<charts[0].series[1].data.length;i++){
                            //     var k=charts[0].series[7].data.indexOf(charts[0].series[1].data[i])
                            //     if(k!=-1){
                            //         var tv = charts[0].series[1].processedYData[i];
                            //         var pv = charts[0].series[7].processedYData[k];
                            //         sum = sum + Math.pow(tv-pv,2)
                            //         countn = countn + 1
                            //     }
                            // }
                            // sum = sum/countn;
                            // valu = Math.pow(sum,0.5)
                             
                            // arr.push(valu)
                            var sp = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            var dat=charts[0].series[1].data.filter(x => x!=undefined)
                            console.log(dat,dat[0].x)
                            sp.setUTCSeconds(dat[0].x/1000 + 19800);
                            
                            var ep=new Date(0)
                            ep.setUTCSeconds(dat[dat.length-1].x/1000 + 19800)
                            // console.log(text)
                            // document.getElementById('rmse').innerHTML = text
                            console.log(arr)
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
                text: ' Real-Data VS Forecated-Data',
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
                            var texts=["<div><b>RMSE for T+6hr : ","</b></div><b><div>RMSE for T+1d  : ","</b></div><div><b>RMSE for T+3d : ","</b></div><div><b>RMSE for T+5d  : "]
                            var text=""
                            
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
                                console.log(sum,countn)
                                sum = (countn>0)?sum/countn:0;
                                valu = Math.pow(sum,0.5)
                                text += valu
                                arr.push(valu)
                            }
                            text +="</b></div>"
                        // var arr = []
                        // var text="<div><b>RMSE for T+6hr : "
                        // var countn=0,
                        // sum=0,
                        // valu

                        // for(var i=0;i<charts[0].series[1].data.length;i++){
                        //     var k=charts[0].series[0].data.indexOf(charts[0].series[1].data[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[0].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }

                        // sum = sum/countn;
                        // console.log(sum,countn)
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text +="</b></div><b><div>RMSE for T+1d  : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].data.length;i++){
                        //     var k=charts[0].series[2].data.indexOf(charts[0].series[1].data[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[2].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // console.log(sum,countn)
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text+="</b></div><div><b>RMSE for T+3d : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].data.length;i++){
                        //     var k=charts[0].series[3].data.indexOf(charts[0].series[1].data[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[3].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // console.log(sum,countn)
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        // text+="</b></div><div><b>RMSE for T+5d  : "
                        // countn=0
                        // sum=0
                        // for(var i=0;i<charts[0].series[1].data.length;i++){
                        //     var k=charts[0].series[4].data.indexOf(charts[0].series[1].data[i])
                        //     if(k!=-1){
                        //         var tv = charts[0].series[1].processedYData[i];
                        //         var pv = charts[0].series[4].processedYData[k];
                        //         sum = sum + Math.pow(tv-pv,2)
                        //         countn = countn + 1
                        //     }
                        // }
                        // sum = sum/countn;
                        // console.log(sum,countn)
                        // valu = Math.sqrt(sum)
                        // text += valu
                        // arr.push(valu)
                        
                        // text += valu+"</b></div>"
                        // arr.push(valu)
                        var sp = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        var dat=charts[0].series[1].data.filter(x => x!=undefined)
                        console.log(dat,dat[0].x)
                        sp.setUTCSeconds(dat[0].x/1000 + 19800);
                        
                        var ep=new Date(0)
                        ep.setUTCSeconds(dat[dat.length-1].x/1000 + 19800)
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
                min: 0,
                gridLineWidth: 2,
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {
                    text: 'Fog Index',
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
                        pointFormat: '<b>t+0: {point.y}</b>',
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
                        pointFormat: '<b>t+6hr: {point.y}</b>',
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
                        pointFormat: '<b>t+1d: {point.y}</b>',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    }

                },
                {
                    name: "Prediction (t+3d)",
                    data: allfogdata[4],
                    type: 'spline',
                    tooltip: {
                        pointFormat: '<b>t+3d: {point.y}</b>',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    }

                },
                {
                    name: "Prediction (t+5d)",
                    data: allfogdata[5],
                    type: 'spline',
                    tooltip: {
                        pointFormat: '<b>t+5d: {point.y}</b>',
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
	    title:{
		    text: 'Fog Index',
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
var arr = [], arra = []
$(document).ready(function() {
    $.ajax({
        url: "apis/map.php",
        async: "false",
        success: function(result) {
            arr=[]
            data = JSON.parse(result)
            // console.log(data)
            var datalen = data.length
            for (i = 0; i < datalen; i += 1) {
                arra.push([data[i][0], data[i][1], data[i][2]])
                arr.push(data[i][0])
            }
            console.log(arr)
            document.getElementById('myInput').value = 'Lucknow';
            cityid='Lucknow'
            loaddata()
            
        }
        
    });
    // $("#page").LoadingOverlay("show");
    
    
    // showchart(temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time)
    // var {L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time}=
    
    // showchart2(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time)
    
    
});
$('#myInput').on('keyup', autocomplete(document.getElementById("myInput")));

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
$('#myInput').on('keyup', autocomplete(document.getElementById("myInput")));

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
        url: "apis/long_pred_comp.php?station="+cityname,
        success: function(result) {
            console.log(result)
            var data = JSON.parse(result)
            
            var dataLength = data.length,
                i = 0;
            for(let j=1;j<data[0].length;j++){
                allfogdata.push([])
            }
            for (i; i < dataLength; i += 1) {
                let adds=[0,0,6,24,3*24,5*24]
                for(let j=1;j<data[0].length;j++){
                    allfogdata[j-1].push([
                        data[i][0]+adds[j]*3600000,
                        data[i][j]
                    ]);
                    //.push(arr)
                }
            }
            console.log(allfogdata.length)
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
            comparechart2(allfogdata)
            var renderTime = Date.now() - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');

        }
    })
}

$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});
function autocomplete(inp) {
    
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;

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
//from 3640
