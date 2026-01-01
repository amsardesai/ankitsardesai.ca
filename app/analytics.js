import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';

export default Analytics({
  app: 'ankitsardesai-website',
  plugins: [googleAnalytics({ measurementIds: ['G-W6274EBZDE'] })],
});
