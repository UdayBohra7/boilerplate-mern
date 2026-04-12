import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    getMeals,
    getMeal,
    createMeal,
    updateMeal,
    deleteMeal,
    GetMealsParams,
    MealsResponse,
    Meal,
    CreateMealDTO,
    UpdateMealDTO
} from '../api/meals';

// Re-export Meal type for components
export type { Meal, CreateMealDTO, UpdateMealDTO } from '../api/meals';

// Query Keys
export const mealKeys = {
    all: ['meals'] as const,
    lists: () => [...mealKeys.all, 'list'] as const,
    list: (params: GetMealsParams) => [...mealKeys.lists(), params] as const,
    details: () => [...mealKeys.all, 'detail'] as const,
    detail: (id: string) => [...mealKeys.details(), id] as const,
};

// Hook: Get Meals List
export const useMeals = (params: GetMealsParams = {}) => {
    return useQuery<MealsResponse, Error>({
        queryKey: mealKeys.list(params),
        queryFn: () => getMeals(params),
        keepPreviousData: true,
    });
};

// Hook: Get Single Meal
export const useMeal = (mealId: string) => {
    return useQuery<Meal, Error>({
        queryKey: mealKeys.detail(mealId),
        queryFn: () => getMeal(mealId),
        enabled: !!mealId,
    });
};

// Hook: Create Meal
export const useCreateMeal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMealDTO) => createMeal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mealKeys.lists() });
            toast.success('Meal created successfully');
        },
        onError: () => {
            // Error is handled by axios interceptor
        },
    });
};

// Hook: Update Meal
export const useUpdateMeal = (mealId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateMealDTO) => updateMeal(mealId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mealKeys.lists() });
            queryClient.invalidateQueries({ queryKey: mealKeys.detail(mealId) });
            toast.success('Meal updated successfully');
        },
        onError: () => {
            // Error is handled by axios interceptor
        },
    });
};

// Hook: Delete Meal
export const useDeleteMeal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (mealId: string) => deleteMeal(mealId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mealKeys.lists() });
            toast.success('Meal deleted successfully');
        },
        onError: () => {
            // Error is handled by axios interceptor
        },
    });
};
