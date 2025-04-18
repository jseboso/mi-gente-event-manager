import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import EventCard from '../../components/EventCard';
import dbConnect from '../../utils/db';
import Event from '../../models/Event';
import { serializeDocument } from '../../utils/helpers';

export default function EventsPage({ events: initialEvents }) {
  const [filter, setFilter] = useState('upcoming');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const filteredEvents = initialEvents.filter(event => {
    const eventDate = new Date(event.date);
    if (filter === 'upcoming') {
      return eventDate >= today;
    } else if (filter === 'past') {
      return eventDate < today;
    }
    return true;
  });

  return (
    <Layout>
      <Head>
        <title>Events | Mi Gente UMN</title>
        <meta name="description" content="Upcoming and past events from Mi Gente at the University of Minnesota" />
      </Head>
      
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-yellow-600">Mi Gente Events</h1>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  filter === 'upcoming'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === 'past'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Past Events
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  filter === 'all'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Events
              </button>
            </div>
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">
                {filter === 'upcoming' 
                  ? 'No upcoming events scheduled at this time. Check back soon!'
                  : filter === 'past'
                    ? 'No past events to display.'
                    : 'No events found.'}
              </h3>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  
  try {
    const result = await Event.find({}).lean();
    
    const events = result.map(doc => serializeDocument(doc));
    
    return { props: { events } };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { props: { events: [] } };
  }
}