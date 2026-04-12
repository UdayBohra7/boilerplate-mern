import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import edit from "@/assets/edit.svg";
import del from "@/assets/del.svg";
import { useMeals, useDeleteMeal, Meal } from "../../hooks/useMeals";

interface ActionDropdownProps {
    meal: Meal;
    onEdit: (meal: Meal) => void;
    onDelete: (meal: Meal) => void;
}

const ActionDropdown = ({
    meal,
    onEdit,
    onDelete,
}: ActionDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="actions-btns d-flex align-items-center gap-2">
            <button
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => {
                    onEdit(meal);
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
                className="dropdown-item d-flex align-items-center gap-2"
                onClick={() => {
                    onDelete(meal);
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
        // <div className="action-dropdown" style={{ position: "static" }}>
        //     <button
        //         className="action-btn bg-transparent border-0 p-2"
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
        //                     position: "fixed",
        //                     zIndex: 1002,
        //                     minWidth: "160px",
        //                     background: "#fff",
        //                     borderRadius: "8px",
        //                     boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        //                     border: "1px solid #E9ECEF",
        //                     padding: "8px 0",
        //                     transform: "translateX(-75%)",
        //                     marginTop: "4px",
        //                 }}
        //             >
        //                 <button
        //                     className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
        //                     onClick={() => {
        //                         onEdit(meal);
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
        //                     <img src={edit} className="table-action-ico" />
        //                     <span style={{ fontSize: "13px", color: "#2D3436" }}>
        //                         Edit Meal
        //                     </span>
        //                 </button>
        //                 <button
        //                     className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
        //                     onClick={() => {
        //                         onDelete(meal);
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
        //                     <img src={del} className="table-action-ico" />
        //                     <span style={{ fontSize: "13px", color: "#E85A5A" }}>
        //                         Delete Meal
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
    mealName: string;
    loading?: boolean;
}

const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    mealName,
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
                        Delete Meal
                    </h5>
                    <p style={{ color: "#636E72", fontSize: "14px" }}>
                        Are you sure you want to delete <strong>{mealName}</strong>?
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

export const Meals = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, isError } = useMeals({
        page: currentPage,
        limit: 10,
        sortBy: "createdAt:desc",
        mealName: debouncedSearch || undefined,
    });

    const deleteMealMutation = useDeleteMeal();

    const meals = data?.results || [];
    const totalPages = data?.totalPages || 1;
    const totalResults = data?.totalResults || 0;

    const handleAddMeal = () => {
        navigate("/admin/meals/add");
    };

    const handleEditMeal = (meal: Meal) => {
        navigate(`/admin/meals/edit/${meal.id}`);
    };

    const handleDeleteClick = (meal: Meal) => {
        setMealToDelete(meal);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!mealToDelete) return;
        deleteMealMutation.mutate(mealToDelete.id, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setMealToDelete(null);
            },
            onError: () => {
                setDeleteModalOpen(false);
                setMealToDelete(null);
            },
        });
    };

    return (
        <ContentWrapper title="Meal Management">
            <div className="meal-management">
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
                            Meal Management
                        </h2>
                        <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
                            Manage Marissa Meal Collection
                        </p>
                    </div>
                    <Button
                        onClick={handleAddMeal}
                        className="btn d-flex align-items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add Meal
                    </Button>
                </div>

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
                            placeholder="Search by meal name..."
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
                </div>

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
                                    <th style={thStyle}>Meal Name</th>
                                    <th style={thStyle}>Category</th>
                                    <th style={thStyle}>Calories</th>
                                    <th style={thStyle}>Protein</th>
                                    <th style={thStyle}>Carbs</th>
                                    <th style={thStyle}>Fat</th>
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
                                            Failed to load meals. Please try again.
                                        </td>
                                    </tr>
                                ) : meals.length === 0 ? (
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
                                                    className="fa-solid fa-utensils"
                                                    style={{
                                                        fontSize: "48px",
                                                        color: "#E9ECEF",
                                                        marginBottom: "16px",
                                                    }}
                                                ></i>
                                                <p style={{ margin: 0, fontWeight: 500 }}>
                                                    No meals found
                                                </p>
                                                <p style={{ margin: "8px 0 0", fontSize: "12px" }}>
                                                    {searchTerm
                                                        ? "Try adjusting your search"
                                                        : "Click 'Add Meal' to create one"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    meals.map((meal, index) => (
                                        <tr
                                            key={meal.id}
                                            style={{ borderBottom: "1px solid #F0F0F0" }}
                                        >
                                            <td style={tdStyle}>
                                                {(currentPage - 1) * 10 + index + 1}
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 500, color: "#2D3436" }}>
                                                    {meal.mealName}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ fontWeight: 500, color: "#636E72" }}>
                                                    {meal.category}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>{meal.total?.calories || 0}</td>
                                            <td style={tdStyle}>{meal.total?.protein || 0}g</td>
                                            <td style={tdStyle}>{meal.total?.carbs || 0}g</td>
                                            <td style={tdStyle}>{meal.total?.fat || 0}g</td>
                                            <td style={tdStyle}>
                                                <ActionDropdown
                                                    meal={meal}
                                                    onEdit={handleEditMeal}
                                                    onDelete={handleDeleteClick}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="d-flex justify-content-between align-items-center p-3"
                        style={{ borderTop: "1px solid #F0F0F0" }}
                    >
                        <div style={{ fontSize: "13px", color: "#636E72" }}>
                            Showing {meals.length} of {totalResults} meals
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
                                disabled={currentPage === totalPages}
                                style={{
                                    ...paginationBtnStyle,
                                    opacity: currentPage === totalPages ? 0.5 : 1,
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                }}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                mealName={mealToDelete?.mealName || ""}
                loading={deleteMealMutation.isLoading}
            />
        </ContentWrapper>
    );
};

const thStyle = {
    padding: "16px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#636E72",
    textAlign: "left" as const,
    borderBottom: "1px solid #E9ECEF",
    whiteSpace: "nowrap" as const,
};

const tdStyle = {
    padding: "16px",
    fontSize: "14px",
    color: "#2D3436",
    verticalAlign: "middle",
};

const paginationBtnStyle = {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    borderRadius: "6px",
    fontSize: "13px",
    transition: "all 0.2s",
};
