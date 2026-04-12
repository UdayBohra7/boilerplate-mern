import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useUser } from "../hooks/useUsers";
import { BASE_URL } from "@/lib/config";
import { Button } from "@/components/Elements";

// Subscription Badge Component
const SubscriptionBadge = ({ subscription }: { subscription: string }) => {
  const getStyle = () => {
    switch (subscription?.toLowerCase()) {
      case "premium":
        return { bg: "#F3E5F5", color: "#9C27B0", border: "#E1BEE7" };
      case "pro":
        return { bg: "#E8F5E9", color: "#4CAF50", border: "#C8E6C9" };
      case "free":
      default:
        return { bg: "#F5F5F5", color: "#757575", border: "#E0E0E0" };
    }
  };

  const style = getStyle();

  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: "6px 16px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: 500,
      }}
    >
      {subscription || "Free"}
    </span>
  );
};

export const UserView = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  // Fetch user data
  const { data: userData, isLoading, isError, error } = useUser(userId || "");

  const user = userData?.data
    ? {
      ...userData.data,
      image: userData.data.image && !userData.data.image.startsWith('http')
        ? `${BASE_URL}${userData.data.image}`
        : userData.data.image,
    }
    : null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-");
  };

  if (isLoading) {
    return (
      <ContentWrapper title="View Detail">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="text-center">
            <div className="spinner-border" style={{ color: "#E85A5A" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ marginTop: "16px", color: "#636E72" }}>Loading user data...</p>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  if (isError || !user) {
    return (
      <ContentWrapper title="View Detail">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="text-center">
            <i className="fa-solid fa-user-slash" style={{ fontSize: "48px", color: "#E9ECEF", marginBottom: "16px" }}></i>
            <p style={{ color: "#636E72", marginBottom: "16px" }}>
              {(error as Error)?.message || "User not found"}
            </p>
            <Button
              onClick={() => navigate("/admin/users")}
              className="btn"

            >
              Back to Users
            </Button>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper title="View Detail">
      <div className="user-view-page">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#2D3436", marginBottom: "4px" }}>
              View Detail
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Customer Detail Page
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              onClick={() => navigate(`/admin/users/edit/${userId}`)}
              className="btn d-flex align-items-center gap-2"

            >
              <i className="fa-solid fa-pen"></i> {" "}
              Edit
            </Button>
            <Button
              onClick={() => navigate("/admin/users")}
              className="border-btn d-flex align-items-center gap-2"

            >
              <i className="fa-solid fa-arrow-left"></i> {" "}
              Back
            </Button>
          </div>
        </div>

        {/* User Detail Card */}
        <div
          style={{
            background: "#ffeff3",
            borderRadius: "12px",
            padding: "32px",
          }}
        >
          <div className="d-flex align-items-center gap-4 flex-wrap">
            {/* Image */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                flexShrink: 0,
              }}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#E9ECEF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fa-solid fa-user" style={{ fontSize: "40px", color: "#B2BEC3" }}></i>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="d-flex align-items-center gap-5 flex-wrap" style={{ flex: 1 }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#2D3436", margin: 0 }}>
                  {user.name}
                </h3>
              </div>

              <div style={infoItemStyle}>
                <span style={{ color: "#636E72", fontSize: "13px" }}>{user.email}</span>
              </div>

              <div style={infoItemStyle}>
                <span style={{ color: "#636E72", fontSize: "13px" }}>{user.phone}</span>
              </div>

              <div style={infoItemStyle}>
                <span style={{ color: "#636E72", fontSize: "13px" }}>{user.booking}</span>
              </div>

              <div style={infoItemStyle}>
                <span style={{ color: "#636E72", fontSize: "13px" }}>{formatDate(user.createdAt)}</span>
              </div>

              <div>
                <SubscriptionBadge subscription={user.subscription} />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #E9ECEF",
            padding: "32px",
            marginTop: "24px",
          }}
        >
          <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#2D3436", marginBottom: "24px" }}>
            User Information
          </h4>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div style={detailLabelStyle}>Full Name</div>
              <div style={detailValueStyle}>{user.name || "N/A"}</div>
            </div>
            {/* <div className="col-md-4 mb-4">
              <div style={detailLabelStyle}>Email Address</div>
              <div style={detailValueStyle}>{user.email || "N/A"}</div>
            </div> */}
            <div className="col-md-4 mb-4">
              <div style={detailLabelStyle}>Phone Number</div>
              <div style={detailValueStyle}>{user.phone || "N/A"}</div>
            </div>
            <div className="col-md-4 mb-4">
              <div style={detailLabelStyle}>Subscription</div>
              <div style={detailValueStyle}>{user.subscription || "Free"}</div>
            </div>
            {/* <div className="col-md-4 mb-4">
              <div style={detailLabelStyle}>Booking Count</div>
              <div style={detailValueStyle}>{user.booking || 0}</div>
            </div> */}
            <div className="col-md-4 mb-4">
              <div style={detailLabelStyle}>Registration Date</div>
              <div style={detailValueStyle}>{formatDate(user.createdAt)}</div>
            </div>
            <div className="col-md-4 mb-4">
              <div style={detailLabelStyle}>Status</div>
              <div style={detailValueStyle}>{user.status || "N/A"}</div>
            </div>
            {user.address && (
              <div className="col-md-12 mb-4">
                <div style={detailLabelStyle}>Address</div>
                <div style={detailValueStyle}>{user.address}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

const infoItemStyle: React.CSSProperties = {
  padding: "0 16px",
  borderLeft: "1px solid rgba(0,0,0,0.1)",
};

const detailLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#636E72",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const detailValueStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#2D3436",
  fontWeight: 500,
};
