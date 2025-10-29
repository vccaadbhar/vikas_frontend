import { describe, it, expect, vi } from 'vitest'
import * as auth from './auth'
import axios from 'axios'

vi.mock('axios')

describe('auth service', () => {
  it('login should return data on success', async () => {
    const mocked = { data: { token: 'abc', user: { name: 'Test' } } }
    axios.post.mockResolvedValueOnce(mocked)
    const res = await auth.login('a@b.com', 'pass')
    expect(res).toEqual(mocked.data)
  })
})
