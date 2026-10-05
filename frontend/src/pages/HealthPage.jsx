import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { createUser, getHealth, getUsers } from '../services/api';

function HealthPage() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState('');
  const [loadingHealth, setLoadingHealth] = useState(true);

  const [name, setName] = useState('Test Citizen');
  const [email, setEmail] = useState('test@example.com');
  const [createdUser, setCreatedUser] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  async function loadHealth() {
    setLoadingHealth(true);
    setHealthError('');

    try {
      const data = await getHealth();
      setHealth(data);
    } catch (error) {
      setHealth(null);
      setHealthError(error.message);
    } finally {
      setLoadingHealth(false);
    }
  }

  useEffect(() => {
    loadHealth();
  }, []);

  async function handleCreateUser(event) {
    event.preventDefault();
    setCreatingUser(true);
    setFormError('');
    setFormSuccess('');
    setCreatedUser(null);

    try {
      const data = await createUser({ name, email });
      setCreatedUser(data.user);
      setFormSuccess('Test user created in MongoDB Atlas.');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setCreatingUser(false);
    }
  }

  async function handleLoadUsers() {
    setLoadingUsers(true);
    setUsersError('');

    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (error) {
      setUsers([]);
      setUsersError(error.message);
    } finally {
      setLoadingUsers(false);
    }
  }

  const backendConnected = Boolean(health?.success);
  const databaseConnected = health?.database === 'connected';

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
        <Typography variant="h4" component="h1">
          QueueLess System Health
        </Typography>

        <Card>
          <CardContent className="flex flex-col gap-3">
            {loadingHealth ? (
              <div className="flex items-center gap-3">
                <CircularProgress size={22} />
                <Typography>Checking backend connection...</Typography>
              </div>
            ) : (
              <>
                <Typography>
                  Backend: {backendConnected ? 'Connected' : 'Disconnected'}
                </Typography>
                <Typography>
                  Database:{' '}
                  {databaseConnected ? 'Connected' : 'Disconnected'}
                </Typography>
                {health?.message ? (
                  <Typography>{health.message}</Typography>
                ) : null}
                {healthError ? (
                  <Alert severity="error">{healthError}</Alert>
                ) : null}
                <div>
                  <Button variant="outlined" onClick={loadHealth}>
                    Recheck Health
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-4">
              MongoDB User Test
            </Typography>
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={handleCreateUser}
            >
              <TextField
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={creatingUser}
                >
                  Create Test User
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleLoadUsers}
                  disabled={loadingUsers}
                >
                  Load Users
                </Button>
              </div>
            </form>

            {formSuccess ? (
              <Alert className="mt-4" severity="success">
                {formSuccess}
              </Alert>
            ) : null}
            {formError ? (
              <Alert className="mt-4" severity="error">
                {formError}
              </Alert>
            ) : null}
            {createdUser ? (
              <pre className="mt-4 overflow-x-auto rounded bg-slate-100 p-4 text-sm">
                {JSON.stringify(createdUser, null, 2)}
              </pre>
            ) : null}
            {usersError ? (
              <Alert className="mt-4" severity="error">
                {usersError}
              </Alert>
            ) : null}
            {users.length > 0 ? (
              <pre className="mt-4 overflow-x-auto rounded bg-slate-100 p-4 text-sm">
                {JSON.stringify(users, null, 2)}
              </pre>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default HealthPage;
