"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SignaturePad from "@/components/SignaturePad";

function FormulaireClient() {
  const searchParams = useSearchParams();

  // Récupération des paramètres pré-remplis via l'URL
  const expediteur = searchParams.get("exp") || "anr";
  const cmd = searchParams.get("cmd") || "";
  const colis = searchParams.get("colis") || "";
  const dateEnvoi = searchParams.get("date") || "";
  const contenu = searchParams.get("contenu") || "";

  // Champs modifiables par le client
  const [clientNom, setClientNom] = useState("");
  const [signature, setSignature] = useState("");
  const [tampon, setTampon] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTamponUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTampon(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expediteur,
          cmd,
          colis,
          dateEnvoi,
          contenu,
          clientNom,
          signature,
          tampon,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la génération du PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attestation-non-reception-${cmd || "anr"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Un problème est survenu lors du téléchargement du document.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] py-8 px-4 font-sans">
      <main className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <header className="bg-[#ff4a4d] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-white italic">
              anr
            </span>
            <span className="text-[11px] font-bold bg-[#111827] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Attestation de Non-Réception
            </span>
          </div>
          <span className="text-sm text-[#111827] font-medium">
            ceci est une page de test
          </span>
        </header>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-xl font-extrabold text-[#111827]">
              Attestation sur l'honneur de non-réception
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Veuillez vérifier les informations ci-dessous et renseigner le
              destinataire avant de télécharger l'attestation.
            </p>
          </div>

          {/* Bloc des informations pré-remplies (Lecture seule) */}
          <div className="bg-[#F9FAFB] p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4a4d]"></span>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Informations de votre commande
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-0.5">
                  Expéditeur
                </label>
                <input
                  type="text"
                  value={expediteur}
                  readOnly
                  className="w-full p-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg border-none text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-0.5">
                  N° de Commande
                </label>
                <input
                  type="text"
                  value={cmd}
                  readOnly
                  placeholder="N/A"
                  className="w-full p-2.5 bg-gray-100 text-gray-800 font-mono font-semibold rounded-lg border-none text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-0.5">
                  N° de Colis / Suivi
                </label>
                <input
                  type="text"
                  value={colis}
                  readOnly
                  placeholder="N/A"
                  className="w-full p-2.5 bg-gray-100 text-gray-800 font-mono font-semibold rounded-lg border-none text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-0.5">
                  Date d'expédition
                </label>
                <input
                  type="text"
                  value={dateEnvoi}
                  readOnly
                  placeholder="N/A"
                  className="w-full p-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg border-none text-sm cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">
                  Contenu du colis
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-xl min-h-11">
                  {contenu ? (
                    contenu.split("\n").map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 shadow-2xs text-gray-800 font-medium text-sm rounded-md"
                      >
                        • {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Champs à remplir par le client */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">
                Destinataire
                <span className="text-[#ff4a4d]">*</span>
              </label>
              <input
                type="text"
                required
                value={clientNom}
                onChange={(e) => setClientNom(e.target.value)}
                placeholder="Ex: Jean Dupont ou Garage Central SARL"
                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#ff4a4d] focus:border-[#ff4a4d] focus:outline-none bg-white transition"
              />
            </div>

            {/* Note d'information pour signature/tampon manuel */}
            <div className="p-3 bg-[#F9FAFB] border border-gray-200 rounded-xl flex items-start gap-2.5 text-sm text-gray-600">
              <span className="text-[#ff4a4d] font-bold text-sm leading-none mt-0.5">
                ℹ
              </span>
              <p>
                Vous pouvez télécharger directement l'attestation si vous
                préférez l'imprimer pour la signer et la tamponner manuellement.
              </p>
            </div>

            {/* Pad de signature (Optionnel) */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">
                Signature numérique
              </label>
              <SignaturePad
                onSave={(dataUrl) => setSignature(dataUrl)}
                onClear={() => setSignature("")}
              />
            </div>
          </div>

          {/* Tampon (Optionnel) */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 mb-1">
              Tampon de l'entreprise
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] hover:bg-black text-white text-sm font-bold rounded-xl transition cursor-pointer shadow-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span>Choisir un fichier</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleTamponUpload}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500 italic">
                {tampon ? "✓ Tampon ajouté" : "Aucun fichier sélectionné"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-[#ff4a4d] hover:bg-[#e03e41] text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 uppercase tracking-wide cursor-pointer"
          >
            {isGenerating
              ? "Génération du PDF..."
              : "Télécharger l'attestation (PDF)"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-gray-500">
          Chargement...
        </div>
      }
    >
      <FormulaireClient />
    </Suspense>
  );
}
