import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import edit from "@/assets/edit.svg";
import del from "@/assets/del.svg";
import view from "@/assets/view.svg";
import { useProducts, useDeleteProduct, Product } from "../../hooks/useProducts";
import { BASE_URL } from "@/lib/config";

interface ActionDropdownProps {
  product: Product;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Action Dropdown Component
const ActionDropdown = ({
  product,
  onEdit,
  onView,
  onDelete,
}: ActionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="actions-btns d-flex align-items-center gap-2">
      <button
        className="dropdown-item d-flex align-items-center gap-2"
        onClick={() => {
          onEdit(product);
          setIsOpen(false);
        }}
        style={{
          background: "none",
          border: "none",
          width: "max-content",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <img src={edit} className="table-action-ico" />

      </button>
      <button
        className="dropdown-item d-flex align-items-center gap-2 "
        onClick={() => {
          onView(product);
          setIsOpen(false);
        }}
        style={{
          background: "none",
          border: "none",
          width: "max-content",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <img src={view} className="table-action-ico" />

      </button>
      <button
        className="dropdown-item d-flex align-items-center gap-2"
        onClick={() => {
          onDelete(product);
          setIsOpen(false);
        }}
        style={{
          background: "none",
          border: "none",
          width: "max-content",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <img src={del} className="table-action-ico" />

      </button>
    </div>
    // <div className="action-dropdown" style={{ position: "relative" }}>
    //   <button
    //     className="action-btn bg-transparent border-0 p-2"
    //     onClick={() => setIsOpen(!isOpen)}
    //     style={{ position: "relative", zIndex: isOpen ? 1001 : 1 }}
    //   >
    //     <i className="fa-solid fa-ellipsis" style={{ color: "#636E72" }}></i>
    //   </button>
    //   {isOpen && (
    //     <>
    //       <div
    //         className="dropdown-overlay"
    //         onClick={() => setIsOpen(false)}
    //         style={{
    //           position: "fixed",
    //           top: 0,
    //           left: 0,
    //           right: 0,
    //           bottom: 0,
    //           zIndex: 1000,
    //           background: "transparent",
    //         }}
    //       />
    //       <div
    //         className="dropdown-menu show"
    //         style={{
    //           position: "absolute",
    //           zIndex: 1002,
    //           minWidth: "160px",
    //           background: "#fff",
    //           borderRadius: "8px",
    //           boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    //           border: "1px solid #E9ECEF",
    //           padding: "8px 0",
    //           right: 0,
    //           top: "100%",
    //           transform: "none",
    //           marginTop: "4px",
    //         }}
    //       >
    //         <button
    //           className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
    //           onClick={() => {
    //             onEdit(product);
    //             setIsOpen(false);
    //           }}
    //           style={{
    //             background: "none",
    //             border: "none",
    //             width: "100%",
    //             textAlign: "left",
    //             cursor: "pointer",
    //           }}
    //         >
    //           <img src={edit} className="table-action-ico" />
    //           <span style={{ fontSize: "13px", color: "#2D3436" }}>
    //             Edit Product
    //           </span>
    //         </button>
    //         <button
    //           className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
    //           onClick={() => {
    //             onView(product);
    //             setIsOpen(false);
    //           }}
    //           style={{
    //             background: "none",
    //             border: "none",
    //             width: "100%",
    //             textAlign: "left",
    //             cursor: "pointer",
    //           }}
    //         >
    //           <img src={view} className="table-action-ico" />
    //           <span style={{ fontSize: "13px", color: "#2D3436" }}>
    //             View Detail
    //           </span>
    //         </button>
    //         <button
    //           className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
    //           onClick={() => {
    //             onDelete(product);
    //             setIsOpen(false);
    //           }}
    //           style={{
    //             background: "none",
    //             border: "none",
    //             width: "100%",
    //             textAlign: "left",
    //             cursor: "pointer",
    //           }}
    //         >
    //           <img src={del} className="table-action-ico" />
    //           <span style={{ fontSize: "13px", color: "#E85A5A" }}>
    //             Delete Product
    //           </span>
    //         </button>
    //       </div>
    //     </>
    //   )}
    // </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case "active":
        return { bg: "#E8F5E9", color: "#4CAF50", border: "#C8E6C9" };
      case "inactive":
        return { bg: "#FFF3E0", color: "#FF9800", border: "#FFE0B2" };
      default:
        return { bg: "#F5F5F5", color: "#9E9E9E", border: "#E0E0E0" };
    }
  };

  const style = getStatusStyle();

  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {status || "N/A"}
    </span>
  );
};

// Filter Modal Component
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { status: string | null }) => void;
  currentFilters: { status: string | null };
}

const FilterModal = ({ isOpen, onClose, onApply, currentFilters }: FilterModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(currentFilters.status);

  const statusOptions = ["Active", "Inactive", "All Products"];

  const handleSave = () => {
    onApply({
      status: selectedStatus === "All Products" ? null : selectedStatus,
    });
    onClose();
  };

  const handleStatusClick = (option: string) => {
    setSelectedStatus(selectedStatus === option ? null : option);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        zIndex: 1000,
        paddingTop: "160px",
        paddingRight: "40px",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "280px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 style={{ fontWeight: 600, color: "#2D3436", margin: 0, fontSize: "16px" }}>Filter</h5>
        </div>

        {/* Status Filter */}
        <div className="mb-4">
          <label style={{ fontSize: "13px", fontWeight: 500, color: "#636E72", marginBottom: "12px", display: "block" }}>
            Status
          </label>
          <div className="d-flex gap-2 flex-wrap">
            {statusOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleStatusClick(option)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: selectedStatus === option ? "#E85A5A" : "#E9ECEF",
                  background: selectedStatus === option ? "#FFF0F0" : "#fff",
                  color: selectedStatus === option ? "#E85A5A" : "#636E72",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#E85A5A",
            color: "#fff",
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  loading?: boolean;
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  loading,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#FFEBEE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <i
              className="fa-solid fa-trash"
              style={{ color: "#E85A5A", fontSize: "24px" }}
            ></i>
          </div>
          <h5
            style={{ fontWeight: 600, color: "#2D3436", marginBottom: "8px" }}
          >
            Delete Product
          </h5>
          <p style={{ color: "#636E72", fontSize: "14px" }}>
            Are you sure you want to delete <strong>{productName}</strong>? This
            product will be moved to trash.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={onClose}
            className="btn"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #E9ECEF",
              background: "#fff",
              color: "#636E72",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "#E85A5A",
              color: "#fff",
              fontWeight: 500,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ProductManagement Component
export const ProductManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ status: string | null }>({
    status: null,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products using useQuery with filters
  const { data, isLoading, isError } = useProducts({
    page: currentPage,
    limit: 10,
    sortBy: "createdAt:desc",
    search: debouncedSearch || undefined,
    status: filters.status || undefined,
  });

  // Delete mutation
  const deleteProductMutation = useDeleteProduct();

  const products = (data?.data || []).map((product) => ({
    ...product,
    images: product.images?.map((img) =>
      img && !img.startsWith("http") ? `${BASE_URL}${img}` : img
    ) || [],
  }));

  const totalPages = data?.totalPages || 1;
  const totalResults = data?.totalResults || 0;

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/admin/products/edit/${product._id}`);
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/admin/products/view/${product._id}`);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
      },
      onError: () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
      },
    });
  };

  const formatPrice = (price: number, discount: number) => {
    const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;
    return (
      <div>
        <span style={{ fontWeight: 500 }}>${discountedPrice.toFixed(2)}</span>
        {discount > 0 && (
          <>
            <span
              style={{
                textDecoration: "line-through",
                color: "#B2BEC3",
                fontSize: "12px",
                marginLeft: "8px",
              }}
            >
              ${price.toFixed(2)}
            </span>
            <span
              style={{
                color: "#4CAF50",
                fontSize: "11px",
                marginLeft: "4px",
              }}
            >
              -{discount}%
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <ContentWrapper title="Product Management">
      <div className="user-management">
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
              Product Management
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Manage and monitor all registered Products
            </p>
          </div>
          <Button
            onClick={handleAddProduct}
            className="btn d-flex align-items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            Add Product
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="d-flex gap-3 white-box mb-4">
          <div className="flex-grow-1 position-relative">
            <i
              className="fa-solid fa-search position-absolute"
              style={{
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#B2BEC3",
              }}
            ></i>
            <input
              type="text"
              placeholder="Search by product name or detail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control bg-white"
              style={{
                padding: "12px 14px 12px 40px",
                borderRadius: "8px",
                border: " 1px solid #CDCDCD",
                fontSize: "14px",
              }}
            />
          </div>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="btn d-flex align-items-center gap-2"
            style={{
              border: "1px solid #E85A5A",
              color: "#E85A5A",
              padding: "8px 20px",
              borderRadius: "8px",
              background: filters.status ? "#FFF0F0" : "#fff",
              fontWeight: 500,
              fontSize: "14px",
              position: "relative",
            }}
          >
            <i className="fa-solid fa-filter"></i>
            Filter
            {filters.status && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#E85A5A",
                  color: "#fff",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                1
              </span>
            )}
          </button>
        </div>

        {/* Table */}
        <div
          className="table-container"
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #E9ECEF",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAFAFA" }}>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Product Details</th>
                  <th style={thStyle}>Qty</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div
                        className="spinner-border"
                        style={{ color: "#E85A5A" }}
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#E85A5A",
                      }}
                    >
                      Failed to load products. Please try again.
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#636E72",
                      }}
                    >
                      <div>
                        <i
                          className="fa-solid fa-box-open"
                          style={{
                            fontSize: "48px",
                            color: "#E9ECEF",
                            marginBottom: "16px",
                          }}
                        ></i>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                          No products found
                        </p>
                        <p style={{ margin: "8px 0 0", fontSize: "12px" }}>
                          {searchTerm
                            ? "Try adjusting your search"
                            : "Click 'Add Product' to create one"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr
                      key={product._id}
                      style={{ borderBottom: "1px solid #F0F0F0" }}
                    >
                      <td style={tdStyle}>
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td style={tdStyle}>
                        <div className="d-flex align-items-start gap-2">
                          <div
                            style={{
                              width: "40px",
                              minWidth: "40px",
                              height: "40px",
                              borderRadius: "8px",
                              background: "#E9ECEF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.product_name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <i
                                className="fa-solid fa-image"
                                style={{ color: "#B2BEC3", fontSize: "16px" }}
                              ></i>
                            )}
                          </div>
                          <span style={{ fontWeight: 500, color: "#2D3436" }}>
                            {product.product_name}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 500, color: "#636E72" }}>
                          {typeof product.category === 'object' ? product.category.name : "N/A"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            maxWidth: "200px",
                            display: "inline-block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.product_detail}
                        </span>
                      </td>
                      <td style={tdStyle}>{product.quantity}</td>
                      <td style={tdStyle}>
                        {formatPrice(product.price, product.discount)}
                      </td>
                      <td style={tdStyle}>
                        <StatusBadge status={product.status} />
                      </td>
                      <td style={tdStyle}>
                        <ActionDropdown
                          product={product}
                          onEdit={handleEditProduct}
                          onView={handleViewProduct}
                          onDelete={handleDeleteClick}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="d-flex justify-content-between align-items-center p-3"
            style={{ borderTop: "1px solid #F0F0F0" }}
          >
            <div style={{ fontSize: "13px", color: "#636E72" }}>
              Showing {products.length} of {totalResults} products
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  ...paginationBtnStyle,
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNumber = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                }
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      ...paginationBtnStyle,
                      border:
                        currentPage === pageNumber
                          ? "1px solid #000"
                          : "1px solid #E9ECEF",
                      color: currentPage === pageNumber ? "#000" : "#000",
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  ...paginationBtnStyle,
                  opacity:
                    currentPage === totalPages || totalPages === 0 ? 0.5 : 1,
                  cursor:
                    currentPage === totalPages || totalPages === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          productName={productToDelete?.product_name || ""}
          loading={deleteProductMutation.isLoading}
        />

        {/* Filter Modal */}
        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          currentFilters={filters}
        />
      </div>
    </ContentWrapper>
  );
};

// Styles
const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 600,
  color: "#382228",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#636E72",
};

const paginationBtnStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "6px",
  border: "1px solid #E9ECEF",
  background: "#fff",
  color: "#636E72",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "12px",
};
