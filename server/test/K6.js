const http = require("k6/http");
const { sleep, check, fail } = require("k6");

export const options = {
  // Key configurations for avg load test in this section
  stages: [
    { duration: "5m", target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "30m", target: 100 }, // stay at 100 users for 30 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};

export default function teste() {
  let res = http.get("http://localhost:1003/api/times");
  check(res, {
    "status is 200": (r) => r.status == 200,
    "transaction time < 1s": (r) => r.timings.duration < 1000,
  });
  sleep(1);
}

/*
function test() {
  let res = http.get("http://localhost:3000/time");

  GetTimeDuration.add(res.timings.duration);
  GetTimeReqs.add(1);
  GetCustomerFailRate.add(res.status == 0 || res.status >= 400);
  GetCustomerSuccessRate.add(res.status < 400);
  let durationMsg = "Max Duration $(1000/1000s)";
  if (
    !check(res, {
      "max duration": (r) => r.timings.duration < 1000,
    })
  ) {
    fail(durationMsg);
  }

  sleep(1);
}

test();
*/
