# Golf Distance Calculator

A professional golf distance calculator built with Next.js that accounts for weather conditions and supports multiple player profiles.

## Features

### 🎯 Distance Calculations
- **Temperature Effects**: Adjusts for air density changes
- **Wind Conditions**: Headwind, tailwind, and crosswind calculations
- **Green Conditions**: Soft, medium, and firm green rollout
- **Rain Impact**: Light, moderate, and heavy rain effects on carry and rollout
- **Club-Specific Rollout**: Each club has realistic rollout characteristics

### 👥 Player Profiles
- **Multiple Players**: Create and save profiles for different golfers
- **Custom Yardages**: Each player can input their personal distances
- **Persistent Storage**: Data saved in browser cookies
- **Default Values**: Comes with baseline yardages that can be customized

### 📱 Mobile Friendly
- **Responsive Design**: Works perfectly on phones, tablets, and desktops
- **Touch Optimized**: Large touch targets and smooth scrolling
- **Horizontal Scroll**: Table scrolls smoothly on mobile devices

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/golf.git
cd golf
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## How to Use

### Calculator Tab
1. **Set Conditions**: Enter temperature, wind direction/speed, green conditions, and rain
2. **Calculate**: Click "Calculate All Distances" to see results for all clubs
3. **Read Results**: View carry distance, rollout, and final ball position

### Player Settings Tab
1. **Create Profile**: Enter your name and click "Save Player"
2. **Edit Distances**: Click "Edit Distances" to customize your yardages
3. **Save Changes**: Input your personal distances and save
4. **Switch Players**: Load different player profiles from the saved list

## Club Data Structure

Each club includes:
- **Baseline distances** (carry and total)
- **Calm 17°C distances** (for temperature calibration)
- **Headwind 18 km/h distances** (for wind calculations)
- **Tailwind 18 km/h distances** (for wind calculations)
- **Rollout factor** (affects green rollout)

## Technology Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **JavaScript** - No TypeScript for simplicity
- **Browser Cookies** - Data persistence

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Default yardages based on average golfer distances
- Weather calculations based on golf physics principles
- Mobile-first responsive design approach

