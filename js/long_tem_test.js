#!/usr/bin/env node

var interval='day'
var charts = []
var current = []
var israin=0
var cityid=''
var winddirectiondata=[]
// function checkCity(element,model) {
    
//     cityname = document.getElementById("myInput").value;
//     a = document.getElementById("myInput").value;
//     getPos(cityname);
//     if (a == "")
//         return;
//     cityid = 0;
//     if (a == "Lucknow") {
//         cityid = 2;
//     } else if (a == "Delhi") {
//         cityid = 1;
//     }
//     document.getElementById('cityname').innerHTML = "Location: " + a;
//     highChartFunc(cityname,model,'1 DAY');
//     chartmake(cityname);
// }
// function onModelChange(element){
//     $("#page").LoadingOverlay("show");
//     var cityname = document.getElementById("myInput").value;
//     var model = element.getAttribute("modelno");
//     highChartFunc(cityname,model);
//     // $("#page").LoadingOverlay("hide");
    
// }
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
    var d=new Date()
    var s=new Date();
    s.setDate(d.getDate()-1)
    var start=s.getFullYear()+'-'+((s.getMonth()+1)<10?'0'+(s.getMonth()+1):(s.getMonth()+1))+'-'+(s.getDate()<10?'0'+s.getDate():s.getDate())
    var end=d.getFullYear()+'-'+((d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1))+'-'+(d.getDate()<10?'0'+d.getDate():d.getDate())
    //console.log(start)
    document.getElementById("start_date").value = start;
    document.getElementById("end_date").value = end;
    //console.log(document.getElementById("start_date").value,start)
})

function sub(){
    // las.setUTCSeconds((data[dataLength-1][0]/1000)+(5.5*3600))
    let  s= document.getElementById("start_date").value
    let e=document.getElementById("end_date").value
    let date_sec=s.split('-')
    s=new Date(date_sec[0],date_sec[1]-1,date_sec[2])
    //s = new Date(s.getTime() + 24*3600000);
    s=s.toISOString().split('.')[0].replace('T',' ')
    date_sec=e.split('-')
    e=new Date(date_sec[0],date_sec[1]-1,date_sec[2])
    e = new Date(e.getTime() + 24*3600000);
    e=e.toISOString().split('.')[0].replace('T',' ')
    
    let n=new Date();
    date_sec=n.toLocaleDateString('en-CA').split(' ')[0].split('-')
    //console.log(date_sec,e)
    n=new Date(date_sec[0],date_sec[1]-1,date_sec[2])
    n = new Date(n.getTime() + 24*3600000);
    // n = new Date(n.getTime() - 5.5*3600000);
    n=n.toISOString().split('.')[0].replace('T',' ')
    //console.log(s,",",e,",",n)
    if(s>e){
        alert("Start date should be smaller than end date")
        return
    }
    if(s>n ){
        alert("Please do not enter future period")
        return 
    }
    if(e>n){
        e=n
    }
    //console.log(e)
    highChartFunc(4,'1 DAY',create=0,s,e);

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
            
            if(!checkar(cityname)){
                alert('Please Enter valid city name')
                return
            }
            cityid=cityname
            
            a = document.getElementById("myInput").value;
            getPos();
            if (a == ""){
                $("#page").LoadingOverlay("hide");
                return;
            }
            document.getElementById('cityname').innerHTML = "Location: " + a;
 
            highChartFunc(mod[0],'1 DAY',create=1);
 
            chartmake(arra);
        }
    })
    $("#page").LoadingOverlay("hide");
}
function formatDate(val) {
    var utcSeconds = val/1000 +(5.5*3600) //+ 19800;
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds)

    return d.toLocaleString("en-GB", {day:'2-digit', month:'2-digit', year:'numeric' ,hour: '2-digit', minute:'2-digit'})
}



function getdata(name,unit,ind){
    var all=[]
    for(var i=0;i<name.length;i++){
        //console.log(name,ind)
        all.push({
            name: name[i],
            // data: [0,0],
            type: (ind==4 || ind==0)?'column':'spline',
            tooltip: {
                pointFormat:(ind==3)?'<b>{point.y}</b> '+unit[i]+' ( {point.z} °N )' :'<b>{point.y}</b> '+unit[i],
                valueDecimals: 2
            },

            yAxis: 0,
            dataGrouping:(ind==4)?{
                approximation: 'sum',
                forced: true,
                units: [
                    ['minute', [30]]
                ]
            }: {
                approximation: 'average'
            },
            keys:(ind==3)?['x', 'y', 'z']:['x', 'y'],
            color:(i==1)?'green':'#4572A7',
        })
    }
    return all
}
function highChartFunc(model,interval,create=0,start=-1,end=-1) {
    
    // if(cityid=="IIT Kanpur"){
    //     document.getElementById('Rainfall-section').style["display"] = "none";
    //     document.getElementById('Temperature-section').style["display"] = "none";
    //     document.getElementById('Humidity-section').style["display"] = "none";
    //     document.getElementById('Wind-section').style["display"] = "none";
    //     iitdata(cityid,model,interval,start,end)
        
    //     return
    // }
    document.getElementById('mapFog-section').style["display"] = "block";
    
    if(create==0){
        for(let i=0;i<charts.length;i++){
            charts[i].showLoading()
        }
    }
    //console.log(start,end)
    //Highcharts.getJSON('apis/database.php?station=' + cityid, function(alldata) {
        $.ajax({url: "apis/"+((cityid!="IIT Kanpur")?"database1.php?":"sensordata3.php?select=4&")+( (start==-1 || end==-1)?"station=" + cityid+"&interval="+interval:"station=" + cityid+"&start_date="+start+"&end_date="+end), async: true,
        success: function(alldata){
           // console.log(alldata)
        winddirectiondata = []
        let fogdata = [],
            temperaturedata = [],
            humiditydata = [],
            winddata = [],
            
            fogdata2 = [],
            // fogdata3=[],
            rainfall=[];
        let epoch=0,epoch1=0
        let list=alldata.split(';')
        if(list[0].substr(0,5)=='Array')
            list[0]=list[0].substr(5)
        if(list[1].substr(0,5)=='Array')
            list[1]=list[1].substr(5)
        current=[]
        if(cityid=='IIT Kanpur'){
            
           
            var data=JSON.parse(list[0]),data1=JSON.parse(list[1]);
            //console.log(data1)
            var dataLength=data.length,dataLength2=data1.length
            
            if(dataLength<=0 && dataLength2<=0){
                for(let i=0;i<charts.length;i++){
                    charts[i].hideLoading()
                }
                alert('Something went wrong. Please try again')
                return

            }
            
            if(dataLength>0 ){

            
                
                for (let i=0; i < data.length; i += 1) {
                    
                    fogdata.push([
                        (data[i][0]+data[i][1]*1800 - 11*3600)*1000,
                        data[i][2]  // data[i][1]==null?data[i-1][1]:data[i][1]
                    ]);
                }
                current.push(fogdata[dataLength - 1][1].toFixed(2));
            }
            else{
                current.push('-')
            }
            if(dataLength2>0 ){
                // console.log(data1)
                for (let i=0; i < dataLength2; i += 1) {
                    epoch=(data1[i][0]+data1[i][1]*1800 - 5.5*3600)*1000 ,
                    temperaturedata.push([
                        epoch,
                        (parseFloat(data1[i][2]) + parseFloat(data1[i][3])) / 2
                    ]);
                    rainfall.push([
                        epoch,
                        data1[i][4] // data[i][1]==null?data[i-1][1]:data[i][1]
                    ]);
                    humiditydata.push([
                        epoch,
                        (parseFloat(data1[i][5]) + parseFloat(data1[i][6])) / 2
                    ]);
                    winddata.push([
                        epoch,
                        data1[i][7]*3.6,
                        data1[i][8]
                    ]);
                    winddirectiondata.push([
                        epoch,
                        data1[i][8]
                    ]);
                }
                
                current.push(temperaturedata[temperaturedata.length - 1][1].toFixed(0))
                current.push(humiditydata[humiditydata.length - 1][1].toFixed(0))
                current.push(winddata[winddata.length - 1][1].toFixed(2))
                current.push(winddata[winddata.length - 1][2])
                current.push(rainfall[rainfall.length - 1][1].toFixed(2))
            }
            else{
                current.push('-')
                current.push('-')
                current.push('-')
                current.push('-')
                current.push('-')
                
                
            }
        
        
        current.push(epoch)
        
        
        //<div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + "km/h</div><div>Wind direction: " + current[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[5]+"deg)'></i></span></div><div>Rainfall: " + current[6] + "mm    </div></div>   ";
       
        }
        else{
            
        // if(list[0].substring(0,5))
        //     var data=JSON.parse(list[0].substring(5))
        // else
        var data=JSON.parse(list[0])
        let data2=JSON.parse(list[1])
        
       var dataLength2=data2.length,
            dataLength = data.length;
            if(dataLength<=0 && dataLength2<=0){
                for(let i=0;i<charts.length;i++){
                    charts[i].hideLoading()
                }
                alert('Something went wrong. Please try again')
                return

            }
        
        
       
        if(dataLength>0){
            for (let i=0; i < dataLength; i += 1) {
                
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
            
            // console.log(fogdata)
            current.push(fogdata[dataLength - 1][1].toFixed(2));
            current.push(temperaturedata[dataLength - 1][1].toFixed(0))
            current.push(humiditydata[dataLength - 1][1].toFixed(2))
            current.push(winddata[dataLength - 1][1].toFixed(2))
            current.push(winddata[dataLength - 1][2])
            //
        }
        else{
            current.push('-')
            current.push('-')
            current.push('-')
            current.push('-')
            current.push('-')
            current.push('-')
        }
        
        if(dataLength2>0){
            for (let i=0; i < dataLength2; i += 1) {
                epoch1=data2[i][0]  
                rainfall.push([
                    epoch1,
                    data2[i][1] // data[i][1]==null?data[i-1][1]:data[i][1]
                ]);
            }
            current.push(rainfall[dataLength2-1][1].toFixed(2))

            // document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at: '+formatDate(fogdata[dataLength - 1][0])+'</div><div style="color:red">Visibility: ' + fogdata[dataLength - 1][1].toFixed(2) + " km   </div><div>Temperature: " + temperaturedata[dataLength - 1][1].toFixed(0) + "°C    </div><div>Relative Humidity: " + humiditydata[dataLength - 1][1].toFixed(2) + "%    </div><div>Wind: " + winddata[dataLength - 1][1].toFixed(2) + "km/h</div><div>Wind direction: " + winddata[dataLength - 1][2] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+winddata[dataLength - 1][2]+"deg)'></i></span></div><div>Rainfall: " + rainfall[dataLength2 - 1][1] + "mm    </div></div>   ";
        }
        else{
            current.push('-')
        }
        current.push(epoch)
        // document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at: '+formatDate(fogdata[dataLength - 1][0])+'</div><div style="color:red">Visibility: ' + fogdata[dataLength - 1][1].toFixed(2) + " km   </div><div>Temperature: " + temperaturedata[dataLength - 1][1].toFixed(0) + "°C    </div><div>Relative Humidity: " + humiditydata[dataLength - 1][1].toFixed(2) + "%    </div><div>Wind: " + winddata[dataLength - 1][1].toFixed(2) + "km/h</div><div>Wind direction: " + winddata[dataLength - 1][2] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+winddata[dataLength - 1][2]+"deg)'></i></span></div></div>   ";
       
        }
        
        
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        var las=new Date(0)
        //console.log(fogdata[dataLength-1][0]/1000 )
        //  console.log(epoch)
        d.setUTCSeconds(epoch/1000 );

        las.setUTCSeconds((epoch/1000)+(5.5*3600))
        
        las=las.toISOString().replace('T',' ').split('.')[0]
        
        // las.setUTCSeconds(las/1000)
        // d.toUTCString()
        let n=new Date();
        n = new Date(n.getTime() - 5.5*3600000);
        n=n.getFullYear()+'-'+((n.getMonth()+1)<10?'0'+(n.getMonth()+1):(n.getMonth()+1))+'-'+n.getDate()+' '+n.getHours()+':'+n.getMinutes()
        //if(cityid!='IIT Kanpur'){
            console.log('inn',interval)
           $.ajax({
            //crossDomain: true,
            //dataType: 'jsonp',
            // url: "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-03-22/" + formatDate() + "/862549045430298/DeviceDate",
            
            url:(start==-1 || end==-1)? "apis/fog_index.php?interval="+interval+"&station="+cityid:"apis/fog_index.php?start_date="+start+"&end_date="+end+"&station="+cityid,
            async: false,
            success: function(result) {
                console.log(result.toString())
                var data = JSON.parse(result.toString())
                fogdata=data[0]
                fogdata2=data[1]
                if(fogdata.length>1)
                current[0]=fogdata[fogdata.length - 1][1].toFixed(2)
                // console.log(data)
                // var myDate = new Date((parseInt(data[0]))*1000);
                // var myEpoch = (myDate.getTime())
                // for(let i=2;i<data.length;i++){
                //     ind.push([
                //         myEpoch+ (i-2)*6*3600000,parseFloat(data[i])
                //     ])
                // }
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
    document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at: '+formatDate(epoch)+'</div>'
        let sidebar= Array(['Visibility',current[0],'km'],['Temperature',current[1],'°C'],['Relative Humidity',current[2],'%'],['Wind',current[3],'km/h'],['Wind direction',current[4],"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span>"],['Rainfall',current[5],'mm'])
        sidebar.forEach(element => {
            if(element[0]!='-'){
            document.getElementById("data-detail").innerHTML+='<div style="color:red;">'+element[0]+': '+element[1]  +element[2]+'   </div>'
            }
        });
        // $.ajax({url: "apis/newpred.php?stime="+d.toUTCString()+"&station="+cityid+"&model="+6, async: true,success: function(data){
        //     var data = JSON.parse(data)
        //     datalen = data.length
        //     for (i = 0 ; i < datalen; i += 1) {
        //             fogdata3.push([
        //                 data[i][0],
        //                 data[i][1]
        //             ]);
        //         }
        // }});

            // if(fogdata2.length>0 && fogdata2[0][0]!=fogdata[fogdata.length-1][0])
            //     fogdata2.unshift(fogdata[fogdata.length-1])
            // else if(fogdata2.length>0)
            //     fogdata2[0]=fogdata[fogdata.length-1]
        
        // console.log(fogdata[fogdata.length-1][0],fogdata2[0])
    //} 
        // if(fogdata3.length>0 && fogdata3[0][0]!=fogdata[fogdata.length-1][0])
        //     fogdata3.unshift(fogdata[fogdata.length-1])
        // else if(fogdata3.length>0)
        //     fogdata3[0]=fogdata[fogdata.length-1]
        
        
        // if(israin!=0){
        //     document.getElementById('Rainfall-section').style["display"] = "block";
        //     // current.push(rainfall[dataLength2-1][1])
            
        // }
        // else{
        //     // current.push('-')
        //     document.getElementById('Rainfall-section').style["display"] = "none";
        //     rainfall.push([0,'-'])
        //     dataLength2=rainfall.length
        // }
        
        while(charts.length<4){
        } 
        // console.log(fogdata2,create)
        let data_ctr=0
        let data_arr=Array([fogdata,'Visibility-section'],[temperaturedata,'Temperature-section'],[humiditydata,'Humidity-section'],[winddata,'Wind-section'],[rainfall,'Rainfall-section'])
        data_arr.forEach(element => {
            // console.log(element[0])
            if(element[0].length>0){
                updatedata(element[0],data_ctr, 0,create)
                if(element[1]!='')
                    document.getElementById(element[1]).style["display"] = "block";
            }
            else{
                if(element[1]!='')
                    document.getElementById(element[1]).style["display"] = "none";
                
            }
            if(data_ctr==1 && fogdata.length>0){
                charts[0].xAxis[0].update({
                    plotLines: [{
                        color: 'rgb(255,170,20)', // Red
                        width: 2,
                        value: fogdata[fogdata.length - 1][0],
                        zIndex:1
                    }],
                })
            }
            data_ctr+=1

            
        });
        updatedata(fogdata2, 0, 1, create)
        if(fogdata.length>20)
        charts[0].xAxis[0].setExtremes(fogdata[fogdata.length-20][0], fogdata2[fogdata2.length-1][0])
        if(fogdata2.length>0 && fogdata.length>0){
            
            
                charts[0].xAxis[0].update({
                    plotLines: [{
                        color: 'rgb(255,170,20)', // Red
                        width: 2,
                        value: fogdata[fogdata.length - 1][0],
                        zIndex:1
                    }],
                })
            
            
        }
        
        
        
        // if(end==n)
        // updatedata(fogdata,0,0,create)
        // updatedata(fogdata2,0,1,create)
        // updatedata(temperaturedata,1,0,create)
        // updatedata(humiditydata,2,0,create)
        // updatedata(winddata,3,0,create)
        // if(end==n || end==-1){
        //     charts[0].xAxis[0].update({
        //         plotLines: [{
        //             color: 'rgb(255,170,20)', // Red
        //             width: 2,
        //             value: fogdata[fogdata.length - 1][0],
        //             zIndex:1
        //         }],
        //     })
        // }
        // if(israin==1){
        //     while(charts.length<5){}
        //     updatedata(rainfall,4,0,create)
        // }
        for(let i=0;i<charts.length;i++){
            charts[i].hideLoading()
        }
        var renderTime = Date.now() - window.performance.timing.navigationStart;
        console.log('Render time : ' + renderTime + ' milliseconds');
        

    document.getElementById('other-section').style["display"] = "none";
    }   
    });
    if(create==1)
        fogFunction(model)
    Highcharts.setOptions({
        time: {
            timezoneOffset: -11 * 60
        }
    });
    
    
}

function updatedata(data,ch,se,create){
    //console.log(data,charts[ch],se,create)
    
    if(create==1){
        charts[ch].series[se].setData(
            // pointStart: newSeries[0].pointStart,
            data,
            true
        );
    }
    else{
        
        charts[ch].series[se].update({
                // pointStart: newSeries[0].pointStart,
                data: data
            }, true,true);
    }
}

function fogFunction(model) {
    // var charts = []
    var mod=[model]
    // var israin=0
    // if(rainfall.length>20){
    //     israin=1
    // }
    charts=[]
    charts.push(
        getchart(["Visibility","Visibility_Prediction"],["km","km"],0,mod));
    
    charts.push(
        getchart(["Temperature"],["°C"],1,mod));
    charts.push(
        getchart(["Humidity"],["%"],2,mod));
    charts.push(
        getchart(["Wind"],["km/h"],3,mod));
    // if(israin==1)
        charts.push(
            getchart(["Rainfall"],["mm"],4,mod));
            for(let i=0;i<charts.length;i++){
                charts[i].showLoading()
            }
            //getchart
    
           
    // document.getElementById('mapFog-section').style["display"] = "block";
    // document.getElementById('Temperature-section').style["display"] = "block";
    // document.getElementById('Humidity-section').style["display"] = "block";
    // document.getElementById('Wind-section').style["display"] = "block";
    $("#page").LoadingOverlay("hide");
}
$('#myInput').on('keyup', autocomplete(document.getElementById("myInput")));
function getchart(name,unit,ind,mod){
    
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
                        
                        
                        highChartFunc(mod[0],'1 DAY');
                     
                       
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
                        
                        highChartFunc(mod[0],'7 DAY');
                    
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
                    
                        highChartFunc(mod[0],'1 MONTH');
                       
                        
                       
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
                        
                        highChartFunc(mod[0],'1 YEAR');
                        
                       
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
                        highChartFunc(mod[0],"10 YEAR");
                        
                       
                    }
                },
                
            }
        ],
    
            // inputEnabled: true,
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
            text: name[0]+ " ("+unit[0]+")",
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
                                            let f=0
                                            for(let i=0;i<winddirectiondata.length;i++){
                                                if(winddirectiondata[i][0]==this.x){
                                                    store.push(winddirectiondata[i][1])
                                                    f=1
                                                    break
                                                }
                                            }
                                            if (f==0)
                                                store.push(0);
                                            
                                        }
                                    }
                                    else{
                                        var p=0
                                        var xs=this.x
                                        
                                        if(charts[i].series[0].points==undefined){
                                            // p.push()
                                            store.push(0)
                                            if(i==3)
                                                store.push(0)
                                        }else{
                                        var xr=charts[i].series[0].points
                                        var f=0
                                           
                                        for(var j=0;j<xr.length;j++){
                                              
                                            if(xr[j].x==xs ){ //||(xr[j+1].x>=xs && xr[j-1].x<=xs)
                                                p=j
                                                f=1
                                                break
                                            }

                                        }
                                        if(f==0)
                                            p=0
                                        if(xr.length>0){
                                            charts[i].tooltip.refresh([xr[p]])
                                            store.push(xr[p].y)
                                            if (i == 3){
                                                if (winddirectiondata[p][1] == null)
                                                    store.push(0);
                                                else
                                                    store.push(winddirectiondata[p][1] )
                                            }
                                        }
                                        else{
                                            store.push(0);
                                        }
                                        }
                                        
                                        
                                    }
                                    
                                    
                                    
                                }
                                document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at: '+formatDate(this.x)+'</div>'
                                let sidebar= Array(['Visibility',store[0].toFixed(2),'km'],['Temperature',store[1].toFixed(0),'°C'],['Relative Humidity',store[2].toFixed(0),'%'],['Wind',store[3].toFixed(2),'km/h'],['Wind direction',store[4].toFixed(0),"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4].toFixed(0)+"deg)'></i></span>"],['Rainfall',store[5].toFixed(2),'mm'])
                                sidebar.forEach(element => {
                                    if(element[0]!='-'){
                                    document.getElementById("data-detail").innerHTML+='<div style="color:red;">'+element[0]+': '+element[1]  +element[2]+'   </div>'
                                    }
                                });
                                // if(israin==1)
                                // document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at '+formatDate(this.x )+'</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(0) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + " km/h</div><div>Wind direction: " + store[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4]+"deg)'></i></span> </div> <div>Rainfall: " + store[5] + "mm    </div></div>   ";
                                // else
                                // document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at '+formatDate(this.x )+'</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(0) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + " km/h</div><div>Wind direction: " + store[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4]+"deg)'></i></span> </div> </div>   ";

                            } else if(ind==0) {
                                document.getElementById("data-detail").innerHTML = '<div style="font-size:21px;"><div style="color:green">Predicted Visibility: ' + this.y.toFixed(2) + " km</div><div>";

                            }
                        
                            // console.clear()
                            $(".highcharts-markers path").attr('visibility', 'visible')
                        },
                        mouseOut: function(e) {
                            console.log(current[5],current)
                            for (var i = 1; i < charts.length; i++) {
                                // charts[i].series[0].markerGroup.visibility="none"
                                // charts[i].xAxis[0].removePlotLine('xPlotLine');
                                charts[i].tooltip.hide();
                            }
                            document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at: '+formatDate(current[6])+'</div>'
                                let sidebar= Array(['Visibility',current[0],'km'],['Temperature',current[1],'°C'],['Relative Humidity',current[2],'%'],['Wind',current[3],'km/h'],['Wind direction',current[4],"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span>"],['Rainfall',current[5],'mm'])
                                sidebar.forEach(element => {
                                    if(element[0]!='-'){
                                    document.getElementById("data-detail").innerHTML+='<div style="color:red;">'+element[0]+': '+element[1]  +element[2]+'   </div>'
                                    }
                                });
                            // if(israin==1)
                            // document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at '+formatDate(current[6])+'</div><div style="color:red">Visibility: ' + current[0] + " km   </div><div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + " km/h</div><div>Wind direction: " + current[4] +"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span> </div><div>Rainfall: " + current[6] + "mm   </div></div>   ";
                            // else
                            // document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at '+formatDate(current[6])+'</div><div style="color:red">Visibility: ' + current[0] + " km   </div><div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + " km/h</div><div>Wind direction: " + current[4] +"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span> </div></div>   ";
                            $(".highcharts-markers path").attr('visibility', 'hidden')
                        }
                    }
                }
            }
        },
        yAxis: [{
            min: (ind==0)?0:null,
             //max: (ind==0)?5:null,
            gridLineWidth: 1,
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
        //     plotBands:(ind==0)?[
        //     {
        //         from:1,
        //         to:0,
        //         color:'rgb(255, 248, 238)'
        //     }
        // ]:[],
        // gridLineColor: '#ed7d31',
        // lineColor: '#F3F5F6',
        // minorGridLineColor: '#ed7d31',
        // tickColor: '#F3F5F6',
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
                // value: data[0][data[0].length - 1][0],
                zIndex:1
            }]:[],
            crosshair: true
        },

        series: getdata(name,unit,ind),
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
                }
            }
        },
        tooltip:(ind==0)? {
            formatter: function () {
                let d=new Date(this.x),
                 d1=new Date(this.x);
                 d1.setHours(d.getHours() - 6);
                return this.series.name+' between ' + d1.getDate()+'/' +(d1.getMonth()+1)+'/' +d1.getFullYear()+' ' + d1.getHours()+" O'clock and "+d.getDate()+'/' +(d.getMonth()+1)+'/' +d.getFullYear()+' ' + d.getHours()+" O'clock: "+'</b> is <b>' + this.y + '</b>'
                    //'</b> is <b>' + this.y + '</b>';
            }
        }:{},
    },
    (ind==0)?function(chart) {

        // apply the date pickers
        setTimeout(function() {
            $('input.highcharts-range-selector', $(chart.container).parent())
                .datepicker();
        }, 0);
    }: function(chart){});
}


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

function chartmake(arra) {
    var position = document.getElementById("latlong").value;
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
        if(arra[i][0]==cityid)
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
    jsonObj.dataProvider.images[j].label = cityid;
    jsonObj.dataProvider.images[j].color="rgba(255,255,255,1)";
    var chart = AmCharts.makeChart('map1', jsonObj);
    chart.addListener("clickMapObject",function(ev){
        
            if(ev.mapObject.cname=="MapImage")
            {
                // $("#page").LoadingOverlay("show");
                document.getElementById('myInput').value = ev.mapObject.title;
                cityid=ev.mapObject.title
                document.getElementById('cityname').innerHTML = "Location: " + ev.mapObject.title;
                interval='1 DAY'
                chart.dataProvider.images[j].label="";
                chart.dataProvider.images[j].color="rgba(75,216,181,0.8)"
                chart.dataProvider.images[ev.mapObject.index].label=ev.mapObject.title;
                
                chart.dataProvider.images[ev.mapObject.index].labelFontSize=15;
                chart.dataProvider.images[ev.mapObject.index].labelColor="rgba(255,255,255,1)";
                chart.dataProvider.images[ev.mapObject.index].color="rgba(255,255,255,1)";
                j=ev.mapObject.index
                chart.validateData();
                highChartFunc(4,'1 DAY')
            }
            else{
                console.log("not image point")
                return;
            }
            

    })
}
function getPos() {
    $.ajax({url: "apis/position.php?cityid="+cityid, async: false,success: function(data){
        var data = JSON.parse(data)
        datalen = data.length
        document.getElementById("latlong").value = data;
      }
    });  // iitdata
}

$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});

function iitdata(cityid,model,interval,start,end){
    var fogdata=Array(),fogdata2=Array();
    var d=new Date(0)
    
        $.ajax({url: (start==-1||end==-1)?"apis/sensordata3.php?interval="+interval+"&select=0":"apis/sensordata3.php?start_date="+start+"&end_date="+end+"&select=0", async: true,

            success: function(data){
                var data = JSON.parse(data)
                datalen = data.length
                for (i = 0 ; i < datalen; i += 1) {
                    var myEpoch = (data[i][0]+(data[i][1]*1800))*1000// + 5.5 * 36 * 100000
                    fogdata.push([ myEpoch, data[i][2]])
                        // fogdata.push([
                        //     (data[i][0]+1800*data[i][1])*1000 - 39600000, //-2* 5.5 * 36 * 100000,
                        //     data[i][2]
                        // ]);
                        
                    

                }
                d.setUTCSeconds(fogdata[fogdata.length-1][0]/1000);
            }
            
        });
    
    // d.setUTCSeconds(data[dataLength-1][0]/1000);
    console.log(d,cityid,model)
    $.ajax({url: "apis/newpred.php?stime="+d.toUTCString()+"&station="+cityid+"&model="+model+"&status=1", async: false,success: function(data){
        console.log(data)
        var data = JSON.parse(data)
        datalen = data.length
        for (i = 0 ; i < datalen; i += 1) {
                fogdata2.push([
                    data[i][0],
                    data[i][1]
                ]);
      }
    }});
    // $.ajax({url: "apis/newpred.php?stime="+d.toUTCString()+"&station="+cityid+"&model="+6, async: false,success: function(data){
    //     var data = JSON.parse(data)
    //     datalen = data.length
    //     for (i = 0 ; i < datalen; i += 1) {
    //             fogdata3.push([
    //                 data[i][0],
    //                 data[i][1]
    //             ]);
    //         }
    // }});
    if(fogdata2.length>0 && fogdata2[0][0]!=fogdata[fogdata.length-1][0])
        fogdata2.unshift(fogdata[fogdata.length-1])
    else if(fogdata2.length>0)
        fogdata2[0]=fogdata[fogdata.length-1]
    // if(fogdata3.length>0 && fogdata3[0][0]!=fogdata[fogdata.length-1][0])
    //     fogdata3.unshift(fogdata[fogdata.length-1])
    // else if(fogdata3.length>0)
    //     fogdata3[0]=fogdata[fogdata.length-1]
    charts[0].series[0].update({
        // pointStart: newSeries[0].pointStart,
        data: fogdata
    }, true,true);
    charts[0].series[1].update({
        // pointStart: newSeries[0].pointStart,
        data: fogdata2
    }, true,true);
    charts[0].xAxis[0].update({
        plotLines: [{
            color: 'rgb(255,170,20)', // yellow
            width: 2,
            value: fogdata[fogdata.length - 1][0],
            zIndex:1
        }],
    })
    // charts.push(
    //     Highcharts.stockChart('Visibility', {
    //             chart: {
    //                 height: 350,
    //                 panning: true
    //             },
    //             responsive: {
    //                 rules: [{
    //                     condition: {
    //                         maxWidth: 500
    //                     },
    //                     chartOptions: {
    //                         chart: {
    //                             height: 300
    //                         },
    //                         subtitle: {
    //                             text: null
    //                         },
    //                         navigator: {
    //                             enabled: false
    //                         }
    //                     }
    //                 }]
    //             },
    //             navigator: {
    //                 enabled: true,
    //                 height:30
    //             },
    //             scrollbar: {
    //                 barBackgroundColor: 'gray',
    //                 barBorderRadius: 7,
    //                 barBorderWidth: 0,
    //                 buttonBackgroundColor: 'gray',
    //                 buttonBorderWidth: 0,
    //                 buttonBorderRadius: 7,
    //                 trackBackgroundColor: 'none',
    //                 trackBorderWidth: 1,
    //                 trackBorderRadius: 8,
    //                 trackBorderColor: '#CCC',
    //                 enabled: false
    //             },
    //             rangeSelector: {
    //                 buttons: [{
    //                         type: 'day',
    //                         count: 1,
    //                         text: '1d'
    //                     }, {
    //                         type: 'week',
    //                         count: 1,
    //                         text: '1w'
    //                     },
    //                     {
    //                         type: 'month',
    //                         count: 1,
    //                         text: '1m'
    //                     }, {
    //                         type: 'year',
    //                         count: 1,
    //                         text: '1y'
    //                     }, {
    //                         type: 'all',
    //                         text: 'All'
    //                     }
    //                 ],
    //                 inputEnabled: true,
    //                 selected: 0,


    //             },
    //             title: {
    //                 text: 'Visibility (km)',
    //                 align: 'left',
    //                 style: {
    //                     fontSize: "20px",
    //                     color: "red"
    //                 }
    //             },
    //             legend: {
    //                 enabled: true,
    //                 itemStyle:{
    //                     fontSize:"15px"
    //                 }
    //             },
    //             plotOptions: {
    //                 series: {
    //                     point: {
    //                         events: {
    //                             // mouseOver: function(e) {
    //                             //     k = charts[0].series[charts[0].hoverSeries._i].points[0].index;
					
    //                             //     if (charts[0].hoverSeries._i == 0) {
    //                             //         var store = [],time=0;
    //                             //         store.push(this.y)
    //                             //         for (var i = 1; i < charts.length; i++) {
    //                             //             // charts[i].series[0].points[this.index - k].setState('hover');
    //                             //             charts[i].tooltip.refresh([charts[i].series[0].points[this.index - k]])
    //                             //             store.push(charts[i].series[0].points[this.index - k].y)
    //                             //             if (i == 3)
    //                             //                 if (charts[i].series[0].points[this.index - k].z == null)
    //                             //                     store.push(0);
    //                             //                 else
    //                             //                     store.push(charts[i].series[0].points[this.index - k].z)
    //                             //             charts[i].xAxis[0].addPlotLine({
    //                             //                 id: 'xPlotLine',
    //                             //                 value: this.x,
    //                             //                 width: 1,
    //                             //                 color: '#C0C0C0'
    //                             //             });
                
    //                             //         }
    //                             //         document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(this.x)+'</div><div style="color:red">Visibility: ' + store[0].toFixed(2) + " km   </div><div>Temperature: " + store[1].toFixed(0) + "°C    </div><div>Relative Humidity: " + store[2].toFixed(2) + "%    </div><div>Wind: " + store[3].toFixed(2) + " km/h</div><div>Wind direction: " + store[4] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+store[4]+"deg)'></i></span> </div></div>   ";
    //                             //     } else if (charts[0].hoverSeries._i == 1) {
    //                             //         document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div style="color:green">Predicted Visibility: ' + charts[0].series[1].points[this.index - k].y.toFixed(2) + " km</div><div>";

    //                             //     }
    //                             //     $(".highcharts-markers path").attr('visibility', 'visible')
    //                             // },
    //                             // mouseOut: function(e) {
    //                             //     k = charts[0].series[0].points[0].index;
    //                             //     for (var i = 1; i < charts.length; i++) {
    //                             //         charts[i].series[0].markerGroup.visibility="none"
    //                             //         charts[i].xAxis[0].removePlotLine('xPlotLine');
    //                             //         charts[i].tooltip.hide();
    //                             //     }
    //                             //     //document.getElementById("data-detail").innerHTML = '<div style="font-size:26px;"><div>Observations at '+formatDate(current[5])+'</div><div style="color:red">Visibility: ' + current[0] + " km   </div><div>Temperature: " + current[1] + "°C    </div><div>Relative Humidity: " + current[2] + "%    </div><div>Wind: " + current[3] + " km/h</div><div>Wind direction: " + current[4] +"° <span ><i class='fa fa-arrow-down' style='transform:rotate("+current[4]+"deg)'></i></span> </div></div>   ";
    //                             //     $(".highcharts-markers path").attr('visibility', 'hidden')
    //                             // }
    //                         }
    //                     }
    //                 }
    //             },
    //             yAxis: [{
    //                 min: 0,
    //                 // max: 6,
    //                 gridLineWidth: 0,
    //                 labels: {
    //                     align: 'right',
    //                     x: -5
    //                 },
    //                 top: '0%',
    //                 height: '100%',
    //                 offset: 10,
    //                 lineWidth: 0,
    //                 opposite: false,
    //                 resize: {
    //                     enabled: true
    //                 },
    //                 plotBands:[
    //                 {
    //                     from:1,
    //                     to:0,
    //                     color:'rgb(255, 248, 238)'
    //                 }
    //             ],
    //             plotLines: [{
    //                 value: 1,
    //                 width: 2,
    //                 color: 'red',
    //                 label: {
    //                     text: '<div data-toggle="modal" class="line_allowable btn_toggle" href="#modal-form1"><span>Fog</span></div>',
    //                     useHTML: true,
    //                     style: {
    //                         color: 'rgb(255, 172, 102)',
    //                     },
    //                     align: 'left',
    //                     x: -25,
    //                     y: 12,
    //                     events: {
    //                         redraw: function() {
    //                             alert('The chart is being redrawn');
    //                         }
    //                     }
    //                 },
    //             }]

    //             }],

    //             xAxis: {
    //                 plotLines: [{
    //                     color: 'rgb(255,170,20)', // Red
    //                     width: 2,
    //                     value: fogdata[fogdata.length - 1][0],
    //                     zIndex:1
    //                 }],
    //                 events: {
                        
    //                     afterSetExtremes: function(e) {
    //                         var d=new Date(e.max)
    //                         charts.forEach(function(chart, i) {
    //                             if (i !== 0) {
    //                                 chart.xAxis[0].setExtremes(e.min, e.max)
    //                             }
    //                         })
    //                     }

    //                 },
    //                 crosshair: true
    //             },

    //             series: [{
    //                     name: 'Fog',
    //                     data: fogdata,
    //                     type: 'spline',
    //                     tooltip: {
    //                         pointFormat: '{point.y}',
    //                         valueDecimals: 2
    //                     },
    //                     yAxis: 0,
    //                     dataGrouping: {
    //                         approximation: 'average'
    //                     }

    //                 },
    //                 {
    //                     name: 'Fog prediction',
    //                     data: fogdata2,
    //                     type: 'spline',
    //                     tooltip: {

    //                         pointFormat: '{point.y}',
    //                         valueDecimals: 2
    //                     },
    //                     yAxis: 0,
    //                     color: 'green',
    //                     dataGrouping: {
    //                         approximation: 'average'
    //                     }

    //                 }
    //                 ,
    //                 // {
    //                 //     name: 'Fog prediction rolling_mean',
    //                 //     data: fogdata3,
    //                 //     type: 'spline',
    //                 //     tooltip: {

    //                 //         pointFormat: '{point.y}',
    //                 //         valueDecimals: 2
    //                 //     },
    //                 //     yAxis: 0,
    //                 //     dataGrouping: {
    //                 //         approximation: 'average'
    //                 //     }

    //                 // }
    //             ],
    //             exporting: {
    //                 buttons: {
    //                     contextButton: {
    //                         menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"]
    //                     }
    //                 }
    //             }
    //         },
    //         function(chart) {

    //             // apply the date pickers
    //             setTimeout(function() {
    //                 $('input.highcharts-range-selector', $(chart.container).parent())
    //                     .datepicker();
    //             }, 0);
    //         }));
    //         $("#Temperature").empty();
    //         $("#Humidity").empty();
    //         $("#Wind").empty();
    //         $("#page").LoadingOverlay("hide");
}
//2300 before
//1218 after
 