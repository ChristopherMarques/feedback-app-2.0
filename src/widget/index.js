import React from "react";
import { createRoot } from "react-dom/client";
import FeedbackWidget from "./FeedbackWidget";

const widgetContainer = document.getElementById("feedback-widget");
const userId = widgetContainer.getAttribute("data-user-id");

const root = createRoot(widgetContainer);
root.render(
  <React.StrictMode>
    <FeedbackWidget userId={userId} />
  </React.StrictMode>
);
