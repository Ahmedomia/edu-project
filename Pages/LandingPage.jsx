import Hero from "../Components/Hero";
import Header from "../Components/Header";
import HowItWorks from "../Components/HowItWorks";
import Stats from "../Components/Stats";
import WhyChooseUs from "../Components/WhyChooseUs";
import SuccessStories from "../Components/SuccessStories";
import CallToAction from "../Components/CallToAction";
function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <HowItWorks />
      <WhyChooseUs />
      <SuccessStories />
      <CallToAction />
    </>
  );
}

export default LandingPage;
