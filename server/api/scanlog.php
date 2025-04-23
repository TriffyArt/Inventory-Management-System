<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "inventory_db");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $barcode = $input['barcode'];
    $timestamp = $input['timestamp'];
    $stmt = $mysqli->prepare("INSERT INTO scan_log (barcode, timestamp) VALUES (?, ?)");
    $stmt->bind_param("ss", $barcode, $timestamp);
    $stmt->execute();
    echo json_encode(["status" => "logged"]);
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $mysqli->query("SELECT * FROM scan_log ORDER BY id DESC");
    $logs = [];
    while ($row = $result->fetch_assoc()) $logs[] = $row;
    echo json_encode($logs);
}
?>
