var arr = [];

$(document).ready(function() {
    // $("#page").LoadingOverlay("show");
    var d=new Date()
    var s=new Date();
    s.setDate(d.getDate()-1)
    var start=s.getFullYear()+'-'+((s.getMonth()+1)<10?'0'+(s.getMonth()+1):(s.getMonth()+1))+'-'+(s.getDate()<10?'0'+s.getDate():s.getDate())
    var end=d.getFullYear()+'-'+((d.getMonth()+1)<10?'0'+(d.getMonth()+1):(d.getMonth()+1))+'-'+(d.getDate()<10?'0'+d.getDate():d.getDate())
    document.getElementById("sensor_start_date").value = start;
    document.getElementById("sensor_end_date").value = end;
    document.getElementById("ground_start_date").value = start;
    document.getElementById("ground_end_date").value = end;
    document.getElementById("aws_start_date").value = start;
    document.getElementById("aws_end_date").value = end;
    // var {temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time}=
    // var {mor_avg,mor_inst}=showvis('1 DAY')
    // plotvis(mor_avg,mor_inst)
    // $("#page").LoadingOverlay("hide");
    showdata2('1 DAY')
    showdata1('1 DAY')
    showdata('1 DAY')
    var renderTime = Date.now() - window.performance.timing.navigationStart;
        console.log('Render time: ' + renderTime + ' milliseconds');   
    
    // showchart(temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time)
    // var {L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time}=
    
    // showchart2(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time)
    
    
});
function sensor_sub(){
    // let  s= document.getElementById("sensor_start_date").value
    // let e=document.getElementById("sensor_end_date").value
    // let n=new Date();
    // n=n.getFullYear()+'-'+((n.getMonth()+1)<10?'0'+(n.getMonth()+1):(s.getMonth()+1))+'-'+n.getDate()
    // if(s>e){
    //     alert("Start date should be smaller than end date")
    //     return
    // }
    // if(s>n || e>n){
    //     alert("Please do not enter future period")
    //     return 
    // }
    let  s= document.getElementById("sensor_start_date").value
    let e=document.getElementById("sensor_end_date").value
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
    showdata2('1 DAY',s,e)

}

function ground_sub(){
    // let  s= document.getElementById("ground_start_date").value
    // let e=document.getElementById("ground_end_date").value
    // let n=new Date();
    // n=n.getFullYear()+'-'+((n.getMonth()+1)<10?'0'+(n.getMonth()+1):(s.getMonth()+1))+'-'+n.getDate()
    // if(s>e){
    //     alert("Start date should be smaller than end date")
    //     return
    // }
    // if(s>n || e>n){
    //     alert("Please do not enter future period")
    //     return 
    // }
    let  s= document.getElementById("ground_start_date").value
    let e=document.getElementById("ground_end_date").value
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
    showdata1('1 DAY',s,e)

}

function aws_sub(){
    // let  s= document.getElementById("aws_start_date").value
    // let e=document.getElementById("aws_end_date").value
    // let n=new Date();
    // n=n.getFullYear()+'-'+((n.getMonth()+1)<10?'0'+(n.getMonth()+1):(s.getMonth()+1))+'-'+n.getDate()
    // if(s>e){
    //     alert("Start date should be smaller than end date")
    //     return
    // }
    // if(s>n || e>n){
    //     alert("Please do not enter future period")
    //     return 
    // }
    let  s= document.getElementById("aws_start_date").value
    let e=document.getElementById("aws_end_date").value
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
    showdata('1 DAY',s,e) 

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
    
    
    var temperaturedata = Array(),
        humiditydata = Array(),
        winddata = Array(),
        sunshinedata = Array(),
        raindata=Array(),
        atmosphericpressuredata = Array(),
        j = 0,
        last_time = ''
    $.ajax({
            //crossDomain: true,
            //dataType: 'jsonp',
            // url: "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-03-22/" + formatDate() + "/862549045430298/DeviceDate",
            url:(start==-1 || end==-1)? "apis/sensordata.php?interval="+interval+"&select=1":"apis/sensordata.php?start_date="+start+"&end_date="+end+"&select=1",
            async: false,
            success: function(result) {
                var data = JSON.parse(result)
                var dataLength = data.length,
                    i = 0
                last_time = data[dataLength - 1]['date_time']
                prevEpoch = 0
                var myDate = new Date(data[0]['date_time']); // Your timezone!
                var myEpoch = (myDate.getTime()+(1800000*data[0]['slot'])) + 5.5 * 36 * 100000, lastEpoch = (new Date(last_time).getTime()+(1800000*data[0]['slot'])) + 5.5 * 36 * 100000, currentEpoch = (new Date(data[0]['date_time']).getTime()+(1800000*data[0]['slot'])) + 5.5 * 36 * 100000

                while(i<dataLength && myEpoch<=lastEpoch){
                    if(currentEpoch>myEpoch){
                        temperaturedata.push([
                            myEpoch,
                            null
                        ]);
                        humiditydata.push([
                            myEpoch,
                            null
                        ]);
                        winddata.push([
                            myEpoch,
                            null,
                            null
                        ]);
                        sunshinedata.push([
                            myEpoch,
                            null
                        ]);
                        raindata.push([
                            myEpoch,
                            null
                        ]);
                        atmosphericpressuredata.push([
                            myEpoch,
                            null
                        ]);
                    }
                    else{
                        let rain = parseFloat(data[i]['rain'])
                        temperaturedata.push([
                            myEpoch,
                            // (data[i]['MaxTemp'] + data[i]['MinTemp']) / 2
                            (parseFloat(data[i]['max_temp']) + parseFloat(data[i]['min_temp'])) / 2
                        ]);
                        humiditydata.push([
                            myEpoch,
                            // (data[i]['MinMoisture'] + data[i]['MaxMoisture']) / 2
                            (parseFloat(data[i]['min_humidity']) + parseFloat(data[i]['max_humidity'])) / 2
                        ]);
                        winddata.push([
                            myEpoch,
                            parseFloat(data[i]['wind_speed']),
                            parseFloat(data[i]['wind_direction']).toFixed(2)
                        ]);
                        sunshinedata.push([
                            myEpoch,
                            parseFloat(data[i]['sunshine'])
                        ]);
                        raindata.push([
                            myEpoch,
                            // (data[i]['MaxTemp'] + data[i]['MinTemp']) / 2
                            rain>50? 50 : rain
                        ]);
                        atmosphericpressuredata.push([
                            myEpoch,
                            // (data[i]['MaxTemp'] + data[i]['MinTemp']) / 2
                            parseFloat(data[i]['atmospheric_pressure'])
                        ]);
                        i+=1
                        if(i<dataLength)
                        currentEpoch = (new Date(data[i]['date_time']).getTime()+(1800000*data[i]['slot'])) + 5.5 * 36 * 100000

                    }
                    
                    prevEpoch = myEpoch
                    myEpoch+=1800000

                }
            }
        })
        console.log(raindata)

        showchart(temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time)
        
    // return{temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time}
    


};

function showdata1(interval,start=-1,end=-1) {
    
    
    var SM = Array(),
        BECTC = Array(),
        Temp_C = Array(),
        Temp_F = Array(),
        BEC = Array(),
        RDP1=Array(),
        IDP1 = Array(),
        RDP2=Array(),
        IDP2 = Array()
        $.ajax({
            //crossDomain: true,
            //dataType: 'jsonp',
            // url: "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-03-22/" + formatDate() + "/862549045430298/DeviceDate",
            url: (start==-1||end==-1)?"apis/sensordata3.php?interval="+interval+"&select=2":"apis/sensordata3.php?start_date="+start+"&end_date="+end+"&select=2",
            async: false,
            success: function(result) {
                // console.log(result)
                // var list=result.split(';')
                // var data = JSON.parse(list[0])
                var data=JSON.parse(result)
                var dataLength = data.length
                var myEpoch = (data[0][0]+(1800*data[0][1]))*1000, lastEpoch = (data[dataLength-1][0]+(1800*data[0][1]))*1000, currentEpoch = (data[0][0]+(1800*data[0][1]))*1000, i=0
                while(i<dataLength && myEpoch<=lastEpoch){
                    if(currentEpoch>myEpoch){
                        SM.push([
                            myEpoch,
                            // data[i][2]
                            null
                        ]);
                        BECTC.push([
                            myEpoch,
                            null
                        ]);
                        Temp_C.push([
                            myEpoch,
                            null
                        ]);
                        Temp_F.push([
                            myEpoch,
                            null
                        ]);
                        BEC.push([
                            myEpoch,
                            null
                        ]);
                        RDP1.push([
                            myEpoch,
                            null
                        ]);
                        RDP2.push([
                            myEpoch,
                            null
                            
                        ]);
                        IDP1.push([
                            myEpoch,
                            null
                            
                        ]);
                        IDP2.push([
                            myEpoch,
                            null
                        ]);
                    }
                    else{
                        //var myEpoch = (data[i][0]+(data[i][1]*1800))*1000  //+ 5.5 * 36 * 100000
                        
                        SM.push([
                            myEpoch,
                            // data[i][2]
                            -7.668*Math.pow(10,-6)*Math.pow(data[i][7],3)+3.96*Math.pow(10,-4)*Math.pow(data[i][7],2)+0.0131*data[i][7]-0.0349
                        ]);
                        BECTC.push([
                            myEpoch,
                            parseFloat(data[i][3].toPrecision(2))
                        ]);
                        Temp_C.push([
                            myEpoch,
                            data[i][4]
                        ]);
                        Temp_F.push([
                            myEpoch,
                            data[i][5]
                        ]);
                        BEC.push([
                            myEpoch,
                            data[i][6]
                        ]);
                        RDP1.push([
                            myEpoch,
                            data[i][7]
                        ]);
                        RDP2.push([
                            myEpoch,
                            data[i][8]
                            
                        ]);
                        IDP1.push([
                            myEpoch,
                            data[i][9]
                            
                        ]);
                        IDP2.push([
                            myEpoch,
                            data[i][10]
                        ]);
                        i+=1
                        if(i<dataLength)
                        currentEpoch = (data[i][0]+(1800*data[i][1]))*1000

                    }
                    
                    var prevEpoch = myEpoch
                    myEpoch+=1800000
                    

                }
                // var data1=JSON.parse(list[1])
                // var dataLength1 = data1.length
                // for (i; i < dataLength1; i += 1) {
                //     var myEpoch = (data1[i][0]+(data1[i][1]*300))*1000// + 5.5 * 36 * 100000
                //     vis_avg.push([ myEpoch, data1[i][2]])
                // }
            }
            
        })


        showchart1(SM,BECTC,Temp_C,Temp_F,BEC,RDP1,RDP2,IDP1,IDP2)   
    
    // return{temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time}
    


};

function showdata2(interval,start=-1,end=-1) {
    // $("#page").LoadingOverlay("show");
    // var d=new Date()
    // var s=new Date();
    // s.setDate(d.getDate()-1)
    // var start=s.getFullYear()+'-'+(s.getMonth()+1)+'-'+s.getDate()+' '+s.getHours()+':'+s.getMinutes()+':'+s.getSeconds()
    // var end=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
    var L1_temperaturedata = Array(),
        L2_temperaturedata = Array(),
        L3_temperaturedata = Array(),
        L1_humiditydata = Array(),
        L2_humiditydata = Array(),
        L3_humiditydata = Array(),
        PM_1 = Array(),
        PM_2_5 = Array(),
        PM_4 = Array(),
        PM_10 = Array(),

        NC_0_5 = Array(),
        NC_1 = Array(),
        NC_2_5 = Array(),
        NC_4 = Array(),
        NC_10 = Array(),
        vis_avg=Array(),
        aqi=Array()
        pm25=0,
        pm10=0,
        i=0,
        battery_voltage= Array()
    console.log("here")
    $.ajax({
            //crossDomain: true,
            //dataType: 'jsonp',
            // url: "http://3.88.31.90:82/testapi/wdrest.svc/GetAWSDataAPI_V2/2021-03-22/" + formatDate() + "/862549045430298/DeviceDate",
            url: (start==-1||end==-1)?"apis/sensordata3.php?interval="+interval+"&select=1":"apis/sensordata3.php?start_date="+start+"&end_date="+end+"&select=1",
            async: false,
            success: function(result) {
                // var list=result.split(';')
                // var data = JSON.parse(list[0])
                var data=JSON.parse(result)
                
                var dataLength = data.length
                //var myDate = new Date(data[0][0]),last_time = new Date(data[dataLength-1][0]); // Your timezone!
                var myEpoch = (data[0][0]+(1800*data[0][1]))*1000, lastEpoch = (data[dataLength-1][0]+(1800*data[0][1]))*1000, currentEpoch = (data[0][0]+(1800*data[0][1]))*1000
                while(i<dataLength && myEpoch<=lastEpoch){
                    
                    if(currentEpoch>myEpoch){
                        
                        L1_temperaturedata.push([
                            myEpoch,
                            null
                        ]);
                        L2_temperaturedata.push([
                            myEpoch,
                            null
                        ]);
                        L3_temperaturedata.push([
                            myEpoch,
                            null
                        ]);
                        L1_humiditydata.push([
                            myEpoch,
                            null
                        ]);
                        L2_humiditydata.push([
                            myEpoch,
                            null
                        ]);
                        L3_humiditydata.push([
                            myEpoch,
                            null
                        ]);
                        PM_1.push([
                            myEpoch,
                            null
                            
                        ]);
                        PM_2_5.push([
                            myEpoch,
                            null
                            
                        ]);
                        PM_4.push([
                            myEpoch,
                            null
                        ]);
                        PM_10.push([
                            myEpoch,
                            null
                        ]);
                        NC_0_5.push([
                            myEpoch,
                            null
                        ]);
                        NC_1.push([
                            myEpoch,
                            null
                        ]);
                        NC_2_5.push([
                            myEpoch,
                            null
                        ]);
                        NC_4.push([
                            myEpoch,
                            null
                        ]);
                        NC_10.push([
                            myEpoch,
                            null
                        ]);
                        
                        aqi.push([
                            myEpoch,
                            null
                        ])
                    }
                    else{
                    //var myEpoch = (data[i][0]+(data[i][1]*1800))*1000  //+ 5.5 * 36 * 100000
                    
                        L1_temperaturedata.push([
                            myEpoch,
                            data[i][3]
                        ]);
                        L2_temperaturedata.push([
                            myEpoch,
                            data[i][5]
                        ]);
                        L3_temperaturedata.push([
                            myEpoch,
                            data[i][7]
                        ]);
                        L1_humiditydata.push([
                            myEpoch,
                            data[i][2]
                        ]);
                        L2_humiditydata.push([
                            myEpoch,
                            data[i][4]
                        ]);
                        L3_humiditydata.push([
                            myEpoch,
                            data[i][6]
                        ]);
                        PM_1.push([
                            myEpoch,
                            data[i][8]
                            
                        ]);
                        PM_2_5.push([
                            myEpoch,
                            data[i][9]
                            
                        ]);
                        PM_4.push([
                            myEpoch,
                            data[i][10]
                        ]);
                        PM_10.push([
                            myEpoch,
                            data[i][11]
                        ]);
                        NC_0_5.push([
                            myEpoch,
                            data[i][12]
                        ]);
                        NC_1.push([
                            myEpoch,
                            data[i][13]
                        ]);
                        NC_2_5.push([
                            myEpoch,
                            data[i][14]
                        ]);
                        NC_4.push([
                            myEpoch,
                            data[i][15]
                        ]);
                        NC_10.push([
                            myEpoch,
                            data[i][16]
                        ]);
                        pm25=data[i][9]
                        pm10=data[i][11]
                        if(pm10<=100)
                            pm10=pm10
                        else if(pm10<=250)
                            pm10=100+(pm10-100)*100/150
                        else if(pm10<=350)
                            pm10=200+(pm10-250)
                        else if(pm10<=430)
                            pm10=300+(pm10-350)*(100/80)
                        else if(pm10>430)
                            pm10=400+(pm10-430)*(100/80)

                        if(pm25<=30)
                            pm25=pm25*50/30
                        else if(pm25<=60)
                            pm25=50+(pm25-30)*50/30
                        else if(pm25<=90)
                            pm25=100+(pm25-60)*100/30
                        else if(pm25<=120)
                            pm25=200+(pm25-90)*(100/30)
                        else if(pm25<=250)
                            pm25=300+(pm25-120)*(100/130)
                        else if(pm25>250)
                            pm25=400+(pm25-250)*(100/130)
                        aqi.push([
                            myEpoch,
                            Math.max(pm25,pm10)
                        ])

                        i+=1
                        if(i<dataLength)
                        currentEpoch = (data[i][0]+(1800*data[i][1]))*1000
                        console.log(new Date(currentEpoch))

                    }
                    
                    var prevEpoch = myEpoch
                    myEpoch+=1800000

                // var data1=JSON.parse(list[1])
                // var dataLength1 = data1.length
                // for (i; i < dataLength1; i += 1) {
                //     var myEpoch = (data1[i][0]+(data1[i][1]*300))*1000// + 5.5 * 36 * 100000
                //     vis_avg.push([ myEpoch, data1[i][2]])
                // }
                // console.log(vis_avg)
                }
            }
            
        })
        $.ajax({
            
            url: (start==-1||end==-1)?"apis/sensordata3.php?interval="+interval+"&select=0":"apis/sensordata3.php?start_date="+start+"&end_date="+end+"&select=0",
            async: false,
            success: function(result) {
                // console.log(result)
                // console.log(result)
                // var list=result.split(';')
                // var data = JSON.parse(list[0])
                var data=JSON.parse(result)
                var dataLength = data.length
                var myEpoch = (data[0][0]+(1800*data[0][1]))*1000, lastEpoch = (data[dataLength-1][0]+(1800*data[0][1]))*1000, currentEpoch = (data[0][0]+(1800*data[0][1]))*1000, i=0
                while(i<dataLength && myEpoch<=lastEpoch){
                    if(currentEpoch>myEpoch){
                        vis_avg.push([ myEpoch, null])
                    }
                    else{
                        vis_avg.push([ myEpoch, data[i][2]])
                        i+=1
                        if(i<dataLength)
                            currentEpoch = (data[i][0]+(1800*data[i][1]))*1000
                    }
                    myEpoch+=1800000
                }
            }
        })
        
        
    // return {L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time}
    showchart2(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,vis_avg,aqi)



};

function showvis(interval){
    var mor_avg=Array(),mor_inst=Array();
    
    $.ajax({url: "apis/iitdata.php?interval="+interval, async: false,
        success: function(data){
            var data = JSON.parse(data)
            datalen = data.length
            for (i = 0 ; i < datalen; i += 1) {
                if(data[i][1]==0){
                    mor_avg.push([
                        data[i][0]*1000 ,
                        data[i][2]
                    ]);
                    mor_inst.push([
                        data[i][0]*1000 ,
                        data[i][3]
                    ]);
                }
                else{
                    mor_avg.push([
                        (data[i][0]+1800)*1000 ,
                        data[i][2]
                    ]);
                    mor_inst.push([
                        (data[i][0]+1800)*1000 ,
                        data[i][3]
                    ]);
                }

            }
        }
        
        
    });
    return {mor_avg,mor_inst}
}


function plotvis(mor_avg,mor_inst){
    var charts = []
    charts.push(
        Highcharts.stockChart('Visibility', {
                chart: {
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' },
                    
                    panning: true,
                    // events: {
                    //     load: function() {
                    //         setInterval(function() {
                    //             $.ajax({
                    //                 url: "apis/visdata.php?",
                    //                 success: function(result) {
                    //                     var data = JSON.parse(result),
                    //                         i = 0
                    //                         // console.log(data)
                    //                     var dataLength = data.length
                    //                     if (dataLength)
                    //                         last_time = data[dataLength - 1][0]
                    //                     for (i; i < dataLength; i += 1) {
                                            
                    //                         var myEpoch = data[i][0]*1000 + 5.5 * 36 * 100000
                    //                         if (i != 0 && myEpoch - prevEpoch < 300000)
                    //                             continue
                    //                         charts[0].series[0].addPoint([myEpoch, (parseFloat(data[i]['max_temp']) + parseFloat(data[i]['min_temp'])) / 2], true, true)
                    //                         charts[1].series[0].addPoint([myEpoch, (parseFloat(data[i]['min_humidity']) + parseFloat(data[i]['max_humidity'])) / 2], true, true)
                    //                         charts[2].series[0].addPoint([myEpoch, parseFloat(data[i]['wind_speed']), parseFloat(data[i]['wind_direction'])], true, true)
                    //                         charts[3].series[0].addPoint([myEpoch, parseFloat(data[i]['sunshine'])], true, true)
                    //                         charts[4].series[0].addPoint([myEpoch, parseFloat(data[i]['atmospheric_pressure'])], true, true)
                    //                         charts[5].series[0].addPoint([myEpoch, parseFloat(data[i]['rain'])], true, true)


                    //                     }
                    //                 }
                    //             })
                    //         }, 20000);
                    //     }
                    // }
                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            chart: {
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' },
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
                rangeSelector: {
                    buttons: [{
                            //type: 'day',
                            count: 1,
                            text: '1d',
                            events:{
                                click: function() {
                                   
                                    var{mor_avg,mor_inst}=showvis('1 DAY')
                                    charts[0].series[0].update({
                                        // pointStart: newSeries[0].pointStart,
                                        data: mor_avg
                                    }, true);
                                    // charts[0].series[1].update({
                                    //     // pointStart: newSeries[0].pointStart,
                                    //     data: mor_inst
                                    // }, true);
                                }
                            },
                        }, {
                            //type: 'week',
                            count: 1,
                            text: '1w',
                            events:{
                                click: function() {
                                   
                                    var{mor_avg,mor_inst}=showvis('7 DAY')
                                    charts[0].series[0].update({
                                        // pointStart: newSeries[0].pointStart,
                                        data: mor_avg
                                    }, true);
                                    // charts[0].series[1].update({
                                    //     // pointStart: newSeries[0].pointStart,
                                    //     data: mor_inst
                                    // }, true);
                                }
                            },
                        },
                        {
                            //type: 'month',
                            count: 1,
                            text: '1m',
                            events:{
                                click: function() {
                                    
                                    var{mor_avg,mor_inst}=showvis('1 MONTH')
                                    charts[0].series[0].update({
                                        // pointStart: newSeries[0].pointStart,
                                        data: mor_avg
                                    }, true);
                                    // charts[0].series[1].update({
                                    //     // pointStart: newSeries[0].pointStart,
                                    //     data: mor_inst
                                    // }, true);
                                }
                            },
                        }, {
                            //type: 'year',
                            count: 1,
                            text: '1y',
                            events:{
                                click: function() {
                                   
                                    var{mor_avg,mor_inst}=showvis('1 YEAR')
                                    charts[0].series[0].update({
                                        // pointStart: newSeries[0].pointStart,
                                        data: mor_avg
                                    }, true);
                                    // charts[0].series[1].update({
                                    //     // pointStart: newSeries[0].pointStart,
                                    //     data: mor_inst
                                    // }, true);
                                }
                            },
                        }, {
                            //type: 'all',
                            text: 'All',
                            events:{
                                click: function() {
                                    
                                    var{mor_avg,mor_inst}=showvis('ALL')
                                    charts[0].series[0].update({
                                        // pointStart: newSeries[0].pointStart,
                                        data: mor_avg
                                    }, true);
                                    // charts[0].series[1].update({
                                    //     // pointStart: newSeries[0].pointStart,
                                    //     data: mor_inst
                                    // }, true);
                                }
                            },
                        }
                    ],
                    inputEnabled: true,
                    selected: 0,


                },
                title: {
                    text: 'Visibility (km) ',
                    align: 'left',
                    style: {
                        // fontSize: "20px",
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
                        point:{
                        }
                    }
                },
                yAxis: [{
                    min: 0,
                    // max: 6,
                    gridLineWidth: 2,
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
                    color: '#e53e3e',
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
                    max: mor_avg[mor_avg.length - 1][0],
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

                series: [

                    {
                        name: 'Visibility',
                        data: mor_avg,
                        type: 'spline',
                        yAxis: 0,
                        tooltip: {
                            pointFormat: '{point.y} km',
                            valueDecimals: 2
                        },
                        dataGrouping: {
                            approximation: 'average'
                        }
                    },
                    // {
                    //     name: 'MOR_instantaneous',
                    //     data: mor_inst,
                    //     type: 'spline',
                    //     yAxis: 0,
                    //     tooltip: {
                    //         pointFormat: 'MOR_instantaneous {point.y}Km)',
                    //         valueDecimals: 2
                    //     },
                    //     dataGrouping: {
                    //         approximation: 'average'
                    //     }
                    // },
                    // {
                    //     name: 'TEXCO',
                    //     data: texco,
                    //     type: 'spline',
                    //     yAxis: 0,
                    //     tooltip: {
                    //         pointFormat: 'TEXCO {point.y}Km)',
                    //         valueDecimals: 2
                    //     },
                    //     dataGrouping: {
                    //         approximation: 'average'
                    //     }
                    // }

                ],
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: ["viewFullscreen","downloadPDF","downloadCSV"]
                        }
                    }
                }
            }
            ,
            function(chart) {

                // apply the date pickers
                setTimeout(function() {
                    $('input.highcharts-range-selector', $(chart.container).parent())
                        .datepicker();
                }, 0);
            }
            ));
}
var inter='day'
var aws_charts=[]
function getawschart(name,unit,data,ind){
    console.log(name)
        return Highcharts.stockChart(name, {
            allowChartUpdate:false,
                chart: {
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' },
                    
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
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' },
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
                        //type: 'day',
                        count: 1,
                        text: '1d',
             
                        events:{
                            click: function() {
                                if(inter=='day')
                                    return 
                                inter='day'
                                showdata('1 DAY')
                               
                                
                            }
                        },
                    }, {
                        //type: 'week',
                        count: 1,
                        text: '1w',
                        events:{
                            click: function() {
                                if(inter=='week')
                                    return 
                                inter='week'
                                showdata('7 DAY')
                               
                            }
                        },
                    },
                    {
                        //type: 'month',
                        count: 1,
                        text: '1m',
                        events:{
                            click: function() {
                                if(inter=='month')
                                    return 
                                inter='month'
                                showdata('1 MONTH')
                               
                            }
                        },
                    }, {
                        //type: 'year',
                        count: 1,
                        text: '1y',
                        events:{
                            click: function() {
                                if(inter=='year' || inter=='all')
                                    return 
                                inter='year'
                                
                                showdata('1 YEAR')
                            }
                        },
                    }, {
                        //type: 'all',
                        count:1,
                        text: 'All',
                        events:{
                            click: function() {
                                if(inter=='all' || inter=='year')
                                    return 
                                inter='all'
                                // var d=new Date()
                                // var start= "2021-03-22 00:00:17"
                                // var end=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
                                // var {temperaturedata, humiditydata, winddata, sunshinedata, raindata,atmosphericpressuredata, last_time}=
                                showdata('10 YEAR')
                                // aws_charts[0].series[0].update({
                                //     // pointStart: newSeries[0].pointStart,
                                //     data: temperaturedata
                                // }, false,true);
                                // aws_charts[1].series[0].update({
                                //     // pointStart: newSeries[0].pointStart,
                                //     data: humiditydata
                                // }, false,true);
                                // aws_charts[2].series[0].update({
                                //     // pointStart: newSeries[0].pointStart,
                                //     data: winddata
                                // }, false,true);
                                // aws_charts[3].series[0].update({
                                //     // pointStart: newSeries[0].pointStart,
                                //     data: sunshinedata
                                // }, false,true);
                                // aws_charts[4].series[0].update({
                                //     // pointStart: newSeries[0].pointStart,
                                //     data: atmosphericpressuredata
                                // }, false,true);
                                // aws_charts[5].series[0].update({
                                //     // pointStart: newSeries[0].pointStart,
                                //     data: raindata
                                // }, false,true);
                            }
                        },
                    }
                ],
                    inputEnabled: true,
                    selected: 0,


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
                    text: name +' ('+unit+')',
                    align: 'left',
                    style: {
                        // fontSize: "20px",
                        color: "red"
                    }
                },
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                mouseOver: function(e) {
                                    if(name=="Rain")
                                    return
                                    k = aws_charts[ind].series[0].points[0].index;
                                    for (var i = 0; i < aws_charts.length; i++) {
                                        
                                       // charts[i].series[0].points[this.index - k].setState('hover');
                                         aws_charts[i].tooltip.refresh([aws_charts[i].series[0].points[this.index - k]])
    
                                        // charts[i].xAxis[0].addPlotLine({
                                        //     id: 'xPlotLine',
                                        //     value: this.x,
                                        //     width: 1,
                                        //     color: '#C0C0C0'
                                        // });
                                    }
                                    $(".highcharts-markers path").attr('visibility', 'visible')
    
                                },
                                mouseOut: function(e) {
                                    // k = charts[1].series[0].points[0].index;
                                    for (var i = 0; i < aws_charts.length; i++) {
                                        // if (i == 0)
                                        //     continue;
                                        // charts[i].xAxis[0].removePlotLine('xPlotLine');
                                        aws_charts[i].tooltip.hide();
                                    }
                                     $(".highcharts-markers path").attr('visibility', 'hidden')
    
                                }
                            }
                        }
                    }
                },
                yAxis: [{
                    // min: 0,
                    // max:80,
                    gridLineWidth: 2,
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
                    }

                }],

                xAxis: {
                    // max: temperaturedata[temperaturedata.length - 1][0],
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

                series: [

                    {
                        name: name,
                        data: data,
                        type: (name=='Rain')?'column':'spline',
                        yAxis: 0,
                        tooltip: {
                            pointFormat:(name=='Wind')?'Speed: <b>{point.y}</b> '+unit+'<br/>Direction: <b>{point.z}</b> °N' : '<b>{point.y}</b> '+unit,
                            valueDecimals: 2
                        },
                        dataGrouping:
                        (name=='Rain')?{
                            approximation: 'max',
                            forced: true,
                            units: [
                                ['minute', [30]]
                            ]
                        }: 
                        {
                            approximation: 'average'
                        },
                        keys:(name=='Wind')?['x', 'y', 'z']:['x', 'y'],
                    }

                ],
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
                }
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
function showchart(temperaturedata, humiditydata, winddata, sunshinedata,raindata,atmosphericpressuredata, last_time) {

    aws_charts=[]
    aws_charts.push(getawschart('Temperature','°C',temperaturedata,0));
    // console.log(aws_charts)
    aws_charts.push(getawschart('Humidity','%',humiditydata,1));
    aws_charts.push(getawschart('Wind','m/s',winddata,2));
    aws_charts.push(getawschart('Sunshine','Wt/m²',sunshinedata,3));
    
    aws_charts.push(getawschart('Atmospheric Pressure','hPa',atmosphericpressuredata,4));
    aws_charts.push(getawschart('Rain','mm',raindata,4));
    
    // Populate AWS summary strip with latest non-null values
    function getLatest(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i][1] !== null) return arr[i][1];
        }
        return null;
    }
    var latestTemp = getLatest(temperaturedata);
    var latestHum = getLatest(humiditydata);
    var latestWind = winddata.length > 0 ? getLatest(winddata) : null;
    var latestPres = getLatest(atmosphericpressuredata);
    var latestRain = getLatest(raindata);
    var latestSun = getLatest(sunshinedata);

    if (latestTemp !== null && document.getElementById('aws-val-temp'))
        document.getElementById('aws-val-temp').innerHTML = parseFloat(latestTemp).toFixed(1) + '<span class="aws-metric-unit">°C</span>';
    if (latestHum !== null && document.getElementById('aws-val-hum'))
        document.getElementById('aws-val-hum').innerHTML = parseFloat(latestHum).toFixed(1) + '<span class="aws-metric-unit">%</span>';
    if (latestWind !== null && document.getElementById('aws-val-wind'))
        document.getElementById('aws-val-wind').innerHTML = parseFloat(latestWind).toFixed(1) + '<span class="aws-metric-unit">m/s</span>';
    if (latestPres !== null && document.getElementById('aws-val-pres'))
        document.getElementById('aws-val-pres').innerHTML = parseFloat(latestPres).toFixed(0) + '<span class="aws-metric-unit">hPa</span>';
    if (latestRain !== null && document.getElementById('aws-val-rain'))
        document.getElementById('aws-val-rain').innerHTML = parseFloat(latestRain).toFixed(1) + '<span class="aws-metric-unit">mm</span>';
    if (latestSun !== null && document.getElementById('aws-val-sun'))
        document.getElementById('aws-val-sun').innerHTML = parseFloat(latestSun).toFixed(0) + '<span class="aws-metric-unit">W/m²</span>';

    // Update sync timestamp
    if (last_time && document.getElementById('sync-time')) {
        var lt = new Date(last_time);
        document.getElementById('sync-time').textContent = 'SYNCED ' + lt.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit', hour12: false}) + ' IST';
    }

}


var bel_charts=[]
var interbel='day'
function getbelchart(sec, name,unit,data,ind){
    // console.log(interbel)
    return Highcharts.stockChart(sec, {
        chart: {
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' },
            panning: true,
            
        },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' },
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
            buttons: [{
                    // type: 'day',
                    count: 1,
                    text: '1d',
                    events:{
                        click: function() {
                            if(interbel=='day')
                                return
                            interbel='day'
                            showdata1('1 DAY')
                               
                        }
                    }
                }, {
                    // type: 'week',
                    count: 1,
                    text: '1w',
                    events:{
                        click: function() {
                            if(interbel=='week')
                                return
                            interbel='week'
                            showdata1('7 DAY')
                               
                        }
                    }
                },
                {
                    // type: 'month',
                    count: 1,
                    text: '1m',
                    events:{
                        click: function() {
                            if(interbel=='month')
                                return
                            interbel='month'
                            showdata1('1 MONTH')
                                
                        }
                    }
                }, {
                    // type: 'year',
                    count: 1,
                    text: '1y',
                    events:{
                        click: function() {
                            if(interbel=='year')
                                return
                            interbel='year'
                            showdata1('1 YEAR')
                              
                        }
                    }
                }, {
                    // type: 'all',
                    text: 'All',
                    events:{
                        click: function() {
                            if(interbel=='all')
                                return
                            interbel='all'
                            // var {L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time}=
                            showdata1('10 YEAR')
                                // bel_charts[0].series[0].update({data: L1_temperaturedata},false,true)
                                // bel_charts[0].series[1].update({data: L2_temperaturedata},false,true)
                                // bel_charts[0].series[2].update({data: L3_temperaturedata},false,true)
                                // bel_charts[1].series[0].update({data: L1_humiditydata},false,true)
                                // bel_charts[1].series[1].update({data: L2_humiditydata},false,true)
                                // bel_charts[1].series[2].update({data: L3_humiditydata},false,true)
                                // bel_charts[2].series[0].update({data: PM_1},false,true)
                                // bel_charts[2].series[1].update({data: PM_2_5},false,true)
                                // bel_charts[2].series[2].update({data: PM_4},false,true)
                                // bel_charts[2].series[3].update({data: PM_10},false,true)
                                // bel_charts[3].series[0].update({data: NC_0_5},false,true)
                                // bel_charts[3].series[1].update({data: NC_1},false,true)
                                // bel_charts[3].series[2].update({data: NC_2_5},false,true)
                                // bel_charts[3].series[3].update({data: NC_4},false,true)
                                // bel_charts[3].series[4].update({data: NC_10},false,true)
                        }
                    }
                }
            ],
            inputEnabled: true,
            selected: 0,
            buttonTheme: { // Muted button styling for hierarchy
                fill: 'none',
                stroke: 'none',
                style: {
                    color: '#718096',
                    fontSize: '11px',
                    fontWeight: '500'
                },
                states: {
                    hover: {
                        fill: '#edf2f7',
                        style: {
                            color: '#1a202c'
                        }
                    },
                    select: {
                        fill: '#e2e8f0',
                        style: {
                            color: '#1a202c',
                            fontWeight: '600'
                        }
                    }
                }
            },


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
            inputEnabled: false,
            selected: 0,
            enabled: false
        },
        title: { text: null },
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver: function(e) {
                            
                            k = bel_charts[ind].series[0].points[0].index;
                            var xs=this.x
                            // console.log(this)
                            // console.log(bel_charts[3].series[1].points)
                            // console.log(k,this.index,bel_charts.length)
                            for (var i = 0; i < bel_charts.length; i++) {
                                
                                var arr = Array()
                                
                                for(var j=0;j<bel_charts[i].series.length;j++){
                                    // bel_charts[i].series[j].points[this.index - k].setState('hover');
                                    // console.log(bel_charts[i].series[j].points)
                                    var xr=bel_charts[i].series[j].points
                                    // if(xr==undefined || xr[this.index - k]==undefined){
                                    //     arr.push(null)
                                    // }
                                    // else{
                                    if(xr!=undefined){
                                        for(var k=0;k<xr.length;k++){
                                            if(xr[k].x==xs){
                                                arr.push(xr[k])
                                            }
                                        }
                                    }
                                    // var asach=''
                                        // arr.push(bel_charts[i].series[j].points[this.index - k])
                                    // }
                                }
                                // console.log(sencharts[])
                                // console.log(arr)
                                if(arr.length>0)
                                bel_charts[i].tooltip.refresh(arr)

                                // bel_charts[i].xAxis[0].addPlotLine({
                                //     id: 'xPlotLine',
                                //     value: this.x,
                                //     width: 1,
                                //     color: '#C0C0C0'
                                // });
                                
                            }
                            $(".highcharts-markers path").attr('visibility', 'visible')
                        },
                        mouseOut: function(e) {
                            // console.log(e)
                            // k = bel_charts[0].series[0].points[0].index;
                            for (var i = 0; i < bel_charts.length; i++) {
                                // if(i==ind)continue;
                                // bel_charts[i].xAxis[0].removePlotLine('xPlotLine');
                                bel_charts[i].tooltip.hide();
                            }
                            $(".highcharts-markers path").attr('visibility', 'hidden')


                        }
                    }
                }
            }
        },
        yAxis: [{
            // min: 0,
            // max:80,
            gridLineWidth: 2,
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
            }

        }],

        xAxis: {
            // max: L1_temperaturedata[L1_temperaturedata.length - 1][0],
            events: {
                afterSetExtremes: function(e) {
                    // charts.forEach(function(chart, i) {
                    //     if (i !== 0) {
                    //         chart.xAxis[0].setExtremes(e.min, e.max)
                    //     }
                    // })
                }

            },
            crosshair: true
        },
        legend: {
            enabled: true,
            itemStyle:{
                fontSize:"15px"
            }
        },
        series: setbeldata(name,unit,data),

            //[ {
            //     name: 'Layer-1 (The temperature at 1 m above ground)',
            //     data: L1_temperaturedata,
            //     type: 'spline',
            //     yAxis: 0,
            //     tooltip: {
            //         pointFormat: 'Layer 1 : {point.y}°C',
            //         valueDecimals: 0
            //     },
            //     dataGrouping: {
            //         approximation: 'average'
            //     },
            //     // color: 'blue'
            // },
            // {
            //     name: 'Layer-2 (The temperature at 2 m above ground)',
            //     data: L2_temperaturedata,
            //     type: 'spline',
            //     yAxis: 0,
            //     tooltip: {
            //         pointFormat: 'Layer 2 : {point.y}°C',
            //         valueDecimals: 0
            //     },
            //     dataGrouping: {
            //         approximation: 'average'
            //     }

            // },
            // {
            //     name: 'Layer-3 (The temperature at 3 m above ground)',
            //     data: L3_temperaturedata,
            //     type: 'spline',
            //     yAxis: 0,
            //     tooltip: {
            //         pointFormat: 'Layer 3 : {point.y}°C',
            //         valueDecimals: 0
            //     },
            //     dataGrouping: {
            //         approximation: 'average'
            //     },
            //     color: '#CD5C5C'
            // }

        // ],
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["downloadPDF","downloadCSV"]
                }
            }
        }
    }
    ,
    (ind==0)?function(chart) {

        // apply the date pickers
        setTimeout(function() {
            $('input.highcharts-range-selector', $(chart.container).parent())
                .datepicker();
        }, 0);showchart1
    }:function(chart){}
    );
}

function setbeldata(name,unit,data){
    var ar=[]
    for(var i=0;i<data.length;i++){
        ar.push(
            {
                name: name[i*2+1],
                data: data[i],
                type: 'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat: (name[i*2+2]!='')? name[i*2+2]+' : {point.y:.2f}'+unit[i+1]:'{point.y:.2f}'+unit[i+1],
                    valueDecimals: 2,
                    // nullFormat: '-',
                },
                dataGrouping: {
                    approximation: 'average'
                    
                },
                // color: 'blue'
            }
        )
    }
    return ar
}


function showchart1(SM,BECTC,Temp_C,Temp_F,BEC,RDP1,RDP2,IDP1,IDP2) {
    bel_charts = []
    // console.log(L1_humiditydata.length,L1_temperaturedata.length)
    bel_charts.push(getbelchart('Soil Moisture',['Soil Moisture','Soil Moisture',''],['Volumetric Water Content',' Volumetric Water Content'],[SM],0))
    bel_charts.push(getbelchart('BECTC',['Bulk Electrical Conductivity','BEC',''],['S/m','S/m'],[BECTC],1))
    bel_charts.push(getbelchart('Temp',['Soil Temperature','Soil Temperature',''],['°C','°C'],[Temp_C],2))
    // bel_charts.push(getbelchart('BEC',['Bulk Electrical Conductivity','BEC',''],['S/m','S/m'],[BEC],3))
    bel_charts.push(getbelchart('RDP',['Real Dielectric Permittivity','RDP','',],['',''],[RDP2],3))
    bel_charts.push(getbelchart('IDP',['Imaginary Dielectric Permittivity','IDP',''],['',''],[IDP2],4))
    


}

var sen_charts=[]
var intersen='day'
function getsenchart(sec, name,unit,data,ind){
    // console.log(intersen)
    return Highcharts.stockChart(sec, {
        chart: {
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' },
            
            panning: true,
            
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' },
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
            buttons: [{
                    // type: 'day',
                    count: 1,
                    text: '1d',
                    events:{
                        click: function() {
                            if(intersen=='day')
                                return
                            intersen='day'
                            showdata2('1 DAY')
                               
                        }
                    }
                }, {
                    // type: 'week',
                    count: 1,
                    text: '1w',
                    events:{
                        click: function() {
                            if(intersen=='week')
                                return
                            intersen='week'
                            showdata2('7 DAY')
                               
                        }
                    }
                },
                {
                    // type: 'month',
                    count: 1,
                    text: '1m',
                    events:{
                        click: function() {
                            if(intersen=='month')
                                return
                            intersen='month'
                            showdata2('1 MONTH')
                                
                        }
                    }
                }, {
                    // type: 'year',
                    count: 1,
                    text: '1y',
                    events:{
                        click: function() {
                            if(intersen=='year')
                                return
                            intersen='year'
                            showdata2('1 YEAR')
                              
                        }
                    }
                }, {
                    // type: 'all',
                    text: 'All',
                    events:{
                        click: function() {
                            if(intersen=='all')
                                return
                            intersen='all'
                            // var {L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,last_time}=
                            showdata2('10 YEAR')
                                // sen_charts[0].series[0].update({data: L1_temperaturedata},false,true)
                                // sen_charts[0].series[1].update({data: L2_temperaturedata},false,true)
                                // sen_charts[0].series[2].update({data: L3_temperaturedata},false,true)
                                // sen_charts[1].series[0].update({data: L1_humiditydata},false,true)
                                // sen_charts[1].series[1].update({data: L2_humiditydata},false,true)
                                // sen_charts[1].series[2].update({data: L3_humiditydata},false,true)
                                // sen_charts[2].series[0].update({data: PM_1},false,true)
                                // sen_charts[2].series[1].update({data: PM_2_5},false,true)
                                // sen_charts[2].series[2].update({data: PM_4},false,true)
                                // sen_charts[2].series[3].update({data: PM_10},false,true)
                                // sen_charts[3].series[0].update({data: NC_0_5},false,true)
                                // sen_charts[3].series[1].update({data: NC_1},false,true)
                                // sen_charts[3].series[2].update({data: NC_2_5},false,true)
                                // sen_charts[3].series[3].update({data: NC_4},false,true)
                                // sen_charts[3].series[4].update({data: NC_10},false,true)
                        }
                    }
                }
            ],
            inputEnabled: true,
            selected: 0,
            buttonTheme: { // Muted button styling for hierarchy
                fill: 'none',
                stroke: 'none',
                style: {
                    color: '#718096',
                    fontSize: '11px',
                    fontWeight: '500'
                },
                states: {
                    hover: {
                        fill: '#edf2f7',
                        style: {
                            color: '#1a202c'
                        }
                    },
                    select: {
                        fill: '#e2e8f0',
                        style: {
                            color: '#1a202c',
                            fontWeight: '600'
                        }
                    }
                }
            },


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
            inputEnabled: false,
            selected: 0,
            enabled: false
        },
        title: { text: null },
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver: function(e) {
                            
                            k = sen_charts[ind].series[0].points[0].index;
                            var xs=this.x
                            // console.log(this)
                            // console.log(sen_charts[3].series[1].points)
                            // console.log(k,this.index,sen_charts.length)
                            for (var i = 0; i < sen_charts.length; i++) {
                                
                                var arr = Array()
                                
                                for(var j=0;j<sen_charts[i].series.length;j++){
                                    // sen_charts[i].series[j].points[this.index - k].setState('hover');
                                    // console.log(sen_charts[i].series[j].points)
                                    var xr=sen_charts[i].series[j].points
                                    // if(xr==undefined || xr[this.index - k]==undefined){
                                    //     arr.push(null)
                                    // }
                                    // else{
                                    if(xr!=undefined){
                                        for(var k=0;k<xr.length;k++){
                                            if(xr[k].x==xs){
                                                arr.push(xr[k])
                                            }
                                        }
                                    }
                                    // var asach=''
                                        // arr.push(sen_charts[i].series[j].points[this.index - k])
                                    // }
                                }
                                // console.log(sencharts[])
                                // console.log(arr)
                                if(arr.length>0){
                                    
                                    sen_charts[i].tooltip.refresh(arr)
                                }

                                // sen_charts[i].xAxis[0].addPlotLine({
                                //     id: 'xPlotLine',
                                //     value: this.x,
                                //     width: 1,
                                //     color: '#C0C0C0'
                                // });
                                
                            }
                            $(".highcharts-markers path").attr('visibility', 'visible')
                        },
                        mouseOut: function(e) {
                            // console.log(e)
                            // k = sen_charts[0].series[0].points[0].index;
                            for (var i = 0; i < sen_charts.length; i++) {
                                // if(i==ind)continue;
                                // sen_charts[i].xAxis[0].removePlotLine('xPlotLine');
                                sen_charts[i].tooltip.hide();
                            }
                            $(".highcharts-markers path").attr('visibility', 'hidden')


                        }
                    }
                }
            },
            column:{
                zones: [{
                    value: 51, // Values up to 10 (not including) ...
                    color: 'rgb(0, 176, 80)' // ... have the color blue.
                  },{
                      value:101,
                      color: 'rgb(146, 208, 80)' // Values from 10 (including) and up have the color red
                  },{
                    value:201,
                    color: 'rgb(255, 255, 0)' // Values from 10 (including) and up have the color red
                  },{
                    value:301,
                    color: 'rgb(255, 153, 0)' // Values from 10 (including) and up have the color red
                  },{
                    value:401,
                    color: 'rgb(255, 0, 0)' // Values from 10 (including) and up have the color red
                  },{
                    
                    color: 'rgb(192, 0, 0)' // Values from 10 (including) and up have the color red
                  }]
            }
        },
        yAxis: [{
            min:(ind==0)?0:null,
            // max:80,
            gridLineWidth: 2,
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
            plotLines: (ind==0)?[{
                value: 1,
                width: 2,
                color: '#e53e3e',
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
            }]:[{color: '#cbd5e0'}]

        },
        //(ind=0)?{}:{min:0}
    ],

        xAxis: {
            // max: L1_temperaturedata[L1_temperaturedata.length - 1][0],
            events: {
                afterSetExtremes: function(e) {
                    // charts.forEach(function(chart, i) {
                    //     if (i !== 0) {
                    //         chart.xAxis[0].setExtremes(e.min, e.max)
                    //     }
                    // })
                }

            },
            crosshair: true
        },
        legend: { enabled: true, itemStyle: { fontSize: '13px', fontWeight: '500', color: '#4a5568' } },
        series: setsendata(name,unit,data),

            
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["downloadPDF","downloadCSV"]
                }
            }
        }
    }
    ,
    (ind==0)?function(chart) {

        // apply the date pickers
        setTimeout(function() {
            $('input.highcharts-range-selector', $(chart.container).parent())
                .datepicker();
        }, 0);
    }:function(chart){}
    );
}

function setsendata(name,unit,data){
    var ar=[]
    for(var i=0;i<data.length;i++){
        ar.push(
            {
                name: name[i*2+1],
                data: data[i],
                type: (name[i*2+2]=='AQI')?'column':'spline',
                yAxis: 0,
                tooltip: {
                    pointFormat:(name[i*2+2]!='')? name[i*2+2]+' : <b>{point.y}</b> '+unit:'<b>{point.y}</b> '+unit,
                    valueDecimals: 2,
                    // nullFormat: '-',
                },
                dataGrouping: {
                    approximation: 'average'
                    
                },
                color: (name[i*2+2]=='AQI')?'white':null
            }
        )
    }
    return ar
}
function showchart2(L1_temperaturedata,L2_temperaturedata,L3_temperaturedata,L1_humiditydata,L2_humiditydata,L3_humiditydata,PM_1,PM_2_5,PM_4,PM_10,NC_0_5,NC_1,NC_2_5,NC_4,NC_10,vis_avg,aqi) {
    sen_charts = []
    // console.log(L1_humiditydata.length,L1_temperaturedata.length)
    sen_charts.push(getsenchart('Visibility',['Visibility','Visibility',''],'km',[vis_avg],0))
    sen_charts.push(getsenchart('Layer-Temperature',['Temperature','Layer 1 · 1m','Layer 1 · 1m','Layer 2 · 2m','Layer 2 · 2m','Layer 3 · 3m','Layer 3 · 3m'],'°C',[L1_temperaturedata,L2_temperaturedata,L3_temperaturedata],1))
    sen_charts.push(getsenchart('Layer-Humidity',['Humidity','Layer 1 · 1m','Layer 1 · 1m','Layer 2 · 2m','Layer 2 · 2m','Layer 3 · 3m','Layer 3 · 3m'],'%',[L1_humiditydata,L2_humiditydata,L3_humiditydata],2))
    sen_charts.push(getsenchart('PM',['Particulate Matter','AQI','AQI','PM 1.0','PM 1.0','PM 2.5','PM 2.5','PM 4.0','PM 4.0','PM 10.0','PM 10.0'],'',[aqi,PM_1,PM_2_5,PM_4,PM_10],3))
    sen_charts.push(getsenchart('NC',['','NC 0.5','NC 0.5','NC 1.0','NC 1.0','NC 2.5','NC 2.5','NC 4.0','NC 4.0','NC 10.0','NC 10.0'],'',[NC_0_5,NC_1,NC_2_5,NC_4,NC_10],4))
    
    
    
    

}
$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    onSelect: function() {
        this.onchange();
        this.onblur();
    }
});

//from 3640
