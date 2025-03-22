
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            GotraBandhus
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Connect with your roots, build your family legacy
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold">Discover Your Family History</h2>
            <p className="text-muted-foreground text-lg">
              GotraBandhus helps you build, visualize, and share your family tree. 
              Create connections across generations and preserve your family's unique story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Sign In</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-lg overflow-hidden flex items-center justify-center relative group">
            <div className="p-8 text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="120" 
                height="120" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mx-auto mb-4 text-primary"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h3 className="text-xl font-medium mb-2">Family Tree Visualization</h3>
              <p className="text-muted-foreground">
                Explore your family connections with interactive visualizations
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Build Your Tree",
    description: "Add family members and define relationships to create your complete family tree.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M12 3v12"></path><path d="M6 15h12"></path>
      </svg>
    ),
  },
  {
    title: "Connect Families",
    description: "Link with existing family trees to discover extended relationships.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M8 12h8"></path><path d="M12 8v8"></path><circle cx="12" cy="12" r="10"></circle>
      </svg>
    ),
  },
  {
    title: "Privacy Controls",
    description: "Manage who can see and contribute to your family history with granular permissions.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
  },
];

export default Index;
