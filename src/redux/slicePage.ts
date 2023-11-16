import { INavItem } from '@/components/Layout'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PageState {
  navItems: INavItem[]
}

const initialState: PageState = {
  navItems: []
}

export const pageSlice = createSlice({
name: 'page',
  initialState,
  reducers: {
    updatePageState: (state, action: PayloadAction<PageState>) => {
      state.navItems = action.payload.navItems;
    },
  },
})

export const { updatePageState } = pageSlice.actions

export default pageSlice.reducer