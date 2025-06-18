import CarCarousel from "../components/CarCarousel";
import car1Image from "@/assets/images/car1.jpeg";
import car2Image from "@/assets/images/car2.jpeg";
import car3Image from "@/assets/images/car3.jpeg";
import car4Image from "@/assets/images/car4.jpeg";

export default function Home() {
  const cars = [
    {
      id: 1,
      image: car1Image,
      title: "Toyota Corolla Cross 2024",
      price: "55,00,000 Taka",
    },
    {
      id: 2,
      image: car2Image,
      title: "Toyota Esquire Hyb 2020",
      price: "35,00,000 Taka",
    },
    {
      id: 3,
      image: car3Image,
      title: "Toyota Fielder Hyb 2020",
      price: "21,50,000 Taka",
    },
    {
      id: 4,
      image: car4Image,
      title: "Toyota Corolla Cross 2024",
      price: "52,50,000 Taka",
    },
  ];

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white border-b-2 border-yellow-400 pb-2 inline-block">
          OUR STOCK
        </h2>
      </div>
      <CarCarousel cars={cars} />
    </div>
  );
}
