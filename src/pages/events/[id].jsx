import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import Layout from '../../components/Layout';
import RSVPForm from '../../components/RSVPForm';
import dbConnect from '../../utils/db';
import Event from '../../models/Event';
import { serializeDocument } from '../../utils/helpers';

export default function EventDetail({ event }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl">Loading event details...</p>
        </div>
      </Layout>
    );
  }
  
  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Event Not Found</h1>
          <p className="text-lg mb-6">Sorry, the event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/events')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            View All Events
          </button>
        </div>
      </Layout>
    );
  }
  
  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPastEvent = eventDate < today;

  return (
    <Layout>
      <Head>
        <title>{event.title} | Mi Gente UMN</title>
        <meta name="description" content={`${event.title} - ${formattedDate} at ${event.location}`} />
      </Head>
      
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64 md:h-96">
              <Image
                src={event.imageUrl || '/images/placeholder.jpg'}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-600">{event.title}</h1>
                
                <div className="space-y-2 mb-6">
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
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        More information/registration
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">About This Event</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-8">
                {isPastEvent ? (
                  <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2">This Event Has Passed</h3>
                    <p className="text-gray-700">
                      Check out our other upcoming events for more opportunities to join Mi Gente.
                    </p>
                  </div>
                ) : (
                  <RSVPForm eventId={event._id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();
  
  try {
    const event = await Event.findById(params.id).lean();
    
    if (!event) {
      return { props: { event: null } };
    }
    
    // Serialize event
    const serializedEvent = serializeDocument(event);
    
    return { props: { event: serializedEvent } };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { props: { event: null } };
  }
}