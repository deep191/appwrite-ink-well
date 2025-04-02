
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import BlogPost from '@/components/BlogPost';

const Post = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BlogPost />
      </main>
      
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} InkWell. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Post;
