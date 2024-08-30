"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MonacoEditor from "./MonacoEditor";

interface BlogPostFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    category: string[];
  };
}

export default function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(
    initialData?.category.join(", ") || ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    if (initialData) {
      formData.append("id", initialData.id);
      await updatePost(formData);
    } else {
      await createPost(formData);
    }

    router.push("/admin/dashboard");
  }

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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category (comma-separated)
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
          value={content}
          onChange={(value) => setContent(value || "")}
          language="markdown"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialData ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
}

async function createPost(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = (formData.get("category") as string)
    .split(",")
    .map((c) => c.trim());

  await prisma.post.create({
    data: {
      title,
      content,
      category,
    },
  });
}

async function updatePost(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = (formData.get("category") as string)
    .split(",")
    .map((c) => c.trim());

  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      category,
    },
  });
}
