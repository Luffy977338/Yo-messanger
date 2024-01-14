import { userSettingsWords } from "../constants/userSettingsWords";

export interface ISettings {
  _id: string;
  myPage: {
    profileType: string;
    whoCanComment: string;
  };
}

export type UserSettingsKey = keyof typeof userSettingsWords;

export type StringToUserSettingsKey<T extends string> =
  T extends keyof typeof userSettingsWords ? T : never;
