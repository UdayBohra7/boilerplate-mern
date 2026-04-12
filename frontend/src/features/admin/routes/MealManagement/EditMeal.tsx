import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import ContentWrapper from "@/components/Layout/AdminLayout/ContentWrapper";
import { Button } from "@/components/Elements";
import { useMeal, useUpdateMeal, UpdateMealDTO } from "../../hooks/useMeals";

export const EditMeal = () => {
    const { mealId } = useParams();
    const navigate = useNavigate();
    const updateMealMutation = useUpdateMeal(mealId || "");
    const { data: meal, isLoading } = useMeal(mealId || "");

    const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<UpdateMealDTO>({
        defaultValues: {
            mealName: "",
            category: "Breakfast",
            healthScore: 0,
            tips: "",
            items: [],
            total: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items" as any
    });

    useEffect(() => {
        if (meal) {
            reset({
                mealName: meal.mealName,
                category: meal.category,
                healthScore: meal.healthScore,
                tips: meal.tips,
                items: meal.items || [],
                total: meal.total
            });
        }
    }, [meal, reset]);

    const watchItems = watch("items");

    // Calculate totals
    // Calculate totals
    // Calculate totals
    const totalCalories = watchItems?.reduce((sum: number, item: any) => sum + (Number(item.calories) || 0), 0) || 0;
    const totalProtein = Number((watchItems?.reduce((sum: number, item: any) => sum + (Number(item.protein) || 0), 0) || 0).toFixed(2));
    const totalCarbs = Number((watchItems?.reduce((sum: number, item: any) => sum + (Number(item.carbs) || 0), 0) || 0).toFixed(2));
    const totalFat = Number((watchItems?.reduce((sum: number, item: any) => sum + (Number(item.fat) || 0), 0) || 0).toFixed(2));

    const onSubmit = (data: UpdateMealDTO) => {
        const payload = {
            ...data,
            total: {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            }
        };

        updateMealMutation.mutate(payload, {
            onSuccess: () => {
                navigate("/admin/meals");
            }
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <ContentWrapper title="Edit Meal">
            <div className="add-meal">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#2D3436" }}>
                        Edit Meal
                    </h2>
                </div>

                <div className="white-box p-4" style={{ borderRadius: "12px", background: "#fff" }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                    + Add Ingredient
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
                                            <label className="form-label small">Ingredient Name</label>
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
                                disabled={updateMealMutation.isLoading}
                                className="btn text-white"
                                style={{ background: "#E85A5A", border: "none" }}
                            >
                                {updateMealMutation.isLoading ? "Updating..." : "Update Meal"}
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
