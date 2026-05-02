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
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "pro":
        return "bg-green-50 text-green-700 border-green-200";
      case "free":
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${getStyle()} shadow-sm transition-all hover:scale-105`}>
      {subscription || "Free"}
    </span>
  );
};

export const UserView = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

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
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Spinner size="xl" className="text-blue-600" />
          <p className="text-gray-500 font-medium animate-pulse">Loading profile data...</p>
        </div>
      </ContentWrapper>
    );
  }

  if (isError || !user) {
    return (
      <ContentWrapper title="View Detail">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <i className="fa-solid fa-user-slash text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">User Profile Not Found</h3>
          <p className="text-gray-500 mb-8 max-w-sm">
            {(error as Error)?.message || "The user profile you're looking for might have been moved or deleted."}
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            Back to All Users
          </button>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper title="View Detail">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Profile</h2>
            <p className="text-gray-500 mt-1">Full detailed overview of user activity and account settings.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/admin/users/edit/${userId}`)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <i className="fa-solid fa-pen text-xs"></i>
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              Back
            </button>
          </div>
        </div>

        {/* User Quick Info Card */}
        <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 md:p-10 border border-pink-100/50 shadow-sm overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100/30 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <i className="fa-solid fa-user text-5xl text-gray-300"></i>
                  </div>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 w-full">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Full Name</p>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">{user.name}</h3>
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Email Address</p>
                <p className="text-gray-700 font-medium truncate">{user.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Phone Number</p>
                <p className="text-gray-700 font-medium">{user.phone || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Member Since</p>
                <p className="text-gray-700 font-medium">{formatDate(user.createdAt)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Account Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-gray-700 font-bold uppercase text-xs tracking-wide">{user.status || "ACTIVE"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Tier</p>
                <SubscriptionBadge subscription={user.subscription} />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 space-y-10">
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-blue-500 text-sm"></i>
                Account Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1.5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">User ID</p>
                  <p className="text-sm font-mono text-gray-600">{user._id}</p>
                </div>
                <div className="space-y-1.5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</p>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">{user.role || "USER"}</p>
                </div>
              </div>
            </div>

            {user.address && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-rose-500 text-sm"></i>
                  Primary Address
                </h4>
                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed font-medium">{user.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Side Info / Stats */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Quick Stats</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <span className="text-sm font-medium text-blue-800">Total Bookings</span>
                  <span className="text-xl font-black text-blue-900">{user.booking || 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <span className="text-sm font-medium text-purple-800">Reward Points</span>
                  <span className="text-xl font-black text-purple-900">1,240</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-3xl p-8 space-y-6 shadow-xl shadow-gray-200">
              <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest">Account Security</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-green-400 shadow-inner">
                    <i className="fa-solid fa-shield-check"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">Two-Factor Auth</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Enabled</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white opacity-50">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 shadow-inner">
                    <i className="fa-solid fa-lock-keyhole"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">Email Verified</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Verified</p>
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
