import { useState, useEffect } from "react";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useHelpAndSupports, useResolveHelpAndSupport, useDeleteHelpAndSupport, HelpAndSupport } from "../../hooks/useHelpAndSupport";
import { Spinner } from "@/components/Elements";
import del from "@/assets/del.svg";

// Status Badge Component
const StatusBadge = ({ isResolved }: { isResolved: boolean }) => {
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
                isResolved 
                    ? "bg-green-100 text-green-700 border border-green-200" 
                    : "bg-amber-100 text-amber-700 border border-amber-200"
            }`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-circle-check text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Resolve Inquiry</h3>
                    <p className="text-gray-500 mt-2">Are you sure you want to mark this inquiry as resolved? This will notify the support team.</p>
                </div>
                <div className="flex gap-3 p-6 bg-gray-50/50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all disabled:opacity-70"
                    >
                        {loading ? "Resolving..." : "Yes, Resolve"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-trash-can text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Delete Inquiry</h3>
                    <p className="text-gray-500 mt-2">Are you sure you want to delete this inquiry? This action cannot be undone and will remove it from the records.</p>
                </div>
                <div className="flex gap-3 p-6 bg-gray-50/50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-70"
                    >
                        {loading ? "Deleting..." : "Yes, Delete"}
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
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Inquiries...</p>
                </div>
            </ContentWrapper>
        );
    }

    if (isError) {
        return (
            <ContentWrapper title="Help & Support">
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-circle-exclamation text-2xl"></i>
                    </div>
                    <p className="text-red-500 font-bold">Failed to load support data</p>
                    <button onClick={() => window.location.reload()} className="text-sm text-gray-500 hover:underline">Try refreshing the page</button>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="Help & Support">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Support Inquiries</h2>
                        <p className="text-gray-500 mt-1">Manage and respond to user questions and feedback.</p>
                    </div>
                    <div className="px-6 py-2 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest">
                        {totalResults} Total Inquiries
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                            <i className="fa-solid fa-magnifying-glass text-sm"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm outline-none font-medium"
                        />
                    </div>
                    <select
                        value={isResolvedFilter === undefined ? "all" : isResolvedFilter ? "resolved" : "pending"}
                        onChange={(e) => {
                            const val = e.target.value;
                            setIsResolvedFilter(val === "all" ? undefined : val === "resolved");
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-48 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending Only</option>
                        <option value="resolved">Resolved Only</option>
                    </select>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">User & Date</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Inquiry Message</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data?.results.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                                                <span className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-tighter">
                                                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-gray-900 font-medium">{item.email}</span>
                                                <span className="text-gray-400 text-xs font-bold">{item.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-gray-600 line-clamp-2 max-w-md font-medium italic">
                                                "{item.message}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge isResolved={item.isResolved} />
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!item.isResolved && (
                                                    <button
                                                        onClick={() => handleResolveClick(item)}
                                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition-all shadow-sm"
                                                        title="Mark as Resolved"
                                                    >
                                                        <i className="fa-solid fa-check text-xs"></i>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteClick(item)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-all shadow-sm"
                                                    title="Delete"
                                                >
                                                    <i className="fa-solid fa-trash-can text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data?.results.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                                    <i className="fa-solid fa-envelope-open-text text-3xl"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-bold text-gray-900">No inquiries found</p>
                                                    <p className="text-gray-500 mt-1">There are no support tickets matching your criteria.</p>
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
