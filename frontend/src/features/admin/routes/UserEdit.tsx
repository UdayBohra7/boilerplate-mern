import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useUser, useUpdateUser } from "../hooks/useUsers";
import { BASE_URL } from "@/lib/config";
import { Button } from "@/components/Elements";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export const UserEdit = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subscription: "Free",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch user data
  const {
    data: userData,
    isLoading: fetching,
    isError,
    error,
  } = useUser(userId || "");
  const updateUserMutation = useUpdateUser(userId || "");

  // Populate form when user data is loaded
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        subscription: user.subscription || "Free",
        image: user.image || "",
      });

      if (user.image) {
        const imageUrl = user.image.startsWith("http")
          ? user.image
          : `${BASE_URL}${user.image}`;
        setImagePreview(imageUrl);
      }
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "image") {
        const value = formData[key as keyof typeof formData];
        if (value !== "" && value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      }
    });

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    updateUserMutation.mutate(submitData, {
      onSuccess: () => {
        navigate("/admin/users");
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  if (fetching) {
    return (
      <ContentWrapper title="Edit User">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Spinner size="xl" className="text-blue-600" />
          <p className="text-gray-500 font-medium animate-pulse">Loading user data...</p>
        </div>
      </ContentWrapper>
    );
  }

  if (isError) {
    return (
      <ContentWrapper title="Edit User">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-red-50 rounded-2xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <i className="fa-solid fa-exclamation-triangle text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {(error as Error)?.message || "Failed to load user data. Please check your connection and try again."}
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
          >
            Back to User Management
          </button>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper title="Edit User Detail">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Edit User Detail
            </h2>
            <p className="text-gray-500 mt-1">
              Manage and monitor all registered users details and account status.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/users/add")}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            Add New User
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row items-start gap-10 mb-10 pb-10 border-b border-gray-100">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-50 bg-gray-100 flex items-center justify-center transition-all group-hover:border-blue-100 shadow-inner">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-user text-5xl text-gray-300"></i>
                  )}
                </div>
                <label
                  htmlFor="image-upload-edit"
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all transform hover:scale-110"
                >
                  <i className="fa-solid fa-camera"></i>
                </label>
                <input
                  id="image-upload-edit"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-semibold text-gray-900">Change Profile Image</h4>
                <p className="text-sm text-gray-500 max-w-sm">
                  Update the user's avatar. For best results, use a square image with a minimum size of 200x200 pixels.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-gray-50/50"
                  } focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-xs font-medium text-red-500 ml-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                <div className={`px-4 py-1.5 rounded-xl border ${
                  errors.phone ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-gray-50/50"
                } focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all`}>
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, phone: value || "" }))
                    }
                    defaultCountry="IN"
                    className="phone-input-custom"
                    numberInputProps={{
                      className: "w-full bg-transparent border-none focus:ring-0 text-sm py-2"
                    }}
                  />
                </div>
                {errors.phone && <p className="text-xs font-medium text-red-500 ml-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-gray-50/50"
                  } focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all`}
                  placeholder="example@gmail.com"
                />
                {errors.email && <p className="text-xs font-medium text-red-500 ml-1">{errors.email}</p>}
              </div>

              {/* Subscription */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Subscription Tier</label>
                <div className="relative">
                  <select
                    name="subscription"
                    value={formData.subscription}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Free">Free Plan</option>
                    <option value="Pro">Pro Plan</option>
                    <option value="Premium">Premium Plan</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-8 py-3.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                disabled={updateUserMutation.isLoading}
                className="flex-1 md:flex-none px-12 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                {updateUserMutation.isLoading ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    Saving Changes...
                  </>
                ) : (
                  "Update User Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ContentWrapper>
  );
};

