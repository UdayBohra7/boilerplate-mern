import { useState, useEffect } from "react";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useHelpAndSupports, useResolveHelpAndSupport, useDeleteHelpAndSupport, HelpAndSupport } from "../../hooks/useHelpAndSupport";
import { Spinner } from "@/components/Elements";
import del from "@/assets/del.svg";

// Status Badge Component
const StatusBadge = ({ isResolved }: { isResolved: boolean }) => {
    return (
        <span
            style={{
                background: isResolved ? "#E8F5E9" : "#FFF3E0",
                color: isResolved ? "#4CAF50" : "#FF9800",
                border: `1px solid ${isResolved ? "#C8E6C9" : "#FFE0B2"}`,
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 500,
            }}
        >
            {isResolved ? "Resolved" : "Pending"}
        </span>
    );
};

// Resolve Confirmation Modal
interface ResolveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

const ResolveModal = ({ isOpen, onClose, onConfirm, loading }: ResolveModalProps) => {
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
                    <h5 style={{ fontWeight: 600, color: "#2D3436", marginBottom: "8px" }}>
                        Resolve Inquiry
                    </h5>
                    <p style={{ color: "#636E72", fontSize: "14px" }}>
                        Are you sure you want to mark this inquiry as resolved?
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
                            background: "#4CAF50",
                            color: "#fff",
                            fontWeight: 500,
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Resolving..." : "Resolve"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }: DeleteModalProps) => {
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
                        <i className="fa-solid fa-trash" style={{ color: "#E85A5A", fontSize: "24px" }}></i>
                    </div>
                    <h5 style={{ fontWeight: 600, color: "#2D3436", marginBottom: "8px" }}>
                        Delete Inquiry
                    </h5>
                    <p style={{ color: "#636E72", fontSize: "14px" }}>
                        Are you sure you want to delete this inquiry? This action cannot be undone.
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

export const HelpAndSupportPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isResolvedFilter, setIsResolvedFilter] = useState<boolean | undefined>(undefined);

    const [resolveModalOpen, setResolveModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<HelpAndSupport | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, isError } = useHelpAndSupports({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
        isResolved: isResolvedFilter,
        sortBy: "createdAt:desc",
    });

    const resolveMutation = useResolveHelpAndSupport();
    const deleteMutation = useDeleteHelpAndSupport();

    const handleResolveClick = (item: HelpAndSupport) => {
        setSelectedItem(item);
        setResolveModalOpen(true);
    };

    const handleDeleteClick = (item: HelpAndSupport) => {
        setSelectedItem(item);
        setDeleteModalOpen(true);
    };

    const handleResolveConfirm = () => {
        if (selectedItem) {
            resolveMutation.mutate(selectedItem.id, {
                onSuccess: () => {
                    setResolveModalOpen(false);
                    setSelectedItem(null);
                },
            });
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedItem) {
            deleteMutation.mutate(selectedItem.id, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSelectedItem(null);
                },
            });
        }
    };

    const totalPages = data?.totalPages || 1;
    const totalResults = data?.totalResults || 0;

    if (isLoading) {
        return (
            <ContentWrapper title="Help & Support">
                <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                    <Spinner size="lg" />
                </div>
            </ContentWrapper>
        );
    }

    if (isError) {
        return (
            <ContentWrapper title="Help & Support">
                <div className="alert alert-danger">Error loading data</div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="Help & Support">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                <div className="card-body p-4">
                    {/* Header Controls */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <h5 style={{ margin: 0, fontWeight: 600 }}>Inquiries ({totalResults})</h5>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <div className="search-box position-relative">
                                <i
                                    className="fa-solid fa-magnifying-glass position-absolute"
                                    style={{
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#A0AEC0",
                                        fontSize: "14px",
                                    }}
                                ></i>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        padding: "8px 12px 8px 36px",
                                        borderRadius: "8px",
                                        border: "1px solid #E2E8F0",
                                        width: "280px",
                                        fontSize: "14px",
                                    }}
                                />
                            </div>

                            <select
                                value={isResolvedFilter === undefined ? "all" : isResolvedFilter ? "resolved" : "pending"}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setIsResolvedFilter(val === "all" ? undefined : val === "resolved");
                                    setCurrentPage(1);
                                }}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #E2E8F0",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "20%", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0" }}>User</th>
                                    <th style={{ width: "15%", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0" }}>Contact</th>
                                    <th style={{ width: "35%", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0" }}>Message</th>
                                    <th style={{ width: "15%", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0" }}>Status</th>
                                    <th style={{ width: "15%", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.results.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #F7FAFC" }}>
                                        <td className="py-3">
                                            <div>
                                                <div style={{ fontWeight: 500, color: "#2D3748" }}>{item.name}</div>
                                                <div style={{ fontSize: "12px", color: "#718096" }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div style={{ fontSize: "13px", color: "#4A5568" }}>
                                                <div>{item.email}</div>
                                                <div>{item.phone}</div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div style={{ fontSize: "13px", color: "#4A5568", maxHeight: "60px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {item.message}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <StatusBadge isResolved={item.isResolved} />
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex gap-2">
                                                {!item.isResolved && (
                                                    <button
                                                        onClick={() => handleResolveClick(item)}
                                                        title="Mark as Resolved"
                                                        className="btn p-1"
                                                        style={{ color: "#4CAF50", background: "#E8F5E9", border: "none", borderRadius: "4px" }}
                                                    >
                                                        <i className="fa-solid fa-check"></i>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    title="Delete"
                                                    className="btn p-1"
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        width: "max-content",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <img src={del} className="table-action-ico" alt="delete" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data?.results.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-5" style={{ color: "#A0AEC0" }}>
                                            No inquiries found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-end mt-4">
                            <div className="d-flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="btn btn-sm btn-outline-secondary"
                                    style={{ borderRadius: "6px" }}
                                >
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <span className="d-flex align-items-center px-2" style={{ fontSize: "14px", color: "#4A5568" }}>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="btn btn-sm btn-outline-secondary"
                                    style={{ borderRadius: "6px" }}
                                >
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ResolveModal
                isOpen={resolveModalOpen}
                onClose={() => setResolveModalOpen(false)}
                onConfirm={handleResolveConfirm}
                loading={resolveMutation.isLoading}
            />

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={deleteMutation.isLoading}
            />
        </ContentWrapper>
    );
};
