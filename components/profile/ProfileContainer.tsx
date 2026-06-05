"use client";

import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";

const ProfileContainer = () => {
  return (
    <div className="w-full">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  );
};

export default ProfileContainer;
