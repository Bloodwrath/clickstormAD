// Purchases Functions
async function loadPurchases() {
    try {
        const querySnapshot = await db.collection('purchases')
            .where('userId', '==', currentUser.uid)
            .orderBy('date', 'desc')
            .get();
        
        purchases = [];
        querySnapshot.forEach(doc => {
            purchases.push({ id: doc.id, ...doc.data() });
        });
        
        displayPurchases();
    } catch (error) {
        console.error('Error loading purchases:', error);
        document.getElementById('purchasesTable').innerHTML = 
            '<tr><td colspan="6" style="text-align: center;">Error al cargar compras</td></tr>';
    }
}

function displayPurchases() {
    const tbody = document.getElementById('purchasesTable');
    
    if (purchases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay compras registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = purchases.map(purchase => `
        <tr>
            <td>${purchase.date ? new Date(purchase.date.toDate()).toLocaleDateString() : 'N/A'}</td>
            <td>${purchase.supplier || 'N/A'}</td>
            <td>${purchase.concept || 'N/A'}</td>
            <td>$${purchase.amount ? purchase.amount.toFixed(2) : '0.00'}</td>
            <td>${purchase.type || 'compra'}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="deletePurchase('${purchase.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showPurchaseModal() {
    alert('Funcionalidad de nueva compra en desarrollo');
}

async function deletePurchase(purchaseId) {
    if (confirm('¿Estás seguro de eliminar esta compra?')) {
        try {
            await db.collection('purchases').doc(purchaseId).delete();
            await loadPurchases();
            showAlert('loginAlert', 'Compra eliminada exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting purchase:', error);
            showAlert('loginAlert', 'Error al eliminar compra', 'error');
        }
    }
}
