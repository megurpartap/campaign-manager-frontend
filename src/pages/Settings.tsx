import AdAccountsAndPagesTabs from "@/components/Facebook/AdAccountsAndPagesTabs";
import ConnectedFacebookAccountsList from "@/components/Facebook/ConnectedFacebookAccountsList";
import ConnectWithFacebookBox from "@/components/Facebook/ConnectWithFacebookBox";

const Settings = () => {
  return (
    <div className="grid grid-cols-12 grid-rows-10 h-full max-h-screen gap-2">
      <div className="col-span-4 row-span-3">
        <ConnectWithFacebookBox />
      </div>
      <div className="col-span-4 row-start-4 row-span-7">
        <ConnectedFacebookAccountsList />
      </div>
      <div className="col-span-8">
        <AdAccountsAndPagesTabs />
      </div>
    </div>
  );
};

export default Settings;
