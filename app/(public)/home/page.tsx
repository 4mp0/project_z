
"use client";

import { useEffect, useState } from "react";
import NavPane from "../../../_components/NavPane";
import CardContent from "../../../_components/CardContent";

/*
    async function fetchProjectZ() {
      fetch('/api/projectZ-status')
        .then((res) => res.json())
        .then((data) => {
          setZStatus(data);
        })
        .catch((error) => {
          console.error("Error fetching status:", error);
          setZStatus({ Zstatus: "Offline" });
        });
    }

    async function fetchProjectY() {
      try {
        const response = await fetch("/api/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: "ok" }), // or "fail" to test 400
        });

        setYStatus({Ystatus: response.status}); // store HTTP status code
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    }

      fetchProjectZ();
      fetchProjectY();
*/


export default function Home() {
  const [zStatusCode, setZStatus] = useState(false);
  const [yStatusCode, setYStatus] = useState(false);

  useEffect(() => {
    async function fetchProjectZ() {
      try {
        const res = await fetch('/api/projectZ-status');
        const status = await res.status;
        status === 200 ? setZStatus(true) : setZStatus(false)
      } catch (error) {
        console.log(error);
        setZStatus(false)
      }
    }

    async function fetchProjectY() {
      try {
        const response = await fetch('/api/projectY-status');
        const data = await response.json();

        setYStatus(data.status);

      } catch (error) {
        console.log(error);
        setYStatus(false);
      }
    }

    fetchProjectZ();
    fetchProjectY();
  }, []);

  return (
    <div>
      <div style={{ padding: '3px' }}>
        <NavPane />
      </div>

      <div
        style={{ padding: 0, position: 'absolute' }}
      >
        <CardContent>
          Projects status:<br />
          * Project Z - {zStatusCode ? "ONLINE" : "OFFLINE"}<br />
          * Project Y - {yStatusCode ? "ONLINE" : "OFFLINE"}
        </CardContent>
      </div>
    </div>
  );
}
