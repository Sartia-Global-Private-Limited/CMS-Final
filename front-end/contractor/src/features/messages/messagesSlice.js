import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    msg: null,
    countMsg: 0
}

const messagesSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessage: (state, action) => {
            state.msg = action.payload.message;
            state.countMsg = action.payload.countMsg;
        }
    }
});

export const { setMessage } = messagesSlice.actions

export const selectMsg = (state) => state.message

export default messagesSlice.reducer