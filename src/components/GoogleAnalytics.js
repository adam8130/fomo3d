import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_TRACKING_ID}`;
    document.head.appendChild(script1);

    script1.onload = () => {
      console.log('gtag script loaded');
      console.log(process.env.REACT_APP_GA_TRACKING_ID);
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      gtag('js', new Date());
      gtag('config', process.env.REACT_APP_GA_TRACKING_ID, { page_path: window.location.pathname });
      gtag('config', process.env.REACT_APP_GA_WORDS_ID);
    };

    return () => {
      document.head.removeChild(script1);
    };
  }, []);

  return null;
};

export default GoogleAnalytics;
