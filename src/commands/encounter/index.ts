import {
  AutocompleteContext,
  CommandContext,
  CommandOptionType,
  ComponentContext,
  SlashCommand,
  SlashCreator
} from 'slash-create';
import { prisma } from '../../db';
import { SoloEncounter } from '../../models';
import { asyncpartial } from '../../util';

export default class EncounterCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'encounter',
      description: 'Commands related to encounters',
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'start',
          description: 'Start a new encounter instance',
          options: [
            {
              name: 'player',
              description: 'Who will play this encounter?',
              type: CommandOptionType.USER,
              required: true
            },
            {
              name: 'encounter_name',
              description: 'The name of the encounter',
              type: CommandOptionType.STRING,
              required: true,
              autocomplete: true
            }
          ]
        }
      ]
    });
    this.creator.registerGlobalComponent('attack_0_select', asyncpartial(this.attackCallback, 0));
    this.creator.registerGlobalComponent('attack_1_select', asyncpartial(this.attackCallback, 1));
    this.creator.registerGlobalComponent('attack_2_select', asyncpartial(this.attackCallback, 2));
    this.creator.registerGlobalComponent('attack_3_select', asyncpartial(this.attackCallback, 3));
    this.creator.registerGlobalComponent('special_move_select', asyncpartial(this.attackCallback, 4));
  }

  async attackCallback(attackNumber: number, ctx: ComponentContext) {
    var soloEncounter: SoloEncounter | null = await SoloEncounter.fetch(BigInt(ctx.user.id), BigInt(ctx.message.id));
    if (!soloEncounter) {
      await ctx.send('Du bist nicht Teil dieser Begegnung.', { ephemeral: true });
      return;
    }
    await soloEncounter.handlePlayerInput(attackNumber, ctx.values[0]);
    await soloEncounter.updateEncounter(ctx);
  }

  async autocomplete(ctx: AutocompleteContext): Promise<string[]> {
    switch (ctx.subcommands[0]) {
      case 'start':
        return await this.autocompleteStart(ctx);
      default:
        return [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async autocompleteStart(_ctx: AutocompleteContext): Promise<string[]> {
    return (
      await prisma.encounter.findMany({
        select: {
          name: true
        }
      })
    ).map((encounter) => encounter.name);
  }

  async run(ctx: CommandContext): Promise<any> {
    switch (ctx.subcommands[0]) {
      case 'start':
        return await this.runStart(ctx);
      default:
        return [];
    }
  }

  async runStart(ctx: CommandContext): Promise<any> {
    var soloEncounter: SoloEncounter = await SoloEncounter.create(
      BigInt(ctx.options[ctx.subcommands[0]]['player']),
      ctx.options[ctx.subcommands[0]]['encounter_name']
    );
    await soloEncounter.startEncounter(ctx);
  }
}
