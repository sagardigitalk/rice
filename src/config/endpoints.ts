export interface EndPointApi {
  // Auth
  authLogin: string;
  authRegister: string;
  authMe: string;
  authForgotPassword: string;
  authResetPassword: string;
  authUpdateDetails: string;
  authUpdatePassword: string;

  // Leads
  leads: string;
  leadCreate: string;
  leadUpdate: string;
  leadDelete: string;

  // ExMill
  exmill: string;
  exmillCreate: string;
  exmillUpdate: string;
  exmillDelete: string;

  // Freight
  freight: string;
  freightCreate: string;
  freightUpdate: string;
  freightDelete: string;

  // Settings
  settings: string;

  // Packaging
  packaging: string;

  // Calculations
  calculations: string;

  // Dashboard
  dashboardStats: string;
}

const endPointApi: EndPointApi = {
  // Auth
  authLogin: 'auth/login',
  authRegister: 'auth/register',
  authMe: 'auth/me',
  authForgotPassword: 'auth/forgotpassword',
  authResetPassword: 'auth/resetpassword',
  authUpdateDetails: 'auth/updatedetails',
  authUpdatePassword: 'auth/updatepassword',

  // Leads
  leads: 'leads',
  leadCreate: 'leads',
  leadUpdate: 'leads',
  leadDelete: 'leads',

  // ExMill
  exmill: 'exmill',
  exmillCreate: 'exmill',
  exmillUpdate: 'exmill',
  exmillDelete: 'exmill',

  // Freight
  freight: 'freight',
  freightCreate: 'freight',
  freightUpdate: 'freight',
  freightDelete: 'freight',

  // Settings
  settings: 'settings',

  // Packaging
  packaging: 'packaging',

  // Calculations
  calculations: 'calculations',

  // Dashboard
  dashboardStats: 'dashboard/stats',
};

export default endPointApi;
