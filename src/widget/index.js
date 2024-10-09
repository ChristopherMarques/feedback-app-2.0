import React from 'react';
import ReactDOM from 'react-dom';
import FeedbackWidget from './FeedbackWidget';

const widgetContainer = document.getElementById('feedback-widget');
const userId = widgetContainer.getAttribute('data-user-id');

ReactDOM.render(
  <React.StrictMode>
    <FeedbackWidget userId={userId} />
  </React.StrictMode>,
  widgetContainer
);