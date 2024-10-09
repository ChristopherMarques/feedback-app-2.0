"use client"

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const plans = [
  { id: 'basic', name: 'Basic', price: 9.99, features: ['100 feedbacks/month', 'Basic analytics', 'Email support'] },
  { id: 'pro', name: 'Pro', price: 29.99, features: ['1000 feedbacks/month', 'Advanced analytics', 'Priority support'] },
  { id: 'enterprise', name: 'Enterprise', price: 99.99, features: ['Unlimited feedbacks', 'Custom analytics', '24/7 support'] },
];

export default function ManagePlan() {
  const [currentPlan, setCurrentPlan] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'user_plans', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentPlan(docSnap.data().planId);
        }
      }
    };

    fetchCurrentPlan();
  }, []);

  const handleUpgrade = async (planId) => {
    if (auth.currentUser) {
      await setDoc(doc(db, 'user_plans', auth.currentUser.uid), { planId });
      setCurrentPlan(planId);
      toast({
        title: "Success",
        description: `You've successfully upgraded to the ${planId} plan.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Plan</h1>
      <p>Current Plan: <span className="font-semibold">{currentPlan || 'No plan selected'}</span></p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">${plan.price}/month</p>
              <ul className="list-disc list-inside mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}