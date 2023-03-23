import { OwCliContainer, SignOpkCommand } from '@overwolf/ow-cli/bin';
import { PackOpkCommand } from '@overwolf/ow-cli/bin/commands/opk/pack-opk.command';
import { readFile } from 'fs/promises';
import 'reflect-metadata';
import { appName } from './opk-pipeline';

const pipeline = async () => {
	OwCliContainer.init();

	console.log('[opk] reading current version');
	const manifestBuff = await readFile('./dist/apps/main-app/manifest.json');
	const manifestJson = JSON.parse(manifestBuff.toString('utf8'));
	const appVersion = manifestJson.meta.version;
	console.log('[opk] current version is', appVersion);

	const fileName = `${appName}_${appVersion}.opk`;
	const signedFileName = `${appName}_${appVersion}_signed.opk`;

	console.log('[opk] packing opk to', fileName);
	const packOpkCommand = OwCliContainer.resolve(PackOpkCommand);
	await packOpkCommand.handler({
		folderPath: 'dist/apps/main-app',
		outputFile: fileName,
	});

	console.log('[opk] signing opk to', signedFileName);
	const signOpkCmd = OwCliContainer.resolve(SignOpkCommand);
	await signOpkCmd.handler({
		filePath: `./${fileName}`,
		outputPath: `./${signedFileName}`,
	});
};

pipeline();
