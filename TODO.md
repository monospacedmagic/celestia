### Required commands

- [ ] /character create
- [ ] /character edit
- [ ] /skill create
- [ ] /skill edit
- [ ] /skill assign
- [ ] /setparty
- [ ] /leaveparty
- [ ] /joinparty
- [ ] /encounter create
- [ ] /encounter start <id>

### Required Models

- [x] Character { id, name, element, weaponType, maxHP, skills, defaultAffliction }
- [x] Affliction enum
- [x] Encounter { name, title, enemies }
- [x] SoloEncounterState { encounterName, player, allyStates { [ index: { hp, energy, afflictions } ] }, enemyStates { [ index: { hp, energy, afflictions } ] }, isComplete }

### Required Classes

- [ ] Skill { name, slot, passive=false, element=Elements.NONE, weaponType=WeaponTypes.NONE, emoji=null, canTargetAllies=false, power=0, accuracy=null, cooldown=0, energyReward=0, energyCost=0 }
- [ ] EncounterController (handles all interactions with encounter state) (only solo encounters for now)
- [ ] .loadState(playerId: number)
- [ ] .startEncounter(ctx)
- [ ] .getActionOrder() => [ { index: number, party: Parties } ]
- [ ] .handlePlayerInput(move: Move, target?: Number)
- [ ] .chooseActions()
