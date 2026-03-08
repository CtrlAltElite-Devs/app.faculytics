export type LoginRequest = {
  username: string;
  password: string;
};

export type RefreshTokenRequestBody = {
  refreshToken: string;
};
export type LoginResponse = {
  token: string;
  refreshToken: string;
};

export type Campus = {
  id: string;
  name?: string;
  code: string;
};

export type MeResponse = {
  id: string;
  userName: string;
  moodleUserId?: number;
  firstName: string;
  lastName: string;
  userProfilePicture: string;
  fullName: string;
  roles: string[];
  campus?: Campus;
};
