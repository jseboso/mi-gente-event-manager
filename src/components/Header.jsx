import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Mi Gente Logo" 
              width={50} 
              height={50} 
              className="mr-3"
              unoptimized
            />
            <span className="text-xl font-bold text-yellow-600">Mi Gente Latinx Student Cultural Center</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-yellow-600">
              Home
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-yellow-600">
              Events
            </Link>
            <Link href="/board" className="text-gray-700 hover:text-yellow-600">
              Board
            </Link>
            {session ? (
              <>
                <Link href="/admin/dashboard" className="text-gray-700 hover:text-yellow-600">
                  Admin Dashboard
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center text-gray-700 hover:text-yellow-600"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/admin/login" className="text-gray-700 hover:text-yellow-600">
                Admin Login
              </Link>
            )}
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-yellow-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/events" 
                className="text-gray-700 hover:text-yellow-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                href="/board" 
                className="text-gray-700 hover:text-yellow-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Board
              </Link>
              {session ? (
                <>
                  <Link 
                    href="/admin/dashboard" 
                    className="text-gray-700 hover:text-yellow-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center text-gray-700 hover:text-yellow-600"
                  >
                    <FaSignOutAlt className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/admin/login" 
                  className="text-gray-700 hover:text-yellow-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}