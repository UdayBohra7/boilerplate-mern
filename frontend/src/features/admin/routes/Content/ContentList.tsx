import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useContents, Content } from "../../hooks/useContent";
import { Spinner } from "@/components/Elements";
import view from "@/assets/view.svg";
import edit from "@/assets/edit.svg";
import { decodeHtml } from "@/utils/html";

export const ContentList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data, isLoading, isError } = useContents({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
    });

    const totalPages = data?.pagination?.totalPages || 1;
    const totalResults = data?.pagination?.totalResults || 0;

    const handleEdit = (id: string) => {
        navigate(`/admin/content/edit/${id}`);
    };

    const handleView = (id: string) => {
        navigate(`/admin/content/view/${id}`);
    };

    const handleAdd = () => {
        navigate("/admin/content/add");
    };

    // Helper to strip HTML tags and truncate
    const stripHtmlAndTruncate = (html: string, maxLength: number) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = decodeHtml(html);
        const text = tmp.textContent || tmp.innerText || "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    if (isLoading) {
        return (
            <ContentWrapper title="Content Management">
                <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                    <Spinner size="lg" />
                </div>
            </ContentWrapper>
        );
    }

    if (isError) {
        return (
            <ContentWrapper title="Content Management">
                <div className="alert alert-danger">Error loading content</div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="Content Management">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                <div className="card-body p-4">
                    {/* Header Controls */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <h5 style={{ margin: 0, fontWeight: 600 }}>Content Management</h5>
                        </div>
                        {/* <div className="d-flex align-items-center gap-3">
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
                                    placeholder="Search by title..."
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
                            <button
                                onClick={handleAdd}
                                className="btn btn-primary"
                                style={{
                                    background: "#E85A5A",
                                    borderColor: "#E85A5A",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    padding: "8px 16px",
                                }}
                            >
                                <i className="fa-solid fa-plus me-2"></i>
                                Add Content
                            </button>
                        </div> */}
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: "25%", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0" }}>Title</th>
                                    <th style={{ width: "55%", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0" }}>Description</th>
                                    <th style={{ width: "20%", fontWeight: 600, color: "#4A5568", borderBottom: "1px solid #E2E8F0" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.data.map((item: Content) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #F7FAFC" }}>
                                        <td className="py-3">
                                            <div style={{ fontWeight: 500, color: "#2D3748" }}>{item.title}</div>
                                            <div style={{ fontSize: "12px", color: "#718096" }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="py-3">
                                            <div style={{ fontSize: "13px", color: "#4A5568" }}>
                                                {stripHtmlAndTruncate(item.description, 100)}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="btn p-0"
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                    title="Edit"
                                                >
                                                    <img src={edit} className="table-action-ico" alt="edit" />
                                                </button>
                                                <button
                                                    onClick={() => handleView(item.id)}
                                                    className="btn p-0"
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                    title="View"
                                                >
                                                    <img src={view} className="table-action-ico" alt="view" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data?.data.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center py-5" style={{ color: "#A0AEC0" }}>
                                            No content found
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
        </ContentWrapper>
    );
};
