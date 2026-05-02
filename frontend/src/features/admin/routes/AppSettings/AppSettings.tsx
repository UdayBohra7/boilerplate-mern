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
    <ContentWrapper title="Application Banners">
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Banners</h2>
          <p className="text-gray-500 mt-1">Configure and update the main banner images for your mobile application.</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-6 md:p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Settings...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Kitchen Banner */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Marissa Kitchen Banner</label>
                  <div 
                    className={`relative group h-64 w-full border-4 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden ${
                      kitchenBannerPreview ? "border-blue-100 bg-blue-50/10" : "border-gray-100 bg-gray-50/50 hover:bg-gray-100/50 hover:border-gray-200"
                    }`}
                  >
                    {kitchenBannerPreview ? (
                      <div className="w-full h-full relative group">
                        <img
                          src={kitchenBannerPreview}
                          alt="Kitchen Banner"
                          className="w-full h-full object-contain rounded-2xl"
                          onError={(e) => { e.currentTarget.src = ImageNotAvailable; }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeImage('kitchen'); }}
                            className="bg-white text-red-500 w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <i className="fa-solid fa-trash-can text-lg"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">Upload Banner Image</p>
                          <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-tighter">Recommended: 1200 x 600px (Max 5MB)</p>
                        </div>
                      </>
                    )}
                    <input
                      ref={kitchenInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, 'kitchen')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.kitchen && <p className="text-xs text-red-500 font-bold ml-1">{errors.kitchen}</p>}
                </div>

                {/* Home Page Banner */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Home Page Product Banner</label>
                  <div 
                    className={`relative group h-64 w-full border-4 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden ${
                      homeBannerPreview ? "border-blue-100 bg-blue-50/10" : "border-gray-100 bg-gray-50/50 hover:bg-gray-100/50 hover:border-gray-200"
                    }`}
                  >
                    {homeBannerPreview ? (
                      <div className="w-full h-full relative group">
                        <img
                          src={homeBannerPreview}
                          alt="Home Banner"
                          className="w-full h-full object-contain rounded-2xl"
                          onError={(e) => { e.currentTarget.src = ImageNotAvailable; }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); removeImage('home'); }}
                            className="bg-white text-red-500 w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <i className="fa-solid fa-trash-can text-lg"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                          <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">Upload Banner Image</p>
                          <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-tighter">Recommended: 1200 x 600px (Max 5MB)</p>
                        </div>
                      </>
                    )}
                    <input
                      ref={homeInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, 'home')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.home && <p className="text-xs text-red-500 font-bold ml-1">{errors.home}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button
                  type="submit"
                  disabled={updateSettingsMutation.isLoading}
                  className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-save text-sm"></i>
                  {updateSettingsMutation.isLoading ? "Publishing Updates..." : "Save App Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};
