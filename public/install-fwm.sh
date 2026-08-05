#!/usr/bin/env bash
set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Clear terminal and print FWM ASCII Logo
clear
echo -e "${YELLOW}"
cat << "EOF"
    __                   
   / _|__      ___ __ ___  
  | |_ \ \ /\ / / '_ ` _ \ 
  |  _| \ V  V /| | | | | |
  |_|    \_/\_/ |_| |_| |_|
                           
EOF
echo -e "${NC}"
echo -e "${CYAN}==> Welcome to the fwm (Physics Window Manager) Installer${NC}\n"

# 1. Create a temporary directory
TMP_DIR=$(mktemp -d -t fwm-install-XXXXXX)
echo -e "${YELLOW}==> Cloning fwm repository into temporary workspace...${NC}"
git clone --depth 1 https://github.com/iluaii/fwm.git "$TMP_DIR"

# 2. Run the official installer
echo -e "\n${YELLOW}==> Starting official installation process...${NC}"
cd "$TMP_DIR"
./install.sh

# 3. Clean up
echo -e "\n${YELLOW}==> Cleaning up temporary files...${NC}"
cd ~
rm -rf "$TMP_DIR"

echo -e "\n${GREEN}==> ✨ fwm Installation Complete! ✨${NC}"
echo -e "You can now select 'fwm' from your display manager, or run 'fwm' from a TTY."
echo -e "Default config written to: ~/.config/fwm/config.toml\n"