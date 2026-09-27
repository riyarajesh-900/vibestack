const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\hp\\mindmate';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(relativePath, content) {
  const fullPath = path.join(targetDir, relativePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${relativePath}`);
}

console.log('Generating MindMate application files...');

// 1. package.json
writeFile('package.json', JSON.stringify({
  "name": "mindmate",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.15.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.2",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.7.2",
    "vite": "^6.1.0"
  }
}, null, 2));

// 2. vite.config.ts
writeFile('vite.config.ts', `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
`);

// 3. tsconfig.json
writeFile('tsconfig.json', JSON.stringify({
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}, null, 2));

// 4. tailwind.config.js
writeFile('tailwind.config.js', `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070A12',
          900: '#0B0F19',
          850: '#0F1524',
          800: '#141D33',
          750: '#1A2542',
          700: '#233256',
        },
        violet: {
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))' },
          '100%': { opacity: '0.8', filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
`);

// 5. postcss.config.js
writeFile('postcss.config.js', `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`);

// 6. index.html
writeFile('index.html', `
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238B5CF6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2v4'/><path d='m4.93 4.93 2.83 2.83'/><path d='M2 12h4'/><path d='m4.93 19.07 2.83-2.83'/><path d='M12 18v4'/><path d='m19.07 19.07-2.83-2.83'/><path d='M18 12h4'/><path d='m19.07 4.93-2.83 2.83'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MindMate — Smart Student Life Companion</title>
    <meta name="description" content="Plan smarter. Feel better. Take it one step at a time. An adaptive student wellness and productivity companion." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#0B0F19] text-slate-100 antialiased selection:bg-purple-500 selection:text-white min-h-screen overflow-x-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

console.log('Core project setup files created.');