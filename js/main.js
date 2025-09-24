// Global variables
let currentUser = null;
let products = [];
let orders = [];
let purchases = [];
let suppliers = [];

// Initialize App
async function initializeApp() {
    await loadDashboardData();
    await loadProducts();
    await loadOrders();
    await loadPurchases();
    await loadSuppliers();
}

// Navigation Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('sidebar-active');
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    document.getElementById(pageId + 'Page').classList.remove('hidden');
    
    // Update active menu item
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Utility Functions
function showAlert(elementId, message, type) {
    const alert = document.getElementById(elementId);
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    
    // Reset form when closing add product modal
    if (modalId === 'addProductModal') {
        const form = document.getElementById('addProductForm');
        form.reset();
        
        // Reset category-specific fields
        document.getElementById('sublimationFields').classList.add('hidden');
        document.getElementById('laserFields').classList.add('hidden');
        document.getElementById('priceFields').classList.remove('hidden');
        document.getElementById('productUnitCost').value = '';
        
        // Reset subcategory dropdown
        const subcategorySelect = document.getElementById('productSubcategory');
        subcategorySelect.innerHTML = '<option value="">Selecciona una subcategoría...</option>';
    }
}

function showAddProductModal() {
    document.getElementById('addProductModal').classList.add('active');
    // Initialize category fields when modal opens
    setTimeout(() => {
        toggleCategoryFields();
    }, 100);
}

// File handling functions (using Firebase utilities)
function exportInventory() {
    if (products.length === 0) {
        alert('No hay productos para exportar');
        return;
    }
    
    const csvContent = [
        ['Nombre', 'Categoría', 'Stock', 'Stock Mínimo', 'Precio Unitario', 'Precio Mayoreo', 'Precio Menudeo', 'Costo'],
        ...products.map(p => [
            p.name, p.category, p.stock, p.minStock,
            p.prices?.unit || 0, p.prices?.wholesale || 0, p.prices?.retail || 0, p.cost || 0
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventario_clickstorm.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function importInventory(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                // Process imported data
                console.log('Importing row:', values);
            }
        }
        
        alert('Importación completada (funcionalidad básica)');
    };
    reader.readAsText(file);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners and initialize the app
    console.log('Click Storm POS System initialized');
});
