import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { BarChart } from "./DashboardComponents/BarChart";
import { PieChart } from "./DashboardComponents/PieChart";
import { Button, Spinner } from "@/components/Elements";
import { useNavigate } from "react-router-dom";
import { useCounts } from "../hooks/useDashboardCounts";
import { useUserGraph } from "../hooks/useDashboardUserGraph";
import { useState } from "react";
import { DurationFilter } from "../api/dashboardUserGraph";
import { useEngagementGraph } from "../hooks/useDashboardEngagementGraph";

const StatCard = ({
  icon,
  label,
  value,
  percentage,
  isUp = true,
  isLoading
}: {
  icon: string;
  label: string;
  value: number;
  percentage: string;
  isUp?: boolean;
  isLoading?: boolean;
}) => (
  <div className="dashboard-col cardbg p-4 rounded-lg">
    <div className="d-flex align-items-center gap-3 mb-3">
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
      <p className="f-14 lighttxt mb-0">{label}</p>
    </div>
    <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
      <span className="f-24 semi-bold text-dark">
        {
          isLoading ?
            <Spinner size="sm" />
            :
            value
        }
      </span>
      <span
        className={`user-down ${isUp ? "up" : ""
          } d-flex align-items-center gap-2`}
      >
        {
          isLoading ?
            <Spinner size="sm" />
            :
            <>
              {percentage}
              <i className={`fa-solid ${isUp ? "fa-arrow-up" : "fa-arrow-down"}`}></i>
            </>
        }
      </span>
    </h3>
  </div>
);


export const Dashboard = () => {
  const navigate = useNavigate();
  const [userGraphDuration, setUserGraphDuration] = useState<DurationFilter>("1m");
  const [engagementGraphDuration, setEngagementGraphDuration] = useState<DurationFilter>("1m");
  const { isLoading: countLoading, data: countData } = useCounts();
  const { isLoading: userGraphLoading, data: userGraphData } = useUserGraph(userGraphDuration);
  const { isLoading: engagementGraphLoading, data: engagementGraphData } = useEngagementGraph(engagementGraphDuration);

  return (
    <ContentWrapper title="Dashboard">
      <div className="dashboard-main">
        <h3 className="f-24 semi-bold mb-2">Dashboard Overview</h3>
        <p className="gray pb-3">
          Welcome back! Here's what's happening with your app today.
        </p>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <StatCard
              icon="fa-solid fa-user"
              label="Total User"
              value={countData?.data?.totalUser?.totalCount || 0}
              percentage={Math.abs(Number(countData?.data?.totalUser?.monthlyRate || 0)).toFixed(2) + "%"}
              isUp={Number(countData?.data?.totalUser?.monthlyRate || 0) >= 0}
              isLoading={countLoading}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <StatCard
              icon="fa-solid fa-chart-line"
              label="Total Meals Logged"
              value={countData?.data?.totalMealsLogged?.totalCount || 0}
              percentage={Math.abs(Number(countData?.data?.totalMealsLogged?.monthlyRate || 0)).toFixed(2) + "%"}
              isUp={Number(countData?.data?.totalMealsLogged?.monthlyRate || 0) >= 0}
              isLoading={countLoading}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <StatCard
              icon="fa-solid fa-utensils"
              label="Meal Planner"
              value={countData?.data?.totalMealPlans?.totalCount || 0}
              percentage={Math.abs(Number(countData?.data?.totalMealPlans?.monthlyRate || 0)).toFixed(2) + "%"}
              isUp={Number(countData?.data?.totalMealPlans?.monthlyRate || 0) >= 0}
              isLoading={countLoading}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <StatCard
              icon="fa-solid fa-percentage"
              label="Engagement Rate"
              value={countData?.data?.engagementRate?.totalCount || 0}
              percentage={Math.abs(Number(countData?.data?.engagementRate?.monthlyRate || 0)).toFixed(2) + "%"}
              isUp={Number(countData?.data?.engagementRate?.monthlyRate || 0) >= 0}
              isLoading={countLoading}
            />
          </div>
        </div>
        <div className="weekly-cards mb-4">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card-dash dashboard-col cardbg rounded-lg p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <p className="f-14 lighttxt mb-0">{userGraphDuration === "7d" ? "Weekly" : userGraphDuration === "1m" ? "Monthly" : "Yearly"} Activity</p>
                  <select
                    className="form-select w-auto py-1 f-14"
                    value={userGraphDuration}
                    onChange={(e) => setUserGraphDuration(e.target.value as DurationFilter)}
                  >
                    <option value="7d">7 Days</option>
                    <option value="1m">1 Month</option>
                    <option value="1y">1 Year</option>
                  </select>
                </div>
                <h3 className="mb-0 d-flex align-items-end gap-2 justify-content-start">
                  <span className="f-24 semi-bold text-dark">Total user</span>
                </h3>
                <BarChart isLoading={userGraphLoading} data={userGraphData?.data} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card-dash dashboard-col cardbg rounded-lg p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <p className="f-20 semi-bold lighttxt mb-0">Feature Engagement</p>
                  <select
                    className="form-select w-auto py-1 f-14"
                    value={engagementGraphDuration}
                    onChange={(e) => setEngagementGraphDuration(e.target.value as DurationFilter)}
                  >
                    <option value="7d">7 Days</option>
                    <option value="1m">1 Month</option>
                    <option value="1y">1 Year</option>
                  </select>
                </div>
                <PieChart isLoading={engagementGraphLoading} data={engagementGraphData?.data} />
              </div>
            </div>
          </div>
        </div>
        <div className="dash-table dashboard-col p-3 white-card rounded-lg">
          <p className="semi-bold">Quick Action</p>
          <div className="quick-actions d-flex align-items-center gap-3">
            <Button onClick={() => navigate("/admin/users/add")}>Add New User</Button>
            <Button onClick={() => navigate("/admin/reports")} className="border-btn">View Reports</Button>
            <Button onClick={() => navigate("/admin/meals/add")} className="border-btn">Create Meal</Button>
            <Button onClick={() => navigate("/admin/push-notifications")} className="border-btn">Send Notifications</Button>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
