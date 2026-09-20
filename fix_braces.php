<?php
$content = file_get_contents("contact_us.php");
// Let's count { and } in PHP blocks
$tokens = token_get_all($content);
$open = 0;
foreach($tokens as $t) {
    if (is_string($t)) {
        if ($t === '{') $open++;
        if ($t === '}') $open--;
    }
}
echo "Net braces: $open\n";
