import axios from 'axios';

const API_BASE_URL = 'https://gym-backend-production-041a.up.railway.app/api';

const updateStock = async () => {
  try {
    // First, let's get the product to see its current data
    const response = await axios.get(`${API_BASE_URL}/products`);
    const product = response.data.products.find(p => p.name.includes('tshirt test'));
    
    if (!product) {
      console.log('Product not found');
      return;
    }
    
    console.log('Current product:', {
      name: product.name,
      stock: product.stock,
      id: product._id
    });
    
    // Update the stock to 10
    const updateResponse = await axios.put(`${API_BASE_URL}/products/${product._id}`, {
      stock: 10
    }, {
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add admin token here
      }
    });
    
    console.log('Stock updated successfully:', updateResponse.data);
  } catch (error) {
    console.error('Error updating stock:', error.response?.data || error.message);
  }
};

updateStock(); 