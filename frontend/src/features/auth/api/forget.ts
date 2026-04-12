import { axios } from '@/lib/axios';

export type ForgetPasswordDTO = {
  email: string;
};

export type ForgetPasswordResponse = {
  success: boolean;
  data: {
    resetToken: string;
    emailToken: string;
    message: string;
  };
};

export type VerifyOtpDTO = {
  otp: string;
};

export type VerifyOtpResponse = {
  success: boolean;
  message: string;
};

export type ResendOtpDTO = {
  emailToken: string;
};

export type ResendOtpResponse = {
  success: boolean;
  data: string;
  message: string;
};

export type ResetPasswordDTO = {
  password: string;
  resetPasswordToken?: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

// Send forgot password email with OTP
export const forgetPassword = (data: ForgetPasswordDTO): Promise<ForgetPasswordResponse> => {
  return axios.post('/auth/forgot-password', data);
};

// Verify OTP code
export const verifyOtp = (token: string, data: VerifyOtpDTO): Promise<VerifyOtpResponse> => {
  return axios.post(`/auth/verify-otp/${token}`, data);
};

// Resend OTP code
export const resendOtp = (data: ResendOtpDTO): Promise<ResendOtpResponse> => {
  return axios.post('/auth/resend-otp', data);
};

// Reset password with new password
export const resetPassword = (token: string, data: ResetPasswordDTO): Promise<ResetPasswordResponse> => {
  return axios.post(`/auth/reset-password/${token}`, {
    ...data,
    resetPasswordToken: token,
  });
};
