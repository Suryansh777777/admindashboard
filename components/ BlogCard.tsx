import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  date: string;
}

export default function BlogCard({ id, title, excerpt, date }: BlogCardProps) {
  return (
    <Link href={`/blog/${id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-48">
          <Image
            src={`https://picsum.photos/200`} // Replace with actual image URL
            alt={title}
            fill
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-gray-600 text-sm mt-2">{excerpt}</p>
          <span className="text-sm text-gray-500 mt-2 block">{date}</span>
        </div>
      </div>
    </Link>
  );
}
