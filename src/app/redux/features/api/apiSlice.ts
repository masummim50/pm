// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://cute-teal-rhinoceros-garb.cyclic.app/api/v1/",
    baseUrl: "https://new-project-management.vercel.app/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 5000,
  endpoints: () => ({}),
  tagTypes: [
    "todos",
    "personalProjects",
    "tasks",
    "subtasks",
    "teamProjects",
    "members",
    "journalDates",
    "lastTodos",
    "projectsOverview",
    "journalOverview"
  ],
});
