import Hero from "../components/Layout/Hero"
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from "../components/Products/NewArrivals"
import BestSellers from "../components/Products/BestSellers";
import USPRow from "../components/Common/USPRow";
import Footer from "../components/Common/Footer";

const Home = () => {
   return (
      <div>
         <Hero />
         <GenderCollectionSection />
         <NewArrivals />
         <BestSellers />
         <USPRow />
         {/* <Footer /> */}
      </div>
   )
}

export default Home