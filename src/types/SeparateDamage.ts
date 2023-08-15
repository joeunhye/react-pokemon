export interface DamageFromAndTo {
	to: SeparateDamage;
	from: SeparateDamage;
}
export interface SeparateDamage {
	double_damage?: Damage[];
	half_damage?: Damage[];
	no_damage?: Damage[];
}

export interface Damage {
	damageValue: DamageValue;
	name: string;
	url: string;
}

export enum DamageValue {
	The12X = "1/2x",
	The14X = "1/4x",
	The2X = "2x",
}
