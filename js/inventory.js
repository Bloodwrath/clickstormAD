// Product Functions
async function loadProducts() {
    try {
        const querySnapshot = await db.collection('products')
            .where('userId', '==', currentUser.uid)
            .get();
        
        products = [];
        querySnapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(productsToShow) {
    const tbody = document.getElementById('productsTable');
    
    if (productsToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay productos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = productsToShow.map(product => {
        // Determine what to show in the unit price column
        let unitDisplayValue = 0;
        if (product.type === 'materia_prima') {
            // For raw materials, show the calculated unit cost
            unitDisplayValue = product.unitCost || 0;
        } else {
            // For sale products, show the sale price
            unitDisplayValue = product.prices?.unit || 0;
        }
        
        return `
        <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td class="${product.stock <= product.minStock ? 'text-danger' : ''}">
                ${product.stock} ${product.stock <= product.minStock ? '⚠️' : ''}
            </td>
            <td>$${unitDisplayValue.toFixed(2)}</td>
            <td>$${product.prices?.wholesale || 0}</td>
            <td>$${product.prices?.retail || 0}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="restockProduct('${product.id}')" title="Rellenar Stock">
                    <i class="fas fa-plus-circle"></i>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}

// Category and Field Toggle Functions
function toggleCategoryFields() {
    const category = document.getElementById('productCategory').value;
    const sublimationFields = document.getElementById('sublimationFields');
    const laserFields = document.getElementById('laserFields');
    const subcategorySelect = document.getElementById('productSubcategory');
    
    // Reset all fields when category changes
    toggleSublimationFields();
    toggleLaserFields();
    
    // Load subcategories based on category
    loadSubcategories(category);
    
    // Show category-specific fields
    if (category === 'sublimacion') {
        sublimationFields.classList.remove('hidden');
        laserFields.classList.add('hidden');
    } else if (category === 'laser') {
        sublimationFields.classList.add('hidden');
        laserFields.classList.remove('hidden');
    } else {
        sublimationFields.classList.add('hidden');
        laserFields.classList.add('hidden');
    }
}

function toggleSublimationFields() {
    const sublimationFields = document.getElementById('sublimationFields');
    sublimationFields.classList.add('hidden');
    // Clear sublimation fields
    document.getElementById('sublimationTemp').value = '';
    document.getElementById('sublimationTime').value = '';
}

function toggleLaserFields() {
    const laserFields = document.getElementById('laserFields');
    laserFields.classList.add('hidden');
    // Clear laser fields
    document.getElementById('engravingAreaHeight').value = '';
    document.getElementById('engravingAreaWidth').value = '';
    document.getElementById('cuttingTestImage').value = '';
    document.getElementById('engravingTestImage').value = '';
}

function toggleProductTypeFields() {
    const productType = document.getElementById('productType').value;
    const priceFields = document.getElementById('priceFields');
    
    if (productType === 'materia_prima') {
        priceFields.classList.add('hidden');
        // Clear price fields for materia prima
        document.getElementById('productPriceUnit').value = '';
        document.getElementById('productPriceWholesale').value = '';
        document.getElementById('productPriceRetail').value = '';
        // Calculate and show unit cost for materia prima
        calculateUnitCost();
    } else {
        priceFields.classList.remove('hidden');
        // Clear unit cost field for sale products
        document.getElementById('productUnitCost').value = '';
    }
}

function calculateUnitCost() {
    const cost = parseFloat(document.getElementById('productCost').value) || 0;
    const stock = parseInt(document.getElementById('productStock').value) || 1;
    const unitCost = cost / stock;
    
    document.getElementById('productUnitCost').value = unitCost.toFixed(2);
}

function loadSubcategories(category) {
    const subcategorySelect = document.getElementById('productSubcategory');
    const materials = getMaterialsByCategory(category);
    
    subcategorySelect.innerHTML = '<option value="">Selecciona una subcategoría...</option>';
    
    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material.value;
        option.textContent = material.label;
        subcategorySelect.appendChild(option);
    });
}

function getMaterialsByCategory(category) {
    const materials = {
        sublimacion: [
            { value: 'tazas', label: 'Tazas' },
            { value: 'platos', label: 'Platos' },
            { value: 'gorras', label: 'Gorras' },
            { value: 'playeras', label: 'Playeras' },
            { value: 'rompecabezas', label: 'Rompecabezas' },
            { value: 'llaveros', label: 'Llaveros' },
            { value: 'acrilico', label: 'Acrílico' },
            { value: 'madera', label: 'Madera' },
            { value: 'metal', label: 'Metal' },
            { value: 'vidrio', label: 'Vidrio' },
            { value: 'ceramica', label: 'Cerámica' },
            { value: 'tela', label: 'Tela' },
            { value: 'cuero', label: 'Cuero' }
        ],
        laser: [
            { value: 'madera', label: 'Madera' },
            { value: 'acrilico', label: 'Acrílico' },
            { value: 'metal', label: 'Metal' },
            { value: 'cuero', label: 'Cuero' },
            { value: 'carton', label: 'Cartón' },
            { value: 'plastico', label: 'Plástico' },
            { value: 'vidrio', label: 'Vidrio' },
            { value: 'tela', label: 'Tela' },
            { value: 'papel', label: 'Papel' },
            { value: 'corcho', label: 'Corcho' },
            { value: 'piedra', label: 'Piedra' },
            { value: 'ceramica', label: 'Cerámica' }
        ],
        publicidad: [
            { value: 'volantes', label: 'Volantes' },
            { value: 'tarjetas', label: 'Tarjetas de presentación' },
            { value: 'posters', label: 'Posters' },
            { value: 'banners', label: 'Banners' },
            { value: 'pendones', label: 'Pendones' },
            { value: 'etiquetas', label: 'Etiquetas' },
            { value: 'stickers', label: 'Stickers' },
            { value: 'brochures', label: 'Brochures' },
            { value: 'catalogos', label: 'Catálogos' },
            { value: 'menus', label: 'Menús' },
            { value: 'invitaciones', label: 'Invitaciones' },
            { value: 'dipticos', label: 'Dípticos' },
            { value: 'tripticos', label: 'Trípticos' }
        ]
    };
    
    return materials[category] || [];
}

// Product search
document.getElementById('productSearch').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
});

// Add Product Form
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const productType = document.getElementById('productType').value;
        const category = document.getElementById('productCategory').value;
        const subcategory = document.getElementById('productSubcategory').value;
        
        // Validate required fields based on product type
        if (productType !== 'materia_prima') {
            const unitPrice = document.getElementById('productPriceUnit').value;
            const wholesalePrice = document.getElementById('productPriceWholesale').value;
            const retailPrice = document.getElementById('productPriceRetail').value;
            
            if (!unitPrice || !wholesalePrice || !retailPrice) {
                showAlert('loginAlert', 'Los precios son requeridos para productos de venta', 'error');
                return;
            }
        }
        
        // Get calculated unit cost
        const calculatedUnitCost = parseFloat(document.getElementById('productUnitCost').value) || 0;
        
        const formData = {
            name: document.getElementById('productName').value,
            type: productType,
            category: category,
            subcategory: subcategory,
            barcode: document.getElementById('productBarcode').value,
            dimensions: {
                height: parseFloat(document.getElementById('productHeight').value),
                width: parseFloat(document.getElementById('productWidth').value),
                depth: parseFloat(document.getElementById('productDepth').value) || null,
                volume: parseFloat(document.getElementById('productVolume').value) || null
            },
            prices: {
                unit: productType === 'materia_prima' ? calculatedUnitCost : parseFloat(document.getElementById('productPriceUnit').value) || 0,
                wholesale: parseFloat(document.getElementById('productPriceWholesale').value) || 0,
                retail: parseFloat(document.getElementById('productPriceRetail').value) || 0
            },
            stock: parseInt(document.getElementById('productStock').value),
            minStock: parseInt(document.getElementById('productMinStock').value),
            cost: parseFloat(document.getElementById('productCost').value),
            unitCost: calculatedUnitCost,
            userId: currentUser.uid,
            createdAt: new Date(),
            purchaseHistory: [{
                date: new Date(),
                cost: parseFloat(document.getElementById('productCost').value),
                quantity: parseInt(document.getElementById('productStock').value),
                supplier: document.getElementById('productSupplier').value || null,
                purchaseUrl: document.getElementById('purchaseUrl').value || null
            }]
        };
        
        // Add sublimation specific fields
        if (category === 'sublimacion') {
            formData.sublimation = {
                temperature: parseInt(document.getElementById('sublimationTemp').value) || null,
                time: parseInt(document.getElementById('sublimationTime').value) || null
            };
        }
        
        // Add laser engraving specific fields
        if (category === 'laser') {
            formData.laserEngraving = {
                engravingArea: {
                    height: parseFloat(document.getElementById('engravingAreaHeight').value) || null,
                    width: parseFloat(document.getElementById('engravingAreaWidth').value) || null
                }
            };
            
            // Handle test images
            const cuttingTestFile = document.getElementById('cuttingTestImage').files[0];
            const engravingTestFile = document.getElementById('engravingTestImage').files[0];
            
            if (cuttingTestFile) {
                const cuttingChunks = await fileToBase64Chunks(cuttingTestFile);
                formData.laserEngraving.cuttingTestImage = cuttingChunks;
                formData.laserEngraving.cuttingTestImageType = cuttingTestFile.type;
            }
            
            if (engravingTestFile) {
                const engravingChunks = await fileToBase64Chunks(engravingTestFile);
                formData.laserEngraving.engravingTestImage = engravingChunks;
                formData.laserEngraving.engravingTestImageType = engravingTestFile.type;
            }
        }
        
        // Add optional fields
        const supplier = document.getElementById('productSupplier').value;
        const purchaseUrl = document.getElementById('purchaseUrl').value;
        
        if (supplier) formData.supplier = supplier;
        if (purchaseUrl) formData.purchaseUrl = purchaseUrl;
        
        // Handle main product image
        const imageFile = document.getElementById('productImage').files[0];
        if (imageFile) {
            const imageChunks = await fileToBase64Chunks(imageFile);
            formData.imagen = imageChunks;
            formData.imageType = imageFile.type;
        }
        
        await db.collection('products').add(formData);
        
        closeModal('addProductModal');
        document.getElementById('addProductForm').reset();
        await loadProducts();
        showAlert('loginAlert', 'Producto agregado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error adding product:', error);
        showAlert('loginAlert', 'Error al agregar producto', 'error');
    }
});

async function editProduct(productId) {
    // Implementation for editing product
    alert('Funcionalidad de editar producto en desarrollo');
}

async function restockProduct(productId) {
    try {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const quantity = prompt(`¿Cuántas unidades deseas agregar a "${product.name}"?\nStock actual: ${product.stock}`);
        if (!quantity || isNaN(quantity) || quantity <= 0) return;

        const costPerUnit = prompt('¿Cuál es el costo por unidad de esta compra?');
        if (!costPerUnit || isNaN(costPerUnit) || costPerUnit < 0) return;

        const supplier = prompt('Proveedor (opcional):') || null;
        const purchaseUrl = prompt('URL de compra (opcional):') || null;

        const totalCost = parseFloat(costPerUnit) * parseInt(quantity);
        const newStock = product.stock + parseInt(quantity);

        // Update product
        await db.collection('products').doc(productId).update({
            stock: newStock,
            purchaseHistory: firebase.firestore.FieldValue.arrayUnion({
                date: new Date(),
                cost: totalCost,
                quantity: parseInt(quantity),
                supplier: supplier,
                purchaseUrl: purchaseUrl
            })
        });

        // Also update the purchases collection
        await db.collection('purchases').add({
            date: new Date(),
            supplier: supplier,
            concept: `Rellenar ${product.name}`,
            amount: totalCost,
            type: 'compra',
            productId: productId,
            quantity: parseInt(quantity),
            userId: currentUser.uid
        });

        await loadProducts();
        showAlert('loginAlert', `Producto rellenado exitosamente. Nuevo stock: ${newStock}`, 'success');

    } catch (error) {
        console.error('Error restocking product:', error);
        showAlert('loginAlert', 'Error al rellenar producto', 'error');
    }
}

async function deleteProduct(productId) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
            await db.collection('products').doc(productId).delete();
            await loadProducts();
            showAlert('loginAlert', 'Producto eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting product:', error);
            showAlert('loginAlert', 'Error al eliminar producto', 'error');
        }
    }
}
