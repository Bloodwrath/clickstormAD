// Dashboard Functions
async function loadDashboardData() {
    try {
        // Calculate today's sales
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const salesQuery = await db.collection('sales')
            .where('date', '>=', todayStart)
            .where('userId', '==', currentUser.uid)
            .get();
        
        let todaySales = 0;
        salesQuery.forEach(doc => {
            todaySales += doc.data().total || 0;
        });
        
        // Calculate monthly profit
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const profitQuery = await db.collection('sales')
            .where('userId', '==', currentUser.uid)
            .where('date', '>=', monthStart)
            .get();
        
        let monthlyProfit = 0;
        profitQuery.forEach(doc => {
            const data = doc.data();
            monthlyProfit += (data.total - data.cost) || 0;
        });
        
        // Count pending orders
        const pendingQuery = await db.collection('orders')
            .where('status', '==', 'pending')
            .where('userId', '==', currentUser.uid)
            .get();
        
        // Count low stock products
        const lowStockQuery = await db.collection('products')
            .where('userId', '==', currentUser.uid)
            .get();
        
        let lowStockCount = 0;
        lowStockQuery.forEach(doc => {
            const data = doc.data();
            if (data.stock <= data.minStock) {
                lowStockCount++;
            }
        });
        
        // Update dashboard
        document.getElementById('todaySales').textContent = `$${todaySales.toFixed(2)}`;
        document.getElementById('monthlyProfit').textContent = `$${monthlyProfit.toFixed(2)}`;
        document.getElementById('pendingOrders').textContent = pendingQuery.size;
        document.getElementById('lowStock').textContent = lowStockCount;
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}
