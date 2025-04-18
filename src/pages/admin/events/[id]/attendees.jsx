import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaArrowLeft } from 'react-icons/fa';
import Layout from '../../../../components/Layout';
import { serializeDocument } from '../../../../utils/helpers';

export default function EventAttendees() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        const eventResponse = await fetch(`/api/events/${id}`);
        const eventResult = await eventResponse.json();
        
        if (!eventResponse.ok) {
          throw new Error(eventResult.message || 'Failed to fetch event');
        }
        
        setEvent(eventResult.data);
        
        const attendeesResponse = await fetch(`/api/admin/attendees?eventId=${id}`);
        const attendeesResult = await attendeesResponse.json();
        
        if (!attendeesResponse.ok) {
          throw new Error(attendeesResult.message || 'Failed to fetch attendees');
        }
        
        setAttendees(attendeesResult.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (status === 'authenticated' && id) {
      fetchData();
    }
  }, [status, id]);
  
  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-lg mb-6">{error}</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }
  
  if (status === 'authenticated' && event) {
    // Format event date
    const eventDate = formatDate(event.date);
    
    return (
      <Layout>
        <Head>
          <title>Event Attendees | Mi Gente UMN</title>
        </Head>
        
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Link 
                href="/admin/dashboard"
                className="inline-flex items-center text-yellow-600 hover:text-yellow-800"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2 text-yellow-600">{event.title}</h1>
                <p className="text-gray-600 mb-6">
                  {eventDate} at {event.time} | {event.location}
                </p>
                
                <h2 className="text-xl font-bold mb-4">Attendees List</h2>
                
                {attendees.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            RSVP Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendees.map((attendee) => (
                          <tr key={attendee._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {attendee.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {attendee.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatDate(attendee.createdAt)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-600">No one has RSVPed for this event yet.</p>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2">Attendee Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">Total RSVPs: <span className="font-semibold">{attendees.length}</span></p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      if (attendees.length === 0) {
                        alert('No attendees to export');
                        return;
                      }
                      
                      const headers = ['Name', 'Email', 'RSVP Date'];
                      const rows = attendees.map(a => [
                        a.name,
                        a.email,
                        new Date(a.createdAt).toLocaleDateString()
                      ]);
                      
                      const csvContent = [
                        headers.join(','),
                        ...rows.map(row => row.join(','))
                      ].join('\n');
                      
                      // download link
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.setAttribute('href', url);
                      a.setAttribute('download', `${event.title}-attendees.csv`);
                      a.click();
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    disabled={attendees.length === 0}
                  >
                    Export as CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return null;
}