# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application built with React 19, TypeScript, and Tailwind CSS 4. The project uses the App Router architecture and is configured for modern React development with server components.

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Architecture

### App Router Structure

This project uses Next.js App Router (not Pages Router):
- `app/` - All routes and pages live here
- `app/layout.tsx` - Root layout with font configuration (Geist Sans and Geist Mono)
- `app/page.tsx` - Home page component
- `app/globals.css` - Global styles with Tailwind CSS v4 and theme configuration

### Styling

- Uses Tailwind CSS v4 with the new `@import "tailwindcss"` syntax
- Custom CSS variables defined in `globals.css` for theming
- Dark mode support via `prefers-color-scheme` media query
- Custom theme tokens defined in `@theme inline` block for colors and fonts

### TypeScript Configuration

- Path aliases: `@/*` maps to root directory
- Strict mode enabled
- Target: ES2017
- JSX runtime: `react-jsx` (new JSX transform)

### Key Dependencies

- Next.js 16.0.0 with App Router
- React 19.2.0 with React Server Components support
- Tailwind CSS v4 with `@tailwindcss/postcss`
- ESLint with Next.js config (uses new flat config format)

## Important Notes

- The project uses the newer ESLint flat config format (`eslint.config.mjs`)
- TypeScript config has been modified from defaults (check git status shows `tsconfig.json` as modified)
- Font optimization is handled via `next/font/google` for Geist fonts
