import styles from '../../styles/Post.module.css';
import Link from 'next/link';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';
import { UserContext } from '../../lib/context';
import { firestore, getUserFromUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';

// For SSR
export async function getStaticProps({params}){
  const {username, slug} = params;
  const userDoc = await getUserFromUsername(username);

  let post;
  let path;

  if(userDoc){
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());
    path = postRef.path;
  }

  return {
    props: {post, path},
    revalidate: 5000 // Regenerate this page when new request come in every 5000ms
  }
}

// To tell Next which posts to SSR
export async function getStaticPaths(){
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}
