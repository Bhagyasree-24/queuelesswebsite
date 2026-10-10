
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
import {
  createUser,
  getHealth,
  getUsers,
} from '../services/api';

import {
  Activity,
  Database,
  Users,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Server,
  ShieldCheck,
} from 'lucide-react';

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

  const StatusCard = ({
    title,
    description,
    connected,
    loading,
    icon: Icon,
  }) => (
    <Card
      elevation={0}
      className="!rounded-2xl !border !border-black/10 !bg-white"
    >
      <CardContent className="!p-5 sm:!p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6e66b] text-black">
            <Icon size={23} strokeWidth={1.8} />
          </div>

          {loading ? (
            <CircularProgress size={21} sx={{ color: '#c3ae22' }} />
          ) : (
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                connected
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {connected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-gray-500">{title}</p>

        <h3 className="mt-1 text-2xl font-black tracking-tight text-[#171717]">
          {loading ? 'Checking...' : connected ? 'All systems go' : 'Needs attention'}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <main className="min-h-screen bg-[#f6f5f0] px-4 py-6 text-[#171717] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Hero section */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#e9e8e2] px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full border-[35px] border-[#f3e66b]/50" />
          <div className="pointer-events-none absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-[#f3e66b]/30 blur-2xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c4ae24]" />
              <span className="text-xs font-extrabold uppercase tracking-[0.16em]">
                QueueLess · System Dashboard
              </span>
            </div>

            <Typography
              component="h1"
              className="!text-5xl !font-black !leading-[0.94] !tracking-[-0.055em] sm:!text-7xl lg:!text-8xl"
            >
              SYSTEM
              <br />
              <span className="relative inline-block">
                <span className="absolute inset-x-0 bottom-1 top-2 -rotate-1 bg-[#f3e66b]" />
                <span className="relative">HEALTH.</span>
              </span>
            </Typography>

            <p className="mt-7 max-w-xl text-base leading-7 text-gray-700 sm:text-lg">
              Monitor your backend, verify your database connection, and
              test citizen records from one simple dashboard.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                onClick={loadHealth}
                disabled={loadingHealth}
                variant="contained"
                startIcon={<RefreshCw size={17} />}
                className="!rounded-lg !bg-black !px-6 !py-3 !font-bold !text-white hover:!bg-gray-800"
              >
                {loadingHealth ? 'Checking...' : 'Refresh Status'}
              </Button>

              <span className="inline-flex items-center gap-2 px-2 text-sm font-bold">
                <ShieldCheck size={18} />
                Live connection check
              </span>
            </div>
          </div>
        </section>

        {/* Section heading */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#927f13]">
                Overview
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                System status<span className="text-[#b6a21d]">.</span>
              </h2>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Check the services powering your QueueLess application.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <StatusCard
              title="Backend API"
              description="Checks whether the QueueLess server responds successfully."
              connected={backendConnected}
              loading={loadingHealth}
              icon={Server}
            />

            <StatusCard
              title="MongoDB Atlas"
              description="Checks the database connection reported by the backend."
              connected={databaseConnected}
              loading={loadingHealth}
              icon={Database}
            />
          </div>

          {health?.message && !loadingHealth && (
            <Alert severity="info" className="!mt-4 !rounded-xl">
              {health.message}
            </Alert>
          )}

          {healthError && (
            <Alert severity="error" className="!mt-4 !rounded-xl">
              {healthError}
            </Alert>
          )}
        </section>

        {/* MongoDB user test */}
        <section>
          <div className="mb-5">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#927f13]">
              Database tools
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Citizen records<span className="text-[#b6a21d]">.</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Create a test record or retrieve existing users from your database.
            </p>
          </div>

          <Card
            elevation={0}
            className="!overflow-hidden !rounded-2xl !border !border-black/10 !bg-white"
          >
            <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
              {/* Left panel */}
              <div className="bg-[#171717] p-6 text-white sm:p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e66b] text-black">
                  <Users size={24} />
                </div>

                <h3 className="text-2xl font-black tracking-tight">
                  MongoDB
                  <br />
                  User Test.
                </h3>

                <p className="mt-4 max-w-xs text-sm leading-6 text-gray-300">
                  Test the connection between your application and its user
                  records using the existing API functions.
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#f3e66b]">
                  <Activity size={17} />
                  Database diagnostics
                </div>
              </div>

              {/* Form panel */}
              <CardContent className="!p-6 sm:!p-8">
                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleCreateUser}
                >
                  <TextField
                    label="Citizen name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    className="health-input"
                  />

                  <TextField
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    className="health-input"
                  />

                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={creatingUser}
                      endIcon={!creatingUser && <ArrowUpRight size={17} />}
                      className="!rounded-lg !bg-black !px-5 !py-3 !font-bold !text-white hover:!bg-gray-800"
                    >
                      {creatingUser ? 'Creating...' : 'Create Test User'}
                    </Button>

                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleLoadUsers}
                      disabled={loadingUsers}
                      startIcon={
                        loadingUsers ? (
                          <CircularProgress size={16} />
                        ) : (
                          <Users size={17} />
                        )
                      }
                      className="!rounded-lg !border-black !px-5 !py-3 !font-bold !text-black hover:!border-[#b6a21d] hover:!bg-[#f9f5d7]"
                    >
                      {loadingUsers ? 'Loading...' : 'Load Users'}
                    </Button>
                  </div>
                </form>

                {formSuccess && (
                  <Alert
                    severity="success"
                    icon={<CheckCircle2 size={20} />}
                    className="!mt-5 !rounded-xl"
                  >
                    {formSuccess}
                  </Alert>
                )}

                {formError && (
                  <Alert
                    severity="error"
                    icon={<AlertCircle size={20} />}
                    className="!mt-5 !rounded-xl"
                  >
                    {formError}
                  </Alert>
                )}

                {createdUser && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-bold">Created user response</p>
                    <pre className="max-h-72 overflow-auto rounded-xl bg-[#f6f5f0] p-4 text-xs leading-6 text-gray-800">
                      {JSON.stringify(createdUser, null, 2)}
                    </pre>
                  </div>
                )}

                {usersError && (
                  <Alert severity="error" className="!mt-5 !rounded-xl">
                    {usersError}
                  </Alert>
                )}

                {users.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-extrabold">Registered users</p>
                      <span className="rounded-full bg-[#f3e66b] px-3 py-1 text-xs font-black">
                        {users.length} FOUND
                      </span>
                    </div>

                    <pre className="max-h-80 overflow-auto rounded-xl bg-[#f6f5f0] p-4 text-xs leading-6 text-gray-800">
                      {JSON.stringify(users, null, 2)}
                    </pre>
                  </div>
                )}

                {!usersError && users.length === 0 && !loadingUsers && (
                  <p className="mt-5 text-xs leading-5 text-gray-500">
                    Load Users retrieves records through your existing backend
                    API. The panel will display the returned data here.
                  </p>
                )}
              </CardContent>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-3 border-t border-black/10 pt-5 text-xs font-medium text-gray-500 sm:flex-row sm:items-center">
          <p>QUEUELESS · DIGITAL PUBLIC SERVICE PORTAL</p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#c4ae24]" />
            System diagnostics dashboard
          </p>
        </footer>
      </div>
    </main>
  );
}

export default HealthPage;
