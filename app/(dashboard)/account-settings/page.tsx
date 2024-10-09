"use client"

import { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function AccountSettings() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        setDisplayName(auth.currentUser.displayName || '');
        setEmail(auth.currentUser.email || '');

        const docRef = doc(db, 'user_profiles', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompany(docSnap.data().company || '');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName });
        await setDoc(doc(db, 'user_profiles', auth.currentUser.uid), { company }, { merge: true });
        toast({
          title: "Success",
          description: "Account settings updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update account settings.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            disabled
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}