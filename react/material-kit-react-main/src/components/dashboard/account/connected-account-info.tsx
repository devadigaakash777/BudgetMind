'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AccountInfo } from './account-info';

export function ConnectedAccountInfo(): React.JSX.Element {
  const userState = useSelector((state: RootState) => state.user);

  const fallbackUser = {
    firstName: 'Sofia Rivers',
    avatar: '/assets/avatar.png',
    jobTitle: 'Senior Developer',
    city: 'Los Angeles',
    country: 'USA',
    timezone: 'GMT-7',
  };

  const user = userState?.firstName ? userState : fallbackUser;

  return (
    <AccountInfo
      name={user.firstName}
      avatar={user.avatar}
      jobTitle={user.jobTitle}
      city={user.city}
      country={user.country}
      timezone={user.timezone}
    />
  );
}
