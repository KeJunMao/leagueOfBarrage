import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../components/User";

// export type UsersState = User[];

interface UsersState {
  value: User[];
}

const initialState: UsersState = {
  value: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      /// @ts-ignore
      state.value.push(action.payload);
    },
    clearUser(_state) {
      _state.value = [];
    },
    updateUser(state) {
      state.value = [...state.value];
    },
  },
});

export const { addUser, clearUser, updateUser } = usersSlice.actions;

export default usersSlice.reducer;
