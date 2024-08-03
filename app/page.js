'use client';
import { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { firestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
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

  const addItem = async (name, isIncrement = false) => {
    const item = name || itemName.trim();
    if (!item) {
      alert('Item name cannot be empty');
      return;
    }

    const userId = user.id;
    const docRef = doc(collection(firestore, `users/${userId}/inventory`), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, expiryDate: expiryDate || docSnap.data().expiryDate }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: 1, expiryDate: expiryDate });
    }
    await updateInventory();
    setItemName('');
    setExpiryDate('');
    if (!isIncrement) {
      handleClose();
    }
  };

  const removeItem = async (item) => {
    const userId = user.id;
    const docRef = doc(collection(firestore, `users/${userId}/inventory`), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!isSignedIn) {
    return null; // Or show a loading spinner, etc.
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/pantry-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#fff', // White text
        overflow: 'hidden',
        p: 2,
      }}
    >
      <Box
      sx={{
        backgroundColor: '#333', 
        borderRadius: 5, // Rounded corners
        padding: 3, // Padding inside the box
        boxShadow: 3, // Shadow to add depth
        width: '80%', // Width of the box
        maxWidth: '800px', // Maximum width
        textAlign: 'center', // Center text
        color: '#fff', // Text color
        fontFamily: 'Roboto, sans-serif', 
        margin: '0 auto' 
      }}
    >
      <Typography variant="h2" gutterBottom>
        Welcome to the Pantry Mate
      </Typography>
    </Box>
      
      <div style={{ marginBottom: '20px', marginRight: '10px' ,marginTop:"5px"}}>
        <Link href={{ pathname: '/inventory' }} passHref>
          <Button variant="contained" color="primary" style={{ marginRight: '480px',color:"white" }}>
            YOUR INVENTORY
          </Button>
        </Link>

        <Link href="/dates" passHref>
          <Button variant="contained" color="primary" style={{color:"white"}}>
            VIEW PANTRY EXPIRY
          </Button>
        </Link>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: 100,
            width: 450,
            bgcolor: 'gray', // Dark background for modal
            border: '2px solid #fff',
            boxShadow: 24,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ input: { color: '#fff' }, label: { color: '#bbb' } }} // White input text, light label
            />
            <TextField
              variant="outlined"
              type="date"
              label="Expiry Date"
              value={expiryDate}
              width="100vw"
              onChange={(e) => setExpiryDate(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => addItem()}
              sx={{ bgcolor: '#007bff', '&:hover': { bgcolor: '#0056b3' } }} // Blue button with hover effect
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={() => handleOpen()}
        sx={{ mb: 2, bgcolor: '#007bff', '&:hover': { bgcolor: '#0056b3' } }} // Blue button with hover effect
      >
        ADD ITEM
      </Button>

      <Box
        sx={{
          width: '90%',
          maxWidth: 800,
          bgcolor: '#222', // Dark background for inventory box
          border: '1px solid #555',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
        }}
      >
        <Typography variant="h2" textAlign="center" sx={{ color: '#ddd', mb: 2 }}>
          Inventory Items
        </Typography>
        <Stack spacing={2}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#333', // Darker background for items
                p: 2,
                borderRadius: 1,
                border: '1px solid #555',
              }}
            >
              <Typography variant="h5" sx={{ color: '#fff' }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h5" sx={{ color: '#fff' }}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name, true)}
                  sx={{ bgcolor: '#28a745', '&:hover': { bgcolor: '#218838' } }} // Green button with hover effect
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{ bgcolor: '#dc3545', '&:hover': { bgcolor: '#c82333' } }} // Red button with hover effect
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
