"use client";

import "./SamedayLockerSelector.css";
import { useEffect, useMemo, useState } from "react";

const SDK_URL = "https://cdn.sameday.ro/locker-plugin/lockerpluginsdk.js";

const loadSamedaySdk = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Browser only"));
    if (window.LockerPlugin) return resolve(window.LockerPlugin);

    const existingScript = document.querySelector(
      `script[src="${SDK_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.LockerPlugin));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve(window.LockerPlugin);
    script.onerror = reject;
    document.body.appendChild(script);
  });

export default function SamedayLockerSelector({
  city,
  county,
  selectedLocker,
  onSelect,
}) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const config = useMemo(
    () => ({
      clientId: process.env.NEXT_PUBLIC_SAMEDAY_CLIENT_ID,
      apiUsername: process.env.NEXT_PUBLIC_SAMEDAY_API_USERNAME,
      countryCode: process.env.NEXT_PUBLIC_SAMEDAY_COUNTRY_CODE || "RO",
      langCode: process.env.NEXT_PUBLIC_SAMEDAY_LANG_CODE || "ro",
    }),
    []
  );

  const isConfigured = Boolean(config.clientId && config.apiUsername);

  useEffect(() => {
    if (!isConfigured) return;

    let isMounted = true;

    loadSamedaySdk()
      .then((lockerPlugin) => {
        if (!isMounted || !lockerPlugin) return;

        lockerPlugin.init({
          clientId: config.clientId,
          apiUsername: config.apiUsername,
          countryCode: config.countryCode,
          langCode: config.langCode,
          city: city || "Bucuresti",
          county: county || "Bucuresti",
          theme: "light",
          filters: [{ showLockers: true }, { showPudos: true }],
          initialMapCenter: city ? "City" : undefined,
        });

        const pluginInstance = lockerPlugin.getInstance();

        pluginInstance.subscribe((locker) => {
          onSelect({
            provider: "sameday",
            type: Number(locker.oohType) === 1 ? "pudo" : "locker",
            lockerId: locker.lockerId,
            oohType: locker.oohType,
            name: locker.name,
            address: locker.address,
            cityId: locker.cityId,
            city: locker.city,
            countyId: locker.countyId,
            county: locker.county,
            postalCode: locker.postalCode,
          });
          pluginInstance.close();
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Selectorul Sameday nu a putut fi incarcat.");
      });

    return () => {
      isMounted = false;
    };
  }, [city, config, county, isConfigured, onSelect]);

  const openSelector = async () => {
    setError("");

    if (!isConfigured) {
      setError("Configureaza credentialele Sameday pentru a activa selectorul.");
      return;
    }

    try {
      setStatus("loading");
      const lockerPlugin = await loadSamedaySdk();
      const pluginInstance = lockerPlugin.getInstance();

      pluginInstance.reinitializePlugin({
        clientId: config.clientId,
        apiUsername: config.apiUsername,
        countryCode: config.countryCode,
        langCode: config.langCode,
        city: city || "Bucuresti",
        county: county || "Bucuresti",
        theme: "light",
        filters: [{ showLockers: true }, { showPudos: true }],
        initialMapCenter: city ? "City" : undefined,
      });
      pluginInstance.open();
      setStatus("idle");
    } catch {
      setStatus("idle");
      setError("Nu am putut deschide harta Sameday.");
    }
  };

  return (
    <div className="sameday-locker-selector">
      <button
        type="button"
        className="sameday-locker-button"
        onClick={openSelector}
        disabled={status === "loading"}
      >
        {selectedLocker ? "Schimba easybox / PUDO" : "Alege easybox / PUDO"}
      </button>

      {selectedLocker && (
        <div className="sameday-locker-selection">
          <p>{selectedLocker.name}</p>
          <span>{selectedLocker.address}</span>
          <span>
            {selectedLocker.city}, {selectedLocker.county}
          </span>
        </div>
      )}

      {!isConfigured && (
        <p className="sameday-locker-help">
          Lipsesc NEXT_PUBLIC_SAMEDAY_CLIENT_ID si
          NEXT_PUBLIC_SAMEDAY_API_USERNAME.
        </p>
      )}

      {error && <p className="sameday-locker-error">{error}</p>}
    </div>
  );
}
