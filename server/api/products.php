<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "inventory_db");

if ($_GET['action'] == 'low_stock_warning') {
    $res = $mysqli->query("SELECT COUNT(*) AS low_stock_count FROM products WHERE stock < 5");
    $data = $res->fetch_assoc();
    echo json_encode($data);
    exit;
}

if ($_GET['action'] == 'product_stats') {
    $res = $mysqli->query("SELECT 
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM products WHERE stock < 5) AS low_stock_products");
    $data = $res->fetch_assoc();
    echo json_encode($data);
    exit;
}

if ($_GET['action'] == 'recently_added') {
    $res = $mysqli->query("SELECT name FROM products ORDER BY id DESC LIMIT 10");
    $data = [];
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

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
    if ($stmt->execute()) {
        echo json_encode(["status" => "deleted"]);
    } else {
        echo json_encode(["error" => "Failed to delete product"]);
    }
}

function addProduct() {
    global $mysqli;
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['name'], $input['category'], $input['stock'], $input['barcode'])) {
        echo json_encode(["error" => "Missing one or more required fields"]);
        exit;
    }

    $stmt = $mysqli->prepare("INSERT INTO products (name, category, stock, barcode) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $input['name'], $input['category'], $input['stock'], $input['barcode']);
    $stmt->execute();
    echo json_encode(["status" => "created", "id" => $stmt->insert_id]);
}

function updateProduct() {
    global $mysqli;
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'], $input['name'], $input['category'], $input['stock'], $input['barcode'])) {
        echo json_encode(["error" => "Missing one or more required fields"]);
        exit;
    }

    $stmt = $mysqli->prepare("UPDATE products SET name = ?, category = ?, stock = ?, barcode = ? WHERE id = ?");
    $stmt->bind_param("ssisi", $input['name'], $input['category'], $input['stock'], $input['barcode'], $input['id']);
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
