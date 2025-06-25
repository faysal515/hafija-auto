import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";

// Import all car images
import car1Image from "@/assets/images/car1.jpeg";
import car2Image from "@/assets/images/car2.jpeg";
import car2Image1 from "@/assets/images/car2_1.jpeg";
import car2Image2 from "@/assets/images/car2_2.jpeg";
import car2Image3 from "@/assets/images/car2_3.jpeg";
import car2Image4 from "@/assets/images/car2_4.jpeg";
import car2Image5 from "@/assets/images/car2_5.jpeg";
import car2Image6 from "@/assets/images/car2_6.jpeg";
import car2Image7 from "@/assets/images/car2_7.jpeg";
import car2Image8 from "@/assets/images/car2_8.jpeg";
import car2Image9 from "@/assets/images/car2_9.jpeg";
import car2Image10 from "@/assets/images/car2_10.jpeg";
import car2Image11 from "@/assets/images/car2_11.jpeg";
import car2Image12 from "@/assets/images/car2_12.jpeg";
import car2Image13 from "@/assets/images/car2_13.jpeg";
import car2Image14 from "@/assets/images/car2_14.jpeg";
import car2Image15 from "@/assets/images/car2_15.jpeg";
import car2Image16 from "@/assets/images/car2_16.jpeg";
import car3Image from "@/assets/images/car3.jpeg";
import car3Image1 from "@/assets/images/car3_1.jpeg";
import car3Image2 from "@/assets/images/car3_2.jpeg";
import car3Image3 from "@/assets/images/car3_3.jpeg";
import car3Image4 from "@/assets/images/car3_4.jpeg";
import car3Image5 from "@/assets/images/car3_5.jpeg";
import car3Image6 from "@/assets/images/car3_6.jpeg";
import car3Image7 from "@/assets/images/car3_7.jpeg";
import car3Image8 from "@/assets/images/car3_8.jpeg";
import car3Image9 from "@/assets/images/car3_9.jpeg";
import car3Image10 from "@/assets/images/car3_10.jpeg";
import car3Image11 from "@/assets/images/car3_11.jpeg";
import car3Image12 from "@/assets/images/car3_12.jpeg";
import car3Image13 from "@/assets/images/car3_13.jpeg";
import car3Image14 from "@/assets/images/car3_14.jpeg";
import car4Image from "@/assets/images/car4.jpeg";
import car4Image1 from "@/assets/images/car4_1.jpeg";
import car4Image2 from "@/assets/images/car4_2.jpeg";
import car4Image3 from "@/assets/images/car4_3.jpeg";
import car4Image4 from "@/assets/images/car4_4.jpeg";
import car4Image5 from "@/assets/images/car4_5.jpeg";
import car4Image6 from "@/assets/images/car4_6.jpeg";
import car4Image7 from "@/assets/images/car4_7.jpeg";
import car4Image8 from "@/assets/images/car4_8.jpeg";
import car4Image9 from "@/assets/images/car4_9.jpeg";
import car4Image10 from "@/assets/images/car4_10.jpeg";
import car4Image11 from "@/assets/images/car4_11.jpeg";
import car4Image12 from "@/assets/images/car4_12.jpeg";
import car4Image13 from "@/assets/images/car4_13.jpeg";
import car4Image14 from "@/assets/images/car4_14.jpeg";
import car4Image15 from "@/assets/images/car4_15.jpeg";
import car4Image16 from "@/assets/images/car4_16.jpeg";

// Car data type definition
interface CarData {
  id: number;
  title: string;
  price: string;
  mainImage: any;
  images: any[];
  specifications: Array<{
    label: string;
    value: string;
  }>;
  features: string[];
}

// Car database
const carsData: { [key: string]: CarData } = {
  "1": {
    id: 1,
    title: "Toyota Corolla Cross 2024",
    price: "55,00,000 Taka",
    mainImage: car1Image,
    images: [car1Image],
    specifications: [
      { label: "Brand", value: "Toyota" },
      { label: "Model", value: "Corolla Cross" },
      { label: "Year", value: "2024" },
      { label: "Transmission", value: "Automatic" },
      { label: "Fuel Type", value: "Hybrid" },
      { label: "Color", value: "Red Wine" },
    ],
    features: [
      "Smart Entry & Push Start",
      "Toyota Safety Sense",
      "Large Display Audio",
      "Power Back Door",
      "Leather Seats",
      "Dual-Zone Climate Control",
    ],
  },
  "2": {
    id: 2,
    title: "Toyota Esquire Hyb 2020",
    price: "35,00,000 Taka",
    mainImage: car2Image,
    images: [
      car2Image,
      car2Image1,
      car2Image2,
      car2Image3,
      car2Image4,
      car2Image5,
      car2Image6,
      car2Image7,
      car2Image8,
      car2Image9,
      car2Image10,
      car2Image11,
      car2Image12,
      car2Image13,
      car2Image14,
      car2Image15,
      car2Image16,
    ],
    specifications: [
      { label: "Brand", value: "Toyota" },
      { label: "Model", value: "Esquire" },
      { label: "Year", value: "2020" },
      { label: "Transmission", value: "Automatic" },
      { label: "Fuel Type", value: "Hybrid" },
      { label: "Color", value: "Pearl White" },
    ],
    features: [
      "Smart Entry & Push Start",
      "Toyota Safety Sense",
      "Large Display Audio",
      "Power Sliding Doors",
      "Leather Seats",
      "Dual-Zone Climate Control",
    ],
  },
  "3": {
    id: 3,
    title: "Toyota Fielder Hyb 2020",
    price: "21,50,000 Taka",
    mainImage: car3Image,
    images: [
      car3Image,
      car3Image1,
      car3Image2,
      car3Image3,
      car3Image4,
      car3Image5,
      car3Image6,
      car3Image7,
      car3Image8,
      car3Image9,
      car3Image10,
      car3Image11,
      car3Image12,
      car3Image13,
      car3Image14,
    ],
    specifications: [
      { label: "Brand", value: "Toyota" },
      { label: "Model", value: "Fielder" },
      { label: "Year", value: "2020" },
      { label: "Transmission", value: "Automatic" },
      { label: "Fuel Type", value: "Hybrid" },
      { label: "Color", value: "Silver" },
    ],
    features: [
      "Smart Entry & Push Start",
      "Toyota Safety Sense",
      "Display Audio",
      "LED Headlights",
      "Comfortable Seats",
      "Climate Control",
    ],
  },
  "4": {
    id: 4,
    title: "Toyota Corolla Cross 2024",
    price: "52,50,000 Taka",
    mainImage: car4Image,
    images: [
      car4Image,
      car4Image1,
      car4Image2,
      car4Image3,
      car4Image4,
      car4Image5,
      car4Image6,
      car4Image7,
      car4Image8,
      car4Image9,
      car4Image10,
      car4Image11,
      car4Image12,
      car4Image13,
      car4Image14,
      car4Image15,
      car4Image16,
    ],
    specifications: [
      { label: "Brand", value: "Toyota" },
      { label: "Model", value: "Corolla Cross" },
      { label: "Grade", value: "Z Hybrid" },
      { label: "Year", value: "2024" },
      { label: "Mileage", value: "19,989 km" },
      { label: "Engine", value: "1800 cc" },
      { label: "Transmission", value: "Automatic" },
      { label: "Fuel Type", value: "Hybrid" },
      { label: "Drive Type", value: "2WD" },
      { label: "Color", value: "Pearl White" },
      { label: "Seats", value: "5" },
      { label: "Steering", value: "Right" },
    ],
    features: [
      "Smart Entry & Push Start",
      "Toyota Safety Sense",
      "Large Display Audio",
      "Power Back Door",
      "Leather Seats",
      "Dual-Zone Climate Control",
    ],
  },
};

export default function CarDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showLargeImage, setShowLargeImage] = useState(false);

  // Get car data
  const carData = carsData[id as string];

  // Set initial selected image
  if (!selectedImage && carData) {
    setSelectedImage(carData.mainImage);
  }

  if (!carData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white">Car not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{carData.title}</h1>
        <div className="text-2xl font-bold text-yellow-400">
          {carData.price}
        </div>
      </div>

      {/* Main Image Display */}
      <div
        className="relative aspect-video mb-8 cursor-pointer"
        onClick={() => setShowLargeImage(true)}
      >
        <Image
          src={selectedImage || carData.mainImage}
          alt={carData.title}
          fill
          className="object-contain rounded-lg"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {carData.images.map((image, index) => (
          <div
            key={index}
            className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden border-2 ${
              selectedImage === image
                ? "border-yellow-400"
                : "border-transparent"
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`${carData.title} View ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Specifications */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carData.specifications.map((spec, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-gray-700 py-2"
            >
              <span className="text-gray-400">{spec.label}:</span>
              <span className="text-white font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
              <span className="text-white">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Large Image Modal */}
      {showLargeImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setShowLargeImage(false)}
        >
          <div className="relative w-full h-full p-4">
            <Image
              src={selectedImage || carData.mainImage}
              alt={carData.title}
              fill
              className="object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl"
              onClick={() => setShowLargeImage(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Generate static paths for all cars
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(carsData).map((id) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false,
  };
};

// Get static props for each car
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}, // The data is already in the component
  };
};
