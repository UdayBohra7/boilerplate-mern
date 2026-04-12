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
                <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                    <Spinner size="lg" />
                </div>
            </ContentWrapper>
        );
    }

    if (!content) {
        return (
            <ContentWrapper title="View Content">
                <div className="alert alert-danger">Content not found</div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title={content.title}>
            <div className="d-flex justify-content-end mb-4">
                <button
                    onClick={() => navigate("/admin/content")}
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: "8px", padding: "8px 16px" }}
                >
                    <i className="fa-solid fa-arrow-left me-2"></i>
                    Back to List
                </button>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    {/* Mobile Device Frame */}
                    <div
                        className="mx-auto bg-white position-relative"
                        style={{
                            maxWidth: "375px",
                            height: "812px", // iPhone X height
                            border: "12px solid #2D3436",
                            borderRadius: "40px",
                            overflow: "hidden",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        }}
                    >
                        {/* Status Bar */}
                        <div style={{ background: "#fff", padding: "12px 24px 8px", fontSize: "12px", fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>9:41</span>
                            <div className="d-flex gap-2">
                                <i className="fa-solid fa-signal"></i>
                                <i className="fa-solid fa-wifi"></i>
                                <i className="fa-solid fa-battery-full"></i>
                            </div>
                        </div>

                        {/* App Header */}
                        <div style={{ padding: "12px 20px", borderBottom: "1px solid #F7FAFC", display: "flex", alignItems: "center", gap: "12px" }}>
                            <i className="fa-solid fa-arrow-left" style={{ fontSize: "18px" }}></i>
                            <h6 style={{ margin: 0, fontWeight: 700, fontSize: "16px", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{content.title}</h6>
                        </div>

                        {/* Content Area */}
                        <div style={{ height: "calc(100% - 100px)", overflowY: "auto", padding: "20px" }} className="mobile-content-scroll">
                            <h5 style={{ fontWeight: 700, marginBottom: "8px", color: "#1A202C" }}>{content.title}</h5>
                            <p style={{ fontSize: "12px", color: "#A0AEC0", marginBottom: "20px" }}>
                                {moment(content.updatedAt).format("MMMM D, YYYY")}
                            </p>

                            <div
                                className="content-body"
                                style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A5568" }}
                                dangerouslySetInnerHTML={{ __html: decodeHtml(content.description) }}
                            />
                        </div>

                        {/* Home Indicator */}
                        <div className="position-absolute bottom-0 w-100 d-flex justify-content-center pb-3" style={{ background: "rgba(255,255,255,0.9)" }}>
                            <div style={{ width: "120px", height: "4px", background: "#CBD5E0", borderRadius: "2px" }}></div>
                        </div>
                    </div>
                    <div className="text-center mt-3 text-muted" style={{ fontSize: "13px" }}>
                        Mobile Preview
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};
