import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useContent } from "../../hooks/useContent";
import { Spinner } from "@/components/Elements";
import moment from "moment";

// Helper to decode HTML entities
const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

export const ViewContent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: content, isLoading } = useContent(id || "");

    if (isLoading) {
        return (
            <ContentWrapper title="View Content">
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Generating Preview...</p>
                </div>
            </ContentWrapper>
        );
    }

    if (!content) {
        return (
            <ContentWrapper title="View Content">
                <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-circle-xmark text-2xl"></i>
                    </div>
                    <p className="text-red-500 font-bold">Document not found</p>
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title={`Preview: ${content.title}`}>
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{content.title}</h2>
                        <p className="text-gray-500 mt-1">Live mobile preview of how this content appears to your users.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => navigate(`/admin/content/edit/${id}`)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                        >
                            <i className="fa-solid fa-pen-nib text-xs"></i>
                            Edit Content
                        </button>
                        <button
                            onClick={() => navigate("/admin/content")}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all"
                        >
                            <i className="fa-solid fa-arrow-left text-xs"></i>
                            Back
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Raw View / Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-8">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Document Metadata</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Last Updated</p>
                                    <p className="text-sm font-bold text-gray-900">{moment(content.updatedAt).format("MMM DD, YYYY")}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Status</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-green-100 text-green-700 uppercase">Live</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50">
                            <h4 className="text-blue-900 font-bold mb-2">Editor's Tip</h4>
                            <p className="text-blue-700/80 text-sm leading-relaxed">
                                Use the mobile preview on the right to ensure your formatting (headings, lists, and spacing) remains readable on smaller screens. 
                            </p>
                        </div>
                    </div>

                    {/* Mobile Preview Area */}
                    <div className="flex flex-col items-center">
                        <div className="relative mx-auto">
                            {/* Device Frame */}
                            <div className="relative z-10 w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden ring-4 ring-gray-900/5">
                                {/* Top Speaker / Camera Area */}
                                <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 z-30 flex justify-center items-end pb-1">
                                    <div className="w-16 h-1 bg-gray-800 rounded-full"></div>
                                </div>
                                
                                {/* Screen Content */}
                                <div className="absolute inset-0 bg-white overflow-y-auto scrollbar-hide pt-6 pb-12">
                                    {/* Mobile App Header */}
                                    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                                        <i className="fa-solid fa-chevron-left text-gray-900"></i>
                                        <h4 className="text-sm font-black text-gray-900 truncate">{content.title}</h4>
                                    </div>
                                    
                                    {/* App Content */}
                                    <div className="px-6 py-8">
                                        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">{content.title}</h1>
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">
                                            Last Updated: {moment(content.updatedAt).format("MMMM D, YYYY")}
                                        </p>
                                        
                                        <div 
                                            className="prose prose-sm prose-slate max-w-none text-gray-600 leading-relaxed space-y-4"
                                            dangerouslySetInnerHTML={{ __html: decodeHtml(content.description) }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Bottom Indicator */}
                                <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none"></div>
                                <div className="absolute bottom-2 inset-x-0 flex justify-center z-30">
                                    <div className="w-24 h-1 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                            
                            {/* Device Reflection / Glow */}
                            <div className="absolute -inset-4 bg-blue-500/10 blur-3xl -z-10 rounded-full"></div>
                        </div>
                        <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Mobile Interaction Preview</p>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};
