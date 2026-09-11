// Bodovací tabulka
const POINT_VALUES = {
  "LT5": 1, "HT5": 2, "LT4": 3, "HT4": 5, "LT3": 10,
  "HT3": 16, "LT2": 24, "HT2": 32, "LT1": 48, "HT1": 60,
  "RLT2": 22, "RHT2": 29, "RLT1": 44, "RHT1": 54,
  "Peak HT3": 14, "Peak LT2": 22, "Peak HT2": 29, "Peak LT1": 44, "Peak HT1": 54
};

// Seznam Gamemodů a jejich ikony (obrázky nebo fa-icons)
const GAMEMODES = [
  { id: "overall", name: "Overall", icon: '<i class="fa-solid fa-trophy text-amber-400"></i>' },
  { id: "vanilla", name: "Vanilla", icon: '<i class="fa-solid fa-gem text-purple-400"></i>' },
  { id: "uhc", name: "UHC", icon: '<i class="fa-solid fa-heart text-red-500"></i>' },
  { id: "pot", name: "Pot", icon: '<i class="fa-solid fa-flask text-pink-400"></i>' },
  { id: "netheritepot", name: "NetheritePot", icon: '<i class="fa-solid fa-skull text-indigo-400"></i>' },
  { id: "smp", name: "SMP", icon: '<i class="fa-solid fa-compact-disc text-teal-400"></i>' },
  { id: "sword", name: "Sword", icon: '<i class="fa-solid fa-sword text-blue-400"></i>' },
  { id: "axe", name: "Axe", icon: '<i class="fa-solid fa-axe text-cyan-400"></i>' },
  { id: "mace", name: "Mace", icon: '<i class="fa-solid fa-hammer text-gray-400"></i>' },
  { id: "cart", name: "Cart", isCustomImg: true, src: "cart.png" },
  { id: "diasmp", name: "DiaSMP", isCustomImg: true, src: "diasmp.png" }
];

// DATA HRÁČŮ - Sem ručně přidáváš a upravuješ hráče!
const playersData = [
  {
    name: "Marlowww",
    region: "NA",
    tiers: {
      smp: { active: "HT1", peak: null },
      mace: { active: "HT1", peak: null },
      netheritepot: { active: "HT1", peak: "Peak HT1" },
      pot: { active: "HT1", peak: null },
      vanilla: { active: "HT1", peak: null },
      sword: { active: "HT1", peak: null },
      cart: { active: "LT1", peak: null },
      uhc: { active: "LT1", peak: null }
    }
  },
  {
    name: "ItzRealMe",
    region: "NA",
    tiers: {
      sword: { active: "HT3", peak: null },
      smp: { active: "HT1", peak: null },
      pot: { active: "HT1", peak: null },
      vanilla: { active: "HT1", peak: null },
      netheritepot: { active: "HT1", peak: null },
      mace: { active: "LT2", peak: null },
      uhc: { active: "LT2", peak: null },
      axe: { active: "LT2", peak: null }
    }
  }
];

let activeTab = "overall";

// Spočítá celkové body hráče
function calculatePoints(player) {
  let total = 0;
  for (let gm in player.tiers) {
    const tierObj = player.tiers[gm];
    if (tierObj.active) {
      total += POINT_VALUES[tierObj.active] || 0;
    }
  }
  return total;
}

// Titul podle bodů
function getRankTitle(points) {
  if (points >= 400) return "Combat Grandmaster";
  if (points >= 300) return "Combat Master";
  if (points >= 200) return "Combat Expert";
  if (points >= 100) return "Combat Ace";
  return "Combatant";
}

// Inicializace záložek
function renderTabs() {
  const container = document.getElementById("tabsContainer");
  container.innerHTML = GAMEMODES.map(gm => {
    const iconHtml = gm.isCustomImg 
      ? `<img src="${gm.src}" class="w-4 h-4 object-contain inline">` 
      : gm.icon;

    return `
      <button onclick="switchTab('${gm.id}')" 
              class="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${activeTab === gm.id ? 'bg-[#1f293d] text-white border border-gray-700' : 'text-gray-400 hover:text-gray-200'}">
        <span>${iconHtml}</span>
        <span>${gm.name}</span>
      </button>
    `;
  }).join('');
}

// Přepínání záložek
function switchTab(tabId) {
  activeTab = tabId;
  renderTabs();
  if (tabId === "overall") {
    document.getElementById("overallView").classList.remove("hidden");
    document.getElementById("gamemodeView").classList.add("hidden");
    renderOverall();
  } else {
    document.getElementById("overallView").classList.add("hidden");
    document.getElementById("gamemodeView").classList.remove("hidden");
    renderGamemodeTiers(tabId);
  }
}

// Render Hlavní Tabulky (Overall)
function renderOverall(filter = "") {
  const container = document.getElementById("overallView");
  
  const sorted = [...playersData]
    .map(p => ({ ...p, totalPoints: calculatePoints(p) }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  container.innerHTML = sorted.map((player, index) => {
    const rankTitle = getRankTitle(player.totalPoints);
    const avatarUrl = `https://mc-heads.net/avatar/${player.name}/40`;

    // Render ikon tierů pro hráče
    const tierIconsHtml = Object.entries(player.tiers).map(([gmId, tierData]) => {
      const gm = GAMEMODES.find(g => g.id === gmId);
      if (!gm || !tierData.active) return "";
      const icon = gm.isCustomImg 
        ? `<img src="${gm.src}" class="w-3.5 h-3.5 object-contain">` 
        : gm.icon;

      return `
        <div class="flex flex-col items-center group relative cursor-pointer" onclick="openPlayerModal('${player.name}')">
          <div class="w-7 h-7 bg-[#161b26] rounded-lg border border-gray-800 flex items-center justify-center">
            ${icon}
          </div>
          <span class="text-[9px] font-extrabold mt-0.5 text-amber-400">${tierData.active}</span>
        </div>
      `;
    }).join('');

    return `
      <div onclick="openPlayerModal('${player.name}')" 
           class="bg-[#131722] hover:bg-[#181d2b] border border-gray-800 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition">
        <div class="flex items-center space-x-4">
          <span class="text-lg font-black italic text-gray-500 w-6">#${index + 1}</span>
          <img src="${avatarUrl}" class="w-10 h-10 rounded-xl border border-gray-700">
          <div>
            <div class="font-bold text-white text-sm">${player.name}</div>
            <div class="text-xs text-amber-400/80 font-medium">❖ ${rankTitle} <span class="text-gray-500">(${player.totalPoints} pts)</span></div>
          </div>
        </div>

        <div class="flex items-center space-x-6">
          <span class="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-[10px] font-bold">${player.region}</span>
          <div class="hidden md:flex items-center space-x-2">
            ${tierIconsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Zobrazení konkrétního Gamemodu (Tier 1 až Tier 5)
function renderGamemodeTiers(gamemodeId) {
  const container = document.getElementById("gamemodeView");
  const tiers = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"];

  container.innerHTML = tiers.map((tierName, index) => {
    const tierNum = index + 1;

    // Filtrovat hráče pro tento gamemode a tier
    const playersInTier = playersData.filter(p => {
      const t = p.tiers[gamemodeId]?.active;
      return t && (t.includes(`${tierNum}`));
    });

    return `
      <div class="bg-[#131722] border border-gray-800 rounded-2xl p-3 flex flex-col">
        <h3 class="text-xs font-extrabold text-gray-400 uppercase border-b border-gray-800 pb-2 mb-3 text-center tracking-wider">${tierName}</h3>
        <div class="space-y-2 flex-1">
          ${playersInTier.map(p => {
            const tierCode = p.tiers[gamemodeId].active;
            const isHT = tierCode.startsWith("HT");
            const arrows = isHT ? "▲▲" : "▲";
            const avatarUrl = `https://mc-heads.net/avatar/${p.name}/24`;

            return `
              <div onclick="openPlayerModal('${p.name}')" class="flex items-center justify-between bg-[#161b26] p-2 rounded-xl border border-gray-800/60 hover:border-gray-700 cursor-pointer transition">
                <div class="flex items-center space-x-2">
                  <img src="${avatarUrl}" class="w-5 h-5 rounded">
                  <span class="text-xs font-semibold text-gray-200">${p.name}</span>
                </div>
                <span class="text-[10px] font-bold ${isHT ? 'text-amber-400' : 'text-blue-400'}">${arrows}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// Otevření profilového okna (Modal)
function openPlayerModal(playerName) {
  const player = playersData.find(p => p.name === playerName);
  if (!player) return;

  const totalPoints = calculatePoints(player);
  const sortedPlayers = [...playersData].sort((a, b) => calculatePoints(b) - calculatePoints(a));
  const pos = sortedPlayers.findIndex(p => p.name === playerName) + 1;

  document.getElementById("modalAvatar").src = `https://mc-heads.net/avatar/${player.name}/80`;
  document.getElementById("modalName").innerText = player.name;
  document.getElementById("modalRank").innerText = "❖ " + getRankTitle(totalPoints);
  document.getElementById("modalRegion").innerText = player.region === "NA" ? "North America" : "Europe";
  document.getElementById("modalPosition").innerText = `${pos}.`;
  document.getElementById("modalPoints").innerText = `(${totalPoints} points)`;

  const tiersContainer = document.getElementById("modalTiers");
  tiersContainer.innerHTML = Object.entries(player.tiers).map(([gmId, tierData]) => {
    const gm = GAMEMODES.find(g => g.id === gmId);
    if (!gm || !tierData.active) return "";

    const icon = gm.isCustomImg 
      ? `<img src="${gm.src}" class="w-4 h-4 object-contain">` 
      : gm.icon;

    // Detekce Active / Retired / Peak textu
    let statusText = `Active ${tierData.active}`;
    if (tierData.active.startsWith("R")) {
      statusText = `Retired ${tierData.active.replace('R', '')}`;
    }

    const pts = POINT_VALUES[tierData.active] || 0;

    return `
      <div class="relative group bg-[#161b26] p-2 rounded-xl border border-gray-800 flex flex-col items-center w-12">
        <!-- Peak Header Badge -->
        ${tierData.peak ? `<span class="text-[8px] text-amber-400 font-bold -mb-1">${tierData.peak}</span>` : ''}
        
        <div class="my-1">${icon}</div>
        <span class="text-[10px] font-bold text-amber-400">${tierData.active}</span>

        <!-- Tooltip po najetí myší -->
        <div class="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-black/90 text-white text-[10px] p-2 rounded border border-gray-700 whitespace-nowrap z-50 pointer-events-none">
          <span class="font-bold">${statusText}</span>
          <span class="text-gray-400">${pts} points</span>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById("playerModal").classList.remove("hidden");
}

// Zavření modalu
document.getElementById("closeModal").onclick = () => {
  document.getElementById("playerModal").classList.add("hidden");
};

// Vyhledávání hráčů
document.getElementById("searchInput").addEventListener("input", (e) => {
  if (activeTab === "overall") {
    renderOverall(e.target.value);
  }
});

// Start
renderTabs();
renderOverall();
