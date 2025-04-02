
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    image_url?: string;
    author_name: string;
    created_at: string;
  };
}

const BlogCard = ({ post }: BlogCardProps) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Get a summary of the content (first 120 characters)
  const getSummary = (content: string) => {
    return content.length > 120 
      ? content.substring(0, 120) + '...' 
      : content;
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

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow animate-fade-in">
      <Link to={`/post/${post.id}`} className="flex-1 flex flex-col">
        {post.image_url && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <CardContent className="flex-1 flex flex-col p-6">
          <h3 className="text-xl font-serif font-bold mb-2">{post.title}</h3>
          <p className="text-muted-foreground text-sm flex-1">
            {getSummary(post.content)}
          </p>
        </CardContent>
        <CardFooter className="border-t p-6 pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-primary text-white">
                <AvatarFallback>{getAuthorInitials(post.author_name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{post.author_name}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default BlogCard;
