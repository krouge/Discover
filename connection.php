<?php
$conn_string = "host=localhost port=5432 dbname=osm_vaud user=postgres password=postgres connect_timeout=1";
$conn = pg_connect($conn_string);