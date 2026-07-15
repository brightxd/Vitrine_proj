#!/bin/bash

set -e

BACKEND=./backend
FRONTEND=./frontend

echo "==> Setup do ambiente"

# Backend .env
if [ ! -f "$BACKEND/.env" ]; then
  cp "$BACKEND/.env.example" "$BACKEND/.env"
  echo "[backend] .env criado a partir de .env.example"
  echo "          ⚠️  Edite $BACKEND/.env e troque JWT_SECRET antes de subir em produção"
else
  echo "[backend] .env já existe, pulando"
fi

# Frontend .env
if [ ! -f "$FRONTEND/.env" ]; then
  cp "$FRONTEND/.env.example" "$FRONTEND/.env"
  echo "[frontend] .env criado a partir de .env.example"
else
  echo "[frontend] .env já existe, pulando"
fi

echo ""
echo "==> Instalando dependências"

echo "[backend]"
(cd "$BACKEND" && npm install)

echo "[frontend]"
(cd "$FRONTEND" && npm install)

echo ""
echo "✓ Setup concluído."
echo ""
echo "  Para rodar:"
echo "  Terminal 1 → cd backend  && npm run dev   (porta 3335)"
echo "  Terminal 2 → cd frontend && npm run dev   (porta 5173)"
