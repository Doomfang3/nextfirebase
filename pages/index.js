import toast from "react-hot-toast";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";
import { useState } from "react";

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [isLoading, setIsLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setIsLoading(true);
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === "number" ? fromMillis(last.createdAt) : last.createdAt;
    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);
    const newPosts = (await query.get()).docs.map(doc => doc.data());
    setPosts(posts.concat(newPosts));
    setIsLoading(false);
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />
      {!isLoading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
      <Loader show={isLoading} />
      {postsEnd && "You have reached the end!"}
    </main>
  );
}
