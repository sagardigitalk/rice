export interface EndPointApi {
  // Auth
  authLogin: string;
  authRegister: string;
  authMe: string;

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
}

const endPointApi: EndPointApi = {
  // Auth
  authLogin: 'auth/login',
  authRegister: 'auth/register',
  authMe: 'auth/me',

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
};

export default endPointApi;
