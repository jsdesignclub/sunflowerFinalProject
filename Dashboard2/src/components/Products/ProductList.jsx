import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedProduct, setExpandedProduct] = useState(null); // Track expanded product for mobile view

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products-list');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching product data');
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, []);

    const toggleExpand = (productId) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    if (loading) return <p className="text-center my-4">Loading...</p>;
    if (error) return <p className="text-center my-4 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Available Products</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Mobile View - List */}
                <div className="block md:hidden">
                    {products.map((product) => (
                        <div key={product.ProductID} className="border-b border-gray-200">
                            <div 
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleExpand(product.ProductID)}
                            >
                                <p className="text-sm font-semibold">{product.ProductName}</p>
                                <p className="text-sm">{product.QuantityInStock} pcs</p>
                            </div>
                            {expandedProduct === product.ProductID && (
                                <div className="bg-gray-50 p-4">
                                    <p className="text-sm font-semibold">
                                        Product ID: <span className="font-normal">{product.ProductID}</span>
                                    </p>
                                    <p className="text-sm font-semibold">
                                        Unit Price: <span className="font-normal">${parseFloat(product.UnitPrice).toFixed(2)}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop View - Table */}
                <table className="hidden md:table w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Product ID</th>
                            <th className="py-2 px-4 border-b">Product Name</th>
                            <th className="py-2 px-4 border-b">Unit Price</th>
                            <th className="py-2 px-4 border-b">Available Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.ProductID} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">{product.ProductID}</td>
                                <td className="py-2 px-4">{product.ProductName}</td>
                                <td className="py-2 px-4">${parseFloat(product.UnitPrice).toFixed(2)}</td>
                                <td className="py-2 px-4">{product.QuantityInStock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
