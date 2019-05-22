var map;

function initMap() {

  //geocoder = new google.maps.Geocoder();

  //Instantiate the map and set the center and zoom distance
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 40.4403, lng: -99.3698},
    //JSON to change map style to less roads
    styles:[{
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
      }, {
      "featureType": "poi.business",
      "stylers": [{
        "visibility": "off"
      }]
      }, {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
      }, {
      "featureType": "road.arterial",
      "stylers": [{
        "visibility": "off"
      }]
      }, {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
      }, {
      "featureType": "road.local",
      "stylers": [{
        "visibility": "off"
      }]
      }, {
      "featureType": "transit",
      "stylers": [{
        "visibility": "off"
      }]
    }]
  });

  //Initialize heatmap
  initHeatMap();
  
}

//google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(drawChart);

/* function drawChart(){
  var data = google.visualization.arrayToDataTable([
  ['Task', 'Hours per Day'],
  ['NA MFG', 25],
  ['NA RTL', 2],
  ['TV', 4],
  ['Gym', 2],
  ['Sleep', 8]
  ]);

  var options = {'title':'My Average Day', 'width':550, 'height':400};

  var chart = new google.visualization.PieChart(document.getElementById('barChart'));
  chart.draw(data,options);
} */


function readEmployeeFile(e){
  var file = e.target.files[0];
  //Check selected?
  if(!file){
      return;
  }
  //Open stream
  var reader = new FileReader();

  reader.onload = function(e){
    var allText = e.target.result;
        
    //Split the csv into lines and store in an array
    var allTextLines = allText.split(/\r\n|\n/);
        
    //Arrays for individual
    var employees = [];
        
    //Split the lines into individual data and store in parallel arrays
    //If I want to include headers in input file start the loop at 1
    for (var i=0; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
        
      //Put the split data into an employee object
      tmpEmployee = { 
        Name: data[0],
        Address: data[1]+ ", "+ data[2],
        LatLng: new google.maps.LatLng(data[3], data[4]
      )}

      //Add employee object to array
      employees.push(tmpEmployee);

    }

    placeMarkers(employees);

    //Print for testing
    //displayContents(employees[0].Name, employees[0].Address, employees[0].LatLng);
        
  }
  reader.readAsText(file);

}


function readAccountfile(e){
  var file = e.target.files[0];
  //Check selected?
  if(!file){
      return;
  }
  //Open stream
  var reader = new FileReader();

  reader.onload = function(e){
    var allText = e.target.result;
        
    //Split the csv into lines and store in an array
    var allTextLines = allText.split(/\r\n|\n/);
        
    //Arrays for individual
    var accounts = [];


    //Split the lines into individual data and store in parallel arrays
    //If I want to include headers in input file start the loop at 1
    for (var i=0; i<5; i++) {
      var data = allTextLines[i].split(',');
      
      tmpAccount = {
        //Name: data[0],
        Address: data[0]+ ", "+ data[1],
        LatLng: new google.maps.LatLng(data[2], data[3]),
        Industry: data[4],
        Theater: data[5]
      }

      //The test works but it acts like the counts are undefined, I DONT UDNERSTANDSDASDWEA
      if(tmpAccount.Theater === "NA MFG"){
        mfgAccountCount += 1;
      }                
      else if(tmpAccount.Theater == 'NA RTL'){
        rtlAccountCount++;
      }
      //Add to array
      //accounts.push(tmpAccount);
    }
    //displayContents(accounts[8].Theater);
    //Create a tmpArray to store the lat/lng values from the accounts to pass to heatmap
    var tmpArray = [];
    //Iterate through loop
    for (var i = 0; i < accounts.length; i++){
      //Store value in a tmp var
      var element = accounts[i].LatLng;
      //Add it to the array
      tmpArray.push(element);
    }
    //Pass the separated lat/lng to array
    heatMap.setData(tmpArray);

  }
  reader.readAsText(file);
  //drawChart();
  //displayContents(accounts[5].Industry,accounts[4].Address);
}

/*         function testingCount(count){
  var element = document.getElementById('countTest');
  element.textContent = count;
} */

//Initialize heatmap layer and load
function initHeatMap(){
  heatMap = new google.maps.visualization.HeatmapLayer({
    map: map,
    radius: 6,
  })
}

//Hard Coded testdata


//Function to place markers for employees from file
function placeMarkers(employeeArray){
  //Loop through all employees
  for (var i = 0; i < employeeArray.length; i++){
    
    //Make a new markery
    marker = new google.maps.Marker({
      map: map,
      position: employeeArray[i].LatLng,
      //Edit this line to add any kind of employee info to the line
      title: `${employeeArray[i].Name}\n${employeeArray[i].Address}`
    })

    marker.setMap(map);
  }
}
       
/*        Function to geocode  
  function codeAdress(geocoder, resultsMap) {
    var address = 'Tulsa, OK';
    var myEmployee = {name: 'John Joe', address: address};

    geocoder.geocode( { 'address': myEmployee.address }, function(results, status) {

        var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location,
            title: myEmployee.name
        });
        
    });
} */

//Employee constructor
function Employee(name, address, latlng){
  this.Name = name;
  this.Address = address;
  this.LatLng = latlng;
}

//Account constructor
function Account(name, address, latLng, industry, theater){
  this.Name = name,
  this.Address = address,
  this.LatLng = latLng,
  this.Industry = industry,
  this.Theater = theater
}

//Test method to make sure data is coming in properly
function displayContents(name,address,latlng){
  var element = document.getElementById('file-content');
  element.textContent = name+address+latlng;
}

document.getElementById('employee-input').addEventListener('change',readEmployeeFile,false);
document.getElementById('account-input').addEventListener('change',readAccountfile,false);



