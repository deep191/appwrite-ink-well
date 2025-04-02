
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { getPost, getFilePreview, getCurrentUser } from '@/lib/appwrite';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const postData = await getPost(id);
        setPost(postData);
        
        // Check if the current user is the author
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Get author initials for avatar
  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-[300px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Button
          variant="default"
          className="mt-4"
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <article className="animate-fade-in">
        <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">{post.title}</h1>
        
        <div className="flex items-center space-x-4 mb-8">
          <Avatar className="h-10 w-10 bg-primary text-white">
            <AvatarFallback>{getAuthorInitials(post.authorName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post.authorName}</div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(post.$createdAt)}</span>
            </div>
          </div>
        </div>
        
        {post.imageId && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={getFilePreview(post.imageId).toString()}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div className="blog-content prose prose-slate max-w-none">
          {post.content.split('\n').map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {currentUser && currentUser.$id === post.authorId && (
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">Author Actions</h3>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate(`/edit/${post.$id}`)}>
                Edit Post
              </Button>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
