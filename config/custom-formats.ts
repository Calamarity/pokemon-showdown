export const Formats: FormatList = [

//Lemon hahahah L bozo

{
		section: "Custom Formats",
	},
	{
		name: "[Gen 7] Multi Random Battle",
		mod: 'gen7',
		team: 'random',
		gameType: 'multi',
		searchShow: false,
		tournamentShow: false,
		rated: false,
		ruleset: [
			'Max Team Size = 3',
			'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 7] Free-For-All Random Battle",
		mod: 'gen7',
		team: 'random',
		gameType: 'freeforall',
		searchShow: false,
		tournamentShow: false,
		rated: false,
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Random Battle (Shared Power, B12P6)",
		desc: `[Gen 9] Random Battle with Team Preview, Bring 12 Pick 6, and Shared Power.`,
		mod: 'sharedpower',
		team: 'randomffa',
		gameType: 'freeforall',
		bestOfDefault: true,
		ruleset: ['[Gen 9] Random Battle', 'Team Preview', 'Max Team Size = 12', 'Picked Team Size = 6'],
		onValidateRule() {
			if (this.format.gameType !== 'freeforall') {
				throw new Error(`Shared Power currently does not support ${this.format.gameType} battles.`);
			}
		},
		onBeforeSwitchIn(pokemon) {
			let format = this.format;
			if (!format.getSharedPower) format = this.dex.formats.get('gen9sharedpower');
			for (const ability of format.getSharedPower!(pokemon)) {
				const effect = 'ability:' + this.toID(ability);
				pokemon.volatiles[effect] = this.initEffectState({ id: effect, target: pokemon });
				if (!pokemon.m.abils) pokemon.m.abils = [];
				if (!pokemon.m.abils.includes(effect)) pokemon.m.abils.push(effect);
			}
		},
	},
	]
