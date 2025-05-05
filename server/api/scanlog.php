<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "inventory_db");

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $mysqli->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $barcode = $input['barcode'] ?? '';
    $timestamp = $input['timestamp'] ?? date("Y-m-d H:i:s");

    if ($barcode) {
        $stmt = $mysqli->prepare("INSERT INTO scan_log (barcode, timestamp) VALUES (?, ?)");
        $stmt->bind_param("ss", $barcode, $timestamp);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["status" => "logged"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Insert failed"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Barcode is required"]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $mysqli->query("SELECT * FROM scan_log ORDER BY id DESC");
    $logs = [];

    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }

    echo json_encode($logs);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
