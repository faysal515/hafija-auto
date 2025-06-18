import Image from "next/image";
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

const images = [
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
];

export default function Car3Details() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-4">
        Toyota Fielder Hybrid 2020
      </h1>
      <p className="text-xl text-yellow-400 font-semibold mb-8">
        Price: 21,50,000 Taka
      </p>

      {/* Auction Sheet Caption above image */}
      <div className="mb-4 flex flex-col items-center">
        <p className="mb-2 text-lg text-yellow-400 font-bold">Auction Sheet</p>
        <div className="relative w-full max-w-2xl h-[500px] rounded-lg overflow-hidden border border-yellow-400 bg-gray-900">
          <Image
            src={car3Image14}
            alt="Auction Sheet"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Car Picture Caption */}
      <p className="mb-6 text-lg text-yellow-400 font-bold text-center">
        Car Picture
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-700 bg-gray-900"
          >
            {/* Add Sold Out tag only to the first image */}
            {idx === 0 && (
              <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider">
                Sold Out
              </span>
            )}
            <Image
              src={img}
              alt={`Toyota Fielder Hybrid 2020 photo ${idx + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
