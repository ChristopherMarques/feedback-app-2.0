"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FeedbackItem {
  id: string;
  [key: string]: any;
}

export default function Dashboard() {
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "feedback"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as FeedbackItem)
        );
        setFeedbackData(data);
      }
    };

    fetchFeedback();
  }, []);

  const chartData = [
    {
      name: "Positive",
      value: feedbackData.filter((f) => f.sentiment === "positive").length,
    },
    {
      name: "Neutral",
      value: feedbackData.filter((f) => f.sentiment === "neutral").length,
    },
    {
      name: "Negative",
      value: feedbackData.filter((f) => f.sentiment === "negative").length,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{feedbackData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Positive Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              {feedbackData.filter((f) => f.sentiment === "positive").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Negative Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">
              {feedbackData.filter((f) => f.sentiment === "negative").length}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
