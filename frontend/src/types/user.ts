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
  _id: string;
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
  isProfileComplete: boolean | null;
  isSalaryPaid: boolean;
  hasSalary: boolean;
  Salary: Salary;
}

export interface UserProfile {
  phone: string;
  jobTitle: string;
  address: Address[];
  isProfileComplete: boolean;
  isSalaryPaid: boolean;
  hasSalary: boolean;
  Salary: Salary;
}
