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

// Handle preflight request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'display':
        displayProducts();
        break;
    case 'low':
        displayLowStock();
        break;
    case 'delete':
        deleteProduct();
        break;
    case 'add':
        addProduct();
        break;
    case 'update':
        updateProduct();
        break;
    case 'barcode':
        getProductByBarcode();
        break;
    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}

function displayProducts() {
    global $mysqli;
    $res = $mysqli->query("SELECT * FROM products");
    $data = [];
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

function displayLowStock() {
    global $mysqli;
    $res = $mysqli->query("SELECT * FROM products WHERE stock < 5");
    $data = [];
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

function deleteProduct() {
    global $mysqli;
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        echo json_encode(["error" => "Invalid product ID"]);
        exit;
    }
    $id = $_GET['id'];
    $stmt = $mysqli->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["status" => "deleted"]);
}

function addProduct() {
    global $mysqli;
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['name'], $input['category'], $input['stock'], $input['warehouse'], $input['barcode'])) {
        echo json_encode(["error" => "Missing one or more required fields"]);
        exit;
    }

    $stmt = $mysqli->prepare("INSERT INTO products (name, category, stock, warehouse, barcode) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiss", $input['name'], $input['category'], $input['stock'], $input['warehouse'], $input['barcode']);
    $stmt->execute();
    echo json_encode(["status" => "created", "id" => $stmt->insert_id]);
}

function updateProduct() {
    global $mysqli;
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'], $input['name'], $input['category'], $input['stock'], $input['warehouse'], $input['barcode'])) {
        echo json_encode(["error" => "Missing one or more required fields"]);
        exit;
    }

    $stmt = $mysqli->prepare("UPDATE products SET name = ?, category = ?, stock = ?, warehouse = ?, barcode = ? WHERE id = ?");
    $stmt->bind_param("ssissi", $input['name'], $input['category'], $input['stock'], $input['warehouse'], $input['barcode'], $input['id']);
    $stmt->execute();

    echo json_encode(["status" => $stmt->affected_rows > 0 ? "updated" : "no change"]);
}

function getProductByBarcode() {
    global $mysqli;
    if (!isset($_GET['barcode'])) {
        echo json_encode(["error" => "Missing barcode parameter"]);
        exit;
    }

    $barcode = $_GET['barcode'];
    $stmt = $mysqli->prepare("SELECT * FROM products WHERE barcode = ?");
    $stmt->bind_param("s", $barcode);
    $stmt->execute();
    $res = $stmt->get_result();
    $data = [];
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}
?>
