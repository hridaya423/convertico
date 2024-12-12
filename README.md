# Convertico

**Convertico** is a versatile application for file conversion and unit conversion, powered by the **Cloud Convert API**. Built with **Next.js**, **Tailwind CSS**, and **shadcn**, it provides a sleek and intuitive user interface for all your conversion needs.

![Preview of Convertico UI](https://cloud-iw9b41mup-hack-club-bot.vercel.app/0image.png)

## Features
- **File Conversion:** Convert files between various formats seamlessly using the Cloud Convert API.
- **Unit Conversion:** Instantly convert between different units of measurement.
- **Modern UI:** Beautifully styled using Tailwind CSS and shadcn components.

---

## Prerequisites

Ensure you have the following installed before getting started:

- **Node.js**: Version 18 or higher is recommended.
- **npm** or **yarn**: Package managers to install dependencies and manage scripts.

---

## Installation

Follow these steps to set up the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/convertico.git
cd convertico
```

### 2. Install dependencies
Install the required packages using npm or yarn:
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables
Create a `.env.local` file in the root of the project and configure your API keys and other environment variables. For example:
```env
NEXT_PUBLIC_CLOUD_CONVERT_API_KEY=your-api-key-here
```

### 4. Run the development server
Start the application in development mode:
```bash
npm run dev
# or
yarn dev
```
Open your browser and navigate to `http://localhost:3000` to view the app.

---

## Deployment

Convertico is production-ready and can be deployed to platforms like **Vercel**, **Netlify**, or **AWS**. Follow these steps for deployment:

### 1. Build for production
Run the following command to create an optimized production build:
```bash
npm run build
# or
yarn build
```

### 2. Start the production server
Serve the production build locally or on your server:
```bash
npm start
# or
yarn start
```

---

## Technologies Used
- **Next.js**: Framework for React with SSR and API routes.
- **Tailwind CSS**: Utility-first CSS framework for fast UI development.
- **shadcn**: Component library for a modern and consistent design.
- **Cloud Convert API**: Backend service for file conversion.
