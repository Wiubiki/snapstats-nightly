import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  PLAYER: 'player',
};

// Draggable Player Card with Edit/View Toggle
const DraggablePlayer = ({ player, onDelete, onEdit, isEditing, onToggleEdit, onRequestDelete }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.PLAYER,
    item: player,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const handleChange = (field, value) => {
    onEdit(player.id, field, value);
    
    
  };

  

  return (
    <div
      ref={dragPreview}
      style={{
        border: '1px solid gray',
        padding: '8px',
        margin: '4px',
        background: '#fff',
        opacity: isDragging ? 0.5 : 1,
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
      }}
    >
      {/* Drag Handle */}
	  {!isEditing && (
      <div ref={drag} style={{ cursor: 'grab' }}>⠿</div>
      )}

      {isEditing ? (
        <>
          <input
            type="number"
            value={player.jersey}
            onChange={(e) => handleChange('jersey', parseInt(e.target.value) || 0)}
            style={{ width: '35px' }}
          />
          <input
            type="text"
            value={player.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Name"
            style={{  minWidth: '100px', maxWidth: '110px', flex: 1 }}
          />
          <select
            value={player.position}
            onChange={(e) => handleChange('position', e.target.value)}
            style={{ width: '65px' }}
          >
            <option value="">Pos</option>
            <option value="Guard">Guard</option>
            <option value="Forward">Forward</option>
            <option value="Center">Center</option>
          </select>
          <button onClick={() => onToggleEdit(null)}>✅</button>
        </>
      ) : (
        <>
          <div style={{ width: '45px' }}>#{player.jersey}</div>
          <div style={{ flex: 1 }}>{player.name || 'Unnamed'}</div>
          <div style={{ width: '65px' }}>{player.position || '-'}</div>
          <button onClick={() => onToggleEdit(player.id)}>✏️</button>
        </>
      )}
	  {!isEditing && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRequestDelete(player);
        }}
      >
        🗑️
      </button>
      
      )}
    </div>
  );
};


const DroppableArea = ({ players, onDrop, title, children, onDelete, onEdit, editingId, onToggleEdit, onRequestDelete }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.PLAYER,
    drop: (player) => onDrop(player),
  });

  return (
    <div
      ref={drop}
      style={{
        border: '2px dashed gray',
        padding: '8px',
        margin: '6px',
        minHeight: '120px',
        width: '95%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <strong>{title}</strong>
      {players.map((player) => (
        <DraggablePlayer
          key={player.id}
          player={player}
          onDelete={onDelete}
          onEdit={onEdit}
          isEditing={editingId === player.id}
          onToggleEdit={onToggleEdit}
          onRequestDelete={onRequestDelete} 
        />
      ))}
      <div style={{ marginTop: '12px' }}>{children}</div>
    </div>
  );
};

export default function MyTeamConfig({ onClose }) {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [rosterPlayers, setRosterPlayers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#ff0000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [editingId, setEditingId] = useState(null);
  const [pendingDeletePlayer, setPendingDeletePlayer] = useState(null);
  

  useEffect(() => {
    const storedTeam = localStorage.getItem('snapstats.myTeam');
    if (storedTeam) {
      const parsed = JSON.parse(storedTeam);
      setTeamName(parsed.teamName);
      setPrimaryColor(parsed.primaryColor);
      setSecondaryColor(parsed.secondaryColor);

      const enrich = (p) => ({
        ...p,
        id: p.id || crypto.randomUUID(),
      });

      setRosterPlayers(parsed.players.filter((p) => p.inRoster).map(enrich));
      setAvailablePlayers(parsed.players.filter((p) => !p.inRoster).map(enrich));
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

  const handleSave = () => {
    const allPlayers = [...rosterPlayers, ...availablePlayers];
    const players = allPlayers.map((p) => ({
      ...p,
      inRoster: rosterPlayers.some((r) => r.id === p.id),
    }));
  
    const myTeamData = {
      teamName,
      primaryColor,
      secondaryColor,
      players
    };
  
    localStorage.setItem('snapstats.myTeam', JSON.stringify(myTeamData));
    console.log("MyTeam saved:", myTeamData);
  };
  

  const saveToStorage = (roster, available) => {
    const allPlayers = [
      ...roster.map((p) => ({ ...p, inRoster: true })),
      ...available.map((p) => ({ ...p, inRoster: false })),
    ];

    const teamData = {
      teamName,
      primaryColor,
      secondaryColor,
      players: allPlayers,
    };

    localStorage.setItem('snapstats.myTeam', JSON.stringify(teamData));
  };

  const existsInList = (list, player) => list.some((p) => p.id === player.id);

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

  const handleAddPlayer = () => {
    const usedNumbers = [...availablePlayers, ...rosterPlayers].map((p) => p.jersey);
    const nextJersey = Math.max(0, ...usedNumbers) + 1;

    const newPlayer = {
      id: crypto.randomUUID(),
      jersey: nextJersey,
      name: '',
      position: '',
      inRoster: false,
    };

    const updatedAvailable = [...availablePlayers, newPlayer];
    setAvailablePlayers(updatedAvailable);
    saveToStorage(rosterPlayers, updatedAvailable);
  };

  const handleDeletePlayer = (idToDelete) => {
    const updatedAvailable = availablePlayers.filter((p) => p.id !== idToDelete);
    const updatedRoster = rosterPlayers.filter((p) => p.id !== idToDelete);
    setAvailablePlayers(updatedAvailable);
    setRosterPlayers(updatedRoster);
    saveToStorage(updatedRoster, updatedAvailable);
  };

  const handleEditPlayer = (id, field, value) => {
    const updateList = (list) =>
      list.map((p) => (p.id === id ? { ...p, [field]: value } : p));

    const updatedAvailable = updateList(availablePlayers);
    const updatedRoster = updateList(rosterPlayers);

    setAvailablePlayers(updatedAvailable);
    setRosterPlayers(updatedRoster);
    saveToStorage(updatedRoster, updatedAvailable);
  };

  return (
    <DndProvider backend={HTML5Backend}>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '400px',
        marginBottom: '16px'
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
            backgroundColor: '#ccc',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ⬅️ Back to Menu
        </button>
      )}
    
      <button
        onClick={handleSave}
        style={{
          padding: '6px 12px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        💾 Save MyTeam
      </button>
    </div>
    
    
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Name & Color Pickers for MyTeamConfig   */}
      <div style={{ marginBottom: "16px", width: "100%", maxWidth: "320px" }}>
        <label style={{ display: "block", marginBottom: "6px" }}>
          Team Name:
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={{
              width: "65%",
              padding: "6px",
              marginTop: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </label>
      
        <label style={{ display: "block", margin: "12px 0 6px" }}>
          Primary Color:
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            style={{ marginLeft: "8px", verticalAlign: "middle" }}
          />
        </label>
      
        <label style={{ display: "block", margin: "6px 0" }}>
          Secondary Color:
          <input
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            style={{ marginLeft: "8px", verticalAlign: "middle" }}
          />
        </label>

		 
      </div>
      
      
        <DroppableArea
          players={rosterPlayers}
          onDrop={movePlayerToRoster}
          title="Roster Players"
          onDelete={handleDeletePlayer}
          onEdit={handleEditPlayer}
          editingId={editingId}
          onToggleEdit={setEditingId}
          onRequestDelete={setPendingDeletePlayer}
        />

        <hr style={{ margin: '16px 0', width: '60%' }} />

        <DroppableArea
          players={availablePlayers}
          onDrop={movePlayerToAvailable}
          title="Available Players"
          onDelete={handleDeletePlayer}
          onEdit={handleEditPlayer}
          editingId={editingId}
          onToggleEdit={setEditingId}
          onRequestDelete={setPendingDeletePlayer}
        >
          <button
            onClick={handleAddPlayer}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            ➕ Add Player
          </button>

          {pendingDeletePlayer && (
                <div style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    background: '#fff',
                    padding: '24px',
                    borderRadius: '8px',
                    minWidth: '250px',
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: '16px' }}>
                      Delete Player #{pendingDeletePlayer.jersey}?
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                      <button
                        style={{ fontSize: '20px', color: 'green' }}
                        onClick={() => {
                          handleDeletePlayer(pendingDeletePlayer.id);
                          setPendingDeletePlayer(null);
                        }}
                      >
                        ✅
                      </button>
                      <button
                        style={{ fontSize: '20px', color: 'red' }}
                        onClick={() => setPendingDeletePlayer(null)}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              )}

          
        </DroppableArea>
      </div>
    </DndProvider>

    

    
  );
}
