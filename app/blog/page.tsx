import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogList() {
  const blogs = await prisma.blog.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <ul className="space-y-4">
        {blogs.map((blog) => (
          <li key={blog.id} className="border-b pb-4">
            <Link
              href={`/blog/${blog.id}`}
              className="text-xl font-semibold text-blue-600 hover:text-blue-800"
            >
              {blog.title}
            </Link>
            <p className="text-sm text-gray-500 mt-1">{blog.content}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
