
import CaruselaImage from "./CaruselaImage"
import DonationList from "./DonationList"
import DonationProgressMinimal from "./DonationProgressMinimal"
import CampeinBanner from "./CampeinBanner"
import MoneyCircles from "./MoneyCircles"

const CampeinPage = () => {
  return (
    <div>
      <CampeinBanner />
      <CaruselaImage />
      <MoneyCircles />
      <DonationProgressMinimal />
      <DonationList />
    </div>




  )
}

export default CampeinPage