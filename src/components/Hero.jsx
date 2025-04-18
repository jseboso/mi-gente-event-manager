import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative h-[70vh] w-full">
      <div className="absolute inset-0">
        <Image
          src="/images/group_photo.jpg"
          alt="Mi Gente group photo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Mi Gente Latinx Student Cultural Center
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
          Celebrating Hispanic and Latinx culture at the University of Minnesota Twin Cities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/events" 
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg">
            Upcoming Events
          </Link>
          <a href="#about" 
            className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white border-2 border-white font-bold py-3 px-8 rounded-lg">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}