#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

# Step 1: Start PostgreSQL
echo ""
echo "📦 Step 1: Starting PostgreSQL database..."
docker-compose up -d postgres

# Step 2: Wait for PostgreSQL to be healthy
echo ""
echo "⏳ Step 2: Waiting for PostgreSQL to be healthy..."
echo "   This may take up to 30 seconds..."

COUNTER=0
MAX_ATTEMPTS=30

while [ $COUNTER -lt $MAX_ATTEMPTS ]; do
  if docker-compose ps postgres | grep -q "healthy"; then
    echo "✅ PostgreSQL is healthy!"
    break
  fi

  COUNTER=$((COUNTER + 1))
  echo "   Attempt $COUNTER/$MAX_ATTEMPTS..."
  sleep 2
done

if [ $COUNTER -eq $MAX_ATTEMPTS ]; then
  echo "❌ PostgreSQL failed to become healthy after $MAX_ATTEMPTS attempts"
  echo "   Check logs with: docker-compose logs postgres"
  exit 1
fi

# Step 3: Run database migrations and seed
echo ""
echo "📊 Step 3: Running database migrations and seed..."
echo "   Running Prisma migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "❌ Database migration failed"
  exit 1
fi

echo "   Seeding database..."
npx prisma db seed

if [ $? -ne 0 ]; then
  echo "⚠️  Database seeding failed (continuing anyway)"
fi

# Step 4: Build the Next.js application
echo ""
echo "🔨 Step 4: Building Next.js application..."
echo "   (This will prerender pages using the database)"
docker-compose build bakeshop

# Step 5: Start all services
echo ""
echo "🎉 Step 5: Starting all services..."
docker-compose up -d

# Step 6: Show status
echo ""
echo "✨ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Application should be available at:"
echo "   http://localhost:3000"
echo ""
echo "📝 Useful commands:"
echo "   View logs:       docker-compose logs -f"
echo "   Stop services:   docker-compose down"
echo "   View status:     docker-compose ps"
