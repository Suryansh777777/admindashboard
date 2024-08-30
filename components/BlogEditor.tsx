"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface BlogEditorProps {
  initialData?: {
    title: string;
    content: string;
    slug: string;
  };
}

export default function BlogEditor({ initialData }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/blogs/${initialData.slug}` : "/api/blogs";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, slug }),
    });

    if (response.ok) {
      router.push("/admin/dashboard");
    } else {
      console.error("Error saving blog post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700"
        >
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <MonacoEditor
          height="400px"
          language="html"
          theme="vs-dark"
          value={content}
          onChange={(value) => setContent(value || "")}
          options={{
            minimap: { enabled: false },
          }}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Blog Post
      </button>
    </form>
  );
}
