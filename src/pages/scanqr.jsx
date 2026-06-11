import { useEffect, useRef } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { supabase } from "../supabaseClient"
import { Link } from "react-router-dom"

import "./scanqr.css"

export default function ScanQR() {

  const scannerRef = useRef(null)

  async function handleAbsen(qrToken) {

    const { data: siswa } = await supabase
      .from("siswa")
      .select()
      .eq("qr_token", qrToken)
      .single()

    if (!siswa) {
      alert("Siswa tidak ditemukan")
      return
    }

    navigator.geolocation.getCurrentPosition(

      async (pos) => {

        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude

        const jam = new Date().getHours()

        const status =
          jam <= 7 ? "Hadir" : "Telat"

        const { error } = await supabase
          .from("presensi")
          .insert([
            {
              siswa_id: siswa.id,
              latitude,
              longitude,
              status,
              atribut_lengkap: true
            }
          ])

        if (error) {
          alert(error.message)
          return
        }

        alert(
          `${siswa.nama} berhasil absen (${status})`
        )

      },

      () => {
        alert("GPS tidak diizinkan")
      }

    )
  }

  useEffect(() => {

    scannerRef.current =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250
        },
        false
      )

    scannerRef.current.render(

      (decodedText) => {

        scannerRef.current.clear()

        let qrToken = decodedText

        try {
          const url = new URL(decodedText)
          qrToken = url.searchParams.get("token") || decodedText
        } catch (e) {
          qrToken = decodedText
        }

handleAbsen(qrToken)

      },

      () => {}

    )

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

    </div>
  )
}