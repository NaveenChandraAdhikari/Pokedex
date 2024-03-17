import { useState, useEffect } from "react";
import { PokemonContext } from "./PokemonContext";
import { useForm } from "../hook/useForm";

export const PokemonProvider = ({ children }) => {
  const [allPokemons, setallPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setOffset] = useState(0);

  //utilize customHook -----useForm
  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: "",
  });

  //Simple application states

  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);

  // 50 pokemons to a api

  const getAllPokemons = async (limit = 50) => {
    const baseURL = "https://pokeapi.co/api/v2/";
    const res = await fetch(
      `${baseURL}pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await res.json();
    // console.log(data);

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });

    const results = await Promise.all(promises);

    // console.log(results);

    // setallpokemon used to update the state of the component with the fetched Pokémon data, triggering a re-render of the component with the updated data. This ensures that the UI reflects the latest changes and that any UI elements or logic depending on this data are updated accordingly.
    setallPokemons(results);
    setLoading(false);
  };

  // GlobalPokemon::which extract all pokemons not 50 ..as this helps for filter and search functionality ..cuz we are searching for all of them not the top 50 ones

  const getGlobalPokemons = async () => {
    const baseURL = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`);
    const data = await res.json();
    // console.log(data);

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });

    const results = await Promise.all(promises);
    setGlobalPokemons([...allPokemons, ...results]);
    setLoading(false);
  };

  // call pokemon by id
  const getPokemonByID = async (id) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}pokemon/${id}`);
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    getAllPokemons();
  }, [offset]);

  useEffect(() => {
    getGlobalPokemons();
  }, []);

  //BTN LOAD MORE
  const onClickLoadMore = () => {
    setOffset(offset + 50);
  };

  const [typeSelected, setTypeSelected] = useState({
    grass: false,
    normal: false,
    fighting: false,
    flying: false,
    poison: false,
    ground: false,
    rock: false,
    bug: false,
    ghost: false,
    steel: false,
    fire: false,
    water: false,
    electric: false,
    psychic: false,
    ice: false,
    dragon: false,
    dark: false,
    fairy: false,
    unknow: false,
    shadow: false,
  });

  // best way to send feaetures to entire application

  //filter function +state
  const [filteredPokemons, setfilteredPokemons] = useState([]);

  const handleCheckbox = (e) => {
    setTypeSelected({
      ...typeSelected,
      [e.target.name]: e.target.checked,
    });

    if (e.target.checked) {
      const filteredResults = globalPokemons.filter((pokemon) =>
        pokemon.types.map((type) => type.type.name).includes(e.target.name)
      );
      // it handles if we select two or more checkboxes
      setfilteredPokemons([...filteredPokemons, ...filteredResults]);
    } else {
      const filteredResults = filteredPokemons.filter(
        (pokemon) =>
          !pokemon.types.map((type) => type.type.name).includes(e.target.name)
      );
      // console.log(filteredPokemons)
      setfilteredPokemons([...filteredResults]);
    }
  };
  return (
    <PokemonContext.Provider
      value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonByID,
        onClickLoadMore,

        // for loader
        loading,
        setLoading,

        // for filter button
        active,
        setActive,

        // filter container checkbox
        handleCheckbox,
        filteredPokemons,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
