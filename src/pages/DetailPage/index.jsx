import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
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
				const { name, id, types, weight, height, stats, abilites } = pokemonData;
				const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);
			}
		} catch (error) {
			console.log(error);
		}
	}

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

	return <div></div>;
};

export default DetailPage;
