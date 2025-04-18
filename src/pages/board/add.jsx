import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import BoardMemberForm from '../../components/BoardMemberForm';

export default function AddBoardMember() {
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
          <title>Add Board Member | Mi Gente UMN</title>
        </Head>
        
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <BoardMemberForm />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return null;
}