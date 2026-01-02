/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalProjects: builder.query({
      query: () => ({
        method: "GET",
        url: "projects/personal-projects",
      }),
      providesTags: ["personalProjects"],
    }),
    getTeamProjects: builder.query({
      query: () => ({
        method: "GET",
        url: "projects/group-projects",
      }),
      providesTags: ["teamProjects"],
    }),
    getMembersByProjectId: builder.query({
      query: (id) => ({
        method: "GET",
        url: `projects/group-projects/members/${id}`,
      }),
      providesTags: ["members"],
    }),
    getPersonalProjectById: builder.query({
      query: (id) => ({
        method: "GET",
        url: `projects/personal-projects/${id}`,
      }),
    }),
    updatePersonalProjectById: builder.mutation({
      query: ({ id, data }) => ({
        method: "PATCH",
        url: `projects/personal-projects/${id}`,
        body: data,
      }),
      invalidatesTags: ["personalProjects"],
    }),
    createPersonalProject: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "projects/personal-projects/create-new",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjects",
            undefined,
            (draft) => {
              draft.data.push(result.data.data);
            }
          )
        );
      },
      // invalidatesTags: ["personalProjects"],
    }),
    createTeamProject: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "projects/group-projects/create-new",
        body: data,
      }),
      invalidatesTags: ["teamProjects"],
    }),
    deletePersonalProject: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `projects/personal-projects/${id}`,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const result = dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjects",
            undefined,
            (draft) => {
              draft.data = draft.data.filter((d: any) => d._id !== id);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          result.undo();
        }
      },
    }),
    deleteTeamProject: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `projects/personal-projects/${id}`,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const result = dispatch(
          projectApi.util.updateQueryData(
            "getTeamProjects",
            undefined,
            (draft) => {
              draft.data = draft.data.filter((d: any) => d._id !== id);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          result.undo();
        }
      },
    }),
    addMemberToProject: builder.mutation({
      query: ({ projectId, memberId }) => ({
        method: "PATCH",
        url: `projects/group-projects/addmember/${projectId}/${memberId}`,
      }),
      async onQueryStarted(
        { projectId, memberId },
        { dispatch, queryFulfilled }
      ) {
        await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectId,
            (draft) => {
              draft.data.participants.push(memberId);
            }
          )
        );
      },
      invalidatesTags: ["members"],
    }),
    getT: builder.query({
      query: () => ({
        method: "GET",
        url: "/t",
      }),
    }),
    getPersonalProjectsOverview: builder.query({
      query: () => ({
        method: "GET",
        url: "projects/personal-projects/overview",
      }),
      providesTags: ["projectsOverview"],
    }),
    changeProjectStatus: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `projects/changestatus/${args.id}`,
        body: args.data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            args.id,
            (draft) => {
              draft.data.status = result.data.data.status;
            }
          )
        );
      },
    }),
  }),
});

export const {
  useCreatePersonalProjectMutation,
  useGetPersonalProjectsQuery,
  useLazyGetPersonalProjectsQuery,
  useDeletePersonalProjectMutation,
  useGetPersonalProjectByIdQuery,
  useUpdatePersonalProjectByIdMutation,
  useGetTeamProjectsQuery,
  useLazyGetTeamProjectsQuery,
  useCreateTeamProjectMutation,
  useAddMemberToProjectMutation,
  useGetMembersByProjectIdQuery,
  useGetTQuery,
  useGetPersonalProjectsOverviewQuery,
  useDeleteTeamProjectMutation,
  useChangeProjectStatusMutation,
} = projectApi;
