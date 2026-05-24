import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Categories from "@/components/Categories";
import FeaturedCourses from "@/components/FeaturedCourses";
import InstructorCTA from "@/components/InstructorCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Categories />
        <FeaturedCourses />
        <InstructorCTA />
      </main>
      <Footer />
    </>
  );
}
