import fs from 'https://deno.land/std@0.170.0/fs/mod.ts'
import yt from 'https://deno.land/x/ytdl_core@v0.1.1/mod.ts'
import { Data } from './types/API_Types.ts'
import { Info, OptionsMusic, ContentOptions } from './types/bridge.ts'
import { Readable } from 'https://deno.land/std@0.170.0/streams/mod.ts'

/**
 * This function is responsible for communicating with
 * the youtube song search API
 * */
const getSingles = async(single:string):Promise<OptionsMusic[]> => {
  const connectAPI = await fetch(
    'https://api-getsingles.onrender.com/single',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': '*',
      },
      body: `single=${single}`
    }
  );

  const search:Data = await connectAPI.json() as Data;

  if(search.error) throw 'Ha ocurrido un error'

  const options:OptionsMusic[] = search.items.map((option) => {
    const ID:string = option.id;
    const title:string = option.title??'No find name';
    const URL:string = `https://www.youtube.com/watch?v=${ID}`;
    const Miniatura:string | undefined = option.thumbnail.thumbnails[1]?.url??undefined;
    
    const response:OptionsMusic = { title, ID, Miniatura, URL }

    return response;
  })

  return options;
}

/**
 * This function is responsible for obtaining a stream data type,
 * from the URL of the youtube videos that are passed as an argument.
 * */
const getStreamSingle = async(URL:string):Promise<Readable> => {
  try {
    const stream:Readable = await yt(URL, { filter: 'audioonly', dlChunkSize: 0 });

    return stream;
  }catch(err) {
    console.log(err);
  }
}

export { getSingles, getStreamSingle };
