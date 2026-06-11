import { useLocation } from "react-router-dom"

export default function Absen() {
  const token = new URLSearchParams(useLocation().search).get("token")

  return (
    <div>
      <h1>Absen Page</h1>
      <p>Token: {token}</p>
    </div>
  )
}