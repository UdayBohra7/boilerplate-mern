import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, MediaGalleryModal, ConfirmationDialog } from "@/components/Elements";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import {
  useCommunityPosts,
  useScheduledCount,
  usePublishCommunityPost,
  useDeleteCommunityPost,
  CommunityPost,
  MediaItem,
} from "../../hooks/useCommunity";
import { BASE_URL } from "@/lib/config";
import dell from "@/assets/dell.svg";

const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "published" | "scheduled" | "draft">("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Gallery modal state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryMedia, setGalleryMedia] = useState<MediaItem[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    postId: string | null;
  }>({
    open: false,
    postId: null,
  });

  const openGallery = (media: MediaItem[], index: number) => {
    // Convert URLs to full URLs
    const fullUrlMedia = media.map((m) => ({
      ...m,
      url: getMediaUrl(m.url),
    }));
    setGalleryMedia(fullUrlMedia);
    setGalleryInitialIndex(index);
    setGalleryOpen(true);
  };

  // Determine status filter based on active tab
  const getStatusFilter = () => {
    if (activeTab === "scheduled") return "scheduled";
    if (activeTab === "draft") return "draft";
    if (activeTab === "published") return "published";
    return undefined;
  };

  // Fetch posts based on active tab
  const { data: postsData, isLoading } = useCommunityPosts({
    page,
    limit: 10,
    status: getStatusFilter(),
    search: search || undefined,
  });

  // Fetch scheduled count
  const { data: scheduledCountData } = useScheduledCount();

  // Mutations
  const publishMutation = usePublishCommunityPost();
  const deleteMutation = useDeleteCommunityPost();

  const handlePublish = (postId: string) => {
    publishMutation.mutate(postId);
  };

  const handleDelete = (postId: string) => {
    setDeleteConfirmation({ open: true, postId });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.postId) {
      deleteMutation.mutate(deleteConfirmation.postId);
      setDeleteConfirmation({ open: false, postId: null });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      published: {
        background: "rgba(46, 204, 113, 0.1)",
        color: "#2ECC71",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
      },
      scheduled: {
        background: "rgba(52, 152, 219, 0.1)",
        color: "#3498DB",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
      },
      draft: {
        background: "rgba(149, 165, 166, 0.1)",
        color: "#95A5A6",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
      },
    };
    return (
      <span style={styles[status] || styles.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getMediaUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  return (
    <ContentWrapper title="Community">
      <div className="user-management">
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
              Community
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Manage and schedule community posts
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/community/add")}
            className="btn d-flex align-items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Create Post
          </Button>
        </div>

        {/* Tab Buttons */}
        <div className="row">
          <div className="col-12 col-md-12 mb-4">
            <div className="analytic-community white-box gap-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <Button
                  className={activeTab === "all" ? "btn" : "border-btn"}
                  onClick={() => {
                    setActiveTab("all");
                    setPage(1);
                  }}
                >
                  All Posts
                </Button>
                <Button
                  className={activeTab === "published" ? "btn" : "border-btn"}
                  onClick={() => {
                    setActiveTab("published");
                    setPage(1);
                  }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <i className="fa-solid fa-bullhorn"></i>
                    Published
                  </span>
                </Button>
                <Button
                  className={activeTab === "scheduled" ? "btn" : "border-btn"}
                  onClick={() => {
                    setActiveTab("scheduled");
                    setPage(1);
                  }}
                >
                  <span className="d-flex align-items-center gap-2">
                    Scheduled Posts{" "}
                    <span className="schedule-count">
                      {scheduledCountData?.data?.count || 0}
                    </span>
                  </span>
                </Button>
                <Button
                  className={activeTab === "draft" ? "btn" : "border-btn"}
                  onClick={() => {
                    setActiveTab("draft");
                    setPage(1);
                  }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <i className="fa-regular fa-file"></i>
                    Draft Posts
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 40px",
                  borderRadius: "8px",
                  border: "1px solid #E9ECEF",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <i
                className="fa-solid fa-search"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#B2BEC3",
                }}
              ></i>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : postsData?.data?.length === 0 ? (
          <div className="text-center py-5">
            <i
              className="fa-solid fa-file-circle-xmark"
              style={{ fontSize: "48px", color: "#B2BEC3", marginBottom: "16px" }}
            ></i>
            <p style={{ color: "#636E72" }}>
              {activeTab === "scheduled"
                ? "No scheduled posts found"
                : activeTab === "draft"
                  ? "No draft posts found"
                  : "No posts found"}
            </p>
          </div>
        ) : (
          <div className="row">
            {postsData?.data?.map((post: CommunityPost) => (
              <div key={post._id} className="col-12 col-md-12 mb-4">
                <div className="community-box p-4 white-box relative">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {getStatusBadge(post.status)}
                      {post.status === "scheduled" && post.scheduled_date && (
                        <span style={{ fontSize: "12px", color: "#636E72" }}>
                          <i className="fa-regular fa-clock me-1"></i>
                          {formatDate(post.scheduled_date)}
                        </span>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/community/edit/${post._id}`)}
                        style={{
                          background: "rgba(52, 152, 219, 0.1)",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                        title="Edit"
                      >
                        <i className="fa-solid fa-pen" style={{ color: "#3498DB" }}></i>
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        style={{
                          background: "rgba(232, 90, 90, 0.1)",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                        title="Delete"
                      >
                        <img src={dell} alt="delete" width={16} />
                      </button>
                    </div>
                  </div>

                  <div className="push-notes mb-3 d-flex align-items-start gap-3">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#F882A1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "14px",
                        flexShrink: 0,
                      }}
                    >
                      {post.created_by?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div className="push-notify flex-grow-1">
                      <p className="mb-0 semi-bold">
                        {post.created_by?.name || "Admin"}
                      </p>
                      <p className="gray f-14 mb-2">
                        {getRelativeTime(post.createdAt)}
                      </p>
                      <p
                        className="gray mb-3"
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {post.post_desc}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                fontSize: "12px",
                                color: "#3498DB",
                                background: "rgba(52, 152, 219, 0.1)",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontWeight: 500,
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Media Grid */}
                      {post.media && post.media.length > 0 && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              post.media.length === 1
                                ? "1fr"
                                : post.media.length === 2
                                  ? "1fr 1fr"
                                  : "repeat(3, 1fr)",
                            gap: "8px",
                            marginBottom: "16px",
                            maxWidth: "600px",
                          }}
                        >
                          {post.media.slice(0, 6).map((media, index) => (
                            <div
                              key={index}
                              onClick={() => openGallery(post.media, index)}
                              style={{
                                position: "relative",
                                paddingBottom: post.media.length === 1 ? "56.25%" : "100%",
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#F5F5F5",
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.02)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {media.type === "video" ? (
                                <>
                                  <video
                                    src={getMediaUrl(media.url)}
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  {/* Video play overlay */}
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      background: "rgba(0, 0, 0, 0.6)",
                                      borderRadius: "50%",
                                      width: "48px",
                                      height: "48px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <i
                                      className="fa-solid fa-play"
                                      style={{ color: "#fff", fontSize: "18px", marginLeft: "3px" }}
                                    ></i>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <img
                                    src={getMediaUrl(media.url)}
                                    alt={`Media ${index + 1}`}
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  {/* Zoom icon overlay on hover */}
                                  <div
                                    className="zoom-overlay"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      background: "rgba(0, 0, 0, 0)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "background 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.background = "rgba(0, 0, 0, 0)";
                                    }}
                                  >
                                    <i
                                      className="fa-solid fa-expand"
                                      style={{
                                        color: "#fff",
                                        fontSize: "20px",
                                        opacity: 0,
                                        transition: "opacity 0.2s",
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.opacity = "1";
                                      }}
                                      onMouseOut={(e) => {
                                        e.currentTarget.style.opacity = "0";
                                      }}
                                    ></i>
                                  </div>
                                </>
                              )}
                              {index === 5 && post.media.length > 6 && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                  }}
                                >
                                  +{post.media.length - 6}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {post.status !== "published" && (
                        <div className="scheduled-btns d-flex align-items-center gap-3">
                          <Button
                            className="upload-btn"
                            onClick={() => handlePublish(post._id)}
                            disabled={publishMutation.isLoading}
                          >
                            {publishMutation.isLoading ? "Publishing..." : "Publish Now"}
                          </Button>
                          {post.status === "draft" && (
                            <Button
                              className="upload-btn-border"
                              onClick={() => navigate(`/admin/community/edit/${post._id}`)}
                            >
                              Schedule Post
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {postsData && postsData.totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #E9ECEF",
                background: page === 1 ? "#F5F5F5" : "#fff",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <span style={{ padding: "8px 16px" }}>
              Page {page} of {postsData.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(postsData.totalPages, p + 1))}
              disabled={page === postsData.totalPages}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid #E9ECEF",
                background: page === postsData.totalPages ? "#F5F5F5" : "#fff",
                cursor: page === postsData.totalPages ? "not-allowed" : "pointer",
              }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      <MediaGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        media={galleryMedia}
        initialIndex={galleryInitialIndex}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, postId: null })}
        onConfirm={confirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        status="danger"
      />
    </ContentWrapper>
  );
};

export default Community;
