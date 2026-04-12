import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useCategory } from "../../hooks/useCategories";
import { Button } from "@/components/Elements";
import { BASE_URL } from "@/lib/config";

export const CategoryView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading } = useCategory(id || "");

    const getImageUrl = (imagePath: string) => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `${BASE_URL}/${imagePath}`;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const category = data?.data;

    return (
        <ContentWrapper title="View Category">
            <div className="category-view-page">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#2D3436", marginBottom: "4px" }}>
                            Category Details
                        </h2>
                        <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
                            View category information
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/admin/categories")}
                        className="btn d-flex align-items-center gap-2"
                    >
                        <i className="fa-solid fa-arrow-left"></i> {" "}
                        Back to Categories
                    </Button>
                </div>

                {/* Content */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #E9ECEF",
                        padding: "32px",
                    }}
                >
                    <div className="row">
                        {/* Image Section */}
                        <div className="col-md-4 mb-4">
                            <label style={labelStyle}>Category Image</label>
                            <div
                                style={{
                                    background: "#FAFAFA",
                                    borderRadius: "12px",
                                    border: "1px solid #E9ECEF",
                                    padding: "16px",
                                    minHeight: "200px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {category?.image ? (
                                    <img
                                        src={getImageUrl(category.image)}
                                        alt={category.name}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "200px",
                                            objectFit: "contain",
                                            borderRadius: "8px",
                                        }}
                                    />
                                ) : (
                                    <div style={{ textAlign: "center", color: "#B2BEC3" }}>
                                        <i
                                            className="fa-solid fa-image"
                                            style={{ fontSize: "48px", marginBottom: "12px", display: "block" }}
                                        ></i>
                                        <p style={{ margin: 0, fontSize: "14px" }}>No image available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-12 mb-4">
                                    <label style={labelStyle}>Name</label>
                                    <div style={valueStyle}>{category?.name}</div>
                                </div>
                                <div className="col-12 mb-4">
                                    <label style={labelStyle}>Description</label>
                                    <div style={valueStyle}>{category?.description}</div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label style={labelStyle}>Created At</label>
                                    <div style={valueStyle}>
                                        {category?.createdAt ? new Date(category.createdAt).toLocaleString() : "N/A"}
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label style={labelStyle}>Last Updated</label>
                                    <div style={valueStyle}>
                                        {category?.updatedAt ? new Date(category.updatedAt).toLocaleString() : "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#8391A1",
    marginBottom: "8px",
};

const valueStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#2D3436",
    fontWeight: 400,
    padding: "12px 16px",
    background: "#FAFAFA",
    borderRadius: "8px",
    border: "1px solid #E9ECEF",
};
