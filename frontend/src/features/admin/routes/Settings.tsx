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
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Profile...</p>
        </div>
      </ContentWrapper>
    );
  }

  if (isError || !user) {
    return (
      <ContentWrapper title="Settings">
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-circle-exclamation text-2xl"></i>
          </div>
          <p className="text-red-500 font-bold">Failed to load profile data</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-500 hover:underline"
          >
            Try refreshing the page
          </button>
        </div>
      </ContentWrapper>
    );
  }
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
    <ContentWrapper title="Account Settings">
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h2>
          <p className="text-gray-500 mt-1">Manage your administrative profile and security preferences.</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
          {/* Custom Tabs Navigation */}
          <div className="flex border-b border-gray-100 p-2 gap-1 bg-gray-50/50">
            <button
              onClick={() => setActiveTab("view")}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "view"
                  ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:bg-white/50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "edit"
                  ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:bg-white/50"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "password"
                  ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:bg-white/50"
              }`}
            >
              Security
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* View Profile Tab */}
            {activeTab === "view" && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                      {imageUrl ? (
                        <img src={imageUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-3xl font-black text-white">
                          {user.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black text-gray-900">{user.name || "Administrator"}</h3>
                    <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mt-1">System {user.role || "Admin"}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-100"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profile Details</span>
                    <div className="h-px flex-1 bg-gray-100"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">First Name</label>
                      <p className="text-gray-900 font-bold">{firstName || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Last Name</label>
                      <p className="text-gray-900 font-bold">{lastName || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                      <p className="text-gray-900 font-bold">{user.email || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                      <p className="text-gray-900 font-bold">{user.phone || "—"}</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={() => setActiveTab("edit")}
                      className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-200"
                    >
                      Update Profile Info
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === "edit" && (
              <form onSubmit={handleProfileSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center md:items-start gap-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Profile Photo</label>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-50">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200 text-3xl font-black uppercase">
                          {profileForm.firstName?.charAt(0) || "A"}
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="image-upload"
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-blue-600 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border border-gray-100"
                    >
                      <i className="fa-solid fa-camera text-sm"></i>
                      <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold ml-1 uppercase">JPG, PNG or GIF. Max 2MB.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none ${
                        profileErrors.firstName ? "border-red-500 bg-red-50" : "border-gray-100"
                      }`}
                    />
                    {profileErrors.firstName && <p className="text-xs text-red-500 font-bold ml-1">{profileErrors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full px-5 py-3.5 bg-gray-100 border border-gray-100 rounded-2xl font-bold text-gray-400 cursor-not-allowed outline-none"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                        <i className="fa-solid fa-lock text-xs"></i>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold ml-1 uppercase">Email cannot be changed manually.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={profileForm.phone}
                      onChange={(value) => setProfileForm((prev) => ({ ...prev, phone: value || "" }))}
                      defaultCountry="IN"
                      className={`w-full phone-input-container bg-gray-50 border rounded-2xl focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all font-bold ${
                        profileErrors.phone ? "border-red-500 bg-red-50" : "border-gray-100"
                      }`}
                    />
                    {profileErrors.phone && <p className="text-xs text-red-500 font-bold ml-1">{profileErrors.phone}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("view")}
                    className="px-8 py-3.5 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                    className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {updateProfileMutation.isLoading ? "Saving Changes..." : "Save Profile"}
                  </button>
                </div>
              </form>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-shield-halved text-2xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Security Update</h4>
                  <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className={`w-full pl-5 pr-12 py-3.5 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none ${
                          passwordErrors.currentPassword ? "border-red-500 bg-red-50" : "border-gray-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <i className={`fa-solid ${showPasswords.current ? "fa-eye-slash" : "fa-eye"}`}></i>
                      </button>
                    </div>
                    {passwordErrors.currentPassword && <p className="text-xs text-red-500 font-bold ml-1">{passwordErrors.currentPassword}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className={`w-full pl-5 pr-12 py-3.5 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none ${
                            passwordErrors.newPassword ? "border-red-500 bg-red-50" : "border-gray-100"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <i className={`fa-solid ${showPasswords.new ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                      </div>
                      {passwordErrors.newPassword && <p className="text-xs text-red-500 font-bold ml-1">{passwordErrors.newPassword}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className={`w-full pl-5 pr-12 py-3.5 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none ${
                            passwordErrors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-100"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <i className={`fa-solid ${showPasswords.confirm ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && <p className="text-xs text-red-500 font-bold ml-1">{passwordErrors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isLoading}
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg shadow-gray-200 hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {changePasswordMutation.isLoading ? "Updating Security Settings..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("view")}
                    className="w-full py-4 bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all border border-gray-100"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
