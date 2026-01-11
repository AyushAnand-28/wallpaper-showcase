# SecondBite: Project Idea

## What is this project about?
SecondBite is a hyper-local "dark store" platform that connects local grocery stores, bakeries, and food vendors directly with consumers. It allows these businesses to sell "ugly" produce, imperfect items, or food that is quickly approaching its "best-by" date at a steep discount.

## What problem does it solve?
1. **Food Waste:** It provides a direct channel to rescue perfectly good food that would otherwise be thrown away into landfills simply because of aesthetic imperfections or expiring shelf life.
2. **Affordable Nutrition:** It gives low-income students, families, or budget-conscious consumers access to high-quality, nutritious food at a fraction of the original retail cost.
3. **Business Loss Recovery:** It allows local vendors to recover some costs from inventory that they would otherwise have to write off as a complete loss.

## Tech Stack Choices

The architecture of SecondBite is built on the **MERN** stack (MongoDB, Express, React, Node.js), chosen for development speed and ecosystem availability:

### Frontend
* **React + Vite:** React provides a component-based architecture perfect for building the dashboard and e-commerce UI. Vite replaces Create React App (CRA) by offering a significantly faster, native ESM-based development server and optimized production builds.
* **Vanilla CSS / Modules:** Chosen over frameworks like Tailwind for explicit control over the "glassmorphism" aesthetic, delivering a high-quality, custom premium design.

### Backend
* **Node.js + Express:** A lightweight and unopinionated server framework that allows for rapid REST API development. Using JavaScript on both the frontend and backend reduces context switching and simplifies the codebase.
* **JWT (JSON Web Tokens):** Used for stateless, role-based authentication (differentiating between `CONSUMER` and `STORE_OWNER`).

### Database
* **MongoDB + Mongoose:** A NoSQL approach is highly flexible for e-commerce. It perfectly handles varying product categories, embedded order items (taking snapshots of product prices at purchase time), and rapid schema iteration.

### DevOps & Deployment
* **Docker & Docker Compose:** Containerization ensures that "it works on my machine" translates flawlessly to production. It isolates the Node backend, the NGINX-served frontend, and the MongoDB database.
* **NGINX:** Acts as a reverse proxy, cleanly routing frontend SPA requests and proxying `/api` traffic directly to the backend container.
* **GitHub Actions:** Provides an automated CI/CD pipeline, building Docker images, pushing them to GHCR (GitHub Container Registry), and deploying directly to an AWS EC2 instance on every push to the main branch.
