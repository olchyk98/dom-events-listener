// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, expect } from '@jest/globals'
import { extractTagName } from '../src/create-query-element'

describe('Tests for createQueryElement function', () => {
  it('should properly recognize tag name', () => {
    const tag = 'div'
    const pay = `${tag}.span#super|background:red|`
    const extTag = extractTagName(pay)

    expect(extTag).toBe(tag)
  })
})
