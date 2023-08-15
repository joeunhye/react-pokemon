export interface DamageFromAndTo {
	to: SeparateDamages;
	from: SeparateDamages;
}
export interface SeparateDamages {
	double_damage?: Damage[];
	half_damage?: Damage[];
	no_damage?: Damage[];
}

export interface Damage {
	damageValue: string;
	name: string;
	url: string;
}

export enum DamageValue {
	The12X = "1/2x",
	The14X = "1/4x",
	The2X = "2x",
}
