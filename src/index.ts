import { Bot, InputFile, Context, InlineKeyboard } from 'https://deno.land/x/grammy@v1.13.0/mod.ts'
import { Info, OptionsMusic, ContentOptions } from './helpers/types/bridge.ts'
import { Menu, MenuRange } from 'https://deno.land/x/grammy_menu@v1.1.1/menu.ts'
import { sendListMusic, sendMusic, ID_SELECTION } from './helpers/interactions/message.ts'
import * as path from 'https://deno.land/std/path/mod.ts'
import config from './helpers/config/dotenv.ts'
import * as colors from 'https://deno.land/std/fmt/colors.ts'

export const bot:Bot = new Bot(config.TOKEN);
export const menu:Menu = new Menu('OptionsMusic');

//create the 5 song selection buttons
for(let i:number = 1; i <= 5; i++) {
  menu.text(i.toString(), async(ctx) => {
    try {
      await sendMusic(ctx, i);
    }catch(err) {
      console.log(err);
      await ctx.reply('An error occurred try again');
    }
  });
}

bot.use(menu);

bot.on('message:text', async(ctx) => {
  try {
    const message:string = ctx.message.text.toString();
    const ID:string = ctx.msg.chat.id.toString();
    console.log(colors.bold(colors.green(ID)));

    //send guide response
    if(['/start', '/help'].includes(message)) 
      return await ctx.reply('Send me the name and/or singer and I will send you their song.')
    
    const send = (await ctx.reply(`Search 🔎 ${message}`, {
      reply_to_message_id: ctx.msg.message_id
    }));

    if(ID_SELECTION.has(ID)) bot.api.deleteMessage(ID, ID_SELECTION.get(ID).message_id);

    const __Arguments__:Info = {
      ID,
      message,
      message_id: send.message_id
    };

    await sendListMusic(ctx, __Arguments__);
  }catch(err) {
    console.log(err);
    ctx.reply('An error occurred try again');
  }
});

bot.catch((err) => {
  console.log(err);
})

bot.start();
console.log(colors.bold(colors.green('Start')));