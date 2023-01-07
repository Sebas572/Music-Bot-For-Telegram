type Info = {
	ID: string;
	message: string;
	message_id: number;
}

type OptionsMusic = {
	title: string;
	ID: string;
	Miniatura?: string | undefined;
	URL: string;
}

type ContentOptions = {
  options: OptionsMusic[],
  message_id: number
}

export { Info, OptionsMusic, ContentOptions };