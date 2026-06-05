export interface IProfileResponse {
  id: string;
  name: string;
  email: string;
  noWa: string;
  role: string;
}

export interface IUpdateProfileRequest {
  name: string;
  email: string;
  noWa: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
