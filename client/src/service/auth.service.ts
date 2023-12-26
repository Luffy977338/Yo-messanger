import $api from "../http";
import axios, { AxiosResponse } from "axios";
import { IAuthResponse } from "../interfaces/auth-response.interface";
import user from "../store/user";

export default class AuthService {
  static async login(
    email: string,
    password: string,
  ): Promise<AxiosResponse<any>> {
    try {
      return $api.post<IAuthResponse>("/auth/login", { email, password });
    } catch (e) {
      throw e;
    }
  }

  static async registration(
    username: string,
    email: string,
    password: string,
  ): Promise<AxiosResponse<IAuthResponse>> {
    try {
      return $api.post<IAuthResponse>("/auth/registration", {
        username,
        email,
        password,
      });
    } catch (e) {
      throw e;
    }
  }

  static async logout(): Promise<void> {
    try {
      return $api.post("/auth/logout");
    } catch (e) {
      throw e;
    }
  }

  static async checkAuth() {
    if (!!localStorage.getItem("token")) {
      try {
        const response = await axios.get<IAuthResponse>(
          `http://localhost:5000/auth/refresh`,
          {
            withCredentials: true,
          },
        );
        localStorage.setItem("token", response.data.accessToken);
        user.setUser(response.data.user);
        return response.data.user;
      } catch (e) {
        throw e;
      }
    }
    throw new Error("Unathorized");
  }
}
