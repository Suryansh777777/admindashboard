import Link from "next/link";
import Image from "next/image";
import BlogCard from "@/components/ BlogCard";
import { getBlogs } from "../actions/serveractions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default async function BlogHome() {
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">
        <span className="text-orange-500">Blog</span> Section
      </h1>

      {/* Featured Post */}
      {blogs[0] && (
        <Link href={`/blog/${blogs[0].id}`} className="block mb-8">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              // src={blogs[0].imageUrl}
              src={`https://picsum.photos/200`}
              alt={blogs[0].title}
              fill
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-4 left-4 p-4 bg-white rounded-lg shadow-lg">
              <Badge variant="default" className="bg-blue-500 text-white">
                {blogs[0].category || "Travel"}
              </Badge>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                {blogs[0].title}
              </h2>
              <p className="text-gray-300 mt-2">
                {JSON.parse(blogs[0].content).html.substring(0, 100)}...
              </p>
              <div className="flex items-center mt-2 space-x-2 text-gray-600">
                <Avatar>
                  <AvatarImage src={`https://picsum.photos/200`} alt="Author" />
                  <AvatarFallback>V</AvatarFallback>
                </Avatar>
                <span> {blogs[0].author || "Varun B"}</span>

                <span className="text-gray-300 text-sm">
                  {new Date(blogs[0].createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* <div className="flex items-center mt-2">
                <span className="text-gray-300 text-sm">
                  {new Date(blogs[0].createdAt).toLocaleDateString()}
                </span>
              </div> */}
            </div>
          </div>
        </Link>
      )}

      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <Input
          type="search"
          placeholder="Search topics"
          className="w-full pl-10"
        />
      </div>
      <div className="flex space-x-4 mb-4">
        {[
          { name: "Travel Hacks", color: "bg-blue-100 text-blue-800" },
          { name: "Trip Guides", color: "bg-yellow-100 text-yellow-800" },
          { name: "Food Guides", color: "bg-green-100 text-green-800" },
          { name: "Trending Places", color: "bg-purple-100 text-purple-800" },
          { name: "Experiences", color: "bg-red-100 text-red-800" },
        ].map((category) => (
          <Badge
            key={category.name}
            className={`px-3 py-1 rounded-full text-sm ${category.color}`}
          >
            {category.name}
          </Badge>
        ))}
      </div>
      <h2 className="mt-8 text-2xl font-bold text-gray-800">Posts</h2>
      <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.slice(1).map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            excerpt={JSON.parse(post.content).html.substring(0, 100) + "..."}
            date={new Date(post.createdAt).toLocaleDateString()}
          />
        ))}
      </div>
      <div className="flex justify-center mb-8">
        <Button variant="default">View All Post</Button>
      </div>
    </div>
  );
}
function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
