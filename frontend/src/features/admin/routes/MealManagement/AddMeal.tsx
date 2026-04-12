import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { useCreateMeal, CreateMealDTO } from "../../hooks/useMeals";
import { uploadFile } from "../../api/upload";

export const AddMeal = () => {
    const navigate = useNavigate();
    const createMealMutation = useCreateMeal();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateMealDTO>({
        defaultValues: {
            mealName: "",
            image: "",
            category: "Breakfast",
            healthScore: 0,
            tips: "",
            items: [
                { name: "", portion: "", calories: 0, protein: 0, carbs: 0, fat: 0 }
            ],
            total: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        }
    });

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setIsUploading(true);
        try {
            const response = await uploadFile(file);
            setValue("image", response.data);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
            setImagePreview(null);
            setValue("image", "");
            if (fileInputRef.current) fileInputRef.current.value = "";
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setValue("image", "");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const watchItems = watch("items");

    // Calculate totals
    // Calculate totals
    // Calculate totals
    const totalCalories = watchItems?.reduce((sum: number, item: any) => sum + (Number(item.calories) || 0), 0) || 0;
    const totalProtein = Number((watchItems?.reduce((sum: number, item: any) => sum + (Number(item.protein) || 0), 0) || 0).toFixed(2));
    const totalCarbs = Number((watchItems?.reduce((sum: number, item: any) => sum + (Number(item.carbs) || 0), 0) || 0).toFixed(2));
    const totalFat = Number((watchItems?.reduce((sum: number, item: any) => sum + (Number(item.fat) || 0), 0) || 0).toFixed(2));

    const onSubmit = (data: CreateMealDTO) => {
        const payload = {
            ...data,
            total: {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            }
        };

        createMealMutation.mutate(payload, {
            onSuccess: () => {
                navigate("/admin/meals");
            }
        });
    };

    return (
        <ContentWrapper title="Add Meal">
            <div className="add-meal">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#2D3436" }}>
                        Add Meal
                    </h2>
                </div>

                <div className="white-box p-4" style={{ borderRadius: "12px", background: "#fff" }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Image Upload */}
                        <div className="col-12 mb-4">
                            <label className="form-label" style={labelStyle}>Meal Image <span className="text-danger">*</span></label>
                            <div
                                style={{
                                    border: "2px dashed #E9ECEF",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    textAlign: "center",
                                    background: "#FAFAFA",
                                    minHeight: "200px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                }}
                            >
                                {imagePreview ? (
                                    <div style={{ position: "relative", width: "100%", display: 'flex', justifyContent: 'center' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "180px",
                                                objectFit: "contain",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            style={{
                                                position: "absolute",
                                                top: "-10px",
                                                right: "-10px",
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "50%",
                                                background: "#E85A5A",
                                                color: "#fff",
                                                border: "none",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "12px",
                                            }}
                                        >
                                            <i className="fa-solid fa-times"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <i
                                            className="fa-solid fa-cloud-upload-alt"
                                            style={{ fontSize: "40px", color: "#B2BEC3", marginBottom: "12px" }}
                                        ></i>
                                        <p style={{ color: "#636E72", fontSize: "14px", marginBottom: "8px" }}>
                                            {isUploading ? "Uploading..." : "Click to upload image"}
                                        </p>
                                        <p style={{ color: "#B2BEC3", fontSize: "12px", margin: 0 }}>
                                            PNG, JPG up to 5MB
                                        </p>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    disabled={isUploading}
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        top: 0,
                                        left: 0,
                                        opacity: 0,
                                        cursor: isUploading ? "not-allowed" : "pointer",
                                    }}
                                />
                            </div>
                            <input type="hidden" {...register("image", { required: "Image is required" })} />
                            {errors.image && <span className="text-danger" style={{ fontSize: "12px" }}>{errors.image.message}</span>}
                        </div>

                        {/* Basic Info */}
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label" style={labelStyle}>Meal Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter meal name"
                                    {...register("mealName", { required: "Meal name is required" })}
                                    style={inputStyle}
                                />
                                {errors.mealName && <span className="text-danger" style={{ fontSize: "12px" }}>{errors.mealName.message}</span>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label" style={labelStyle}>Category</label>
                                <select className="form-select" {...register("category")} style={inputStyle}>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label" style={labelStyle}>Health Score</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="0-10"
                                    step="0.01"
                                    {...register("healthScore", { min: 0, max: 10, valueAsNumber: true })}
                                    style={inputStyle}
                                />
                            </div>
                            <div className="col-md-12 mb-3">
                                <label className="form-label" style={labelStyle}>Tips</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter tips for this meal..."
                                    {...register("tips")}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 style={{ fontWeight: 600, color: "#2D3436", fontSize: "16px" }}>Meal Ingredients</h5>
                                <Button
                                    type="button"
                                    onClick={() => append({ name: "", portion: "", calories: 0, protein: 0, carbs: 0, fat: 0 })}
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    + Add Item
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="p-3 mb-3" style={{ background: "#F8F9FA", borderRadius: "8px", position: "relative" }}>
                                    <div className="d-flex justify-content-end mb-2">
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="btn btn-sm text-danger"
                                                style={{ background: "transparent", border: "none" }}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-2">
                                            <label className="form-label small">Item Name</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="e.g. Grilled Chicken"
                                                {...register(`items.${index}.name` as const, { required: true })}
                                            />
                                        </div>
                                        <div className="col-md-2 mb-2">
                                            <label className="form-label small">Portion</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="e.g. 100g"
                                                {...register(`items.${index}.portion` as const, { required: true })}
                                            />
                                        </div>
                                        <div className="col-md-1 mb-2">
                                            <label className="form-label small">Cal</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control form-control-sm"
                                                {...register(`items.${index}.calories` as const, { required: true, min: 0, valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="col-md-1 mb-2">
                                            <label className="form-label small">Prot</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control form-control-sm"
                                                {...register(`items.${index}.protein` as const, { required: true, min: 0, valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="col-md-1 mb-2">
                                            <label className="form-label small">Carbs</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control form-control-sm"
                                                {...register(`items.${index}.carbs` as const, { required: true, min: 0, valueAsNumber: true })}
                                            />
                                        </div>
                                        <div className="col-md-1 mb-2">
                                            <label className="form-label small">Fat</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control form-control-sm"
                                                {...register(`items.${index}.fat` as const, { required: true, min: 0, valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals Summary */}
                        <div className="mb-4 p-3" style={{ background: "#E8F5E9", borderRadius: "8px" }}>
                            <h6 style={{ fontWeight: 600, color: "#2D3436", marginBottom: "12px" }}>Total Nutritional Value</h6>
                            <div className="d-flex gap-4">
                                <div><strong>Calories:</strong> {totalCalories}</div>
                                <div><strong>Protein:</strong> {totalProtein}g</div>
                                <div><strong>Carbs:</strong> {totalCarbs}g</div>
                                <div><strong>Fat:</strong> {totalFat}g</div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3">
                            <Button
                                type="button"
                                onClick={() => navigate("/admin/meals")}
                                variant="outline"
                                className="btn"
                                style={{ border: "1px solid #E9ECEF", color: "#636E72" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMealMutation.isLoading}
                                className="btn text-white"
                                style={{ background: "#E85A5A", border: "none" }}
                            >
                                {createMealMutation.isLoading ? "Creating..." : "Create Meal"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </ContentWrapper>
    );
};

const labelStyle = {
    fontSize: "13px",
    fontWeight: 500,
    color: "#636E72",
    marginBottom: "8px",
};

const inputStyle = {
    fontSize: "14px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #E9ECEF",
};
