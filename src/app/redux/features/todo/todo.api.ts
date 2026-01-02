/* eslint-disable @typescript-eslint/no-explicit-any */
import { todoType } from "../../../components/todo/todo.interface";
import { apiSlice } from "../api/apiSlice";
import { change } from "./todo.slice";

export const todoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => ({
        method: "GET",
        url: "/todos",
      }),
      providesTags: ["todos"],
    }),
    
    deleteAllCompletedTodos: builder.mutation({
      query: () => ({
        method: "DELETE",
        url: "/todos/deletecompleted",
      }),
      invalidatesTags: ["todos"],
    }),
    deleteAllPendingTodos: builder.mutation({
      query: () => ({
        method: "DELETE",
        url: "/todos/deletepending",
      }),
      invalidatesTags: ["todos"],
    }),
    getLastTodos: builder.query({
      query: () => ({
        method: "GET",
        url: "/todos/lasttodos",
      }),
      providesTags:['lastTodos']
    }),
    createTodo: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/todos",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        const newTodo = result.data.data;
        dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            draft.data.pending.unshift(newTodo);
          })
        );
        dispatch(change());
      },
    }),
    completeTodo: builder.mutation({
      query: (todo) => ({
        method: "POST",
        url: `/todos/${todo._id}`,
      }),
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const todoCopy = { ...todo, status: !todo.status };
            if (todo.status) {
              draft.data.completed = draft.data.completed.filter(
                (d:todoType) => d._id !== todo._id
              );
              draft.data.pending.unshift(todoCopy);
            } else {
              draft.data.pending = draft.data.pending.filter(
                (d:todoType) => d._id !== todo._id
              );
              draft.data.completed.unshift({
                ...todoCopy,
                updatedAt: new Date(),
              });
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags:['lastTodos']
    }),
    deleteTodo: builder.mutation({
      query: (todo) => ({
        method: "DELETE",
        url: `/todos/${todo._id}`,
      }),
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        const result = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft: any) => {
            if (todo.status) {
              draft.data.completed = draft.data.completed.filter(
                (d: todoType) => d._id !== todo._id
              );
            } else {
              draft.data.pending = draft.data.pending.filter(
                (d: todoType) => d._id !== todo._id
              );
            }
            // draft.data = draft.data.filter((d: todoType) => d._id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          result.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useLazyGetTodosQuery,
  useCreateTodoMutation,
  useCompleteTodoMutation,
  useDeleteTodoMutation,
  useGetLastTodosQuery,
  useDeleteAllCompletedTodosMutation,
  useDeleteAllPendingTodosMutation,
} = todoApi;
