import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useCreateCategory } from "../../hooks/useCategories";
import { Button } from "@/components/Elements";

export const CategoryAdd = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const createCategoryMutation = useCreateCategory();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("description", formData.description);

        if (image) {
            submitData.append("image", image);
        }

        createCategoryMutation.mutate(submitData, {
            onSuccess: () => {
                navigate("/admin/categories");
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }));
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }));
            return;
        }

        setImage(file);
        setErrors((prev) => ({ ...prev, image: "" }));

        // Generate preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <ContentWrapper title="Add Category">
            <div className="category-form-page">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#2D3436", marginBottom: "4px" }}>
                            Add New Category
                        </h2>
                        <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
                            Create a new category
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

                {/* Form */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #E9ECEF",
                        padding: "32px",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Image Upload Section */}
                            <div className="col-md-4 mb-4">
                                <label style={labelStyle}>Category Image</label>
                                <div
                                    style={{
                                        border: "2px dashed #E9ECEF",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        textAlign: "center",
                                        background: "#FAFAFA",
                                        minHeight: "200px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                    }}
                                >
                                    {imagePreview ? (
                                        <div style={{ position: "relative", width: "100%" }}>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "180px",
                                                    objectFit: "contain",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                style={{
                                                    position: "absolute",
                                                    top: "-10px",
                                                    right: "-10px",
                                                    width: "28px",
                                                    height: "28px",
                                                    borderRadius: "50%",
                                                    background: "#E85A5A",
                                                    color: "#fff",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <i
                                                className="fa-solid fa-cloud-upload-alt"
                                                style={{ fontSize: "40px", color: "#B2BEC3", marginBottom: "12px" }}
                                            ></i>
                                            <p style={{ color: "#636E72", fontSize: "14px", marginBottom: "8px" }}>
                                                Click to upload image
                                            </p>
                                            <p style={{ color: "#B2BEC3", fontSize: "12px", margin: 0 }}>
                                                PNG, JPG up to 5MB
                                            </p>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",
                                            top: 0,
                                            left: 0,
                                            opacity: 0,
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                                {errors.image && <span style={errorStyle}>{errors.image}</span>}
                            </div>

                            {/* Form Fields */}
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="col-12 mb-4">
                                        <label style={labelStyle}>Name <span style={{ color: "#E85A5A" }}>*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{
                                                ...inputStyle,
                                                borderColor: errors.name ? "#E85A5A" : "#E9ECEF",
                                            }}
                                            placeholder="Enter category name"
                                        />
                                        {errors.name && <span style={errorStyle}>{errors.name}</span>}
                                    </div>
                                    <div className="col-12 mb-4">
                                        <label style={labelStyle}>Description <span style={{ color: "#E85A5A" }}>*</span></label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            style={{
                                                ...inputStyle,
                                                minHeight: "120px",
                                                borderColor: errors.description ? "#E85A5A" : "#E9ECEF",
                                            }}
                                            placeholder="Enter category description"
                                        />
                                        {errors.description && <span style={errorStyle}>{errors.description}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/categories")}
                                style={{
                                    padding: "12px 32px",
                                    borderRadius: "8px",
                                    border: "1px solid #E9ECEF",
                                    background: "#fff",
                                    color: "#636E72",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <Button
                                type="submit"
                                disabled={createCategoryMutation.isLoading}
                            >
                                {createCategoryMutation.isLoading ? "Creating..." : "Create Category"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </ContentWrapper>
    );
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "16px",
    fontWeight: 400,
    color: "#8391A1",
    marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #E9ECEF",
    fontSize: "14px",
    color: "#2D3436",
    background: "#FAFAFA",
};

const errorStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    color: "#E85A5A",
    marginTop: "4px",
};
