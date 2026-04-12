import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useCreateContent } from "../../hooks/useContent";
import { RichTextEditor } from "./components/RichTextEditor";
import { toast } from "react-toastify";

export const AddContent = () => {
    const navigate = useNavigate();
    const createMutation = useCreateContent();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            toast.error("Please fill in all fields");
            return;
        }
        createMutation.mutate(
            { title, description },
            {
                onSuccess: () => {
                    navigate("/admin/content");
                },
            }
        );
    };

    return (
        <ContentWrapper title="Add Content">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px", maxWidth: "800px" }}>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label" style={{ fontWeight: 500, color: "#4A5568" }}>
                                Title
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter content title"
                                style={{ borderRadius: "8px", padding: "10px" }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label" style={{ fontWeight: 500, color: "#4A5568" }}>
                                Description
                            </label>
                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                                placeholder="Enter content description..."
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-5">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/content")}
                                className="btn btn-outline-secondary"
                                style={{ borderRadius: "8px", padding: "10px 24px" }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={createMutation.isLoading}
                                style={{
                                    background: "#E85A5A",
                                    borderColor: "#E85A5A",
                                    borderRadius: "8px",
                                    padding: "10px 24px",
                                }}
                            >
                                {createMutation.isLoading ? "Creating..." : "Create Content"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ContentWrapper>
    );
};
