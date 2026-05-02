import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { BarChart } from "./DashboardComponents/BarChart";
import { PieChart } from "./DashboardComponents/PieChart";
import { Button, Spinner } from "@/components/Elements";
import { useNavigate } from "react-router-dom";
import { useCounts } from "../hooks/useDashboardCounts";
import { useUserGraph } from "../hooks/useDashboardUserGraph";
import { useState } from "react";
import { DurationFilter } from "../api/dashboardUserGraph";

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
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-gray-200/40 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all ${isUp ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"}`}>
        <i className={`${icon} text-lg`}></i>
      </div>
      <span
        className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
          isUp ? "bg-green-50 text-green-600 border border-green-100" : "bg-rose-50 text-rose-600 border border-rose-100"
        }`}
      >
        {isLoading ? <Spinner size="sm" /> : (
          <>
            {percentage}
            <i className={`fa-solid ${isUp ? "fa-arrow-up-long" : "fa-arrow-down-long"} ml-1`}></i>
          </>
        )}
      </span>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{label}</p>
      <h3 className="text-3xl font-black text-gray-900 tracking-tight">
        {isLoading ? <Spinner size="sm" /> : value.toLocaleString()}
      </h3>
    </div>
  </div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [userGraphDuration, setUserGraphDuration] = useState<DurationFilter>("1m");
  const { isLoading: countLoading, data: countData } = useCounts();
  const { isLoading: userGraphLoading, data: userGraphData } = useUserGraph(userGraphDuration);

  // Static sample data for the engagement chart
  const staticEngagementData = {
    labels: ['Shopping', 'Meal Tracking', 'Meal Plan', 'Community'],
    data: [35, 25, 20, 20]
  };

  return (
    <ContentWrapper title="Dashboard Overview">
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">System Status</h2>
            <p className="text-gray-500 mt-1">
              Welcome back! Monitor your application's growth and user engagement metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all text-gray-500"
              title="Refresh Data"
            >
              <i className="fa-solid fa-arrows-rotate"></i>
            </button>
            <div className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-gray-200">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Status
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="fa-solid fa-users-viewfinder"
            label="Total Registered Users"
            value={countData?.data?.totalUser?.totalCount || 0}
            percentage={Math.abs(Number(countData?.data?.totalUser?.monthlyRate || 0)).toFixed(1) + "%"}
            isUp={Number(countData?.data?.totalUser?.monthlyRate || 0) >= 0}
            isLoading={countLoading}
          />
          <StatCard
            icon="fa-solid fa-fire-flame-curved"
            label="Total Meals Logged"
            value={1248}
            percentage="12.5%"
            isUp={true}
            isLoading={false}
          />
          <StatCard
            icon="fa-solid fa-calendar-check"
            label="Active Meal Plans"
            value={856}
            percentage="8.2%"
            isUp={true}
            isLoading={false}
          />
          <StatCard
            icon="fa-solid fa-heart-pulse"
            label="Engagement Rate"
            value={94.2}
            percentage="4.1%"
            isUp={true}
            isLoading={false}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Growth Analytics</h3>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-tighter">User acquisition over time</p>
              </div>
              <select
                className="bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 px-4 py-2 outline-none cursor-pointer"
                value={userGraphDuration}
                onChange={(e) => setUserGraphDuration(e.target.value as DurationFilter)}
              >
                <option value="7d">Last 7 Days</option>
                <option value="1m">Last 30 Days</option>
                <option value="1y">Past Year</option>
              </select>
            </div>
            <div className="h-[350px]">
              <BarChart isLoading={userGraphLoading} data={userGraphData?.data} />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">App Usage</h3>
                <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-tighter">Feature distribution</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2">
                All Time
              </div>
            </div>
            <div className="h-[350px] flex items-center justify-center">
              <PieChart isLoading={false} data={staticEngagementData} />
            </div>
          </div>
        </div>

        {/* Quick Actions & Bottom Section */}
        <div className="bg-blue-600 rounded-3xl p-8 md:p-10 shadow-xl shadow-blue-200 overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Quick Operations</h3>
            <p className="text-blue-100 mb-8 max-w-xl">Accelerate your workflow with these frequently used administrative shortcuts.</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate("/admin/users/add")}
                className="px-8 py-3.5 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-lg text-sm flex items-center gap-2"
              >
                <i className="fa-solid fa-user-plus text-xs"></i>
                Add New User
              </button>
              <button 
                onClick={() => navigate("/admin/push-notifications")}
                className="px-8 py-3.5 bg-blue-500 text-white font-black rounded-2xl hover:bg-blue-400 transition-all shadow-lg border border-blue-400 text-sm flex items-center gap-2"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
                Send Notifications
              </button>
              <button 
                onClick={() => navigate("/admin/meals/add")}
                className="px-8 py-3.5 bg-blue-500 text-white font-black rounded-2xl hover:bg-blue-400 transition-all shadow-lg border border-blue-400 text-sm flex items-center gap-2"
              >
                <i className="fa-solid fa-utensils text-xs"></i>
                Create Meal
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
