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
		
		if( now.getTime() > sunSet.getTime() ){
			jQuery('#weather').css("background", "url(images/nightbg.png) no-repeat");
		} else if( now.getTime() < sunSet.getTime() ){
			jQuery('#weather').css("background", "url(images/daybg.png) no-repeat");
		}
		
		var nowTime = new Date();
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
    console.log(moonSpeed);
    $("#night").rotate(deg);
}

function loadWeather(lat, lng) {
	$.ajax({
	  dataType: "json",
	  url: 'https://api.openweathermap.org/data/2.5/weather?key=532bd129f349906ff2c75be74854684c&lat='+lat+'&lon='+lng,
	  success: function(data){
		  console.log(data);
	  }
	});
}