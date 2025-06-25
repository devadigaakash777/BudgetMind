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

export interface UserState {
  userid: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  jobTitle: string;
  address: Address[];
  hasSalary: boolean;
  Salary: Salary;
}

export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}
