function firstToLowerCase( str ) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function getDistanceFromLatLng(lat1, lng1, lat2, lng2){
    var lat1 = Math.radians(lat1);
    var lat2 = Math.radians(lat2);
    var R = 6371e3; // metres
    var dlat = Math.radians(lat2-lat1);
    var dlng = Math.radians(lng2-lng1);
    
    var a = Math.sin(dlat/2) * Math.sin(dlat/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dlng/2) * Math.sin(dlng/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = Math.round(R * c);
    
    return d;
}

function getHeadingFromLatLng(lat1, lng1, lat2, lng2){
    var lng1 = Math.radians(lng1);
    var lng2 = Math.radians(lng2);
    var lat1 = Math.radians(lat1);
    var lat2 = Math.radians(lat2);

    var y = Math.sin(lng2-lng1) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lng2-lng1);
    var cap12 = Math.round((Math.degrees(Math.atan2(y, x)) + 360) % 360);
    var cap21 = Math.round((cap12 + 180) % 360);
    
    return [cap12, cap21];
}
