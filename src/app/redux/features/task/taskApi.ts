/* eslint-disable @typescript-eslint/no-unused-vars */
import { taskType } from "../../../components/project/project.interface";
import { apiSlice } from "../api/apiSlice";
import { projectApi } from "../project/project.api";

export const taskApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewTask: builder.mutation({
      query: ({ id, data }) => ({
        method: "POST",
        url: `task/${id}`,
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          const newTask = data?.data?.data;
          dispatch(
            projectApi.util.updateQueryData(
              "getPersonalProjectById",
              id,
              (draft) => {
                draft.data.tasks.unshift(newTask);
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    editTaskById: builder.mutation({
      query: ({ id, data }) => ({
        method: "PATCH",
        url: `task/${id}`,
        body: data,
      }),
      invalidatesTags: ["tasks"],
    }),
    getAllTask: builder.query({
      query: (id) => ({
        method: "GET",
        url: `task/${id}`,
      }),
      providesTags: ["tasks"],
    }),
    deleteTaskById: builder.mutation({
      query: ({ projectid, taskid }) => ({
        method: "DELETE",
        url: `task/${projectid}/${taskid}`,
      }),
      async onQueryStarted(
        { projectid, taskid },
        { dispatch, queryFulfilled }
      ) {
        const deleted = dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectid,
            (draft) => {
              draft.data.tasks = draft.data.tasks.filter(
                (task: taskType) => task._id !== taskid
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          deleted.undo();
        }
      },
    }),
    updateTaskById: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `task/${args.taskId}`,
        body: args.data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const result = dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            args.projectId,
            (draft) => {
              // update draft here:
              draft.data.tasks[args.taskIndex].title = args.data.title;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          result.undo();
        }
      },
      // invalidatesTags: ["tasks"],
    }),
    startTask: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `/task/starttask/${args.taskid}`,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            args.projectId,
            (draft) => {
              const taskIndex = draft.data.tasks.findIndex(
                (task: taskType) => task._id == args.taskid
              );
              draft.data.tasks[taskIndex] = result.data.data;
            }
          )
        );
      },
      invalidatesTags: ["tasks", "personalProjects"],
    }),
    pauseTask: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `/task/pausetask/${args.taskid}`,
        body: args.data,
      }),
      async onQueryStarted(
        { projectId, taskid },
        { dispatch, queryFulfilled }
      ) {
        const result = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectId,
            (draft) => {
              const taskIndex = draft.data.tasks.findIndex(
                (task: taskType) => task._id == taskid
              );
              draft.data.tasks[taskIndex] = result.data.data;
            }
          )
        );
      },
      invalidatesTags: ["tasks", "personalProjects"],
    }),
    completeTask: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `/task/completetask/${args.taskid}`,
        body: args.data,
      }),
      async onQueryStarted(
        { projectId, taskid },
        { dispatch, queryFulfilled }
      ) {
        const result = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            projectId,
            (draft) => {
              const taskIndex = draft.data.tasks.findIndex(
                (task: taskType) => task._id == taskid
              );
              draft.data.tasks[taskIndex] = result.data.data;
            }
          )
        );
      },
      invalidatesTags: ["tasks", "personalProjects", "projectsOverview"],
    }),
    assignTask: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `/task/assign/${args.taskid}/${args.userid}`,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          projectApi.util.updateQueryData(
            "getPersonalProjectById",
            args.projectid,
            (draft) => {
              // const taskIndex = draft.data.tasks.findIndex((task:taskType)=> task._id == args.taskid);
              draft.data.tasks[args.taskIndex].assignedTo =
                result.data.data.assignedTo;
            }
          )
        );
      },
    }),
  }),
});

export const {
  useAddNewTaskMutation,
  useGetAllTaskQuery,
  useDeleteTaskByIdMutation,
  useEditTaskByIdMutation,
  useUpdateTaskByIdMutation,
  useStartTaskMutation,
  usePauseTaskMutation,
  useCompleteTaskMutation,
  useAssignTaskMutation,
} = taskApi;
