import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useContent, useEditContent } from "../../hooks/useContent";
import { RichTextEditor } from "./components/RichTextEditor";
import { Spinner } from "@/components/Elements";
import { toast } from "react-toastify";
import { decodeHtml } from "@/utils/html";

export const EditContent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: content, isLoading } = useContent(id || "");
    const editMutation = useEditContent();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (content) {
            setTitle(content.title);
            setDescription(decodeHtml(content.description));
        }
    }, [content]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            toast.error("Please fill in all fields");
            return;
        }
        if (id) {
            editMutation.mutate(
                { id, data: { title, description } },
                {
                    onSuccess: () => {
                        navigate("/admin/content");
                    },
                }
            );
        }
    };

    if (isLoading) {
        return (
            <ContentWrapper title="Edit Content">
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Editor...</p>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="Edit Content">
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Document</h2>
                        <p className="text-gray-500 mt-1">Update the content and formatting of your legal documentation.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/content")}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <i className="fa-solid fa-arrow-left text-xs"></i>
                        Back to List
                    </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Document Title
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter content title"
                                    disabled
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-500 font-bold cursor-not-allowed outline-none"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <i className="fa-solid fa-lock text-gray-300 text-sm"></i>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium ml-1">Title is fixed to maintain system integrity.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Content Body
                            </label>
                            <div className="rounded-2xl border border-gray-100 overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
                                <RichTextEditor
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Start writing your content here..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/content")}
                                className="px-8 py-3.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
                            >
                                Cancel Changes
                            </button>
                            <button
                                type="submit"
                                disabled={editMutation.isLoading}
                                className="px-10 py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center justify-center gap-2"
                            >
                                {editMutation.isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving Changes...
                                    </>
                                ) : (
                                    "Publish Updates"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ContentWrapper>
    );
};
