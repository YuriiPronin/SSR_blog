import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Sort = "newest" | "oldest";
interface FiltersState {
  q: string;
  tag: string | null;
  sort: Sort;
}

const initialState: FiltersState = { q: "", tag: null, sort: "newest" };

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQ:   (s, a: PayloadAction<string>)      => { s.q = a.payload; },
    setTag: (s, a: PayloadAction<string|null>) => { s.tag = a.payload; },
    setSort:(s, a: PayloadAction<Sort>)        => { s.sort = a.payload; },
    reset:  ()                                 => initialState,
  },
});

export const { setQ, setTag, setSort, reset } = filtersSlice.actions;
export default filtersSlice.reducer;
