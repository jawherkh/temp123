'use client';

import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { Sun, Moon, Home, Shield, BookOpen, Info, Settings, User, Calendar, Droplets, Umbrella } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <Sidebar variant="floating" collapsible="icon" className="border-r border-border/40 bg-background/80 backdrop-blur-md">
        <SidebarHeader className="flex items-center p-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Sun className="h-6 w-6 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground/70">SunWise</span>
            <Badge variant="outline" className="ml-2 bg-secondary/10 text-xs">Beta</Badge>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/" className={cn("transition-all duration-200 hover:bg-accent/10", window.location.pathname === '/' && 'bg-accent/20 text-accent-foreground font-medium')} data-active={window.location.pathname === '/'}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="transition-all duration-200 hover:bg-accent/10">
                <Shield className="mr-2 h-4 w-4" />
                <span>Protection Tips</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="transition-all duration-200 hover:bg-accent/10">
                <Droplets className="mr-2 h-4 w-4" />
                <span>Skin Types</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="transition-all duration-200 hover:bg-accent/10">
                <Umbrella className="mr-2 h-4 w-4" />
                <span>UV Index</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="transition-all duration-200 hover:bg-accent/10">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Education</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="transition-all duration-200 hover:bg-accent/10">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Reminders</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="transition-all duration-200 hover:bg-accent/10">
                <Info className="mr-2 h-4 w-4" />
                <span>About</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-border/20">
          <div className="flex flex-col gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="justify-start transition-all hover:bg-primary/10" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="justify-start transition-all hover:bg-primary/10">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Button>
            <Button variant="ghost" size="sm" className="justify-start transition-all hover:bg-primary/10">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
  );
}