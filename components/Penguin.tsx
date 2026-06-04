"use client";

import React, { useState, useEffect, useRef } from 'react';
import './Penguin.css';
import Image from 'next/image';
import { incrementPenguinCount, getPenguinCount } from '@/server/actions';

type Popup = { id: number; value: number; x: number; y: number; drift: number };

const Penguin: React.FC = () => {
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  const popupIdRef = useRef(0);
  const localCountRef = useRef<number | null>(null);

  useEffect(() => {
    const penguin = document.getElementById('penguin');
    if (penguin) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const initialPosition = {
        x: windowWidth - penguin.clientWidth,
        y: windowHeight - penguin.clientHeight,
      };
      penguin.style.left = `${initialPosition.x}px`;
      penguin.style.top = `${initialPosition.y}px`;
      setLastPosition(initialPosition);
    }
    getPenguinCount().then((count) => {
      localCountRef.current = count;
    });
  }, []);

  const movePenguin = () => {
    if (isMoving) return;

    const penguin = document.getElementById('penguin');
    if (penguin) {
      setIsMoving(true);

      const rect = penguin.getBoundingClientRect();
      const offsetX = (Math.random() - 0.5) * 60;
      const spawnX = rect.left + rect.width / 2 + offsetX;
      const spawnY = rect.top + rect.height / 3;

      const drift = Math.random() * 2 - 1;

      if (localCountRef.current !== null) {
        localCountRef.current += 1;
        const optimisticCount = localCountRef.current;
        const id = ++popupIdRef.current;
        setPopups((prev) => [...prev, { id, value: optimisticCount, x: spawnX, y: spawnY, drift }]);
        setTimeout(() => {
          setPopups((prev) => prev.filter((p) => p.id !== id));
        }, 1500);
        incrementPenguinCount();
      } else {
        incrementPenguinCount()
          .then((newCount) => {
            localCountRef.current = newCount;
            const id = ++popupIdRef.current;
            setPopups((prev) => [...prev, { id, value: newCount, x: spawnX, y: spawnY, drift }]);
            setTimeout(() => {
              setPopups((prev) => prev.filter((p) => p.id !== id));
            }, 1500);
          })
          .catch(() => {});
      }

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const positions = [
        // Right edge (excluding corners)
        ...Array.from({ length: windowHeight - penguin.clientHeight }, (_, i) => ({
          x: windowWidth - penguin.clientWidth,
          y: i,
        })),
        // Bottom edge (excluding corners)
        ...Array.from({ length: windowWidth - penguin.clientWidth }, (_, i) => ({
          x: i,
          y: windowHeight - penguin.clientHeight,
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
      if (lastPosition?.x === windowWidth - penguin.clientWidth) {
        penguin.style.transition = 'left 2s';
        penguin.style.left = `${windowWidth}px`;
      } else {
        penguin.style.transition = 'top 2s';
        penguin.style.top = `${windowHeight}px`;
      }

      setTimeout(() => {
        // Move penguin to the new position
        penguin.style.transition = 'none';
        if (randomPosition.x === windowWidth - penguin.clientWidth) {
          penguin.style.left = `${windowWidth}px`;
          penguin.style.top = `${randomPosition.y}px`;
        } else {
          penguin.style.left = `${randomPosition.x}px`;
          penguin.style.top = `${windowHeight}px`;
        }

        setTimeout(() => {
          penguin.style.transition = 'left 2s, top 2s';
          if (randomPosition.x === windowWidth - penguin.clientWidth) {
            penguin.style.left = `${randomPosition.x}px`;
          } else {
            penguin.style.top = `${randomPosition.y}px`;
          }

          // Rotate the penguin if it's on the right edge
          if (randomPosition.x === windowWidth - penguin.clientWidth) {
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
    <>
      <Image
        id="penguin"
        src="/penguin.png"
        alt="Penguin"
        className="cursor-pointer"
        onClick={movePenguin}
        style={{ position: 'fixed', zIndex: 999 }}
        width={160}
        height={160}
      />
      {popups.map((p) => (
        <span
          key={p.id}
          className="penguin-popup"
          style={{ left: p.x, top: p.y, ['--drift' as string]: p.drift }}
        >
          {p.value}
        </span>
      ))}
    </>
  );
};

export default Penguin;