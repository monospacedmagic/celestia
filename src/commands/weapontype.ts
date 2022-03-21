import {
  SlashCommand,
  SlashCreator,
  CommandContext,
  ComponentType,
  ApplicationCommandPermissionType
} from 'slash-create';
import { prisma } from '../db';
import { WeaponType, WeaponTypes } from '../models';

export default class WeaponTypeCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'weapontype',
      description: 'Allows the player to choose a weapon type.',
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
      '<:celestia:945101835763580998> Es ist Zeit, dich für einen Waffentyp zu entscheiden. <:celestia:945101835763580998>',
      {
        components: [
          {
            type: ComponentType.ACTION_ROW,
            components: [
              {
                type: ComponentType.SELECT,
                custom_id: 'weapontype_select',
                placeholder: 'Wähle einen Waffentyp',
                min_values: 1,
                max_values: 1,
                options: [
                  {
                    label: 'Sword',
                    value: 'sword',
                    emoji: WeaponTypes.SWORD
                  },
                  {
                    label: 'Claymore',
                    value: 'claymore',
                    emoji: WeaponTypes.CLAYMORE
                  },
                  {
                    label: 'Polearm',
                    value: 'polearm',
                    emoji: WeaponTypes.POLEARM
                  },
                  {
                    label: 'Bow',
                    value: 'bow',
                    emoji: WeaponTypes.BOW
                  },
                  {
                    label: 'Catalyst',
                    value: 'catalyst',
                    emoji: WeaponTypes.CATALYST
                  }
                ]
              }
            ]
          }
        ]
      }
    );
    ctx.registerComponent('weapontype_select', async (selectCtx) => {
      let player = await prisma.player.findUnique({
        where: {
          userId: Number(selectCtx.user.id)
        }
      });
      if (player) {
        await selectCtx.send('Du hast bereits einen Waffentyp ausgewählt.', { ephemeral: true });
        return;
      }
      await prisma.player.upsert({
        where: {
          userId: Number(selectCtx.user.id)
        },
        update: {
          weaponType: WeaponType[selectCtx.values[0].toUpperCase()]
        },
        create: {
          userId: Number(selectCtx.user.id),
          weaponType: WeaponType[selectCtx.values[0].toUpperCase()]
        }
      });
      await selectCtx.editParent(
        `Dein ausgewählter Waffentyp ist: **${
          selectCtx.values[0].charAt(0).toUpperCase() + selectCtx.values[0].slice(1)
        }**`,
        { components: [] }
      );
    });
  }
}
