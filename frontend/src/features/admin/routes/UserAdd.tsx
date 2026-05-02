import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { useCreateUser } from "../hooks/useUsers";
import { Button } from "@/components/Elements";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export const UserAdd = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subscription: "Free",
    status: "Active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createUserMutation = useCreateUser();

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
      const value = formData[key as keyof typeof formData];
      if (value !== "" && value !== null && value !== undefined) {
        submitData.append(key, value.toString());
      }
    });

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    createUserMutation.mutate(submitData, {
      onSuccess: () => {
        navigate("/admin/users");
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "booking" ? parseInt(value) || 0 : value,
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

  return (
    <ContentWrapper title="Add User">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Add New User
            </h2>
            <p className="text-gray-500 mt-1">
              Create a new user account and set permissions.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back to Users
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
                  htmlFor="image-upload"
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all transform hover:scale-110"
                >
                  <i className="fa-solid fa-camera"></i>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-semibold text-gray-900">Profile Picture</h4>
                <p className="text-sm text-gray-500 max-w-sm">
                  Upload a high-quality image to help identify the user. Supports JPG, PNG and WEBP.
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
                  } focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400`}
                  placeholder="e.g. John Doe"
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
                  } focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-xs font-medium text-red-500 ml-1">{errors.email}</p>}
              </div>

              {/* Subscription */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Subscription Plan</label>
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
                Cancel
              </button>
              <button
                type="submit"
                disabled={createUserMutation.isLoading}
                className="flex-1 md:flex-none px-12 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                {createUserMutation.isLoading ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    Creating User...
                  </>
                ) : (
                  "Create User Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ContentWrapper>
  );
};
