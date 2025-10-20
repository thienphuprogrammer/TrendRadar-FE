"use client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { FilterProvider } from "@/contexts/FilterContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import apolloClient from "@/apollo/client";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <FilterProvider>
              {children}
            </FilterProvider>
          </AuthProvider>
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </ApolloProvider>
  );
} 