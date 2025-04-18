import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Mi Gente - University of Minnesota</title>
        <meta name="description" content="Mi Gente LSCC at the University of Minnesota" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-yellow-600">About Mi Gente</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                Mi Gente Latinx Student Cultural Center is a student organization at the University
                of Minnesota committed to supporting and celebrating Latinx culture, identity, and
                community. We provide a space for students to connect, study, and relax, while also
                hosting events that promote cultural awareness, representation, and dialogue on
                issues affecting our communities.
              </p>
              <p className="text-lg mb-4">
                Founded in 1969 as "La Raza", Mi Gente has become one of the university's most
                active cultural orgs — organizing everything from social gatherings and cultural
                celebrations to academic discussions and service projects. All students are welcome,
                and our community reflects a commitment to inclusivity and shared cultural growth.
              </p>
              <p className="text-lg mb-4">
                Visit us in Coffman Memorial Union, Room 211 - we're open from 10am to 6pm.
                Follow us on social media for upcoming events and ways to get involved!
              </p>
              <div className="mt-6">
                <Link href="/events"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg mr-4">
                  Upcoming Events
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/member_photo.jpg"
                  alt="Members Photo"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/board_small.jpg"
                  alt="Mi Gente Board Photo"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/ice_skating.jpg"
                  alt="Mi Gente Ice Skating"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/event_photo.jpg"
                  alt="Event Photo"
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-yellow-600">Our Mission</h2>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <ul className="list-disc pl-6 space-y-4 text-lg">
              <li>Promote awareness of Hispanic and Latinx cultures at the University of Minnesota</li>
              <li>Create a welcoming community for students of Hispanic and Latinx heritage</li>
              <li>Organize cultural, educational, and social events that celebrate our diverse traditions</li>
              <li>Foster dialogue and understanding between different cultural groups on campus</li>
              <li>Connect students with resources, opportunities, and support networks</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-yellow-600">Join Us</h2>
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <p className="text-lg mb-6">
              Interested in joining Mi Gente? Everyone is welcome to attend our events and
              meetings. Follow us on social media and check our events page to stay updated!
            </p>
            <Link href="/events"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg">
              See Upcoming Events
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}