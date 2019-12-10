<?php

$error = '';
$width = $_GET['width'] ?? null;
$height = $_GET['height'] ?? null;
$n = $_GET['n'] ?? null;
$T = $_GET['T'] ?? null;
chdir('..');
if ($width > 0 && $height > 0 && $n && $T) {
    $a = 0;
    $b = $a + $width;
    $c = 0;
    $d = $c + $height;
    $outputDir = "output/".generate_random_string();
    if (!file_exists($outputDir)) {
        mkdir($outputDir);
    }
    $output = shell_exec("Rscript run.R $a $b $c $d $n $T 1 $outputDir");
    preg_match("/Pressure:(\d+)/", $output, $matches);
    $output = $matches[1];
} else {
    $error = 'Not enough params';
}

$output = $error ? $error : $output;
header('Content-Type: application/json');
echo json_encode([
  'status' => $error ? 'error' : 'success',
  'output' => $output,
  'files' => $error ? [] : array_diff(scandir($outputDir), array('.', '..')),
  'output_dir' => $outputDir,
  'width' => $width,
  'height' => $height,
  'n' => $n,
  'T' => $T
]);

function generate_random_string($length = 16) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
