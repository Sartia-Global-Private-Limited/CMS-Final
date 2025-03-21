import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    noti: null,
    count: 0
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.noti = action.payload.notification;
            state.count = action.payload.count;
        }
    }
});

export const { setNotification } = notificationSlice.actions

export const selectNoti = (state) => state.notification

export default notificationSlice.reducer