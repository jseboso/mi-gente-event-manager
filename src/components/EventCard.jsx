import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaLink } from 'react-icons/fa';

export default function EventCard({ event }) {
  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          src={event.imageUrl || '/images/placeholder.jpg'}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-yellow-600">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700">
            <FaCalendar className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaClock className="mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="mr-2" />
            <span>{event.location}</span>
          </div>
          {event.link && (
            <div className="flex items-center text-gray-700">
              <FaLink className="mr-2" />
              <a 
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline truncate"
              >
                Event Link
              </a>
            </div>
          )}
        </div>
        
        <Link 
          href={`/events/${event._id}`}
          className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}