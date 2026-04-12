import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { useCreateProduct } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

export const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createProductMutation = useCreateProduct();

  const [formData, setFormData] = useState({
    product_name: "",
    product_detail: "",
    category: "",
    price: "",
    discount: "",
    quantity: "",
    status: "Active",
  });

  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = categoriesData?.data || [];

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      const isValid = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValid && isValidSize;
    });

    if (validFiles.length + images.length > 10) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 10 images allowed",
      }));
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = "Product name is required";
    }
    if (!formData.product_detail.trim()) {
      newErrors.product_detail = "Product detail is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = "Valid price is required";
    }
    if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = "Discount must be between 0 and 100";
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Valid quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = new FormData();
    submitData.append("product_name", formData.product_name);
    submitData.append("product_detail", formData.product_detail);
    submitData.append("category", formData.category);
    submitData.append("price", formData.price);
    submitData.append("discount", formData.discount || "0");
    submitData.append("quantity", formData.quantity);
    submitData.append("status", formData.status);

    images.forEach((image) => {
      submitData.append("images", image);
    });

    createProductMutation.mutate(submitData, {
      onSuccess: () => {
        navigate("/admin/products");
      },
    });
  };

  return (
    <ContentWrapper title="Add Product">
      <div className="add-product-page">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#2D3436",
                marginBottom: "4px",
              }}
            >
              Add Product
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Add a new product to the catalog
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/products")}
            className="border-btn d-flex align-items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Left Column - Images */}
            <div className="col-lg-4 mb-4">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #E9ECEF",
                  padding: "20px",
                }}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#2D3436",
                    marginBottom: "16px",
                  }}
                >
                  Product Images
                </h5>
                <p style={{ fontSize: "13px", color: "#636E72", marginBottom: "16px" }}>
                  Add up to 10 images
                </p>

                {/* Image Preview Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        paddingBottom: "100%",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#F5F5F5",
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "#E85A5A",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  ))}

                  {/* Add Image Button */}
                  {images.length < 10 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        paddingBottom: "100%",
                        position: "relative",
                        borderRadius: "8px",
                        border: "2px dashed #E9ECEF",
                        cursor: "pointer",
                        background: "#FAFAFA",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                        }}
                      >
                        <i
                          className="fa-solid fa-plus"
                          style={{ color: "#B2BEC3", fontSize: "20px" }}
                        ></i>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />

                {errors.images && (
                  <p style={{ color: "#E85A5A", fontSize: "12px", margin: "8px 0 0" }}>
                    {errors.images}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="col-lg-8">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #E9ECEF",
                  padding: "20px",
                }}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#2D3436",
                    marginBottom: "20px",
                  }}
                >
                  Price Detail
                </h5>

                <div className="row">
                  {/* Discount */}
                  <div className="col-md-6 mb-3">
                    <label style={labelStyle}>Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      style={inputStyle}
                    />
                    {errors.discount && (
                      <span style={errorStyle}>{errors.discount}</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-md-6 mb-3">
                    <label style={labelStyle}>Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      style={{
                        ...inputStyle,
                        borderColor: errors.price ? "#E85A5A" : "#E9ECEF",
                      }}
                    />
                    {errors.price && (
                      <span style={errorStyle}>{errors.price}</span>
                    )}
                  </div>
                </div>

                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#2D3436",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  Product Detail
                </h5>

                <div className="row">
                  {/* Category */}
                  <div className="col-md-6 mb-3">
                    <label style={labelStyle}>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={{
                        ...inputStyle,
                        borderColor: errors.category ? "#E85A5A" : "#E9ECEF",
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span style={errorStyle}>{errors.category}</span>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="col-md-6 mb-3">
                    <label style={labelStyle}>Product Name *</label>
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      style={{
                        ...inputStyle,
                        borderColor: errors.product_name ? "#E85A5A" : "#E9ECEF",
                      }}
                    />
                    {errors.product_name && (
                      <span style={errorStyle}>{errors.product_name}</span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="col-md-6 mb-3">
                    <label style={labelStyle}>Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      style={{
                        ...inputStyle,
                        borderColor: errors.quantity ? "#E85A5A" : "#E9ECEF",
                      }}
                    />
                    {errors.quantity && (
                      <span style={errorStyle}>{errors.quantity}</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-md-6 mb-3">
                    <label style={labelStyle}>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Product Detail */}
                  <div className="col-12 mb-3">
                    <label style={labelStyle}>Product Detail *</label>
                    <textarea
                      name="product_detail"
                      value={formData.product_detail}
                      onChange={handleInputChange}
                      placeholder="Enter product description..."
                      rows={4}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        borderColor: errors.product_detail ? "#E85A5A" : "#E9ECEF",
                      }}
                    />
                    {errors.product_detail && (
                      <span style={errorStyle}>{errors.product_detail}</span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end mt-4">
                  <Button
                    type="submit"
                    disabled={createProductMutation.isLoading}
                    className="btn d-flex align-items-center gap-2"
                    style={{
                      opacity: createProductMutation.isLoading ? 0.7 : 1,
                    }}
                  >
                    {createProductMutation.isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      "Update Changes"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentWrapper>
  );
};

// Styles
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#636E72",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #E9ECEF",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

const errorStyle: React.CSSProperties = {
  color: "#E85A5A",
  fontSize: "12px",
  marginTop: "4px",
  display: "block",
};

