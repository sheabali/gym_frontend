/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface TrainerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string | null;
}

export interface TrainerProfile {
  id: string;
  userId: string;
  user: TrainerUser;
  bio?: string | null;
  specialties: string[];
  certifications: string[];
  photoUrl?: string | null;
  isPublic: boolean;
  sortOrder: number;
}

export interface TrainersResponse {
  success: boolean;
  message?: string;
  data: TrainerProfile[];
}

export interface TrainerResponse {
  success: boolean;
  message?: string;
  data: TrainerProfile;
}

export const trainerApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getTrainers: builder.query({
      query: () => ({
        url: "/trainers",
        method: "GET",
      }),
      providesTags: ["Trainers"],
    }),
    getTrainerById: builder.query({
      query: (id: string) => ({
        url: `/trainers/${id}`,
        method: "GET",
      }),
      providesTags: (_result: any, _err: any, id: string) => [{ type: "Trainers", id }],
    }),
  }),
});

export const { useGetTrainersQuery, useGetTrainerByIdQuery } = trainerApi;
