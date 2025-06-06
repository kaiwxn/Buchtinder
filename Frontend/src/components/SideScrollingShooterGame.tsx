import React, { useState, useEffect, useRef, useCallback } from "react";

export interface SideScrollingShooterGameProps {
  onWin: () => void;
  onLose: () => void;
  onClose: () => void;
  avatarUrl?: string; // Falls vorhanden, wird der Spieler mit diesem Bild dargestellt.
}

const SideScrollingShooterGame: React.FC<SideScrollingShooterGameProps> = ({
  onWin,
  onLose,
  onClose,
  avatarUrl,
}) => {
  // Canvas-Größe und Spielkonstanten
  const canvasWidth = 600;
  const canvasHeight = 300;
  const playerX = 50;
  const playerWidth = 50;
  const playerHeight = 50;
  const moveSpeed = 10;
  const bulletSpeed = 10;
  const enemySpeed = 5;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerYRef = useRef<number>((canvasHeight - playerHeight) / 2);

  // Lade das Spielerbild: wenn avatarUrl übergeben wird, wird dieses verwendet
  const elephantImgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = avatarUrl
      ? avatarUrl
      : "https://www.benjaminbluemchen.de/sites/default/files/styles/character_keyvisual/public/character/benjamin_keyvisual.png?itok=Nk5LB2YM";
    elephantImgRef.current = img;
  }, [avatarUrl]);

  // Refs für Geschosse, Gegner und Sammelobjekte
  const bulletsRef = useRef<
    Array<{ x: number; y: number; width: number; height: number }>
  >([]);
  const enemiesRef = useRef<
    Array<{ x: number; y: number; width: number; height: number }>
  >([]);
  const collectiblesRef = useRef<
    Array<{ x: number; y: number; width: number; height: number }>
  >([]);

  // Spielstatus
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameOverRef = useRef<boolean>(false);

  // Zur kontinuierlichen Bewegung speichern wir gedrückte Pfeiltasten
  const keysRef = useRef<{ ArrowUp: boolean; ArrowDown: boolean }>({
    ArrowUp: false,
    ArrowDown: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keysRef.current[e.key] = true;
      } else if (e.key === "Space") {
        bulletsRef.current.push({
          x: playerX + playerWidth,
          y: playerYRef.current + playerHeight / 2 - 2,
          width: 10,
          height: 4,
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keysRef.current[e.key] = false;
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, playerX, playerWidth, playerHeight]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = "#cceeff"; 
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const playerY = playerYRef.current;
      if (elephantImgRef.current && elephantImgRef.current.complete) {
        ctx.drawImage(
          elephantImgRef.current,
          playerX,
          playerY,
          playerWidth,
          playerHeight
        );
      } else {
        ctx.fillStyle = "#A0522D";
        ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
      }

      ctx.fillStyle = "black";
      bulletsRef.current.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      ctx.fillStyle = "red";
      enemiesRef.current.forEach((enemy) => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });

      ctx.fillStyle = "blue";
      collectiblesRef.current.forEach((item) => {
        ctx.fillRect(item.x, item.y, item.width, item.height);
      });

      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`Punkte: ${score}`, 10, 25);
      ctx.fillText(`Leben: ${lives}`, 10, 50);
    },
    [score, lives]
  );

  const updateGame = useCallback(() => {
    if (keysRef.current.ArrowUp) {
      playerYRef.current = Math.max(0, playerYRef.current - moveSpeed);
    }
    if (keysRef.current.ArrowDown) {
      playerYRef.current = Math.min(
        canvasHeight - playerHeight,
        playerYRef.current + moveSpeed
      );
    }

    bulletsRef.current = bulletsRef.current
      .map((bullet) => ({ ...bullet, x: bullet.x + bulletSpeed }))
      .filter((bullet) => bullet.x < canvasWidth);

    enemiesRef.current = enemiesRef.current
      .map((enemy) => ({ ...enemy, x: enemy.x - enemySpeed }))
      .filter((enemy) => enemy.x + enemy.width > 0);

    collectiblesRef.current = collectiblesRef.current
      .map((item) => ({ ...item, x: item.x - enemySpeed }))
      .filter((item) => item.x + item.width > 0);

    bulletsRef.current.forEach((bullet, bIndex) => {
      enemiesRef.current.forEach((enemy, eIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          setScore((prev) => prev + 1);
          bulletsRef.current.splice(bIndex, 1);
          enemiesRef.current.splice(eIndex, 1);
        }
      });
    });

    enemiesRef.current.forEach((enemy, index) => {
      if (
        playerX < enemy.x + enemy.width &&
        playerX + playerWidth > enemy.x &&
        playerYRef.current < enemy.y + enemy.height &&
        playerYRef.current + playerHeight > enemy.y
      ) {
        setLives((prev) => prev - 1);
        enemiesRef.current.splice(index, 1);
      }
    });

    collectiblesRef.current.forEach((item, index) => {
      if (
        playerX < item.x + item.width &&
        playerX + playerWidth > item.x &&
        playerYRef.current < item.y + item.height &&
        playerYRef.current + playerHeight > item.y
      ) {
        setScore((prev) => prev + 2);
        collectiblesRef.current.splice(index, 1);
      }
    });

    if (Math.random() < 0.02) {
      enemiesRef.current.push({
        x: canvasWidth,
        y: Math.random() * (canvasHeight - 40),
        width: 40,
        height: 40,
      });
    }

    if (Math.random() < 0.01) {
      collectiblesRef.current.push({
        x: canvasWidth,
        y: Math.random() * (canvasHeight - 30),
        width: 30,
        height: 30,
      });
    }
  }, [
    canvasWidth,
    canvasHeight,
    playerWidth,
    playerHeight,
    bulletSpeed,
    enemySpeed,
    moveSpeed,
  ]);

  useEffect(() => {
    let animFrameId: number;
    const render = () => {
      if (lives <= 0) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = "black";
            ctx.font = "40px Arial";
            ctx.fillText("Game Over", canvasWidth / 2 - 100, canvasHeight / 2);
          }
        }
        gameOverRef.current = true;
        onLose();
        return;
      }
      if (score >= 10) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText("Glückwunsch!", canvasWidth / 2 - 100, canvasHeight / 2);
          }
        }
        setTimeout(() => {
          onWin();
          onClose();
        }, 2000);
        return;
      }
      updateGame();
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          draw(ctx);
        }
      }
      animFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animFrameId);
  }, [draw, updateGame, lives, score, onLose, onWin, onClose]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="bg-sky-100 rounded shadow-lg"
    />
  );
};

export default SideScrollingShooterGame;
