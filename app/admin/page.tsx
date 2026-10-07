"use client";

import { useState } from "react";

export default function AdminPage() {
  const [cmd, setCmd] = useState("");
  const [colis, setColis] = useState("");
  const [dateEnvoi, setDateEnvoi] = useState("");
  const [expediteur, setExpediteur] = useState("anr");

  // Gestion dynamique du contenu sous forme de liste
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAddItem = () => {
    const trimmed = newItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems([...items, trimmed]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setItems(items.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Veuillez ajouter au moins un élément dans le contenu du colis.");
      return;
    }

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams({
      cmd,
      colis,
      date: dateEnvoi,
      exp: expediteur,
      contenu: items.join("\n"), // Transmis séparé par des sauts de ligne
    });
    setGeneratedUrl(`${baseUrl}/?${params.toString()}`);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#F4F5F7] p-6 flex justify-center items-center font-sans">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-8 bg-[#ff4a4d] rounded-full"></div>
          <h1 className="text-xl font-extrabold text-[#111827]">
            ANR - Générateur de Lien Client
          </h1>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
              Expéditeur
            </label>
            <input
              type="text"
              value={expediteur}
              onChange={(e) => setExpediteur(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#ff4a4d] focus:border-[#ff4a4d] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
                N° de Commande *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: CMD-123456-1"
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#ff4a4d] focus:border-[#ff4a4d] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
                N° de Colis / Suivi *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 0123456789"
                value={colis}
                onChange={(e) => setColis(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#ff4a4d] focus:border-[#ff4a4d] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
              Date d'expédition *
            </label>
            <input
              type="date"
              required
              value={dateEnvoi}
              onChange={(e) => setDateEnvoi(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#ff4a4d] focus:border-[#ff4a4d] focus:outline-none"
            />
          </div>

          {/* Interface interactive d'ajout d'éléments (Pilules) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-1">
              Contenu du colis *
            </label>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ex: Disques de frein x2"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#ff4a4d] focus:border-[#ff4a4d] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-3 bg-[#111827] hover:bg-black text-white text-sm font-bold rounded-xl transition"
              >
                + Ajouter
              </button>
            </div>

            {/* Liste des pilules générées */}
            <div className="flex flex-wrap gap-2 min-h-10.5 p-2 bg-gray-50 border border-gray-200 rounded-xl items-center">
              {items.length === 0 ? (
                <span className="text-sm text-gray-400 italic px-1">
                  Aucun élément ajouté (tapez un article puis Appuyez sur
                  Entrée)
                </span>
              ) : (
                items.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 shadow-sm text-gray-800 text-sm font-semibold rounded-lg"
                  >
                    • {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-gray-400 hover:text-[#ff4a4d] font-bold text-sm leading-none ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#ff4a4d] hover:bg-[#e03e41] text-white font-bold rounded-xl shadow-sm transition uppercase text-sm tracking-wider cursor-pointer"
          >
            Générer le lien client
          </button>
        </form>

        {generatedUrl && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <label className="block text-sm font-bold text-gray-500 uppercase">
              Lien prêt à envoyer :
            </label>
            <input
              type="text"
              readOnly
              value={generatedUrl}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-mono text-gray-800"
            />
            <button
              onClick={handleCopy}
              className="w-full py-2.5 bg-[#111827] hover:bg-black text-white text-sm font-bold rounded-lg transition cursor-pointer"
            >
              {copied ? "✓ Lien copié !" : "Copier le lien"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
