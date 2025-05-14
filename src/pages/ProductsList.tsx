import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { getProducts } from '../services/productService';

  const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(token, user.userId);

        console.log(response);
        const items = response.data.getProductsResponseBean.products;
        setProducts(items);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      <div className="card p-4" style={{ borderRadius: 24 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Product List</h3>
          <a href="/products/add" className="btn btn-primary rounded-pill">
            <i className="bi bi-plus-circle me-2"></i>Add Product
          </a>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Image</th>
                {/* <th style={{ width: 100 }}>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {products.map((prod, index) => (
                <tr key={prod.id}>
                  <td>{index + 1}</td>
                  <td>{prod.name}</td>
                  <td>{prod.brand}</td>
                  <td>{prod.category}</td>
                  <td>${prod.price}</td>
                  <td>
                    <img
                      src={prod.imagePath}
                      alt={prod.name}
                      width={60}
                      height={60}
                      style={{ objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                      onClick={() => handleImageClick(prod.imagePath)}
                    />
                  </td>
                  {/* <td>
                    <button className="btn btn-sm btn-outline-primary me-2" title="Edit">
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Delete">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
{showModal && (
  <div>
    {/* Backdrop */}
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
      style={{ zIndex: 1040 }}
      onClick={() => setShowModal(false)}
    />

    {/* Modal */}
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ zIndex: 1050 }}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Product Image</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body text-center">
            <img
              src={selectedImage}
              alt="Product"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </DashboardLayout>
  );
};

export default ProductsList;
