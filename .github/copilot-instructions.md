# Copilot Instructions for TikTok Pixel React Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React + Vite + TypeScript project focused on implementing TikTok Pixel tracking functionality with advanced e-commerce event tracking.

## Key Requirements
- Use TypeScript for all components and utilities
- Implement TikTok Pixel (ttq) library integration
- Follow React best practices and hooks patterns
- Implement proper error handling for tracking events
- Use modern ES6+ syntax and async/await patterns

## TikTok Pixel Implementation Guidelines
- Always use the official TikTok Pixel library (ttq)
- Implement proper content tracking with required parameters:
  - content_identifier = item_id
  - content_type = item_category  
  - content_name = item_name
  - content_category = item_category2
- Handle pixel initialization in a React hook or context
- Implement proper error boundaries for tracking failures

## Code Style Preferences
- Use functional components with hooks
- Prefer named exports over default exports
- Use interface definitions for TypeScript types
- Implement proper loading states and error handling
- Follow semantic HTML and accessibility best practices