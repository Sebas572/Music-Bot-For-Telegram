import { Bot, InputFile, InlineKeyboard, Context } from 'https://deno.land/x/grammy@v1.13.0/mod.ts'
import { Info, OptionsMusic, ContentOptions } from '../types/bridge.ts'
import { getSingles, getStreamSingle } from '../getSingles.ts'
import { Readable } from 'https://deno.land/std@0.170.0/streams/mod.ts'
import { bot, menu } from '../../index.ts'
import { Menu, MenuRange } from 'https://deno.land/x/grammy_menu@v1.1.1/menu.ts'
import config from '../config/dotenv.ts'

/**
 * The constant "ID_SELECTION" allows us to know the list of
 * options of the songs shown to each client, allowing us to
 * know which song we should send to them
 * */
const ID_SELECTION:Map<string, ContentOptions> = new Map<string, ContentOptions>();

/**
 * This function is in charge of sending the song chosen
 * by the customer through the options of the menu
 * */
const sendMusic = async(ctx:Context, select:number):Promise<boolean> => {
  if(!ctx.chat?.id) return false;
  select--;

  const ID:string = ctx.chat?.id.toString();
  const contenido:ContentOptions | undefined = ID_SELECTION.get(ID);

  if(!contenido) return false;


  const youtube:OptionsMusic = contenido.options[select];
  const title:string = youtube.title;
  const stream:Readable = await getStreamSingle(youtube.URL);
  
  let sendNotification;

  if(youtube.Miniatura)
    sendNotification = await bot.api.sendPhoto(
      ID, 
      new InputFile(new URL(youtube.Miniatura)),
      { caption: `Send music:\n ${select+1} - ${title}` }
    );
  else
    sendNotification = await ctx.reply(`Send music:\n ${select+1} - ${title}`)
  
  await bot.api.deleteMessage(ID, contenido.message_id);

  await bot.api.sendDocument(ID, new InputFile(stream, `${title}.mp3`), { caption: title });


  ID_SELECTION.delete(ID);

  return true;
}

/**
 * This function is in charge of searching for a list of songs
 * through a title passed as an argument,and it takes care of
 * the custom configuration of each button of the options
 * */
const sendListMusic = async(ctx:Context, data:Info):Promise<void> => {
  const message:string = data.message;

  const optionsSingles:OptionsMusic[] = await getSingles(message);

  const music:string[] = optionsSingles.map((single, index) => `${++index} - ${single.title}`);
  const response:string = 'This has been found:\n' + music.join('\n');

  const sendOptions = await ctx.reply(response, {
    reply_to_message_id: data.message_id,
    reply_markup: menu
  })

  await bot.api.deleteMessage(data.ID, data.message_id);

  ID_SELECTION.set(data.ID, {
    options: optionsSingles,
    message_id: sendOptions.message_id
  });

  setTimeout(() => {
    if(ID_SELECTION.get(data.ID).message_id !== sendOptions.message_id) return false;
    
    ID_SELECTION.delete(data.ID);
    bot.api.deleteMessage(data.ID, sendOptions.message_id);
  }, (1000*60)*config.WAIT_RESPONSE);
}

export { sendListMusic, sendMusic, ID_SELECTION };