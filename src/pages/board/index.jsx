import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaPlus } from 'react-icons/fa';
import Layout from '../../components/Layout';
import BoardMemberCard from '../../components/BoardMemberCard';
import dbConnect from '../../utils/db';
import BoardMember from '../../models/BoardMember';
import { serializeDocument } from '../../utils/helpers';

export default function BoardPage({ boardMembers }) {
  const { data: session } = useSession();
  
  return (
    <Layout>
      <Head>
        <title>Board Members | Mi Gente UMN</title>
        <meta name="description" content="Meet the board members of Mi Gente at the University of Minnesota" />
      </Head>
      
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-yellow-600">Our Board</h1>
            {session && (
              <Link
                href="/board/add"
                className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                <FaPlus className="mr-2" />
                Add Board Member
              </Link>
            )}
          </div>
          
          <div className="mb-8">
            <p className="text-lg text-center mx-auto max-w-3xl">
              Meet the Mi Gente 2024-2025 board!
            </p>
          </div>
          
          {boardMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boardMembers.map((boardMember) => (
                <div key={boardMember._id} className="flex flex-col">
                  <BoardMemberCard boardMember={boardMember} />
                  
                  {session && (
                    <div className="mt-2 flex justify-center space-x-2">
                      <Link
                        href={`/board/edit/${boardMember._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-2 rounded"
                      >
                        Edit
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No board members have been added yet.
                {session && (
                  <span className="block mt-4">
                    <Link
                      href="/board/add"
                      className="inline-flex items-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <FaPlus className="mr-2" />
                      Add Board Member
                    </Link>
                  </span>
                )}
              </p>
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
    const result = await BoardMember.find({}).sort({ order: 1, name: 1 }).lean();
    
    const boardMembers = result.map(doc => serializeDocument(doc));
    
    return { props: { boardMembers } };
  } catch (error) {
    console.error('Error fetching board members:', error);
    return { props: { boardMembers: [] } };
  }
}