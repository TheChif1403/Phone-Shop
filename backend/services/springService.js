// backend/services/springService.js
const axios = require('axios');

const springAPI = process.env.SPRING_URL || 'http://localhost:8082/api';

async function createOrder(orderData) {
    try {
        const response = await axios.post(`${springAPI}/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi gửi đơn hàng sang Spring Boot:', error.message);
        throw error;
    }
}

async function getDashboardSummary() {
    try {
        const response = await axios.get(`${springAPI}/dashboard/summary`);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi lấy dữ liệu dashboard:', error.message);
        throw error;
    }
}

module.exports = {
    createOrder,
    getDashboardSummary
};