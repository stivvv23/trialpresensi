import { useState, useEffect, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { supabase } from "../supabaseClient"
import { Link } from "react-router-dom"
import "./scanqr.css"

export default function ScanQR() {

  const scannerRef = useRef(null)

  const [siswa, setSiswa] = useState(null)
  const [atribut, setAtribut] = useState(null)
  const [foto, setFoto] = useState(null)

  function startScanner() {

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    )

    scannerRef.current.render(
      (decodedText) => {

        scannerRef.current.clear()

        let qrToken = decodedText

        try {
          const url = new URL(decodedText)
          qrToken = url.searchParams.get("token") || decodedText
        } catch (e) {}

        handleAbsen(qrToken)
      },
      () => {}
    )
  }

  async function handleAbsen(qrToken) {

    const { data, error } = await supabase
      .from("siswa")
      .select()
      .eq("qr_token", qrToken)
      .single()

    if (error || !data) {
      alert("Siswa tidak ditemukan")
      startScanner()
      return
    }

    setSiswa(data)
  }

  async function submitAbsen() {

    if (!siswa) return

    if (atribut === null) {
      alert("Pilih atribut dulu")
      return
    }

    if (!foto) {
      alert("Ambil foto dulu")
      return
    }

    const waktu = new Date().toISOString()

    const { error } = await supabase
      .from("presensi")
      .insert([
        {
          siswa_id: siswa.id,
          atribut_lengkap: atribut,
          waktu: waktu
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert("Absen berhasil")

    setSiswa(null)
    setAtribut(null)
    setFoto(null)

    setTimeout(() => {
      startScanner()
    }, 500)
  }

  useEffect(() => {
    startScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [])

  return (
    <div className="scan-page">

      <Link to="/" className="back-btn">
        ⬅ Dashboard
      </Link>

      <h1>Scan Presensi</h1>

      <div className="scanner-card">
        <div id="reader"></div>
      </div>

      {siswa && (
        <div className="form-card">

          <h3>{siswa.nama}</h3>
          <p>{siswa.kelas}</p>

          <select
            value={atribut === true ? "ya" : atribut === false ? "tidak" : ""}
            onChange={(e) => setAtribut(e.target.value === "ya")}
          >
            <option value="">Pilih Atribut</option>
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>

          <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={(e) => setFoto(e.target.files[0])}
          />

          <button
            onClick={submitAbsen}
            disabled={!atribut || !foto}
          >
            Submit Absen
          </button>

        </div>
      )}

    </div>
  )
}
