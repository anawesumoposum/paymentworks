function getRails() {
    $.ajax({
        url: "https://api-v3.mbta.com/routes?filter[type]=0,1",
        success: function(response){
            if(localStorage.getItem('rails')) { //if there's stuff in storage
                if( JSON.parse( localStorage.getItem('rails') ) != response.data ) {    // if cache is outdated
                    $("#train_table tbody tr").remove();    //clear table
                    loadTrainTable(response.data);               //reload table
                    localStorage.setItem('rails', JSON.stringify(response.data));   //update cache
                }
            } else {
                loadTrainTable(response.data);       //load table
                localStorage.setItem('rails', JSON.stringify(response.data));       //update cache
            }
        }, 
        error: function(xhr, status, err) { //something went horribly wrong!
            console.log(status);
            alert("Something went wrong with the request. Is your wifi on?");
            if(err) console.log(err);
        }
    });
}


function reqStops(arg) {
    let param = arg.currentTarget.childNodes[0].innerHTML;  //get ID
    $("#selected_route").html("Displaying stops for "+param);
    
    $.ajax({
        url: "https://api-v3.mbta.com/stops?include=route&filter[route]=" + param,
        success: function(response){
            $("#stops_table tbody tr").remove();    //clear table
            loadStopsTable(response.data);
        },
        error: function(xhr, status, err) { //something went horribly wrong!
            console.log(status);
            alert("Something went wrong with the request. Is your wifi on?");
            if(err) console.log(err);
        } 
    });
}


function loadTrainTable(data) {
    let table = document.getElementById("train_table_body");
    for(i = 0; i < data.length; i++) {
        let row = table.insertRow(0);
        let idCell = row.insertCell(0);
        let nameCell = row.insertCell(1);
        idCell.innerHTML = data[i].id;
        nameCell.innerHTML = data[i].attributes.long_name;
    }
}


function loadStopsTable(data) {
    let table = document.getElementById("stops_body");
    for(i = 0; i < data.length; i++) {
        let row = table.insertRow(0);
        let nameCell = row.insertCell(0);
        let addressCell = row.insertCell(1);
        nameCell.innerHTML = data[i].attributes.name;
        addressCell.innerHTML = data[i].attributes.address;
    }
}


$(document).ready(function(){
    if(localStorage.getItem('rails')) { //persistent cache through browser close
        loadTrainTable( JSON.parse( localStorage.getItem('rails') ) );
    }
    $("#test-btn").click(function(){    //update subway lines
        getRails();
    });
    $("#train_table").on("click", "tr", reqStops);  //if tr click, get ID and fire request to get stops
});