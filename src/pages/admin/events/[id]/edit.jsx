import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Layout from '../../../../components/Layout';
import EventForm from '../../../../components/EventForm';

export default function EditEvent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
        
        const response = await fetch(`/api/events/${id}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch event');
        }
        
        setEvent(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (status === 'authenticated' && id) {
      fetchEvent();
    }
  }, [status, id]);
  
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
    return (
      <Layout>
        <Head>
          <title>Edit Event | Mi Gente UMN</title>
        </Head>
        
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <EventForm defaultValues={event} isEditing={true} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl">Loading event details...</p>
      </div>
    </Layout>
  );
}