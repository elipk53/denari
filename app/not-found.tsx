import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-3xl font-bold mb-4">404 - Not Found</h2>
      <p className="text-gray-400 mb-6">The client you're looking for doesn't exist.</p>
      <Link href="/" className="text-blue-400 hover:underline">
        Return to client list
      </Link>
    </div>
  );
}