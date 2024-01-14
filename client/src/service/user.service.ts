import { AxiosResponse } from "axios";
import $api from "../http";
import user from "../store/user";
import { IUser } from "../interfaces/user.interface";

export default class UserService {
  static async editProfile(updatedFields: any): Promise<AxiosResponse<any>> {
    return $api.patch(`/edit/${user.user._id}`, updatedFields);
  }

  static async getUser(id: string): Promise<AxiosResponse<IUser>> {
    return $api.get(`/${id}`);
  }
}
