
import CaruselaImage from "./CaruselaImage"
import DonationList from "./DonationList"
import DonationProgressMinimal from "./DonationProgressMinimal"
import KampeinBanner from "./KampeinBanner"
import MoneyCircles from "./MoneyCircles"

const KampeinPage = () => {
  return (
    <div>
      <KampeinBanner />
      <CaruselaImage />
      <MoneyCircles />
      <DonationProgressMinimal />
      <DonationList />
    </div>




  )
}

export default KampeinPage