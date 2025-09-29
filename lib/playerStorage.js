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
  // New club configurations based on benchmark shots
  '48_2C_P4': {
    name: '48° 2C Full (P4)',
    baseline: { carry: 90, total: 92 },
    calm17: { carry: 90, total: 92 },
    headwind18: { carry: 85, total: 87 },
    tailwind18: { carry: 95, total: 97 },
    rolloutFactor: 2.0
  },
  '52_2C_P4': {
    name: '52° 2C Full (P4)',
    baseline: { carry: 85, total: 87 },
    calm17: { carry: 85, total: 87 },
    headwind18: { carry: 80, total: 82 },
    tailwind18: { carry: 90, total: 92 },
    rolloutFactor: 2.0
  },
  '56_2C_P4': {
    name: '56° 2C Full (P4)',
    baseline: { carry: 80, total: 82 },
    calm17: { carry: 80, total: 82 },
    headwind18: { carry: 75, total: 77 },
    tailwind18: { carry: 85, total: 87 },
    rolloutFactor: 2.0
  },
  '56_JIM_P3': {
    name: '56° JIM P3',
    baseline: { carry: 70, total: 73 },
    calm17: { carry: 70, total: 73 },
    headwind18: { carry: 66, total: 69 },
    tailwind18: { carry: 74, total: 77 },
    rolloutFactor: 3.0
  },
  '52_JIM_P3': {
    name: '52° JIM P3',
    baseline: { carry: 70, total: 73 },
    calm17: { carry: 70, total: 73 },
    headwind18: { carry: 66, total: 69 },
    tailwind18: { carry: 74, total: 77 },
    rolloutFactor: 3.0
  },
  '48_2C_P2': {
    name: '48° 2C P2',
    baseline: { carry: 40, total: 42 },
    calm17: { carry: 40, total: 42 },
    headwind18: { carry: 38, total: 40 },
    tailwind18: { carry: 42, total: 44 },
    rolloutFactor: 2.0
  },
  '52_1C_P2': {
    name: '52° 1C P2',
    baseline: { carry: 53, total: 55 },
    calm17: { carry: 53, total: 55 },
    headwind18: { carry: 50, total: 52 },
    tailwind18: { carry: 56, total: 58 },
    rolloutFactor: 2.0
  },
  '52_2C_P2': {
    name: '52° 2C P2',
    baseline: { carry: 67, total: 69 },
    calm17: { carry: 67, total: 69 },
    headwind18: { carry: 63, total: 65 },
    tailwind18: { carry: 71, total: 73 },
    rolloutFactor: 2.0
  },
  '56_2C_P2': {
    name: '56° 2C P2',
    baseline: { carry: 45, total: 47 },
    calm17: { carry: 45, total: 47 },
    headwind18: { carry: 42, total: 44 },
    tailwind18: { carry: 48, total: 50 },
    rolloutFactor: 2.0
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

