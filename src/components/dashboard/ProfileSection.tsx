
import ProfileInfoCard from "./ProfileInfoCard";
import PortfolioCard from "./PortfolioCard";

const ProfileSection = () => {
  return (
    <div className="w-full md:w-1/3 space-y-6">
      <ProfileInfoCard />
      <PortfolioCard />
    </div>
  );
};

export default ProfileSection;
