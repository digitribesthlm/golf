// Default club data (your yardages as baseline)
export const defaultClubData = {
  'SW': {
    name: 'SW (Sand Wedge)',
    baseline: { carry: 85, total: 87 },
    calm17: { carry: 84, total: 86 },
    headwind18: { carry: 76, total: 78 },
    tailwind18: { carry: 88, total: 90 },
    rolloutFactor: 0.5
  },
  'PW': {
    name: 'PW (Pitching Wedge)',
    baseline: { carry: 95, total: 98 },
    calm17: { carry: 94, total: 97 },
    headwind18: { carry: 85, total: 88 },
    tailwind18: { carry: 99, total: 103 },
    rolloutFactor: 1.0
  },
  '9i': {
    name: '9 Iron',
    baseline: { carry: 105, total: 109 },
    calm17: { carry: 104, total: 108 },
    headwind18: { carry: 93, total: 97 },
    tailwind18: { carry: 109, total: 114 },
    rolloutFactor: 1.5
  },
  '8i': {
    name: '8 Iron',
    baseline: { carry: 117, total: 123 },
    calm17: { carry: 116, total: 121 },
    headwind18: { carry: 104, total: 110 },
    tailwind18: { carry: 121, total: 127 },
    rolloutFactor: 2.0
  },
  '7i': {
    name: '7 Iron',
    baseline: { carry: 129, total: 136 },
    calm17: { carry: 127, total: 134 },
    headwind18: { carry: 115, total: 122 },
    tailwind18: { carry: 134, total: 141 },
    rolloutFactor: 2.5
  },
  '6i': {
    name: '6 Iron',
    baseline: { carry: 141, total: 149 },
    calm17: { carry: 139, total: 147 },
    headwind18: { carry: 125, total: 133 },
    tailwind18: { carry: 146, total: 154 },
    rolloutFactor: 3.0
  },
  '5i': {
    name: '5 Iron',
    baseline: { carry: 153, total: 162 },
    calm17: { carry: 151, total: 160 },
    headwind18: { carry: 136, total: 146 },
    tailwind18: { carry: 158, total: 167 },
    rolloutFactor: 3.5
  },
  '4i': {
    name: '4 Iron',
    baseline: { carry: 165, total: 175 },
    calm17: { carry: 163, total: 173 },
    headwind18: { carry: 147, total: 158 },
    tailwind18: { carry: 171, total: 182 },
    rolloutFactor: 4.0
  },
  '3i': {
    name: '3 Iron',
    baseline: { carry: 177, total: 188 },
    calm17: { carry: 175, total: 186 },
    headwind18: { carry: 158, total: 169 },
    tailwind18: { carry: 184, total: 195 },
    rolloutFactor: 4.5
  },
  'U3': {
    name: 'U3 (Utility 3)',
    baseline: { carry: 189, total: 201 },
    calm17: { carry: 186, total: 199 },
    headwind18: { carry: 168, total: 181 },
    tailwind18: { carry: 196, total: 209 },
    rolloutFactor: 5.0
  },
  'W3': {
    name: 'W3 (Wood 3)',
    baseline: { carry: 201, total: 214 },
    calm17: { carry: 198, total: 212 },
    headwind18: { carry: 179, total: 194 },
    tailwind18: { carry: 208, total: 222 },
    rolloutFactor: 6.0
  },
  'M1': {
    name: 'M1 (Driver)',
    baseline: { carry: 213, total: 227 },
    calm17: { carry: 210, total: 225 },
    headwind18: { carry: 189, total: 205 },
    tailwind18: { carry: 219, total: 235 },
    rolloutFactor: 7.0
  },
  // New club configurations
  'P3': {
    name: 'P3 (Helswing)',
    baseline: { carry: 0, total: 0 }, // Helswing technique
    calm17: { carry: 0, total: 0 },
    headwind18: { carry: 0, total: 0 },
    tailwind18: { carry: 0, total: 0 },
    rolloutFactor: 0
  },
  'P1': {
    name: 'P1 (Parallel Swing)',
    baseline: { carry: 0, total: 0 }, // Parallel swing technique
    calm17: { carry: 0, total: 0 },
    headwind18: { carry: 0, total: 0 },
    tailwind18: { carry: 0, total: 0 },
    rolloutFactor: 0
  },
  // Short game clubs - två klubbor mellan fötterna
  '48_2K_H': {
    name: '48° Två Klubbor Hel (90m)',
    baseline: { carry: 86, total: 90 },
    calm17: { carry: 86, total: 90 },
    headwind18: { carry: 86, total: 90 },
    tailwind18: { carry: 86, total: 90 },
    rolloutFactor: 2.0
  },
  '52_2K_H': {
    name: '52° Två Klubbor Hel (85m)',
    baseline: { carry: 85, total: 85 },
    calm17: { carry: 85, total: 85 },
    headwind18: { carry: 85, total: 85 },
    tailwind18: { carry: 85, total: 85 },
    rolloutFactor: 0
  },
  '56_2K_H': {
    name: '56° Två Klubbor Hel (80m)',
    baseline: { carry: 80, total: 80 },
    calm17: { carry: 80, total: 80 },
    headwind18: { carry: 80, total: 80 },
    tailwind18: { carry: 80, total: 80 },
    rolloutFactor: 0
  },
  '56_JV': {
    name: '56° Jim Vertikal (70m)',
    baseline: { carry: 70, total: 70 },
    calm17: { carry: 70, total: 70 },
    headwind18: { carry: 70, total: 70 },
    tailwind18: { carry: 70, total: 70 },
    rolloutFactor: 0
  },
  '52_JV': {
    name: '52° Jim Vertikal (70m carry, 73m total)',
    baseline: { carry: 70, total: 73 },
    calm17: { carry: 70, total: 73 },
    headwind18: { carry: 70, total: 73 },
    tailwind18: { carry: 70, total: 73 },
    rolloutFactor: 3.0
  },
  '60_TBD': {
    name: '60° ??? (TBD)',
    baseline: { carry: 0, total: 0 },
    calm17: { carry: 0, total: 0 },
    headwind18: { carry: 0, total: 0 },
    tailwind18: { carry: 0, total: 0 },
    rolloutFactor: 0
  },
  '48_2K_P': {
    name: '48° Två Klubbor Parallellt (65m+)',
    baseline: { carry: 65, total: 65 },
    calm17: { carry: 65, total: 65 },
    headwind18: { carry: 65, total: 65 },
    tailwind18: { carry: 65, total: 65 },
    rolloutFactor: 0
  },
  '52_1K_P': {
    name: '52° En Klubba Parallellt (50m, c53, r55)',
    baseline: { carry: 53, total: 55 },
    calm17: { carry: 53, total: 55 },
    headwind18: { carry: 53, total: 55 },
    tailwind18: { carry: 53, total: 55 },
    rolloutFactor: 2.0
  },
  '56_2K_P': {
    name: '56° Två Klubbor Parallellt (45m)',
    baseline: { carry: 45, total: 45 },
    calm17: { carry: 45, total: 45 },
    headwind18: { carry: 45, total: 45 },
    tailwind18: { carry: 45, total: 45 },
    rolloutFactor: 0
  },
  '52_2K_P': {
    name: '52° Två Klubbor Parallellt (67m carry)',
    baseline: { carry: 67, total: 67 },
    calm17: { carry: 67, total: 67 },
    headwind18: { carry: 67, total: 67 },
    tailwind18: { carry: 67, total: 67 },
    rolloutFactor: 0
  }
};

// Cookie utility functions
const setCookie = (name, value, days = 365) => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

// Player data management
export const getPlayerData = (playerName) => {
  if (!playerName) return defaultClubData;
  
  const savedData = getCookie(`golf_player_${playerName}`);
  return savedData || defaultClubData;
};

export const savePlayerData = (playerName, clubData) => {
  if (!playerName) return;
  
  setCookie(`golf_player_${playerName}`, clubData);
  
  // Also update the players list
  const players = getPlayersList();
  if (!players.includes(playerName)) {
    players.push(playerName);
    setCookie('golf_players_list', players);
  }
};

export const getPlayersList = () => {
  const players = getCookie('golf_players_list');
  return players || [];
};

export const getActivePlayer = () => {
  return getCookie('golf_active_player');
};

export const setActivePlayer = (playerName) => {
  setCookie('golf_active_player', playerName);
};

export const deletePlayer = (playerName) => {
  if (typeof window === 'undefined') return;
  
  // Remove player data
  document.cookie = `golf_player_${playerName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  
  // Update players list
  const players = getPlayersList();
  const updatedPlayers = players.filter(p => p !== playerName);
  setCookie('golf_players_list', updatedPlayers);
  
  // If this was the active player, clear active player
  if (getActivePlayer() === playerName) {
    document.cookie = `golf_active_player=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

