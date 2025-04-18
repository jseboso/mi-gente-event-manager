import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import Layout from '../../components/Layout';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Session check function
  const checkServerSession = async () => {
    try {
      const response = await fetch('/api/check-session');
      const data = await response.json();
      console.log('Server session check:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to check session:', error);
    }
  };
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch events');
        }
        
        setEvents(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchEvents();
    }
  }, [status]);
  
  // Handle event deletion
  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || 'Failed to delete event');
        }
        
        setEvents(events.filter(event => event._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
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
  
  if (status === 'authenticated') {
    return (
      <Layout>
        <Head>
          <title>Admin Dashboard | Mi Gente UMN</title>
        </Head>
        
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-yellow-600">Admin Dashboard</h1>
              <div className="flex space-x-4">
                <button
                  onClick={checkServerSession}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Check Server Session
                </button>
                <Link 
                  href="/admin/events/create"
                  className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FaPlus className="mr-2" />
                  Create New Event
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                {error}
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Manage Events</h2>
                
                {events.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => {
                          // Format date
                          const eventDate = new Date(event.date);
                          const formattedDate = eventDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          });
                          
                          return (
                            <tr key={event._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {event.title}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formattedDate}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {event.time}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {event.location}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <Link 
                                    href={`/admin/events/${event._id}/attendees`}
                                    className="text-blue-600 hover:text-blue-900"
                                    title="View Attendees"
                                  >
                                    <FaUsers />
                                  </Link>
                                  <Link 
                                    href={`/admin/events/${event._id}/edit`}
                                    className="text-yellow-600 hover:text-yellow-900"
                                    title="Edit Event"
                                  >
                                    <FaEdit />
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Delete Event"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No events have been created yet.</p>
                    <Link
                      href="/admin/events/create"
                      className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <FaPlus className="mr-2" />
                      Create Your First Event
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return null;
}