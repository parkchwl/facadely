import React from 'react';

const ScrollingBanner = () => {
  const bannerText = "✷ facadely ✷ bloom your dream ✷ website builder";
  // A long string of repeated text to ensure the banner is always full
  const repeatedText = Array(10).fill(bannerText).join(' ');

  return (
    <div className="banner">
      <div className="marquee">
        <span>{repeatedText}</span>
        <span>{repeatedText}</span>
      </div>
    </div>
  );
};

export default ScrollingBanner;
