import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { useQuery } from '../../../hooks/useApiQuery';
import { useMutation } from '../../../hooks/useApiMutation';
import * as usersApi from '../api/users';
import type { UserAddPayload } from '../api/users';
import type { User } from '../types';
import { setUsers, showAlert } from '../store/slicer';

export function useUsers() {
  const users = useAppSelector((state) => state.cada.users);
  const dispatch = useAppDispatch();

  const { isLoading, error, refetch } = useQuery(
    async () => {
      const data = await usersApi.search({ fid: 1 });
      dispatch(setUsers(data));
      return data;
    },
    [],
    { enabled: users.length === 0 },
  );

  if (error) dispatch(showAlert(error.message, "warning"));

  return { users, isLoading, refetch };
}

export function useAddUser() {
  const users = useAppSelector((state) => state.cada.users);
  const dispatch = useAppDispatch();

  return useMutation(async (payload: UserAddPayload) => {
    const newUser = await usersApi.add(payload);
    dispatch(setUsers([...users, newUser]));
    dispatch(showAlert("New user added!", "success"));
    return newUser;
  });
}

export function useRemoveUser() {
  const users = useAppSelector((state) => state.cada.users);
  const dispatch = useAppDispatch();

  return useMutation(async (userId: number) => {
    await usersApi.remove(userId);
    dispatch(setUsers(users.filter((u) => u.id !== userId)));
    dispatch(showAlert('User removed!', 'success'));
    return userId;
  });
}

export function useUpdateUser() {
  const users = useAppSelector((state) => state.cada.users);
  const dispatch = useAppDispatch();

  return useMutation(
    async ({
      id,
      payload,
    }: {
      id: number;
      payload: {
        username?: string;
        email: string;
        firstName: string;
        lastName: string;
        loginType: string;
        isBot: boolean;
        role?: string;
      };
    }) => {
      const updatedUser = await usersApi.update(id, payload);

      dispatch(
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
        ),
      );

      dispatch(showAlert({
          message: "User updated!",
          severity: "success",
        }),
      );

      return updatedUser;
    },
    {
      onError: (err) =>
        dispatch(
          showAlert({
            message: err.message,
            severity: "warning",
          }),
        ),
    },
  );
}