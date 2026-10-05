import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
        <h1 className="text-4xl font-semibold text-slate-900">
          QueueLess Government Office
        </h1>
        <p className="text-lg text-slate-600">
          Initial frontend for the QueueLess connectivity test.
        </p>
        <div>
          <Button component={Link} to="/health" variant="contained">
            Open Health Check
          </Button>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
