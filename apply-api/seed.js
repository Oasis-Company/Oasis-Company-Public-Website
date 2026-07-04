/**
 * Oasis Apply API — KV Seed Script
 * ==================================
 * Run this script to seed the initial proposal data into KV.
 *
 * Usage:
 *   npx wrangler kv:key put --binding=APPLICATIONS_KV "proposal:list" '["prop-1","prop-2","prop-3","prop-4"]'
 *   npx wrangler kv:key put --binding=APPLICATIONS_KV "proposal:prop-1" '{"id":"prop-1","name":"Oasis Bio Lab","description":"A dedicated lab for synthetic biology research within the Oasis ecosystem.","proposer":"Community","votes":23,"total":50,"status":"voting","submitted":"2026-07-01T00:00:00.000Z"}'
 *   npx wrangler kv:key put --binding=APPLICATIONS_KV "proposal:prop-2" '{"id":"prop-2","name":"Oasis Robotics","description":"Physical robotics division — bridging the virtual and the physical.","proposer":"Community","votes":17,"total":50,"status":"voting","submitted":"2026-07-01T00:00:00.000Z"}'
 *   npx wrangler kv:key put --binding=APPLICATIONS_KV "proposal:prop-3" '{"id":"prop-3","name":"Oasis Education","description":"Educational platform and curriculum for the Oasisverse.","proposer":"Community","votes":31,"total":50,"status":"voting","submitted":"2026-07-02T00:00:00.000Z"}'
 *   npx wrangler kv:key put --binding=APPLICATIONS_KV "proposal:prop-4" '{"id":"prop-4","name":"Oasis Media Lab","description":"Content creation, storytelling, and media production for Oasis.","proposer":"Community","votes":12,"total":50,"status":"voting","submitted":"2026-07-02T00:00:00.000Z"}'
 *   npx wrangler kv:key put --binding=APPLICATIONS_KV "counter:props" "4"
 *   npx wrangler kv:key put --binding=APPLICATIONS_KV "counter:apps" "0"
 */

export const SEED_DATA = {
  'proposal:list': ['prop-1', 'prop-2', 'prop-3', 'prop-4'],
  'proposal:prop-1': {
    id: 'prop-1',
    name: 'Oasis Bio Lab',
    description: 'A dedicated lab for synthetic biology research within the Oasis ecosystem.',
    proposer: 'Community',
    votes: 23,
    total: 50,
    status: 'voting',
    submitted: '2026-07-01T00:00:00.000Z',
  },
  'proposal:prop-2': {
    id: 'prop-2',
    name: 'Oasis Robotics',
    description: 'Physical robotics division — bridging the virtual and the physical.',
    proposer: 'Community',
    votes: 17,
    total: 50,
    status: 'voting',
    submitted: '2026-07-01T00:00:00.000Z',
  },
  'proposal:prop-3': {
    id: 'prop-3',
    name: 'Oasis Education',
    description: 'Educational platform and curriculum for the Oasisverse.',
    proposer: 'Community',
    votes: 31,
    total: 50,
    status: 'voting',
    submitted: '2026-07-02T00:00:00.000Z',
  },
  'proposal:prop-4': {
    id: 'prop-4',
    name: 'Oasis Media Lab',
    description: 'Content creation, storytelling, and media production for Oasis.',
    proposer: 'Community',
    votes: 12,
    total: 50,
    status: 'voting',
    submitted: '2026-07-02T00:00:00.000Z',
  },
};