# ♟️ RudeChess

A modern online chess platform hosted at **[rudechess.xyz](https://rudechess.xyz)**.  
Play chess instantly against other players or AI bots, chat live, and enjoy a fast, reliable experience with sessions saved in the cloud.  

## 🚀 Features  
- 🎮 **Random matchmaking** against real players  
- 🤖 **Play against bots** when no opponent is available  
- 💬 **Live in-game chat**  
- 🔐 **Login & registration system** with session saving  
- 🌍 **Deployed on AWS EC2 with Nginx** for performance and reliability  
- 📜 **Full chess rules** implemented (castling, promotion, en passant, check, checkmate)  

## 🛠️ Tech Stack  
- **Frontend**: React 19, Vite, TypeScript  
- **Backend**: Node.js, Express  
- **Real-time Communication**: Socket.io  
- **Auth & State**: Sessions with persistent login  
- **Validation**: Zod  
- **UI & Icons**: Headless UI, FontAwesome, Boxicons, MDB  
- **Utilities**: Immutable.js
- **Deployment**: AWS EC2 + Nginx, Route 53 for DNS  

## 📦 Installation (Development Setup)  

Clone the repository:  
```bash
git clone https://github.com/RudarLaki/UpdatedChessApp-TS-
cd rudechess
```

Install dependencies:  
```bash
npm install
```

Run locally:  
```bash
npm run dev
```

Build for production:  
```bash
npm run build
```

Preview build:  
```bash
npm run preview
```

## 🌍 Deployment Setup  

### 1. EC2 + Nginx  
- Provision an **EC2 instance** (Ubuntu recommended).  
- Install **Node.js**, **PM2** (or systemd) to run your backend.  
- Install **Nginx** and configure it as a reverse proxy (serving React build + proxying Socket.io requests).  
- Assign an **Elastic IP** to your instance so the IP doesn’t change.  

### 2. DNS with Route 53  
- Create a **Hosted Zone** for `rudechess.xyz`.  
- Add records:  
  - **A Record** → `rudechess.xyz` → Elastic IP of EC2  
  - **CNAME Record (optional)** → `www.rudechess.xyz` → `rudechess.xyz`  
- At your domain registrar, update **NS records** to match Route 53 name servers.  

👉 Protocols used:  
- DNS runs on **UDP/TCP port 53** (handled by Route 53).  
- Browser traffic runs on **HTTP (80)** / **HTTPS (443)** to Nginx on EC2.  

### 3. SSL (Optional but recommended)  
- Use **Certbot (Let’s Encrypt)** to enable HTTPS on Nginx.  

## 📷 Screenshots  
_(Add screenshots or GIFs of matchmaking, game UI, and chat here)_  

## 🔮 Future Improvements  

### ♟️ Chess Features  
- [ ] Checkmate detection & proper game termination  
- [ ] Undo / Redo buttons (logic already implemented, needs UI buttons)  
- [ ] Resign & Offer Draw buttons  
- [ ] Load PGN files  
- [ ] Position evaluation (who is winning)  
- [ ] ELO rating system  
- [ ] ELO-based matchmaking  
- [ ] Timer improvements  
- [ ] Challenge link for playing with a friend  
- [ ] Profile pages  
- [ ] Puzzles & training mode  
- [ ] Leaderboard & Friends system  
- [ ] Drag-and-drop piece movement (improve current setup)  
- [ ] Android release (Google Play)  

### 🛠️ Code & Design  
- [ ] Improve TypeScript typing  
- [ ] Better modularization of code  
- [ ] Refined UI/UX design (collaboration with Matija)  

### 📷 Advanced Features  
- [ ] Upload a photo of a real chessboard (from white’s perspective) → app reconstructs the board → challenge a friend with that setup  
- [ ] Add historical games from famous players so users can replay or continue them  

## 📜 License  
This project is licensed under the MIT License.  
