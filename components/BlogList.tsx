"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await fetch("/api/blogs");
    const data = await response.json();
    setBlogs(data);
  };

  const deleteBlog = async (id: string) => {
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
      <Link
        href="/admin/blog/new"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New Blog
      </Link>
      <ul className="mt-4">
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="flex items-center justify-between border-b py-2"
          >
            <span>{blog.title}</span>
            <div>
              <Link
                href={`/admin/blog/edit/${blog.slug}`}
                className="text-blue-500 mr-2"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteBlog(blog.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
