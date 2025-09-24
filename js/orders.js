// Orders Functions
async function loadOrders() {
    try {
        const querySnapshot = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        orders = [];
        querySnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        
        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersTable').innerHTML = 
            '<tr><td colspan="6" style="text-align: center;">Error al cargar pedidos</td></tr>';
    }
}

function displayOrders() {
    const tbody = document.getElementById('ordersTable');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay pedidos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id.substring(0, 8)}</td>
            <td>${order.customer || 'N/A'}</td>
            <td>${order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}</td>
            <td>$${order.total ? order.total.toFixed(2) : '0.00'}</td>
            <td>
                <span class="badge badge-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'info'}">
                    ${order.status || 'pending'}
                </span>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="deleteOrder('${order.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showNewOrderModal() {
    // Implementation for new order modal
    alert('Funcionalidad de nuevo pedido en desarrollo');
}

function viewOrder(orderId) {
    // Implementation for viewing order details
    alert('Ver detalles del pedido: ' + orderId);
}

async function deleteOrder(orderId) {
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
        try {
            await db.collection('orders').doc(orderId).delete();
            await loadOrders();
            showAlert('loginAlert', 'Pedido eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting order:', error);
            showAlert('loginAlert', 'Error al eliminar pedido', 'error');
        }
    }
}
