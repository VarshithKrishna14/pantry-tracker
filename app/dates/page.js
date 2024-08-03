'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Box, Typography, Stack } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const DatesRemaining = () => {
  const [inventory, setInventory] = useState([]);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

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
    const inventoryList = docs.docs.map(doc => ({ name: doc.id, ...doc.data() }));
    setInventory(inventoryList);
  };

  if (!isSignedIn) {
    return null; // Or show a loading spinner, etc.
  }

  return (
    <Box marginLeft={2} padding={4} sx={{ bgcolor: '#000', color: '#fff', height: '100vh'}}>
      <Typography variant="h4" gutterBottom>
        Expiry Date Check
      </Typography>
      <Stack spacing={2}>
        {inventory.map(({ name, expiryDate }) => {
          const daysRemaining = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          const color = daysRemaining < 5 ? '#e53935' : '#4caf50';
          return (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              bgcolor={color}
              padding={2}
              borderRadius={1}
              color="#fff"
              width="550px"
            >
              <Typography>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography>{daysRemaining} days remaining</Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DatesRemaining;
