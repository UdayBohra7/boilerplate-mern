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
                <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                    <Spinner size="lg" />
                </div>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper title="Edit Content">
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
                                disabled
                                style={{ borderRadius: "8px", padding: "10px", backgroundColor: "#E2E8F0", cursor: "not-allowed" }}
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
                                disabled={editMutation.isLoading}
                                style={{
                                    background: "#E85A5A",
                                    borderColor: "#E85A5A",
                                    borderRadius: "8px",
                                    padding: "10px 24px",
                                }}
                            >
                                {editMutation.isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ContentWrapper>
    );
};
