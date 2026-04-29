import {
  Outlet,
  createRootRoute,
  // useLocation,
  // useNavigate,
} from "@tanstack/react-router";
import { SidebarProvider, SidebarInset, Toaster } from "@org/ui";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
// import { useAuthStore } from "@/features/auth/context/auth-store";
// import { useCurrentUser } from "@/features/auth/hooks/use-auth";
// import { usePermissionSync } from "@/features/auth/hooks/use-permission-sync";
// import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

// const PUBLIC_ROUTES = ["/auth/login", "/auth/verify-email", "/auth/forgot-password", "/auth/reset-password", "/auth/resend-verification"];

function RootComponent() {
  // const accessToken = useAuthStore((s) => s.accessToken);
  // const { data: user, isLoading, isError } = useCurrentUser();
  // usePermissionSync();
  // const location = useLocation();
  // const navigate = useNavigate();
  // const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  // const isAuthenticated = !!accessToken && !!user;

  // const clearAuth = useAuthStore((s) => s.clearAuth);

  // useEffect(() => {
  //   if (!accessToken && !isPublicRoute) {
  //     navigate({ to: "/auth/login" });
  //   }
  //   if (isAuthenticated && isPublicRoute) {
  //     navigate({ to: "/" });
  //   }
  //   if (isError && !isPublicRoute) {
  //     clearAuth();
  //     navigate({ to: "/auth/login" });
  //   }
  // }, [accessToken, isAuthenticated, isPublicRoute, isError, navigate, clearAuth]);

  // // Public routes render without the sidebar/header layout
  // if (isPublicRoute) {
  //   return <Outlet />;
  // }

  // // Show nothing while loading user data
  // if (!accessToken || isLoading) {
  //   return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  // }

  // // If error fetching user, show nothing (redirect handles it)
  // if (isError || !user) {
  //   return null;
  // }

  return (
    <>
    <SidebarProvider>
      <AppSidebar variant="floating" />
      <SidebarInset className="h-svh overflow-auto">
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
    <Toaster position="top-right" />
    </>
  );
}
