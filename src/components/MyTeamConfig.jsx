import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  PLAYER: 'player',
};



// Draggable Player Component
const DraggablePlayer = ({ player }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: player,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      style={{
        border: '1px solid gray',
        padding: '8px',
        margin: '4px',
        background: '#fff',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      Player #{player.jersey}
    </div>
  );
};

// Droppable Area Component
const DroppableArea = ({ players, onDrop, title }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.PLAYER,
    drop: (player) => onDrop(player),
  });

  return (
    <div
      ref={drop}
      style={{
        border: '2px dashed gray',
        padding: '16px',
        margin: '8px',
        minHeight: '120px',
        width: '200px',
      }}
    >
      <strong>{title}</strong>
      {players.map((player) => (
        <DraggablePlayer key={player.id} player={player} />
      ))}
    </div>
  );
};

export default function MyTeamConfig() {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [rosterPlayers, setRosterPlayers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#ff0000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');

  // saveToStorage helper
  const saveToStorage = (roster, available) => {
    const allPlayers = [
      ...roster.map(p => ({ ...p, inRoster: true })),
      ...available.map(p => ({ ...p, inRoster: false })),
    ];
  
    const teamData = {
      teamName,
      primaryColor,
      secondaryColor,
      players: allPlayers,
    };
  
    localStorage.setItem('snapstats.myTeam', JSON.stringify(teamData));
  };

  // Introduce immutable ids for players
  useEffect(() => {
    const storedTeam = localStorage.getItem('snapstats.myTeam');
    if (storedTeam) {
      const parsed = JSON.parse(storedTeam);
      setTeamName(parsed.teamName);
      setPrimaryColor(parsed.primaryColor);
      setSecondaryColor(parsed.secondaryColor);
  
      // Ensure legacy entries get IDs
      const enrich = (p) => ({
        ...p,
        id: p.id || crypto.randomUUID()
      });
  
      setRosterPlayers(parsed.players.filter(p => p.inRoster).map(enrich));
      setAvailablePlayers(parsed.players.filter(p => !p.inRoster).map(enrich));
    } else {
      const initialPlayers = [...Array(5)].map((_, i) => ({
        id: crypto.randomUUID(),
        jersey: i + 1,
        name: '',
        position: '',
        inRoster: false,
      }));
      setAvailablePlayers(initialPlayers);
    }
  }, []);


  // Helper to check existence clearly
  const existsInList = (list, player) =>
    list.some((p) => p.id === player.id);

  const movePlayerToRoster = (player) => {
    if (existsInList(rosterPlayers, player)) return;
  
    const updatedAvailable = availablePlayers.filter((p) => p.id !== player.id);
    const updatedRoster = [...rosterPlayers, player];
  
    setAvailablePlayers(updatedAvailable);
    setRosterPlayers(updatedRoster);
    saveToStorage(updatedRoster, updatedAvailable);
  };

  const movePlayerToAvailable = (player) => {
    if (existsInList(availablePlayers, player)) return;
  
    const updatedRoster = rosterPlayers.filter((p) => p.id !== player.id);
    const updatedAvailable = [...availablePlayers, player];
  
    setAvailablePlayers(updatedAvailable);
    setRosterPlayers(updatedRoster);
    saveToStorage(updatedRoster, updatedAvailable);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DroppableArea
          players={availablePlayers}
          onDrop={movePlayerToAvailable}
          title="Available Players"
        />
        <DroppableArea
          players={rosterPlayers}
          onDrop={movePlayerToRoster}
          title="Roster Players"
        />
      </div>
    </DndProvider>
  );
}
