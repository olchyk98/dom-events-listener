// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, it } from '@jest/globals'
import { extractClasses, extractTagName } from '../src/create-query-element'

describe('Tests for createQueryElement function', () => {
  it('should properly recognize tag name [extractTagName]', () => {
    const tag = 'div'
    const pay = `${tag}.span#super|background:red|`
    const extTag = extractTagName(pay)

    expect(extTag).toBe(tag)
  })

  it('should return null if there is no tag [extractTagName]', () => {
    const pay = '.span#super'
    const extTag = extractTagName(pay)

    expect(extTag).toBe(null)
  })

  it('should property recognize single classname [extractClasses]', () => {
    const pay = 'div.superclass#superid[attr]'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([ 'superclass' ])
  })

  it('should properly recognize multiple classnames [extractClasses]', () => {
    const pay = 'div.superclass.testclass1#superid[attr]|cool:red;|'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([ 'superclass', 'testclass1' ])
  })

  it('should return an empty array if there are no classes [extractClasses]', () => {
    const pay = 'div#superid[attr]|cool:red;|'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([ ])
  })
})
