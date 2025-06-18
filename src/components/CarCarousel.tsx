import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface Car {
  id: number;
  image: StaticImageData;
  title: string;
  price: string;
}

interface CarCarouselProps {
  cars: Car[];
}

export default function CarCarousel({ cars }: CarCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: 3000, // 3 seconds
      stopOnInteraction: false, // Won't stop on user interaction
      stopOnMouseEnter: true, // Optional: stops on mouse enter
    }),
  ]);
  const router = useRouter();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const goToCarDetail = (carId: number) => {
    router.push(`/cars/${carId}`);
  };

  return (
    <div className="relative w-4/5 mx-auto">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {cars.map((car, idx) => (
            <div
              key={car.id}
              className="flex-[0_0_100%] min-w-0 relative h-[400px] cursor-pointer"
              onClick={() => goToCarDetail(car.id)}
            >
              {/* Sold Out tag for the third car */}
              {idx === 2 && (
                <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider">
                  Sold Out
                </span>
              )}
              <Image
                src={car.image}
                alt={car.title}
                fill
                className="object-contain rounded-2xl"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6 rounded-b-2xl">
                <h3 className="text-2xl font-bold">{car.title}</h3>
                <p className="text-xl">{car.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        onClick={scrollPrev}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        onClick={scrollNext}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
