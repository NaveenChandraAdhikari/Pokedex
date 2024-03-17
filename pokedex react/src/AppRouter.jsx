import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { HomePage, PokemonPage, SearchPage } from "./pages"; //thanks to index.js

const AppRouter = () => {
  return (
    //   <div>AppRouter</div>
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<HomePage />} />

        <Route path="pokemon/:id" element={<PokemonPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>

      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
};

export default AppRouter;
