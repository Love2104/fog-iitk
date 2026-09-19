document.addEventListener('DOMContentLoaded', () => {
    
    
  });
//   jQuery.noConflict();
// var jq = jQuery.noConflict();
// $(document).ready(function() {
 jQuery(document).ready(function ($) {
    // console.log($.validator.unobstrusive.parse('#cityform'))
    var epi_path;
    var api_path;
    var fog_path;
    var markers=Array();
    var cur_layer=null;
    //console.log(files)  
   /* var all_files=files.split('@@')
    var all_data=[]
    for(let i=0;i<all_files.length;i++){
        let x=all_files[i].split(';')
        if(x.length==2){
        console.log(x)
        all_data.push([x[1],x[0]])
        }
    }
    */
    // console.log(files)
    var all_data=files;
    //var files=files.split('@@')
    //console.log(JSON.parsefiles)
    /*for(let o=0;o<files.length;o+=1){
        let x=files[o].split('_')
        //console.log(x)
        
        if(x[x.length-1]=='alea'){
            api_path=files[o]
        }
        else if(x[x.length-1]=='epi'){
            epi_path=files[o]
        }
        else if(x.length==3){
            var fog_path=files[o]
            
            var date1=x[1].substring(6,)
            //console.log(date1)
            var time=parseInt(x[2])+530
            var min=time%100
            
            var hour=parseInt(time/100)
            if(min==60){
                hour+=1
                
                min='00'
            }
            if(hour>24){
                hour=hour-24
                let day=String(parseInt(date1.substring(0,2))+1)
                //console.log(day)
                date1=((day.length==1)?'0'+day:day)+date1.substring(2,)
            }
            hour=String(hour)
            //console.log(hour,min)
            var date2=date1.substring(0,2)+" "+date1.substring(2,5)+" "+date1.substring(5)
            //console.log(date2,hour,min)

        }
    }*/
        // Initialize form validation
    
    
        // Event listener for form submission
        
    
        // Function to trigger form validation
    // function validateLocation() {
    //     $("#cityform").valid(); // Trigger form validation
    // }
    
    var validator=$.noConflict(true)
    const wordInput = document.getElementById('city');
    // const wordList = document.getElementById('wordList');
    const wordContainer = document.getElementById('wordContainer');

    var selected_cities=[['Ahmedabad', 725, 746, 23.07724, 72.63465], ['Bhuj', 719, 667, 23.2862, 69.6719], ['Bhopal', 719, 870, 23.2875, 77.3374], ['Indore', 735, 830, 22.7218, 75.8011], ['Jabalpur', 722, 940, 23.2, 79.95], ['Rajkot', 747, 697, 22.3092, 70.7795], ['Udaipur', 681, 779, 24.6177, 73.8961], ['Baghdogra', 622, 1162, 26.633329999999997, 88.31667], ['Kolkata', 737, 1165, 22.65474, 88.44672], ['Gorakhpur', 618, 1030, 26.75, 83.36667], ['Gaya', 677, 1072, 24.744310000000002, 84.95118000000001], ['Patna', 652, 1076, 25.59132, 85.08799], ['Ranchi', 718, 1082, 23.31425, 85.32167], ['Agra', 606, 887, 27.155829999999998, 77.96089], ['Amritsar', 471, 805, 31.633329999999997, 74.86667], ['Varanasi', 656, 1017, 25.452360000000002, 82.85934], ['Chandigarh', 500, 856, 30.6766, 76.7893], ['Delhi Safdarjung', 564, 867, 28.5833, 77.2107], ['Dehra Dun', 515, 893, 30.1897, 78.1803], ['Delhi IGI Airport', 564, 865, 28.566670000000002, 77.11667], ['Jodhpur', 632, 756, 26.3, 73.0167], ['Jaipur', 616, 830, 26.82419, 75.81215999999999], ['Jaisalmer', 614, 699, 26.8887, 70.865], ['IIT Kanpur', 625, 947, 26.5123, 80.2329], ['Kota', 665, 831, 25.1602, 75.8456], ['Lucknow', 618, 965, 26.760590000000004, 80.88934], ['Nainital', 550, 927, 29.0334, 79.4737], ['Shimla', 488, 863, 31.0818, 77.068]]
    // Function to add a new word to the list
    const addWord = (word) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'wordItem';

        const wordText = document.createElement('span');
        wordText.textContent = word;
        wordText.className = 'wordText';
        wordItem.appendChild(wordText);

        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = 'x';
        deleteBtn.className = 'deleteBtn';
        deleteBtn.addEventListener('click', () => {
          wordItem.remove(); // Remove the word item when delete button is clicked
        });
        wordItem.appendChild(deleteBtn);

        wordContainer.insertBefore(wordItem,wordContainer.firstChild);
    };
    selected_cities.forEach(el => {
        addWord(el[0])
        
    });
    
    function get_row_col(city,lat=0,long=0){
    // Event listener for input change
        if(lat!=0 && long!=0 && city!=''){
            if(lat=='' || long==''){
                alert('Invalid Latitude & Longitude Input');
                return;
            }
            if ($.isNumeric(lat)) {
                lat = parseFloat(lat);
                
                // You can do whatever you want with the float value here
            } else {
                alert("Invalid Latitude. Please enter a valid float.");
            }
            if ($.isNumeric(long)) {
                long = parseFloat(long);
                
                // You can do whatever you want with the float value here
            } else {
                alert("Invalid Longitude. Please enter a valid float.");
            }
        }
        else{
            var inp=document.getElementById("city").value;
            if(inp==''){
                alert('Invalid City Input');
                return;
            }
        }
    }
    // Add custom method to check if city already exists
    $.validator.addMethod("uniqueCity", function(value, element) {
        // Convert value to lowercase for case-insensitive comparison
        for (let i = 0; i < selected_cities.length; i++) {
            let city = selected_cities[i][0].toLowerCase().trim(); // Get city name (0th element)
            console.log(city)
            if (city === newWord) {
                console.log(city)
                return false; // City already exists
            }
        }
         return true;
    }, "This city already exists. Please enter a different city.");

    $.validator.addMethod("uniqueLatLong", function(value, element) {
        // Convert value to lowercase for case-insensitive comparison

       return true;
    }, "This location already exists. Please enter a different location.");
    // $("#cityform").on("submit", function(event) {
    //     event.preventDefault(); // Prevent default form submission

    //     // Check if the form is valid
    //     // if ($("#cityform").valid()) {
    //     //     // Form is valid, perform custom action (e.g., AJAX request)
    //         alert("Form submitted successfully!");
    //     //     // Add your AJAX request code here
    //     // } else {
    //     //     // Form is invalid, display error messages and prevent submission
    //     //     return false;
    //     // }
    // });
    wordInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' ) {
        const newWord = wordInput.value.trim();
        if(newWord===''){
            cityError.textContent='Please enter valid city name'
            return 
        }
        for (let i = 0; i < selected_cities.length; i++) {
            let city = selected_cities[i][0].toLowerCase(); // Get city name (0th element)
            if (city === newWord) {
                console.log(city)
                cityError.textContent='The city already exists'; // City already exists
                return 
            }
        }

        // $("#cityform").validate({
        //     rules: {
        //         city: {
        //             required: function(element) {
        //                  console.log('in')
        //                 if(newWord === ''){
        //                     return false
        //                 }
        //                 return true;

        //                 // Check if entered city exists in predefinedCities array
                        
        //             },
        //             //uniqueCity:true,
        //         }
        //     },
        //     messages: {
        //         city: {
        //             required: "Please enter valid city name",
        //             uniqueCity: "This city already exists. Please enter a different city."
        //         }
        //     }
        // });
        // if ($("#cityform").valid()) {
        //     alert("Form is valid!");
        // } else {
        //     alert("Form is not valid. Please check the inputs.");
        // }
        addWord(newWord);
        wordInput.value = ''; // Clear input after adding the word
      }
    });
    // wordInput.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter') {
    //       e.preventDefault(); // Prevent default behavior (form submission)
    //     }
    //   });

      const latitudeInput = document.getElementById('lat');
      const longitudeInput = document.getElementById('long');
      
      const addLocation = () => {
        $("#cityform").validate({
            rules: {
                latitude: {
                    required: function(element) {
                         
                        if(latitudeInput.value === '' && longitudeInput.value===''){
                            return false
                        }
                         let enteredLat = $('#lat').val().trim();
                         let enteredLong=$('#long').val().trim();
                 
                         // Check if entered city exists in predefinedCities array
                         for (let i = 0; i < selected_cities.length; i++) {
                             let errorLat = Math.abs(enteredLat-i[3]); 
                             let errorLong = Math.abs(enteredLong-i[4]);
                             if (errorLat<0.01 && errorLong<0.01) {
                                 return false; // City already exists
                             }
                         }
                         return true;
                    },
                    number:function(element) {
                         
                        return $.isNumeric(latitudeInput.value) && $.isNumeric(longitudeInput.value);
                   },
                    uniqueLatLong:true,
                }
            },
            messages: {
                city: {
                    required: "Please enter valid city name",
                    number:"Please enter numeric values",
                    uniqueLatLong: "This location already exists. Please enter a different location."
                }
            }
        });
        if ($("#cityform").valid()) {
            alert("Form is valid!");
        } else {
            alert("Form is not valid. Please check the inputs.");
        }
    
        const latitude = parseFloat(latitudeInput.value);
        const longitude = parseFloat(longitudeInput.value);

        if (isNaN(latitude) || isNaN(longitude)) {
            if (isNaN(latitude)) {
              latitudeError.textContent = 'Please enter a valid latitude value.';
            }
            if (isNaN(longitude)) {
              longitudeError.textContent = 'Please enter a valid longitude value.';
            }
            return;
          }

        const location = `${latitude}, ${longitude}`;

        // Perform reverse geocoding using geopy
    //     const geocoder = new google.maps.Geocoder();

    //     geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
    //       if (status === google.maps.GeocoderStatus.OK) {
    //         const locationName = results[0].formatted_address;
            
    //         const locationItem = document.createElement('div');
    //         locationItem.className = 'locationItem';

    //         const locationText = document.createElement('span');
    //         locationText.textContent = locationName;
    //         locationText.className = 'locationText';
    //         locationItem.appendChild(locationText);

    //         const deleteBtn = document.createElement('span');
    //         deleteBtn.textContent = 'x';
    //         deleteBtn.className = 'deleteBtn';
    //         deleteBtn.addEventListener('click', () => {
    //           locationItem.remove(); // Remove the location item when delete button is clicked
    //         });
    //         locationItem.appendChild(deleteBtn);

    //         // Insert the new location item at the beginning of the wordContainer
    //         wordContainer.insertBefore(locationItem, wordContainer.firstChild);

    //         // Clear input fields after adding the location item
    //         latitudeInput.value = '';
    //         longitudeInput.value = '';
    //       } else {
    //         alert('Geocoding failed. Please try again.');
    //       }
        // });
      };

      // Add location when Enter key is pressed in latitude or longitude input
      latitudeInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          addLocation();
        }
      });
    //   latitudeInput.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter') {
    //       e.preventDefault(); // Prevent default behavior (form submission)
    //     }
    //   });

      longitudeInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          addLocation();
        }
      });
    //   longitudeInput.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter') {
    //       e.preventDefault(); // Prevent default behavior (form submission)
    //     }
    //   });
      var formInputs = document.querySelectorAll('#cityform input');
    //   console.log(formInputs)
      formInputs.forEach(function(input) {
        input.addEventListener('keypress', function(event) {
            // Check if Enter key is pressed (keyCode 13 or key 'Enter')
            if (event.keyCode === 13 || event.key === 'Enter') {
                // Prevent default behavior (form submission)
                event.preventDefault();
            }
        });
    });
    
    //L.mapbox.accessToken = 'pk.eyJ1IjoieWFzaC1mb2ciLCJhIjoiY2xtNHJ2ejdmMmVvMzNycDN6bjRsdjJ0NiJ9.UpTTnXM_BE9px7z4zQg8Dw'
    //var map1 = L.mapbox.map('map1').setView([23, 78], 5).addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-streets-v12'))
    //var overlay = L.imageOverlay('process/fog_output/fog70.png', [[-2,61.05], [38,99]])
    var southWest = L.latLng(4.0, 65.0);
    var northEast = L.latLng(38.0, 100.0);
    var indiaBounds = L.latLngBounds(southWest, northEast);

    var map1 = L.map('map1', {
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0,
        minZoom: 4
    }).setView([25, 80], 5);

// Add the Carto Voyager layer
    var india3Layer = L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_3181_1_2b8dc38358d829b5538ec9d0', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
        maxZoom: 19
    }).addTo(map1);
    /*var colorScale = chroma.scale(['white', 'black']).domain([0, 1]);
    var gradient = chroma.scale(['white', 'black']).domain([0, 1]);

    // Define intervals and their corresponding values
    var intervals = [0,0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

    // Calculate colors for each interval
    var colors = intervals.map(function(interval) {
        return gradient(interval).hex();
    });

    // Output colors for each interval
    console.log(colors);*/
// Interpolate values between the data points
    //var image_path=all_data[0][1]
    /*var latlngs = dataPoints.map(function(point) {
        return [point[0], point[1]];
    });*/
    /*var polyline = L.polyline(latlngs, {
        color: 'red' // Starting color
    }).addTo(map1);*/

    // Create a gradient color function based on the data values
    var gradient = chroma.scale(['black', 'white']).domain([0, 1]);
    //L.idwLayer(dataPoints, {opacity: 0.7,exp:2 }).addTo(map1);
    // Update the polyline color based on the data values
    /*dataPoints.forEach(function(point) {
        var color = gradient(point[2]).hex();
        //console.log(color)
        L.polyline([[point[0], point[1]]], { color: color }).addTo(map1);
    });*/
    /*var india3Layer = L.tileLayer.wms('https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms?service=WMS&request=GetMap&layers=india3&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A4326&bbox=44.4999999999765166,-9.9999999998705409,105.5000000000234905,45.4999999996179056', {
        layers: 'india3',
        format: 'image/png',
        transparent: true,
        crs: L.CRS.EPSG4326,
        attribution: '© Bhuvan',
        // Set the BBOX parameter
        //bbox: minx + ',' + miny + ',' + maxx + ',' + maxy
    }).addTo(map1);*/
    /*var india3Layer =   L.tileLayer('https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms', {
            maxZoom: 18, // You can adjust this value as needed
            tileSize:1024
        }).addTo(map1);*/
    var imgext=[[32.47422,67.48520] , [21.22717,90.83019 ]]
    var imageBounds = [[51.49, -0.12], [51.51, -0.06]]; 
    //var imgext=[[-9.9999999998705409,44.4999999999765166] , [45.4999999996179056,105.5000000000234905]]
    //var fs = require('fs');
    //var files = fs.readdirSync('prashad/26DEC2019_0200PNG/');
    function changeImage(arr){
        $('#dt').empty()
        $('#dt').append(" "+arr[0])
        var base64Data = arr[1];
        
        // Decode base64 data
        var imageBlob = atob(base64Data);
        var bytes = new Uint8Array(imageBlob.length);
        for (var i = 0; i < imageBlob.length; i++) {
            bytes[i] = imageBlob.charCodeAt(i);
        }
        var blob = new Blob([bytes.buffer], {type: 'image/png'});

        // Create image overlay from the blob
        var imageUrl = URL.createObjectURL(blob);
        // Example bounds, adjust as needed
        if(cur_layer !=null){

        
        map1.removeLayer(cur_layer)
        }
        cur_layer=L.imageOverlay(imageUrl, imgext).addTo(map1);
        var probs=arr[2];
        while (markers.length > 0) {
            x=markers.pop();
            map1.removeLayer(x);
        }
        probs.forEach(el => {
            // console.log(el)
            let prob=el[0].toFixed(1)
            let color=el[4].toFixed(2)
            var customIcon = L.divIcon({
                className: 'custom-icon', // class name for styling
                //style="background-color:rgb(`+col+`, `+col+`, `+col+`);"
                html: `<span class="fa-stack-3x " >
                <i class="material-icons fa-stack-2x" style="font-size:35px;color:rgb(`+color*255+`,`+(1-color)*255+`,`+0+`);">chat_bubble</i>

                <!--<i class="fas fa fa-chat fa-stack-2x " style="font-size:25px;color:#5e72e4;font-weight:900;"></i>-->
                <strong class="fa-stack-1x mt-1 ml-1  " style="font-size:15px;color:orange;opacity:0.75">`+prob+`</strong>
            </span>`,//'<i number="'+prob+'" class="fa fa-number" style="color:rgb('+col+', '+col+', '+col+');"></i>', // HTML content of the icon
                iconSize: [30, 30], // size of the icon
                iconAnchor: [15, 30] // point of the icon which will correspond to marker's location
            });
            markers.push(L.marker([el[1],el[2]], {icon: customIcon}).addTo(map1)
        .bindPopup(el[3]));
            
        });
    }
changeImage(all_data[0])
    
    function onMapClick(e) {
        $('#lat').val(e.latlng.lat)
        $('#long').val(e.latlng.lng);
    }

    map1.on('dblclick', onMapClick);
    var city_flag='city';
    $('input[name="inputSelection"]').change(function() {
        var selectedValue = $(this).val();
        if (selectedValue === 'input1') {
            $('#city').prop('disabled', false);
            $('#lat').prop('disabled', true);
            $('#long').prop('disabled', true);
            city_flag='city';

        } else {
            $('#city').prop('disabled', true);
            $('#lat').prop('disabled', false);
            $('#long').prop('disabled', false);
            city_flag='latlong';
        }
    });
    //var fog = L.imageOverlay(image_path,imgext)// [[-2,61.05], [38,99]])
    //var fog_pro = L.imageOverlay('prashad/26DEC2019_0200PNG/'+fog_path+'.png',imgext).setOpacity(0.5)// [[-2,61.05], [38,99]])
    //var insat = L.imageOverlay('prashad/BNN/output_image_insat.png',imgext).setOpacity(0.5)// [[-2,61.05], [38,99]])
    //var epi = L.imageOverlay('prashad/26DEC2019_0200PNG/'+epi_path+'.png',imgext).setOpacity(0.5)// [[-2,61.05], [38,99]])
    //var alea = L.imageOverlay('prashad/26DEC2019_0200PNG/'+api_path+'.png',imgext).setOpacity(0.5)// [[-2,61.05], [38,99]])

    //.addTo(map1)
    /*var layers={
        //Insat:overlay,
        Fog:fog_pro,
        //Insat:insat
    
    }*/
    function changeopa(lay,val){
        //console.log(lay)
        lay.setOpacity(val);
        document.getElementById("opacity").value=val
        document.getElementById("demo").innerHTML=val
        document.getElementById("legen").style.opacity = val
    }
    
    //layers.Insat.addTo(map1);
    function toggleLayerVisibility(overlay1) {
        //if (map1.hasLayer(overlay1)) {
            map1.removeLayer(prevlayer); // Hide the layer
        //} else {
            prevlayer=overlay1
            map1.addLayer(overlay1); // Show the layer
            changeopa(prevlayer,0.5)
            /*overlay1.setOpacity(0.5);
            document.getElementById("opacity").value=0.5
            document.getElementById("demo").innerHTML=0.5*/
        //}
    }
    /*var prevlayer=fog_pro;
    fog_pro.addTo(map1);
    changeopa(fog_pro,0.5)*/
    
    //var radios = document.forms["layersform"].elements["flexRadioDefault"];
    //console.log(radios)
    /*var radios=[["layer1",fog],["layer5",insat]]
    for(var i = 0, max = radios.length; i < max; i++) {*/
        /*radios[i].onclick = function() {
            if(i==0)
                toggleLayerVisibility(overlay1)
            if(i==radios.length-1)
                toggleLayerVisibility(insat)
        }*/
    function togglelegend(st){
        let whileg=document.getElementById("whileg")
        if(st=='cont')
            whileg.innerHTML=`<div class=" w-75" style=" justify-content: center;align-items: center;" >
                        <div class="rounded" style=" border: 2px solid; "><div class="color-legend w-100   " id="legen"></div></div>

                        <div class="legend-label">
                            <span>1(Fog)</span>    
                            <!--<span>Mid</span>-->
                            <span>0(No Fog)</span>
                        </div>
                    </div>`
        else if(st=='alea' || st=='epi')
        whileg.innerHTML=`<div class=" w-75" style=" justify-content: center;align-items: center;" >
            <div class="rounded" style=" border: 2px solid; "><div class="color-legend w-100   " id="legen"></div></div>

            <div class="legend-label">
                <span>0.5</span>    
                <!--<span>Mid</span>-->
                <span>0</span>
            </div>
        </div>`
        else 
        whileg.innerHTML=`<div class="legend">
                        <div class="row">
                        <div class="legend-item ml-4" >
                             <div class=" rounded" style=" border: 2px solid; "><div class="legend-color w-100 category-1" id="legen"></div></div>
                            <span>Fog</span>
                        </div>
                        <div class="legend-item ml-4 " >
                             <div class=" rounded" style=" border: 2px solid; "><div class="legend-color w-100 category-2" id="legen"></div></div>
                            <span>No Fog</span>
                        </div>
                        <!-- Add more legend items for additional categories as needed -->
                    </div>`

    }
   /* document.getElementById("layer1").addEventListener('click', function (event) {
        if (event.target && event.target.matches("input[type='radio']")) {
            // do something here ...
            togglelegend('disc')
            toggleLayerVisibility(fog)
            
        }
    });*/
    /*document.getElementById("layer2").addEventListener('click', function (event) {
        if (event.target && event.target.matches("input[type='radio']")) {
            // do something here ...
            togglelegend('cont')
            toggleLayerVisibility(fog_pro)
            
        }
    });
    document.getElementById("layer3").addEventListener('click', function (event) {
        if (event.target && event.target.matches("input[type='radio']")) {
            // do something here ...
            togglelegend('epi')
            toggleLayerVisibility(epi)
            
        }
    });
    document.getElementById("layer4").addEventListener('click', function (event) {
        if (event.target && event.target.matches("input[type='radio']")) {
            // do something here ...
            togglelegend('alea')
            toggleLayerVisibility(alea)
            
        }
    });*/
    /*document.getElementById("layer5").addEventListener('click', function (event) {
        if (event.target && event.target.matches("input[type='radio']")) {
            // do something here ...
            togglelegend('disc')
            toggleLayerVisibility(insat)
            
        }
    });*/
    var slider = document.getElementById("opacity");
    // var output = document.getElementById("demo");
    

    // Update the current slider value (each time you drag the slider handle)
   /* function updateOpacity() {
    var opacityValue = document.getElementById('opacitySlider').value;
    
}*/
    const playPauseButton = document.getElementById("playPauseButton");
    const playPauseIcon = document.getElementById("playPauseIcon");
    let interval;

    playPauseButton.addEventListener("click", function(event) {
        event.preventDefault(); 
    if (playPauseIcon.classList.contains("fa-play")) {
        playPauseIcon.classList.remove("fa-play");
        playPauseIcon.classList.add("fa-pause");
        interval = setInterval(function() {
        // if (parseInt(slider.value) < parseInt(slider.max)) {
            slider.value = (parseInt(slider.value)%10)+1;
            slider.dispatchEvent(new Event('input')); 
        // } else {
        //     clearInterval(interval);
        // }
        }, 3000);
    } else {
        playPauseIcon.classList.remove("fa-pause");
        playPauseIcon.classList.add("fa-play");
        clearInterval(interval);
    }
    });
    
    slider.oninput = function() {
        
       // console.log(this.value)
    /*prevlayer.setOpacity(this.value);*/
    // output.innerHTML = this.value;
    let itr=(10-this.value)
    //console.log(all_data[(10-this.value)])
    changeImage(all_data[itr])
    // var base64Data = all_data[itr][1];
    //     // console.log(all_data[itr][0])
    // // Decode base64 data
    // var imageBlob = atob(base64Data);
    // var bytes = new Uint8Array(imageBlob.length);
    // for (var i = 0; i < imageBlob.length; i++) {
    //     bytes[i] = imageBlob.charCodeAt(i);
    // }
    // var blob = new Blob([bytes.buffer], {type: 'image/png'});
    
    // // Create image overlay from the blob
    // var imageUrl = URL.createObjectURL(blob);
    // map1.removeLayer(cur_layer)
    // cur_layer=L.imageOverlay(imageUrl, imgext).addTo(map1);
    // $('#dt').empty()
    // $('#dt').append(" "+all_data[itr][0])
    // console.log(all_data)
    // var probs=all_data[itr][2];
    // while (markers.length > 0) {
    //     x=markers.pop();
    //     map1.removeLayer(x);
    // }
      
    // probs.forEach(el => {
    //     console.log(el)
    //     let prob=el[0].toFixed(1)
    //     let col=prob*255
    //     var customIcon = L.divIcon({
    //         className: 'custom-icon', // class name for styling
    //         //style="background-color:rgb(`+col+`, `+col+`, `+col+`);"
    //         html: `<span class="fa-stack-3x " >
    //         <i class="material-icons fa-stack-2x" style="font-size:25px;color:rgb(`+col+`,`+col+`,`+col+`);">chat_bubble</i>

    //         <!--<i class="fas fa fa-chat fa-stack-2x " style="font-size:25px;color:#5e72e4;font-weight:900;"></i>-->
    //         <strong class="fa-stack-1x  " style="font-size:10px;color:orange">`+prob+`</strong>
    //        </span>`,//'<i number="'+prob+'" class="fa fa-number" style="color:rgb('+col+', '+col+', '+col+');"></i>', // HTML content of the icon
    //         iconSize: [30, 30], // size of the icon
    //         iconAnchor: [15, 30] // point of the icon which will correspond to marker's location
    //     });
    //     markers.push(L.marker([el[1],el[2]], {icon: customIcon}).addTo(map1)
    // .bindPopup(el[3]));
        
    // });
    if(all_data[itr].length>3){
        $("#fogval").empty();
        $("#fogval").append("<u><b>Fog Probability</b></u>: "+all_data[itr][3].toFixed(3));
        $("#epi").empty();
        $("#epi").append("<u><b>Epistemic Uncertainty</b></u>: "+all_data[itr][4].toFixed(3));
        $("#alea").empty();
        $("#alea").append("<u><b> Aleatory Uncertainty</b></u>: "+all_data[itr][5].toFixed(3));
    }

    //changeopa(prevlayer,this.value)
    }
    // $( "#cityform" ).submit(function(event) {
    //     event.preventDefault();
    //     console.log(event.key)
    //     getloc();
    // });
    $(document).on({
        ajaxStart: function(){
            $("#page").LoadingOverlay("show");

        },
        ajaxStop: function(){
            $("#page").LoadingOverlay("hide");
        // document.getElementById('footr').style["display"] = "block";

        }    
    });

    
    function resetit(){
        $.ajax({
            url: "apis/findloc.php?address=default",
            success: function(result) {
     
                
                //var arr=result.split(";");
                $("#address").empty();
                $("#fogval").empty();
               // $('#imagediv').empty();
               // $('#imagediv').append('<img src="process/fog_output/Fog_for_website_default.jpg" class="w-75  mx-auto d-block map" id="fog">');
               $('#fogimage').attr("src","process/fog_output/Fog_for_website_default.jpg?"+ new Date().getTime());
            }
        });
    }   
    document.getElementById("city").value='Kanpur'
    function yesterday(){
        let today = new Date(); 
        today.setDate(today.getDate() - 1);
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const day = today.getDate().toString().padStart(2, '0');
        
        // Get time components and pad with leading zeros
        const hours = today.getHours().toString().padStart(2, '0');
        const minutes = today.getMinutes().toString().padStart(2, '0');
        const seconds = today.getSeconds().toString().padStart(2, '0');

    // Combine into the desired YYYY-MM-DD HH:mm:ss format
        return `${year}-${month}-${day} ${hours}:${minutes}:00`;
        
        // Use toISOString() to get the date in "YYYY-MM-DDTHH:mm:ss.sssZ" format (UTC)
        // and split it to get only the "YYYY-MM-DD" part.
       
    }
    function latest(){
        const now = new Date();
        var mon=(now.getMonth()+1<10)? '0'+(now.getMonth()+1) : now.getMonth()+1
        var date=(now.getDate()<10)? '0'+now.getDate() : now.getDate()
        var minite=(now.getMinutes()<10)? '0'+now.getMinutes() : now.getMinutes()
        var hour=(now.getHours()<10)? '0'+now.getHours() : now.getHours()
        var today=now.getFullYear()+'-'+mon+'-'+date//+'T'+hour+':'+minite;
        //now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        //document.getElementById('endDate').value = today;
        return today;
    }
    document.getElementById("startDate").value= latest() //'2024-02-27T00:00:00'
    // latest();
    var marker = null
    function getloc(){
        
        if(city_flag=='latlong'){
            var lat=$('#lat').val()
            var long=$('#long').val()
            if(lat=='' || long==''){
                alert('Invalid Latitude & Longitude Input');
                return;
            }
            if ($.isNumeric(lat)) {
                lat = parseFloat(lat);
                
                // You can do whatever you want with the float value here
            } else {
                alert("Invalid Latitude. Please enter a valid float.");
            }
            if ($.isNumeric(long)) {
                long = parseFloat(long);
                
                // You can do whatever you want with the float value here
            } else {
                alert("Invalid Longitude. Please enter a valid float.");
            }
        }
        else{
            var inp=document.getElementById("city").value;
            if(inp==''){
                alert('Invalid City Input');
                return;
            }
        }
        var sdate=document.getElementById("startDate").value;
        // var edate=document.getElementById("endDate").value;
        /*var geocoder = new google.maps.Geocoder();
        alert(inp);
        geocoder.geocode( { 'address': inp}, function(results, status) {
        alert(results);
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            alert(latitude);
            alert(longitude);
            } 
        }); 
        return;*/
        if(sdate=='' ){ //|| edate==''
            alert('Invalid Date Input');
            return;
        }
        sdate=new Date(sdate)
        sdate.setHours(sdate.getHours() - 5);
        sdate.setMinutes(sdate.getMinutes() - 30);
        var edate=new Date(sdate);
        
        edate.setDate(edate.getDate() + 1);
        edate = edate.getTime() / 1000;
        sdate = sdate.getTime() / 1000;
        $.ajax({
            url: "apis/files1.php",
            type: "POST",
            data: (city_flag=='latlong')?{  lat:lat, long:long, sdate:sdate, edate:edate, }:{ city: inp, sdate:sdate, edate:edate,},
            success: function(result) { 
                
                let dta=result.substring(12,result.length-1)

                let data=JSON.parse(dta)
                console.log(data.length)
                if(data.length>5)
                    all_data=data.slice(2)
                    
                else
                    all_data=[]
                let cur_timestamp=data[0];
                let addr=''
                if(data[1]!= 'null' && data[1].length>3){
                    if(data[1][3]==0){
                        addr='Not Found or Out of Study Range'
                    }
                    else{
                        if(data[1][0]!='null')
                            addr=data[1][0]
                        else
                            addr='Not Found or Out of Study Range'
                        
                        if(marker!=null)
                            map1.removeLayer(marker)
                        if(data[1][1]!='null' && data[1][2]!='null')
                            marker = L.marker([data[1][1], data[1][2]]).addTo(map1);
                    }
                    

                }
                else{
                    addr='Not Found or Out of Study Range'
                    if(marker!=null)
                        map1.removeLayer(marker)

                }
                $("#address").empty();
                if(city_flag=='latlong'){
                    if(addr=='Not Found or Out of Study Range'){
                        $("#address").append("<u>Latitude & Longitude out of study area</u> ")
                    }
                    else{
                        $("#address").append("<u><b>Latitude, Longitude</b></u>: "+ lat.toFixed(3)+", "+long.toFixed(3))
                    }
                }
                else{
                    $("#address").append("<u><b>Address</b></u>: "+addr)
                }
                $("#fogval").empty();
                $("#epi").empty();
                $("#alea").empty();
                for(let i=1;i<data.length;i++){
                    if(cur_timestamp==data[i][0]){
                        $('#dt').empty()
                        $('#dt').append(" "+data[i][0])
                        
                        if(data[i].length>2){
                            
                            $("#fogval").append("<u><b>Fog Probability</b></u>: "+data[i][3].toFixed(3));
                            
                            $("#epi").append("<u><b>Epistemic Uncertainty</b></u>: "+data[i][4].toFixed(3));
                            
                            $("#alea").append("<u><b> Aleatory Uncertainty</b></u>: "+data[i][5].toFixed(3));
                        }
                        // output.innerHTML = i;
                        slider.value=i;
                        //console.log(all_data[(10-this.value)])
                        changeImage(data[i])
                        // var base64Data = data[i][1];

                        // // Decode base64 data
                        // var imageBlob = atob(base64Data);
                        // var bytes = new Uint8Array(imageBlob.length);
                        // for (let o = 0; o < imageBlob.length; o++) {
                        //     bytes[o] = imageBlob.charCodeAt(o);
                        // }
                        // var blob = new Blob([bytes.buffer], {type: 'image/png'});

                        // // Create image overlay from the blob
                        // var imageUrl = URL.createObjectURL(blob);
                        // map1.removeLayer(cur_layer)
                        // cur_layer=L.imageOverlay(imageUrl, imgext).addTo(map1);
                        
                        break

                    }
                    
                }
                // if(arr[1]==0)
                //     kay='Fog Absent'
                // else if(arr[1]==1)
                //     kay='Fog Present'
                // else
                //     kay='No Result'
                //var arr=result.split(";");
                // document.getElementById("address").innerHTML="Address: "+arr[0];
                // document.getElementById("fogval").innerHTML="Fog Status: "+kay;
                // //$('#imagediv').empty(); 
                // //$('#imagediv').append('<img src="process/fog_output/Fog_for_website_'+inp+'.jpg" class="w-75  mx-auto d-block map" id="fog">');
                // $('#fogimage').attr("src","process/fog_output/Fog_for_website.jpg?"+ new Date().getTime());
               /* var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var inpu=arr[2].split(',');
                var x=0,y=0;
                for(var pos=0;pos<inpu.length;pos+=2){
                    x=parseInt(inpu[pos],10);
                    y=parseInt(inpu[pos+1],10);
                    var j=((x*canvas.width)+y)*4;
                    imageData.data[j]=imageData.data[j]^255;
                    imageData.data[j+1]=imageData.data[j+1]^0;
                    imageData.data[j+2]=imageData.data[j+2]^0;

                }
                context.putImageData(imageData, 0, 0);
                var pos=arr[1].split(" ");
                alert(pos);
                //pos[0]=parseInt(pos[0],10);
                //pos[1]=parseInt(pos[1],10);
                pos[0]=300;
                pos[1]=400;
                $('.circle').css('top', pos[0]); //or wherever you want it
                $('.circle').css('left', pos[1]);
               // var e=$();
                $('#canvas' ).append('<div class="circle" id="circle"></div>');*/
                /*fill = '<v:fill color="white" opacity="0" />';
                opacity = '<v:stroke opacity="10"/>';
                e=$('<v:oval name="'+inp+'" fillcolor="green"  style="zoom:1;margin:0;padding:0;display:block;position:absolute;left:'+(pos[0] - 100)+'px;top:'+(pos[1] - 100)+'px;width:200px;height:200px;"></v:oval>');
                //e.get(0).innerHTML = fill+opacity;
                $(canvas).append(e);*/

                /*document.getElementById("fogmap").innerHTML=`<area shape="circle" coords="`+ String(pos[0]) + `,` + String(pos[1]) + `,10"  style="background-color:red;">`
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var j=((pos[0]*canvas.width)+parseInt(pos[1]))*4;
                alert(j);
                  imageData.data[j]=imageData.data[j]^255;
                imageData.data[j+1]=imageData.data[j+1]^0;
                imageData.data[j+2]=imageData.data[j+2]^0;
                //imageData.data[j+3]=imageData.data[j+3]^255;
                
                context.putImageData(imageData, 0, 0);*/
            }
        });
    }
    $('#submitBtn').on('click', function (e) {
        e.preventDefault();
        getloc();
    });
    //}
    
    
/*var toggleButton = document.createElement('overlay-checkbox');
toggleButton.textContent = 'Toggle Layer Visibility';
toggleButton.addEventListener('click', toggleLayerVisibility);
toggleButton.addTo(map1);*/
  //L.control.layers(layers).addTo(map1); 
  //map1.on('idle', () => {
  /*var toggle = document.getElementById('overlay-checkbox');
    toggle.addEventListener('change', function () {
        toggleLayerVisibility(insat) 
        //var visibility = toggle.checked ? 'visible' : 'none';
        //L.setLayoutProperty('Insat1', 'visibility', visibility);
    });*/
  //})
    /*var range = document.getElementById('range');

            function clip() {
            var nw = map1.containerPointToLayerPoint([0, 0]),
                se = map1.containerPointToLayerPoint(map1.getSize()),
                clipX = nw.x + (se.x - nw.x) * range.value;

            overlay.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
            }

            range['oninput' in range ? 'oninput' : 'onchange'] = clip;
            map1.on('move', clip);
            clip();*/
        /*const map1 = new mapboxgl.Map({
            //accessToken:'pk.eyJ1IjoieWFzaC1mb2ciLCJhIjoiY2xtNHMxcXpmMDNicjNrbW0ybmI1dGF4aCJ9.qtGAYVH5VRjBE3AMBpVnOA',
            accessToken:'pk.eyJ1IjoieWFzaC1mb2ciLCJhIjoiY2xtNHJ2ejdmMmVvMzNycDN6bjRsdjJ0NiJ9.UpTTnXM_BE9px7z4zQg8Dw',
            container: 'map1',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [78.0,23.0],
            zoom: 4
            });
            map1.on('load', () => {
                map1.addLayer({id: 'INSAT-fog',

                    type: 'fill',
                    source:{
                        type: 'image',
                        url: "./process/fog_output/fog70.png",
                        coordinates: [
                       
                            [61.05,38.5],
                            [99,38.5],
                            [99,10],
                            [61.05,10]
                        ]
                    },
                    layout: {
                        visibility: 'visible'
                        },
                })
            })*/
            //[61.05,0.3, 99,38.5]
    // </script>
    // <script>
    //     /*var map = new ol.Map({
    //         target: 'map',
    //         layers: [
    //             new ol.layer.Tile({
    //                 title: 'OSM',
    //                 type: 'base',
    //                 source: new ol.source.OSM()
    //             })
    //         ],
            
    //         view: new ol.View({
    //             projection: 'EPSG:4326',
    //             center: [78.0,23.0],
    //             zoom: 5,
    //         })
    //       });*/
    //     var map = new ol.Map({
    //         target: 'map',
    //         layers: [
    //             new ol.layer.Tile({
    //                 title: 'OSM',
    //                 type: 'base',
    //                 source: new ol.source.OSM()
    //             })
    //         ],
            
    //         view: new ol.View({
    //             projection: 'EPSG:4326',
    //             center: [78.0,23.0],
    //             zoom: 5,
    //         })
    //       });
          
    //       var layerSwitcher = new ol.control.LayerSwitcher({
    //         activationMode: 'click',
    //         startActive: true,
    //         tipLabel: 'Layers', // Optional label for button
    //         groupSelectStyle: 'children', // Can be 'children' [default], 'group' or 'none'
    //         collapseTipLabel: 'Collapse layers',
    //     });
    //     const vectorSource1 = new ol.source.Vector({
    //           format: new ol.format.GeoJSON(),
    //       url: './assets/india_st.geojson'
    //         });
    //      /*loadshp({url: './assets/india_state.shp', encoding: 'utf-8'}, function(geojson) {
    //         const features = new ol.format.GeoJSON().readFeatures(
    //           geojson,
    //           { featureProjection: map.getView().getProjection() }
    //         );
    //         const vectorSource1 = new ol.source.Vector({
    //           features: features
    //         });
    //         /*map.addLayer(
    //           new ol.layer.Vector({
    //             source: vectorSource,
    //             style: featureStyle
    //           })
    //         );
    //         map.getView().fit(vectorSource.getExtent());
    //       }); */
        
    //      const imageExtent = [61.05,0.3, 99,38.5];
    //     // const imageExtent = [60.5,0, 99,38];
    //     var overlays = new ol.layer.Group({
    //         'title': 'Overlays',
    //         layers: [
    //         new ol.layer.Image({
    //             title: 'image',
    //             source: new ol.source.ImageStatic({
    //                 opacity: 1,
    //                 url: 'process/fog_output/fog70.png',
    //                 imageExtent: imageExtent,
    //                 projection: 'EPSG:4326',
    //             }),
    //         }),
    //         new ol.layer.Vector({
    //             //title: 'india_state',
    //             source: vectorSource1,
    //             style: new ol.style.Style({
    //                 fill: new ol.style.Stroke({
    //                     color: "transparent",
    //                 }),
    //                 stroke: new ol.style.Stroke({
    //                     color: "#000000",
    //                     width: 2,
    //                 }),
    //             }),
    //           }),
              
    //             //zIndex: 1,
            
    //  /*new ol.layer.Image({
    //   title: 'india_district',
    //  // extent: [-180, -90, -180, 90],
    //   source: new ol.source.ImageWMS({
    //     url: 'http://localhost:8080/geoserver/wms',
    //     params: {'LAYERS': 'india:india_dist'},
    //     ratio: 1,
    //     serverType: 'geoserver'
    //   })
    // }),
    // new ol.layer.Image({
    //   title: 'india_state',
    //  // extent: [-180, -90, -180, 90],
    //   source: new ol.source.ImageWMS({
    //     url: 'http://localhost:8080/geoserver/wms',
    //     params: {'LAYERS': 'india:india_state'},
    //     ratio: 1,
    //     serverType: 'geoserver'
    //   })
    // })*/
    
    // ]
    // });
    // /*const staticImageLayer = new ol.layer.ImageLayer({
    //     source: new ol.source.StaticImage({
    //         opacity: imageOpacity,
    //         url: 'process/fog_output/Fog_for_website_default.jpg',
    //         imageExtent: extent,
    //         projection: 'EPSG:4326',
    //     }),
    //     zIndex: 200,
    // });*/
    // map.addLayer(overlays);
    // map.addControl(layerSwitcher);
    //     //layerSwitcher.renderPanel();
    //     var canvas;
    //     var context;
        
    })     
