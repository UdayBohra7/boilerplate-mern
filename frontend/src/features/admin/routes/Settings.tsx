import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useUser } from "@/lib/auth";
import {
  useUpdateAdminProfile,
  useChangeAdminPassword,
} from "../hooks/useProfile";
import { BASE_URL } from "@/lib/config";
import { Button } from "@/components/Elements";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

type TabType = "view" | "edit" | "password";

export const Settings = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUser();
  const updateProfileMutation = useUpdateAdminProfile();
  const changePasswordMutation = useChangeAdminPassword();

  const [activeTab, setActiveTab] = useState<TabType>("view");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Edit Profile Form
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {}
  );

  // Change Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(" ") || ["", ""];
      setProfileForm({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      if (user.image) {
        const imagePath = user.image;
        const imageUrl = imagePath.startsWith("http")
          ? imagePath
          : `${BASE_URL}${imagePath}`;
        setImagePreview(imageUrl);
      }
    }
  }, [user]);

  const getImageUrl = (image?: string) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
  };

  // Profile Form Handlers
  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    if (!profileForm.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!profileForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (profileForm.phone && !isValidPhoneNumber(profileForm.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    const submitData = new FormData();
    const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim();
    submitData.append("name", fullName);
    submitData.append("firstName", profileForm.firstName);
    submitData.append("lastName", profileForm.lastName);
    submitData.append("email", profileForm.email);
    submitData.append("phone", profileForm.phone || ""); // Always append phone, even if empty
    if (imageFile) submitData.append("image", imageFile);

    updateProfileMutation.mutate(submitData, {
      onSuccess: () => {
        setActiveTab("view");
        setImageFile(null);
      },
    });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Password Form Handlers
  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    if (!passwordForm.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (!passwordForm.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setActiveTab("view");
      },
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoading) {
    return (
      <ContentWrapper title="Settings">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="text-center">
            <div
              className="spinner-border"
              style={{ color: "#E85A5A" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ marginTop: "16px", color: "#636E72" }}>Loading...</p>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  if (isError || !user) {
    return (
      <ContentWrapper title="Settings">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="text-center">
            <i
              className="fa-solid fa-exclamation-circle"
              style={{
                fontSize: "48px",
                color: "#E85A5A",
                marginBottom: "16px",
              }}
            ></i>
            <p style={{ color: "#636E72", marginBottom: "16px" }}>
              Failed to load profile
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn"
              style={{
                background: "#E85A5A",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  const imageUrl = getImageUrl(user.image) || imagePreview;
  const nameParts = user.name?.split(" ") || ["", ""];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <ContentWrapper title="Settings">
      <div className="settings-page">
        {/* Header */}
        <div className="mb-4">
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#2D3436",
              marginBottom: "4px",
            }}
          >
            Settings
          </h2>
          <p className="gray">Configure app settings and manage admin users</p>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #E9ECEF",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <div className="border-bottom">
            <div
              className="settings-tab gap-3"
              style={{
                display: "flex",
              }}
            >
              <button
                className="border-none"
                onClick={() => setActiveTab("view")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  background: activeTab === "view" ? "#fff" : "transparent",
                  border: "none",
                  boxShadow:
                    activeTab === "view"
                      ? "0px 1.16px 2.33px 0px #1018280F"
                      : "",
                  color: activeTab === "view" ? "#000" : "#000",
                  fontWeight: activeTab === "view" ? 600 : 400,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                View Profile
              </button>
              <button
                className="border-0"
                onClick={() => setActiveTab("edit")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  background: activeTab === "edit" ? "#fff" : "transparent",
                  border: "none",
                  boxShadow:
                    activeTab === "edit"
                      ? "0px 1.16px 2.33px 0px #1018280F"
                      : "",
                  color: activeTab === "edit" ? "#000" : "#000",
                  fontWeight: activeTab === "edit" ? 600 : 400,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Edit Profile
              </button>
              <button
                className="border-0"
                onClick={() => setActiveTab("password")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  background: activeTab === "password" ? "#fff" : "transparent",
                  border: "none",
                  boxShadow:
                    activeTab === "password"
                      ? "0px 1.16px 2.33px 0px #1018280F"
                      : "",
                  color: activeTab === "password" ? "#000" : "#000",
                  fontWeight: activeTab === "password" ? 600 : 400,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Change Password
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="setting-profile">
            {/* View Profile Tab */}
            {activeTab === "view" && (
              <div>
                {/* Profile Header */}
                <div
                  className="profile-details p-3"
                  style={{
                    marginBottom: "22px",
                  }}
                >
                  <div className="d-flex align-items-center gap-4">
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3px solid #fff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={user.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #E85A5A 0%, #D4A5A5 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "32px",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          >
                            {user.name?.charAt(0)?.toUpperCase() || "A"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#2D3436",
                          margin: 0,
                        }}
                      >
                        {user.name || "Administrator"}
                      </h3>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "8px",
                          background: "#fff",
                          borderRadius: "20px",
                          fontSize: "12px",
                          color: "#636E72",
                        }}
                      >
                        {user.role || "Admin"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h4
                    className="p-3"
                    style={{
                      background: " #FFF2F5",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#2D3436",
                      marginBottom: "24px",
                    }}
                  >
                    Personal Information
                  </h4>
                  <div className="p-3">
                    <div className="row w-100 mx-auto">
                      <div className="col-md-6 mb-4">
                        <label style={viewLabelStyle}>First Name</label>
                        <div style={viewValueStyle}>{firstName || "—"}</div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <label style={viewLabelStyle}>Last Name</label>
                        <div style={viewValueStyle}>{lastName || "—"}</div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <label style={viewLabelStyle}>Email</label>
                        <div style={viewValueStyle}>{user.email || "—"}</div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <label style={viewLabelStyle}>Phone</label>
                        <div style={viewValueStyle}>{user.phone || "—"}</div>
                      </div>
                      <div className="col-12">
                        {/* Edit Profile Button */}
                        <div
                          className="d-flex justify-content-end"
                          style={{ marginTop: "16px" }}
                        >
                          <button
                            onClick={() => setActiveTab("edit")}
                            style={{
                              padding: "12px 32px",
                              borderRadius: "8px",
                              border: "none",
                              background: "#F882A1",
                              color: "#fff",
                              fontWeight: 500,
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === "edit" && (
              <form onSubmit={handleProfileSubmit}>
                <div className="p-3">
                  {/* Image Upload */}
                  <div className="mb-4">
                    <div
                      style={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        margin: "0",
                      }}
                    >
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "3px solid #E9ECEF",
                          background: "#F5F5F5",
                        }}
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(135deg, #E85A5A 0%, #D4A5A5 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "36px",
                                color: "#fff",
                                fontWeight: 600,
                              }}
                            >
                              {profileForm.firstName
                                ?.charAt(0)
                                ?.toUpperCase() || "A"}
                            </span>
                          </div>
                        )}
                        <p className="f-14">Profile Picture</p>
                      </div>
                      <label
                        htmlFor="image-upload"
                        style={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#e53661",
                          border: "2px solid #fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <i
                          className="fa-solid fa-pencil"
                          style={{ color: "#fff", fontSize: "12px" }}
                        ></i>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="row w-100 mx-auto">
                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        style={{
                          ...inputStyle,
                          borderColor: profileErrors.firstName
                            ? "#E85A5A"
                            : "#E9ECEF",
                        }}
                        placeholder="Enter first name"
                      />
                      {profileErrors.firstName && (
                        <span style={errorStyle}>
                          {profileErrors.firstName}
                        </span>
                      )}
                    </div>
                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        style={inputStyle}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        style={{
                          ...inputStyle,
                          borderColor: profileErrors.email
                            ? "#E85A5A"
                            : "#E9ECEF",
                          backgroundColor: "#e9ecef",
                          cursor: "not-allowed",
                          color: "#6c757d"
                        }}
                        placeholder="Enter email"
                        disabled
                      />
                      {profileErrors.email && (
                        <span style={errorStyle}>{profileErrors.email}</span>
                      )}
                    </div>
                    <div className="col-md-6 mb-4">
                      <label style={labelStyle}>Phone</label>
                      <div className={profileErrors.phone ? "is-invalid" : ""}>
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={profileForm.phone}
                          onChange={(value) =>
                            setProfileForm((prev) => ({ ...prev, phone: value || "" }))
                          }
                          defaultCountry="IN"
                          style={{
                            ...inputStyle,
                            borderColor: profileErrors.phone ? "#E85A5A" : "#E9ECEF",
                          }}
                          numberInputProps={{
                            style: {
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              height: "100%",
                              width: "100%",
                            }
                          }}
                        />
                      </div>
                      {profileErrors.phone && (
                        <span style={errorStyle}>{profileErrors.phone}</span>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-3 mt-3">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("view")}
                      className="border-btn"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      style={{
                        opacity: updateProfileMutation.isLoading ? 0.7 : 1,
                      }}
                    >
                      {updateProfileMutation.isLoading
                        ? "Saving..."
                        : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit}>
                <div className="p-3">
                  <div className="row w-100 mx-auto">
                    <div className="col-md-6">
                      <div className="mb-4">
                        <label style={labelStyle}>Current Password</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            style={{
                              ...inputStyle,
                              paddingRight: "48px",
                              borderColor: passwordErrors.currentPassword
                                ? "#E85A5A"
                                : "#E9ECEF",
                            }}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("current")}
                            style={eyeButtonStyle}
                          >
                            <i
                              className={`fa-solid ${showPasswords.current
                                ? "fa-eye-slash"
                                : "fa-eye"
                                }`}
                            ></i>
                          </button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <span style={errorStyle}>
                            {passwordErrors.currentPassword}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4">
                        <label style={labelStyle}>New Password</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            style={{
                              ...inputStyle,
                              paddingRight: "48px",
                              borderColor: passwordErrors.newPassword
                                ? "#E85A5A"
                                : "#E9ECEF",
                            }}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("new")}
                            style={eyeButtonStyle}
                          >
                            <i
                              className={`fa-solid ${showPasswords.new ? "fa-eye-slash" : "fa-eye"
                                }`}
                            ></i>
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <span style={errorStyle}>
                            {passwordErrors.newPassword}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4">
                        <label style={labelStyle}>Confirm New Password</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            style={{
                              ...inputStyle,
                              paddingRight: "48px",
                              borderColor: passwordErrors.confirmPassword
                                ? "#E85A5A"
                                : "#E9ECEF",
                            }}
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirm")}
                            style={eyeButtonStyle}
                          >
                            <i
                              className={`fa-solid ${showPasswords.confirm
                                ? "fa-eye-slash"
                                : "fa-eye"
                                }`}
                            ></i>
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <span style={errorStyle}>
                            {passwordErrors.confirmPassword}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab("view")}
                      style={{
                        padding: "12px 32px",
                        borderRadius: "8px",
                        border: "1px solid #E9ECEF",
                        background: "#fff",
                        color: "#636E72",
                        fontWeight: 500,
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={changePasswordMutation.isLoading}
                      style={{
                        padding: "12px 32px",
                        borderRadius: "8px",
                        border: "none",
                        background: "#F882A1",
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: "14px",
                        cursor: "pointer",
                        opacity: changePasswordMutation.isLoading ? 0.7 : 1,
                      }}
                    >
                      {changePasswordMutation.isLoading
                        ? "Updating..."
                        : "Update Password"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

// Styles
const viewLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "#636E72",
  marginBottom: "8px",
  fontWeight: 500,
};

const viewValueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#2D3436",
  padding: "12px 16px",
  background: "#F8F9FA",
  borderRadius: "8px",
  border: "1px solid #E9ECEF",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#636E72",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #E9ECEF",
  fontSize: "14px",
  color: "#2D3436",
  background: "#fff",
};

const errorStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "#E85A5A",
  marginTop: "4px",
};

const eyeButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#636E72",
  cursor: "pointer",
  padding: "4px",
};
