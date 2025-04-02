
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenLine, User } from 'lucide-react';
import { getCurrentUser, getUserProfile, getPosts } from '@/lib/supabase';
import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          // Redirect to home if not logged in
          navigate('/');
          return;
        }
        
        setUser(currentUser);
        
        // Get user profile
        const userProfile = await getUserProfile(currentUser.id);
        setProfile(userProfile);
        
        // Set form values
        setName(userProfile?.name || currentUser.user_metadata?.name || '');
        setBio(userProfile?.bio || '');
        
        // Get user's posts
        const posts = await getPosts();
        const filteredPosts = posts.filter(
          (post: any) => post.author_id === currentUser.id
        );
        setUserPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Failed to load profile",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would update the user profile in a real app
    toast({
      title: "Profile updated successfully",
      duration: 3000,
    });
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-10 w-full bg-gray-200 rounded"></div>
                <div className="h-32 w-full bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <Button onClick={() => navigate('/')}>Go to Homepage</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Avatar className="h-20 w-20 bg-primary text-white">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-serif font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <Tabs defaultValue="posts" className="mb-12">
            <TabsList className="mb-8">
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="profile">Edit Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-serif font-semibold">Your Posts</h2>
                <Button onClick={() => navigate('/create')}>
                  <PenLine className="mr-2 h-4 w-4" />
                  Write New Post
                </Button>
              </div>
              
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userPosts.map((post) => (
                    <BlogCard key={post.$id} post={post} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't written any posts yet. Start sharing your thoughts with the world!
                    </p>
                    <Button onClick={() => navigate('/create')}>
                      <PenLine className="mr-2 h-4 w-4" />
                      Write Your First Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
