<?php  
$conn = pg_connect("host=localhost port=5432 dbname=fogprediction user=chaman password=chaman123");  

if (!$conn) {  
 echo "An error occurred.\n";  
 exit;  
}  

//$select = "SELECT date_time,visibility_miles,air_temperature_fahrenheit,relative_humidity_percentage,wind_speed_knots,wind_direction_degrees FROM public.meteorological_data where station = (select station_id from public.location where station_name='".$_GET['station']."') and date_time > '".$_GET['sdate']."' and date_time < '".$_GET['edate']."' order by date_time desc";
$select = "SELECT * FROM public.meteorological_data where station = (select station_id from public.location where station_name='".$_GET['station']."') and date_time > '".$_GET['sdate']."' and date_time < '".$_GET['edate']."' order by date_time desc";

$export = pg_query ( $conn, $select );
// echo "chaman";
header("Content-type: application/octet-stream");
header("Content-Disposition: attachment; filename=your_desired_name.xls");
header("Pragma: no-cache");
header("Expires: 0");
$fields = pg_num_fields ( $export );
for ( $i = 0; $i < $fields; $i++ )
{
    $header .= pg_field_name( $export , $i ) . "\t";
}

while( $row = pg_fetch_row( $export ) )
{
    $line = '';
    foreach( $row as $value )
    {                                            
        if ( ( !isset( $value ) ) || ( $value == "" ) )
        {
            $value = "\t";
        }
        else
        {
            $value = str_replace( '"' , '""' , $value );
            $value = '"' . $value . '"' . "\t";
        }
        $line .= $value;
    }
    $data .= trim( $line ) . "\n";
}
$data = str_replace( "\r" , "" , $data );

if ( $data == "" )
{
    $data = "\n(0) Records Found!\n";                        
}


print "$header\n$data";
// $val = "[";    
//     $arr = array();
//     if (pg_num_rows($result) > 0) {
//       while($row = pg_fetch_row($result)) {
        
//         $row[0] = strtotime($row[0]);
//         $arr[] = $row;
//         // echo $row;
//         if(strlen($val)!=1)
//           $val .= ',['.$row[0].','.$row[1].','.$row[2].','.$row[3].','.$row[4].','.$row[5].']';
//         else
//           $val .= '['.$row[0].','.$row[1].','.$row[2].','.$row[3].','.$row[4].','.$row[5].']';
//       }
//     }
//     $val .= ']';
    // $JSON = json_encode($arr);
    // echo $JSON;
    // echo $val;
?>  
