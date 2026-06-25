#!/bin/bash

# --- Color Definitions for Premium UI ---
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Clean up all background jobs on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all running processes...${NC}"
    if [ ! -z "$SERVER_PID" ]; then
        echo -e "${RED}Stopping Backend server (PID: $SERVER_PID)...${NC}"
        kill $SERVER_PID 2>/dev/null
    fi
    if [ ! -z "$FRONT_PID" ]; then
        echo -e "${RED}Stopping Frontend server (PID: $FRONT_PID)...${NC}"
        kill $FRONT_PID 2>/dev/null
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

# --- Header Banner ---
clear
echo -e "${CYAN}${BOLD}====================================================${NC}"
echo -e "${CYAN}${BOLD}     🎮 Poptile Puzzle Game Project Starter 🎮      ${NC}"
echo -e "${CYAN}${BOLD}====================================================${NC}"
echo -e "Developed for elegant, one-click local orchestration.\n"

# --- Step 1: Environment Variables Check ---
echo -e "${BLUE}[Step 1/3] Checking environment files...${NC}"
if [ ! -f server/.env ]; then
    echo -e "${YELLOW}⚠️  server/.env file not found.${NC}"
    echo -e "Creating server/.env from server/.env.example..."
    cp server/.env.example server/.env
    echo -e "${GREEN}✓ server/.env file successfully created.${NC}"
    echo -e "${YELLOW}👉 Note: Please review server/.env to configure credentials (e.g. GOOGLE_CLIENT_ID) if needed.${NC}"
else
    echo -e "${GREEN}✓ server/.env file exists.${NC}"
fi
echo ""

# --- Step 2: Choose Execution Mode ---
echo -e "${BLUE}[Step 2/3] Choose your execution mode:${NC}"
echo -e "  ${BOLD}1)${NC} 🐳 ${BOLD}Docker Compose Mode${NC} (Runs inside isolated containers)"
echo -e "  ${BOLD}2)${NC} ⚡ ${BOLD}Local Development Mode${NC} (Concurrently runs Go & Vite on host machine)"
echo -e "  ${BOLD}3)${NC} 🧹 ${BOLD}Clean Docker Environment${NC} (Stops containers & cleans cache)"
echo -e "  ${BOLD}4)${NC} ❌ Exit"
echo ""
read -p "Select an option [1-4]: " OPTION

case $OPTION in
    1)
        # --- Docker Compose Mode ---
        echo -e "\n${BLUE}[Step 3/3] Launching with Docker Compose...${NC}"
        # Check if docker-compose is installed
        if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
            echo -e "${RED}❌ Error: docker-compose or docker compose is not installed.${NC}"
            echo -e "Please install Docker and try again, or choose Option 2 (Local Development Mode)."
            exit 1
        fi
        
        # Determine docker-compose command
        DOCKER_CMD="docker-compose"
        if ! command -v docker-compose &> /dev/null; then
            DOCKER_CMD="docker compose"
        fi

        echo -e "${GREEN}Running: $DOCKER_CMD up --build${NC}"
        $DOCKER_CMD up --build
        ;;
        
    2)
        # --- Local Development Mode ---
        echo -e "\n${BLUE}[Step 3/3] Initializing Local Development Mode...${NC}"
        
        # Prerequisites checks
        CHECK_FAILED=0
        
        echo -e "Checking prerequisites..."
        if ! command -v go &> /dev/null; then
            echo -e "${RED}❌ Go is not installed. Go 1.17+ is required.${NC}"
            CHECK_FAILED=1
        else
            GO_VER=$(go version | awk '{print $3}')
            echo -e "${GREEN}✓ Go installed ($GO_VER)${NC}"
        fi

        if ! command -v node &> /dev/null; then
            echo -e "${RED}❌ Node.js is not installed.${NC}"
            CHECK_FAILED=1
        else
            NODE_VER=$(node -v)
            echo -e "${GREEN}✓ Node.js installed ($NODE_VER)${NC}"
        fi

        if ! command -v yarn &> /dev/null; then
            echo -e "${RED}❌ Yarn is not installed. Run 'npm install -g yarn' or use npm.${NC}"
            CHECK_FAILED=1
        else
            YARN_VER=$(yarn -v)
            echo -e "${GREEN}✓ Yarn installed ($YARN_VER)${NC}"
        fi

        if [ $CHECK_FAILED -eq 1 ]; then
            echo -e "${RED}❌ Prerequisites check failed. Please install missing tools and try again.${NC}"
            exit 1
        fi

        # Check if ports are already in use
        PORT_8080=$(lsof -i :8080 -t 2>/dev/null)
        if [ ! -z "$PORT_8080" ]; then
            echo -e "${YELLOW}⚠️  Port 8080 is already in use by process: $PORT_8080.${NC}"
            read -p "Do you want to terminate this process? (y/n): " KILL_8080
            if [[ "$KILL_8080" =~ ^[Yy]$ ]]; then
                kill -9 $PORT_8080
                echo -e "${GREEN}✓ Process $PORT_8080 terminated.${NC}"
            else
                echo -e "${RED}❌ Port 8080 is busy. Cannot start backend server.${NC}"
                exit 1
            fi
        fi

        # Install dependencies and start servers
        echo -e "\n${CYAN}📦 Installing frontend dependencies with Yarn...${NC}"
        cd front
        yarn install
        
        # Prompt for Protobuf generation
        read -p "Do you want to regenerate Protobuf files? (y/n) [n]: " GEN_PROTO
        if [[ "$GEN_PROTO" =~ ^[Yy]$ ]]; then
            echo -e "${CYAN}⚙️  Generating Protobuf definitions...${NC}"
            if command -v pb &> /dev/null; then
                pb vendor install
            fi
            yarn generate
            cd ../server
            go generate ./...
            cd ..
            echo -e "${GREEN}✓ Protobuf generated successfully.${NC}"
        else
            cd ..
            echo -e "${YELLOW}Skipping Protobuf generation.${NC}"
        fi

        # Start Back-end
        echo -e "\n${GREEN}🚀 Starting Go Backend Server (Port: 8080)...${NC}"
        cd server
        go run main.go &
        SERVER_PID=$!
        cd ..

        # Wait a moment for Backend to initialize
        sleep 2

        # Start Front-end
        echo -e "\n${GREEN}🚀 Starting React + Vite Frontend Server...${NC}"
        cd front
        yarn dev &
        FRONT_PID=$!
        cd ..

        echo -e "\n${CYAN}${BOLD}====================================================${NC}"
        echo -e "${GREEN}${BOLD}🎉 Both services are running concurrently!${NC}"
        echo -e "  - Backend API:   ${BOLD}http://localhost:8080${NC}"
        echo -e "  - Frontend App:  Check the console output below for Vite's local URL (typically http://localhost:5173)"
        echo -e "${CYAN}${BOLD}====================================================${NC}"
        echo -e "${YELLOW}Press [Ctrl+C] to stop all services and exit safely.${NC}\n"

        # Keep the script running to stream logs
        wait
        ;;

    3)
        echo -e "\n${YELLOW}🧹 Cleaning up Docker containers and cache...${NC}"
        if command -v docker-compose &> /dev/null; then
            docker-compose down --rmi local --volumes --remove-orphans
        elif docker compose version &> /dev/null; then
            docker compose down --rmi local --volumes --remove-orphans
        else
            echo -e "${RED}Docker Compose not found. Nothing to clean.${NC}"
        fi
        echo -e "${GREEN}✓ Cleanup complete.${NC}"
        ;;

    4|*)
        echo -e "\nExiting. Have a great day! 👋"
        exit 0
        ;;
esac
