$(document).ready(function(){
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var now = new Date();
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    
    var sunTimes = SunCalc.getTimes(now, lat, long);
    var moonTimes = SunCalc.getMoonTimes(now, lat, long, false);
    
    var sunRise = sunTimes['sunrise'];
    var sunSet = sunTimes['sunset'];
    
    var moonRise = moonTimes['rise'];
    var moonset = moonTimes['set'];
	
    
    setInterval(function(){ 
		sunRotate(sunRise, sunSet);
		moonRotate(moonRise, moonset);
		
		var mmt = moment();
		var mmtStart = mmt.clone().startOf('day');
		var mmtEnd = mmt.clone().endOf('day');
		var startOfDay = new Date(mmtStart).getTime();
		var endOfDay = new Date(mmtEnd).getTime();
		
		if( now.getTime() > startOfDay && now.getTime() < sunRise.getTime() ){ //Now is between Midnight and Sunrise.
			jQuery('#weather').css("background", "url(images/nightbg.png) no-repeat");
		} else if( now.getTime < endOfDay && now.getTime() > sunSet.getTime() ){ //Now is between Sunset and 11:59pm
			jQuery('#weather').css("background", "url(images/nightbg.png) no-repeat");
		} else {
			jQuery('#weather').css("background", "url(images/daybg.png) no-repeat");
			jQuery('#weather').css("background-size", "cover");
		}
		
		jQuery('#tw_time').html(moment().format('h:mm:ss A'));
		
		
	}, 100);
	
    loadWeather(position.coords.latitude, position.coords.longitude); 
}

function sunRotate(rise, set) {
    var now = new Date();
    var currentMinute = now - rise;
    var daylight = (set  - rise) / 60000; // Minutes of Daylight
    var sunSpeed = (daylight * 2) / 360;
    var deg = (currentMinute / 60000) / sunSpeed;
    $("#day").rotate(deg);
}

function moonRotate(rise, set){
    var now = new Date();
    var currentMinute = now - rise;
    var moonlight = (set  - rise) / 60000; // Minutes of Moonlight
    var moonSpeed = Math.abs((moonlight * 2) / 360);
    var deg = (currentMinute / 60000) / moonSpeed;
    $("#night").rotate(deg);
}

function loadWeather(lat, lng) {
	//console.log('https://api.wunderground.com/api/6a6a5af963e13dd8/conditions/q/'+lat+','+lng+'.json'); 
	$.ajax({
	  dataType: "json",
	  url: 'https://api.wunderground.com/api/6a6a5af963e13dd8/conditions/q/'+lat+','+lng+'.json',
	  success: function(data){
		  console.log(data['current_observation']);
		  
		  var temp = data['current_observation']['temp_f'];
		  var weather = data['current_observation']['weather'];
		  var locName = data['current_observation']['observation_location']['full'];
		  
		  var html = "<h1>" + temp + "&deg;F</h1>";
		  html += "<h3>" + weather + "</h3>";
		  html += "<h6>" + locName + "</h6>";
		  
		  $('#tw_weather').html(html);
	  }
	});
}