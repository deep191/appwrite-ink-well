
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, CheckCircle } from 'lucide-react';

const AppwriteSetup = () => {
  const [projectId, setProjectId] = useState('');
  const [configured, setConfigured] = useState(false);
  
  const handleSave = () => {
    if (!projectId) return;
    
    // In a real application, you would save this to localStorage or similar
    localStorage.setItem('VITE_APPWRITE_PROJECT_ID', projectId);
    setConfigured(true);
    
    // Reload the page to apply the new project ID
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Appwrite Setup</CardTitle>
          <CardDescription>
            Configure your Appwrite project to connect to this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Important Setup Steps</AlertTitle>
            <AlertDescription className="mt-2">
              <ol className="list-decimal pl-4 space-y-2">
                <li>Create an Appwrite account at <a href="https://appwrite.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">appwrite.io</a></li>
                <li>Create a new project in Appwrite Console</li>
                <li>Create a database named <code className="bg-muted px-1 rounded">blog-database</code></li>
                <li>Create two collections: <code className="bg-muted px-1 rounded">posts</code> and <code className="bg-muted px-1 rounded">users</code></li>
                <li>Create a storage bucket named <code className="bg-muted px-1 rounded">blog-images</code></li>
                <li>Copy your project ID from the Appwrite console</li>
                <li>Enter it below to connect this app to your Appwrite project</li>
              </ol>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="project-id">Appwrite Project ID</Label>
            <Input 
              id="project-id" 
              value={projectId} 
              onChange={(e) => setProjectId(e.target.value)} 
              placeholder="Enter your Appwrite Project ID"
            />
          </div>
          
          {configured && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded">
              <CheckCircle className="h-4 w-4" />
              <span>Appwrite configured successfully! Reloading page...</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={!projectId || configured}
          >
            {configured ? 'Configured' : 'Save Configuration'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppwriteSetup;
