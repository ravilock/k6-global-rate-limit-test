import { v4 as uuid } from 'uuid';
import http from 'k6/http';
import { check } from 'k6';

// generate 5 uuids
const uuids = [];
for (let i = 0; i < 5; i++) {
  uuids.push(uuid());
}
console.log("Using the following UUIDs: ", uuids);

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 500,
      timeUnit: '1s', // (rate) iterations per second
      duration: '60s',
      preAllocatedVUs: 10, // how large the initial pool of VUs would be
      maxVUs: 50, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {
  const res = http.get('', {
    headers: {
      'Rate-Limit-Mock': uuids[Math.floor(Math.random() * uuids.length)],
    }
  })

  check(res, {
    'status is 2XX': (r) => r.status >= 200 && r.status < 300,
    'status is 401': (r) => r.status === 401,
    'status is 404': (r) => r.status === 404,
    'status is 403': (r) => r.status === 403,
    'status is 429': (r) => r.status === 429,
    'status is 4xx': (r) => r.status >= 400 && r.status < 500 && [401, 404, 403, 429].indexOf(r.status) === -1,
    'status is 500': (r) => r.status >= 500,
  });
}
