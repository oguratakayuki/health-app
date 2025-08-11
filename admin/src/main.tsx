import React from "react"
import { createRoot } from "react-dom/client"
import { Admin, Resource, ListGuesser } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest"
import "./index.css"

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "/api"
const dataProvider = simpleRestProvider(apiBase)

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      {/* バックエンドに /users があれば自動で一覧表示 */}
      <Resource name="users" list={ListGuesser} />
    </Admin>
  )
}

createRoot(document.getElementById("root")!).render(<App />)

