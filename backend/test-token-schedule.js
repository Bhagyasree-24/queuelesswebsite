
const { getTokenAvailability } = require("./src/utils/officeSchedule");

const office = {};

const tests = [
  {
    name: "Before opening — 9:59 AM",
    now: "2026-10-09T04:29:00Z",
    expected: false,
  },
  {
    name: "Opening time — 10:00 AM",
    now: "2026-10-09T04:30:00Z",
    expected: true,
  },
  {
    name: "Before cutoff — 4:29 PM",
    now: "2026-10-09T10:59:00Z",
    expected: true,
  },
  {
    name: "At cutoff — 4:30 PM",
    now: "2026-10-09T11:00:00Z",
    expected: false,
  },
  {
    name: "After cutoff — 4:31 PM",
    now: "2026-10-09T11:01:00Z",
    expected: false,
  },
  {
    name: "Sunday — office closed",
    now: "2026-10-11T04:30:00Z",
    expected: false,
  },
];

let failures = 0;

for (const test of tests) {
  const result = getTokenAvailability(office, new Date(test.now));
  const passed = result.allowed === test.expected;

  console.log(
    `${passed ? "PASS" : "FAIL"}: ${test.name} — ${
      result.allowed ? "ALLOWED" : "BLOCKED"
    }`
  );

  if (!passed) failures++;
}

const holidayOffice = {
  holidays: [{ date: "2026-10-09", name: "Test Holiday" }],
};

const holidayResult = getTokenAvailability(
  holidayOffice,
  new Date("2026-10-09T04:30:00Z")
);

console.log(
  `${!holidayResult.allowed ? "PASS" : "FAIL"}: Configured holiday — ${
    holidayResult.allowed ? "ALLOWED" : "BLOCKED"
  }`
);

if (holidayResult.allowed) failures++;

console.log(
  failures === 0
    ? "\nAll schedule tests passed."
    : `\n${failures} test(s) failed.`
);

process.exitCode = failures === 0 ? 0 : 1;