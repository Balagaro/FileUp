import {fromFile} from '../strtok3/lib/index.js';
import {FileTypeParser} from './core.js';

export async function fileTypeFromFile(path, fileTypeOptions) {
	const tokenizer = await fromFile(path);
	try {
		const parser = new FileTypeParser(fileTypeOptions);
		return await parser.fromTokenizer(tokenizer);
	} finally {
		await tokenizer.close();
	}
}

export * from './core.js';
