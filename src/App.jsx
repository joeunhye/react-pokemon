import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import PokeCard from "./components/PokeCard";
import { useDebounce } from "./hooks/useDebounce";

function App() {
	// 모든 포켓몬 데이터를 가지고 있는 state
	const [allpokemons, setAllpokemons] = useState([]);
	// 실제로 리스트로 보여주는 포켓몬 데이터 state
	const [displayedPokemons, setDisplayedPokemons] = useState([]);
	// 한번에 보여주는 포켓몬 수
	const limitNum = 20;
	const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;
	const [searchTerm, setSearchTerm] = useState("");

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	useEffect(() => {
		fetchPokeDate();
	}, []);

	useEffect(() => {
		handleSearchInput(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	const filterDisplayedPokemonData = (allpokemonsData, displayedPokemons) => {
		const limit = displayedPokemons.length + limitNum;
		// 모든 포켓몬 데이터에서 limitNum 만큼 가져오기
		const arr = allpokemonsData.filter((_, idx) => idx + 1 <= limit);
		return arr;
	};

	const fetchPokeDate = async () => {
		try {
			// 1008개 포켓몬 데이터 가져오기
			const response = await axios.get(url);
			setAllpokemons(response.data.results);
			// 실제로 화면에 보여줄 포켓몬 리스트
			setDisplayedPokemons(filterDisplayedPokemonData(response.data.results, displayedPokemons));
		} catch (error) {
			console.error(error);
		}
	};

	const handleSearchInput = async searchTerm => {
		// if (searchTerm.length > 0) {
		// 	try {
		// 		const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
		// 		const pokemonData = {
		// 			url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}`,
		// 			name: searchTerm,
		// 		};
		// 		setPokemons([pokemonData]);
		// 	} catch (error) {
		// 		console.error(error);
		// 		setPokemons([]);
		// 	}
		// } else {
		// 	fetchPokeDate(true);
		// }
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
					{displayedPokemons.length > 0 ? displayedPokemons.map(({ url, name }, idx) => <PokeCard key={idx} url={url} name={name} />) : <h2 className="font-medium text-lg text-slate-950 mb-1">포켓몬이 없습니다</h2>}
				</div>
			</section>

			<div className="text-center">
				{allpokemons.length > displayedPokemons.length && displayedPokemons.length !== 1 && (
					<button className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white" onClick={() => setDisplayedPokemons(filterDisplayedPokemonData(allpokemons, displayedPokemons))}>
						더보기
					</button>
				)}
			</div>
		</article>
	);
}

export default App;
