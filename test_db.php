<?php
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");
if (!$conn) {
    echo "Connection error: " . pg_last_error();
} else {
    echo "Connected successfully!";
}
