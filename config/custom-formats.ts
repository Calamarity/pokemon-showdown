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
		name: "[Gen 7] Monotype Multi Random Battle",
		mod: 'gen7',
		team: 'random',
		gameType: 'multi',
		searchShow: false,
		tournamentShow: false,
		rated: false,
		ruleset: [
			'Max Team Size = 3',
			'Obtainable', 'Species Clause', 'Same Type Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
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
		name: "[Gen 7] Monotype Free-For-All Random Battle",
		mod: 'gen7',
		team: 'random',
		gameType: 'freeforall',
		searchShow: false,
		tournamentShow: false,
		rated: false,
		ruleset: ['Obtainable', 'Same Type Clause', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Monkey's Paw Free-For-All Random Battle",
		desc: `Every Pokemon can wish for something with the Monkey's Paw once.`,
		mod: 'monkeyspaw',
		team: 'random',
		gameType: 'freeforall',
		ruleset: ['[Gen 9] Random Battle'],
		onBegin() {
			for (const side of this.sides) {
				// @ts-expect-error I hate references with all of my life force
				side.wishes = { luck: 1, knowledge: 1, power: 1, life: 1 };
				// @ts-expect-error
				side.wishesRemaining = 4;
			}
			let buf = `<div class="broadcast-blue"><h3>What does which wish do?</h3><hr />`;
			buf += `<details><summary>What does which wish do?</summary>`;
			buf += `&bullet; <b>Mega Evolution:</b> Wish for life &ndash; <span style="font-size: 9px;">Revive one fainted Pokemon</span><br />`;
			buf += `&bullet; <b>Mega Evolution X:</b> Wish for power &ndash; <span style="font-size: 9px;">Gain a +2 boost in the current Pokemon's dominant attack and defense stat</span><br />`;
			buf += `&bullet; <b>Mega Evolution Y:</b> Wish for luck &ndash; <span style="font-size: 9px;">Give the current Pokemon innate Serene Grace + Focus Energy for the rest of the game</span><br />`;
			buf += `&bullet; <b>Terastallize:</b> Wish for knowledge &ndash; <span style="font-size: 9px;">Scout the active Pokemon for one of their moves</span><br />`;
			buf += `</details></div>`;
			this.add('message', `You've found a Monkey's Paw. You have 4 wishes.`);
			this.add(`raw|${buf}`);
		},
		onSwitchIn(pokemon) {
			if (pokemon.m.revivedByMonkeysPaw) {
				pokemon.addVolatile('slowstart', null, this.dex.conditions.get('monkeypaw'));
			}
			if (pokemon.m.monkeyPawLuck) {
				pokemon.addVolatile('focusenergy');
				pokemon.addVolatile('confusion', null, this.dex.conditions.get('monkeypaw'));
			}
		},
		onModifyMovePriority: -2,
		onModifyMove(move, pokemon) {
			if (!pokemon.m.monkeyPawLuck) return;
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
	},
	]
