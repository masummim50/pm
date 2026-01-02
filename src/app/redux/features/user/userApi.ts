import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/signup",
        body:data
      }),
    }),
    signIn: builder.mutation({
      query: (data)=> ({
        method:'POST',
        url:'/auth/signin',
        body:data
      })
    }),
    signInWithGmail: builder.mutation({
      query: (data)=> ({
        method:'POST',
        url:'/auth/signin/gmail',
        body:data
      })
    }),
    searchUsers: builder.query({
      query: (searchText)=> ({
        method:'GET',
        url:`users/search/${searchText}`
      })
    })
  }),
});

export const { useSignUpMutation, useSignInMutation , useLazySearchUsersQuery, useSignInWithGmailMutation} = userApi;
