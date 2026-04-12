import { configureAuth } from "react-query-auth";

import { Spinner } from '@/components/Elements';
import {
  loginWithEmailAndPassword,
  getUser,
  registerWithEmailAndPassword,
  UserResponse,
  LoginCredentialsDTO,
  RegisterCredentialsDTO,
} from "@/features/auth";
import storage from "@/lib/storage";

async function handleUserResponse(data: UserResponse) {
  const { tokens, user } = data;
  console.log(user);
  
  storage.setToken(tokens.access.token);
  return user;
}

async function loadUser() {
  if (storage.getToken()) {
    const data = await getUser();
    return data.data;
  }
  return null;
}

async function loginFn(data: LoginCredentialsDTO) {
  const response = await loginWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

async function registerFn(data: RegisterCredentialsDTO) {
  const response = await registerWithEmailAndPassword(data);
  const user = await handleUserResponse(response);
  return user;
}

async function logoutFn() {
  storage.clearToken();
  // window.location.assign(window.location.origin as unknown as string);
}

const authConfig = {
  userFn: loadUser,
  loginFn,
  registerFn,
  logoutFn,
  LoaderComponent() {
    return (
      <div className="w-100 h-100-vh d-flex justify-content-center align-items-center">
        <Spinner size="xl" />
      </div>
    );
  },
};

export const { AuthLoader, useUser, useLogin, useRegister, useLogout } = configureAuth(authConfig);
