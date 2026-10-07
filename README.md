# 📄 Attestation Express

A lightweight, modern web application designed for generating official **Sworn Statement of Non-Receipt** (Attestation sur l'honneur de non-réception) in PDF format. Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **pdf-lib**.

---

## ✨ Features

- ⚡ **Instant PDF Generation**: Pure serverless PDF creation directly via Next.js Route Handlers using `pdf-lib`.
- 🔒 **Secured Admin Area**: Basic HTTP Authentication middleware protecting `/admin` access.
- ✍️ **Digital Signature**: In-browser canvas signing powered by `react-signature-canvas`.
- 📌 **Company Stamp Upload**: Support for optional PNG/JPEG stamp uploads embedded seamlessly into the generated document.
- 📄 **Flexible Workflow**: Supports both digital completion and offline manual print/stamp option before downloading.
- 🔗 **Smart URL Query Pre-filling**: Pre-fill order parameters (`cmd`, `colis`, `date`, `exp`, `contenu`) via URL query parameters for streamlined customer onboarding.
- 🛠️ **Admin Link Generator**: Dedicated tool at `/admin` for support representatives to generate shareable pre-filled client URLs.
- 🎨 **Modern Design**: Custom localized UI styled with Tailwind CSS v4 and Google's **Poppins** typography.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Typography**: [Poppins](https://fonts.google.com/specimen/Poppins) via `next/font/google`
- **PDF Engine**: [pdf-lib](https://pdf-lib.js.org/)
- **Signature Pad**: [react-signature-canvas](https://github.com/szime/react-signature-canvas)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🔑 Environment Variables

To configure admin credentials for `/admin`, create a `.env.local` file:

```env
ADMIN_USER=admin
ADMIN_PASSWORD=your_secure_password
```
