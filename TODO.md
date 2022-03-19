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
- [x] SoloEncounterState { encounterName, player, allyStates { [ characterId: { hp, energy, afflictions } ] }, enemyStates { [ index: { hp, energy, afflictions } ] }, isComplete }

### Required Classes

- [x] Skill { name, slot, effect, passive=false, element=Elements.NONE, weaponType=WeaponTypes.NONE, emoji=null, canTargetAllies=false, power=0, accuracy=null, cooldown=0, energyReward=0, energyCost=0 }
- [ ] SoloEncounter (handles all interactions with solo encounter state)
- [x] async .create(playerId: number, encounterName: string) (constructor)
- [x] async .startEncounter(ctx)
- [ ] async .getActionOrder() => [ { index: number, party: Parties } ]
- [ ] async .handlePlayerInput(move: Move, target?: Number)
- [ ] async .chooseActions()
