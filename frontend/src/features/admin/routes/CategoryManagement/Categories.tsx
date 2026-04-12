import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useCategories, useDeleteCategory, Category } from "../../hooks/useCategories";
import { Button } from "@/components/Elements";
import { BASE_URL } from "@/lib/config";
import edit from "@/assets/edit.svg";
import del from "@/assets/del.svg";
import view from "@/assets/view.svg";

interface ActionDropdownProps {
    category: Category;
    onEdit: (category: Category) => void;
    onView: (category: Category) => void;
    onDelete: (category: Category) => void;
}

const ActionDropdown = ({
    category,
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
                    onEdit(category);
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
                <img src={edit} className="table-action-ico" alt="edit" />
             
            </button>
            <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => {
                    onView(category);
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
                <img src={view} className="table-action-ico" alt="view" />
            </button>
            <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => {
                    onDelete(category);
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
                <img src={del} className="table-action-ico" alt="delete" />        
            </button>
        </div>
        // <div className="action-dropdown" style={{ position: "relative" }}>
        //     <button
        //         className="action-btn bg-transparent border-0 p-0"
        //         onClick={() => setIsOpen(!isOpen)}
        //         style={{ position: "relative", zIndex: isOpen ? 1001 : 1 }}
        //     >
        //         <i className="fa-solid fa-ellipsis" style={{ color: "#636E72" }}></i>
        //     </button>
        //     {isOpen && (
        //         <>
        //             <div
        //                 className="dropdown-overlay"
        //                 onClick={() => setIsOpen(false)}
        //                 style={{
        //                     position: "fixed",
        //                     top: 0,
        //                     left: 0,
        //                     right: 0,
        //                     bottom: 0,
        //                     zIndex: 1000,
        //                     background: "transparent",
        //                 }}
        //             />
        //             <div
        //                 className="dropdown-menu show"
        //                 style={{
        //                     position: "absolute",
        //                     zIndex: 1002,
        //                     minWidth: "160px",
        //                     background: "#fff",
        //                     borderRadius: "8px",
        //                     boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        //                     border: "1px solid #E9ECEF",
        //                     padding: "8px 0",
        //                     // transform: "translateX(-15%)",
        //                     marginTop: "0px",
        //                     right: 0
        //                 }}
        //             >
        //                 <button
        //                     className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
        //                     onClick={() => {
        //                         onEdit(category);
        //                         setIsOpen(false);
        //                     }}
        //                     style={{
        //                         background: "none",
        //                         border: "none",
        //                         width: "100%",
        //                         textAlign: "left",
        //                         cursor: "pointer",
        //                     }}
        //                 >
        //                     <img src={edit} className="table-action-ico" alt="edit" />
        //                     <span style={{ fontSize: "13px", color: "#2D3436" }}>
        //                         Edit Category
        //                     </span>
        //                 </button>
        //                 <button
        //                     className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
        //                     onClick={() => {
        //                         onView(category);
        //                         setIsOpen(false);
        //                     }}
        //                     style={{
        //                         background: "none",
        //                         border: "none",
        //                         width: "100%",
        //                         textAlign: "left",
        //                         cursor: "pointer",
        //                     }}
        //                 >
        //                     <img src={view} className="table-action-ico" alt="view" />
        //                     <span style={{ fontSize: "13px", color: "#2D3436" }}>
        //                         View Detail
        //                     </span>
        //                 </button>
        //                 <button
        //                     className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
        //                     onClick={() => {
        //                         onDelete(category);
        //                         setIsOpen(false);
        //                     }}
        //                     style={{
        //                         background: "none",
        //                         border: "none",
        //                         width: "100%",
        //                         textAlign: "left",
        //                         cursor: "pointer",
        //                     }}
        //                 >
        //                     <img src={del} className="table-action-ico" alt="delete" />
        //                     <span style={{ fontSize: "13px", color: "#E85A5A" }}>
        //                         Delete Category
        //                     </span>
        //                 </button>
        //             </div>
        //         </>
        //     )}
        // </div>
    );
};

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    categoryName: string;
    loading?: boolean;
}

const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    categoryName,
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
                        Delete Category
                    </h5>
                    <p style={{ color: "#636E72", fontSize: "14px" }}>
                        Are you sure you want to delete <strong>{categoryName}</strong>? This
                        action cannot be undone.
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

export const Categories = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading } = useCategories({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
    });

    const deleteCategoryMutation = useDeleteCategory();

    const categories = data?.data || [];
    const pagination = data?.pagination;
    const totalPages = pagination?.totalPages || 1;

    const handleAddCategory = () => {
        navigate("/admin/categories/add");
    };

    const handleEditCategory = (category: Category) => {
        navigate(`/admin/categories/edit/${category._id}`);
    };

    const handleViewCategory = (category: Category) => {
        navigate(`/admin/categories/view/${category._id}`);
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!categoryToDelete) return;
        deleteCategoryMutation.mutate(categoryToDelete._id, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
            onError: () => {
                setDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    return (
        <ContentWrapper title="Category Management">
            <div className="category-management">
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
                            Category Management
                        </h2>
                        <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
                            Manage and monitor all categories
                        </p>
                    </div>
                    <Button
                        onClick={handleAddCategory}
                        className="btn d-flex align-items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add Category
                    </Button>
                </div>

                {/* Search Bar */}
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
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control bg-white"
                            style={{
                                padding: "12px 14px 12px 40px",
                                borderRadius: "8px",
                                border: "1px solid #CDCDCD",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div
                    className="table-responsive bg-white rounded-3 shadow-sm border border-light-subtle"
                    style={{ overflowX: "visible" }}
                >
                    <table className="table mb-0 align-middle custom-table">
                        <thead>
                            <tr>
                                <th
                                    className="bg-light border-bottom border-light-subtle text-secondary fw-semibold ps-4"
                                    style={{ fontSize: "13px", height: "48px", width: "80px" }}
                                >
                                    Image
                                </th>
                                <th
                                    className="bg-light border-bottom border-light-subtle text-secondary fw-semibold"
                                    style={{ fontSize: "13px", height: "48px" }}
                                >
                                    Name
                                </th>
                                <th
                                    className="bg-light border-bottom border-light-subtle text-secondary fw-semibold"
                                    style={{ fontSize: "13px", height: "48px" }}
                                >
                                    Description
                                </th>
                                <th
                                    className="bg-light border-bottom border-light-subtle text-secondary fw-semibold  pe-4"
                                    style={{ fontSize: "13px", height: "48px" }}
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-5 text-muted">
                                        Loading...
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-5 text-muted">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category._id} className="border-bottom border-light-subtle">
                                        <td className="ps-4">
                                            <div
                                                style={{
                                                    width: "50px",
                                                    minWidth: "50px",
                                                    height: "50px",
                                                    borderRadius: "8px",
                                                    overflow: "hidden",
                                                    background: "#F5F5F5",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {category.image ? (
                                                    <img
                                                        src={category.image.startsWith('http') ? category.image : `${BASE_URL}/${category.image}`}
                                                        alt={category.name}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <i
                                                        className="fa-solid fa-image"
                                                        style={{ color: "#B2BEC3", fontSize: "18px" }}
                                                    ></i>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    color: "#2D3436",
                                                }}
                                            >
                                                {category.name}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#2D3436",
                                                }}
                                            >
                                                {category.description}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <ActionDropdown
                                                category={category}
                                                onEdit={handleEditCategory}
                                                onView={handleViewCategory}
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
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div style={{ color: "#636E72", fontSize: "14px" }}>
                        Showing {categories.length} of  {categories.length}  results
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            style={{
                                border: "1px solid #E9ECEF",
                                background: "#fff",
                                color: currentPage === 1 ? "#B2BEC3" : "#636E72",
                            }}
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            style={{
                                border: "1px solid #E9ECEF",
                                background: "#fff",
                                color: currentPage === totalPages ? "#B2BEC3" : "#636E72",
                            }}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                categoryName={categoryToDelete?.name || ""}
                loading={deleteCategoryMutation.isLoading}
            />
        </ContentWrapper>
    );
};
