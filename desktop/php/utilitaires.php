<div class="panel panel-primary">
  	<div class="panel-heading">Boussolle</div>
  	<div class="panel-body">
	    <p id="compassStatus">Orientation: 0°</p>
	    (non fonctionnel pour le moment: nécessite HTTPS)
		<script>
		/*
		window.setTimeout(function () {
		    var dir = 0,
		        ref = 0;

		    if ('ondeviceorientation' in window) {

		        window.addEventListener('deviceorientation', function(e) {
		            var direction, delta, heading;

		            if (typeof e.webkitCompassHeading !== 'undefined') {
		                direction = e.webkitCompassHeading;
		                if (typeof window.orientation !== 'undefined') {
		                    direction += window.orientation;
		                }
		            } else {
		                // http://dev.w3.org/geo/api/spec-source-orientation.html#deviceorientation
		                direction = 360 - e.alpha;
		            }

		            delta = Math.round(direction) - ref;
		            ref = Math.round(direction);
		            if (delta < -180)
		                delta += 360;
		            if (delta > 180)
		                delta -= 360;
		            dir += delta;

		            heading = direction;
		            while (heading >= 360) {
		                heading -= 360;
		            }
		            while (heading < 0) {
		                heading += 360;
		            }
		            heading = Math.round(heading);
		            document.getElementById('compassStatus').textContent = 'Orientation: ' + heading + '\u00b0';
		        });

		        // window.setInterval(function() {
		        //    var angle = -dir;
		        //    document.getElementById('compass').style.webkitTransform = 'rotate(' + angle + 'deg)';
		        //}, 100);
				
		        //document.getElementById('compass').style.width = Math.min(screen.width, screen.height) + 'px';
		    	
		    } else {
		        document.getElementById('compassStatus').textContent = 'Sorry! The browser does not support Device Orientation API.';
		        document.getElementById('compassStatus').style.position = 'absolute';
		        document.getElementById('compassStatus').style.width = '100%';
		        document.getElementById('compassStatus').style.top = '50%';
		    }
		}, 150);
*/
		</script>
	</div>
</div>