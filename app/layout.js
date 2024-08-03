// app/layout.js
'use client';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import './globals.css'; // Adjust the path if needed

export default function RootLayout({ children }) {
  const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <ClerkProvider frontendApi={clerkFrontendApi}>
          <SignedIn>
            {children}
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}
