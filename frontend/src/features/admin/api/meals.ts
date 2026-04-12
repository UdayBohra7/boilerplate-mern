import { axios } from '@/lib/axios';

// Types
export interface MealItem {
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface Meal {
    id: string;
    mealName: string;
    image: string;
    total: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
        sugar?: number;
        sodium?: number;
    };
    items: MealItem[];
    healthScore?: number;
    tips?: string;
    category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    isCreatedByAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MealsResponse {
    results: Meal[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}

export interface MealResponse {
    success: boolean;
    message: string;
    data: Meal;
}

export interface CreateMealDTO {
    mealName: string;
    image: string;
    total?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    items?: MealItem[];
    healthScore?: number;
    tips?: string;
    category: string;
}

export interface UpdateMealDTO {
    mealName?: string;
    image?: string;
    total?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    items?: MealItem[];
    healthScore?: number;
    tips?: string;
    category?: string;
}

export interface GetMealsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    mealName?: string;
    category?: string;
}

// API Functions
export const getMeals = (params: GetMealsParams = {}): Promise<MealsResponse> => {
    const { page = 1, limit = 10, sortBy = 'createdAt:desc', mealName, category } = params;

    let queryString = `page=${page}&limit=${limit}&sortBy=${sortBy}`;

    if (mealName) {
        queryString += `&mealName=${encodeURIComponent(mealName)}`;
    }
    if (category) {
        queryString += `&category=${encodeURIComponent(category)}`;
    }

    return axios.get(`/admin/meals?${queryString}`);
};

export const getMeal = (mealId: string): Promise<Meal> => {
    return axios.get(`/admin/meals/${mealId}`);
};

export const createMeal = (data: CreateMealDTO): Promise<Meal> => {
    return axios.post('/admin/meals', data);
};

export const updateMeal = (mealId: string, data: UpdateMealDTO): Promise<Meal> => {
    return axios.patch(`/admin/meals/${mealId}`, data);
};

export const deleteMeal = (mealId: string): Promise<void> => {
    return axios.delete(`/admin/meals/${mealId}`);
};
