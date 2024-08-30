"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../actions/serveractions";

interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const Dashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      const fetchedBlogs = await getBlogs();
      setBlogs(fetchedBlogs);
    }
    fetchBlogs();
  }, []);

  const handleCreate = async () => {
    await createBlog({ title, content });
    setTitle("");
    setContent("");
    const updatedBlogs = await getBlogs();
    setBlogs(updatedBlogs);
  };

  const handleUpdate = async () => {
    if (editId !== null) {
      await updateBlog(editId, { title, content });
      setTitle("");
      setContent("");
      setEditId(null);
      const updatedBlogs = await getBlogs();
      setBlogs(updatedBlogs);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteBlog(id);
    const updatedBlogs = await getBlogs();
    setBlogs(updatedBlogs);
  };

  return (
    <div className="bg-white text-black">
      <h1>Blog Dashboard</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button onClick={editId !== null ? handleUpdate : handleCreate}>
        {editId !== null ? "Update Blog" : "Create Blog"}
      </button>

      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <button
              onClick={() => {
                setEditId(blog.id);
                setTitle(blog.title);
                setContent(blog.content);
              }}
            >
              Edit
            </button>
            <button onClick={() => handleDelete(blog.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
