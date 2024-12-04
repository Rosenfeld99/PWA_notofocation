const express = require("express");
const webPush = require("web-push");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Generate VAPID keys (do this once)
// const vapidKeys = webPush.generateVAPIDKeys();
const publicVapidKey =
  "BKA6Q2o4p4lRWbtXee1_mVN_UtzEBRMprxzvW34dynj-j_WoFwKTMhffYrp3m1b4mqWQUX6gjCWjHC3D5poppv8";
const privateVapidKey = "qJQDN8bdgBvtf92B51_C440REIPoS3WuTYxvy_R_cBY";

webPush.setVapidDetails(
  "mailto:eliyahumeir12@gmail.com",
  publicVapidKey,
  privateVapidKey
);

const subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription saved" });
});

app.post("/notify", async (req, res) => {
  const { title, body } = req.body;

  const payload = JSON.stringify({ title, body });

  try {
    await Promise.all(
      subscriptions.map((sub) => webPush.sendNotification(sub, payload))
    );
    res.status(200).json({ message: "Notifications sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

app.listen(4000, () => console.log("Push server running"));

// const express = require('express');
// const bodyParser = require('body-parser');
// const webPush = require('web-push');
// const cors = require('cors');

// const app = express();
// const PORT = 4000;

// // Replace these with your generated keys
// const publicVapidKey = 'BKA6Q2o4p4lRWbtXee1_mVN_UtzEBRMprxzvW34dynj-j_WoFwKTMhffYrp3m1b4mqWQUX6gjCWjHC3D5poppv8';
// const privateVapidKey = 'qJQDN8bdgBvtf92B51_C440REIPoS3WuTYxvy_R_cBY';

// // Set VAPID details
// webPush.setVapidDetails(
//   'mailto:your-email@example.com',
//   publicVapidKey,
//   privateVapidKey
// );

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Store subscriptions in memory for testing
// const subscriptions = [];

// // Route to save a subscription
// app.post('/subscribe', (req, res) => {
//   const subscription = req.body;
//   subscriptions.push(subscription);
//   res.status(201).json({ message: 'Subscription saved!' });
// });

// // Route to trigger a notification
// app.post('/notify', async (req, res) => {

//     const { title, body } = req.body; // Extract title and body from the request
//     console.log(title, body);

//     if (!title || !body) {
//       return res.status(400).json({ message: 'Title and body are required' });
//     }

//     const payload = JSON.stringify({ title, body });

//     const promises = subscriptions.map((subscription) =>
//       webPush.sendNotification(subscription, payload).catch((err) => console.error(err))
//     );

//     await Promise.all(promises);

//     res.status(200).json({ message: 'Notifications sent successfully server!' });
//   });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Push notification server running on http://localhost:${PORT}`);
// });
