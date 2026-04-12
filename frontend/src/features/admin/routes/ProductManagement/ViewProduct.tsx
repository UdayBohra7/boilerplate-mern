import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { useProduct } from "../../hooks/useProducts";
import { BASE_URL } from "@/lib/config";

export const ViewProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: productData, isLoading, isError } = useProduct(productId || "");

  const product = productData?.data;
  const images = product?.images?.map((img) =>
    img && !img.startsWith("http") ? `${BASE_URL}${img}` : img
  ) || [];

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return { bg: "#E8F5E9", color: "#4CAF50", border: "#C8E6C9" };
      case "inactive":
        return { bg: "#FFF3E0", color: "#FF9800", border: "#FFE0B2" };
      default:
        return { bg: "#F5F5F5", color: "#9E9E9E", border: "#E0E0E0" };
    }
  };

  if (isLoading) {
    return (
      <ContentWrapper title="View Product">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border" style={{ color: "#E85A5A" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  if (isError || !product) {
    return (
      <ContentWrapper title="View Product">
        <div className="text-center" style={{ padding: "60px 20px" }}>
          <i
            className="fa-solid fa-exclamation-triangle"
            style={{ fontSize: "48px", color: "#E85A5A", marginBottom: "16px" }}
          ></i>
          <h4 style={{ color: "#2D3436", marginBottom: "8px" }}>Product Not Found</h4>
          <p style={{ color: "#636E72", marginBottom: "24px" }}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/admin/products")} className="btn">
            Back to Products
          </Button>
        </div>
      </ContentWrapper>
    );
  }

  const statusStyle = getStatusStyle(product.status);
  const discountedPrice = product.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <ContentWrapper title="Product Detail">
      <div className="product-view-page">
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
              Product detail
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Provide with details of all registered Products
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              onClick={() => navigate(`/admin/products/edit/${productId}`)}
              className="btn d-flex align-items-center gap-2"
            >
              <i className="fa-solid fa-pen"></i> Edit
            </Button>
            <Button
              onClick={() => navigate("/admin/products")}
              className="border-btn d-flex align-items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i> Back
            </Button>
          </div>
        </div>

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
              {/* Main Image */}
              <div
                style={{
                  width: "100%",
                  paddingBottom: "100%",
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#F5F5F5",
                  marginBottom: "16px",
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.product_name}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
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
                      className="fa-solid fa-image"
                      style={{ fontSize: "48px", color: "#E9ECEF" }}
                    ></i>
                    <p style={{ color: "#B2BEC3", marginTop: "8px" }}>No image available</p>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  {images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        paddingBottom: "100%",
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: selectedImageIndex === index
                          ? "2px solid #E85A5A"
                          : "2px solid transparent",
                      }}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="col-lg-8">
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #E9ECEF",
                padding: "24px",
              }}
            >
              {/* Product Title & Status */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "#2D3436",
                      marginBottom: "8px",
                    }}
                  >
                    {product.product_name}
                  </h3>
                  <span
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`,
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div
                style={{
                  background: "#FFF9F9",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <p style={{ color: "#636E72", fontSize: "13px", marginBottom: "4px" }}>
                      Price
                    </p>
                    <div className="d-flex align-items-baseline gap-2">
                      <span
                        style={{
                          fontSize: "28px",
                          fontWeight: 700,
                          color: "#E85A5A",
                        }}
                      >
                        ${discountedPrice.toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <>
                          <span
                            style={{
                              fontSize: "16px",
                              textDecoration: "line-through",
                              color: "#B2BEC3",
                            }}
                          >
                            ${product.price.toFixed(2)}
                          </span>
                          <span
                            style={{
                              background: "#4CAF50",
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            -{product.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <p style={{ color: "#636E72", fontSize: "13px", marginBottom: "4px" }}>
                      Quantity
                    </p>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#2D3436",
                      }}
                    >
                      {product.quantity}
                    </span>
                  </div>
                  <div className="col-md-3">
                    <p style={{ color: "#636E72", fontSize: "13px", marginBottom: "4px" }}>
                      Discount
                    </p>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: product.discount > 0 ? "#4CAF50" : "#B2BEC3",
                      }}
                    >
                      {product.discount}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div style={{ marginBottom: "24px" }}>
                <h5
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#2D3436",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Product Description
                </h5>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#636E72",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  {product.product_detail}
                </p>
              </div>

              {/* Additional Info */}
              <div
                style={{
                  borderTop: "1px solid #E9ECEF",
                  paddingTop: "20px",
                }}
              >
                <div className="row">

                  <div className="col-md-6 mb-3">
                    <div style={detailLabelStyle}>Category</div>
                    <div style={detailValueStyle}>
                      {typeof product.category === 'object' ? product.category.name : "N/A"}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div style={detailLabelStyle}>Created At</div>
                    <div style={detailValueStyle}>{formatDate(product.createdAt)}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div style={detailLabelStyle}>Last Updated</div>
                    <div style={detailValueStyle}>{formatDate(product.updatedAt)}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div style={detailLabelStyle}>Total Images</div>
                    <div style={detailValueStyle}>{images.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

// Styles
const detailLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#636E72",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const detailValueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#2D3436",
  fontWeight: 500,
};
