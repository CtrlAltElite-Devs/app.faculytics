export type LoginRequest = {
  username: string;
  password: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type AuthSession = {
  token: string;
  refreshToken: string;
};

export type LoginResponse = AuthSession;
export type RefreshTokenRequestBody = RefreshTokenPayload;

export type LogoutResponse = {
  message: string;
};

export type AuthErrorPayload = {
  message: string;
  error: string;
  statusCode: number;
};

export type Campus = {
  id: string;
  name?: string;
  code: string;
};

export type Department = {
  id: string;
  name?: string;
  code: string;
};

export type Program = {
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
  program?: Program;
  department?: Department;
};
