#!/usr/bin/env node

var selectionObject = {
    "Delhi": {
        "Delhi": ["Delhi Airport"]
    },
    "Uttar Pradesh": {
        "Lucknow": ["Lucknow Airport"]
    }
}

// window.onload = function() {
//     // var stateSelect = document.getElementById("state-select");
//     // var citySelect = document.getElementById("city-select");
//     // var stationSelect = document.getElementById("station-select");

//     // for (var state in selectionObject) {
//     //     stateSelect.options[stateSelect.options.length] = new Option(state, state);
//     // }
//     // stateSelect.onchange = function() {
//     //     citySelect.length = 1; // remove all options bar first
//     //     stationSelect.length = 1; // remove all options bar first
//     //     if (this.selectedIndex < 1) return; // done
//     //     for (var city in selectionObject[this.value]) {
//     //         citySelect.options[citySelect.options.length] = new Option(city, city);
//     //     }
//     // }
//     // stateSelect.onchange(); // reset in case page is reloaded
//     // citySelect.onchange = function() {
//     //     stationSelect.length = 1; // remove all options bar first
//     //     if (this.selectedIndex < 1) return; // done
//     //     var station = selectionObject[stateSelect.value][this.value];
//     //     for (var i = 0; i < station.length; i++) {
//     //         stationSelect.options[stationSelect.options.length] = new Option(station[i], station[i]);
//     //     }
//     // }
//     // stationSelect.onchange = function(){
//     //     var x = document.getElementById("station-select").value;
//     //     if(x=="Delhi Airport")
//     //         document.getElementById("delhi-radio").click()
//     //     else if(x=="Lucknow Airport")
//     //         document.getElementById("lucknow-radio").click()
//     // }
// }
// var lat = 28.7041;
// var long = 77.1025;
function checkCity(element) {

    cityname = document.getElementById("myInput").value;
    a = document.getElementById("myInput").value;
    getPos(cityname);
    console.log("checkcity");
    if (a == "")
        return;
    cityid = 0;
    if (a == "Lucknow") {
        cityid = 2;
    } else if (a == "Delhi") {
        cityid = 1;
    }
    document.getElementById('cityname').innerHTML = "City :" + a;

    highChartFunc(cityname);
    chartmake(cityname);
}

function loaddata(element) {

    var cityname = element.getAttribute("getvalue");
    getPos(cityname);
    var cityid = element.getAttribute("cityid");
    if (cityid == '1')
        document.getElementById('cityname').innerHTML = "City : Delhi";
    else if (cityid == '2')
        document.getElementById('cityname').innerHTML = "City : Lucknow";


    highChartFunc(cityname);
    chartmake(cityname);
}

function highChartFunc(cityid) {
    document.getElementById('other-section').style["display"] = "none";
    // Highcharts.getJSON('value.php?id='+cityid, function(data) {
    Highcharts.getJSON('database.php?station=' + cityid, function(data) {
        var fogdata = [],
            temperaturedata = [],
            humiditydata = [],
            winddata = [],
            winddirectiondata = [],
            fogdata2 = [],
            dataLength = data.length,
            i = 0;
        for (i; i <= dataLength - 14; i += 1) {
            fogdata.push([
                data[i][0],
                data[i][1],
            ]);
            temperaturedata.push([
                data[i][0],
                data[i][2]
            ]);
            humiditydata.push([
                data[i][0],
                data[i][3],
            ]);
            winddata.push([
                data[i][0],
                data[i][4],
                data[i][5]
            ]);
            winddirectiondata.push([
                data[i][0],
                data[i][5]
            ]);
        }

        //new added
        for (i = dataLength - 14; i < dataLength; i += 1) {
            fogdata2.push([
                data[i][0],
                data[i][1],
            ]);
            temperaturedata.push([
                data[i][0],
                data[i][2]
            ]);
            humiditydata.push([
                data[i][0],
                data[i][3],
            ]);
            winddata.push([
                data[i][0],
                data[i][4],
                data[i][5]
            ]);
            winddirectiondata.push([
                data[i][0],
                data[i][5]
            ]);
        }

        document.getElementById('mapFog-section').style["display"] = "block";

        // document.getElementById('Map-section').style["display"] = "block";
        // document.getElementById('Fog-section').style["display"] = "block";
        document.getElementById('Temperature-section').style["display"] = "block";
        document.getElementById('Humidity-section').style["display"] = "block";
        document.getElementById('Wind-section').style["display"] = "block";

        fogFunction(cityid, fogdata, fogdata2)
        tempFunction(cityid, temperaturedata)
        humidityFunction(cityid, humiditydata)
        windFunction(cityid, winddata)
    });

    Highcharts.setOptions({
        time: {
            timezoneOffset: -11 * 60
        }
    });
}

function fogFunction(cityid, fogdata, fogdata2) {
    Highcharts.stockChart('Fog', {
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
            selected: 0
        },
        title: {
            text: 'Visibility Chart'
        },
        xAxis: {
            plotLines: [{
                color: '#FF0000', // Red
                width: 2,
                value: 1500478400000
            }]
        },
        yAxis: [{
            min: 0,
            max: 6,
            labels: {
                align: 'right',
                x: -5
            },
            title: {
                text: 'Visibility(in miles)',
                style: {
                    fontSize: "16px",
                    color: "red"
                }

            },
            top: '0%',
            height: '100%',
            offset: 10,
            lineWidth: 5,
            opposite: false,
            resize: {
                enabled: true
            }

        }],
        series: [{
                name: 'Fog',
                data: fogdata,
                type: 'line',
                tooltip: {
                    pointFormat: '<b>{point.y}</b>',
                    valueDecimals: 0
                },
                yAxis: 0,
                dataGrouping: {
                    approximation: 'average'
                }

            },
            {
                name: 'Fog_prediction',
                data: fogdata2,
                type: 'line',
                tooltip: {
                    pointFormat: '<b>{point.y}</b>',
                    valueDecimals: 0
                },
                yAxis: 0,
                color: '#FF0000',
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
    });
}

function tempFunction(cityid, temperaturedata) {
    Highcharts.stockChart('Temperature', {
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
            selected: 0
        },
        title: {
            text: 'Temperature Chart'
        },
        xAxis: {
            plotLines: [{
                color: '#FF0000', // Red
                width: 2,
                value: 1579478400000
            }]
        },
        yAxis: [{
                min: -10,
                max: 100,
                labels: {
                    align: 'right',
                    x: -5
                },
                title: {
                    text: 'Temperature (°F)',
                    style: {
                        fontSize: "16px",
                        color: "red"
                    }

                },
                top: '0%',
                height: '100%',
                offset: 10,
                lineWidth: 5,
                opposite: false,
                resize: {
                    enabled: true
                }
            }

        ],
        series: [

            {
                name: 'Temperature',
                data: temperaturedata,
                type: 'area',
                yAxis: 0,
                tooltip: {
                    pointFormat: '<b>{point.y}</b>°F',
                    valueDecimals: 0
                },
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
    });

};

function humidityFunction(cityid, humiditydata) {
    Highcharts.stockChart('Humidity', {
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
            selected: 0
        },
        title: {
            text: 'Humidity Chart'
        },
        xAxis: {
            plotLines: [{
                color: '#FF0000', // Red
                width: 2,
                value: 1579478400000
            }]
        },
        yAxis: [{
            min: 0,
            max: 100,
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
            height: '110%',
            offset: 10,
            lineWidth: 5,
            resize: {
                enabled: true
            },
            opposite: false
        }],
        series: [{
            name: 'Humidity',
            data: humiditydata,
            type: 'area',
            yAxis: 0,
            tooltip: {
                pointFormat: '<b>{point.y}</b>%',
                valueDecimals: 0
            },
            dataGrouping: {
                approximation: 'average'
            }
        }],
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                }
            }
        }
    });

}

function windFunction(cityid, winddata) {
    Highcharts.stockChart('Wind', {
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
            selected: 0
        },
        title: {
            text: 'Wind Chart'
        },
        xAxis: {
            plotLines: [{
                color: '#FF0000', // Red
                width: 2,
                value: 1579478400000
            }]
        },
        yAxis: [{
            min: 0,
            max: 10,
            labels: {
                align: 'right',
                x: -5
            },
            title: {
                text: 'Wind (knots)',
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
            name: 'Wind',
            data: winddata,
            type: 'area',
            yAxis: 0,
            tooltip: {
                pointFormat: '<b>{point.y}</b> ({point.z}°N)',
                valueDecimals: 0
            },
            dataGrouping: {
                approximation: 'average'
            },
            keys: ['x', 'y', 'z']
        }],
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ["viewFullscreen", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV", "downloadXLS"]
                }
            }
        }
    });

}
// arr = ["Bhandup","Mumbai","Visakhapatnam","Coimbatore","Delhi","Bangalore","Pune","Nagpur","Lucknow","Vadodara","Indore","Jalalpur","Bhopal","Kolkata","Kanpur","New Delhi","Faridabad","Rajkot","Ghaziabad","Chennai","Meerut","Agra","Jaipur","Jabalpur","Varanasi","Allahabad","Hyderabad","Noida","Howrah","Thane","Patiala","Chakan","Ahmedabad","Manipala","Mangalore","Panvel","Udupi","Rishikesh","Gurgaon","Mathura","Shahjahanpur","Bagpat","Sriperumbudur","Chandigarh","Ludhiana","Palakkad","Kalyan","Valsad","Ulhasnagar","Bhiwani","Shimla","Dehradun","Patna","Unnao","Tiruvallur","Kanchipuram","Jamshedpur","Gwalior","Karur","Erode","Gorakhpur","Ooty","Haldwani","Bikaner","Puducherry","Nalbari","Bellary","Vellore","Naraina","Mandi","Rupnagar","Jodhpur","Roorkee","Aligarh","Indraprast","Karnal","Tanda","Amritsar","Raipur","Pilani","Bilaspur","Srinagar","Guntur","Kakinada","Warangal","Tirumala - Tirupati","Nizamabad","Kadapa","Kuppam","Anantpur","Nalgonda","Potti","Nellore","Rajahmundry","Bagalkot","Kurnool","Secunderabad","Mahatma","Bharuch","Miraj","Nanded","Anand","Gandhinagar","Bhavnagar","Morvi","Aurangabad","Modasa","Patan","Solapur","Kolhapur","Junagadh","Akola","Bhuj","Karad","Jalgaon Jamod","Chandrapur","Maharaj","Dhule","Ponda","Dahod","Navsari","Panjim","Patel","Nashik","Amravati","Somnath","Ganpat","Karwar","Davangere","Raichur","Nagara","Kushalnagar","Hassan","Hubli","Bidar","Belgaum","Mysore","Dharwad","Kolar","TumkÅ«r","Tiruchi","Thiruvananthapuram","Kozhikode","Thrissur","Madurai","Thalassery","Kannur","Karaikudi","Thanjavur","Manor","Idukki","Thiruvarur","Alappuzha","Gandhigram","Kochi","Annamalainagar","Amet","Kottarakara","Kottayam","Tirunelveli","Mohan","Salem","Attingal","Chitra","Chengannur","Guwahati","Kalam","Ranchi","Shillong","Gangtok","Srikakulam","Tezpur","Bhubaneswar","Imphal","Sundargarh","Arunachal","Manipur","Bihar Sharif","Mandal","Dibrugarh","Darbhanga","Gaya","Bhagalpur","Kunwar","Barddhaman","Jadabpur","Kalyani","Cuttack","Barpeta","Jorhat","Kharagpur","Medinipur","Agartala","Saranga","Machilipatnam","Dhanbad","Silchar","Dumka","Kokrajhar","Bankura","Jalpaiguri","Durgapur","Kalinga","Palampur","Jammu","Dwarka","Faridkot","Udaipur","Raigarh","Hisar","Solan","Ajmer","Lala","Gurdaspur","Sultanpur","Jhansi","Vidisha","Jagdalpur","Dipas","Sawi","Etawah","Saharanpur","Ujjain","Kangra","Bhilai","Rohtak","Haryana","Ambala","Bareilly","Bhoj","Kapurthala Town","Sangrur","Pusa","Sagar","Rewa","Bhawan","Rampur","Bhadohi","Cuddalore","Khopoli","Bali","Bhiwandi","Vasai","Badlapur","Sambalpur","Raurkela","Brahmapur","Visnagar","Surendranagar","Ankleshwar","Dahanu","Silvassa","Jamnagar","Dhansura","Muzaffarpur","Wardha","Bodhan","Parappanangadi","Malappuram","Vizianagaram","Mavelikara","Pathanamthitta","Satara","Janjgir","Gold","Himatnagar","Bodinayakkanur","Gandhidham","Mahabalipuram","Nadiad","Virar","Bahadurgarh","Kaithal","Siliguri","Tiruppur","Ernakulam","Jalandhar","Barakpur","Kavaratti","Ratnagiri","Moga","Hansi","Sonipat","Bandra","Aizawl","Itanagar","Nagar","Ghatkopar","Chen","Powai","Bhimavaram","Bhongir","Medak","Karimnagar","Narsapur","Vijayawada","Markapur","Mancherial","Sangli","Moradabad","Alipur","Ichalkaranji","Devgarh","Yavatmal","Hinganghat","Madgaon","Verna","Katra","Bilaspur","Uttarkashi","Muktsar","Bhatinda","Pathankot","Khatauli","Vikasnagar","Kollam","Kovilpatti","Kovvur","Paloncha","Vasco","Alwar","Bijapur","Tinsukia","Ratlam","Kalka","Ladwa","Rajpura","Batala","Hoshiarpur","Katni","Bhilwara","Jhajjar","Lohaghat","Mohali","Dhuri","Thoothukudi","Sivakasi","Coonoor","Shimoga","Kayamkulam","Namakkal","Dharmapuri","Aluva","Antapur","Tanuku","Eluru","Balasore","Hingoli","Quepem","Assagao","Betim","Cuncolim","Ahmednagar","Goa","Caranzalem","Chopda","Petlad","Raipur","Villupuram","Shoranur","Dasua","Gonda","Yadgir","Palladam","Nuzvid","Kasaragod","Paonta Sahib","Sarangi","Anantapur","Kumar","Kaul","Panipat","Uppal","Teri","Tiruvalla","Jamal","Chakra","Narasaraopet","Dharamsala","Ranjan","Garhshankar","Haridwar","Chinchvad","Narela","Aurangabad","Sion","Kalamboli","Chittoor","Wellington","Nagapattinam","Karaikal","Pollachi","Thenkasi","Aranmula","Koni","Ariyalur","Ranippettai","Kundan","Lamba Harisingh","Surana","Ghana","Lanka","Kataria","Kotian","Khan","Salt Lake City","Bala","Vazhakulam","Paravur","Nabha","Ongole","Kaladi","Jajpur","Thenali","Mohala","Mylapore","Bank","Khammam","Ring","Maldah","Kavali","Andheri","Baddi","Mahesana","Nila","Gannavaram","Cumbum","Belapur","Phagwara","Rander","Siuri","Bulandshahr","Bilimora","Guindy","Pitampura","Baharampur","Dadri","Boisar","Shiv","Multi","Bhadath","Ulubari","Palghar","Puras","Sikka","Saha","Godhra","Dam Dam","Ekkattuthangal","Sahibabad","Kalol","Bardoli","Wai","Shirgaon","Nehra","Mangalagiri","Latur","Kottakkal","Rewari","Ponnani","Narayangaon","Hapur","Kalpetta","Khurja","Ramnagar","Neral","Sendhwa","Talegaon Dabhade","Kargil","Manali","Jalalabad","Palani","Sirkazhi","Krishnagiri","Hiriyur","Muzaffarnagar","Kashipur","Gampalagudem","Siruseri","Manjeri","Raniganj","Mahim","Bhusawal","Tirur","Sattur","Angul","Puri","Khurda","Dharavi","Ambur","Vashi","Arch","Colaba","Hosur","Kota","Hugli","Anantnag","Murshidabad","Jharsuguda","Jind","Neyveli","Vaniyambadi","Srikalahasti","Liluah","Pali","Bokaro","Sidhi","Asansol","Darjeeling","Kohima","Shahdara","Chandannagar","Nadgaon","Haripad","Sitapur","Vapi","Bambolim","Baidyabati","Connaught Place","Singtam","Shyamnagar","Sikar","Choolai","Mayapur","Puruliya","Habra","Kanchrapara","Goregaon","Tiptur","Kalpakkam","Serampore","Konnagar","Port Blair","Canning","Mahad","Alibag","Pimpri","Panchgani","Karjat","Vaikam","Mhow","Lakhimpur","Madhoganj","Kheri","Gudivada","Avanigadda","Nayagarh","Bemetara","Bhatapara","Ramgarh","Dhubri","Goshaingaon","Bellare","Puttur","Narnaul","Porbandar","Keshod","Dhrol","Kailaras","Morena","Deolali","Banda","Orai","Fatehpur","Mirzapur","Adilabad","Pithapuram","Ramavaram","Amalapuram","Champa","Ambikapur","Korba","Pehowa","Yamunanagar","Shahabad","Hamirpur","Gulbarga","Sagar","Bhadravati","Sirsi","Honavar","Siruguppa","Koppal","Gargoti","Kankauli","Jalna","Parbhani","Koraput","Barpali","Jaypur","Banswara","Tindivanam","Mettur","Srirangam","Deoria","Basti","Padrauna","Budaun","Bolpur","Gujrat","Balurghat","Binnaguri","Guruvayur","Chandauli","Madikeri","Piduguralla","Vinukonda","Berasia","Sultans Battery","Ramanagaram","Angadipuram","Mattanur","Gobichettipalayam","Banga","Sibsagar","Namrup","North Lakhimpur","Dhenkanal","Karanja","Cheyyar","Vandavasi","Arakkonam","Tiruvannamalai","Akividu","Tadepallegudem","Madanapalle","Puttur","Edavanna","Kodungallur","Marmagao","Sanquelim","Sakri","Shahdol","Satna","Thasra","Bundi","Kishangarh","Firozpur","Kot Isa Khan","Barnala","Sunam","Pithoragarh","Jaspur","Jhargram","Dimapur","Churachandpur","Raxaul","Motihari","Munger","Purnea","Mannargudi","Kumbakonam","Eral","Nagercoil","Kanniyakumari","Ramanathapuram","Sivaganga","Rajapalaiyam","Srivilliputhur","Suratgarh","Gohana","Sirsa","Fatehabad","Nurpur","Chamba","Khergam","Dindigul","Pudukkottai","Kaimganj","Tarn Taran","Khanna","Irinjalakuda","Sehore","Parra","Dicholi","Chicalim","Saligao","Changanacheri","Igatpuri","Sangamner","Ganganagar","Kanhangad","Chidambaram","Chittur","Nilambur","Arvi","Jalesar","Kasganj","Chandausi","Beawar","Bharatpur","Kathua","Chalisgaon","Karamsad","Peranampattu","Arani","Payyanur","Pattambi","Pattukkottai","Pakala","Vikarabad","Bhatkal","Rupnarayanpur","Kulti","Koch Bihar","Nongstoin","Budbud","Balangir","Kharar","Mukerian","Mansa","Punalur","Mandya","Nandyal","Dhone","Candolim","Aldona","Solim","Daman","Koothanallur","Sojat","Alanallur","Kagal","Jhunjhunun","Sirhind","Kurali","Khinwara","Machhiwara","Talwandi Sabo","Malpur","Dhar","Medarametla","Pileru","Yercaud","Ottappalam","Alangulam","Palus","Chiplun","Durg","Damoh","Ambarnath","Haveri","Mundgod","Mandvi","Behala","Fort","Bela","Balana","Odhan","Mawana","Firozabad","Bichpuri","Almora","Pauri","Azamgarh","Phaphamau","Nongpoh","Gangrar","Jhalawar","Nathdwara","Jaisalmer","Pushkar","Sirohi","Baroda","Ambah","Ambejogai","Ambad","Osmanabad","Betalbatim","Gangapur","Dindori","Yeola","Pandharpur","Neri","Umred","Patelguda","Patancheru","Singarayakonda","Peddapuram","Gadag","ChikmagalÅ«r","Chikodi","Amer","Chintamani","Tambaram","Palayam","Karamadai","Omalur","Kuzhithurai","Faizabad","Thirumangalam","Kodaikanal","Devipattinam","Dharapuram","Rudrapur","Talcher","Haldia","Karsiyang","Sandur","Bapatla","Shamsabad","Kandi","Ramapuram","Anchal","Trimbak","Calangute","Arpora","Khargone","Mandla","Kalan","Pachmarhi","Dhamtari","Kumhari","Aundh","Tala","Tuljapur","Botad","Sidhpur","Sanand","Nagwa","Mussoorie","Vadamadurai","Sholavandan","Pochampalli","Perundurai","Lalgudi","Ponneri","Mount Abu","Vadner","Shanti Grama","Nalagarh","Pahalgam","Dinanagar","Jatani","Ganga","Barmer","Hoshangabad","Khajuraho Group of Monuments","Betul","Sangola","Tirumala","Mirza Murad","Attur","Budha","Pala","Tonk","Koni","Rajpur","Shrigonda","Hazaribagh","Nagaur","Mandapeta","Nabadwip","Nandurbar","Nazira","Kasia","Bargarh","Kollegal","Shahkot","Jagraon","Channapatna","Madurantakam","Kamalpur","Ranaghat","Mundra","Mashobra","Rama","Chirala","Bawana","Dhaka","Mahal","Chitradurga","Mandsaur","Dewas","Sachin","Andra","Kalkaji Devi","Pilkhuwa","Mehra","Chhachhrauli","Samastipur","Bangaon","Ghatal","Jayanti","Belgharia","Kamat","Dhariwal","Morinda","Kottagudem","Suriapet","Mahesh","Sirwani","Kanakpura","Mahajan","Sodhi","Chand","Nagal","Hong","Raju","Tikamgarh","Parel","Jaynagar","Mill","Khambhat","Ballabgarh","Begusarai","Shahapur","Banka","Golaghat","Palwal","Kalra","Chandan","Maru","Nanda","Chopra","Kasal","Rana","Chetan","Charu","Arora","Chhabra","Bishnupur","Manu","Karimganj","Ellora Caves","Adwani","Amreli","Soni","Sarwar","Balu","Rawal","Darsi","Nandigama","Mathan","Panchal","Jha Jha","Hira","Manna","Amal","Kheda","Abdul","Roshan","Bhandari","Binavas","Hari","Nandi","Rajapur","Suman","Sakri","Khalapur","Dangi","Thiruthani","Bawan","Basu","Kosamba","Medchal","Kakdwip","Kamalpura","Dogadda","Charan","Basirhat","Nagari","Kangayam","Sopara","Nadia","Mahulia","Alipur","Hamirpur","Fatehgarh","Bagh","Naini","Karari","Ajabpur","Jaunpur","Iglas","Pantnagar","Dwarahat","Dasna","Mithapur","Bali","Nilokheri","Kolayat","Haripur","Dang","Chhota Udepur","Matar","Sukma","Guna","Dona Paula","Navelim","Vainguinim","Curchorem","Balaghat","Bhagwan","Vijapur","Sinnar","Mangaon","Hadadi","Bobbili","Yanam","Udaigiri","Balanagar","Kanigiri","Muddanuru","Panruti","Proddatur","Puliyur","Perambalur","Turaiyur","Tiruchchendur","Shadnagar","Markal","Sultan","Rayagada","Kaniyambadi","Vandalur","Sangam","Katoya","Gudur","Farakka","Baramati","Tohana"];
arr = ["Palam,Delhi", "Agartala", "Agatti Island", "Agra", "Ahmedabad", "Aizwal", "Allahabad", "Amritsar", "Aurangabad", "Baghdogra", "Bangalore", "Bangalore", "Baroda", "Belgaum", "Belgaum", "Bhaunagar", "Bhopal", "Bhubaneswar", "Bhuj", "Calicut", "Chandigarh", "Coimbatore", "Cooch-behar", "Cuddapah", "Dehra Dun", "Safdarjung,Delhi", "Dimapur", "Durgapur", "Fursatganj", "Gaya", "Goa\/dabolim", "Gorakhpur", "Guwahati", "Gwalior", "Hubli", "Hyderabad", "Hyderabad", "Imphal", "Indore", "Jabalpur", "Jaipur", "Jammu", "Jamshedpur", "Jharsuguda", "Jodhpur", "Jorhat", "Kangra", "Kannur", "Khajuraho", "Kochi", "Kolhapur", "Kolkata", "Kota", "Kulu", "Leh", "Lilabari", "Lucknow", "Ludhiaha", "Madras", "Madurai", "Mangalore", "Mohanbari", "Mumbai", "Mumbai", "Mysore", "Nagpur", "Nainital", "Nanded", "Patina", "Pendicherry", "Porbandar", "Port Blair", "Pune", "Raipur", "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Salem", "Shillong", "Shimla", "Shirdi", "Srinagar", "Surat", "Tezpur", "Thoise", "Tiruchirappalli", "Tirupeti", "Trivandrum", "Tuticorin", "Udaipur", "Unknown", "Unknown", "Varanasi", "Varanasi", "Vijayawada", "Vizagapatam"];
autocomplete(document.getElementById("myInput"));

function autocomplete(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    console.log("enter autocomplete");

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

function chartmake(cityname) {
    console.log(document.getElementById("latlong").value);
    var position = document.getElementById("latlong").value;
    console.log("makechart");
    var jsonObj = {
        "type": "map",
        // "pathToImages": "http://www.amcharts.com/lib/3/images/",
        "addClassNames": true,
        "fontSize": 15,
        "color": "#FFFFFF",
        "projection": "mercator",
        "backgroundAlpha": 1,
        "backgroundColor": "rgba(238, 249, 235,1)",
        "balloonText": cityname,
        "dataProvider": {
            "map": "indiaLow",
            "getAreasFromMap": true,
            "images": [{
                "selectable": true,
                "longitude": position.lng,
                "latitude": position.lat - 0.4300,
                "type": "circle",
                "labelPosition": "bottom",
                "color": "rgba(75,216,181,0.8)",
                "scale": 1,
                "rollOverScale": 1.5,
                "labelRollOverColor": "rgba(255,255,255,1)"
            }]
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
            // "buttonCornerRadius": 2  
        }
    };
    jsonObj.dataProvider.images[0].label = cityname;
    var chart = AmCharts.makeChart('map1', jsonObj);
}

function getPos(cityname) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("getpos")
            document.getElementById("latlong").value = JSON.parse(this.responseText).results[0].locations[0].latLng;
        }
    };
    xhttp.open("GET", "http://www.mapquestapi.com/geocoding/v1/address?key=ZobdG7AfsnApjess0GyWup5ml94qG4uA&location=" + cityname, false);
    xhttp.send();
    // document.getElementById("latlong").value= JSON.parse(xhttp.responseText).results[0].locations[0].latLng;
}

function downloadFile() {
    var sdate = document.getElementById("startDate").value;
    var edate = document.getElementById("endDate").value;
    var cName = document.getElementById("myInput").value;

    $.ajax({
        url: 'apis/download.php?station=' + cName + '&sdate=' + sdate + '&edate=' + edate,
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function(data) {

            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = cName + '.csv';
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    });

}
