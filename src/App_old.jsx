import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokeCard from "./components/PokeCard";
import { useDebounce } from "./hooks/useDebounce";

function App() {
	const [pokemons, setPokemons] = useState([]);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(20);
	const [searchTerm, setSearchTerm] = useState("");

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	useEffect(() => {
		fetchPokeDate(true);
	}, []);

	useEffect(() => {
		handleSearchInput(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	const fetchPokeDate = async isFirstFetch => {
		const offsetValue = isFirstFetch ? 0 : offset + limit;
		const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offsetValue}`;
		try {
			const response = await axios.get(url);
			setPokemons([...pokemons, ...response.data.results]);
			setOffset(offsetValue);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSearchInput = async searchTerm => {
		if (searchTerm.length > 0) {
			try {
				const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
				const pokemonData = {
					url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
					name: searchTerm,
				};
				setPokemons([pokemonData]);
			} catch (error) {
				console.error(error);
				setPokemons([]);
			}
		} else {
			fetchPokeDate(true);
		}
	};

	return (
		<article className="pt-6">
			<header className="flex flex-col gap-2 w-full px-4 z-50">
				<div className="relative z-50">
					<form action="" className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
						<input type="text" className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-slate-500 rounded-lg text-gray-100 text-center" onChange={e => setSearchTerm(e.target.value)} value={searchTerm} />
						<button className="text-xs text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-lg text-center absolute right-0 hover:bg-slate-700">검색</button>
					</form>
				</div>
			</header>
			<section className="pt-6 flex flex-col justify-center items-center overflow-auto z-0">
				<div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
					{pokemons.length > 0 ? pokemons.map(({ url, name }, idx) => <PokeCard key={idx} url={url} name={name} />) : <h2 className="font-medium text-lg text-slate-950 mb-1">포켓몬이 없습니다</h2>}
				</div>
			</section>

			<div className="text-center">
				<button className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white" onClick={() => fetchPokeDate(false)}>
					더보기
				</button>
			</div>
		</article>
	);
}

export default App;
