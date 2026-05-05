import { Outlet, Navigate, useLocation } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { useUser } from "@/lib/user-context";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-transparent text-foreground">
      
      <SiteNav />
      
      <div className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="w-full py-6 mt-12 border-t border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md relative z-20 flex justify-center items-center">
        <p className="text-sm text-muted-foreground mono-font tracking-wide">
          made by : <span className="text-white font-medium">yashraj</span> and <span className="text-white font-medium">antigravity</span> respectively
        </p>
      </footer>
    </div>
  );
};
