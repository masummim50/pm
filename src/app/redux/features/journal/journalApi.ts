/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

export const journalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLastJournals: builder.query({
      query: () => ({
        method: "GET",
        url: `/journal`,
      }),
    }),
    getJournalDates: builder.query({
      query: () => ({
        method: "GET",
        url: `/journal/getdates`,
      }),
      providesTags: ["journalDates"],
    }),
    getTodayJournal: builder.query({
      query: () => ({
        method: "GET",
        url: `/journal/today`,
      }),
    }),
    getJournalByDate: builder.query({
      query: (date) => ({
        method: "GET",
        url: `/journal/getbydate/${date}`,
      }),
    }),
    updateJournal: builder.mutation({
      query: ({ content }) => {
        const today = new Date().toISOString().split("T")[0];
        return {
          method: "PATCH",
          url: `/journal/${today}`,
          body: content,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          journalApi.util.updateQueryData(
            "getTodayJournal",
            undefined,
            (draft) => {
              draft.data.content = result.data.data.content;
            }
          )
        );
      },
      invalidatesTags: ["journalDates", "journalOverview"],
    }),
    addNoteToJournal: builder.mutation({
      query: (args) => ({
        method: "PATCH",
        url: `/journal/addnote/${args.journalId}`,
        body: { content: args.content },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          journalApi.util.updateQueryData(
            "getJournalByDate",
            args.date,
            (draft) => {
              draft.data = result.data.data;
            }
          )
        );
      },
    }),
    deleteNoteById: builder.mutation({
      query: (args) => ({
        method: "DELETE",
        url: `journal/note/${args.journalId}/${args.noteId}`,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const result = dispatch(
          journalApi.util.updateQueryData(
            "getJournalByDate",
            args.date,
            (draft) => {
              draft.data.notes = draft.data.notes.filter(
                (n: any) => n._id !== args.noteId
              );
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
    getJournalOverview: builder.query({
      query: () => ({
        method: "GET",
        url: "/journal/overview",
      }),
      providesTags: ["journalOverview"],
    }),
  }),
});

export const {
  useGetTodayJournalQuery,
  useUpdateJournalMutation,
  useGetLastJournalsQuery,
  useLazyGetJournalByDateQuery,
  useAddNoteToJournalMutation,
  useDeleteNoteByIdMutation,
  useGetJournalOverviewQuery,
  useGetJournalDatesQuery,
} = journalApi;
