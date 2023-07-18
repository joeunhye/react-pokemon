import { useState } from "react";

const AutoComplete = ({ allpokemons, setDisplayedPokemons }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filterNames = input => {
		const value = input.toLowerCase();
		return value ? allpokemons.filter(pokemon => pokemon?.name.includes(value)) : [];
	};
	const handleSubmit = e => {
		e.preventDefault();
		let text = searchTerm.trim();
		setDisplayedPokemons(filterNames(text));
		setSearchTerm("");
	};

	const checkEqualName = input => {
		const filteredArray = filterNames(input);
		return filteredArray[0]?.name === input ? [] : filteredArray;
	};

	return (
		<div className="relative z-50">
			<form onSubmit={handleSubmit} className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
				<input type="text" className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-slate-500 rounded-lg text-gray-100 text-center" onChange={e => setSearchTerm(e.target.value)} value={searchTerm} />
				<button className="text-xs text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-lg text-center absolute right-0 hover:bg-slate-700">검색</button>
			</form>
			{checkEqualName(searchTerm).length > 0 && (
				<div className={`w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-1`}>
					<div className={`w-0 h-0 bottom-0 border-x-transparent border-x-8 border-b-8 border-gray-700 -translate-y-1/2`}></div>
					<ul className={`w-40 max-h-[134px] py-1 bg-gray-700 absolute rounded-lg top-0 overflow-auto scrollbar-hide`}>
						{checkEqualName(searchTerm).map((el, idx) => (
							<li key={`button-${idx}`}>
								<button type="button" className="text-base w-full hover:bg-gray-600 p-2 text-gray-100" onClick={() => setSearchTerm(el.name)}>
									{el.name}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default AutoComplete;
