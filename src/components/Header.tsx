
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenLine, User, LogIn, PlusCircle } from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/supabase';
import AuthModal from './AuthModal';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast({
        title: "Logged out successfully",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error logging out",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <PenLine className="h-6 w-6 text-primary" />
          <span className="font-serif font-bold text-2xl">InkWell</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Featured
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Categories
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link to="/create">
                <Button variant="outline" size="sm" className="hidden md:flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hidden md:flex"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={(user) => {
          setUser(user);
          setAuthModalOpen(false);
        }}
      />
    </header>
  );
};

export default Header;
