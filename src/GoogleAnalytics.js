// GoogleAnalytics.js
import ReactGA from 'react-ga';

const trackingId = 'G-YJ9C2P37P6';

// Initialize Google Analytics
ReactGA.initialize(trackingId);

// Log a page view with React Router
const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export default logPageView;
