
import CaruselaImage from "./CaruselaImage"
import DonationList from "./DonationList"
import DonationProgressMinimal from "./DonationProgressMinimal"
import CampeinBanner from "./CampeinBanner"
import MoneyCircles from "./MoneyCircles"
import CampeinVideo from "./CampeinVideo"

const CampeinPage = () => {
  return (
    <div>
      <CampeinBanner />
      <CampeinVideo />
      <CaruselaImage />
      <MoneyCircles />
      <DonationProgressMinimal />
      <DonationList />
    </div>




  )
}

export default CampeinPage