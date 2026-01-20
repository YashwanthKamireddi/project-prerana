#!/bin/bash
# ============================================================================
# AADHAAR-PRERANA Setup Script
# ============================================================================
# Run this script to set up the development environment.
#
# Usage: ./setup.sh
# ============================================================================

set -e

echo "=============================================="
echo "   AADHAAR-PRERANA Development Setup"
echo "=============================================="

# Check Python version
echo "Checking Python version..."
python3 --version || { echo "Python 3 is required"; exit 1; }

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Create model directories
echo "Creating model directories..."
mkdir -p ml_models/{genesis,mobility,integrity}
mkdir -p visualizations
mkdir -p logs

# Set up pre-commit hooks (optional)
if command -v pre-commit &> /dev/null; then
    echo "Setting up pre-commit hooks..."
    pre-commit install
fi

echo "=============================================="
echo "   Setup Complete!"
echo "=============================================="
echo ""
echo "To start the backend server:"
echo "  cd backend && python main.py"
echo ""
echo "To start the frontend:"
echo "  npm run dev"
echo ""
echo "To run the analysis script:"
echo "  python scripts/prerana_analysis.py --engine all"
echo ""
