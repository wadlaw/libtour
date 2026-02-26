"use client";
import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";

// 1. Define the TypeScript Interface for the Context
interface PodcastLinkContextType {
  podcastLink: string;
  updatePodcastLink: (newLink: string) => void;
  podcastIsLoaded: boolean;
}

// 2. Define the Default Context Value
// This is used if a component tries to consume the context outside a Provider.
const defaultContextValue: PodcastLinkContextType = {
  podcastLink: "", // Default value is an empty string
  updatePodcastLink: () => {
    // Optional: Log an error if used outside a provider
    console.warn("updatePodcastLink was called without a provider");
  },
  podcastIsLoaded: false,
};

// Create the Context with the defined type and default value
const PodcastLinkContext =
  createContext<PodcastLinkContextType>(defaultContextValue);

// Define the Props for the Provider
interface PodcastLinkProviderProps {
  children: ReactNode;
}

// 3. Create the Provider Component
export function PodcastLinkProvider({ children }: PodcastLinkProviderProps) {
  const [podcastLink, setPodcastLink] = useState<string>("");

  // Function to update the state
  const updatePodcastLink = (newLink: string) => {
    setPodcastLink(newLink);
  };

  const podcastIsLoaded = podcastLink !== "";

  // The value object to be passed to consumers
  const contextValue: PodcastLinkContextType = {
    podcastLink,
    updatePodcastLink,
    podcastIsLoaded,
  };

  return (
    <PodcastLinkContext.Provider value={contextValue}>
      {children}
    </PodcastLinkContext.Provider>
  );
}

// 4. Custom Hook to use the context easily
export function usePodcastLink() {
  return useContext(PodcastLinkContext);
}
