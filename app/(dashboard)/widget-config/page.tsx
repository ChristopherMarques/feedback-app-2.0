"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function WidgetConfig() {
  const [config, setConfig] = useState({
    title: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "widget_configs", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setConfig({
            title: data.title || "",
            primaryColor: data.primaryColor || "",
            secondaryColor: data.secondaryColor || "",
          });
        }
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (auth.currentUser) {
      await setDoc(doc(db, "widget_configs", auth.currentUser.uid), config);
      toast({
        title: "Success",
        description: "Widget configuration saved successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Widget Configuration</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Widget Title</Label>
          <Input
            id="title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="primaryColor">Primary Color</Label>
          <Input
            id="primaryColor"
            type="color"
            value={config.primaryColor}
            onChange={(e) =>
              setConfig({ ...config, primaryColor: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <Input
            id="secondaryColor"
            type="color"
            value={config.secondaryColor}
            onChange={(e) =>
              setConfig({ ...config, secondaryColor: e.target.value })
            }
          />
        </div>
        <Button onClick={handleSave}>Save Configuration</Button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Embed Code</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
          {`<script src="https://your-domain.com/widget.js"></script>
<div id="feedback-widget" data-user-id="${auth.currentUser?.uid}"></div>`}
        </pre>
      </div>
    </div>
  );
}
