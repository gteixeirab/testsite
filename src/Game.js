import React, { useEffect, useState } from "react";
import Peer from "peerjs";
import Player from "./Player";
import "./styles.css";

const Game = () => {
  const [myId, setMyId] = useState("");
  const [players, setPlayers] = useState({});
  const roomId = "sala-do-jogo"; // ID da sala (fixo para todos os jogadores)

  useEffect(() => {
    // Cria uma instância do Peer
    const peer = new Peer();

    peer.on("open", (id) => {
      setMyId(id); // Define o ID do jogador atual

      // Conecta à sala (room)
      const conn = peer.connect(roomId);
      conn.on("open", () => {
        // Envia a posição inicial do jogador
        conn.send({ x: 400, y: 300 }); // Posição inicial no centro da tela
      });

      conn.on("data", (data) => {
        // Atualiza as posições dos outros jogadores
        setPlayers((prev) => ({
          ...prev,
          [conn.peer]: data,
        }));
      });
    });

    // Recebe conexões de outros jogadores
    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        // Atualiza a posição do outro jogador
        setPlayers((prev) => ({
          ...prev,
          [conn.peer]: data,
        }));
      });

      // Envia a posição atual para o novo jogador
      conn.send(players[myId] || { x: 400, y: 300 });
    });

    // Movimentação do jogador
    const handleKeyDown = (e) => {
      const direction = {
        ArrowUp: { x: 0, y: -10 },
        ArrowDown: { x: 0, y: 10 },
        ArrowLeft: { x: -10, y: 0 },
        ArrowRight: { x: 10, y: 0 },
      }[e.key];

      if (direction) {
        setPlayers((prev) => {
          const currentPlayer = prev[myId] || { x: 400, y: 300 };
          const newX = Math.max(
            0,
            Math.min(800, currentPlayer.x + direction.x)
          ); // Limita X entre 0 e 800
          const newY = Math.max(
            0,
            Math.min(600, currentPlayer.y + direction.y)
          ); // Limita Y entre 0 e 600

          const updatedPlayers = {
            ...prev,
            [myId]: { x: newX, y: newY },
          };

          // Envia a nova posição para todos os jogadores conectados
          Object.values(peer.connections).forEach((conns) => {
            conns.forEach((conn) => {
              conn.send(updatedPlayers[myId]);
            });
          });

          return updatedPlayers;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      peer.destroy();
    };
  }, [myId]);

  return (
    <div className="game-container">
      <div>
        <p>Seu ID: {myId}</p>
      </div>
      {Object.entries(players).map(([id, { x, y }]) => (
        <Player key={id} x={x} y={y} color={id === myId ? "blue" : "red"} />
      ))}
    </div>
  );
};

export default Game;
