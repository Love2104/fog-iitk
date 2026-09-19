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
            autocomplete(document.getElementById("myInput"));
            
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
            console.log(result)
            arr = [];
            arra = [];
            data = JSON.parse(result);
            var datalen = data.length;
            for (i = 0; i < datalen; i += 1) {
                arra.push([data[i][0], data[i][1], data[i][2]]);
                arr.push(data[i][0]);
            }
            
            cityname = document.getElementById("myInput").value;
            
            if(!checkar(cityname)){
                console.warn("Invalid city name detected. Falling back to 'Delhi IGI Airport'.");
                cityname = 'Delhi IGI Airport';
                if (document.getElementById("myInput")) {
                    document.getElementById("myInput").value = 'Delhi IGI Airport';
                }
            }
            cityid = cityname;
            
            a = document.getElementById("myInput").value;
            getPos();
            if (a == ""){
                $("#page").LoadingOverlay("hide");
                return;
            }
            var cityEl = document.getElementById('cityname');
            var panelEl = document.getElementById('panel-station-name');
            if (cityEl) {
                cityEl.innerHTML = a;
            }
            if (panelEl) {
                panelEl.innerHTML = a;
            }
 
            highChartFunc(mod[0],'1 DAY',create=1);
 
            chartmake(arra);
        }
    })
    $("#page").LoadingOverlay("hide");
}
function formatDate(val) {
    var utcSeconds = val/1000 -(5.5*3600) //+ 19800;
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds)

    return d.toString("en-GB", {day:'2-digit', month:'2-digit', year:'numeric' ,hour: '2-digit', minute:'2-digit'}).split("GMT")[0] + " IST"
}



function getdata(name,unit,ind){
    var all=[]
    for(var i=0;i<name.length;i++){
        let seriesColor = (i==1) ? '#f59e0b' : '#3b82f6'; // Amber for forecast, Blue for observed
        if(ind == 4) seriesColor = '#8b5cf6'; // Purple for rainfall
        
        all.push({
            name: name[i],
            type: (ind==4)?'column':'spline',
            tooltip: {
                pointFormat:(ind==3)?'<b>{point.y}</b> '+unit[i]+' ( {point.z} °N )' :'<b>{point.y}</b> '+unit[i],
                valueDecimals: 2
            },
            yAxis: 0,
            dataGrouping:(ind==4)?{
                approximation: 'max',
                forced: true,
                units: [
                    ['minute', [30]]
                ]
            }: {
                approximation: 'average'
            },
            keys:(ind==3)?['x', 'y', 'z']:['x', 'y'],
            color: seriesColor,
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
    let mapFogSection = document.getElementById('mapFog-section');
    if(mapFogSection) mapFogSection.style["display"] = "block";
    
    if(create==0){
        for(let i=0;i<charts.length;i++){
            // charts[i].showLoading()
        }
    }
    let last_epoch = Date.now()
    //console.log(start,end)
    //Highcharts.getJSON('apis/database.php?station=' + cityid, function(alldata) {
        $.ajax({url: "apis/"+((cityid!="IIT Kanpur")?"database1.php?":"sensordata3.php?select=4&")+( (start==-1 || end==-1)?"station=" + cityid+"&interval="+interval:"station=" + cityid+"&start_date="+start+"&end_date="+end), async: true,
        success: function(alldata){
            //console.log(alldata)
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
                    // charts[i].hideLoading()
                }
                alert('Something went wrong. Please try again')
                return

            }
            
            if(dataLength>0 ){

            
                
                for (let i=0; i < data.length; i += 1) {
                    
                    fogdata.push([
                        (data[i][0]+data[i][1]*1800 )*1000,
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
                    epoch=(data1[i][0]+data1[i][1]*1800 + 5.5*3600)*1000 ,
                    temperaturedata.push([
                        epoch,
                        (parseFloat(data1[i][2]) + parseFloat(data1[i][3])) / 2
                    ]);
                    rainfall.push([
                        epoch,
                        data1[i][4]>50? 50 : data1[i][4] // data[i][1]==null?data[i-1][1]:data[i][1]
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
                    // charts[i].hideLoading()
                }
                alert('Something went wrong. Please try again')
                return

            }
        
        
       
        if(dataLength>0){
            for (let i=0; i < dataLength; i += 1) {
                
                epoch=data[i][0] + 11*3600*1000
                
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
        last_epoch=epoch
        
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
        epoch-=5.5*3600000
        // document.getElementById("data-detail").innerHTML = '<div style="font-size:25px;"><div>Observations at: '+formatDate(fogdata[dataLength - 1][0])+'</div><div style="color:red">Visibility: ' + fogdata[dataLength - 1][1].toFixed(2) + " km   </div><div>Temperature: " + temperaturedata[dataLength - 1][1].toFixed(0) + "°C    </div><div>Relative Humidity: " + humiditydata[dataLength - 1][1].toFixed(2) + "%    </div><div>Wind: " + winddata[dataLength - 1][1].toFixed(2) + "km/h</div><div>Wind direction: " + winddata[dataLength - 1][2] + "° <span ><i class='fa fa-arrow-down' style='transform:rotate("+winddata[dataLength - 1][2]+"deg)'></i></span></div></div>   ";
       
        }
        let dateStr = formatDate(current[current.length-1]);
        document.getElementById('latest-observation-time').innerText = "Latest observation: " + dateStr;
        
        let visVal = parseFloat(current[0]);
        let tempVal = parseFloat(current[1]);
        let humVal = parseFloat(current[2]);
        let windVal = parseFloat(current[3]);
        let windDir = parseFloat(current[4]);
        let rainVal = (current[5] != '-') ? parseFloat(current[5]).toFixed(2) : '-';

        document.getElementById('hero-visibility-val').innerText = isNaN(visVal) ? '-' : visVal.toFixed(2);
        document.getElementById('val-temp').innerText = isNaN(tempVal) ? '-' : tempVal.toFixed(0);
        document.getElementById('val-hum').innerText = isNaN(humVal) ? '-' : humVal.toFixed(0);
        document.getElementById('val-wind').innerText = isNaN(windVal) ? '-' : windVal.toFixed(2);
        document.getElementById('val-wind-dir').innerHTML = (isNaN(windDir) ? '-' : windDir.toFixed(0)) + '° <i class="fa fa-arrow-down" style="transform:rotate('+(isNaN(windDir)?0:windDir)+'deg)"></i>';
        document.getElementById('val-rain').innerText = rainVal;

        // Side Panel map data
        let panelHtml = `
            <div class="flex justify-between items-center"><span class="text-slate-500">Visibility</span> <span class="font-bold text-slate-800 dark:text-slate-200">${isNaN(visVal)?'-':visVal.toFixed(2)} km</span></div>
            <div class="flex justify-between items-center"><span class="text-slate-500">Temperature</span> <span class="font-bold text-slate-800 dark:text-slate-200">${isNaN(tempVal)?'-':tempVal.toFixed(0)} °C</span></div>
            <div class="flex justify-between items-center"><span class="text-slate-500">Humidity</span> <span class="font-bold text-slate-800 dark:text-slate-200">${isNaN(humVal)?'-':humVal.toFixed(0)} %</span></div>
            <div class="flex justify-between items-center"><span class="text-slate-500">Wind</span> <span class="font-bold text-slate-800 dark:text-slate-200">${isNaN(windVal)?'-':windVal.toFixed(2)} km/h</span></div>
            <div class="flex justify-between items-center"><span class="text-slate-500">Rainfall</span> <span class="font-bold text-slate-800 dark:text-slate-200">${rainVal} mm</span></div>
        `;
        document.getElementById('panel-station-data').innerHTML = panelHtml;

        // Fog condition calculation
        let badge = document.getElementById('hero-status-badge');
        let txt = document.getElementById('hero-status-text');
        
        if (isNaN(visVal)) {
            badge.innerText = "NO DATA";
            badge.style.backgroundColor = "#f1f5f9"; badge.style.color = "#475569";
            txt.innerText = "No real-time visibility data available.";
        } else if (visVal < 0.5) {
            badge.innerText = "DENSE FOG";
            badge.style.backgroundColor = "#fee2e2"; badge.style.color = "#991b1b"; // Red
            txt.innerText = "Dense fog detected. Visibility is dangerously low.";
        } else if (visVal >= 0.5 && visVal <= 1.0) {
            badge.innerText = "MODERATE";
            badge.style.backgroundColor = "#fef3c7"; badge.style.color = "#92400e"; // Amber
            txt.innerText = "Moderate fog detected. Visibility is impaired.";
        } else if (visVal > 1.0 && visVal <= 2.0) {
            badge.innerText = "LOW VISIBILITY";
            badge.style.backgroundColor = "#fef9c3"; badge.style.color = "#854d0e"; // Yellow
            txt.innerText = "Visibility is low, approaching fog threshold.";
        } else {
            badge.innerText = "CLEAR";
            badge.style.backgroundColor = "#dcfce7"; badge.style.color = "#166534"; // Green
            txt.innerText = "Visibility currently remains above the fog-risk threshold.";
        }
        
        // Trigger countUp animations
        setTimeout(() => {
            document.querySelectorAll('.count-up').forEach(el => {
                let target = parseFloat(el.getAttribute('data-val'));
                if (isNaN(target)) {
                    el.innerText = el.getAttribute('data-val');
                    return;
                }
                let duration = 1500;
                let startTime = null;
                const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                
                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const easedProgress = easeOutExpo(progress);
                    let current = easedProgress * target;
                    
                    // Format based on integer vs float
                    if (target % 1 === 0) {
                        el.innerText = Math.round(current);
                    } else {
                        el.innerText = current.toFixed(2);
                    }
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        el.innerText = target % 1 === 0 ? target : target.toFixed(2);
                    }
                };
                window.requestAnimationFrame(step);
            });
        }, 100);
        
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        var las=new Date(0)
        //console.log(fogdata[dataLength-1][0]/1000 )
        //  console.log(epoch)
        d.setUTCSeconds(epoch/1000 );

        las.setUTCSeconds((epoch/1000))
        
        las=las.toISOString().replace('T',' ').split('.')[0]
        
        // las.setUTCSeconds(las/1000)
        // d.toUTCString()
        let n=new Date();
        n = new Date(n.getTime() - 5.5*3600000);
        n=n.getFullYear()+'-'+((n.getMonth()+1)<10?'0'+(n.getMonth()+1):(n.getMonth()+1))+'-'+n.getDate()+' '+n.getHours()+':'+n.getMinutes()
        //if(cityid!='IIT Kanpur'){
           // console.log('inn',end,n)
        if(end>=n || end==-1){
            $.ajax({url: "apis/newpred.php?stime="+las+"&station="+cityid+"&model="+model+"&status=1", async: false,success: function(data){
                //console.log(data)
                var data = JSON.parse(data)
                datalen = data.length
                for (i = 0 ; i < datalen; i += 1) {
                    // console.log(data[i][0]+(5.5*3600000))
                    epoch= data[i][0] + ((cityid=='IIT Kanpur')?5.5*3600000:11*3600000)
                    if(epoch>last_epoch)
                    {
                        fogdata2.push([
                            epoch,
                            (data[i][1]>5)?5:data[i][1]
                        ]);
                        temperaturedata.push([
                            epoch,
                            null
                        ]);
                        humiditydata.push([
                            epoch,
                            null
                        ]);
                        winddata.push([
                            epoch,
                            null,
                        null
                        ]);
                        winddirectiondata.push([
                            epoch,
                            null
                        ]);
                        rainfall.push([
                            epoch,
                            null
                        ]);
                    }
            }
            }});
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

            if(fogdata2.length>0 && fogdata2[0][0]!=fogdata[fogdata.length-1][0])
                fogdata2.unshift(fogdata[fogdata.length-1])
            else if(fogdata2.length>0)
                fogdata2[0]=fogdata[fogdata.length-1]
        }
        // console.log(fogdata[fogdata.length-1][0],fogdata2[0])
    //} 
        if(fogdata2.length > 0) {
            // Generate Timeline & Summary
            let timelineHtml = '';
            let minVis = 999;
            let minTime = '';
            let periodsBelow1km = [];
            
            for(let i=0; i<fogdata2.length; i++) {
                let v = parseFloat(fogdata2[i][1]);
                let d = new Date(fogdata2[i][0]);
                let tStr = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
                
                if (v < minVis) {
                    minVis = v;
                    minTime = tStr;
                }
                
                if (v <= 1.0) {
                    periodsBelow1km.push(tStr);
                }
                
                let cond = 'Clear';
                let col = 'text-green-600';
                if (v < 0.5) { cond = 'Dense'; col = 'text-red-600'; }
                else if (v <= 1.0) { cond = 'Moderate'; col = 'text-amber-600'; }
                else if (v <= 2.0) { cond = 'Low'; col = 'text-yellow-600'; }
                
                timelineHtml += `
                <li class="py-3 px-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <span class="text-sm font-medium text-slate-800 dark:text-slate-200">${tStr}</span>
                    <div class="flex items-center gap-4">
                        <span class="text-sm font-bold text-slate-900 dark:text-white">${v.toFixed(2)} km</span>
                        <span class="text-xs font-bold uppercase ${col} w-20 text-right">${cond}</span>
                    </div>
                </li>`;
            }
            
            document.getElementById('visibility-timeline').innerHTML = timelineHtml;
            
            let summaryHtml = `
                <div class="flex flex-col gap-4">
                    <div class="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <span class="text-slate-500">Minimum visibility</span>
                        <span class="font-bold text-slate-800 dark:text-slate-200">${minVis.toFixed(2)} km</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <span class="text-slate-500">Min visibility time</span>
                        <span class="font-bold text-slate-800 dark:text-slate-200">${minTime} IST</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <span class="text-slate-500">Periods below 1 km</span>
                        <span class="font-bold ${periodsBelow1km.length > 0 ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}">${periodsBelow1km.length > 0 ? periodsBelow1km.length + ' periods' : 'None'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-500">Forecast horizon</span>
                        <span class="font-bold text-slate-800 dark:text-slate-200">${fogdata2.length} points</span>
                    </div>
                </div>
            `;
            document.getElementById('forecast-summary').innerHTML = summaryHtml;
        } else {
            document.getElementById('visibility-timeline').innerHTML = '<li class="p-4 text-sm text-slate-500 text-center">No forecast data available.</li>';
            document.getElementById('forecast-summary').innerHTML = '<div class="text-sm text-slate-500">No forecast data available.</div>';
        }
        
        
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
                if(element[1]!=''){
                    let el = document.getElementById(element[1]);
                    if (el) el.style["display"] = "block";
                }
            }
            else{
                if(element[1]!=''){
                    let el = document.getElementById(element[1]);
                    if (el) el.style["display"] = "none";
                }
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
        if(fogdata.length>0){
            charts[0].xAxis[0].update({
                plotLines: [{
                    color: 'rgba(15,23,42,0.3)', // Subtle charcoal marker
                    width: 2,
                    dashStyle: 'Dash',
                    value: fogdata[fogdata.length - 1][0],
                    zIndex: 3,
                    label: { text: 'Current Time', align: 'right', x: -5, y: 15, style: {  fontSize: '10px' } }
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
            // charts[i].hideLoading()
        }
        var renderTime = Date.now() - window.performance.timing.navigationStart;
        console.log('Render time : ' + renderTime + ' milliseconds');
        

        var otherSec = document.getElementById('other-section');
        if (otherSec) otherSec.style["display"] = "none";
    }   
    });
    if(create==1)
        fogFunction(model)
    // Highcharts.setOptions({
    //     time: {
    //         timezoneOffset: -11 * 60
    //     }
    // });
    
    
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
        getchart(["Visibility","Visibility Forecast"],["km","km"],0,mod));
    
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
                // charts[i].showLoading()
            }
            //getchart
    
           
    // document.getElementById('mapFog-section').style["display"] = "block";
    // document.getElementById('Temperature-section').style["display"] = "block";
    // document.getElementById('Humidity-section').style["display"] = "block";
    // document.getElementById('Wind-section').style["display"] = "block";
    $("#page").LoadingOverlay("hide");
}
// $('#myInput').on('keyup', autocomplete(document.getElementById("myInput")));
function getchart(name,unit,ind,mod){
    
     return Highcharts.stockChart(name[0], {
        chart: {
            height: (ind==0) ? 400 : 320,
            panning: (ind==0)?true:false,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            },
            spacingTop: 24,
            spacingBottom: 24,
            spacingLeft: 16,
            spacingRight: 16
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: 300,
                        spacingLeft: 8,
                        spacingRight: 8
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
            height: 40,
            outlineColor: '#e2e8f0',
            maskFill: 'rgba(99, 102, 241, 0.1)',
            series: {
                color: '#6366f1',
                lineColor: '#6366f1'
            }
        },
        scrollbar: {
            enabled: false
        },
        rangeSelector: (ind==0)?{
            buttonTheme: {
                fill: 'none',
                stroke: 'none',
                'stroke-width': 0,
                r: 6,
                style: {
                    
                    fontWeight: '600',
                    fontSize: '13px'
                },
                states: {
                    hover: {
                        fill: '#f1f5f9',
                        style: { color: '#0f172a' }
                    },
                    select: {
                        fill: '#e0e7ff',
                        style: { color: '#4f46e5' }
                    }
                }
            },
            inputStyle: {
                color: '#475569',
                fontWeight: '500'
            },
            labelStyle: {
                color: '#94a3b8',
                fontWeight: '500'
            },
            buttons: [{
                count: 1,
                text: '1D',
                events:{
                    click: function() {
                        if(interval=='day') return;
                        interval='day';
                        highChartFunc(mod[0],'1 DAY');
                    }
                }
            }, {
                count: 1,
                text: '1W',
                events:{
                    click: function() {
                        if(interval=='week') return;
                        interval='week';
                        highChartFunc(mod[0],'7 DAY');
                    }
                },
            },
            {
                count: 1,
                text: '1M',
                events:{
                    click: function() {
                        if(interval=='month') return;
                        interval='month';
                        highChartFunc(mod[0],'1 MONTH');
                    }
                },
            }, {
                count: 1,
                text: '1Y',
                events:{
                    click: function() {
                        if(interval=='year') return;
                        interval='year';
                        highChartFunc(mod[0],'1 YEAR');
                    }
                },
            }, {
                text: 'ALL',
                events:{
                    click: function() {
                        if(interval=='all') return;
                        interval='all';
                        highChartFunc(mod[0],"10 YEAR");
                    }
                },
            }],
            selected: 0,
            buttonPosition: {
                align: 'right'
            }
        }:{
            enabled: false
        },
        title: {
            text: name.length > 1 ? name[1] : name[0],
            align: 'left',
            style: {
                fontSize: "18px",
                fontWeight: "700",
                
            }
        },
        subtitle: (ind==0 && mod && mod[0]) ? {
            text: 'GBM Regressor Model',
            align: 'left',
            style: {
                fontSize: "13px",
                fontWeight: "500",
                
            }
        } : { text: '' },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            itemStyle:{
                fontSize: "13px",
                fontWeight: "600",
                color: "#475569"
            },
            itemHoverStyle: {
                color: "#0f172a"
            }
        },
        plotOptions: {
            series: {
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidthPlus: 1
                    }
                },
                point: {
                    events: {
                        mouseOver: function(e) {
                            $(".highcharts-markers path").attr('visibility', 'visible');
                        },
                        mouseOut: function(e) {
                            $(".highcharts-markers path").attr('visibility', 'hidden');
                        }
                    }
                }
            }
        },
        yAxis: [{
            min: (ind==0)?0:null,
            max: (ind==0)?5:null,
            gridLineColor: '#f1f5f9',
            gridLineWidth: 1,
            labels: {
                align: 'right',
                x: -8,
                style: {
                    
                    fontWeight: '500',
                    fontSize: '11px'
                }
            },
            title: {
                text: unit[0],
                style: {
                    
                    fontWeight: '600',
                    fontSize: '12px'
                }
            },
            top: '0%',
            height: '100%',
            offset: 0,
            lineWidth: 0,
            opposite: false,
            resize: {
                enabled: true
            },
            plotBands:(ind==0)?[
            {
                from: 0,
                to: 1,
                color: 'rgba(239, 68, 68, 0.04)',
                label: {
                    text: 'Low Visibility (<1km)',
                    style: { color: '#ef4444', fontWeight: '600', fontSize: '11px' },
                    align: 'right',
                    verticalAlign: 'bottom',
                    x: -10,
                    y: -5
                }
            }
        ]:[],
        visible:true,
        plotLines: (ind==0)?[{
            value: 1,
            width: 1.5,
            color: '#ef4444',
            dashStyle: 'Dash',
            zIndex: 4,
            label: {
                text: 'Threshold',
                style: { color: '#ef4444', fontWeight: 'bold', fontSize: '11px' },
                align: 'left',
                x: 10,
                y: -5
            }
        }]:[]

        }],

        xAxis: {
            type: 'datetime',
            gridLineWidth: 0,
            lineColor: '#cbd5e1',
            tickColor: '#cbd5e1',
            labels: {
                enabled: true,
                style: {
                    
                    fontWeight: '500',
                    fontSize: '11px'
                }
            },
            crosshair: {
                color: '#94a3b8',
                width: 1,
                dashStyle: 'Dash'
            },
            plotLines: (ind==0)?[{
                color: '#f59e0b',
                width: 2,
                zIndex: 3
            }]:[]
        },

        series: getdata(name,unit,ind),
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["viewFullscreen",  "downloadPDF", "downloadCSV"],
                    theme: {
                        fill: 'transparent'
                    }
                }
            }
        }
    },
    (ind==0)?function(chart) {
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
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    cityname = inp.value;
                    cityid = inp.value;
                    let el = document.getElementById('cityname');
                    if (el) el.innerHTML = '<i class="fas fa-map-marker-alt text-indigo-500"></i> Location: ' + inp.value;
                    $("#page").LoadingOverlay("show");
                    loaddata(4);
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
    if (typeof AmCharts === "undefined" || !AmCharts.makeChart) {
        console.warn("AmCharts is not available.");
        return;
    }
    if (!arra || arra.length === 0) {
        console.warn("No map station data provided.");
        return;
    }
    var latlongEl = document.getElementById("latlong");
    var position = latlongEl ? latlongEl.value : "";
    
    var isDark = document.documentElement.classList.contains('dark');
    var areaColor = isDark ? "#1e293b" : "#e2e8f0";
    var areaOutlineColor = isDark ? "#334155" : "#ffffff";
    var rollOverAreaColor = isDark ? "#334155" : "#cbd5e1";
    var labelTextColor = isDark ? "#94a3b8" : "#334155";

    var jsonObj = {
        "type": "map",
        "addClassNames": true,
        "fontSize": 11,
        "color": labelTextColor,
        "projection": "mercator",
        "backgroundAlpha": 0,
        "backgroundColor": "transparent",
        
        "dataProvider": {
            "map": "india2019High",
            "getAreasFromMap": true,
            "images": []
        },
        "areasSettings": {
            "color": areaColor,
            "outlineColor": areaOutlineColor,
            "outlineThickness": 0.8,
            "rollOverColor": rollOverAreaColor,
            "rollOverOutlineColor": "#6366f1",
            "rollOverBrightness": 10,
            "selectedBrightness": 10,
            "selectable": true,
            "unlistedAreasAlpha": 0,
            "unlistedAreasOutlineAlpha": 0
        },
        "imagesSettings": {
            "alpha": 0.9,
            "color": "#4f46e5",
            "outlineAlpha": 0,
            "rollOverOutlineAlpha": 0,
            "outlineColor": "#ffffff",
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
            "right": 16,
            "bottom": 16,
            "minZoomLevel": 0.8,
            "gridHeight": 80,
            "gridAlpha": 0.1,
            "gridBackgroundAlpha": 0,
            "gridColor": "#6366f1",
            "draggerAlpha": 1,
            "buttonCornerRadius": 4
        }
    };

    var j = 0;
    for (var i = 0; i < arra.length; i++) {
        if (arra[i][0] == cityid) {
            j = i;
        }
        jsonObj.dataProvider.images.push({
            "selectable": true,
            "longitude": arra[i][2],
            "latitude": arra[i][1] + 0.68,
            "type": "circle",
            "labelPosition": "bottom",
            "labelColor": labelTextColor,
            "labelFontSize": 11,
            "color": "#4f46e5",
            "scale": 0.7,
            "rollOverScale": 1.4,
            "labelRollOverColor": "#ef4444",
            "accessibleLabel": arra[i][0],
            "balloonText": "<span style='font-weight:600; font-size:12px;'>" + arra[i][0] + "</span>",
            "bringForwardOnHover": true,
            "rollOverColor": "#ef4444",
            "title": arra[i][0]
        });
    }

    if (jsonObj.dataProvider.images[j]) {
        jsonObj.dataProvider.images[j].label = cityid;
        jsonObj.dataProvider.images[j].color = "#ef4444";
        jsonObj.dataProvider.images[j].scale = 1.1;
        jsonObj.dataProvider.images[j].labelColor = "#ef4444";
        jsonObj.dataProvider.images[j].labelFontSize = 13;
    }

    var chart = AmCharts.makeChart('map1', jsonObj);
    chart.addListener("clickMapObject", function(ev) {
        if (ev.mapObject.cname == "MapImage") {
            document.getElementById('myInput').value = ev.mapObject.title;
            cityid = ev.mapObject.title;
            var cityEl = document.getElementById('cityname');
            if (cityEl) {
                cityEl.innerHTML = '<i class="fas fa-map-marker-alt text-indigo-500"></i> Location: ' + ev.mapObject.title;
            }
            interval = '1 DAY';
            if (chart.dataProvider.images[j]) {
                chart.dataProvider.images[j].label = "";
                chart.dataProvider.images[j].color = "#4f46e5";
                chart.dataProvider.images[j].scale = 0.7;
            }
            chart.dataProvider.images[ev.mapObject.index].label = ev.mapObject.title;
            chart.dataProvider.images[ev.mapObject.index].labelFontSize = 13;
            chart.dataProvider.images[ev.mapObject.index].labelColor = "#ef4444";
            chart.dataProvider.images[ev.mapObject.index].color = "#ef4444";
            chart.dataProvider.images[ev.mapObject.index].scale = 1.1;
            j = ev.mapObject.index;
            chart.validateData();
            highChartFunc(4, '1 DAY');
        }
    });
}
function getPos() {
    $.ajax({url: "apis/position.php?cityid="+encodeURIComponent(cityid), async: false,success: function(data){
        try {
            var parsed = JSON.parse(data);
            var el = document.getElementById("latlong");
            if (el) el.value = JSON.stringify(parsed);
        } catch(e) {
            console.error("Error parsing position:", e);
        }
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
 