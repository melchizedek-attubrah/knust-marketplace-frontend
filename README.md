# KNUST Marketplace — Frontend Application

React + TypeScript frontend for the KNUST peer-to-peer campus marketplace website.

## Features Integrated

- **Authentication & Authorization**: Student registration (`@st.knust.edu.gh` / `@knust.edu.gh`), token verification, login, JWT bearer token persistence (`localStorage`), safe `/api/auth/me` profile retrieval, role-based controls.
- **Marketplace Browsing**: Live product discovery, instant keyword search, campus pickup point filter (Independence, Unity, Queens, Commercial area), category chips, condition filters (Brand New / Used), price sorting, responsive product cards.
- **Product Details & Campus Meetups**: Multi-image preview, seller profile with rating summary, meetup request scheduling (pickup point and preferred date/time).
- **Two-Party Order & Stepper Workflow**:
  1. *Requested* — Buyer places campus meetup request.
  2. *Accepted* — Seller accepts the scheduled meetup time.
  3. *Meetup Confirmed* — Both parties confirm arrival at the designated campus point.
  4. *Completed* — Item inspection & in-person payment confirmed.
- **Ratings & Reviews**: 1–5 star deal rating with quick-tag feedback and comment submission for completed orders; aggregated vendor rating statistics.
- **Student Safety & Moderation**: Reporting scam/violation listings or users, blocking/unblocking users.
- **Student Vendor Dashboard**: Vendor shop application workflow (`PENDING`, `APPROVED`, `REJECTED`), shop profile customization, new product listing form with multiple image upload, active product management.
- **Administrator Panel**: Platform aggregate metrics, pending vendor approvals/rejections, product moderation (removal), report resolution/dismissal, user directory.

## Development Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend development server runs on `http://localhost:5173`.

## Production Build

```bash
npm run build
```

Build outputs are generated in `frontend/dist/`.
Preview the production build with:

```bash
npm run preview
```

## Environment Variables

Configured in `frontend/.env` (see `.env.example`):

- `VITE_API_BASE_URL`: Base URL of the backend API (defaults to `http://localhost:3000` for local development).
