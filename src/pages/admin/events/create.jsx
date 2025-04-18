import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Layout from '../../../components/Layout';
import EventForm from '../../../components/EventForm';

export default function CreateEvent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  if (status === 'loading') {
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
          <title>Create Event | Mi Gente UMN</title>
        </Head>
        
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <EventForm />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return null;
}