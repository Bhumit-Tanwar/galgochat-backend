export const generateUsername = () => {
  const first = [
  "Cool","Epic","Silent","Dark","Swift","Brave","Fierce","Shadow","Neon","Crimson",
  "Frozen","Electric","Savage","Royal","Golden","Iron","Mystic","Lone","Rapid","Wild",
  "Cyber","Stealth","Inferno","Storm","Phantom","Rogue","Prime","Ultra","Alpha","Omega",
  "Blaze","Venom","Solar","Lunar","Titan","Turbo","Vortex","Glitch","Pixel","Quantum",
  "Hyper","Mega","Nitro","Thunder","Steel","Ghostly","Obsidian","Ivory","Scarlet","Azure",
  "Midnight","Echo","Nova","Radiant","Grim","Frost","Blizzard","Ember","Shadowed","Astral",
  "Cosmic","Arcane","Turbocharged","Venator","Void","Warp","Spectral","Zen","Savvy",
  "Raging","Untamed","Fearless","Electric","Atomic","Steady","Feral","SavageX","SilentX",
  "Darkened","RapidX","Clever","Sharp","Bold","Ruthless","Unseen","Hidden","Infinite",
  "Supreme","Legendary","Mythic","Deadly","Fearsome","Chill","IceCold","Fireborn",
  "Stormy","Unholy","Sacred","Rebel","SavagePrime","Elite","Tactical","Lethal"
];

  const second = [
  "Nova","Eagle","Ghost","Wolf","Falcon","Tiger","Dragon","Phoenix","Viper","Panther",
  "Raven","Hawk","Cobra","Lion","Shark","Hydra","Kraken","Cyclone","Blaze","Storm",
  "Shadow","Specter","Hunter","Sniper","Assassin","Reaper","Knight","Samurai","Ninja",
  "Gladiator","Titan","Raptor","Sentinel","Wraith","Striker","Predator","Warrior",
  "Destroyer","Raider","Nomad","Outlaw","Phantom","Avenger","Guardian","Berserker",
  "Rogue","Commander","Overlord","Enigma","Oracle","Beast","Colossus","Juggernaut",
  "Marauder","Ranger","Stalker","Slayer","Invoker","Tempest","Vanguard","Monarch",
  "Executioner","Spectator","Ronin","Centurion","Paladin","Archon","Shade","Drifter",
  "Blitz","Fury","Howler","Scorpion","Jackal","Leviathan","Wyvern","Griffin","Minotaur",
  "Basilisk","Cerberus","Anubis","Ares","Hades","Zeus","Odin","Thor","Loki","Atlas",
  "Hermes","Apollo","Spartan","Trooper","Operator","Agent","Cipher","Protocol","Matrix",
  "Core","Pulse","Signal","Vector","Binary","Kernel","Script","Daemon","Bot","AI"
];


  return (
    first[Math.floor(Math.random() * first.length)] +
    second[Math.floor(Math.random() * second.length)] +
    Math.floor(1000 + Math.random() * 9000)
  );
};
