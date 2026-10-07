import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      expediteur,
      cmd,
      colis,
      dateEnvoi,
      contenu,
      clientNom,
      signature,
      tampon,
    } = body;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // Format A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { height } = page.getSize();
    let y = height - 50;

    // Entête / Titre
    page.drawText("ATTESTATION SUR L'HONNEUR DE NON-RÉCEPTION", {
      x: 50,
      y,
      size: 15,
      font: fontBold,
    });
    y -= 40;

    const drawLine = (label: string, val: string) => {
      page.drawText(`${label} : `, { x: 50, y, size: 10, font: fontBold });
      page.drawText(val || "N/A", { x: 180, y, size: 10, font });
      y -= 22;
    };

    // Informations fixes
    drawLine("Expéditeur", expediteur);
    drawLine("N° de Commande", cmd);
    drawLine("N° de Colis", colis);
    drawLine("Date d'expédition", dateEnvoi);

    y -= 10;
    page.drawText("Contenu :", { x: 50, y, size: 10, font: fontBold });

    const items = contenu
      ? contenu
          .split("\n")
          .map((line: string) => line.trim())
          .filter(Boolean)
      : ["N/A"];

    // Si le contenu est court ou tient sur une seule ligne sans tiret
    if (
      items.length === 1 &&
      !items[0].startsWith("-") &&
      !items[0].startsWith("•")
    ) {
      page.drawText(items[0], { x: 180, y, size: 10, font });
      y -= 22;
    } else {
      y -= 16;
      items.forEach((item: string) => {
        // Nettoyage si l'utilisateur a déjà tapé un tiret ou une puce
        const cleanItem = item.replace(/^[-•*]\s*/, "");
        page.drawText(`•  ${cleanItem}`, { x: 65, y, size: 10, font });
        y -= 16;
      });
      y -= 6;
    }

    drawLine("Destinataire", clientNom);

    y -= 20;
    const declaration =
      "Par la présente, je certifie sur l'honneur ne pas avoir réceptionné le(s) colis dont le numéro et les références sont reprises ci-dessus. Toute recherche et autres investigations dans notre société se sont avérées vaines. En outre, je reconnais que toute fausse déclaration est passible d'éventuelles poursuites judiciaires à l'encontre de ma personne.";

    page.drawText(declaration, {
      x: 50,
      y,
      size: 10,
      font,
      maxWidth: 495,
      lineHeight: 14,
    });

    y -= 60;

    // Date de création de l'attestation
    const todayDate = new Date().toLocaleDateString("fr-FR");
    page.drawText(`Date : ${todayDate}`, {
      x: 50,
      y,
      size: 10,
      font: fontBold,
    });

    y -= 30;

    // --- SECTION SIGNATURE ET TAMPON (Titres toujours visibles) ---

    // 1. Titres affichés par défaut
    page.drawText("Signature :", {
      x: 50,
      y,
      size: 10,
      font: fontBold,
    });

    page.drawText("Tampon :", {
      x: 300,
      y,
      size: 10,
      font: fontBold,
    });

    // 2. Image de la Signature (si fournie)
    if (signature) {
      const signatureBytes = Buffer.from(signature.split(",")[1], "base64");
      const signatureImg = signature.includes("image/png")
        ? await pdfDoc.embedPng(signatureBytes)
        : await pdfDoc.embedJpg(signatureBytes);

      page.drawImage(signatureImg, {
        x: 50,
        y: y - 70,
        width: 160,
        height: 60,
      });
    }

    // 3. Image du Tampon (si fournie)
    if (tampon) {
      const tamponBytes = Buffer.from(tampon.split(",")[1], "base64");
      const tamponImg = tampon.includes("image/png")
        ? await pdfDoc.embedPng(tamponBytes)
        : await pdfDoc.embedJpg(tamponBytes);

      page.drawImage(tamponImg, {
        x: 300,
        y: y - 70,
        width: 120,
        height: 60,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=attestation-non-reception-${cmd || "anr"}.pdf`,
      },
    });
  } catch (error) {
    console.error("Erreur PDF:", error);
    return NextResponse.json(
      { error: "Génération du PDF impossible" },
      { status: 500 },
    );
  }
}
