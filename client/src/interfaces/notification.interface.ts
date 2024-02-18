import { IComment } from "./comment.interface";
import { IPost } from "./post.interface";
import { IUser } from "./user.interface";

export type notificationTypes = "like" | "comment" | "friendReq";

export interface INotification {
  _id: string;
  user: IUser;
  type: notificationTypes;
  isViewed: boolean;
}

export type TNotificationTypes = {
  like: ILikeNotification;
  comment: ICommentNotification;
  friendReq: IFriendRequestNotification;
};

export interface ILikeNotification extends INotification {
  type: "like";
  post: IPost;
}

export interface ICommentNotification extends INotification {
  type: "comment";
  post: IPost;
  comment: IComment;
}

export interface IFriendRequestNotification extends INotification {
  type: "friendReq";
}

export interface INotificationAction {}

export interface ILikeNotificationAction extends INotificationAction {
  toUserId: string;
  userId: string;
  postId: string;
}

export interface ICommentNotificationAction extends INotificationAction {
  toUserId: string;
  userId: string;
  postId: string;
  commentId: string;
}

export interface IFriendRequestNotificationAction extends INotificationAction {
  toUserId: string;
  userId: string;
}
