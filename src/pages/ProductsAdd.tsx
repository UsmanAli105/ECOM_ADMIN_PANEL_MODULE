import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProducts } from "../services/productService";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { getBrandDropDown, getCategoryDropDown } from "../services/productService";

interface CreateProductResponse {
  success: boolean;
  productId?: string;
  error?: string;
}

interface ProductForm {
  brandId: number;
  categoryId: number;
  productName: string;
  productDescription: string;
  imagePath: string;
  basePrice: string;
  gst: string;
}



const initialProduct: ProductForm = {
  brandId: 0,
  categoryId: 0,
  productName: "",
  productDescription: "",
  imagePath: "",
  basePrice: "",
  gst: "",
};



const ProductsAdd: React.FC = () => {
  const [products, setProducts] = useState<ProductForm[]>([
    { ...initialProduct },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [apiResponses, setApiResponses] = useState<
    CreateProductResponse[] | null
  >(null);
  const navigate = useNavigate();
  const { user } = useAuth();

const handleChange = (
  index: number,
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setProducts((prev) =>
    prev.map((prod, i) => (i === index ? { ...prod, [name]: value } : prod))
  );
};


  const addProductRow = () => {
    setProducts((prev) => [...prev, { ...initialProduct }]);
  };

  const removeProductRow = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setApiResponses(null);
    setLoading(true);
    // Check for unique image URLs
    const imageUrls = products.map((p) => p.imagePath.trim());
    const uniqueUrls = new Set(imageUrls);
    if (uniqueUrls.size !== imageUrls.length) {
      setError("Each product must have a unique image URL.");
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token") || "";
    if (!user) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }
    // Convert string fields to numbers for API
    const productsForApi = products.map((p) => ({
      brandId: Number(p.brandId),
      categoryId: Number(p.categoryId),
      productName: p.productName,
      productDescription: p.productDescription,
      imagePath: p.imagePath,
      basePrice: Number(p.basePrice),
      gst: Number(p.gst),
    }));
    try {
      const res = await createProducts(productsForApi, token, user.userId);
      const responses: CreateProductResponse[] =
        res.data?.createProductResponses || [];
      setApiResponses(responses);
      if (responses.every((r) => r.success)) {
        setSuccess("All products added successfully!");
        setTimeout(() => navigate("/products/list"), 1500);
      } else {
        setError("Some products failed to add. See details below.");
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } })
          .response === "object" &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message
      ) {
        setError(
          (err as { response: { data: { message: string } } }).response.data
            .message
        );
      } else {
        setError("Failed to add products");
      }
    } finally {
      setLoading(false);
    }
  };
  


  const [brandOptions, setBrandOptions] = useState<{ id: number; name: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);



useEffect(() => {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem('token') || '';


  const fetchBrands = async () => {
    try {
      const response = await getBrandDropDown(token, user.userId);
      const result = response.data;
      if (result?.data?.success) {
        setBrandOptions(result.data.brands);
      } else {
        console.error("Brand dropdown fetch failed");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

    const fetchCategories = async () => {
    try {
      const response = await getCategoryDropDown(token, user.userId);
      const result = response.data;
      if (result?.data?.success) {
        setCategoryOptions(result.data.categories);
      } else {
        console.error("Category dropdown fetch failed");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchBrands();
  fetchCategories();
}, []);

  return (
    <DashboardLayout>
      <div className="w-100">
        <div
          className="card p-4"
          style={{ borderRadius: 24, maxWidth: 700, margin: "0 auto" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Add Products</h2>
            <button
              type="button"
              className="btn btn-secondary rounded-pill"
              onClick={addProductRow}
            >
              <i className="bi bi-plus-circle me-2"></i> Add Another Product
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            {products.map((product, idx) => (
              <div
                className="p-4 mb-4 position-relative shadow-sm bg-white rounded-4 border"
                key={idx}
                style={{ boxShadow: "0 2px 16px 0 rgba(111,66,193,0.07)" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Product {idx + 1}</h5>
                  {products.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeProductRow(idx)}
                      title="Remove Product"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-start w-100">
                    Brand ID
                  </label>
                <select
                  className="form-control"
                  name="brandId"
                  value={product.brandId}
                  onChange={(e) => handleChange(idx, e)}
                  required
                >
                  <option value="">Select Brand</option>
                  {brandOptions.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>

                  <div className="form-text text-start">
                    Unique brand identifier
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-start w-100">
                    Category ID
                  </label>
                  <select
                    className="form-control"
                    name="categoryId"
                    value={product.categoryId}
                    onChange={(e) => handleChange(idx, e)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="form-text text-start">
                    Unique category identifier
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-start w-100">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="productName"
                    placeholder="Product Name"
                    value={product.productName}
                    onChange={(e) => handleChange(idx, e)}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-start w-100">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    name="productDescription"
                    placeholder="Product Description"
                    value={product.productDescription}
                    onChange={(e) => handleChange(idx, e)}
                    required
                    rows={2}
                    maxLength={255}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-start w-100">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="imagePath"
                    placeholder="https://example.com/image.jpg"
                    value={product.imagePath}
                    onChange={(e) => handleChange(idx, e)}
                    required
                  />
                  <div className="form-text text-start">
                    Direct image link only
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-start w-100">
                      Base Price
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="basePrice"
                      placeholder="0"
                      value={product.basePrice}
                      onChange={(e) => handleChange(idx, e)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-start w-100">
                      GST (%)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="gst"
                      placeholder="0"
                      value={product.gst}
                      onChange={(e) => handleChange(idx, e)}
                      required
                    />
                  </div>
                </div>
                {apiResponses && apiResponses[idx] && (
                  <div
                    className={`mt-2 ${
                      apiResponses[idx].success ? "text-success" : "text-danger"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {apiResponses[idx].success ? (
                      <span>
                        Product added! ID: {apiResponses[idx].productId}
                      </span>
                    ) : (
                      <span>
                        Error: {apiResponses[idx].error || "Unknown error"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                className="btn btn-primary px-5 py-2 rounded-pill fw-semibold"
                disabled={loading}
                style={{ fontSize: 18 }}
              >
                {loading ? "Submitting..." : "Submit All"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsAdd;
