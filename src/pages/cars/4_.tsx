import { useState } from "react";
import Image from "next/image";
import car4_1 from "@/assets/images/car4_1.jpeg";
import car4_2 from "@/assets/images/car4_2.jpeg";
import car4_3 from "@/assets/images/car4_3.jpeg";
import car4_4 from "@/assets/images/car4_4.jpeg";
import car4_5 from "@/assets/images/car4_5.jpeg";
import car4_6 from "@/assets/images/car4_6.jpeg";
import car4_7 from "@/assets/images/car4_7.jpeg";
import car4_8 from "@/assets/images/car4_8.jpeg";
import car4_9 from "@/assets/images/car4_9.jpeg";
import car4_10 from "@/assets/images/car4_10.jpeg";
import car4_11 from "@/assets/images/car4_11.jpeg";
import car4_12 from "@/assets/images/car4_12.jpeg";
import car4_13 from "@/assets/images/car4_13.jpeg";
import car4_14 from "@/assets/images/car4_14.jpeg";
import car4_15 from "@/assets/images/car4_15.jpeg";
import car4_16 from "@/assets/images/car4_16.jpeg";

export default function CarDetails() {
  const [selectedImage, setSelectedImage] = useState(car4_1);
  const [showLargeImage, setShowLargeImage] = useState(false);

  const images = [
    car4_1,
    car4_2,
    car4_3,
    car4_4,
    car4_5,
    car4_6,
    car4_7,
    car4_8,
    car4_9,
    car4_10,
    car4_11,
    car4_12,
    car4_13,
    car4_14,
    car4_15,
    car4_16,
  ];

  const specifications = [
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
    { label: "Price", value: "52,50,000 Taka" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Toyota Corolla Cross 2024
      </h1>

      {/* Main Image Display */}
      <div
        className="relative aspect-video mb-8 cursor-pointer"
        onClick={() => setShowLargeImage(true)}
      >
        <Image
          src={selectedImage}
          alt="Toyota Corolla Cross"
          fill
          className="object-contain rounded-lg"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {images.map((image, index) => (
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
              alt={`Toyota Corolla Cross View ${index + 1}`}
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
          {specifications.map((spec, index) => (
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
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <span className="text-white">Smart Entry & Push Start</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <span className="text-white">Toyota Safety Sense</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <span className="text-white">Large Display Audio</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <span className="text-white">Power Back Door</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <span className="text-white">Leather Seats</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <span className="text-white">Dual-Zone Climate Control</span>
          </div>
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
              src={selectedImage}
              alt="Toyota Corolla Cross Large View"
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
