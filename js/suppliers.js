// Suppliers Functions
async function loadSuppliers() {
    try {
        const querySnapshot = await db.collection('suppliers')
            .where('userId', '==', currentUser.uid)
            .get();
        
        suppliers = [];
        querySnapshot.forEach(doc => {
            suppliers.push({ id: doc.id, ...doc.data() });
        });
        
        displaySuppliers();
        populateSupplierDropdown();
    } catch (error) {
        console.error('Error loading suppliers:', error);
        document.getElementById('suppliersTable').innerHTML = 
            '<tr><td colspan="6" style="text-align: center;">Error al cargar proveedores</td></tr>';
    }
}

function displaySuppliers() {
    const tbody = document.getElementById('suppliersTable');
    
    if (suppliers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay proveedores registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = suppliers.map(supplier => `
        <tr>
            <td>${supplier.name || 'N/A'}</td>
            <td>${supplier.contact || 'N/A'}</td>
            <td>${supplier.phone || 'N/A'}</td>
            <td>${supplier.email || 'N/A'}</td>
            <td>${supplier.products ? supplier.products.length : 0}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editSupplier('${supplier.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="deleteSupplier('${supplier.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function populateSupplierDropdown() {
    const supplierSelects = [
        document.getElementById('productSupplier')
    ];
    
    supplierSelects.forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Selecciona un proveedor...</option>';
            
            suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                select.appendChild(option);
            });
        }
    });
}

function showSupplierModal() {
    // Implementation for supplier modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Agregar Proveedor</h2>
                <button class="close-btn" onclick="closeSupplierModal()">&times;</button>
            </div>
            <form id="addSupplierForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre del Proveedor</label>
                        <input type="text" id="supplierName" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Contacto</label>
                        <input type="text" id="supplierContact" class="form-control" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" id="supplierPhone" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="supplierEmail" class="form-control" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" id="supplierAddress" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Sitio Web</label>
                        <input type="url" id="supplierWebsite" class="form-control">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Productos/Servicios</label>
                    <textarea id="supplierProducts" class="form-control" rows="3" placeholder="Describe los productos o servicios que ofrece"></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary">Guardar Proveedor</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('addSupplierForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const supplierData = {
                name: document.getElementById('supplierName').value,
                contact: document.getElementById('supplierContact').value,
                phone: document.getElementById('supplierPhone').value,
                email: document.getElementById('supplierEmail').value,
                address: document.getElementById('supplierAddress').value || null,
                website: document.getElementById('supplierWebsite').value || null,
                products: document.getElementById('supplierProducts').value.split(',').map(p => p.trim()).filter(p => p),
                userId: currentUser.uid,
                createdAt: new Date()
            };
            
            await db.collection('suppliers').add(supplierData);
            
            closeSupplierModal();
            await loadSuppliers();
            showAlert('loginAlert', 'Proveedor agregado exitosamente', 'success');
            
        } catch (error) {
            console.error('Error adding supplier:', error);
            showAlert('loginAlert', 'Error al agregar proveedor', 'error');
        }
    });
}

function closeSupplierModal() {
    const modal = document.querySelector('.modal.active');
    if (modal) {
        modal.remove();
    }
}

function editSupplier(supplierId) {
    alert('Editar proveedor: ' + supplierId);
}

async function deleteSupplier(supplierId) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
        try {
            await db.collection('suppliers').doc(supplierId).delete();
            await loadSuppliers();
            showAlert('loginAlert', 'Proveedor eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting supplier:', error);
            showAlert('loginAlert', 'Error al eliminar proveedor', 'error');
        }
    }
}
