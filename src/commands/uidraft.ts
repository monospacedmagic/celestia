import {
  SlashCommand,
  CommandOptionType,
  SlashCreator,
  CommandContext,
  ComponentType,
  ButtonStyle,
  ApplicationCommandPermissionType
} from 'slash-create';
import { Elements, WeaponTypes, Parties } from '../db';

export default class UiDraftCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'uidraft',
      description: 'UI draft for combat system',
      options: [],
      defaultPermission: false,
      permissions: {
        '910170342524338256': [
          {
            type: ApplicationCommandPermissionType.USER,
            id: '506153885279191050',
            permission: true
          },
          {
            type: ApplicationCommandPermissionType.USER,
            id: '419958551390191646',
            permission: true
          },
          {
            type: ApplicationCommandPermissionType.USER,
            id: '178570824758853632',
            permission: true
          },
          {
            type: ApplicationCommandPermissionType.USER,
            id: '172003635826393089',
            permission: true
          }
        ],
        '924756730657771581': [
          {
            type: ApplicationCommandPermissionType.USER,
            id: '506153885279191050',
            permission: true
          },
          {
            type: ApplicationCommandPermissionType.USER,
            id: '172003635826393089',
            permission: true
          }
        ]
      }
    });
  }

  async run(ctx: CommandContext) {
    await ctx.defer();
    await ctx.send(
      '<:celestia:945101835763580998> ***Kampfbeginn*** <:celestia:945101835763580998>\n\n' +
        +'**Zugreihenfolge**\n' +
        `${Elements.ANEMO}${WeaponTypes.POLEARM}┊██████████┊${Parties.ALLY} **Xiao** (0/20)\n` +
        `${Elements.HYDRO}${WeaponTypes.BOW}┊██████████┊${Parties.ALLY} **Ren** (0/30)\n` +
        `${Elements.GEO}${WeaponTypes.CLAYMORE}┊██████████┊${Parties.ALLY} **2B** (0/40)\n` +
        `${Elements.ELECTRO}${WeaponTypes.POLEARM}┊██████████┊${Parties.ALLY} **Ei** (0/45)\n` +
        `${Elements.ANEMO}${WeaponTypes.NONE}┊██████████┊${Parties.ENEMY} **Anemo-Schleim**\n` +
        `${Elements.PYRO}${WeaponTypes.NONE}┊██████████┊${Parties.ENEMY} **Pyro-Schleim** [${Elements.PYRO}]\n` +
        `${Elements.HYDRO}${WeaponTypes.NONE}┊██████████┊${Parties.ENEMY} **Hydro-Schleim** [${Elements.HYDRO}]\n` +
        `${Elements.GEO}${WeaponTypes.NONE}┊██████████┊${Parties.ENEMY} **Geo-Schleim**`,
      {
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.SELECT,
                custom_id: 'attack_1_select',
                placeholder: 'Angriff: Anemo-Schleim',
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    label: 'Vakuumwelle',
                    value: '0',
                    description: 'Anemo-Angriff, gibt 2 Elementarenergie bei Treffer',
                    emoji: Elements.ANEMO
                  },
                  {
                    label: 'Vakuumsog',
                    value: '1',
                    description: 'Entfernt Pyro/Cryo/Electro/Hydro, gibt 3 Elementarenergie bei Erfolg',
                    emoji: Elements.ANEMO
                  }
                ]
              }
            ]
          },
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.SELECT,
                custom_id: 'attack_2_select',
                placeholder: 'Angriff: Pyro-Schleim',
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    label: 'Vakuumwelle',
                    value: '0',
                    description: 'Anemo-Angriff, gibt 2 Elementarenergie bei Treffer',
                    emoji: Elements.ANEMO
                  },
                  {
                    label: 'Vakuumsog',
                    value: '1',
                    description: 'Entfernt Pyro/Cryo/Electro/Hydro, gibt 3 Elementarenergie bei Erfolg',
                    emoji: Elements.ANEMO
                  }
                ]
              }
            ]
          },
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.SELECT,
                custom_id: 'attack_3_select',
                placeholder: 'Angriff: Hydro-Schleim',
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    label: 'Vakuumwelle',
                    value: '0',
                    description: 'Anemo-Angriff, gibt 2 Elementarenergie bei Treffer',
                    emoji: Elements.ANEMO
                  },
                  {
                    label: 'Vakuumsog',
                    value: '1',
                    description: 'Entfernt Pyro/Cryo/Electro/Hydro, gibt 3 Elementarenergie bei Erfolg',
                    emoji: Elements.ANEMO
                  }
                ]
              }
            ]
          },
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.SELECT,
                custom_id: 'attack_4_select',
                placeholder: 'Angriff: Geo-Schleim',
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    label: 'Vakuumwelle',
                    value: '0',
                    description: 'Anemo-Angriff, gibt 2 Elementarenergie bei Treffer',
                    emoji: Elements.ANEMO
                  },
                  {
                    label: 'Vakuumsog',
                    value: '1',
                    description: 'Entfernt Pyro/Cryo/Electro/Hydro, gibt 3 Elementarenergie bei Erfolg',
                    emoji: Elements.ANEMO
                  }
                ]
              }
            ]
          },
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.SELECT,
                custom_id: 'special_move_select',
                placeholder: 'Spezialangriff / Manöver',
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    label: 'Windschnitt (0/30)',
                    value: '0',
                    description: 'Starker Anemo-Angriff auf alle Gegner',
                    emoji: Elements.ANEMO
                  },
                  {
                    label: 'Verteidigung',
                    value: '-1',
                    description: 'Lässt dich deinen Verbündeten helfen',
                    emoji: Parties.ALLY
                  }
                ]
              }
            ]
          }
        ]
      }
    );
  }
}
