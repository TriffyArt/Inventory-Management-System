<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "inventory_db");

if ($_GET['action'] == 'low_stock_warning') {
    $res = $mysqli->query("SELECT COUNT(*) AS low_stock_count FROM products WHERE stock < 5");
    $data = $res->fetch_assoc();

    // Fetch the actual low stock products
    $productsRes = $mysqli->query("SELECT * FROM products WHERE stock < 5");
    $products = [];
    while ($row = $productsRes->fetch_assoc()) {
        $products[] = $row;
    }
    $data['low_stock_products'] = $products;

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
    case 'categories':
        getCategories();
        break;
    case 'warehouses':
        getWarehouses();
        break;
    case 'addWarehouse':
        addWarehouse();
        break;
    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}

function displayProducts() {
    global $mysqli;
    $res = $mysqli->query("SELECT products.*, warehouses.name AS warehouse_name, warehouses.id AS warehouse_id 
                           FROM products 
                           LEFT JOIN warehouses ON products.warehouse_id = warehouses.id");
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

    if (!isset($input['name'], $input['category'], $input['stock'], $input['barcode'], $input['warehouse_id'])) {
        echo json_encode(["error" => "Missing one or more required fields"]);
        exit;
    }

    $stmt = $mysqli->prepare("INSERT INTO products (name, category, stock, barcode, warehouse_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssisi", $input['name'], $input['category'], $input['stock'], $input['barcode'], $input['warehouse_id']);
    $stmt->execute();
    echo json_encode(["status" => "created", "id" => $stmt->insert_id]);
}

function updateProduct() {
    global $mysqli;
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'], $input['name'], $input['category'], $input['stock'], $input['barcode'], $input['warehouse_id'])) {
        echo json_encode(["error" => "Missing one or more required fields"]);
        exit;
    }

    $stmt = $mysqli->prepare("UPDATE products SET name = ?, category = ?, stock = ?, barcode = ?, warehouse_id = ? WHERE id = ?");
    $stmt->bind_param("ssisii", $input['name'], $input['category'], $input['stock'], $input['barcode'], $input['warehouse_id'], $input['id']);
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

function getCategories() {
    global $mysqli;
    $res = $mysqli->query("SELECT DISTINCT category FROM products");
    $categories = [];
    while ($row = $res->fetch_assoc()) {
        $categories[] = $row['category'];
    }
    echo json_encode($categories);
}

// Add this for listing warehouses
function getWarehouses() {
    global $mysqli;
    $res = $mysqli->query("SELECT * FROM warehouses");
    $warehouses = [];
    while ($row = $res->fetch_assoc()) {
        $warehouses[] = $row;
    }
    echo json_encode($warehouses);
}

function addWarehouse() {
    global $mysqli;
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['name'], $input['location'])) {
        echo json_encode(["error" => "Missing name or location"]);
        exit;
    }

    $stmt = $mysqli->prepare("INSERT INTO warehouses (name, location) VALUES (?, ?)");
    $stmt->bind_param("ss", $input['name'], $input['location']);
    if ($stmt->execute()) {
        echo json_encode(["status" => "created", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => "Failed to add warehouse"]);
    }
}
?>
