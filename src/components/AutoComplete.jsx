import { useState } from "react";

const AutoComplete = ({ allpokemons, setDisplayedPokemons }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filterNames = input => {
		const value = input.toLowerCase();
		return value ? allpokemons.filter(pokemon => pokemon.name.includes(value)) : [];
	};
	const handleSubmit = e => {
		e.preventDefault();
		let text = searchTerm.trim();
		setDisplayedPokemons(filterNames(text));
		setSearchTerm("");
	};
	return (
		<div className="relative z-50">
			<form onSubmit={handleSubmit} action="" className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
				<input type="text" className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-slate-500 rounded-lg text-gray-100 text-center" onChange={e => setSearchTerm(e.target.value)} value={searchTerm} />
				<button className="text-xs text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-lg text-center absolute right-0 hover:bg-slate-700">검색</button>
			</form>
		</div>
	);
};

export default AutoComplete;
