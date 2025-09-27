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
	{
		name: "[Gen 9] Super Staff Bros Ultimate FFA",
		desc: "The fifth iteration of Super Staff Bros is here! Battle with a random team of pokemon created by the sim staff.",
		mod: 'gen9ssb',
		debug: true,
		team: 'randomStaffBros',
		gameType:'freeforall',
		bestOfDefault: true,
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
		onBegin() {
			// TODO look into making an event to put this right after turn|1
			// https://discordapp.com/channels/630837856075513856/630845310033330206/716126469528485909
			// Requires client change
			this.add(`raw|<div class='broadcast-green'><b>Wondering what all these custom moves, abilities, and items do?<br />Check out the <a href="https://www.smogon.com/articles/super-staff-bros-ultimate" target="_blank">Super Staff Bros: Ultimate Guide</a> or use /ssb to find out!</b></div>`);
			if (this.ruleTable.has('dynamaxclause')) {
				// Old joke format we're bringing back
				this.add('message', 'Fox only');
				this.add('message', 'No items');
				this.add('message', 'Final Destination');
				return;
			} else if (this.ruleTable.has('zmoveclause')) {
				// Old joke format we're bringing back
				this.add('message', 'April Fool\'s Day');
				return;
			}

			this.add('message', 'EVERYONE IS HERE!');
			this.add('message', 'FIGHT!');
		},
		onSwitchInPriority: 100,
		onSwitchIn(pokemon) {
			let name: string = this.toID(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			if (this.dex.species.get(name).exists || this.dex.moves.get(name).exists ||
				this.dex.abilities.get(name).exists || name === 'blitz') {
				// Certain pokemon have volatiles named after their id
				// To prevent overwriting those, and to prevent accidentally leaking
				// that a pokemon is on a team through the onStart even triggering
				// at the start of a match, users with pokemon names will need their
				// statuses to end in "user".
				name = `${name}user`;
			}
			// Add the mon's status effect to it as a volatile.
			const status = this.dex.conditions.get(name);
			if (status?.exists) {
				pokemon.addVolatile(name, pokemon);
			}
			if ((pokemon.illusion || pokemon).getTypes(true, true).join('/') !==
				this.dex.forGen(9).species.get((pokemon.illusion || pokemon).species.name).types.join('/') &&
				!pokemon.terastallized) {
				this.add('-start', pokemon, 'typechange', (pokemon.illusion || pokemon).getTypes(true).join('/'), '[silent]');
			}
		},
	},
	{
	name: "[Gen 9] National Dex Ubers Random Battle",
		mod: 'gen9',
		team: 'random',
		ruleset: ['Standard NatDex', '!Evasion Clause', 'Evasion Moves Clause', 'Evasion Items Clause', 'Mega Rayquaza Clause'],
		banlist: ['ND AG', 'Shedinja', 'Assist', 'Baton Pass'],
	},
	]
