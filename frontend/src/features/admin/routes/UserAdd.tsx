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
      <div className="user-form-page">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#2D3436", marginBottom: "4px" }}>
              Add New User
            </h2>
            <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
              Create a new user account
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/users")}
            className="btn d-flex align-items-center gap-2"

          >
            <i className="fa-solid fa-arrow-left"></i> {" "}
            Back to Users
          </Button>
        </div>

        {/* Form */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #E9ECEF",
            padding: "32px",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="mb-4">
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #E9ECEF",
                  margin: "0 0 16px",
                  background: "#F5F5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <i className="fa-solid fa-user" style={{ fontSize: "40px", color: "#B2BEC3" }}></i>
                )}
              </div>
              <label
                htmlFor="image-upload"
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "1px solid #E53661",
                  background: "#fff",
                  color: "#E53661",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-block",
                }}
              >
                <i className="fa-solid fa-camera me-2"></i>
                Upload Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <label style={labelStyle}>Name <span style={{ color: "#E85A5A" }}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.name ? "#E85A5A" : "#E9ECEF",
                  }}
                  placeholder="Enter full name"
                />
                {errors.name && <span style={errorStyle}>{errors.name}</span>}
              </div>
              <div className="col-md-6 mb-4">
                <label style={labelStyle}>Phone Number</label>
                <div className={errors.phone ? "is-invalid" : ""}>
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, phone: value || "" }))
                    }
                    defaultCountry="IN"
                    style={{
                      ...inputStyle,
                      borderColor: errors.phone ? "#E85A5A" : "#E9ECEF",
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
                {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
              </div>
              <div className="col-md-6 mb-4">
                <label style={labelStyle}>Email <span style={{ color: "#E85A5A" }}>*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.email ? "#E85A5A" : "#E9ECEF",
                  }}
                  placeholder="example@gmail.com"
                />
                {errors.email && <span style={errorStyle}>{errors.email}</span>}
              </div>
              <div className="col-md-6 mb-4">
                <label style={labelStyle}>Subscription</label>
                <select
                  name="subscription"
                  value={formData.subscription}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
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
              <Button
                type="submit"
                disabled={createUserMutation.isLoading}

              >
                {createUserMutation.isLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ContentWrapper>
  );
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "16px",
  fontWeight: 400,
  color: "#8391A1",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #E9ECEF",
  fontSize: "14px",
  color: "#2D3436",
  background: "#FAFAFA",
};

const errorStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "#E85A5A",
  marginTop: "4px",
};
