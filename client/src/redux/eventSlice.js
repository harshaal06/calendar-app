import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async () => {
  const res = await axios.get('http://localhost:5000/api/events');
  return res.data;
});

export const addEvent = createAsyncThunk('events/addEvent', async (event) => {
  const res = await axios.post('http://localhost:5000/api/events', event);
  return res.data;
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id) => {
  await axios.delete(`http://localhost:5000/api/events/${id}`);
  return id;
});

const eventSlice = createSlice({
  name: 'events',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.fulfilled, (_, action) => action.payload)
      .addCase(addEvent.fulfilled, (state, action) => { state.push(action.payload); })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        return state.filter(e => e._id !== action.payload);
      });
  },
});

export default eventSlice.reducer;
