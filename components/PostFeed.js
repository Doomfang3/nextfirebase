import Link from "next/link";

const PostFeed = ({ posts, admin }) => {
  return posts ? posts.map(post => <PostItem post={post} key={post.slug} admin={admin} />) : null;
};

function PostItem({ post, admin = false }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className='card'>
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <strong>{post.title}</strong>
        </h2>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span>❤️ {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
}

export default PostFeed;
