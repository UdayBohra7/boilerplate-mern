import React, { useState, useRef, useEffect } from "react";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { useGetAppSettings, useUpdateAppSettings } from "../../hooks/useAppSettings";
import { BASE_URL } from "@/lib/config";
import ImageNotAvailable from "@/assets/not-available.jpeg";

export const AppSettings = () => {
    const { data: settingsData, isLoading: isFetching } = useGetAppSettings();
    const updateSettingsMutation = useUpdateAppSettings();

    const kitchenInputRef = useRef<HTMLInputElement>(null);
    const homeInputRef = useRef<HTMLInputElement>(null);

    const [kitchenBanner, setKitchenBanner] = useState<File | null>(null);
    const [kitchenBannerPreview, setKitchenBannerPreview] = useState<string | null>(null);

    const [homeBanner, setHomeBanner] = useState<File | null>(null);
    const [homeBannerPreview, setHomeBannerPreview] = useState<string | null>(null);

    const [clearKitchenBanner, setClearKitchenBanner] = useState(false);
    const [clearHomeBanner, setClearHomeBanner] = useState(false);

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (settingsData?.data) {
            if (settingsData.data.marissaKitchenBanner) {
                const banner = settingsData.data.marissaKitchenBanner;
                setKitchenBannerPreview(banner.includes("http") ? banner : `${BASE_URL}/uploads/${banner}`);
            }
            if (settingsData.data.homePageProductBanner) {
                const banner = settingsData.data.homePageProductBanner;
                setHomeBannerPreview(banner.includes("http") ? banner : `${BASE_URL}/uploads/${banner}`);
            }
        }
    }, [settingsData]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'kitchen' | 'home') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({ ...prev, [type]: "Please select a valid image file" }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, [type]: "Image size must be less than 5MB" }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'kitchen') {
                setKitchenBanner(file);
                setKitchenBannerPreview(reader.result as string);
            } else {
                setHomeBanner(file);
                setHomeBannerPreview(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
        setErrors((prev) => ({ ...prev, [type]: "" }));
    };

    const removeImage = (type: 'kitchen' | 'home') => {
        if (type === 'kitchen') {
            setKitchenBanner(null);
            setKitchenBannerPreview(null);
            setClearKitchenBanner(true);
            setErrors((prev) => ({ ...prev, kitchen: "" }));
            if (kitchenInputRef.current) kitchenInputRef.current.value = "";
        } else {
            setHomeBanner(null);
            setHomeBannerPreview(null);
            setClearHomeBanner(true);
            setErrors((prev) => ({ ...prev, home: "" }));
            if (homeInputRef.current) homeInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        if (kitchenBanner) {
            submitData.append("marissaKitchenBanner", kitchenBanner);
        } else if (clearKitchenBanner) {
            submitData.append("marissaKitchenBanner", "");
        }

        if (homeBanner) {
            submitData.append("homePageProductBanner", homeBanner);
        } else if (clearHomeBanner) {
            submitData.append("homePageProductBanner", "");
        }

        updateSettingsMutation.mutate(submitData);
    };

    return (
        <ContentWrapper title="App Settings">
            <div className="category-form-page">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#2D3436", marginBottom: "4px" }}>
                            Manage App Settings
                        </h2>
                        <p style={{ color: "#636E72", fontSize: "14px", margin: 0 }}>
                            Update application banners
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #E9ECEF",
                        padding: "32px",
                    }}
                >
                    {isFetching ? (
                        <div>Loading settings...</div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <label style={labelStyle}>Marissa Kitchen Banner</label>
                                    <div style={uploadBoxStyle}>
                                        {kitchenBannerPreview ? (
                                            <div style={{ position: "relative", width: "100%" }}>
                                                <img
                                                    src={kitchenBannerPreview}
                                                    alt="Kitchen Banner Preview"
                                                    style={imagePreviewStyle}
                                                    onError={(e) => {
                                                        e.currentTarget.src = ImageNotAvailable;
                                                    }}
                                                />
                                                <button type="button" onClick={() => removeImage('kitchen')} style={removeButtonStyle}>
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-cloud-upload-alt" style={uploadIconStyle}></i>
                                                <p style={uploadTextStyle}>Click to upload image</p>
                                                <p style={uploadSubtextStyle}>PNG, JPG up to 5MB</p>
                                            </>
                                        )}
                                        <input
                                            ref={kitchenInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageSelect(e, 'kitchen')}
                                            style={hiddenInputStyle}
                                        />
                                    </div>
                                    {errors.kitchen && <span style={errorStyle}>{errors.kitchen}</span>}
                                </div>

                                <div className="col-md-6 mb-4">
                                    <label style={labelStyle}>Home Page Product Banner</label>
                                    <div style={uploadBoxStyle}>
                                        {homeBannerPreview ? (
                                            <div style={{ position: "relative", width: "100%" }}>
                                                <img
                                                    src={homeBannerPreview}
                                                    alt="Home Banner Preview"
                                                    style={imagePreviewStyle}
                                                    onError={(e) => {
                                                        e.currentTarget.src = ImageNotAvailable;
                                                    }}
                                                />
                                                <button type="button" onClick={() => removeImage('home')} style={removeButtonStyle}>
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-cloud-upload-alt" style={uploadIconStyle}></i>
                                                <p style={uploadTextStyle}>Click to upload image</p>
                                                <p style={uploadSubtextStyle}>PNG, JPG up to 5MB</p>
                                            </>
                                        )}
                                        <input
                                            ref={homeInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageSelect(e, 'home')}
                                            style={hiddenInputStyle}
                                        />
                                    </div>
                                    {errors.home && <span style={errorStyle}>{errors.home}</span>}
                                </div>
                            </div>

                            <div className="d-flex gap-3 mt-4">
                                <Button
                                    type="submit"
                                    disabled={updateSettingsMutation.isLoading}
                                >
                                    {updateSettingsMutation.isLoading ? "Saving..." : "Save Settings"}
                                </Button>

                            </div>
                        </form>
                    )}
                </div>
            </div>
        </ContentWrapper>
    );
};

const labelStyle: React.CSSProperties = { display: "block", fontSize: "16px", fontWeight: 400, color: "#8391A1", marginBottom: "8px" };
const errorStyle: React.CSSProperties = { display: "block", fontSize: "12px", color: "#E85A5A", marginTop: "4px" };
const uploadBoxStyle: React.CSSProperties = { border: "2px dashed #E9ECEF", borderRadius: "12px", padding: "20px", textAlign: "center", background: "#FAFAFA", minHeight: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" };
const imagePreviewStyle: React.CSSProperties = { maxWidth: "100%", maxHeight: "180px", objectFit: "contain", borderRadius: "8px" };
const removeButtonStyle: React.CSSProperties = { position: "absolute", top: "-10px", right: "-10px", width: "28px", height: "28px", borderRadius: "50%", background: "#E85A5A", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", zIndex: 10 };
const uploadIconStyle: React.CSSProperties = { fontSize: "40px", color: "#B2BEC3", marginBottom: "12px" };
const uploadTextStyle: React.CSSProperties = { color: "#636E72", fontSize: "14px", marginBottom: "8px" };
const uploadSubtextStyle: React.CSSProperties = { color: "#B2BEC3", fontSize: "12px", margin: 0 };
const hiddenInputStyle: React.CSSProperties = { position: "absolute", width: "100%", height: "100%", top: 0, left: 0, opacity: 0, cursor: "pointer" };
