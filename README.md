# Trace - Investigative Workflow App

Trace is an interactive knowledge graph application designed for investigative reports. It helps users visualize and manage complex investigations through an intuitive graph-based interface.

## Features

- Create investigations with a case name and supporting documents
- Upload multiple documents at once with drag-and-drop support
- Interactive knowledge graph visualization using ReactFlow
- State management with Zustand for seamless user experience
- Responsive and modern UI with shadcn/ui components

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [ReactFlow](https://reactflow.dev/) - Graph visualization
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

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
  - `/app/case` - Case-specific pages and functionality
  - `/app/components` - App-specific components
- `/components` - Reusable UI components
  - `/components/ui` - shadcn/ui components
- `/lib` - Utility functions and shared code
- `/public` - Static assets
- `/types` - TypeScript type definitions
- `/styles` - Global styles and Tailwind configurations
- `/scripts` - Project utility scripts

## Development Roadmap

- [x] Initial setup with Next.js, TypeScript, Tailwind CSS, and shadcn/ui
- [x] Home page with case creation form
- [x] File upload functionality
- [x] Knowledge graph visualization
- [x] Drag-and-drop node editing
- [x] Basic knowledge graph visualization setup
- [ ] Advanced graph interaction features
- [ ] Document analysis and entity extraction
- [ ] Case export functionality
- [ ] Collaborative editing features 