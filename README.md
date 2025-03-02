# Trace - Investigative Workflow App

Trace is an interactive knowledge graph application designed for investigative reports. It helps users visualize and manage complex investigations through an intuitive graph-based interface.

## Features

- Create investigations with a case name and supporting documents
- Upload multiple documents at once with drag-and-drop support
- Interactive knowledge graph visualization (coming soon)
- Draggable branches and nodes for organizing information (coming soon)

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app directory with pages and layouts
- `/components` - Reusable UI components
  - `/components/ui` - shadcn/ui components
- `/lib` - Utility functions and shared code
- `/public` - Static assets

## Development Roadmap

- [x] Initial setup with Next.js, TypeScript, Tailwind CSS, and shadcn/ui
- [x] Home page with case creation form
- [x] File upload functionality
- [ ] Knowledge graph visualization
- [ ] Drag-and-drop node editing
- [ ] Document analysis and entity extraction
- [ ] Case export functionality 