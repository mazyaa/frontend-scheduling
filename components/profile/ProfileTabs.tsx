"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { IoPerson, IoLockClosed } from "react-icons/io5";

import ProfileInfoForm from "./ProfileInfoForm";
import ProfileSecurityForm from "./ProfileSecurityForm";

const ProfileTabs = () => {
  return (
    <Tabs
      aria-label="Profile tabs"
      classNames={{
        tabList: "gap-6",
        cursor: "bg-brand",
        tab: "data-[selected=true]:text-brand",
      }}
      color="primary"
      variant="bordered"
    >
      <Tab
        key="info"
        title={
          <div className="flex items-center gap-2">
            <IoPerson />
            <span>Info</span>
          </div>
        }
      >
        <ProfileInfoForm />
      </Tab>
      <Tab
        key="security"
        title={
          <div className="flex items-center gap-2">
            <IoLockClosed />
            <span>Keamanan</span>
          </div>
        }
      >
        <ProfileSecurityForm />
      </Tab>
    </Tabs>
  );
};

export default ProfileTabs;
