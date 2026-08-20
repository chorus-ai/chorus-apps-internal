import { configureStore } from '@reduxjs/toolkit'
import deepCopy from '../utils/deepcopy';
import { clearLocalStorage } from '../utils/localStorage';

import { cadaReducer } from '../apps/cada/store/slicer'
import { iveReducer } from '../apps/ive/store';

export interface FeatureUser {
  id: number;
  role: string;
  status?: string;
  featureId: number;
  userId: number;
}

export interface User {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  loginType?: string;
  avatar?: string | null;
  isBot?: boolean;
  featureUsers?: Record<string, FeatureUser> | FeatureUser[];
}

interface Feature {
  id: number;
  name: string;
  app?: string;
}

interface MainState {
  user: User | null | undefined;
  features?: Feature[];
}

interface MainAction {
  type: string;
  user?: User;
  features?: Feature[];
  value?: { avatar: string | null };
}

const mainReducer = (state: MainState = { user: null }, action: MainAction) => {
  switch (action.type) {
    case 'LOGIN': {
      return { ...state, user: action.user };
    }
    case 'LOGOUT': {
      clearLocalStorage(['apps-remember']);
      return { ...state, user: null };
    }
    case 'GET_FEATURES': {
      return { ...state, features: action.features };
    }
    case 'UPDATE_AVATAR': {
      const new_user = deepCopy(state.user) as User | null;
      if (new_user && action.value) new_user.avatar = action.value.avatar;
      return { ...state, user: new_user };
    }
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    main: mainReducer,
    cada: cadaReducer,
    ive: iveReducer,
  },
  devTools: true, 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch