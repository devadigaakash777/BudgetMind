export interface Address {
  city: string;
  state: string;
  country: string;
  timezone: string;
}

export interface Salary {
  amount: number;
  date: number;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}


export interface UserState {
  data: User | null;
  accessToken: string | null,
  phone: string;
  jobTitle: string;
  address: Address[];
  hasSalary: boolean;
  Salary: Salary;
}

