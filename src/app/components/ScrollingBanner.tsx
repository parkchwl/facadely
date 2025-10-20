import React from 'react';

// Static data - moved outside component to prevent re-generation on every render
const BANNER_TEXT = "✦  facadely  ✦  bloom your dream  ✦  website builder";
const REPEATED_BANNER_TEXT = Array(10).fill(BANNER_TEXT).join(' ');

const ScrollingBanner = React.memo(() => {
  return (
    <div className="banner">
      <div className="marquee">
        <span>{REPEATED_BANNER_TEXT}</span>
        <span>{REPEATED_BANNER_TEXT}</span>
      </div>
    </div>
  );
});

ScrollingBanner.displayName = 'ScrollingBanner';

export default ScrollingBanner;
