// app/inventory/page.js
'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Typography, Stack, TextField } from '@mui/material';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default function Inventory() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in'); // Redirect to sign-in if not authenticated
    } else {
      updateInventory();
    }
  }, [isSignedIn, router]);

  const updateInventory = async () => {
    if (!user) return;

    const userId = user.id;
    const snapshot = query(collection(firestore, `users/${userId}/inventory`));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  if (!isSignedIn) {
    return null; // Or show a loading spinner, etc.
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url(/pantry-bg.jpg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
        color: "#fff", // White text
        overflow: "hidden",
        p: 2,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Your Inventory
      </Typography>
      <Box
        sx={{
          width: "90%",
          maxWidth: 800,
          bgcolor: "#222", // Dark background for inventory box
          border: "1px solid #555",
          p: 2,
          borderRadius: 1,
          overflow: "auto",
        }}
      >
        <Typography variant="h2" textAlign="center" sx={{ color: "#ddd", mb: 2 }}>
          Inventory Items
        </Typography>
        <Stack spacing={2}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#333", // Darker background for items
                p: 2,
                borderRadius: 1,
                border: "1px solid #555",
              }}
            >
              <Typography variant="h5" sx={{ color: "#fff" }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h5" sx={{ color: "#fff" }}>
                {quantity}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
