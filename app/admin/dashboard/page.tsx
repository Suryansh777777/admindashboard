"use client";
import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Trash2, Edit, Plus, Save, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../actions/serveractions";
import { useRouter } from "next/navigation";

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
  const [jsonContent, setJsonContent] = useState("{}");
  const [htmlContent, setHtmlContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  //jwt in local storage/
  //cookie
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(isLoggedIn);
      if (!isLoggedIn) {
        router.push("/admin/login");
      } else {
        fetchBlogs();
      }
    };

    checkAuth();
  }, [router]);

  const fetchBlogs = async () => {
    const fetchedBlogs = await getBlogs();
    setBlogs(fetchedBlogs);
  };

  const handleCreate = async () => {
    if (!title.trim() || jsonContent === "{}" || htmlContent === "") {
      setWarning("Please provide a title and content for the blog.");
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonContent);
      await createBlog({
        title,
        content: JSON.stringify({ json: parsedJson, html: htmlContent }),
      });
      console.log(parsedJson, createBlog);

      resetForm();
      fetchBlogs();
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const handleUpdate = async () => {
    if (editId !== null) {
      if (!title.trim() || jsonContent === "{}" || htmlContent === "") {
        setWarning("Please provide a title and content for the blog.");
        return;
      }

      try {
        const parsedJson = JSON.parse(jsonContent);
        await updateBlog(editId, {
          title,
          content: JSON.stringify({ json: parsedJson, html: htmlContent }),
        });
        resetForm();
        fetchBlogs();
      } catch (err) {
        setError("Invalid JSON format");
      }
    }
  };

  const handleDelete = async (id: number) => {
    await deleteBlog(id);
    fetchBlogs();
  };

  const resetForm = () => {
    setTitle("");
    setJsonContent("{}");
    setHtmlContent("");
    setEditId(null);
    setError(null);
    setWarning(null);
  };

  const navigateToBlog = (id: number) => {
    router.push(`/blog/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {warning && (
        <Alert variant="warning" className="mb-4">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {editId !== null ? "Update Blog" : "Create New Blog"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-4"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              JSON Content
            </label>
            <Editor
              height="200px"
              language="json"
              value={jsonContent}
              defaultLanguage="json"
              onChange={(value) => setJsonContent(value || "{}")}
              options={{ minimap: { enabled: false } }}
            />
            //direct send
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              HTML Content
            </label>
            <Editor
              theme="vs-dark"
              height="200px"
              language="html"
              value={htmlContent}
              defaultLanguage="html"
              onChange={(value) => setHtmlContent(value || "")}
              options={{ minimap: { enabled: false } }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={editId !== null ? handleUpdate : handleCreate}
            className="w-full"
          >
            {editId !== null ? (
              <Save className="mr-2" />
            ) : (
              <Plus className="mr-2" />
            )}
            {editId !== null ? "Update Blog" : "Create Blog"}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            className="cursor-pointer"
            onClick={() => navigateToBlog(blog.id)}
          >
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                Created: {new Date(blog.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(blog.updatedAt).toLocaleString()}
              </p>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              // /blog/edit/id // new --- new he toh previous ka data //states
              ki jagah server actions /blog/edit
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditId(blog.id);
                  setTitle(blog.title);
                  const content = JSON.parse(blog.content);
                  setJsonContent(JSON.stringify(content.json, null, 2));
                  setHtmlContent(content.html);
                }}
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(blog.id);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToBlog(blog.id);
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" /> View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
