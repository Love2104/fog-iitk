var arr = [],cityid='', arra=[];

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
            
        }
        
    });
    // $("#page").LoadingOverlay("show");
    var d=new Date()
    var s=new Date();
    document.getElementById('myInput').value = 'Lucknow';
    cityid='Lucknow'
    s.setDate(d.getDate()-1)
    var start=s.getFullYear()+'-'+((s.getMonth()+1)<10?'0'+(s.getMonth()+1):(s.getMonth()+1))+'-'+(s.getDate()<10?'0'+s.getDate():s.getDate())
    var end=d.getFullYear()+'-'+((d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1))+'-'+(d.getDate()<10?'0'+d.getDate():d.getDate())
    document.getElementById("start_date").value = start;
    document.getElementById("end_date").value = end;
    showdata('1 DAY')
    // showchart(temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time)
    // var {L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time}=
    
    // showchart2(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time)
    
    
});
$('#myInput').on('keyup', autocomplete(document.getElementById("myInput")));

function sub(){
    let  s= document.getElementById("start_date").value
    let e=document.getElementById("end_date").value
    let n=new Date();
    n=n.getFullYear()+'-'+((n.getMonth()+1)<10?'0'+(n.getMonth()+1):(s.getMonth()+1))+'-'+n.getDate()
    if(s>e){
        alert("Start date should be smaller than end date")
        return
    }
    if(s>n || e>n){
        alert("Please do not enter future period")
        return 
    }
    showdata('1 DAY',s,e)

}

function loaddata(){
    cityname = document.getElementById("myInput").value;
            
    if(!checkar(cityname)){
        alert('Please Enter valid city name')
        return
    }
    cityid=cityname
    showdata('1 DAY')
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
function formatDate() {
    var d = new Date();
	d = d.setDate(d.getDate()-10);
       var  month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function showdata(interval,start=-1,end=-1) {
    
    charts=[]
    var ind=Array(),
    ind1 = Array(),
    ind2 = Array(),
    ind3 = Array(),
    ind4 = Array(),
    ind5=Array(),
    j = 0,
    last_time = '2021 - 05 - 2012'
    console.log(start,end)
    // console.log(cityid,interval)
    $.ajax({
            //crossDomain: true,
            //dataType: 'jsonp',
            // url: "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-03-22/" + formatDate() + "/862549045430298/DeviceDate",
            
            url:(start==-1 || end==-1)? "apis/long_term_pred.php?interval="+interval+"&station="+cityid:"apis/long_term_pred.php?start_date="+start+"&end_date="+end+"&station="+cityid,
            async: false,
            success: function(result) {
                console.log(result.toString())
                var data = JSON.parse(result.toString())
                ind=data[0]
                ind1=data[1]
                console.log(ind1)
                // var myDate = new Date((parseInt(data[0]))*1000);
                // var myEpoch = (myDate.getTime())
                
                // console.log(ind)
            //     var dataLength = data.length,
            //         i = 0
            //     // last_time = data[dataLength - 1]['date_time']
            //     // prevEpoch = 0
            //     for (i; i < dataLength; i += 1) {
            //         var myDate = new Date((parseInt(data[i][0]))*1000); // Your timezone!
                    
            //         var myEpoch = (myDate.getTime()) 
            //         console.log(new Date((parseInt(data[i][0]))*1000))
            //         // if (i != 0 && myEpoch - prevEpoch < 300000)
            //         //     continue
            //             // console.log(myEpoch)
            //         ind1.push([
            //             myEpoch,
            //             // (data[i]['MaxTemp'] + data[i]['MinTemp']) / 2
            //             (parseFloat(data[i][1])<0)?0:parseFloat(data[i][1])
            //         ]);
            //         ind2.push([
            //             myEpoch,//+6*3600000000,
            //             // (data[i]['MinMoisture'] + data[i]['MaxMoisture']) / 2
            //             (parseFloat(data[i][2])<0)?0:parseFloat(data[i][2])
            //         ]);
            //         ind3.push([
            //             myEpoch,//+24*3600000000,
            //             (parseFloat(data[i][3])<0)?0:parseFloat(data[i][3])
            //         ]);
            //         ind4.push([
            //             myEpoch,//+3*24*3600000000,
            //             (parseFloat(data[i][4])<0)?0:parseFloat(data[i][4])
            //         ]);
            //         ind5.push([
            //             myEpoch,//+5*24*3600000000,
            //             (parseFloat(data[i][5])<0)?0:parseFloat(data[i][5])
            //         ]);
                    
                }
            // }
        // }
    })
    if(ind1.length>0 && ind1[0][0]!=ind[ind.length-1][0])
                ind1.unshift(ind[ind.length-1])
            else if(ind.length>0)
                ind1[0]=ind[ind.length-1]
        showchart(ind,ind1)   
        var renderTime = Date.now() - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');
    // return{temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time}
    


};


var inter='day'
var charts=[]
function getchart(id,name,unit,data,ind,tick){
    //console.log(data)
        return Highcharts.chart(id, {
            allowChartUpdate:false,
                chart: {
                    height: 600,
                    panning: true,
                    events: {
                        redraw:true
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
                rangeSelector: (ind==0)?{
                    
                    buttons:[{
                        type: 'day',
                        count: 1,
                        text: '1d',
             
                        // events:{
                        //     click: function() {
                        //         if(inter=='day')
                        //             return 
                        //         inter='day'
                        //         showdata('1 DAY')
                               
                                
                        //     }
                        // },
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w',
                        // events:{
                        //     click: function() {
                        //         if(inter=='week')
                        //             return 
                        //         inter='week'
                        //         showdata('7 DAY')
                               
                        //     }
                        // },
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m',
                        // events:{
                        //     click: function() {
                        //         if(inter=='month')
                        //             return 
                        //         inter='month'
                        //         showdata('1 MONTH')
                               
                        //     }
                        // },
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y',
                        // events:{
                        //     click: function() {
                        //         if(inter=='year' || inter=='all')
                        //             return 
                        //         inter='year'
                                
                        //         showdata('1 YEAR')
                        //     }
                        // },
                    }, {
                        type: 'all',
                        count:1,
                        text: 'All',
                        // events:{
                        //     click: function() {
                        //         if(inter=='all' || inter=='year')
                        //             return 
                        //         inter='all'
                        //         // var d=new Date()
                        //         // var start= "2021-03-22 00:00:17"
                        //         // var end=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
                        //         // var {temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time}=
                        //         showdata('10 YEAR')
                        //         // aws_charts[0].series[0].update({
                        //         //     // pointStart: newSeries[0].pointStart,
                        //         //     data: temperaturedata
                        //         // }, false,true);
                        //         // aws_charts[1].series[0].update({
                        //         //     // pointStart: newSeries[0].pointStart,
                        //         //     data: humiditydata
                        //         // }, false,true);
                        //         // aws_charts[2].series[0].update({
                        //         //     // pointStart: newSeries[0].pointStart,
                        //         //     data: winddata
                        //         // }, false,true);
                        //         // aws_charts[3].series[0].update({
                        //         //     // pointStart: newSeries[0].pointStart,
                        //         //     data: sunshinedata
                        //         // }, false,true);
                        //         // aws_charts[4].series[0].update({
                        //         //     // pointStart: newSeries[0].pointStart,
                        //         //     data: atmosphericpressuredata
                        //         // }, false,true);
                        //         // aws_charts[5].series[0].update({
                        //         //     // pointStart: newSeries[0].pointStart,
                        //         //     data: raindata
                        //         // }, false,true);
                        //     }
                        // },
                    }
                ],
                    inputEnabled: true,
                    selected: 0,
                    enabled: true,

                }:{
                    buttons: [{
                            //type: 'day',
                            count: 1,
                            text: '1d'
                        }, {
                            //type: 'week',
                            count: 1,
                            text: '1w'
                        },
                        {
                            //type: 'month',
                            count: 1,
                            text: '1m'
                        }, {
                            //type: 'year',
                            count: 1,
                            text: '1y'
                        }, {
                            //type: 'all',
                            text: 'All'
                        }
                    ],
                    inputEnabled: false,
                    selected: 0,
                    enabled: false
                },
                title: {
                    text: name[0] +'(km)',
                    align: 'left',
                    style: {
                        // fontSize: "20px",
                        color: "red"
                    }
                },
                plotOptions: {
                    
                    column: {
                        groupPadding: 0,
                        pointPadding: 0,
                        borderWidth: 0
                    },
                    
                    series: {
                        point: {
                            events: {
                                mouseOver: function(e) {
                                    // console.log(charts[0].series[0].points)
                                    // k = charts[ind].series[0].points[0].index;
                                    // for (var i = 0; i < charts.length; i++) {
                                        
                                    //    // charts[i].series[0].points[this.index - k].setState('hover');
                                    //      charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])
    
                                    //     // charts[i].xAxis[0].addPlotLine({
                                    //     //     id: 'xPlotLine',
                                    //     //     value: this.x,
                                    //     //     width: 1,
                                    //     //     color: '#C0C0C0'
                                    //     // });
                                    // }
                                    // $(".highcharts-markers path").attr('visibility', 'visible')
    
                                },
                                mouseOut: function(e) {
                                    // k = charts[1].series[0].points[0].index;
                                    // for (var i = 0; i < charts.length; i++) {
                                    //     // if (i == 0)
                                    //     //     continue;
                                    //     // charts[i].xAxis[0].removePlotLine('xPlotLine');
                                    //     charts[i].tooltip.hide();
                                    // }
                                    //  $(".highcharts-markers path").attr('visibility', 'hidden')
    
                                }
                            }
                        }
                    }
                },
                yAxis: {
                    // max:5,
                    // min: 0,
                    // max:80,
                    gridLineWidth: 1,
                    labels: {
                        align: 'right',
                        x: -5
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
                    }],
                    top: '0%',
                    height: '100%',
                    offset: 10,
                    lineWidth: 0,
                    opposite: false,
                    resize: {
                        enabled: true
                    }

                },

                xAxis: {
                    // max: temperaturedata[temperaturedata.length - 1][0],
                    events: {
                        afterSetExtremes: function(e) {
                            // charts.forEach(function(chart, i) {
                                    
                            //         // charts[0].xAxis[0].setExtremes(data[0][0][0], data[1][data[1].length-1][0])
                            //         chart.xAxis[0].setExtremes(data[0][0][0], data[1][data[1].length-1][0])
                                
                            // })
                        }

                    },
                    plotLines: [{
                        color: 'rgb(255,170,20)', // Red
                        width: 2,
                        value: data[0][data[0].length - 1][0],
                        zIndex:1
                    }],
                    crosshair: true,
                    type: 'datetime',
                    crosshair: true,
                    tickInterval:6*3600*1000
                    // tickPositioner: function(){
                    //     return _.forEach(this.tickPositions, function(date){                         
                    //         console.log('date',date, new Date(date), new Date(date - 60*60*24*1000*15));
                    //         return date;   //uncomment to show orginal dates                     
                    //         // return (date - 60*60*24*1000*15);
                    //     });

                    // //     function () {
                    // //     console.log(this.chart.series[0].points)
                    // //     var positions = [],points=this.chart.series[0].points
                    // //     if(points!=undefined){
                    // //         for(let i=0;i<points.length;i++){
                    // //             positions.push(points[i].x)
                    // //         }
                    // //         return positions;
                    // //     }
                    // }
                    
                },

                series: getdata(name,data,unit),
                // series: [{
                    //             name: 'Rain(mm per hour)',
                    //             data: raindata,
                    //             type: 'column',
                    //             yAxis: 0,
                    //             tooltip: {
                    //                 pointFormat: '{point.y} mm',
                    //                 valueDecimals: 2
                    //             },
                    //             dataGrouping: {
                    //                 approximation: 'average'
                    //             },
                    //             // dataGrouping: {
                    //             //     approximation: 'sum',
                    //             //     forced: true,
                    //             //     units: [
                    //             //     ['hour', [1]]
                    //             // ]
                    //             // }
                    //         }],
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: ["viewFullscreen","downloadPDF","downloadCSV"]
                        }
                    }
                },
                // tooltip: {
                //     formatter: function () {
                //         console.log(this)
                //         let d=new Date(this.x),
                //          d1=new Date(this.x);
                //          d1.setHours(d.getHours() - 6);
                //         return this.series.name+' between ' + d1.getDate()+'/' +(d1.getMonth()+1)+'/' +d1.getFullYear()+' ' + d1.getHours()+" O'clock and "+d.getDate()+'/' +(d.getMonth()+1)+'/' +d.getFullYear()+' ' + d.getHours()+" O'clock: "+this.y.toFixed(3) +'km Fog Index: '+this.z.toFixed(3)+unit[i]
                //             //'</b> is <b>' + this.y + '</b>';
                //     }
                // },
            }
            ,
            
            (ind==0)?function(chart) {

                // apply the date pickers
                setTimeout(function() {
                    $('input.highcharts-range-selector', $(chart.container).parent())
                        .datepicker();
                }, 0);
            }:function(chart){},
            );
            
}
function getdata(name,data,unit){
    let arr=Array()
    // console.log(data)
    for(let i=0;i<data.length;i++){
    arr.push(

            {
                name: name[i],
                data: data[i],
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: '{series.name}:<b>{point.y}km </b>  Fog Index:<b>{point.z}</b>',
                    valueDecimals: 3,
                    useHTML:true,
                },
                keys:['x','y','z'],
                color:(i==1)?'green':null,
                dataGrouping:{
                    approximation: 'average'
                }
            }

        )
    }
    //console.log(arr)
    
    return arr

}
function showchart(ind,ind1) {
    let chart=getchart('0hr',['Visibility','Predicted Visibility'],['',''],[ind,ind1],0,6 * 3600 * 1000)
    chart.xAxis[0].setExtremes(ind[ind.length-24][0], ind1[ind1.length-1][0])
    charts.push(chart);
    // 
    // chart.reflow()
    // console.log(aws_charts)
    // charts.push(getchart('6hr','Fog Index after 6 hours(t+6)','',ind2,1,6 * 3600 * 1000));
    // charts.push(getchart('1day','Fog Index after 1 day','',ind3,2,24 * 3600 * 1000));
    // charts.push(getchart('3day','Fog Index after 3 days','',ind4,3,3 * 24 * 3600 * 1000));
    // charts.push(getchart('5day','Fog Index after 5 days','',ind5,4,5 * 24 * 3600 * 1000));
    
    // Highcharts.setOptions({
    //     time: {
    //         timezoneOffset: 5.5 * 60
    //     }
    // });
    
    // document.getElementById('response').style["display"] = "block";
    // document.getElementById('chart-show').style["display"] = "block";
    // document.getElementById('footr').style["display"] = "block";

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
