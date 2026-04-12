import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import userss from "@/assets/users.png";
import activeUser from "@/assets/active.svg";
import premium from "@/assets/premium.svg";
import inactive from "@/assets/inactive.svg";
import { UserGrowthChart } from "./UserGrowthChart";
import { DailyCharts } from "./DailyCharts";
import { useAnalyticsStats } from "../../hooks/useAnalytics";

const AnalyticsReporting = () => {
  const { data: analyticsData, isLoading } = useAnalyticsStats();
  const stats = analyticsData?.data;

  // Format number with commas
  const formatNumber = (num: number | undefined) => {
    return num?.toLocaleString() || "0";
  };

  return (
    <ContentWrapper title="Analytics Reporting">
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
              Analytics & Reporting
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              View user statistics and growth analytics
            </p>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-12 col-md-3">
            <div className="analytic-rpt white-box d-flex align-items-center gap-2">
              <img src={userss} className="users-ico" />
              <div className="analytic-content">
                <p className="gray f-14 mb-0">All Users</p>
                <p className="semi-bold mb-0">
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" style={{ color: "#F882A1" }}></span>
                  ) : (
                    formatNumber(stats?.totalUsers)
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="analytic-rpt white-box d-flex align-items-center gap-2">
              <img src={activeUser} className="users-ico" />
              <div className="analytic-content">
                <p className="gray f-14 mb-0">Active Users</p>
                <p className="semi-bold mb-0">
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" style={{ color: "#F882A1" }}></span>
                  ) : (
                    formatNumber(stats?.activeUsers)
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="analytic-rpt white-box d-flex align-items-center gap-2">
              <img src={premium} className="users-ico" />
              <div className="analytic-content">
                <p className="gray f-14 mb-0">Premium Users</p>
                <p className="semi-bold mb-0">
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" style={{ color: "#F882A1" }}></span>
                  ) : (
                    formatNumber(stats?.premiumUsers)
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="analytic-rpt white-box d-flex align-items-center gap-2">
              <img src={inactive} className="users-ico" />
              <div className="analytic-content">
                <p className="gray f-14 mb-0">Inactive Users</p>
                <p className="semi-bold mb-0">
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" style={{ color: "#F882A1" }}></span>
                  ) : (
                    formatNumber(stats?.inactiveUsers)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="white-box">
              <p className="f-14 semi-bold">
                User Growth <span className="gray">{new Date().getFullYear()}</span>
              </p>
              <UserGrowthChart
                data={stats?.userGrowth?.data}
                labels={stats?.userGrowth?.labels}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="white-box">
              <p className="f-14 semi-bold pb-3">
                Daily Engagement <span className="gray">{new Date().getFullYear()}</span>
              </p>
              <DailyCharts />
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default AnalyticsReporting;
