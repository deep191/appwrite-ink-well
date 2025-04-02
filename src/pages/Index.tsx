
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PenLine, Filter } from 'lucide-react';
import { getPosts, getCurrentUser } from '@/lib/supabase';
import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get posts
        const postsData = await getPosts(12);
        setPosts(postsData);
        
        // Check if user is logged in
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="bg-accent py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Welcome to InkWell
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              A place to share your thoughts, ideas, and stories with the world.
            </p>
            {user && (
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link to="/create">
                  <PenLine className="mr-2 h-4 w-4" />
                  Write New Post
                </Link>
              </Button>
            )}
          </div>
        </section>
        
        {/* Blog posts grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-serif font-bold text-3xl">Latest Posts</h2>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.$id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your thoughts with the world!
                </p>
                {user && (
                  <Button asChild>
                    <Link to="/create">
                      <PenLine className="mr-2 h-4 w-4" />
                      Write New Post
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} InkWell. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
