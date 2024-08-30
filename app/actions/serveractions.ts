"use server";
import { prisma } from "@/lib/prisma";

export async function createBlog({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const newBlog = await prisma.blog.create({
    data: { title, content },
  });
  return newBlog;
}

export async function getBlogs() {
  const blogs = await prisma.blog.findMany({ where: { isDeleted: false } });
  return blogs;
  //title author created
}
export async function getBlogPost(id: number) {
  return prisma.blog.findUnique({ where: { id, isDeleted: false } });
}
export async function getRelatedPosts(id: number) {
  const blogs = await prisma.blog.findMany({
    where: {
      isDeleted: false,
      id: { not: id },
    },
    take: 3,
  });
  return blogs;
}
export async function updateBlog(
  id: number,
  { title, content }: { title: string; content: string }
) {
  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: { title, content },
  });
  return updatedBlog;
}

export async function deleteBlog(id: number) {
  await prisma.blog.update({
    where: { id },
    data: { isDeleted: true },
  });
}

const DEFAULT_ADMIN_EMAIL = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin";

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
    return { success: true };
  } else {
    return { success: false, error: "Invalid email or password" };
  }
}
