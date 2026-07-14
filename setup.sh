#!/bin/bash

BACKEND=./backend
FRONTEND=./frontend

echo "==> Setup do ambiente"

# Backend
if [ ! -f "$BACKEND/.env" ]; then
  cp "$BACKEND/.env.example" "$BACKEND/.env"
  echo "[backend] .env criado a partir de .env.example"
else
  echo "[backend] .env já existe, pulando"
fi

# Frontend (se tiver .env.example)
if [ -f "$FRONTEND/.env.example" ] && [ ! -f "$FRONTEND/.env" ]; then
  cp "$FRONTEND/.env.example" "$FRONTEND/.env"
  echo "[frontend] .env criado a partir de .env.example"
fi

echo ""
echo "==> Instalando dependências"
echo "[backend]"
cd $BACKEND && npm install
cd ..
echo "[frontend]"
cd $FRONTEND && npm install
cd ..

echo ""
echo "✓ Setup concluído."
echo "  Backend:  cd backend && npm run dev   (porta 3335)"
echo "  Frontend: cd frontend && npm run dev  (porta 5173)"
