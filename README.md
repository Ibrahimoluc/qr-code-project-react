# FileSharingWithQR - Client App

This is the React-based Single Page Application (SPA) interface for the FileSharingWithQR API. It enables users to upload files, select files from Google Drive, set access duration, and generate QR codes.

## 🎨 Features

- **Drag & Drop Upload:** Modern UI for easy local file uploading.
- **Google Drive Picker:** Integrated interface to browse and select files directly from Google Drive.
- **Duration Selection:** Users can choose how long the file should remain accessible (e.g., 15 Mins, 1 Hour, 1 Day).
- **QR Code Generation:** Visualizes the JWT token returned from the API as a QR code.
- **SPA Routing:** Seamless page transitions using React Router DOM.

## 🛠 Tech Stack

- React 18
- React Router DOM
- qrcode.react (QR Rendering)
- Bootstrap / Custom CSS

## ⚙️ Setup

### 1. Install Dependencies
```bash
npm install
npm run dev
```

### 2. Enviroment Variables

Set following enviroment variables either in ".env" file or in your running environment.

- VITE_API_URL: <YOUR_BACKEND_API_URL>

## Deployment Notes

This project deployed at Render. You can try it on this link: https://qr-code-project-react.onrender.com/ 

Since this is a Single Page Application (SPA), it can be hosted on platforms like Render, Netlify, or Azure Static Web Apps.

⚠️ Critical: Handling Page Refreshes (404 Errors)
SPA routing happens on the client side. If a user refreshes a sub-route (e.g., /driveFiles), the server might return a 404 error because that file doesn't physically exist. You must configure a Rewrite Rule on your host.

Configuration for Render: Go to your Static Site settings -> Redirects/Rewrites and add this rule:

- Source: /*
- Destination: /index.html
- Action: Rewrite
