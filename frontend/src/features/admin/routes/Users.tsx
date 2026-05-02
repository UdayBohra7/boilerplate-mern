import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useUsers, useDeleteUser, User } from "../hooks/useUsers";
import { BASE_URL } from "@/lib/config";
import { Button } from "@/components/Elements";
import edit from "@/assets/edit.svg";
import del from "@/assets/del.svg";
import view from "@/assets/view.svg";


interface ActionDropdownProps {
  user: User;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

const ActionDropdown = ({
  user,
  onEdit,
  onView,
  onDelete,
}: ActionDropdownProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        onClick={() => onEdit(user)}
        title="Edit User"
      >
        <img src={edit} className="w-5 h-5" alt="Edit" />
      </button>
      <button
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
        onClick={() => onView(user)}
        title="View Profile"
      >
        <img src={view} className="w-5 h-5" alt="View" />
      </button>
      <button
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        onClick={() => onDelete(user)}
        title="Delete User"
      >
        <img src={del} className="w-5 h-5" alt="Delete" />
      </button>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "delevered":
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "inactive":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle()}`}>
      {status || "N/A"}
    </span>
  );
};

// Subscription Badge Component
const SubscriptionBadge = ({ subscription }: { subscription: string }) => {
  const getStyle = () => {
    switch (subscription?.toLowerCase()) {
      case "premium":
        return "text-pink-600 font-black";
      case "pro":
        return "text-green-600 font-black";
      case "free":
      default:
        return "text-gray-500 font-bold";
    }
  };

  return (
    <span className={`text-xs uppercase tracking-wider ${getStyle()}`}>
      {subscription || "Free"}
    </span>
  );
};

// Filter Modal Component
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { subscription: string | null; status: string | null; date: Date | null }) => void;
  currentFilters: { subscription: string | null; status: string | null; date: Date | null };
}

const FilterModal = ({ isOpen, onClose, onApply, currentFilters }: FilterModalProps) => {
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(currentFilters.subscription);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(currentFilters.status);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(currentFilters.date);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const subscriptionOptions = ["Free", "Premium", "Pro"];
  const statusOptions = ["Active", "Inactive", "All User"];

  const handleSave = () => {
    onApply({
      subscription: selectedSubscription,
      status: selectedStatus === "All User" ? null : selectedStatus,
      date: selectedDate,
    });
    onClose();
  };

  const handleReset = () => {
    onApply({
      subscription: null,
      status: null,
      date: null,
    });
    setSelectedSubscription(null);
    setSelectedStatus(null);
    setSelectedDate(null);
    onClose();
  };

  const handleSubscriptionClick = (option: string) => {
    setSelectedSubscription(selectedSubscription === option ? null : option);
  };

  const handleStatusClick = (option: string) => {
    setSelectedStatus(selectedStatus === option ? null : option);
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isSelectedDate(day);
      const isTodayDate = isToday(day);
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
            isSelected 
              ? "bg-blue-600 text-white font-bold" 
              : isTodayDate 
                ? "text-blue-600 font-bold border border-blue-100" 
                : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="mt-4">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fa-solid fa-chevron-left text-xs text-gray-500"></i>
          </button>
          <span className="text-sm font-bold text-gray-800">
            {formatMonthYear(currentMonth)}
          </span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fa-solid fa-chevron-right text-xs text-gray-500"></i>
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((name) => (
            <div key={name} className={`text-center text-[10px] font-bold uppercase tracking-tighter ${name === "Sun" ? "text-red-400" : "text-gray-400"}`}>
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-6 bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 transform transition-all duration-300 w-full max-w-[320px] mt-20 ${showDatePicker ? 'h-auto' : 'h-auto'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`p-2 rounded-xl transition-all ${showDatePicker ? "bg-blue-50 text-blue-600 border border-blue-100" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <i className="fa-regular fa-calendar"></i>
          </button>
        </div>

        {showDatePicker ? (
          <div className="bg-gray-50/50 rounded-2xl p-4 mb-6 border border-gray-100">
            {renderCalendar()}
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subscription</label>
              <div className="flex flex-wrap gap-2">
                {subscriptionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSubscriptionClick(option)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedSubscription === option 
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" 
                        : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Account Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleStatusClick(option)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedStatus === option 
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" 
                        : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-sm"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="w-full py-3.5 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  loading?: boolean;
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  loading,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <i className="fa-solid fa-trash-can text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete User Account</h3>
          <p className="text-gray-500 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-gray-900">"{userName}"</span>? This action is permanent and cannot be undone.
          </p>
        </div>
        <div className="flex p-4 bg-gray-50 gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-4 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-4 text-sm font-bold text-white bg-red-600 rounded-2xl shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size="sm" /> : <i className="fa-solid fa-trash-can text-xs"></i>}
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Users Component
export const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ subscription: string | null; status: string | null; date: Date | null }>({
    subscription: null,
    status: null,
    date: null,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Format date for API query (YYYY-MM-DD)
  const formatDateForApi = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch users using useQuery with filters
  const { data, isLoading, isError } = useUsers({
    page: currentPage,
    limit: 10,
    sortBy: "createdAt:desc",
    search: debouncedSearch || undefined,
    subscription: filters.subscription || undefined,
    status: filters.status || undefined,
    date: formatDateForApi(filters.date),
  });

  // Delete mutation
  const deleteUserMutation = useDeleteUser();

  const users =
    (data?.data || []).map((user) => ({
      ...user,
      image:
        user.image && !user.image.startsWith("http")
          ? `${BASE_URL}${user.image}`
          : user.image,
    }));

  const totalPages = data?.totalPages || 1;
  const totalResults = data?.totalResults || 0;

  const handleAddUser = () => {
    navigate("/admin/users/add");
  };

  const handleEditUser = (user: User) => {
    navigate(`/admin/users/edit/${user._id}`);
  };

  const handleViewUser = (user: User) => {
    navigate(`/admin/users/view/${user._id}`);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
      },
      onError: () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
      },
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  return (
    <ContentWrapper title="Manage User">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Users Directory</h2>
            <p className="text-gray-500 mt-1">Manage and monitor all registered users in your system.</p>
          </div>
          <button
            onClick={handleAddUser}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            Add New User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm outline-none"
            />
          </div>
          <button
            onClick={() => setFilterModalOpen(true)}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-all ${
              (filters.subscription || filters.status || filters.date) 
                ? "bg-blue-50 text-blue-600 border-blue-200" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <i className="fa-solid fa-sliders text-xs"></i>
            Advanced Filters
            {(filters.subscription || filters.status || filters.date) && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {(filters.subscription ? 1 : 0) + (filters.status ? 1 : 0) + (filters.date ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">User Details</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Phone</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Registration Date</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Subscription</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Spinner size="xl" className="text-blue-600" />
                        <p className="text-gray-400 font-medium animate-pulse">Syncing user database...</p>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                          <i className="fa-solid fa-circle-exclamation text-xl"></i>
                        </div>
                        <p className="text-red-500 font-bold">Failed to load users</p>
                        <button onClick={() => window.location.reload()} className="text-sm text-gray-500 hover:underline">Try refreshing the page</button>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                          <i className="fa-solid fa-users-slash text-3xl"></i>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-gray-900">No matching users found</p>
                          <p className="text-gray-500 mt-1 max-w-xs mx-auto">
                            {searchTerm 
                              ? "We couldn't find any results for your search. Try adjusting your filters." 
                              : "You haven't added any users to your directory yet."}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0">
                            {user.image ? (
                              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <i className="fa-solid fa-user text-gray-300 text-sm"></i>
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-gray-900 text-sm line-clamp-1">{user.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 font-medium truncate max-w-[200px] block">{user.email || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.phone || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 font-bold">{formatDate(user.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <SubscriptionBadge subscription={user.subscription} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <ActionDropdown
                            user={user}
                            onEdit={handleEditUser}
                            onView={handleViewUser}
                            onDelete={handleDeleteClick}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing <span className="text-gray-900">{users.length}</span> of <span className="text-gray-900">{totalResults}</span> users
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
              </button>
              
              <div className="flex items-center gap-1.5 mx-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNumber = i + 1;
                  if (totalPages > 5) {
                    if (currentPage <= 3) pageNumber = i + 1;
                    else if (currentPage >= totalPages - 2) pageNumber = totalPages - 4 + i;
                    else pageNumber = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-9 h-9 text-xs font-black rounded-xl transition-all border ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          userName={userToDelete?.name || ""}
          loading={deleteUserMutation.isLoading}
        />

        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          currentFilters={filters}
        />
      </div>
    </ContentWrapper>
  );
};

// Styles
const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 600,
  color: "#382228",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#636E72",
};

const paginationBtnStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "6px",
  border: "1px solid #E9ECEF",
  background: "#fff",
  color: "#636E72",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "12px",
};
