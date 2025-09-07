import React from "react"
import { createRoot } from "react-dom/client"
import { Admin, Resource, ListGuesser } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest"
import "./index.css"
import { UserEdit } from "./users/UserEdit";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "/api"
const dataProvider = simpleRestProvider(apiBase)

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="users" list={ListGuesser} edit={UserEdit}  />
      <Resource name="ingredients" list={ListGuesser} />
    </Admin>
  )
}

createRoot(document.getElementById("root")!).render(<App />)

