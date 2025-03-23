import React from 'react'
import CandleLightingTimes from './CandleLightingTimes'
import LatestParasha from './LatestParasha'
import LatestVideo from './LatestVideo'
import CarouselChabd from './CarouselChabad'
import ChabadAboutSection from './AboutChabad'
import OurServiceN from './ChabadServices'
import ReservationForm from './ReservationForm'
import ParashaCarousel from './ShabatForm'

const HomePage = () => {
  return (
    <div>
      <CarouselChabd />
      <ChabadAboutSection />
      <OurServiceN />
      <LatestParasha />
      <CandleLightingTimes />
      <LatestVideo />
      <ParashaCarousel />
 


    </div>
  )
}

export default HomePage