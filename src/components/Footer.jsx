import Link from 'next/link';
import { FaCalendar, FaDiscord, FaExternalLinkAlt, FaFacebook, FaInstagram, FaLinkedin, FaTree, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mi Gente LSCC</h3>
            <p className="mb-4">
              Celebrating Hispanic and Latinx culture at the University of Minnesota Twin Cities.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/migenteumn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://z.umn.edu/MiGenteDiscord" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <FaDiscord className="h-6 w-6" />
              </a>
              <a href="https://linktr.ee/MIGENTEUMN" target="_blank" rel="noopener noreferrer" aria-label="LinkTree">
                <FaTree className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/company/mi-gente-latinx-student-cultural-center/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://https://gopherlink.umn.edu/0131/home/.com" target="_blank" rel="noopener noreferrer" aria-label="GopherLink">
                <FaCalendar className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-yellow-400">Home</Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-yellow-400">Events</Link>
              </li>
              <li>
                <Link href="/board" className="hover:text-yellow-400">Board</Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-yellow-400">Admin Login</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="mb-2">
              Email: <a href="mailto:migente@umn.edu" className="text-blue-400 underline">migente@umn.edu</a>
            </p>
            <p className="mb-2">
              <a href="https://sua.umn.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                Student Unions & Activities
              </a>
            </p>
            <p>
              <a href="https://twin-cities.umn.edu/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                University of Minnesota
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {currentYear} Mi Gente LSCC at University of Minnesota. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}