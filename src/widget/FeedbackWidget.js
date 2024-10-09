import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';

const firebaseConfig = {
  // Add your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function FeedbackWidget({ userId }) {
  const [config, setConfig] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, 'widget_configs', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      }
    };

    fetchConfig();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'feedback'), {
      userId,
      feedback,
      timestamp: new Date(),
    });
    setSubmitted(true);setSubmitted(true);
    setFeedback('');
  };

  if (!config) return null;

  const widgetStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: config.primaryColor,
    color: config.secondaryColor,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={widgetStyle}>
      <h3>{config.title || 'Feedback'}</h3>
      {submitted ? (
        <p>Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback..."
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit" style={{ backgroundColor: config.secondaryColor, color: config.primaryColor }}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default FeedbackWidget;