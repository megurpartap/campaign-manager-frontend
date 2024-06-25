import { TbReportAnalytics } from "react-icons/tb";

const Home = () => {
  return (
    <div className="w-full h-full grid place-content-center">
      <h1 className="text-4xl text-gray-600 dark:text-white flex items-center">
        <TbReportAnalytics size={64} className="mr-4" />
        Reports Coming Soon.
      </h1>
    </div>
  );
};

export default Home;
