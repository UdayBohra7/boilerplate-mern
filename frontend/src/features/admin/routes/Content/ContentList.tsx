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
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Content...</p>
                </div>
            </ContentWrapper>
        );
    }

    if (isError) {
        return (
            <ContentWrapper title="Content Management">
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-circle-exclamation text-2xl"></i>
                    </div>
                    <p className="text-red-500 font-bold">Failed to load content data</p>
                    <button onClick={() => window.location.reload()} className="text-sm text-gray-500 hover:underline">Try refreshing the page</button>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="Content Management">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Legal & Info Content</h2>
                        <p className="text-gray-500 mt-1">Manage Privacy Policy, Terms of Service, and other legal documents.</p>
                    </div>
                    <div className="px-6 py-2 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest">
                        {totalResults} Documents
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Document Title</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Preview Description</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data?.data.map((item: Content) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                                                <span className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-tighter">
                                                    Updated {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-gray-500 line-clamp-1 max-w-xl font-medium">
                                                {stripHtmlAndTruncate(item.description, 120)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all shadow-sm"
                                                    title="Edit Content"
                                                >
                                                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleView(item.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100 transition-all shadow-sm"
                                                    title="View Details"
                                                >
                                                    <i className="fa-solid fa-eye text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data?.data.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                                    <i className="fa-solid fa-file-circle-exclamation text-3xl"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-bold text-gray-900">No content found</p>
                                                    <p className="text-gray-500 mt-1">There are no documents matching your criteria.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    {totalPages > 1 && (
                        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <i className="fa-solid fa-chevron-left text-[10px]"></i>
                                </button>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ContentWrapper>
    );
};
