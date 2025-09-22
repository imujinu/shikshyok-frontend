import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Review {
  id: number;
  cus_rev_id: number;
  shop_id: number;
  score: number;
  content: string;
  writeTime: string;
  owner_review?: string;
  reviewfile?: string;
  customer_nickname: string;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

//조회 x
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (shopId: number) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_SERVER}/owner-review`,
      {
        params: { shopId },
      }
    );
    return response.data.reviews;
  }
);
//수정
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, owner_review }: { id: number; owner_review: string }) => {
    console.log("리듀서", id);
    const response = await axios.patch(
      `${process.env.REACT_APP_API_SERVER}/owner-review/${id}`,
      {
        owner_review,
      }
    );
    return response.data.review;
  }
);

// 점주 리뷰 삭제
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id: number) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_SERVER}/owner-review/${id}`
    );
    return response.data.review;
  }
);

// 손님 리뷰 삭제 요청
export const cus_delete = createAsyncThunk(
  "review/cus_delete",
  async (id: number) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_SERVER}/owner-review`,
      {
        id,
      }
    );
    return response.data.review;
  }
);

// ---- state
const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch reviews";
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload; // owner_review가 null로 변경
        }
      })
      .addCase(cus_delete.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload; // owner_review가 null로 변경
        }
      });
  },
});

export default reviewSlice.reducer;
