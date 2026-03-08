'use client';
import { Tabs } from '@mantine/core';
import { AirplaneIcon } from '../icons/AirplaneIcon';
import { UserIcon } from '../icons/UserIcon';
import { ConfigIcon } from '../icons/ConfigIcon';
import { ActivityIcon } from '../icons/ActivityIcon';
import FlightsPage from './FlightsPage';
import UsersPage from './UsersPage';
import ManagementPage from './ManagementPage';
import FinancialPage from './FinancialPage';
import { InboxIcon } from '../icons/InboxIcon';
import SupportPage from './SupportPage';

function DashboardPage({ children }: { children: React.ReactElement }) {
  return <div className="w-full ml-10">{children}</div>;
}

export function DashboardPageTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactElement;
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="flex flex-row gap-3 items-center">
        {icon}
        <div className="flex flex-col">
          <h2 className="font-medium text-xl">{title}</h2>
          <h2 className="font-normal text-md text-black/50">{description}</h2>
        </div>
      </div>
      <div className="w-full h-px bg-black/20" />
    </>
  );
}

export default function StaffDashboard({ is_admin }: { is_admin: boolean }) {
  return (
    <div className="flex justify-center w-full">
      <Tabs defaultValue="flights" orientation="vertical" className="w-[70%]">
        <Tabs.List>
          <Tabs.Tab
            value="flights"
            leftSection={<AirplaneIcon size={15} strokeWidth={0.3} />}
          >
            Flights
          </Tabs.Tab>
          <Tabs.Tab
            value="users"
            leftSection={<UserIcon size={15} strokeWidth={2} />}
          >
            Users
          </Tabs.Tab>
          <Tabs.Tab
            value="queries"
            leftSection={<InboxIcon size={15} strokeWidth={2} />}
          >
            Queries
          </Tabs.Tab>
          {is_admin ? (
            <>
              <Tabs.Tab
                value="management"
                leftSection={<ConfigIcon size={15} strokeWidth={2} />}
              >
                Management
              </Tabs.Tab>
              <Tabs.Tab
                value="financial"
                leftSection={<ActivityIcon size={15} strokeWidth={2} />}
              >
                Financial
              </Tabs.Tab>
            </>
          ) : (
            <></>
          )}
        </Tabs.List>

        <Tabs.Panel value="flights">
          <DashboardPage>
            <FlightsPage />
          </DashboardPage>
        </Tabs.Panel>
        <Tabs.Panel value="users">
          <DashboardPage>
            <UsersPage isViewedByAdmin={is_admin} />
          </DashboardPage>
        </Tabs.Panel>
        <Tabs.Panel value="queries">
          <DashboardPage>
            <SupportPage />
          </DashboardPage>
        </Tabs.Panel>
        <Tabs.Panel value="management">
          <DashboardPage>
            <ManagementPage />
          </DashboardPage>
        </Tabs.Panel>
        <Tabs.Panel value="financial">
          <DashboardPage>
            <FinancialPage />
          </DashboardPage>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
