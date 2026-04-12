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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="actions-btns d-flex align-items-center gap-2">
        <button
              className="dropdown-item d-flex align-items-center gap-2 p-0"
              onClick={() => {
                onEdit(user);
                setIsOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                width:"max-content",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <img src={edit} className="table-action-ico" />
             
            </button>
            <button
              className="dropdown-item d-flex align-items-center gap-2 p-0"
              onClick={() => {
                onView(user);
                setIsOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
              width:"max-content",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <img src={view} className="table-action-ico" />
           
            </button>
            <button
              className="dropdown-item d-flex align-items-center gap-2 p-0"
              onClick={() => {
                onDelete(user);
                setIsOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                width:"max-content",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <img src={del} className="table-action-ico" />
            
            </button>
      </div>
    // <div className="action-dropdown" style={{ position: "relative" }}>
    //   <button
    //     className="action-btn bg-transparent border-0 p-2"
    //     onClick={() => setIsOpen(!isOpen)}
    //     style={{ position: "relative", zIndex: isOpen ? 1001 : 1 }}
    //   >
    //     <i className="fa-solid fa-ellipsis" style={{ color: "#636E72" }}></i>
    //   </button>
    //   {isOpen && (
    //     <>
    //       <div
    //         className="dropdown-overlay"
    //         onClick={() => setIsOpen(false)}
    //         style={{
    //           position: "fixed",
    //           top: 0,
    //           left: 0,
    //           right: 0,
    //           bottom: 0,
    //           zIndex: 1000,
    //           background: "transparent",
    //         }}
    //       />
    //       <div
    //         className="dropdown-menu show"
    //         style={{
    //           position: "absolute",
    //           zIndex: 1002,
    //           minWidth: "160px",
    //           background: "#fff",
    //           borderRadius: "8px",
    //           boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    //           border: "1px solid #E9ECEF",
    //           padding: "8px 0",
    //           right: 0,
    //           top: "100%",
    //           transform: "none",
    //           marginTop: "4px",
    //         }}
    //       >
    //         <button
    //           className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
    //           onClick={() => {
    //             onEdit(user);
    //             setIsOpen(false);
    //           }}
    //           style={{
    //             background: "none",
    //             border: "none",
    //             width: "100%",
    //             textAlign: "left",
    //             cursor: "pointer",
    //           }}
    //         >
    //           <img src={edit} className="table-action-ico" />
    //           <span style={{ fontSize: "13px", color: "#2D3436" }}>
    //             Edit User Detail
    //           </span>
    //         </button>
    //         <button
    //           className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
    //           onClick={() => {
    //             onView(user);
    //             setIsOpen(false);
    //           }}
    //           style={{
    //             background: "none",
    //             border: "none",
    //             width: "100%",
    //             textAlign: "left",
    //             cursor: "pointer",
    //           }}
    //         >
    //           <img src={view} className="table-action-ico" />
    //           <span style={{ fontSize: "13px", color: "#2D3436" }}>
    //             View Detail
    //           </span>
    //         </button>
    //         <button
    //           className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
    //           onClick={() => {
    //             onDelete(user);
    //             setIsOpen(false);
    //           }}
    //           style={{
    //             background: "none",
    //             border: "none",
    //             width: "100%",
    //             textAlign: "left",
    //             cursor: "pointer",
    //           }}
    //         >
    //           <img src={del} className="table-action-ico" />
    //           <span style={{ fontSize: "13px", color: "#E85A5A" }}>
    //             Delete User Detail
    //           </span>
    //         </button>
    //       </div>
    //     </>
    //   )}
    // </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "delevered":
        return { bg: "#E8F5E9", color: "#4CAF50", border: "#C8E6C9" };
      case "active":
        return { bg: "#E3F2FD", color: "#2196F3", border: "#BBDEFB" };
      case "inactive":
        return { bg: "#FFF3E0", color: "#FF9800", border: "#FFE0B2" };
      default:
        return { bg: "#F5F5F5", color: "#9E9E9E", border: "#E0E0E0" };
    }
  };

  const style = getStatusStyle();

  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {status || "N/A"}
    </span>
  );
};

// Subscription Badge Component
const SubscriptionBadge = ({ subscription }: { subscription: string }) => {
  const getStyle = () => {
    switch (subscription?.toLowerCase()) {
      case "premium":
        return { color: "#E91E63" };
      case "pro":
        return { color: "#4CAF50" };
      case "free":
      default:
        return { color: "#757575" };
    }
  };

  const style = getStyle();

  return (
    <span style={{ color: style.color, fontWeight: 500, fontSize: "13px" }}>
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
      days.push(<div key={`empty-${i}`} style={{ width: "32px", height: "32px" }}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isSelectedDate(day);
      const isTodayDate = isToday(day);
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            background: isSelected ? "#E85A5A" : "transparent",
            color: isSelected ? "#fff" : isTodayDate ? "#E85A5A" : "#2D3436",
            fontSize: "13px",
            fontWeight: isSelected || isTodayDate ? 600 : 400,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {day}
        </button>
      );
    }

    return (
      <div style={{ marginTop: "16px" }}>
        {/* Month Navigation */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            onClick={handlePrevMonth}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              color: "#636E72",
            }}
          >
            <i className="fa-solid fa-chevron-left" style={{ fontSize: "12px" }}></i>
          </button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#E85A5A" }}>
            {formatMonthYear(currentMonth)} <i className="fa-solid fa-chevron-down" style={{ fontSize: "10px", marginLeft: "4px" }}></i>
          </span>
          <button
            onClick={handleNextMonth}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              color: "#636E72",
            }}
          >
            <i className="fa-solid fa-chevron-right" style={{ fontSize: "12px" }}></i>
          </button>
        </div>

        {/* Day Names */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            marginBottom: "8px",
          }}
        >
          {dayNames.map((name) => (
            <div
              key={name}
              style={{
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 500,
                color: name === "Sun" ? "#E85A5A" : "#636E72",
                padding: "4px 0",
              }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
          }}
        >
          {days}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        zIndex: 1000,
        paddingTop: "160px",
        paddingRight: "40px",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: showDatePicker ? "320px" : "280px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          transition: "width 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 style={{ fontWeight: 600, color: "#2D3436", margin: 0, fontSize: "16px" }}>Filter</h5>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{
              background: showDatePicker ? "#FFF0F0" : "none",
              border: showDatePicker ? "1px solid #E85A5A" : "none",
              borderRadius: "6px",
              cursor: "pointer",
              padding: "6px 10px",
              color: showDatePicker ? "#E85A5A" : "#636E72",
            }}
          >
            <i className="fa-regular fa-calendar" style={{ fontSize: "16px" }}></i>
          </button>
        </div>

        {/* Date Picker */}
        {showDatePicker && (
          <div
            style={{
              background: "#FFF5F5",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            {renderCalendar()}
          </div>
        )}

        {/* Subscription Filter */}
        {!showDatePicker && (
          <>
            <div className="mb-4">
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#636E72", marginBottom: "12px", display: "block" }}>
                Subscription
              </label>
              <div className="d-flex gap-2 flex-wrap">
                {subscriptionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSubscriptionClick(option)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor: selectedSubscription === option ? "#E85A5A" : "#E9ECEF",
                      background: selectedSubscription === option ? "#FFF0F0" : "#fff",
                      color: selectedSubscription === option ? "#E85A5A" : "#636E72",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <label style={{ fontSize: "13px", fontWeight: 500, color: "#636E72", marginBottom: "12px", display: "block" }}>
                Status
              </label>
              <div className="d-flex gap-2 flex-wrap">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleStatusClick(option)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor: selectedStatus === option ? "#E85A5A" : "#E9ECEF",
                      background: selectedStatus === option ? "#FFF0F0" : "#fff",
                      color: selectedStatus === option ? "#E85A5A" : "#636E72",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "#E85A5A",
            color: "#fff",
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {showDatePicker ? "Save Changes" : "Save"}
        </button>
        <button
          onClick={handleReset}
          style={{
            background: "#FFF0F0",
            border: "1px solid #E85A5A",
            borderRadius: "8px",
            cursor: "pointer",
            padding: "12px",
            color: "#E85A5A",
            width: "100%",
            marginTop: "12px",
          }}
        >
          Reset
          {/* <i className="fa-regular fa-calendar" style={{ fontSize: "16px" }}></i> */}
        </button>
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
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#FFEBEE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <i
              className="fa-solid fa-trash"
              style={{ color: "#E85A5A", fontSize: "24px" }}
            ></i>
          </div>
          <h5
            style={{ fontWeight: 600, color: "#2D3436", marginBottom: "8px" }}
          >
            Delete User
          </h5>
          <p style={{ color: "#636E72", fontSize: "14px" }}>
            Are you sure you want to delete <strong>{userName}</strong>? This
            action cannot be undone.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={onClose}
            className="btn"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #E9ECEF",
              background: "#fff",
              color: "#636E72",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "#E85A5A",
              color: "#fff",
              fontWeight: 500,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete"}
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
    <ContentWrapper title="User Management">
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
              User Management
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Manage and monitor all registered users
            </p>
          </div>
          <Button
            onClick={handleAddUser}
            className="btn d-flex align-items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            Add User
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="d-flex gap-3 white-box  mb-4">
          <div className="flex-grow-1 position-relative">
            <i
              className="fa-solid fa-search position-absolute"
              style={{
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#B2BEC3",
              }}
            ></i>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control bg-white"
              style={{
                padding: "12px 14px 12px 40px",
                borderRadius: "8px",
                border: " 1px solid #CDCDCD",
                fontSize: "14px",
              }}
            />
          </div>
          <button
            onClick={() => setFilterModalOpen(true)}
            className="btn d-flex align-items-center gap-2"
            style={{
              border: "1px solid #E85A5A",
              color: "#E85A5A",
              padding: "8px 20px",
              borderRadius: "8px",
              background: (filters.subscription || filters.status || filters.date) ? "#FFF0F0" : "#fff",
              fontWeight: 500,
              fontSize: "14px",
              position: "relative",
            }}
          >
            <i className="fa-solid fa-filter"></i>
            Sort/ Filter
            {(filters.subscription || filters.status || filters.date) && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#E85A5A",
                  color: "#fff",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                {(filters.subscription ? 1 : 0) + (filters.status ? 1 : 0) + (filters.date ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Table */}
        <div
          className="table-container"
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #E9ECEF",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAFAFA" }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Subscription</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <div
                        className="spinner-border"
                        style={{ color: "#E85A5A" }}
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#E85A5A",
                      }}
                    >
                      Failed to load users. Please try again.
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#636E72",
                      }}
                    >
                      <div>
                        <i
                          className="fa-solid fa-users"
                          style={{
                            fontSize: "48px",
                            color: "#E9ECEF",
                            marginBottom: "16px",
                          }}
                        ></i>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                          No users found
                        </p>
                        <p style={{ margin: "8px 0 0", fontSize: "12px" }}>
                          {searchTerm
                            ? "Try adjusting your search"
                            : "Click 'Add User' to create one"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      style={{ borderBottom: "1px solid #F0F0F0" }}
                    >
                      <td style={tdStyle}>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "#E9ECEF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <i
                                className="fa-solid fa-user"
                                style={{ color: "#B2BEC3", fontSize: "14px" }}
                              ></i>
                            )}
                          </div>
                          <span style={{ fontWeight: 500, color: "#2D3436" }}>
                            {user.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle}>{user.email || "N/A"}</td>
                      <td style={tdStyle}>{user.phone || "N/A"}</td>
                      <td style={tdStyle}>{formatDate(user.createdAt)}</td>
                      <td style={tdStyle}>
                        <SubscriptionBadge subscription={user.subscription} />
                      </td>
                      <td style={tdStyle}>
                        <StatusBadge status={user.status} />
                      </td>
                      <td style={tdStyle}>
                        <ActionDropdown
                          user={user}
                          onEdit={handleEditUser}
                          onView={handleViewUser}
                          onDelete={handleDeleteClick}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="d-flex justify-content-between align-items-center p-3"
            style={{ borderTop: "1px solid #F0F0F0" }}
          >
            <div style={{ fontSize: "13px", color: "#636E72" }}>
              Showing {users.length} of {totalResults} users
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  ...paginationBtnStyle,
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNumber = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                }
                return (
                  <button
                    className=""
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      ...paginationBtnStyle,
                      border:
                        currentPage === pageNumber
                          ? "1px solid #000"
                          : "1px solid #E9ECEF",
                      // background: currentPage === pageNumber ? "#E85A5A" : "#fff",
                      color: currentPage === pageNumber ? "#000" : "#000",
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  ...paginationBtnStyle,
                  opacity:
                    currentPage === totalPages || totalPages === 0 ? 0.5 : 1,
                  cursor:
                    currentPage === totalPages || totalPages === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          userName={userToDelete?.name || ""}
          loading={deleteUserMutation.isLoading}
        />

        {/* Filter Modal */}
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
