import { useSearchParams } from "react-router-dom";
import CampeinBanner from "./CampeinBanner";
import CampeinVideo from "./CampeinVideo";
import CaruselaImage from "./CaruselaImage";
import MoneyCircles from "./MoneyCircles";
import DonationProgressMinimal from "./DonationProgressMinimal";
import DonationList from "./DonationList";
import DonationsByRefPage from "./DonationsByRefPage";

const CampeinPage = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div>
      <CampeinBanner />
      <CampeinVideo />
      <CaruselaImage />
      <MoneyCircles />
      <DonationProgressMinimal />
      {ref ? <DonationsByRefPage /> : <DonationList />}
    </div>
  );
};

export default CampeinPage;
