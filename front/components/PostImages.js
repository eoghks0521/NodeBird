import React, { useState, useCallback } from 'react';
import { Icon } from 'antd';
import Proptypes from 'prop-types';
import ImagesZoom from './imagesZoom';

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img src={`http://localhost:3065/${images[0].src}`} onClick={onZoom} alt="이미지" />
        { showImagesZoom && <ImagesZoom images={images} onClose={onClose} /> }
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <div>
          <img src={`http://localhost:3065/${images[0]}.src}`} onClick={onZoom} width="50%" />
          <img src={`http://localhost:3065/${images[1]}.src}`} onClick={onZoom} width="50%" />
        </div>
        { showImagesZoom && <ImagesZoom images={images} onClose={onClose} /> }
      </>
    );
  }
  return (
    <>
      <div>
        <img src={`http://localhost:3065/${images[0].src}`} onClick={onZoom} width="50%" alt="이미지" />
        <div onClick={onZoom} style={{
          display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle',
        }}
        >
          <Icon type="plus" />
          <br />
          {images.length - 1}
          개의 사진 더 보기
        </div>
      </div>
      { showImagesZoom && <ImagesZoom images={images} onClose={onClose} /> }
    </>
  );
};

PostImages.propTypes = {
  images: Proptypes.arrayOf(Proptypes.shape({
    src: Proptypes.string,
  })).isRequired,
};

export default PostImages;
