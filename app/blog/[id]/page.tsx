import Link from "next/link";
import { getBlogPost, getRelatedPosts } from "@/app/actions/serveractions";
import Image from "next/image";
import BlogCard from "@/components/ BlogCard";

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getBlogPost(Number(params.id));
  const relatedPosts = await getRelatedPosts(Number(params.id));

  if (!post) {
    return <div>Post not found</div>;
  }

  const parsedContent = JSON.parse(post.content);

  return (
    <div className="container mx-auto px-4">
      <Link href="/blog" className="inline-block my-4">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <span className="text-gray-500">
        {new Date(post.createdAt).toLocaleDateString()}
      </span>

      <div className="relative h-96 my-8">
        <Image
          // src={blogs[0].imageUrl}
          src={`https://picsum.photos/200`}
          alt={post.title}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: parsedContent.html }}
      />

      <h2 className="text-2xl font-bold mt-12 mb-6">Check more posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((relatedPost) => (
          <BlogCard
            key={relatedPost.id}
            id={relatedPost.id}
            title={relatedPost.title}
            excerpt={
              JSON.parse(relatedPost.content).html.substring(0, 100) + "..."
            }
            date={new Date(relatedPost.createdAt).toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
}
