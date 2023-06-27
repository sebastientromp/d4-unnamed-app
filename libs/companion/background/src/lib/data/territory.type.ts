export type Territory = {
	readonly id: string;
	readonly name: string;
	readonly subZones: readonly SubZone[];
};

export type SubZone = {
	readonly name: string;
	readonly groupName: string;
	readonly value: number;
	readonly group: number;
	readonly levelAreas: readonly LevelArea[];
};

export type LevelArea = {
	readonly value: number;
	readonly name: string;
	readonly text: string;
};
