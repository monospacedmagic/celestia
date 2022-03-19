import {
  SlashCommand,
  SlashCreator,
  CommandContext,
  ComponentType,
  ApplicationCommandPermissionType
} from 'slash-create';
import { prisma } from '../db';
import { Element, Elements } from '../models';

export default class VisionCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'vision',
      description: 'Allows the player to choose a vision.',
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
    await ctx.send('<:celestia:945101835763580998> Die Zeit ist gekommen, Reisende. <:celestia:945101835763580998>', {
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.SELECT,
              custom_id: 'vision_select',
              placeholder: 'Wähle eine Vision',
              min_values: 1,
              max_values: 1,
              options: [
                {
                  label: 'Pyro',
                  value: 'pyro',
                  emoji: Elements.PYRO
                },
                {
                  label: 'Geo',
                  value: 'geo',
                  emoji: Elements.GEO
                },
                {
                  label: 'Dendro',
                  value: 'dendro',
                  emoji: Elements.DENDRO
                },
                {
                  label: 'Cryo',
                  value: 'cryo',
                  emoji: Elements.CRYO
                },
                {
                  label: 'Electro',
                  value: 'electro',
                  emoji: Elements.ELECTRO
                },
                {
                  label: 'Anemo',
                  value: 'anemo',
                  emoji: Elements.ANEMO
                },
                {
                  label: 'Hydro',
                  value: 'hydro',
                  emoji: Elements.HYDRO
                }
              ]
            }
          ]
        }
      ]
    });
    ctx.registerComponent('vision_select', async (selectCtx) => {
      let player = await prisma.player.findUnique({
        where: {
          userId: Number(selectCtx.user.id)
        }
      });
      if (player) {
        await selectCtx.send('Du hast bereits deine Vision empfangen.', { ephemeral: true });
        return;
      }
      await prisma.player.upsert({
        where: {
          userId: Number(selectCtx.user.id)
        },
        update: {
          element: Element[selectCtx.values[0].toUpperCase()]
        },
        create: {
          userId: Number(selectCtx.user.id),
          element: Element[selectCtx.values[0].toUpperCase()]
        }
      });
      await selectCtx.editParent(
        `Your vision is: **${selectCtx.values[0].charAt(0).toUpperCase() + selectCtx.values[0].slice(1)}**`,
        { components: [] }
      );
    });
  }
}
