<style>
  html, body, #container {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  body{
    padding-top: 50px;
  }
  #map {
    width: auto;
    height: 100%;
  }
  #pageContainer{
    height: 100%;
    width: 100%;
    padding-right: 0px;
    padding-left: 0px;
  }
  @media print {
    .leaflet-control-container {
      display: none !important;
    }
  }
</style>

<div id="map" class="zoneTable"></div>

<?php
  //include_file('desktop', 'map', 'js');
?>
