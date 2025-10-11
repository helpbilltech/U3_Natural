#!/bin/bash

# Install frontend dependencies
npm install

# Build frontend
npm run build

# Move built files to backend dist folder
rm -rf backend/dist
cp -r dist backend/dist

# Install backend dependencies
cd backend
npm install

echo "Build completed successfully!"