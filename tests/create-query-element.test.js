// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, it } from '@jest/globals'
import {
  extractClasses, extractTagName, extractId, extractAttributes,
} from '../src/create-query-element'

describe('Tests for createQueryElement function', () => {
  it('[extractTagName] should properly recognize tag name', () => {
    const tag = 'div'
    const pay = `${tag}.span#super|background:red|`
    const extTag = extractTagName(pay)

    expect(extTag).toBe(tag)
  })

  it('[extractTagName] should return null if there is no tag', () => {
    const pay = '.span#super'
    const extTag = extractTagName(pay)

    expect(extTag).toBe(null)
  })

  it('[extractClasses] should property recognize single classname', () => {
    const pay = 'div.superclass#superid[attr]'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([ 'superclass' ])
  })

  it('[extractClasses] should properly recognize multiple classnames', () => {
    const pay = 'div.superclass.testclass1#superid[attr]|cool:red;|'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([ 'superclass', 'testclass1' ])
  })

  it('[extractClasses] should return an empty array if there are no classes', () => {
    const pay = 'div#superid[attr]|cool:red;|'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([ ])
  })

  it('[extractId] should properly recognize id', () => {
    const pay = 'div#superid[attr]|background-color:blue;|'
    const extId = extractId(pay)

    expect(extId).toBe('superid')
  })

  it('[extractId] should return null if there is no id', () => {
    const pay = 'div[isup=true]'
    const extId = extractId(pay)

    expect(extId).toBe(null)
  })

  it('[extractAttributes] should properly recognize singular attribute', () => {
    const pay = 'div[isup=true]'
    const extId = extractAttributes(pay)

    expect(extId).toStrictEqual([
      {
        key: 'isup',
        value: 'true',
      },
    ])
  })

  it('[extractAttributes] should properly recognize multiple attributes', () => {
    const pay = 'div[isup=true, isgood=true,great= false]#purple'
    const extId = extractAttributes(pay)

    expect(extId).toStrictEqual([
      {
        key: 'isup',
        value: 'true',
      },
      {
        key: 'isgood',
        value: 'true',
      },
      {
        key: 'great',
        value: 'false',
      },
    ])
  })

  it('[extractAttributes] should set attribute value to true if attribute has only a name', () => {
    const pay = 'div[isup=false,great]|background:blue|'
    const extId = extractAttributes(pay)

    expect(extId).toStrictEqual([
      {
        key: 'isup',
        value: 'false',
      },
      {
        key: 'great',
        value: 'true',
      },
    ])
  })

  it('[extractAttributes] should return an empty array if no attributes were passed', () => {
    const pay = 'div.cool|background:red;|'
    const extId = extractAttributes(pay)

    expect(extId).toStrictEqual([])
  })
})
