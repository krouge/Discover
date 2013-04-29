<?php
$conn_string = "host=192.168.142.139 port=5432 dbname=osm_vaud user=postgres password=postgres connect_timeout=1";
$conn = pg_connect($conn_string);