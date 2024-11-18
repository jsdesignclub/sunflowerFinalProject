import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProductForm = () => {
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [freeIssue, setFreeIssue] = useState('');
    const [discount, setDiscount] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Fetch categories when the component mounts
    useEffect(() => {
        axios.get('http://sunflowerfinalproject-production.up.railway.app/api/categories')
            .then((response) => {
                setCategories(response.data); // Set categories
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if required fields are provided
        if (!productName || (!isNewCategory && !categoryId) || !unitPrice) {
            return alert('Please fill in all required fields');
        }

        try {
            // Send product data to the backend, with newCategoryName if needed
            const response = await axios.post('http://sunflowerfinalproject-production.up.railway.app/api/products', {
                ProductName: productName,
                CategoryId: isNewCategory ? null : categoryId, // Send null if adding a new category
                NewCategoryName: isNewCategory ? newCategoryName : null, // Only send newCategoryName if adding a new category
                UnitPrice: parseFloat(unitPrice),
                FreeIssue: parseInt(freeIssue, 10),
                Discount: parseFloat(discount)
            });

            alert('Product added successfully!');
            // Reset form after successful submission
            setProductName('');
            setCategoryId('');
            setUnitPrice('');
            setFreeIssue('');
            setDiscount('');
            setIsNewCategory(false);
            setNewCategoryName('');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-center mb-6">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name Input */}
                <div className="flex flex-col">
                    <label htmlFor="productName" className="text-sm font-semibold text-gray-700 mb-2">
                        Product Name
                    </label>
                    <input
                        id="productName"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter product name"
                        required
                    />
                </div>

                {/* Category Selection or New Category Input */}
                <div className="flex flex-col">
                    <label htmlFor="categoryName" className="text-sm font-semibold text-gray-700 mb-2">
                        Category
                    </label>
                    {!isNewCategory ? (
                        <select
                            id="categoryId"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.CategoryID }>
                                    {category.CategoryName}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            id="newCategoryName"
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter new category name"
                            required
                        />
                    )}

                    {/* Checkbox to add a new category */}
                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={isNewCategory}
                            onChange={() => {
                                setIsNewCategory(!isNewCategory);
                                setCategoryId(''); // Reset category ID when switching to new category
                            }}
                            className="mr-2"
                        />
                        <label htmlFor="addCategory" className="text-sm text-gray-700">
                            Add New Category
                        </label>
                    </div>
                </div>

                {/* Unit Price Input */}
                <div className="flex flex-col">
                    <label htmlFor="unitPrice" className="text-sm font-semibold text-gray-700 mb-2">
                        Unit Price
                    </label>
                    <input
                        id="unitPrice"
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter unit price"
                        required
                    />
                </div>

                {/* Free Issue Input */}
                <div className="flex flex-col">
                    <label htmlFor="freeIssue" className="text-sm font-semibold text-gray-700 mb-2">
                        Free Issue
                    </label>
                    <input
                        id="freeIssue"
                        type="number"
                        value={freeIssue}
                        onChange={(e) => setFreeIssue(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter free issue quantity"
                    />
                </div>

                {/* Discount Input */}
                <div className="flex flex-col">
                    <label htmlFor="discount" className="text-sm font-semibold text-gray-700 mb-2">
                        Discount
                    </label>
                    <input
                        id="discount"
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter discount percentage"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md focus:outline-none hover:bg-indigo-700"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;
