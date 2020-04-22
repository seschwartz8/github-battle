import React, { useState } from 'react';
// CUSTOM HOOK FOR HOVERING

const useHover = () => {
  const [hovering, setHovering] = useState(false);

  const onMouseOver = () => {
    setHovering(true);
  };

  const onMouseOut = () => {
    setHovering(false);
  };

  // Return array with hovering state and attributes
  return [hovering, { onMouseOver, onMouseOut }];
};

export default useHover;
