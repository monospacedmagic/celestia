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

- [ ] Character { id, name, element, weaponType, maxHP, skills, defaultAffliction }
- [ ] Skill { id, name, element, weaponType, power, accuracy, energyReward, canTargetAllies, isSpecialMove, energyCost }
- [ ] Encounter { name, title, enemies }
- [ ] SoloEncounterState { encounterName, player, allyStates { [ number: { hp, energy, afflictions } ] }, enemyStates { [ number: { hp, energy, afflictions } ] }, isComplete }

### Required Classes

- [ ] Encounter
