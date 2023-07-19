import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
	const [pokemon, setPokemon] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const params = useParams();
	const pokemonId = params.id;
	const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;

	useEffect(() => {
		fetchPokemonData();
	}, []);

	async function fetchPokemonData() {
		const url = `${baseUrl}${pokemonId}`;
		try {
			const { data: pokemonData } = await axios.get(url);
			if (pokemonData) {
				const { name, id, types, weight, height, stats, abilities } = pokemonData;
				const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);
				const DamageRelations = await Promise.all(
					types.map(async i => {
						const type = await axios.get(i.type.url);
						return type.data.damage_relations;
					})
				);
				const formattedPokemonData = {
					id,
					name,
					weight: weight / 10,
					height: height / 10,
					previous: nextAndPreviousPokemon.previous,
					next: nextAndPreviousPokemon.next,
					abilities: formatPokemonAbilities(abilities),
					stats: formatPokemonStats(stats),
					DamageRelations,
				};
				setPokemon(formattedPokemonData);
				setIsLoading(false);
				console.log(formattedPokemonData);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const formatPokemonAbilities = abilities => {
		return abilities.filter((_, idx) => idx <= 1).map(obj => obj.ability.name.replaceAll("-", " "));
	};

	const formatPokemonStats = ([statHP, statATK, statDEP, statSATK, statSDEP, statSPD]) => [
		{ name: "Hit Points", baseStat: statHP.base_stat },
		{ name: "Attack", baseStat: statATK.base_stat },
		{ name: "Defense", baseStat: statDEP.base_stat },
		{ name: "Special Attack", baseStat: statSATK.base_stat },
		{ name: "Special Defense", baseStat: statSDEP.base_stat },
		{ name: "Spped", baseStat: statSPD.base_stat },
	];

	async function getNextAndPreviousPokemon(id) {
		const url = `${baseUrl}?limit=1&offset=${id - 1}`;
		const { data: pokemonData } = await axios.get(url);
		const nextResponse = pokemonData.next && (await axios.get(pokemonData.next));
		const prevResponse = pokemonData.next && (await axios.get(pokemonData.previous));
		return {
			next: nextResponse?.data?.results?.[0].name,
			previous: prevResponse?.data?.results?.[0].name,
		};
	}

	if (isLoading) return <div>...Loading</div>;

	return <div></div>;
};

export default DetailPage;
