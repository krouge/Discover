<?php

$conn_string = "host=192.168.2.130 port=5432 dbname=discover user=postgres password=postgres connect_timeout=1";
$conn = pg_connect($conn_string);