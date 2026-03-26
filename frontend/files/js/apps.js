
/**
 * apps.js - Logic for the internal "Apps" modal (Calculator, Calendar, etc.)
 */

var currentApp = null;

function openAppModal(appName) {
    currentApp = appName;
    const modal = document.getElementById('appsModal');
    const title = document.getElementById('appModalTitle');
    const content = document.getElementById('appModalContent');

    const apps = {
        menu: {
            title: 'Apps & Tools',
            render: () => {
                // Fetch Zylo Slayer State
                let slayerState = null;
                try {
                    const saved = localStorage.getItem('zylo_slayer_save');
                    if (saved) slayerState = JSON.parse(saved);
                } catch(e) {}

                const hasSave = !!slayerState;
                const level = hasSave ? slayerState.level : 1;
                const stage = hasSave ? slayerState.stage : 1;
                const xp = hasSave ? slayerState.xp : 0;
                const gold = hasSave ? Math.floor(slayerState.gold) : 0;
                const atk = hasSave && slayerState.stats ? slayerState.stats.atk : 10;
                const nextXp = Math.floor(100 * Math.pow(1.5, level - 1));
                const xpPercent = Math.min(100, (xp / nextXp) * 100).toFixed(1);
                
                // Quest preview
                const questProgress = hasSave && slayerState.quest ? slayerState.quest.progress : 0;
                const questTarget = hasSave && slayerState.quest ? slayerState.quest.target : 50;
                const questName = hasSave && slayerState.quest ? slayerState.quest.name : "Monster Hunter";

                return `
        <div class="flex flex-col gap-4 p-2">
          
          <!-- Zylo Slayer Featured Hub -->
          <div class="bg-gradient-to-br from-discord-gray-800 to-discord-gray-900 border border-purple-500/30 rounded-xl p-4 relative overflow-hidden group shadow-lg">
            
            <!-- Status Badge -->
            <div class="absolute top-4 right-4 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse drop-shadow-[0_0_3px_rgba(192,132,252,0.8)]"></span> Season Active
            </div>
            
            <!-- Header -->
            <div class="flex items-start gap-3 mb-4 cursor-pointer" onclick="openAppModal('zyloslayer')">
              <div class="w-14 h-14 rounded-xl bg-discord-gray-800 border-2 border-purple-500/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)] group-hover:border-purple-400 transition-colors">
                <i data-feather="shield" class="w-7 h-7 text-purple-400 group-hover:text-purple-300 drop-shadow-md"></i>
              </div>
              <div class="flex-1 mt-0.5">
                <h3 class="text-xl font-bold text-white leading-tight drop-shadow-sm group-hover:text-purple-50 transition-colors">Zylo Slayer <span class="tracking-widest text-[9px] font-bold text-purple-400/80 ml-1 uppercase bg-purple-500/10 px-1.5 py-0.5 rounded">Idle RPG</span></h3>
                <p class="text-xs text-discord-gray-400 mt-1">Defeat monsters, earn gold, & level up your hero.</p>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-3 mb-4">
               
               <!-- Level & XP -->
               <div class="bg-black/30 rounded-lg p-2.5 border border-white/5">
                 <div class="flex justify-between items-end mb-1.5">
                   <div class="text-[10px] text-discord-gray-400 font-medium uppercase tracking-wider">Player Level <span class="text-white text-sm font-bold ml-1">${level}</span></div>
                   <div class="text-[9px] text-discord-gray-500 font-bold uppercase">Stage ${stage}</div>
                 </div>
                 <div class="w-full bg-discord-gray-800 rounded-full h-1.5 mb-2 shadow-inner">
                   <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" style="width: ${xpPercent}%"></div>
                 </div>
                 <div class="flex justify-between text-[10px] font-medium text-discord-gray-400">
                   <span class="flex items-center gap-1 text-yellow-400/90"><i data-feather="database" class="w-3 h-3"></i> ${gold}</span>
                   <span class="flex items-center gap-1 text-red-400/90"><i data-feather="crosshair" class="w-3 h-3"></i> ${atk} Atk</span>
                 </div>
               </div>

               <!-- Active Quest -->
               <div class="bg-black/30 rounded-lg p-2.5 border border-white/5 flex flex-col justify-center">
                  <div class="text-[10px] text-discord-gray-400 font-medium uppercase tracking-wider mb-1 flex items-center justify-between">
                     <span>Active Quest</span>
                     <i data-feather="map" class="w-3 h-3 text-green-400/80"></i>
                  </div>
                  <div class="text-xs font-bold text-white mb-2 truncate">${questName}</div>
                  <div class="max-w-full">
                     <div class="flex justify-between text-[9px] text-discord-gray-500 mb-1 font-bold">
                        <span>${questProgress} / ${questTarget} Kills</span>
                        <span class="text-green-400/90">${Math.floor(Math.min(100, (questProgress/questTarget)*100))}%</span>
                     </div>
                     <div class="w-full bg-discord-gray-800 rounded-full h-1 shadow-inner">
                       <div class="bg-green-500 h-1 rounded-full" style="width: ${Math.min(100, (questProgress/questTarget)*100)}%"></div>
                     </div>
                  </div>
               </div>

            </div>

            <!-- CTA -->
            <button onclick="openAppModal('zyloslayer')" class="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(147,51,234,0.2)] hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 group/btn">
              <i data-feather="${hasSave ? 'play' : 'zap'}" class="w-4 h-4 group-hover/btn:scale-110 transition-transform"></i> 
              <span class="tracking-wide">${hasSave ? 'CONTINUE ADVENTURE' : 'START PLAYING'}</span>
            </button>
          </div>

          <!-- Utilities Label -->
          <div class="flex items-center gap-2 px-1 mt-2 lg:mt-0">
             <div class="h-px bg-discord-gray-700 flex-1"></div>
             <h4 class="text-[10px] font-bold text-discord-gray-500 uppercase tracking-widest text-center shrink-0">Other Utilities</h4>
             <div class="h-px bg-discord-gray-700 flex-1"></div>
          </div>

          <!-- Generic Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button onclick="openAppModal('calculator')" class="p-3 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
              <i data-feather="hash" class="w-6 h-6 mb-1.5 text-discord-gray-400 group-hover:text-white transition"></i>
              <div class="text-xs font-medium text-discord-gray-300 group-hover:text-white">Calculator</div>
            </button>
            <button onclick="openAppModal('calendar')" class="p-3 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
              <i data-feather="calendar" class="w-6 h-6 mb-1.5 text-discord-gray-400 group-hover:text-white transition"></i>
              <div class="text-xs font-medium text-discord-gray-300 group-hover:text-white">Calendar</div>
            </button>
            <button onclick="openAppModal('speedtest')" class="p-3 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
              <i data-feather="zap" class="w-6 h-6 mb-1.5 text-discord-gray-400 group-hover:text-white transition"></i>
              <div class="text-xs font-medium text-discord-gray-300 group-hover:text-white">Speed Test</div>
            </button>
            <button onclick="openAppModal('notes')" class="p-3 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
              <i data-feather="file-text" class="w-6 h-6 mb-1.5 text-discord-gray-400 group-hover:text-white transition"></i>
              <div class="text-xs font-medium text-discord-gray-300 group-hover:text-white">Notes</div>
            </button>
            <button onclick="openAppModal('timer')" class="p-3 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
              <i data-feather="clock" class="w-6 h-6 mb-1.5 text-discord-gray-400 group-hover:text-white transition"></i>
              <div class="text-xs font-medium text-discord-gray-300 group-hover:text-white">Timer</div>
            </button>
            <button onclick="openAppModal('colorpicker')" class="p-3 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
              <i data-feather="aperture" class="w-6 h-6 mb-1.5 text-discord-gray-400 group-hover:text-white transition"></i>
              <div class="text-xs font-medium text-discord-gray-300 group-hover:text-white">Colors</div>
            </button>
            <button onclick="openAppModal('snake')" class="p-3 rounded-xl bg-discord-gray-700 hover:bg-discord-gray-600 transition text-center group flex flex-col items-center">
              <i data-feather="play-circle" class="w-6 h-6 mb-1.5 text-discord-gray-400 group-hover:text-white transition"></i>
              <div class="text-xs font-medium text-discord-gray-300 group-hover:text-white">Snake</div>
            </button>
          </div>
        </div>
      `;
            }
        },
        calculator: {
            title: 'Calculator',
            render: () => `
        <div class="bg-discord-gray-700 p-4 rounded-lg">
          <input type="text" id="calcDisplay" class="w-full bg-discord-gray-900 text-white text-2xl text-right p-3 rounded mb-3" readonly value="0">
          <div class="grid grid-cols-4 gap-2">
            ${['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map(b =>
                `<button onclick="calcPress('${b}')" class="p-3 rounded ${b.match(/[0-9.]/) ? 'bg-discord-gray-600' : 'bg-discord-blurple'} hover:opacity-80 text-white font-bold">${b}</button>`
            ).join('')}
          </div>
        </div>
      `
        },
        calendar: {
            title: 'Calendar',
            render: () => {
                const now = new Date();
                const month = now.toLocaleString('default', { month: 'long' });
                const year = now.getFullYear();
                const today = now.getDate();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

                let days = '';
                for (let i = 0; i < firstDay; i++) days += '<div></div>';
                for (let d = 1; d <= daysInMonth; d++) {
                    const isToday = d === today ? 'bg-discord-blurple text-white' : 'bg-discord-gray-700 hover:bg-discord-gray-600';
                    days += `<div class="p-2 text-center rounded ${isToday} cursor-pointer">${d}</div>`;
                }

                return `
          <div class="text-center mb-4">
            <div class="text-xl font-bold text-white">${month} ${year}</div>
          </div>
          <div class="grid grid-cols-7 gap-1 text-xs text-center">
            <div class="text-discord-gray-400 font-bold">Sun</div>
            <div class="text-discord-gray-400 font-bold">Mon</div>
            <div class="text-discord-gray-400 font-bold">Tue</div>
            <div class="text-discord-gray-400 font-bold">Wed</div>
            <div class="text-discord-gray-400 font-bold">Thu</div>
            <div class="text-discord-gray-400 font-bold">Fri</div>
            <div class="text-discord-gray-400 font-bold">Sat</div>
            ${days}
          </div>
        `;
            }
        },
        speedtest: {
            title: 'Speed Test',
            render: () => `
        <div class="text-center">
          <div id="speedResult" class="text-6xl font-bold text-white mb-2">--</div>
          <div class="text-discord-gray-400 mb-4">Mbps (Download)</div>
          <button onclick="runSpeedTest()" class="px-6 py-3 bg-discord-blurple hover:bg-opacity-80 text-white rounded-lg font-medium">
            Run Test
          </button>
          <p class="text-xs text-discord-gray-500 mt-4">Note: Simulated test for demo</p>
        </div>
      `
        },
        notes: {
            title: 'Quick Notes',
            render: () => `
        <textarea id="quickNotes" class="w-full h-48 bg-discord-gray-700 text-white p-3 rounded-lg resize-none" placeholder="Type your notes here...">${localStorage.getItem('quickNotes') || ''}</textarea>
        <button onclick="saveNotes()" class="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Save Notes</button>
      `
        },
        timer: {
            title: 'Timer',
            render: () => `
        <div class="text-center">
          <div id="timerDisplay" class="text-6xl font-mono font-bold text-white mb-4">00:00</div>
          <div class="flex gap-2 justify-center mb-4">
            <input type="number" id="timerMinutes" class="w-20 bg-discord-gray-700 text-white p-2 rounded text-center" placeholder="Min" value="5">
            <span class="text-2xl text-white">:</span>
            <input type="number" id="timerSeconds" class="w-20 bg-discord-gray-700 text-white p-2 rounded text-center" placeholder="Sec" value="00">
          </div>
          <div class="flex gap-2 justify-center">
            <button onclick="startTimer()" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Start</button>
            <button onclick="stopTimer()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Stop</button>
            <button onclick="resetTimer()" class="px-4 py-2 bg-discord-gray-600 hover:bg-discord-gray-500 text-white rounded-lg">Reset</button>
          </div>
        </div>
      `
        },
        colorpicker: {
            title: 'Color Picker',
            render: () => `
        <div class="space-y-4">
          <div id="colorPreview" class="w-full h-24 rounded-lg bg-discord-blurple border-2 border-discord-gray-600"></div>
          <input type="color" id="colorInput" class="w-full h-12 rounded cursor-pointer" value="#5865f2" onchange="updateColorPreview()">
          <input type="text" id="colorHex" class="w-full bg-discord-gray-700 text-white p-2 rounded text-center font-mono" value="#5865f2" onchange="updateFromHex()">
          <button onclick="copyColor()" class="w-full py-2 bg-discord-blurple hover:bg-opacity-80 text-white rounded-lg">Copy Hex Code</button>
        </div>
      `
        },
        snake: {
            title: 'Snake',
            render: () => `
        <div class="flex flex-col items-center">
          <div class="flex justify-between w-full mb-2 max-w-[300px]">
             <span class="text-white font-bold">Score: <span id="snakeScore">0</span></span>
             <span class="text-discord-gray-400 font-bold">High: <span id="snakeHighScore">0</span></span>
          </div>
          <canvas id="snakeCanvas" width="300" height="300" class="bg-discord-gray-900 border-2 border-discord-gray-600 rounded-lg shadow-lg"></canvas>
          <div class="text-discord-gray-400 text-xs mt-3 text-center">Use Arrow Keys to move.<br>Game auto-starts.</div>
        </div>
      `,
            init: () => {
                const canvas = document.getElementById('snakeCanvas');
                const ctx = canvas.getContext('2d');
                const gridSize = 15;
                const tileCount = canvas.width / gridSize;

                let snake = [{ x: 10, y: 10 }];
                let velocity = { x: 0, y: 0 };
                let apple = { x: 5, y: 5 };
                let score = 0;
                let highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
                
                document.getElementById('snakeHighScore').textContent = highScore;

                function resetGame() {
                    snake = [{ x: 10, y: 10 }];
                    velocity = { x: 0, y: 0 };
                    score = 0;
                    document.getElementById('snakeScore').textContent = score;
                    placeApple();
                }

                function placeApple() {
                    apple = {
                        x: Math.floor(Math.random() * tileCount),
                        y: Math.floor(Math.random() * tileCount)
                    };
                    // Ensure apple doesn't spawn on snake
                    if (snake.some(segment => segment.x === apple.x && segment.y === apple.y)) {
                        placeApple();
                    }
                }

                function update() {
                    // Move snake
                    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

                    // Wall collision (wrap around)
                    if (head.x < 0) head.x = tileCount - 1;
                    if (head.x >= tileCount) head.x = 0;
                    if (head.y < 0) head.y = tileCount - 1;
                    if (head.y >= tileCount) head.y = 0;

                    // Self collision
                    if (velocity.x !== 0 || velocity.y !== 0) {
                        for (let i = 0; i < snake.length; i++) {
                            if (head.x === snake[i].x && head.y === snake[i].y) {
                                resetGame();
                                return; // Game over frame
                            }
                        }
                    }

                    snake.unshift(head);

                    // Apple collision
                    if (head.x === apple.x && head.y === apple.y) {
                        score += 10;
                        document.getElementById('snakeScore').textContent = score;
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('snakeHighScore', highScore);
                            document.getElementById('snakeHighScore').textContent = highScore;
                        }
                        placeApple();
                    } else {
                        snake.pop(); // Remove tail if no apple eaten
                    }
                }

                function draw() {
                    ctx.fillStyle = '#202225'; // discord-gray-900 background
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw Apple
                    ctx.fillStyle = '#ed4245'; // discord red
                    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);

                    // Draw Snake
                    ctx.fillStyle = '#57F287'; // discord green
                    snake.forEach((segment, index) => {
                        ctx.fillStyle = index === 0 ? '#3ba55d' : '#57F287'; // Head is slightly darker green
                        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
                    });
                }

                function gameLoop() {
                    update();
                    draw();
                }

                window.snakeKeydownListener = (e) => {
                    switch (e.key) {
                        case 'ArrowLeft': if (velocity.x !== 1) velocity = { x: -1, y: 0 }; break;
                        case 'ArrowUp': if (velocity.y !== 1) velocity = { x: 0, y: -1 }; break;
                        case 'ArrowRight': if (velocity.x !== -1) velocity = { x: 1, y: 0 }; break;
                        case 'ArrowDown': if (velocity.y !== -1) velocity = { x: 0, y: 1 }; break;
                    }
                };
                document.addEventListener('keydown', window.snakeKeydownListener);
                window.snakeInterval = setInterval(gameLoop, 100);
                
                // Init first frame
                resetGame();
                velocity = { x: 1, y: 0 }; // Start moving right automatically
            },
            destroy: () => {
                if (window.snakeInterval) clearInterval(window.snakeInterval);
                if (window.snakeKeydownListener) document.removeEventListener('keydown', window.snakeKeydownListener);
            }
        },
        zyloslayer: {
            title: 'Zylo Slayer (Idle RPG)',
            render: () => `
        <div class="flex flex-col gap-2 h-full text-sm">
            
            <!-- Stage Header -->
            <div class="flex justify-between items-center bg-gradient-to-r from-discord-gray-800 to-discord-gray-900 shadow-inner p-3 rounded-lg border border-purple-500/20">
                <div class="font-bold text-lg text-white drop-shadow-sm">Stage <span id="rpgStage" class="text-purple-400">1</span></div>
                <div class="font-bold text-yellow-400 drop-shadow-sm flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded"><i data-feather="database" class="w-4 h-4 text-yellow-500"></i> <span id="rpgGold">0</span></div>
            </div>

            <!-- Navigation Tabs (Icon Based) -->
            <div class="flex border-b border-discord-gray-700/60 shadow-sm mt-1 mb-1 overflow-x-auto scrollbar-none snap-x">
                <button id="zsTabPlay" onclick="window.zyloSlayerTab('play')" title="Combat" class="flex-1 flex justify-center py-2.5 text-purple-400 border-b-2 border-purple-500 hover:bg-white/5 transition snap-start min-w-[50px]">
                    <i data-feather="crosshair" class="w-5 h-5"></i>
                </button>
                <button id="zsTabStats" onclick="window.zyloSlayerTab('stats')" title="Armory Upgrades" class="flex-1 flex justify-center py-2.5 text-discord-gray-400 hover:text-white border-b-2 border-transparent hover:bg-white/5 transition snap-start min-w-[50px]">
                    <i data-feather="trending-up" class="w-5 h-5"></i>
                </button>
                <button id="zsTabEquip" onclick="window.zyloSlayerTab('equip')" title="Equipment" class="flex-1 flex justify-center py-2.5 text-discord-gray-400 hover:text-white border-b-2 border-transparent hover:bg-white/5 transition snap-start min-w-[50px]">
                    <i data-feather="shield" class="w-5 h-5"></i>
                </button>
                <button id="zsTabSummon" onclick="window.zyloSlayerTab('summon')" title="Summon/Gacha" class="flex-1 flex justify-center py-2.5 text-discord-gray-400 hover:text-white border-b-2 border-transparent hover:bg-white/5 transition snap-start min-w-[50px]">
                    <i data-feather="star" class="w-5 h-5"></i>
                </button>
                <button id="zsTabQuests" onclick="window.zyloSlayerTab('quests')" title="Quests" class="flex-1 flex justify-center py-2.5 text-discord-gray-400 hover:text-white border-b-2 border-transparent hover:bg-white/5 transition snap-start min-w-[50px]">
                    <i data-feather="map" class="w-5 h-5"></i>
                </button>
                <button id="zsTabSettings" onclick="window.zyloSlayerTab('settings')" title="Options" class="flex-1 flex justify-center py-2.5 text-discord-gray-400 hover:text-white border-b-2 border-transparent hover:bg-white/5 transition snap-start min-w-[50px]">
                    <i data-feather="settings" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- PLAY TAB -->
            <div id="zsContentPlay" class="flex flex-col gap-3 flex-1">
               
               <!-- Active Quest Mini-Banner -->
               <div class="bg-discord-gray-800/80 p-2 rounded-lg border border-green-500/20 shadow-inner flex flex-col justify-center">
                  <div class="flex justify-between text-xs mb-1">
                     <span class="text-green-400 font-bold"><i data-feather="mapRef" id="questIcon" class="w-3 h-3 hidden"></i> <span id="rpgQuestName">Quest</span></span>
                     <span class="text-discord-gray-400"><span id="rpgQuestProg">0</span> / <span id="rpgQuestTgt">50</span></span>
                  </div>
                  <div class="w-full bg-black/50 rounded-full h-1">
                     <div id="rpgQuestBar" class="bg-green-500 h-1 rounded-full transition-all" style="width: 0%"></div>
                  </div>
               </div>

               <!-- Battle Log -->
               <div id="rpgLog" class="bg-[#0f1115] border border-black/20 shadow-inner rounded-xl p-3 h-36 overflow-y-auto text-xs font-mono text-gray-300 flex flex-col gap-1.5 scrollbar-thin">
                   <div class="text-purple-400 font-bold">Welcome to Zylo Slayer! Battle commencing...</div>
               </div>

               <!-- Core Combat UI -->
               <div class="bg-gradient-to-br from-discord-gray-800 to-discord-gray-900 p-3.5 rounded-xl border border-white/5 shadow-md mt-auto">
                   <div class="flex justify-between items-end mb-1.5">
                      <span class="text-xs text-discord-gray-400 font-bold uppercase tracking-wider">Level <span id="rpgLevel" class="text-white text-base ml-1">1</span></span>
                      <span class="text-[10px] text-discord-gray-500 font-medium">XP: <span id="rpgXp">0</span> / <span id="rpgNextXp">100</span></span>
                   </div>
                   <div class="w-full bg-black/40 rounded-full h-2 mb-4 shadow-inner">
                      <div id="rpgXpBar" class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
                   </div>
                   
                   <div class="flex justify-between items-center mb-1">
                       <span class="text-red-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1"><i data-feather="heart" class="w-3.5 h-3.5 text-red-500"></i> VS HP</span>
                       <span class="text-white text-xs font-mono"><span id="rpgHp">100</span> / <span id="rpgMaxHp">100</span></span>
                   </div>
                   <div class="w-full bg-black/40 rounded-full h-2.5 shadow-inner">
                       <div id="rpgHpBar" class="bg-red-500 h-2.5 rounded-full transition-all duration-200" style="width: 100%; box-shadow: 0 0 8px rgba(239, 68, 68, 0.4)"></div>
                   </div>
               </div>
            </div>

            <!-- ARMORY TAB -->
            <div id="zsContentStats" class="hidden flex flex-col gap-2 flex-1 overflow-y-auto">
                <div class="text-xs text-discord-gray-400 font-bold uppercase tracking-wider px-1 mb-1 mt-1">Hero Upgrades</div>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="window.zyloSlayerBuy('atk')" class="bg-discord-gray-800 hover:bg-discord-gray-700 border border-white/5 hover:border-purple-500/50 rounded-xl p-3 flex flex-col items-center group transition shadow-sm">
                        <div class="text-gray-300 font-bold mb-1.5 flex items-center gap-1"><i data-feather="crosshair" class="w-4 h-4 text-discord-gray-400 group-hover:text-purple-400 transition"></i> Attack</div>
                        <div class="text-xs text-discord-gray-400 group-hover:text-white transition">Power: <span id="rpgStatAtk" class="font-mono">10</span></div>
                        <div class="text-xs text-yellow-400 mt-2 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full">Cost: <span id="rpgCostAtk">10</span>g</div>
                    </button>
                    <button onclick="window.zyloSlayerBuy('hp')" class="bg-discord-gray-800 hover:bg-discord-gray-700 border border-white/5 hover:border-red-500/50 rounded-xl p-3 flex flex-col items-center group transition shadow-sm">
                        <div class="text-gray-300 font-bold mb-1.5 flex items-center gap-1"><i data-feather="plus-circle" class="w-4 h-4 text-discord-gray-400 group-hover:text-red-400 transition"></i> Max HP</div>
                        <div class="text-xs text-discord-gray-400 group-hover:text-white transition">Health: <span id="rpgStatHp" class="font-mono">100</span></div>
                        <div class="text-xs text-yellow-400 mt-2 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full">Cost: <span id="rpgCostHp">15</span>g</div>
                    </button>
                    <button onclick="window.zyloSlayerBuy('regen')" class="bg-discord-gray-800 hover:bg-discord-gray-700 border border-white/5 hover:border-green-500/50 rounded-xl p-3 flex flex-col items-center group transition shadow-sm">
                        <div class="text-gray-300 font-bold mb-1.5 flex items-center gap-1"><i data-feather="activity" class="w-4 h-4 text-discord-gray-400 group-hover:text-green-400 transition"></i> Regen</div>
                        <div class="text-xs text-discord-gray-400 group-hover:text-white transition">Heal: <span id="rpgStatRegen" class="font-mono">1</span>/turn</div>
                        <div class="text-xs text-yellow-400 mt-2 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full">Cost: <span id="rpgCostRegen">50</span>g</div>
                    </button>
                    <button onclick="window.zyloSlayerBuy('crit')" class="bg-discord-gray-800 hover:bg-discord-gray-700 border border-white/5 hover:border-yellow-500/50 rounded-xl p-3 flex flex-col items-center group transition shadow-sm">
                        <div class="text-gray-300 font-bold mb-1.5 flex items-center gap-1"><i data-feather="zap" class="w-4 h-4 text-discord-gray-400 group-hover:text-yellow-400 transition"></i> Crit %</div>
                        <div class="text-xs text-discord-gray-400 group-hover:text-white transition">Chance: <span id="rpgStatCrit" class="font-mono">5</span>%</div>
                        <div class="text-xs text-yellow-400 mt-2 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full">Cost: <span id="rpgCostCrit">100</span>g</div>
                    </button>
                </div>
            </div>

            <!-- EQUIP TAB -->
            <div id="zsContentEquip" class="hidden flex flex-col gap-2 flex-1 overflow-y-auto">
                <div class="bg-discord-gray-800/80 p-2 rounded-lg border border-white/10 shadow-inner flex justify-around mb-1 text-center text-xs text-white">
                     <div><div class="text-[10px] text-discord-gray-400">Sword (+Atk)</div><div id="eqSlotSword" class="text-purple-400 font-bold mt-0.5 cursor-pointer hover:underline" onclick="window.zsFilterInv('weapon')">None</div></div>
                     <div><div class="text-[10px] text-discord-gray-400">Accessory (+Atk/HP)</div><div id="eqSlotAccessory" class="text-blue-400 font-bold mt-0.5 cursor-pointer hover:underline" onclick="window.zsFilterInv('accessory')">None</div></div>
                     <div><div class="text-[10px] text-discord-gray-400">Relic</div><div id="eqSlotRelic" class="text-yellow-400 font-bold mt-0.5 cursor-pointer hover:underline" onclick="window.zsFilterInv('relic')">None</div></div>
                     <div><div class="text-[10px] text-discord-gray-400">Class</div><div id="eqSlotClass" class="text-green-400 font-bold mt-0.5 cursor-pointer hover:underline" onclick="window.zsFilterInv('class')">None</div></div>
                </div>
                <div class="flex justify-between items-end px-1 mb-1 mt-1">
                    <div class="text-xs text-discord-gray-400 font-bold uppercase tracking-wider">Inventory <span id="rpgInvCount">(0)</span></div>
                    <div class="text-[10px] text-discord-gray-500">Tap to Equip / Craft (5)</div>
                </div>
                <div id="rpgInventoryList" class="grid grid-cols-1 gap-1.5 scrollbar-thin pb-2">
                    <div class="text-center text-discord-gray-500 text-xs py-4">Inventory is empty. Summon some gear!</div>
                </div>
            </div>

            <!-- SUMMON TAB -->
            <div id="zsContentSummon" class="hidden flex flex-col gap-3 flex-1 overflow-y-auto">
                <div class="flex justify-center items-center bg-black/40 p-2 rounded-lg border border-teal-500/20 shadow-inner">
                    <div class="font-bold text-lg text-teal-400 flex items-center gap-1"><i data-feather="hexagon" class="w-5 h-5"></i> <span id="rpgGems">0</span> Gems</div>
                </div>
                
                <div id="summonResultArea" class="h-20 flex justify-center items-center bg-discord-gray-800 border border-white/5 rounded-xl shadow-inner text-center px-4 transition-all">
                    <span class="text-discord-gray-500 text-xs">Spend Gems to summon powerful Relics and Weapons!</span>
                </div>

                <div class="grid grid-cols-2 gap-2 mt-auto">
                    <button onclick="window.zyloSlayerSummon(1)" class="bg-discord-gray-800 hover:bg-discord-gray-700 border border-teal-500/30 hover:border-teal-400 rounded-xl p-3 flex flex-col items-center group transition shadow-sm relative overflow-hidden">
                        <div class="absolute inset-0 bg-teal-500/5 group-hover:bg-teal-500/10 transition"></div>
                        <div class="text-gray-200 font-bold mb-1 relative"><i data-feather="star" class="w-4 h-4 text-teal-400 inline"></i> 1x Summon</div>
                        <div class="text-xs text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full relative">Cost: 100 Gems</div>
                    </button>
                    <button onclick="window.zyloSlayerSummon(10)" class="bg-discord-gray-800 hover:bg-discord-gray-700 border border-purple-500/30 hover:border-purple-400 rounded-xl p-3 flex flex-col items-center group transition shadow-sm relative overflow-hidden">
                        <div class="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition"></div>
                        <div class="text-gray-200 font-bold mb-1 relative"><i data-feather="layers" class="w-4 h-4 text-purple-400 inline"></i> 10x Summon</div>
                        <div class="text-xs text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full relative">Cost: 1000 Gems</div>
                    </button>
                </div>
            </div>

            <!-- QUESTS TAB -->
            <div id="zsContentQuests" class="hidden flex flex-col gap-2 flex-1 overflow-y-auto">
                <div class="text-xs text-discord-gray-400 font-bold uppercase tracking-wider px-1 mb-1 mt-1">Slayer Quests</div>
                
                <div class="bg-gradient-to-br from-discord-gray-800 to-discord-gray-900 border border-green-500/30 shadow-md rounded-xl p-3">
                   <div class="flex justify-between items-start mb-2">
                       <div>
                           <div class="text-green-400 font-bold flex items-center gap-1.5"><i data-feather="target" class="w-4 h-4"></i> Active Bounty</div>
                           <div id="rpgQuestTabName" class="text-white text-sm font-medium mt-0.5">Slime Buster</div>
                       </div>
                       <div class="text-right">
                           <div class="text-[10px] text-discord-gray-400 uppercase">Reward</div>
                           <div id="rpgQuestTabReward" class="text-yellow-400 font-bold text-xs"><i data-feather="database" class="w-3 h-3 inline pb-0.5"></i> 100g <span class="text-teal-400 ml-1"><i data-feather="hexagon" class="w-3 h-3 inline pb-0.5"></i> 10</span></div>
                       </div>
                   </div>
                   
                   <div class="flex justify-between text-xs mb-1 text-discord-gray-300">
                      <span>Progress</span>
                      <span><span id="rpgQuestTabProg">0</span> / <span id="rpgQuestTabTgt">50</span></span>
                   </div>
                   <div class="w-full bg-black/50 rounded-full h-2 shadow-inner">
                      <div id="rpgQuestTabBar" class="bg-green-500 h-2 rounded-full transition-all" style="width: 0%"></div>
                   </div>
                </div>

                <div class="text-center text-discord-gray-500 text-[10px] italic mt-4">More quest types coming soon...</div>
            </div>

            <!-- OPTIONS TAB -->
            <div id="zsContentSettings" class="hidden flex flex-col gap-4 flex-1 items-center justify-center py-6">
                <i data-feather="settings" class="w-12 h-12 text-discord-gray-600 mb-2"></i>
                <div class="text-discord-gray-400 text-center text-xs max-w-[200px]">Wiping your save file will permanently erase all Gold, Levels, and Upgrades.</div>
                <button onclick="window.zyloSlayerReset()" class="w-full max-w-[200px] py-2.5 bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white font-bold rounded-lg transition-all mt-4">Wipe Save Data</button>
            </div>

        </div>
        `,
            init: () => {
                // Default State
                let state = {
                    gold: 0, gems: 0,
                    level: 1, xp: 0,
                    stage: 1, killsInStage: 0,
                    stats: { atk: 10, maxHp: 100, regen: 1, crit: 5 },
                    costs: { atk: 10, hp: 15, regen: 50, crit: 100 },
                    quest: { name: 'Monster Hunter', progress: 0, target: 50, active: true },
                    inventory: [],
                    equipped: { weapon: null, accessory: null, relic: null, class: null }
                };
                
                // Load State
                try {
                    const saved = localStorage.getItem('zylo_slayer_save');
                    if (saved) {
                       const parsed = JSON.parse(saved);
                       state = { ...state, ...parsed };
                       if(!state.quest) state.quest = { name: 'Monster Hunter', progress: 0, target: 50, active: true };
                       if(state.gems === undefined) state.gems = 0;
                       if(!state.inventory) state.inventory = [];
                       if(!state.equipped) state.equipped = { weapon: null, accessory: null, relic: null, class: null };
                    }
                } catch (e) { console.error('Failed to load Zylo Slayer save', e); }

                function getEquipStats() {
                    let total = { atk: 0, maxHp: 0, regen: 0 };
                    Object.values(state.equipped).forEach(itemId => {
                        if (!itemId) return;
                        const item = state.inventory.find(i => i.id === itemId);
                        if (item) {
                            if (item.atk) total.atk += item.atk;
                            if (item.hp) total.maxHp += item.hp;
                            if (item.regen) total.regen += item.regen;
                        }
                    });
                    return total;
                }

                let currentHp = state.stats.maxHp + getEquipStats().maxHp;
                let enemy = null; 

                // DOM Elements
                const el = (id) => document.getElementById(id);
                const logEl = el('rpgLog');

                function saveGame() {
                    localStorage.setItem('zylo_slayer_save', JSON.stringify(state));
                }

                function log(msg, color = 'text-gray-300') {
                    if (!logEl) return;
                    const line = document.createElement('div');
                    line.className = color;
                    line.textContent = msg;
                    logEl.appendChild(line);
                    logEl.scrollTop = logEl.scrollHeight;
                    // Max lines limit to prevent memory leak
                    if (logEl.children.length > 50) logEl.removeChild(logEl.firstChild);
                }

                function getNextXp() { return Math.floor(100 * Math.pow(1.5, state.level - 1)); }

                function updateUI() {
                    const eq = getEquipStats();
                    const totalMaxHp = state.stats.maxHp + eq.maxHp;
                    const totalAtk = state.stats.atk + eq.atk;
                    const totalRegen = state.stats.regen + eq.regen;

                    if (!el('rpgGold')) return; // Modal closed
                    
                    if(el('rpgGems')) el('rpgGems').textContent = state.gems;
                    el('rpgGold').textContent = Math.floor(state.gold);
                    el('rpgStage').textContent = state.stage;
                    el('rpgLevel').textContent = state.level;
                    el('rpgXp').textContent = Math.floor(state.xp);
                    el('rpgNextXp').textContent = getNextXp();
                    el('rpgXpBar').style.width = Math.min(100, (state.xp / getNextXp()) * 100) + '%';
                    
                    el('rpgHp').textContent = Math.max(0, Math.floor(currentHp));
                    el('rpgMaxHp').textContent = totalMaxHp;
                    el('rpgHpBar').style.width = Math.min(100, (currentHp / totalMaxHp) * 100) + '%';

                    el('rpgStatAtk').innerHTML = `${state.stats.atk} <span class="text-green-400 text-[10px]">${eq.atk > 0 ? '(+'+eq.atk+')' : ''}</span>`;
                    el('rpgCostAtk').textContent = state.costs.atk;
                    el('rpgStatHp').innerHTML = `${state.stats.maxHp} <span class="text-green-400 text-[10px]">${eq.maxHp > 0 ? '(+'+eq.maxHp+')' : ''}</span>`;
                    el('rpgCostHp').textContent = state.costs.hp;
                    el('rpgStatRegen').innerHTML = `${state.stats.regen} <span class="text-green-400 text-[10px]">${eq.regen > 0 ? '(+'+eq.regen+')' : ''}</span>`;
                    el('rpgCostRegen').textContent = state.costs.regen;
                    el('rpgStatCrit').textContent = state.stats.crit;
                    el('rpgCostCrit').textContent = state.costs.crit;
                    
                    if(state.quest) {
                        el('rpgQuestName').textContent = state.quest.active ? state.quest.name : 'Quest Complete!';
                        el('rpgQuestProg').textContent = state.quest.progress;
                        el('rpgQuestTgt').textContent = state.quest.target;
                        el('rpgQuestBar').style.width = Math.min(100, (state.quest.progress / state.quest.target) * 100) + '%';
                        if(!state.quest.active) {
                            el('rpgQuestName').classList.remove('text-green-400');
                            el('rpgQuestName').classList.add('text-yellow-400');
                        } else {
                            el('rpgQuestName').classList.add('text-green-400');
                        }

                        if(el('rpgQuestTabName')) {
                            el('rpgQuestTabName').textContent = state.quest.active ? state.quest.name : 'Completed!';
                            el('rpgQuestTabProg').textContent = state.quest.progress;
                            el('rpgQuestTabTgt').textContent = state.quest.target;
                            el('rpgQuestTabBar').style.width = Math.min(100, (state.quest.progress / state.quest.target) * 100) + '%';
                            el('rpgQuestTabReward').innerHTML = `<i data-feather="database" class="w-3 h-3 inline pb-0.5"></i> ${100 * state.level}g <span class="text-teal-400 ml-1"><i data-feather="hexagon" class="w-3 h-3 inline pb-0.5"></i> ${state.level * 50}</span>`;
                        }
                    }

                    // Update Equip slots text
                    const types = ['weapon', 'accessory', 'relic', 'class'];
                    const slotMap = { weapon: 'Sword', accessory: 'Accessory', relic: 'Relic', class: 'Class' };
                    types.forEach(t => {
                        const id = state.equipped[t];
                        const elSlot = el('eqSlot' + slotMap[t]);
                        if(elSlot) {
                            if(!id) {
                                elSlot.innerHTML = 'None';
                            } else {
                                const item = state.inventory.find(i=>i.id === id);
                                if(item) {
                                     let rarityC = 'text-gray-300';
                                     if(item.rarity === 'Uncommon') rarityC = 'text-green-400';
                                     if(item.rarity === 'Rare') rarityC = 'text-blue-400';
                                     if(item.rarity === 'Epic') rarityC = 'text-purple-400';
                                     if(item.rarity === 'Legendary') rarityC = 'text-yellow-400';
                                     elSlot.innerHTML = `<span class="${rarityC}">T${item.tier} ${item.name}</span>`;
                                } else elSlot.innerHTML = 'None';
                            }
                        }
                    });

                    if(el('rpgInvCount')) el('rpgInvCount').textContent = `(${state.inventory.length})`;
                    if (window.zsFilterInv && window.currentInvFilter) window.zsFilterInv(window.currentInvFilter, true); // true = lazy update layout
                    if(window.feather) window.feather.replace();
                }

                function startBattle() {
                    const isBoss = state.killsInStage >= 10;
                    const baseHp = 40 * Math.pow(1.2, state.stage - 1);
                    const eHp = isBoss ? baseHp * 5 : baseHp;
                    const baseAtk = 2 * Math.pow(1.15, state.stage - 1);
                    const eAtk = isBoss ? baseAtk * 3 : baseAtk;

                    enemy = {
                         name: isBoss ? `Stage ${state.stage} Boss` : 'Monster',
                         maxHp: eHp,
                         hp: eHp,
                         atk: eAtk,
                         isBoss: isBoss,
                         goldReward: (isBoss ? 50 : 5) * Math.pow(1.1, state.stage - 1),
                         xpReward: (isBoss ? 50 : 10) * Math.pow(1.1, state.stage - 1),
                         gemReward: isBoss ? Math.floor(20 * Math.pow(1.1, state.stage - 1)) : 0
                    };
                    log(`[${enemy.name}] appeared! (HP: ${Math.floor(enemy.hp)})`, isBoss ? 'text-purple-400 font-bold' : 'text-gray-400');
                }

                function combatTick() {
                    if (!enemy) startBattle();
                    const eq = getEquipStats();
                    const totalMaxHp = state.stats.maxHp + eq.maxHp;
                    const totalAtk = state.stats.atk + eq.atk;
                    const totalRegen = state.stats.regen + eq.regen;

                    if (currentHp <= 0) {
                        log('You fainted! Resting to recover...', 'text-red-400');
                        currentHp = totalMaxHp;
                        state.stage = Math.max(1, state.stage - 1); // Fallback a stage on death
                        state.killsInStage = 0;
                        enemy = null;
                        updateUI();
                        saveGame();
                        return;
                    }

                    // Player Turn
                    currentHp = Math.min(totalMaxHp, currentHp + totalRegen); // Regen
                    
                    let dmg = totalAtk;
                    let isCrit = Math.random() * 100 < state.stats.crit;
                    if (isCrit) dmg *= 2; // Simple 2x crit multiplier
                    
                    enemy.hp -= dmg;
                    log(`You hit ${enemy.name} for ${Math.floor(dmg)} dmg!${isCrit ? ' (CRIT!)' : ''}`, isCrit ? 'text-yellow-400' : 'text-white');

                    if (enemy.hp <= 0) {
                        log(`You defeated ${enemy.name}! Gained ${Math.floor(enemy.goldReward)}g & ${Math.floor(enemy.xpReward)}xp.`, 'text-green-400');
                        state.gold += enemy.goldReward;
                        state.xp += enemy.xpReward;
                        if(enemy.gemReward > 0) {
                             state.gems += enemy.gemReward;
                             log(`Boss dropped ${enemy.gemReward} Gems!`, 'text-teal-400 font-bold');
                        }
                        
                        // Quest Progress Updates
                        if (state.quest && state.quest.active) {
                            state.quest.progress++;
                            if (state.quest.progress >= state.quest.target) {
                                state.quest.active = false;
                                const questRewardGold = 100 * state.level;
                                const questRewardGems = state.level * 50;
                                state.gold += questRewardGold;
                                state.gems += questRewardGems;
                                log(`QUEST COMPLETE! Target Reached. Gained ${questRewardGold}g & ${questRewardGems} Gems!`, 'text-yellow-400 font-bold bg-yellow-500/10 p-1 rounded mt-1 mb-1');
                                // Generate next Quest
                                setTimeout(() => {
                                    state.quest = {
                                        name: `Slayer Rank ${state.level + 1}`,
                                        progress: 0,
                                        target: Math.floor(50 * Math.pow(1.2, state.level)),
                                        active: true
                                    };
                                    updateUI();
                                    saveGame();
                                    log(`New Quest Assigned: ${state.quest.name}`, 'text-green-400 italic');
                                }, 3000);
                            }
                        }

                        if (enemy.isBoss) {
                            state.stage++;
                            state.killsInStage = 0;
                            log(`STAGE CLEARED! Advancing to Stage ${state.stage}.`, 'text-blue-400 font-bold drop-shadow-sm');
                        } else {
                            state.killsInStage++;
                        }

                        // Level Up check
                        while (state.xp >= getNextXp()) {
                            state.xp -= getNextXp();
                            state.level++;
                            state.stats.atk += 2;
                            state.stats.maxHp += 20;
                            currentHp = state.stats.maxHp + eq.maxHp;
                            log(`LEVEL UP! You are now Level ${state.level}!`, 'text-pink-400 font-bold text-center bg-pink-500/10 rounded py-0.5 mt-1');
                        }
                        
                        enemy = null;
                        updateUI();
                        saveGame();
                        return;
                    }

                    // Enemy Turn
                    currentHp -= enemy.atk;
                    log(`${enemy.name} hits you for ${Math.floor(enemy.atk)} dmg!`, 'text-red-300');
                    updateUI();
                }

                // Global Hook: Tab Switcher
                window.zyloSlayerTab = (tabMode) => {
                    const tabs = ['Play', 'Stats', 'Equip', 'Summon', 'Quests', 'Settings'];
                    tabs.forEach(t => {
                        const elContent = el(`zsContent${t}`);
                        const elBtn = el(`zsTab${t}`);
                        if(elContent) elContent.classList.add('hidden');
                        if(elBtn) {
                            elBtn.classList.remove('text-purple-400', 'border-purple-500');
                            elBtn.classList.add('text-discord-gray-400', 'border-transparent');
                        }
                    });
                    
                    const capTab = tabMode.charAt(0).toUpperCase() + tabMode.slice(1);
                    if(el(`zsContent${capTab}`)) el(`zsContent${capTab}`).classList.remove('hidden');
                    if(el(`zsTab${capTab}`)) {
                        el(`zsTab${capTab}`).classList.remove('text-discord-gray-400', 'border-transparent');
                        el(`zsTab${capTab}`).classList.add('text-purple-400', 'border-purple-500');
                    }
                };

                // Summon Hook
                window.zyloSlayerSummon = (times) => {
                    const cost = times * 100;
                    if(state.gems < cost) return alert("Not enough Gems! Defeat Bosses or clear Quests to earn more.");
                    state.gems -= cost;
                    
                    const slots = ['weapon', 'accessory', 'relic', 'class'];
                    const slotNames = { weapon: 'Sword', accessory: 'Ring', relic: 'Relic', class: 'Amulet' };
                    let results = [];

                    for(let i=0; i<times; i++) {
                        const roll = Math.random();
                        let rarity = 'Common';
                        let statMult = 1;
                        if(roll > 0.5) { rarity = 'Uncommon'; statMult = 1.5; }
                        if(roll > 0.8) { rarity = 'Rare'; statMult = 3; }
                        if(roll > 0.95) { rarity = 'Epic'; statMult = 8; }
                        if(roll > 0.99) { rarity = 'Legendary'; statMult = 20; }
                        
                        const slot = slots[Math.floor(Math.random() * slots.length)];
                        const item = {
                            id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                            type: slot,
                            rarity,
                            tier: 1,
                            name: `${rarity} ${slotNames[slot]}`,
                            atk: 0, hp: 0, regen: 0
                        };

                        if(slot === 'weapon') item.atk = Math.floor(10 * statMult);
                        if(slot === 'relic') item.regen = Math.floor(1 * statMult);
                        if(slot === 'class') item.hp = Math.floor(100 * statMult);
                        if(slot === 'accessory') {
                             item.atk = Math.floor(5 * statMult);
                             item.hp = Math.floor(50 * statMult);
                        }
                        
                        state.inventory.push(item);
                        results.push(item);
                    }
                    
                    log(`Summoned ${times} items!`, 'text-teal-400 font-bold');
                    const resArea = el('summonResultArea');
                    if(resArea) {
                         const highest = results.sort((a,b)=>b.atk+b.hp - (a.atk+a.hp))[0];
                         resArea.innerHTML = `<span class="text-teal-400 text-sm font-bold animate-pulse">Got: ${highest.rarity} ${highest.name}!</span>`;
                    }
                    updateUI();
                    saveGame();
                };

                // Filter Inventory List
                window.zsFilterInv = (type, lazy = false) => {
                     window.currentInvFilter = type; // remember filter
                     
                     const list = el('rpgInventoryList');
                     if(!list) return;

                     const items = state.inventory.filter(i => i.type === type).sort((a,b) => b.tier - a.tier || (b.atk+b.hp) - (a.atk+a.hp));
                     if(items.length === 0) {
                          list.innerHTML = `<div class="text-center text-discord-gray-500 text-xs py-4">No ${type}s found.</div>`;
                          return;
                     }

                     // Group by identical items for crafting
                     let html = '';
                     const groups = {};
                     items.forEach(i => {
                          const key = i.name + '_' + i.tier;
                          if(!groups[key]) groups[key] = [];
                          groups[key].push(i);
                     });

                     Object.values(groups).forEach(group => {
                          const i = group[0];
                          const count = group.length;
                          let rarityC = 'text-gray-300';
                          if(i.rarity === 'Uncommon') rarityC = 'text-green-400';
                          if(i.rarity === 'Rare') rarityC = 'text-blue-400';
                          if(i.rarity === 'Epic') rarityC = 'text-purple-400';
                          if(i.rarity === 'Legendary') rarityC = 'text-yellow-400';

                          const isEquipped = state.equipped[type] === i.id;
                          
                          let statsStr = '';
                          if(i.atk > 0) statsStr += `+${i.atk} Atk `;
                          if(i.hp > 0) statsStr += `+${i.hp} HP `;
                          if(i.regen > 0) statsStr += `+${i.regen} Reg `;

                          html += `
                          <div class="flex justify-between items-center bg-discord-gray-800 p-2 rounded border border-white/5 ${isEquipped ? 'border-purple-500 bg-purple-500/10' : ''}">
                              <div>
                                  <div class="${rarityC} font-bold text-xs hover:underline cursor-pointer" onclick="window.zyloSlayerEquip('${type}', '${i.id}')">T${i.tier} ${i.name} ${count > 1 ? `<span class="text-discord-gray-400 text-[10px]">x${count}</span>` : ''}</div>
                                  <div class="text-[10px] text-discord-gray-400">${statsStr.trim()}</div>
                              </div>
                              <div class="flex gap-1 items-center">
                                  ${count >= 5 ? `<button onclick="window.zyloSlayerCraft('${i.id}')" class="text-[10px] bg-yellow-500/20 text-yellow-500 font-bold px-2 py-1.5 rounded hover:bg-yellow-500/40 transition">Merge 5</button>` : ''}
                                  ${isEquipped ? `<button onclick="window.zyloSlayerEquip('${type}', null)" class="text-[10px] bg-red-500/20 text-red-500 px-2 py-1.5 rounded hover:bg-red-500/40 transition">Unequip</button>` : `<button onclick="window.zyloSlayerEquip('${type}', '${i.id}')" class="text-[10px] bg-white/10 text-white px-2 py-1.5 rounded hover:bg-white/20 transition">Equip</button>`}
                              </div>
                          </div>`;
                     });
                     list.innerHTML = html;
                };

                // Equip Item Hook
                window.zyloSlayerEquip = (type, id) => {
                     state.equipped[type] = id;
                     const currentMaxHp = state.stats.maxHp + getEquipStats().maxHp;
                     currentHp = Math.min(currentHp, currentMaxHp);
                     updateUI();
                     saveGame();
                     if(id) log("Equipped item.", "text-gray-400");
                };

                // Craft / Merge Hook
                window.zyloSlayerCraft = (sampleId) => {
                     const sample = state.inventory.find(i => i.id === sampleId);
                     if(!sample) return;
                     const identicals = state.inventory.filter(i => i.name === sample.name && i.tier === sample.tier);
                     if(identicals.length < 5) return;
                     
                     // remove 5
                     for(let count=0; count<5; count++) {
                         const toRemove = identicals[count].id;
                         const idx = state.inventory.findIndex(i => i.id === toRemove);
                         if(idx > -1) state.inventory.splice(idx, 1);
                         if(state.equipped[sample.type] === toRemove) state.equipped[sample.type] = null; // unequip if consumed
                     }

                     // add upgraded
                     const newItem = {
                          id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                          type: sample.type,
                          rarity: sample.rarity,
                          tier: sample.tier + 1,
                          name: sample.name,
                          atk: sample.atk * 2,
                          hp: sample.hp * 2,
                          regen: sample.regen * 2
                     };
                     state.inventory.push(newItem);
                     log(`Forged T${newItem.tier} ${newItem.name}!`, 'text-yellow-400 font-bold drop-shadow');
                     
                     updateUI();
                     saveGame();
                };

                // Global Buy Hook (Armory)
                window.zyloSlayerBuy = (type) => {
                    const cost = state.costs[type];
                    if (state.gold >= cost) {
                        state.gold -= cost;
                        if (type === 'atk') { state.stats.atk += 5; state.costs.atk = Math.floor(cost * 1.5); }
                        if (type === 'hp') { state.stats.maxHp += 50; state.costs.hp = Math.floor(cost * 1.5); currentHp += 50; }
                        if (type === 'regen') { state.stats.regen += 2; state.costs.regen = Math.floor(cost * 2.5); }
                        if (type === 'crit') { 
                            if (state.stats.crit < 100) { state.stats.crit += 1; state.costs.crit = Math.floor(cost * 1.8); }
                            else { alert("Max Crit Reached."); state.gold += cost; }
                        }
                        updateUI();
                        saveGame();
                    }
                };

                // Hard Reset Hook
                window.zyloSlayerReset = () => {
                    if (confirm("Are you sure you want to completely erase your Zylo Slayer progress?")) {
                        localStorage.removeItem('zylo_slayer_save');
                        if (window.zyloslayerInterval) clearInterval(window.zyloslayerInterval);
                        closeAppModal();
                    }
                };

                updateUI();
                window.zyloslayerInterval = setInterval(combatTick, 1000); // 1 tick per second
            },
            destroy: () => {
                if (window.zyloslayerInterval) clearInterval(window.zyloslayerInterval);
                delete window.zyloSlayerBuy;
                delete window.zyloSlayerReset;
                delete window.zyloSlayerTab;
                delete window.zyloSlayerEquip;
                delete window.zyloSlayerSummon;
                delete window.zyloSlayerCraft;
                delete window.zsFilterInv;
            }
        }
    };

    const app = apps[appName];
    if (!app) return;

    if (window.currentAppRef && window.currentAppRef.destroy) {
        window.currentAppRef.destroy();
    }

    window.currentAppRef = app;
    title.textContent = app.title;
    content.innerHTML = app.render();
    modal.classList.remove('hidden');

    if (app.init) {
        setTimeout(app.init, 0); // Allow DOM to repaint before init
    }

    feather.replace();
}

function closeAppModal() {
    if (window.currentAppRef && window.currentAppRef.destroy) {
        window.currentAppRef.destroy();
    }
    document.getElementById('appsModal').classList.add('hidden');
    currentApp = null;
    window.currentAppRef = null;
}

// Calculator functions
var calcValue = '0';
function calcPress(btn) {
    const display = document.getElementById('calcDisplay');
    if (btn === 'C') {
        calcValue = '0';
    } else if (btn === '=') {
        try { calcValue = String(eval(calcValue)); } catch { calcValue = 'Error'; }
    } else {
        if (calcValue === '0' && !btn.match(/[+\-*/]/)) calcValue = btn;
        else calcValue += btn;
    }
    display.value = calcValue;
}

// Speed test (simulated)
function runSpeedTest() {
    const result = document.getElementById('speedResult');
    result.textContent = '...';
    let i = 0;
    const interval = setInterval(() => {
        result.textContent = Math.floor(Math.random() * 100 + 50);
        i++;
        if (i > 20) {
            clearInterval(interval);
            result.textContent = Math.floor(Math.random() * 50 + 75);
        }
    }, 100);
}

// Notes functions
function saveNotes() {
    const notes = document.getElementById('quickNotes').value;
    localStorage.setItem('quickNotes', notes);
    alert('Notes saved!');
}

// Timer functions
var timerInterval = null;
var timerRemaining = 0;
function startTimer() {
    if (timerInterval) return;
    const mins = parseInt(document.getElementById('timerMinutes').value) || 0;
    const secs = parseInt(document.getElementById('timerSeconds').value) || 0;
    timerRemaining = mins * 60 + secs;
    timerInterval = setInterval(tickTimer, 1000);
}
function tickTimer() {
    if (timerRemaining <= 0) {
        stopTimer();
        alert('Timer finished!');
        return;
    }
    timerRemaining--;
    const m = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
    const s = String(timerRemaining % 60).padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${m}:${s}`;
}
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
function resetTimer() {
    stopTimer();
    document.getElementById('timerDisplay').textContent = '00:00';
    timerRemaining = 0;
}

// Color picker functions
function updateColorPreview() {
    const color = document.getElementById('colorInput').value;
    document.getElementById('colorPreview').style.backgroundColor = color;
    document.getElementById('colorHex').value = color;
}
function updateFromHex() {
    const hex = document.getElementById('colorHex').value;
    document.getElementById('colorInput').value = hex;
    document.getElementById('colorPreview').style.backgroundColor = hex;
}
function copyColor() {
    const hex = document.getElementById('colorHex').value;
    navigator.clipboard.writeText(hex).then(() => alert('Copied: ' + hex));
}

// Close app modal on click outside
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('appsModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'appsModal') closeAppModal();
    });
});
