import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
  },
};

const Loading = ({ text = 'Loading', speed = 300 }) => {
  const [content, setContent] = useState(text);

  useEffect(() => {
    //every 300ms either add a dot or reset to 'Loading'
    const intervalId = setInterval(() => {
      content === text + '...'
        ? setContent(text)
        : setContent((content) => content + '.');
    }, speed);

    // Clear the interval timer when the component is unmounted
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <p style={styles.content}>{content}</p>;
};

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
};

export default Loading;
