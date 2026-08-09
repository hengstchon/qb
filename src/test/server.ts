import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { qb4MainDataFixture } from './fixtures/qb4'
import { qb5MainDataFixture } from './fixtures/qb5'

export const apiServer = setupServer(
  http.get('*/api/v2/sync/maindata', ({ request }) =>
    HttpResponse.json(
      request.headers.get('x-qb-fixture') === '4'
        ? qb4MainDataFixture
        : qb5MainDataFixture,
    ),
  ),
)
