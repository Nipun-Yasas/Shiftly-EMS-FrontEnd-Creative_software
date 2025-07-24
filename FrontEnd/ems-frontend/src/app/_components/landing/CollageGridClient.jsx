'use client';
import React, { useEffect, useState } from 'react';
import CollagePhoto from './CollagePhoto';
import { PHOTO_WIDTH, PHOTO_HEIGHT, MAX_PHOTOS } from '../../_utils/constants';
import { useWindowSize } from '../../_hooks/useWindowSize';

export default function CollageGridClient() {
  const { width, height } = useWindowSize();
  const cols = Math.ceil(width / PHOTO_WIDTH);
  const rows = Math.ceil(height / PHOTO_HEIGHT);
  const numPhotos = Math.min(rows * cols, MAX_PHOTOS);

  const [collagePhotos, setCollagePhotos] = useState([]);

  useEffect(() => {
    const indices = Array.from({ length: numPhotos }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const photos = [];
    for (let i = 0; i < numPhotos; i++) {
      const shuffledIndex = indices[i];
      const row = Math.floor(shuffledIndex / cols);
      const col = shuffledIndex % cols;
      const rotate = Math.floor(Math.random() * 10) - 5;
      const delay = (i % 10) * 0.1;
      photos.push(
        <CollagePhoto
          key={shuffledIndex}
          index={shuffledIndex}
          row={row}
          col={col}
          photoWidth={PHOTO_WIDTH}
          photoHeight={PHOTO_HEIGHT}
          rotate={rotate}
          delay={delay}
        />
      );
    }
    setCollagePhotos(photos);
  }, [cols, rows, numPhotos]);

  return <>{collagePhotos}</>;
} 