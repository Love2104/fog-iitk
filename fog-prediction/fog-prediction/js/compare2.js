var arr=[];
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
$(document).on({
    ajaxStart: function(){
        $("#body_").LoadingOverlay("show");

    },
    ajaxStop: function(){
        $("#body_").LoadingOverlay("hide");
    }    
});
$("#compare-button").click(function() {
    var fs = document.getElementById("myInputFirst").value;
    var ss = document.getElementById("myInputSecond").value;
    var fogdata1 = [],
        temperaturedata1 = [],
        humiditydata1 = [],
        winddata1 = [],
        winddirectiondata1 = [],
        fogdata2 = [],
        temperaturedata2 = [],
        humiditydata2 = [],
        winddata2 = [],
        winddirectiondata2 = []
       
    $.ajax({
        url: "apis/compare.php?station=" + fs,
        success: function(result) {
            var data = JSON.parse(result)
            var dataLength = data.length,
                i = 0;

            for (i; i < dataLength; i += 1) {
                fogdata1.push([
                    data[i][0],
                    data[i][1] * 1.60934
                ]);
                temperaturedata1.push([
                    data[i][0],
                    (data[i][2] - 32) / 1.8
                ]);
                humiditydata1.push([
                    data[i][0],
                    data[i][3]
                ]);
                winddata1.push([
                    data[i][0],
                    data[i][4] * 1.852,
                    data[i][5]
                ]);
                winddirectiondata1.push([
                    data[i][0],
                    data[i][5]
                ]);

            }
            $.ajax({
                url: "apis/compare.php?station=" + ss,
                success: function(result) {
                    var data = JSON.parse(result)
                    var dataLength = data.length,
                        i = 0;
                    for (i; i < dataLength; i += 1) {
                        fogdata2.push([
                            data[i][0],
                            data[i][1] * 1.60934
                        ]);
                        temperaturedata2.push([
                            data[i][0],
                            (data[i][2] - 32) / 1.8
                        ]);
                        humiditydata2.push([
                            data[i][0],
                            data[i][3]
                        ]);
                        winddata2.push([
                            data[i][0],
                            data[i][4] * 1.852,
                            data[i][5]
                        ]);
                        winddirectiondata2.push([
                            data[i][0],
                            data[i][5]
                        ]);
                    }

                    comparechart(fs, ss, fogdata1, temperaturedata1, humiditydata1, winddata1, fogdata2, temperaturedata2, humiditydata2, winddata2);
                }
            });

        }
    });
    


});
$('input[type=radio][name=show-chart]').change(function() {
    if (this.value == 'Visibility') {
        document.getElementById('compchart-div').style["display"] = "block";
        document.getElementById('TempComp-div').style["display"] = "none";
        document.getElementById('HumidityComp-div').style["display"] = "none";
        document.getElementById('WindComp-div').style["display"] = "none";
    } else if (this.value == 'Temperature') {
        document.getElementById('compchart-div').style["display"] = "none";
        document.getElementById('TempComp-div').style["display"] = "block";
        document.getElementById('HumidityComp-div').style["display"] = "none";
        document.getElementById('WindComp-div').style["display"] = "none";
    } else if (this.value == 'Humidity') {
        document.getElementById('compchart-div').style["display"] = "none";
        document.getElementById('TempComp-div').style["display"] = "none";
        document.getElementById('HumidityComp-div').style["display"] = "block";
        document.getElementById('WindComp-div').style["display"] = "none";
    } else if (this.value == 'Wind') {
        document.getElementById('compchart-div').style["display"] = "none";
        document.getElementById('TempComp-div').style["display"] = "none";
        document.getElementById('HumidityComp-div').style["display"] = "none";
        document.getElementById('WindComp-div').style["display"] = "block";
    }
});

function comparechart(fs, ss, fogdata1, temperaturedata1, humiditydata1, winddata1, fogdata2, temperaturedata2, humiditydata2, winddata2) {
    document.getElementById('customRadio1').checked = true;
    document.getElementById('radio-button-div').style["display"] = "block";
    document.getElementById('compchart-div').style["display"] = "block";


    var charts = []
        //    console.log(fogdata)
    charts.push(
        Highcharts.stockChart('compchart', {
            chart: {
                height: 500
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
                selected: 0,

            },
            title: {
                // text: 'Visibility Chart'
            },
            xAxis: {
                plotLines: [{
                    color: '#FF0000', // Red
                    width: 2,
                    // value: fogdata1[fogdata1.length-1][0],
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
            yAxis: [{
                gridLineWidth:0,
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
                    // {
                //     from:0.75,
                //     to:1,
                //     color:'rgb(255, 248, 238)'
                // },
                // {
                //     from:0.5,
                //     to:0.75,
                //     color:'rgb(255,127,80)'
                // },
                // {
                //     from:0.25,
                //     to:0.5,
                //     color:'rgb(255,99,71)'
                // },
                // {
                //     from:0.25,
                //     to:0,
                //     color:'rgb(255,69,0)'
                // },
                {
                    from:1,
                    to:0,
                    color:'rgb(255, 248, 238)'
                }
            ],
            plotLines: [{
                value: 1,
                width: 1,
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
                enabled: true
            },
            series: [{
                    name: fs,
                    data: fogdata1,
                    type: 'spline',
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>',
                        valueDecimals: 2
                    },
                    yAxis: 0,
                    dataGrouping: {
                        approximation: 'average'
                    },
                    color:"rgb(189, 129, 252)"

                },
                {
                    name: ss,
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
                    },
                    color:"orange"

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
    console.log(charts[0]);
    charts.push(
        Highcharts.stockChart('TempComp', {
            chart: {
                height: 500
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 500
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
                inputEnabled: false,
                selected: 0
            },
            title: {
                // text: 'Temperature Chart'
            },
            legend: {
                enabled: true
            },
            xAxis: {
                min: fogdata2[fogdata2.length - 1][0] - 86400000
            },
            yAxis: [{
                    labels: {
                        align: 'right',
                        x: -5
                    },
                    title: {
                        text: 'Temperature (°C)',
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
                    }
                }

            ],
            series: [

                {
                    name: fs,
                    data: temperaturedata1,
                    type: 'spline',
                    yAxis: 0,
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>°C',
                        valueDecimals: 2
                    },
                    dataGrouping: {
                        approximation: 'average'
                    },
                    color:"rgb(189, 129, 252)"
                },
                {
                    name: ss,
                    data: temperaturedata2,
                    type: 'spline',
                    yAxis: 0,
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>°C',
                        valueDecimals: 2
                    },
                    dataGrouping: {
                        approximation: 'average'
                    },
                    color:"orange"
                }

            ],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                    }
                }
            }
        })
    );
    charts.push(
        Highcharts.stockChart('HumidityComp', {
            chart: {
                height: 500
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 500
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
                inputEnabled: false,
                selected: 0
            },
            title: {
                // text: 'Humidity Chart'
            },
            legend: {
                enabled: true
            },
            xAxis: {

                min: fogdata2[fogdata2.length - 1][0] - 86400000
            },
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {
                    text: 'Humidity (%)',
                    style: {
                        fontSize: "16px",
                        color: "red"
                    }
                },
                top: '0%',
                height: '100%',
                offset: 10,
                lineWidth: 5,
                resize: {
                    enabled: true
                },
                opposite: false
            }],
            series: [{
                    name: fs,
                    data: humiditydata1,
                    type: 'spline',
                    yAxis: 0,
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>%',
                        valueDecimals: 2
                    },
                    dataGrouping: {
                        approximation: 'average'
                    },
                    color:"rgb(189, 129, 252)"
                },
                {
                    name: ss,
                    data: humiditydata2,
                    type: 'spline',
                    yAxis: 0,
                    tooltip: {
                        pointFormat: '<b>{point.y}</b>%',
                        valueDecimals: 2
                    },
                    dataGrouping: {
                        approximation: 'average'
                    },
                    color:"orange"
                }
            ],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                    }
                }
            }
        })
    );
    charts.push(
        Highcharts.stockChart('WindComp', {
            chart: {
                height: 500,
                zoomType: 'x'
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        chart: {
                            height: 500
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
                inputEnabled: false,
                selected: 0

            },
            title: {
                // text: 'Wind Chart'
            },
            legend: {
                enabled: true
            },

            xAxis: {

                min: fogdata2[fogdata2.length - 1][0] - 86400000
            },
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {
                    text: 'Wind (km/h)',
                    style: {
                        fontSize: "16px",
                        color: "red"
                    }
                },
                top: '0%',
                height: '100%',
                offset: 10,
                lineWidth: 5,
                opposite: false
            }],
            series: [{
                    name: fs,
                    data: winddata1,
                    type: 'spline',
                    yAxis: 0,
                    tooltip: {
                        pointFormat: '<b>{point.y}</b> ({point.z}°N)',
                        valueDecimals: 2
                    },
                    dataGrouping: {
                        approximation: 'average'
                    },
                    keys: ['x', 'y', 'z'],
                    color:"rgb(189, 129, 252)"
                },
                {
                    name: ss,
                    data: winddata2,
                    type: 'spline',
                    yAxis: 0,
                    tooltip: {
                        pointFormat: '<b>{point.y}</b> ({point.z}°N)',
                        valueDecimals: 2
                    },
                    dataGrouping: {
                        approximation: 'average'
                    },
                    keys: ['x', 'y', 'z'],
                    color:"orange"
                }

            ],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                    }
                }
            }
        })
    );
    Highcharts.setOptions({
        time: {
            timezoneOffset: -11 * 60
        }
    });
}


// arr =["Agartala", "Agatti Island", "Agra", "Ahmedabad", "Aizwal", "Allahabad", "Amritsar", "Aurangabad", "Baghdogra", "Kempegowda Bangalore ",
// "HAL Airport Bangalore", "Baroda", "Belgaum", "Belgaum Airport", "Bhaunagar", "Bhopal", "Bhubaneswar", "Bhuj", "Calicut", "Chandigarh", "Coimbatore", "Cooch-behar", "Cuddapah", "Dehra Dun", "Indira Gandhi Delhi", "Safdarjung  Delhi", "Dimapur", "Durgapur", "Fursatganj", "Gaya", "Goa dabolim", "Gorakhpur",
// "Guwahati", "Gwalior", "Hubli", "Begumpet  Hyderabad", "Rajiv Gandhi Hyderabad", "Imphal", "Indore", "Jabalpur", "Jaipur", "Jammu", "Jamshedpur", "Jharsuguda",
// "Jodhpur", "Jorhat", "Kangra", "Kannur", "Khajuraho", "Kochi", "Kolhapur", "Kolkata", "Kota", "Kulu", "Leh", "Lilabari", "Lucknow", "Ludhiaha", "Madras","Madurai", "Mangalore", "Mohanbari", "Juhu Mumbai", "Chhatrapati Mumbai", "Mysore", "Nagpur", "Nainital", "Nanded", "Patina", "Pendicherry", "Porbandar",
// "Port Blair", "Pune", "Swami Vivekananda Raipur", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Salem", "Shillong", "Shimla", "Shirdi", "Srinagar", "Surat",
// "Tezpur", "Thoise", "Tiruchirappalli", "Tirupeti", "Trivandrum", "Tuticorin", "Udaipur", "Khajuraho ", "Unknown", "Varanasi", "Lal Bahadur Varanasi", "Vijayawada", "Vizagapatam"]

// arr = ["Bhandup","Mumbai","Visakhapatnam","Coimbatore","Delhi","Bangalore","Pune","Nagpur","Lucknow","Vadodara","Indore","Jalalpur","Bhopal","Kolkata","Kanpur","New Delhi","Faridabad","Rajkot","Ghaziabad","Chennai","Meerut","Agra","Jaipur","Jabalpur","Varanasi","Allahabad","Hyderabad","Noida","Howrah","Thane","Patiala","Chakan","Ahmedabad","Manipala","Mangalore","Panvel","Udupi","Rishikesh","Gurgaon","Mathura","Shahjahanpur","Bagpat","Sriperumbudur","Chandigarh","Ludhiana","Palakkad","Kalyan","Valsad","Ulhasnagar","Bhiwani","Shimla","Dehradun","Patna","Unnao","Tiruvallur","Kanchipuram","Jamshedpur","Gwalior","Karur","Erode","Gorakhpur","Ooty","Haldwani","Bikaner","Puducherry","Nalbari","Bellary","Vellore","Naraina","Mandi","Rupnagar","Jodhpur","Roorkee","Aligarh","Indraprast","Karnal","Tanda","Amritsar","Raipur","Pilani","Bilaspur","Srinagar","Guntur","Kakinada","Warangal","Tirumala - Tirupati","Nizamabad","Kadapa","Kuppam","Anantpur","Nalgonda","Potti","Nellore","Rajahmundry","Bagalkot","Kurnool","Secunderabad","Mahatma","Bharuch","Miraj","Nanded","Anand","Gandhinagar","Bhavnagar","Morvi","Aurangabad","Modasa","Patan","Solapur","Kolhapur","Junagadh","Akola","Bhuj","Karad","Jalgaon Jamod","Chandrapur","Maharaj","Dhule","Ponda","Dahod","Navsari","Panjim","Patel","Nashik","Amravati","Somnath","Ganpat","Karwar","Davangere","Raichur","Nagara","Kushalnagar","Hassan","Hubli","Bidar","Belgaum","Mysore","Dharwad","Kolar","TumkÅ«r","Tiruchi","Thiruvananthapuram","Kozhikode","Thrissur","Madurai","Thalassery","Kannur","Karaikudi","Thanjavur","Manor","Idukki","Thiruvarur","Alappuzha","Gandhigram","Kochi","Annamalainagar","Amet","Kottarakara","Kottayam","Tirunelveli","Mohan","Salem","Attingal","Chitra","Chengannur","Guwahati","Kalam","Ranchi","Shillong","Gangtok","Srikakulam","Tezpur","Bhubaneswar","Imphal","Sundargarh","Arunachal","Manipur","Bihar Sharif","Mandal","Dibrugarh","Darbhanga","Gaya","Bhagalpur","Kunwar","Barddhaman","Jadabpur","Kalyani","Cuttack","Barpeta","Jorhat","Kharagpur","Medinipur","Agartala","Saranga","Machilipatnam","Dhanbad","Silchar","Dumka","Kokrajhar","Bankura","Jalpaiguri","Durgapur","Kalinga","Palampur","Jammu","Dwarka","Faridkot","Udaipur","Raigarh","Hisar","Solan","Ajmer","Lala","Gurdaspur","Sultanpur","Jhansi","Vidisha","Jagdalpur","Dipas","Sawi","Etawah","Saharanpur","Ujjain","Kangra","Bhilai","Rohtak","Haryana","Ambala","Bareilly","Bhoj","Kapurthala Town","Sangrur","Pusa","Sagar","Rewa","Bhawan","Rampur","Bhadohi","Cuddalore","Khopoli","Bali","Bhiwandi","Vasai","Badlapur","Sambalpur","Raurkela","Brahmapur","Visnagar","Surendranagar","Ankleshwar","Dahanu","Silvassa","Jamnagar","Dhansura","Muzaffarpur","Wardha","Bodhan","Parappanangadi","Malappuram","Vizianagaram","Mavelikara","Pathanamthitta","Satara","Janjgir","Gold","Himatnagar","Bodinayakkanur","Gandhidham","Mahabalipuram","Nadiad","Virar","Bahadurgarh","Kaithal","Siliguri","Tiruppur","Ernakulam","Jalandhar","Barakpur","Kavaratti","Ratnagiri","Moga","Hansi","Sonipat","Bandra","Aizawl","Itanagar","Nagar","Ghatkopar","Chen","Powai","Bhimavaram","Bhongir","Medak","Karimnagar","Narsapur","Vijayawada","Markapur","Mancherial","Sangli","Moradabad","Alipur","Ichalkaranji","Devgarh","Yavatmal","Hinganghat","Madgaon","Verna","Katra","Bilaspur","Uttarkashi","Muktsar","Bhatinda","Pathankot","Khatauli","Vikasnagar","Kollam","Kovilpatti","Kovvur","Paloncha","Vasco","Alwar","Bijapur","Tinsukia","Ratlam","Kalka","Ladwa","Rajpura","Batala","Hoshiarpur","Katni","Bhilwara","Jhajjar","Lohaghat","Mohali","Dhuri","Thoothukudi","Sivakasi","Coonoor","Shimoga","Kayamkulam","Namakkal","Dharmapuri","Aluva","Antapur","Tanuku","Eluru","Balasore","Hingoli","Quepem","Assagao","Betim","Cuncolim","Ahmednagar","Goa","Caranzalem","Chopda","Petlad","Raipur","Villupuram","Shoranur","Dasua","Gonda","Yadgir","Palladam","Nuzvid","Kasaragod","Paonta Sahib","Sarangi","Anantapur","Kumar","Kaul","Panipat","Uppal","Teri","Tiruvalla","Jamal","Chakra","Narasaraopet","Dharamsala","Ranjan","Garhshankar","Haridwar","Chinchvad","Narela","Aurangabad","Sion","Kalamboli","Chittoor","Wellington","Nagapattinam","Karaikal","Pollachi","Thenkasi","Aranmula","Koni","Ariyalur","Ranippettai","Kundan","Lamba Harisingh","Surana","Ghana","Lanka","Kataria","Kotian","Khan","Salt Lake City","Bala","Vazhakulam","Paravur","Nabha","Ongole","Kaladi","Jajpur","Thenali","Mohala","Mylapore","Bank","Khammam","Ring","Maldah","Kavali","Andheri","Baddi","Mahesana","Nila","Gannavaram","Cumbum","Belapur","Phagwara","Rander","Siuri","Bulandshahr","Bilimora","Guindy","Pitampura","Baharampur","Dadri","Boisar","Shiv","Multi","Bhadath","Ulubari","Palghar","Puras","Sikka","Saha","Godhra","Dam Dam","Ekkattuthangal","Sahibabad","Kalol","Bardoli","Wai","Shirgaon","Nehra","Mangalagiri","Latur","Kottakkal","Rewari","Ponnani","Narayangaon","Hapur","Kalpetta","Khurja","Ramnagar","Neral","Sendhwa","Talegaon Dabhade","Kargil","Manali","Jalalabad","Palani","Sirkazhi","Krishnagiri","Hiriyur","Muzaffarnagar","Kashipur","Gampalagudem","Siruseri","Manjeri","Raniganj","Mahim","Bhusawal","Tirur","Sattur","Angul","Puri","Khurda","Dharavi","Ambur","Vashi","Arch","Colaba","Hosur","Kota","Hugli","Anantnag","Murshidabad","Jharsuguda","Jind","Neyveli","Vaniyambadi","Srikalahasti","Liluah","Pali","Bokaro","Sidhi","Asansol","Darjeeling","Kohima","Shahdara","Chandannagar","Nadgaon","Haripad","Sitapur","Vapi","Bambolim","Baidyabati","Connaught Place","Singtam","Shyamnagar","Sikar","Choolai","Mayapur","Puruliya","Habra","Kanchrapara","Goregaon","Tiptur","Kalpakkam","Serampore","Konnagar","Port Blair","Canning","Mahad","Alibag","Pimpri","Panchgani","Karjat","Vaikam","Mhow","Lakhimpur","Madhoganj","Kheri","Gudivada","Avanigadda","Nayagarh","Bemetara","Bhatapara","Ramgarh","Dhubri","Goshaingaon","Bellare","Puttur","Narnaul","Porbandar","Keshod","Dhrol","Kailaras","Morena","Deolali","Banda","Orai","Fatehpur","Mirzapur","Adilabad","Pithapuram","Ramavaram","Amalapuram","Champa","Ambikapur","Korba","Pehowa","Yamunanagar","Shahabad","Hamirpur","Gulbarga","Sagar","Bhadravati","Sirsi","Honavar","Siruguppa","Koppal","Gargoti","Kankauli","Jalna","Parbhani","Koraput","Barpali","Jaypur","Banswara","Tindivanam","Mettur","Srirangam","Deoria","Basti","Padrauna","Budaun","Bolpur","Gujrat","Balurghat","Binnaguri","Guruvayur","Chandauli","Madikeri","Piduguralla","Vinukonda","Berasia","Sultans Battery","Ramanagaram","Angadipuram","Mattanur","Gobichettipalayam","Banga","Sibsagar","Namrup","North Lakhimpur","Dhenkanal","Karanja","Cheyyar","Vandavasi","Arakkonam","Tiruvannamalai","Akividu","Tadepallegudem","Madanapalle","Puttur","Edavanna","Kodungallur","Marmagao","Sanquelim","Sakri","Shahdol","Satna","Thasra","Bundi","Kishangarh","Firozpur","Kot Isa Khan","Barnala","Sunam","Pithoragarh","Jaspur","Jhargram","Dimapur","Churachandpur","Raxaul","Motihari","Munger","Purnea","Mannargudi","Kumbakonam","Eral","Nagercoil","Kanniyakumari","Ramanathapuram","Sivaganga","Rajapalaiyam","Srivilliputhur","Suratgarh","Gohana","Sirsa","Fatehabad","Nurpur","Chamba","Khergam","Dindigul","Pudukkottai","Kaimganj","Tarn Taran","Khanna","Irinjalakuda","Sehore","Parra","Dicholi","Chicalim","Saligao","Changanacheri","Igatpuri","Sangamner","Ganganagar","Kanhangad","Chidambaram","Chittur","Nilambur","Arvi","Jalesar","Kasganj","Chandausi","Beawar","Bharatpur","Kathua","Chalisgaon","Karamsad","Peranampattu","Arani","Payyanur","Pattambi","Pattukkottai","Pakala","Vikarabad","Bhatkal","Rupnarayanpur","Kulti","Koch Bihar","Nongstoin","Budbud","Balangir","Kharar","Mukerian","Mansa","Punalur","Mandya","Nandyal","Dhone","Candolim","Aldona","Solim","Daman","Koothanallur","Sojat","Alanallur","Kagal","Jhunjhunun","Sirhind","Kurali","Khinwara","Machhiwara","Talwandi Sabo","Malpur","Dhar","Medarametla","Pileru","Yercaud","Ottappalam","Alangulam","Palus","Chiplun","Durg","Damoh","Ambarnath","Haveri","Mundgod","Mandvi","Behala","Fort","Bela","Balana","Odhan","Mawana","Firozabad","Bichpuri","Almora","Pauri","Azamgarh","Phaphamau","Nongpoh","Gangrar","Jhalawar","Nathdwara","Jaisalmer","Pushkar","Sirohi","Baroda","Ambah","Ambejogai","Ambad","Osmanabad","Betalbatim","Gangapur","Dindori","Yeola","Pandharpur","Neri","Umred","Patelguda","Patancheru","Singarayakonda","Peddapuram","Gadag","ChikmagalÅ«r","Chikodi","Amer","Chintamani","Tambaram","Palayam","Karamadai","Omalur","Kuzhithurai","Faizabad","Thirumangalam","Kodaikanal","Devipattinam","Dharapuram","Rudrapur","Talcher","Haldia","Karsiyang","Sandur","Bapatla","Shamsabad","Kandi","Ramapuram","Anchal","Trimbak","Calangute","Arpora","Khargone","Mandla","Kalan","Pachmarhi","Dhamtari","Kumhari","Aundh","Tala","Tuljapur","Botad","Sidhpur","Sanand","Nagwa","Mussoorie","Vadamadurai","Sholavandan","Pochampalli","Perundurai","Lalgudi","Ponneri","Mount Abu","Vadner","Shanti Grama","Nalagarh","Pahalgam","Dinanagar","Jatani","Ganga","Barmer","Hoshangabad","Khajuraho Group of Monuments","Betul","Sangola","Tirumala","Mirza Murad","Attur","Budha","Pala","Tonk","Koni","Rajpur","Shrigonda","Hazaribagh","Nagaur","Mandapeta","Nabadwip","Nandurbar","Nazira","Kasia","Bargarh","Kollegal","Shahkot","Jagraon","Channapatna","Madurantakam","Kamalpur","Ranaghat","Mundra","Mashobra","Rama","Chirala","Bawana","Dhaka","Mahal","Chitradurga","Mandsaur","Dewas","Sachin","Andra","Kalkaji Devi","Pilkhuwa","Mehra","Chhachhrauli","Samastipur","Bangaon","Ghatal","Jayanti","Belgharia","Kamat","Dhariwal","Morinda","Kottagudem","Suriapet","Mahesh","Sirwani","Kanakpura","Mahajan","Sodhi","Chand","Nagal","Hong","Raju","Tikamgarh","Parel","Jaynagar","Mill","Khambhat","Ballabgarh","Begusarai","Shahapur","Banka","Golaghat","Palwal","Kalra","Chandan","Maru","Nanda","Chopra","Kasal","Rana","Chetan","Charu","Arora","Chhabra","Bishnupur","Manu","Karimganj","Ellora Caves","Adwani","Amreli","Soni","Sarwar","Balu","Rawal","Darsi","Nandigama","Mathan","Panchal","Jha Jha","Hira","Manna","Amal","Kheda","Abdul","Roshan","Bhandari","Binavas","Hari","Nandi","Rajapur","Suman","Sakri","Khalapur","Dangi","Thiruthani","Bawan","Basu","Kosamba","Medchal","Kakdwip","Kamalpura","Dogadda","Charan","Basirhat","Nagari","Kangayam","Sopara","Nadia","Mahulia","Alipur","Hamirpur","Fatehgarh","Bagh","Naini","Karari","Ajabpur","Jaunpur","Iglas","Pantnagar","Dwarahat","Dasna","Mithapur","Bali","Nilokheri","Kolayat","Haripur","Dang","Chhota Udepur","Matar","Sukma","Guna","Dona Paula","Navelim","Vainguinim","Curchorem","Balaghat","Bhagwan","Vijapur","Sinnar","Mangaon","Hadadi","Bobbili","Yanam","Udaigiri","Balanagar","Kanigiri","Muddanuru","Panruti","Proddatur","Puliyur","Perambalur","Turaiyur","Tiruchchendur","Shadnagar","Markal","Sultan","Rayagada","Kaniyambadi","Vandalur","Sangam","Katoya","Gudur","Farakka","Baramati","Tohana"];
// arr = ["Palam,Delhi", "Agartala", "Agatti Island", "Agra", "Ahmedabad", "Aizwal", "Allahabad", "Amritsar", "Aurangabad", "Baghdogra", "Bangalore", "Bangalore", "Baroda", "Belgaum", "Belgaum", "Bhaunagar", "Bhopal", "Bhubaneswar", "Bhuj", "Calicut", "Chandigarh", "Coimbatore", "Cooch-behar", "Cuddapah", "Dehra Dun", "Safdarjung,Delhi", "Dimapur", "Durgapur", "Fursatganj", "Gaya", "Goa\/dabolim", "Gorakhpur", "Guwahati", "Gwalior", "Hubli", "Hyderabad", "Hyderabad", "Imphal", "Indore", "Jabalpur", "Jaipur", "Jammu", "Jamshedpur", "Jharsuguda", "Jodhpur", "Jorhat", "Kangra", "Kannur", "Khajuraho", "Kochi", "Kolhapur", "Kolkata", "Kota", "Kulu", "Leh", "Lilabari", "Lucknow", "Ludhiaha", "Madras", "Madurai", "Mangalore", "Mohanbari", "Mumbai", "Mumbai", "Mysore", "Nagpur", "Nainital", "Nanded", "Patina", "Pendicherry", "Porbandar", "Port Blair", "Pune", "Raipur", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Salem", "Shillong", "Shimla", "Shirdi", "Srinagar", "Surat", "Tezpur", "Thoise", "Tiruchirappalli", "Tirupeti", "Trivandrum", "Tuticorin", "Udaipur", "Unknown", "Unknown", "Varanasi", "Varanasi", "Vijayawada", "Vizagapatam"];
autocomplete(document.getElementById("myInputFirst"));
autocomplete(document.getElementById("myInputSecond"));

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
