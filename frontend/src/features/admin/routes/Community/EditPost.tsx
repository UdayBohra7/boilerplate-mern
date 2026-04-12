import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { TagInput } from "@/components/Form";
import { useCommunityPost, useUpdateCommunityPost, MediaItem } from "../../hooks/useCommunity";
import { BASE_URL } from "@/lib/config";

interface MediaPreview {
  file?: File;
  type: "image" | "video";
  preview: string;
  isExisting?: boolean;
  url?: string;
}

export const EditPost = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updatePostMutation = useUpdateCommunityPost(postId || "");

  const { data: postData, isLoading: isLoadingPost } = useCommunityPost(postId || "");

  const [formData, setFormData] = useState({
    title: "",
    post_desc: "",
    status: "draft" as "draft" | "scheduled" | "published",
    scheduled_date: "",
    scheduled_time: "",
    tags: [] as string[],
  });

  const [media, setMedia] = useState<MediaPreview[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form with existing data
  useEffect(() => {
    if (postData?.data) {
      const post = postData.data;

      // Parse scheduled date and time if exists
      let scheduledDate = "";
      let scheduledTime = "";
      if (post.scheduled_date) {
        const date = new Date(post.scheduled_date);
        scheduledDate = date.toISOString().split("T")[0];
        scheduledTime = date.toTimeString().slice(0, 5);
      }

      setFormData({
        title: post.title || "",
        post_desc: post.post_desc,
        status: post.status,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        tags: post.tags || [],
      });

      // Set existing media
      if (post.media && post.media.length > 0) {
        const existingMedia: MediaPreview[] = post.media.map((m: MediaItem) => ({
          type: m.type,
          preview: m.url.startsWith("http") ? m.url : `${BASE_URL}${m.url}`,
          isExisting: true,
          url: m.url,
        }));
        setMedia(existingMedia);
      }
    }
  }, [postData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: MediaPreview[] = [];

    newFiles.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isValidSize = file.size <= 50 * 1024 * 1024;

      if ((isImage || isVideo) && isValidSize) {
        const reader = new FileReader();
        reader.onloadend = () => {
          validFiles.push({
            file,
            type: isVideo ? "video" : "image",
            preview: reader.result as string,
            isExisting: false,
          });

          if (validFiles.length === newFiles.filter((f) =>
            (f.type.startsWith("image/") || f.type.startsWith("video/")) &&
            f.size <= 50 * 1024 * 1024
          ).length) {
            if (media.length + validFiles.length > 10) {
              setErrors((prev) => ({
                ...prev,
                media: "Maximum 10 media files allowed",
              }));
              return;
            }
            setMedia((prev) => [...prev, ...validFiles]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.post_desc.trim()) {
      newErrors.post_desc = "Post description is required";
    }

    if (formData.status === "scheduled") {
      if (!formData.scheduled_date) {
        newErrors.scheduled_date = "Scheduled date is required";
      }
      if (!formData.scheduled_time) {
        newErrors.scheduled_time = "Scheduled time is required";
      }
      if (formData.scheduled_date && formData.scheduled_time) {
        const scheduledDateTime = new Date(
          `${formData.scheduled_date}T${formData.scheduled_time}`
        );
        if (scheduledDateTime <= new Date()) {
          newErrors.scheduled_date = "Scheduled date must be in the future";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = new FormData();
    if (formData.title) submitData.append("title", formData.title);
    submitData.append("post_desc", formData.post_desc);
    submitData.append("status", formData.status);

    if (formData.status === "scheduled" && formData.scheduled_date && formData.scheduled_time) {
      const scheduledDateTime = new Date(
        `${formData.scheduled_date}T${formData.scheduled_time}`
      );
      submitData.append("scheduled_date", scheduledDateTime.toISOString());
    }

    // Append tags
    formData.tags.forEach((tag, index) => {
      submitData.append(`tags[${index}]`, tag);
    });

    // Separate existing and new media
    const existingMedia = media
      .filter((m) => m.isExisting)
      .map((m) => ({ type: m.type, url: m.url }));

    submitData.append("existingMedia", JSON.stringify(existingMedia));

    // Add new media files
    media
      .filter((m) => !m.isExisting && m.file)
      .forEach((m) => {
        submitData.append("media", m.file!);
      });

    updatePostMutation.mutate(submitData, {
      onSuccess: () => {
        navigate("/admin/community");
      },
    });
  };

  const handlePublishNow = () => {
    setFormData((prev) => ({ ...prev, status: "published" }));
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) form.requestSubmit();
    }, 0);
  };

  const handleSchedule = () => {
    if (!formData.scheduled_date || !formData.scheduled_time) {
      setErrors({
        scheduled_date: !formData.scheduled_date ? "Please select a date" : "",
        scheduled_time: !formData.scheduled_time ? "Please select a time" : "",
      });
      return;
    }
    setFormData((prev) => ({ ...prev, status: "scheduled" }));
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) form.requestSubmit();
    }, 0);
  };

  const handleSaveDraft = () => {
    setFormData((prev) => ({ ...prev, status: "draft" }));
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) form.requestSubmit();
    }, 0);
  };

  const today = new Date().toISOString().split("T")[0];

  if (isLoadingPost) {
    return (
      <ContentWrapper title="Edit Post">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper title="Edit Post">
      <div className="add-product-page">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#2D3436",
                marginBottom: "4px",
              }}
            >
              Edit Post
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Update your community post
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/community")}
            className="d-flex align-items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Left Column - Media */}
            <div className="col-lg-4 mb-4">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #E9ECEF",
                  padding: "20px",
                }}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#2D3436",
                    marginBottom: "16px",
                  }}
                >
                  Media (Images & Videos)
                </h5>
                <p style={{ fontSize: "13px", color: "#636E72", marginBottom: "16px" }}>
                  Add up to 10 images or videos
                </p>

                {/* Media Preview Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  {media.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        paddingBottom: "100%",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#F5F5F5",
                      }}
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.preview}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={item.preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {item.type === "video" && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "4px",
                            left: "4px",
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "10px",
                          }}
                        >
                          <i className="fa-solid fa-video"></i>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          width: "24px",
                          height: "24px",
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
                  ))}

                  {/* Add Media Button */}
                  {media.length < 10 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        paddingBottom: "100%",
                        position: "relative",
                        borderRadius: "8px",
                        border: "2px dashed #E9ECEF",
                        cursor: "pointer",
                        background: "#FAFAFA",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                        }}
                      >
                        <i
                          className="fa-solid fa-plus"
                          style={{ color: "#B2BEC3", fontSize: "20px" }}
                        ></i>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaSelect}
                  style={{ display: "none" }}
                />

                {errors.media && (
                  <p style={{ color: "#E85A5A", fontSize: "12px", margin: "8px 0 0" }}>
                    {errors.media}
                  </p>
                )}
              </div>

              {/* Schedule Section */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #E9ECEF",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#2D3436",
                    marginBottom: "16px",
                  }}
                >
                  <i className="fa-regular fa-calendar me-2"></i>
                  Schedule Post
                </h5>

                <div className="mb-3">
                  <label style={labelStyle}>Date</label>
                  <input
                    type="date"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                    min={today}
                    style={{
                      ...inputStyle,
                      borderColor: errors.scheduled_date ? "#E85A5A" : "#E9ECEF",
                    }}
                  />
                  {errors.scheduled_date && (
                    <span style={errorStyle}>{errors.scheduled_date}</span>
                  )}
                </div>

                <div className="mb-3">
                  <label style={labelStyle}>Time</label>
                  <input
                    type="time"
                    name="scheduled_time"
                    value={formData.scheduled_time}
                    onChange={handleInputChange}
                    style={{
                      ...inputStyle,
                      borderColor: errors.scheduled_time ? "#E85A5A" : "#E9ECEF",
                    }}
                  />
                  {errors.scheduled_time && (
                    <span style={errorStyle}>{errors.scheduled_time}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="col-lg-8">
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #E9ECEF",
                  padding: "20px",
                }}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#2D3436",
                    marginBottom: "20px",
                  }}
                >
                  Post Content
                </h5>

                {/* Post Title */}
                <div className="mb-4">
                  <label style={labelStyle}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title (optional)"
                    style={{
                      ...inputStyle,
                      borderColor: errors.title ? "#E85A5A" : "#E9ECEF",
                    }}
                  />
                  {errors.title && (
                    <span style={errorStyle}>{errors.title}</span>
                  )}
                </div>

                <TagInput
                  label="Tags"
                  value={formData.tags}
                  onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
                  placeholder="Add tags (press Enter)"
                />

                {/* Post Description */}
                <div className="mb-4">
                  <label style={labelStyle}>Description *</label>
                  <textarea
                    name="post_desc"
                    value={formData.post_desc}
                    onChange={handleInputChange}
                    placeholder="What's on your mind? Share something with the community..."
                    rows={8}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "200px",
                      borderColor: errors.post_desc ? "#E85A5A" : "#E9ECEF",
                    }}
                  />
                  {errors.post_desc && (
                    <span style={errorStyle}>{errors.post_desc}</span>
                  )}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#B2BEC3",
                      marginTop: "8px",
                      textAlign: "right",
                    }}
                  >
                    {formData.post_desc.length} characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                    marginTop: "24px",
                    paddingTop: "20px",
                    borderTop: "1px solid #E9ECEF",
                  }}
                >
                  {postData?.data?.status !== "published" && (
                    <>
                      <Button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={updatePostMutation.isLoading}
                        className="border-btn"
                        style={{
                          opacity: updatePostMutation.isLoading ? 0.7 : 1,
                        }}
                      >
                        <i className="fa-regular fa-bookmark me-2"></i>
                        Save as Draft
                      </Button>

                      <Button
                        type="button"
                        onClick={handleSchedule}
                        disabled={updatePostMutation.isLoading}
                        className="border-btn"
                        style={{
                          opacity: updatePostMutation.isLoading ? 0.7 : 1,
                          background: "rgba(52, 152, 219, 0.1)",
                          borderColor: "#3498DB",
                          color: "#3498DB",
                        }}
                      >
                        <i className="fa-regular fa-clock me-2"></i>
                        Schedule Post
                      </Button>

                      <Button
                        type="button"
                        onClick={handlePublishNow}
                        disabled={updatePostMutation.isLoading}
                        className="btn d-flex align-items-center gap-2"
                        style={{
                          opacity: updatePostMutation.isLoading ? 0.7 : 1,
                        }}
                      >
                        {updatePostMutation.isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                            ></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-paper-plane"></i>
                            Publish Now
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {postData?.data?.status === "published" && (
                    <Button
                      type="submit"
                      disabled={updatePostMutation.isLoading}
                      className="btn d-flex align-items-center gap-2"
                      style={{
                        opacity: updatePostMutation.isLoading ? 0.7 : 1,
                      }}
                    >
                      {updatePostMutation.isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          ></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check"></i>
                          Update Post
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentWrapper>
  );
};

// Styles
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#636E72",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #E9ECEF",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

const errorStyle: React.CSSProperties = {
  color: "#E85A5A",
  fontSize: "12px",
  marginTop: "4px",
  display: "block",
};

export default EditPost;

