import Image from 'next/image';

export default function BoardMemberCard({ boardMember }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-xs mx-auto">
      <div className="relative h-48 w-48 mx-auto mt-4 overflow-hidden rounded-full border-2 border-yellow-600">
        <Image
          src={boardMember.imageUrl || '/images/placeholder.jpg'}
          alt={boardMember.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-yellow-600">{boardMember.name}</h3>
        <p className="text-gray-600 text-sm">{boardMember.position}</p>
        {boardMember.bio && (
          <p className="mt-2 text-xs text-gray-500">{boardMember.bio}</p>
        )}
      </div>
    </div>
  );
}