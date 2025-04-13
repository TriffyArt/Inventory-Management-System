<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "inventory_db");

if ($mysqli->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed: " . $mysqli->connect_error]);
  exit;
}

switch ($_SERVER['REQUEST_METHOD']) {
  case 'GET':
    $res = $mysqli->query("SELECT * FROM products");
    $data = [];
    while ($row = $res->fetch_assoc()) $data[] = $row;
    echo json_encode($data);
    break;

  case 'POST':
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['name'], $input['category'], $input['stock'], $input['warehouse'], $input['barcode'])) {
      echo json_encode(["error" => "Missing one or more required fields"]);
      exit;
    }

    if (isset($input['id'])) {
      // ✅ Update existing product
      $stmt = $mysqli->prepare("UPDATE products SET name = ?, category = ?, stock = ?, warehouse = ?, barcode = ? WHERE id = ?");
      $stmt->bind_param("ssissi", $input['name'], $input['category'], $input['stock'], $input['warehouse'], $input['barcode'], $input['id']);
      $stmt->execute();
      echo json_encode(["status" => "updated"]);
    } else {
      // ✅ Insert new product
      $stmt = $mysqli->prepare("INSERT INTO products (name, category, stock, warehouse, barcode) VALUES (?, ?, ?, ?, ?)");
      $stmt->bind_param("ssiss", $input['name'], $input['category'], $input['stock'], $input['warehouse'], $input['barcode']);
      $stmt->execute();
      echo json_encode(["status" => "created"]);
    }
    break;

  case 'DELETE':
    $id = basename($_SERVER['REQUEST_URI']);
    if (!is_numeric($id)) {
      echo json_encode(["error" => "Invalid product ID"]);
      exit;
    }
    $stmt = $mysqli->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["status" => "deleted"]);
    break;

  default:
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    break;
}
?>
