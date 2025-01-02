"use client";

import React, { useState, useEffect } from 'react';
import './Penguin.css';

const Penguin: React.FC = () => {
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const penguin = document.getElementById('penguin');
    const card = document.getElementById('card');
    if (penguin && card) {
      const cardRect = card.getBoundingClientRect();
      const initialPosition = {
        x: cardRect.width - penguin.clientWidth,
        y: cardRect.height - penguin.clientHeight,
      };
      penguin.style.left = `${initialPosition.x}px`;
      penguin.style.top = `${initialPosition.y}px`;
      setLastPosition(initialPosition);
    }
  }, []);

  const movePenguin = () => {
    if (isMoving) return;

    const penguin = document.getElementById('penguin');
    const card = document.getElementById('card');
    if (penguin && card) {
      setIsMoving(true);

      const cardRect = card.getBoundingClientRect();
      const positions = [
        // Right edge (excluding corners)
        ...Array.from({ length: cardRect.height - penguin.clientHeight }, (_, i) => ({
          x: cardRect.width - penguin.clientWidth,
          y: i,
        })),
        // Bottom edge (excluding corners)
        ...Array.from({ length: cardRect.width - penguin.clientWidth }, (_, i) => ({
          x: i,
          y: cardRect.height - penguin.clientHeight,
        })),
      ];

      // Filter out the last position
      const filteredPositions = positions.filter(
        (pos) => !lastPosition || pos.x !== lastPosition.x || pos.y !== lastPosition.y
      );

      // If there's only one position left after filtering, use it
      const randomPosition = filteredPositions.length > 1
        ? filteredPositions[Math.floor(Math.random() * filteredPositions.length)]
        : filteredPositions[0];

      // Move penguin off the screen
      if (lastPosition?.x === cardRect.width - penguin.clientWidth) {
        penguin.style.transition = 'left 2s';
        penguin.style.left = `${cardRect.right}px`;
      } else {
        penguin.style.transition = 'top 2s';
        penguin.style.top = `${cardRect.bottom}px`;
      }

      setTimeout(() => {
        // Move penguin to the new position
        penguin.style.transition = 'none';
        if (randomPosition.x === cardRect.width - penguin.clientWidth) {
          penguin.style.left = `${cardRect.right}px`;
          penguin.style.top = `${randomPosition.y}px`;
        } else {
          penguin.style.left = `${randomPosition.x}px`;
          penguin.style.top = `${cardRect.bottom}px`;
        }

        setTimeout(() => {
          penguin.style.transition = 'left 2s, top 2s';
          if (randomPosition.x === cardRect.width - penguin.clientWidth) {
            penguin.style.left = `${randomPosition.x}px`;
          } else {
            penguin.style.top = `${randomPosition.y}px`;
          }

          // Rotate the penguin if it's on the right edge
          if (randomPosition.x === cardRect.width - penguin.clientWidth) {
            penguin.style.transform = 'rotate(270deg)';
          } else {
            penguin.style.transform = 'rotate(0deg)';
          }

          // Update the last position
          setLastPosition(randomPosition);

          setTimeout(() => {
            setIsMoving(false);
          }, 2000);
        }, 100);
      }, 2000);
    }
  };

  return (
    <img
      id="penguin"
      src="/penguin.png"
      alt="Penguin"
      className="absolute cursor-pointer w-40 h-40"
      onClick={movePenguin}
      style={{ position: 'absolute' }}
    />
  );
};

export default Penguin;