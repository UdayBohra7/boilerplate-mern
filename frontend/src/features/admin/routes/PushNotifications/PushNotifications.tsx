import { useState } from "react";
import Select from "react-select";
import { Button, Spinner } from "@/components/Elements";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import userss from "@/assets/users.png";
import activeUser from "@/assets/active.svg";
import premium from "@/assets/premium.svg";
import inactive from "@/assets/inactive.svg";
import bell from "@/assets/push.svg";
import dell from "@/assets/dell.svg";
import { useNotifications, useDeleteNotification, useSendNotification, Notification, useNotificationStats } from "../../api/notification";
import { useUsers } from "../../hooks/useUsers";
import { toast } from "react-toastify";

const PushNotifications = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);

  const { data: statsData } = useNotificationStats();

  const { data: notificationsData, isLoading } = useNotifications({
    page,
    limit: 10,
    filter: activeTab === 'inbox' ? 'received' : 'sent',
  });

  const handleDeleteClick = (notification: Notification) => {
    setNotificationToDelete(notification);
    setDeleteModalOpen(true);
  };

  const deleteMutation = useDeleteNotification();

  const handleDeleteConfirm = () => {
    if (notificationToDelete) {
      deleteMutation.mutate(notificationToDelete._id, {
        onSuccess: () => {
          toast.success("Notification deleted successfully");
          setDeleteModalOpen(false);
          setNotificationToDelete(null);
        },
        onError: () => {
          toast.error("Failed to delete notification");
          setDeleteModalOpen(false);
        }
      });
    }
  };

  return (
    <ContentWrapper title="Push Notifications">
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
              Push Notifications
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Create and manage push notifications
            </p>
          </div>
          <Button
            className="btn d-flex align-items-center gap-2"
            onClick={() => setCreateModalOpen(true)}
          >
            <i className="fa-solid fa-plus"></i>
            Create new Notification
          </Button>
        </div>

        {/* Analytics Cards - Static for now */}
        <div className="row">
          <div className="col-12 col-md-3 mb-4">
            <div className="analytic-rpt white-box d-flex align-items-center gap-2">
              <img src={userss} className="users-ico" />
              <div className="analytic-content">
                <p className="gray f-14 mb-0">Total Notifications</p>
                <p className="semi-bold mb-0">{statsData?.data?.totalNotifications || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 mb-4">
            <div className="analytic-rpt white-box d-flex align-items-center gap-2">
              <img src={activeUser} className="users-ico" />
              <div className="analytic-content">
                <p className="gray f-14 mb-0">Created By Admin</p>
                <p className="semi-bold mb-0">{statsData?.data?.totalSentByAdmin || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 mb-4">
            <div className="analytic-rpt white-box d-flex align-items-center gap-2">
              <img src={premium} className="users-ico" />
              <div className="analytic-content">
                <p className="gray f-14 mb-0">Successful Deliveries</p>
                <p className="semi-bold mb-0">{statsData?.data?.successfulDeliveries || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 mb-4">
            <div className="analytic-rpt white-box d-flex align-items-center gap-2">
              <img src={inactive} className="users-ico" />
              <div className="analytic-content">
                <p className="gray f-14 mb-0">Failed Deliveries</p>
                <p className="semi-bold mb-0">{statsData?.data?.failedDeliveries || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="d-flex gap-3 mb-4">
          <Button
            className={`btn ${activeTab === 'inbox' ? 'btn-primary' : 'bg-white text-dark border'}`}
            onClick={() => { setActiveTab('inbox'); setPage(1); }}
          >
            Inbox (For Admin)
          </Button>
          <Button
            className={`btn ${activeTab === 'sent' ? 'btn-primary' : 'bg-white text-dark border'}`}
            onClick={() => { setActiveTab('sent'); setPage(1); }}
          >
            Sent (By Admin)
          </Button>
        </div>

        {/* Notifications List */}
        <div className="row">
          {isLoading ? (
            <div className="col-12 text-center py-5 d-flex justify-content-center align-items-center">
              <Spinner size="lg" />
            </div>
          ) : notificationsData?.data && notificationsData.data.length > 0 ? (
            notificationsData.data.map((notification: Notification) => (
              <div className="col-12 col-md-6 mb-4" key={notification._id}>
                <div className="push-notification white-box">
                  <div className="push-notes mb-3 d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-2">
                      <img src={bell} className="push-ico" />
                      <div className="push-notify">
                        <p className="mb-0 semi-bold">{notification.title}</p>
                        <span className="schedule-bx f-14">{notification.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="gray f-12 mb-0">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="">{notification.message}</p>
                  <div className="schedule-goal">
                    <div className="schedule-goal-col">
                      <p className="gray f-14 mb-1">Title</p>
                      <p className="f-14 mb-1 text-capitalize">{notification.title}</p>
                    </div>

                    {activeTab === 'sent' && (
                      <>
                        <div className="schedule-goal-col">
                          <p className="gray f-14 mb-1">Sent</p>
                          <p className="f-14 mb-1 text-success">
                            {notification.users ? notification.users.length : 0}
                          </p>
                        </div>
                        <div className="schedule-goal-col">
                          <p className="gray f-14 mb-1">Failed</p>
                          <p className="f-14 mb-1 text-danger">
                            {notification.failedUsers ? notification.failedUsers.length : 0}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="schedule-goal-col">
                      <p className="gray f-14 mb-1">Channel</p>
                      <p className="f-14 mb-1 text-capitalize">{notification.channel}</p>
                    </div>
                  </div>
                  <div className="schedule-btns mt-4 d-flex align-items-center gap-3">
                    {/* Add Edit/Copy later if needed */}
                    <button
                      className="schedule-btn border-0 bg-transparent p-0"
                      onClick={() => handleDeleteClick(notification)}
                    >
                      <img src={dell} className="notify-icons" height={40} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">No notifications found</div>
          )}
        </div>

        {/* Pagination */}
        {notificationsData?.pagination && notificationsData.pagination.totalPages > 1 && (
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              className="btn bg-white text-dark border"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="align-self-center">
              Page {page} of {notificationsData.pagination.totalPages}
            </span>
            <Button
              className="btn bg-white text-dark border"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= notificationsData.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Create Modal */}
        {createModalOpen && (
          <CreateNotificationModal onClose={() => setCreateModalOpen(false)} />
        )}

        {/* Delete Modal */}
        {deleteModalOpen && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div className="bg-white p-4 rounded" style={{ width: '400px' }}>
              <h4 className="mb-3">Delete Notification</h4>
              <p>Are you sure you want to delete this notification?</p>
              <div className="d-flex gap-2 justify-content-end mt-4">
                <Button
                  className="bg-secondary border-0"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-danger border-0"
                  onClick={handleDeleteConfirm}
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

const CreateNotificationModal = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"push" | "email">("push");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");

  const { data: usersData } = useUsers({ search: userSearch, limit: 10 });
  const sendMutation = useSendNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    sendMutation.mutate({
      userIds: selectedUserIds,
      title,
      message,
      channel
    }, {
      onSuccess: () => {
        toast.success("Notification sent successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to send notification");
      }
    });
  };

  const userOptions = usersData?.data?.map(user => ({
    value: user._id,
    label: `${user.name} (${user.email})`
  })) || [];

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="bg-white p-4 rounded" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h4 className="mb-4">Create Notification</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">User</label>
            <Select
              isMulti
              options={userOptions}
              onInputChange={(newValue) => setUserSearch(newValue)}
              onChange={(selectedOptions) => {
                setSelectedUserIds(selectedOptions.map((option: any) => option.value));
              }}
              placeholder="Search and select users..."
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Channel</label>
            <select
              className="form-control"
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
            >
              <option value="push">Push Notification</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button
              className="bg-secondary border-0"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary border-0"
              type="submit"
              disabled={sendMutation.isLoading}
            >
              {sendMutation.isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PushNotifications;
