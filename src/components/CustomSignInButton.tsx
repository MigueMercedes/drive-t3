'use client'

import { useSignIn } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function CustomSignInButton() {
  const { signIn, isLoaded } = useSignIn();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    
    try {
      const result = await signIn.create({
        strategy: "oauth_google",
        redirectUrl: "/drive",
      });
      
      // Puedes agregar tu lógica personalizada aquí
      console.log("Sign in successful", result);
      
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleSignIn}
      className="border border-neutral-700 bg-neutral-800 text-white transition-colors hover:bg-neutral-700"
    >
      Get Started
    </Button>
  );
}
