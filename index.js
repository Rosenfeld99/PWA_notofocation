const express = require('express');
const webPush = require('web-push');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'https://your-frontend-url.netlify.app' }));
app.use(express.json());

// VAPID Keys
const publicVapidKey = 'BKA6Q2o4p4lRWbtXee1_mVN_UtzEBRMprxzvW34dynj-j_WoFwKTMhffYrp3m1b4mqWQUX6gjCWjHC3D5poppv8';
const privateVapidKey = 'qJQDN8bdgBvtf92B51_C440REIPoS3WuTYxvy_R_cBY';

webPush.setVapidDetails('mailto:eliyahumeir12@gmail.com', publicVapidKey, privateVapidKey);

const subscriptions = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription saved' });
});

app.post('/notify', async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  const payload = JSON.stringify({ title, body });

  try {
    await Promise.all(
      subscriptions.map((sub) => webPush.sendNotification(sub, payload).catch((error) => {
        console.error('Notification error:', error);
      }))
    );
    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

app.listen(4000, () => console.log('Push server running on port 4000'));
