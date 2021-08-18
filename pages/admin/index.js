import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/dist/client/router";

import AuthCheck from "../../components/AuthCheck";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import PostFeed from "../../components/PostFeed";
import { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import toast from "react-hot-toast";

const Admin = () => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};

const PostList = () => {
  const ref = firestore.collection("users").doc(auth.currentUser.uid).collection("posts");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map(doc => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};

const CreateNewPost = () => {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async event => {
    event.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore.collection("users").doc(uid).collection("posts").doc(slug);
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# Jelou World",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);
    toast.success("Post created!");
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={event => setTitle(event.target.value)}
        placeholder='My Awesome Article!'
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create New Post
      </button>
    </form>
  );
};

export default Admin;
