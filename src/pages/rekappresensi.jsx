import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { Link } from "react-router-dom"
import "./rekappresensi.css"

export default function RekapPresensi() {

  const [presensi, setPresensi] = useState([])

  async function getPresensi() {

    const { data, error } = await supabase
      .from("presensi")
      .select("*")
      .order("waktu", { ascending: false })

    console.log("DATA:", data)
    console.log("ERROR:", error)

    if (error) {
      alert(error.message)
      return
    }

    setPresensi(data || [])
  }

  useEffect(() => {
    getPresensi()
  }, [])

  return (
    <div className="page">

      <Link to="/" className="back-btn">
        ⬅ Dashboard
      </Link>

      <h1>Rekap Presensi</h1>

      {presensi.length === 0 ? (
        <p>Belum ada data presensi</p>
      ) : (
        presensi.map((item) => (
          <div
            key={item.id}
            className="presensi-card"
          >
            <h3>ID Siswa: {item.siswa_id}</h3>

            <p>Status: {item.status || "-"}</p>

            <p>
              Waktu:
              {" "}
              {item.waktu
                ? new Date(item.waktu).toLocaleString("id-ID")
                : "-"}
            </p>

            <p>
              Atribut:
              {" "}
              {String(item.atribut_lengkap)}
            </p>
          </div>
        ))
      )}

    </div>
  )
}
