/* eslint-disable @typescript-eslint/no-explicit-any */

import { subtaskType } from "../../../components/project/SubTaskCard";
import { taskType } from "../../../components/project/project.interface";
import { apiSlice } from "../api/apiSlice";
import { projectApi } from "../project/project.api";

export const subTaskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubTasks: builder.query({
      query: (id) => ({
        method: "GET",
        url: `subtask/${id}`,
      }),
      providesTags: ["subtasks"],
    }),
    createSubTask: builder.mutation({
      query: (args) => ({
        method: "POST",
        url: `subtask/${args.taskId}`,
        body: args.data,
      }),
      async onQueryStarted(
        { projectId, taskId },
        { dispatch, queryFulfilled }
      ) {
        const newSubTask = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectId,
            (draft) => {
              const index = draft.data.tasks.findIndex(
                (task: taskType) => task._id == taskId
              );
              draft.data.tasks[index].subtasks.unshift(newSubTask.data.data);
            }
          )
        );
      },
      invalidatesTags: ["subtasks", "tasks"],
    }),
    deleteSubTaskById: builder.mutation({
      query: (args) => ({
        method: "DELETE",
        url: `subtask/${args.subtaskId}/${args.taskId}`,
      }),
      async onQueryStarted(
        { projectId, subtaskId, taskId },
        { dispatch, queryFulfilled }
      ) {
        const result = dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectId,
            (draft) => {
              const index = draft.data.tasks.findIndex(
                (task: taskType) => task._id == taskId
              );
              draft.data.tasks[index].subtasks = draft.data.tasks[
                index
              ].subtasks.filter((sub: subtaskType) => sub._id != subtaskId);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          result.undo();
        }
      },
      // invalidatesTags: ["subtasks", "tasks"],
    }),

    editSubTaskById: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `subtask/${args.subtaskId}`,
        body: args.data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const result = dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            args.projectId,
            (draft) => {
              draft.data.tasks[args.taskindex].subtasks[
                args.subtaskindex
              ].title = args.data.title;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          result.undo();
        }
      },
      // invalidatesTags: ["subtasks", "tasks"],
    }),

    startSubTask: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `/subtask/startsubtask/${args.subTaskId}`,
      }),
      async onQueryStarted(
        { projectId, subTaskId },
        { dispatch, queryFulfilled }
      ) {
        const result = await queryFulfilled;
        const newSubTask: subtaskType = result.data.data;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectId,
            (draft) => {
              const taskIndex = draft.data.tasks.findIndex(
                (task: taskType) => task._id == newSubTask.parentTask
              );
              const index = draft.data.tasks[taskIndex].subtasks.findIndex(
                (subtask: subtaskType) => subtask._id == subTaskId
              );

              draft.data.tasks[taskIndex].subtasks[index] = newSubTask;
            }
          )
        );
      },
      // invalidatesTags: ["tasks", "subtasks"],
    }),
    pauseSubTask: builder.mutation({
      query: (args: { projectId: string; subTaskId: string; data: any }) => ({
        method: "PATCH",
        url: `/subtask/pausesubtask/${args.subTaskId}`,
        body: args.data,
      }),
      async onQueryStarted(
        { projectId, subTaskId },
        { dispatch, queryFulfilled }
      ) {
        const result = await queryFulfilled;
        const newSubTask: subtaskType = result.data.data;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectId,
            (draft) => {
              const taskIndex = draft.data.tasks.findIndex(
                (task: taskType) => task._id == newSubTask.parentTask
              );
              const index = draft.data.tasks[taskIndex].subtasks.findIndex(
                (subtask: subtaskType) => subtask._id == subTaskId
              );

              draft.data.tasks[taskIndex].subtasks[index] = newSubTask;
            }
          )
        );
      },
      // invalidatesTags: ["tasks", "subtasks"],
    }),
    completeSubTask: builder.mutation({
      query: (args: { projectId: string; subTaskId: string; data: any }) => ({
        method: "PATCH",
        url: `/subtask/completesubtask/${args.subTaskId}`,
        body: args.data,
      }),
      async onQueryStarted(
        { projectId, subTaskId },
        { dispatch, queryFulfilled }
      ) {
        const result = await queryFulfilled;
        const newSubTask: subtaskType = result.data.data;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectId,
            (draft) => {
              const taskIndex = draft.data.tasks.findIndex(
                (task: taskType) => task._id == newSubTask.parentTask
              );
              const index = draft.data.tasks[taskIndex].subtasks.findIndex(
                (subtask: subtaskType) => subtask._id == subTaskId
              );

              draft.data.tasks[taskIndex].subtasks[index] = newSubTask;
            }
          )
        );
      },
      invalidatesTags: ["projectsOverview"],
    }),
    assignSubTask: builder.mutation({
      query: (args: {
        projectid: string;
        taskid: string;
        subtaskid: string;
        userid: string;
        taskindex: number;
        subtaskindex: number;
      }) => ({
        method: "PATCH",
        url: `subtask/assignsubtask/${args.subtaskid}/${args.userid}`,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            args.projectid,
            (draft) => {
              draft.data.tasks[args.taskindex].subtasks[
                args.subtaskindex
              ].assignedTo = result.data.data.assignedTo;
            }
          )
        );
      },
    }),
  }),
});

export const {
  useGetSubTasksQuery,
  useCreateSubTaskMutation,
  useDeleteSubTaskByIdMutation,
  useEditSubTaskByIdMutation,
  useCompleteSubTaskMutation,
  useStartSubTaskMutation,
  usePauseSubTaskMutation,
  useAssignSubTaskMutation,
} = subTaskApi;
