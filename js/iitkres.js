$(document).ready(function(){
    sdate = document.getElementById("sdate");
    edate = document.getElementById("edate");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    sdate.value = today
    edate.value = today
    console.log($(".datepicker").value)
});
function findResponse() {

    cityname = document.getElementById("myInput").value;
    a = document.getElementById("myInput").value;
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
}