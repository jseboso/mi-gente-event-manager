import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Layout from '../../../components/Layout';
import BoardMemberForm from '../../../components/BoardMemberForm';
import { serializeDocument } from '../../../utils/helpers';

export default function EditBoardMember() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [boardMember, setBoardMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBoardMember = async () => {
      try {
        if (!id) return;

        const response = await fetch(`/api/board-members/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch board member');
        }

        setBoardMember(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated' && id) {
      fetchBoardMember();
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
            onClick={() => router.push('/board')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Return to Board Page
          </button>
        </div>
      </Layout>
    );
  }

  if (status === 'authenticated' && boardMember) {
    return (
      <Layout>
        <Head>
          <title>Edit Board Member | Mi Gente UMN</title>
        </Head>

        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <BoardMemberForm defaultValues={boardMember} isEditing={true} />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl">Loading board member details...</p>
      </div>
    </Layout>
  );
}