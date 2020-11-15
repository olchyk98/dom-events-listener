import fs from 'fs'
import path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, it } from '@jest/globals'
import { JSDOM } from 'jsdom'
import {
  extractClasses, extractTagName, extractId, extractAttributes, extractStyles, createQueryElement,
} from '../src/create-query-element'

describe('.extractTagName', () => {
  it('should properly recognize tag name', () => {
    const tag = 'div'
    const pay = `${tag}.span#super|background:red|`
    const extTag = extractTagName(pay)

    expect(extTag).toBe(tag)
  })

  it('should return null if there is no tag', () => {
    const pay = '.span#super'
    const extTag = extractTagName(pay)

    expect(extTag).toBe(null)
  })
})

describe('.extractClasses', () => {
  it('[extractClasses] should property recognize single classname', () => {
    const pay = 'div.superclass#superid[attr]'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([ 'superclass' ])
  })

  it('should properly recognize multiple classnames', () => {
    const pay = 'div.superclass.testclass1#superid[attr]|cool:red;|'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([ 'superclass', 'testclass1' ])
  })

  it('should return an empty array if there are no classes', () => {
    const pay = 'div#superid[attr]|cool:red;|'
    const extClass = extractClasses(pay)

    expect(extClass).toEqual([])
  })
})

describe('.extractId', () => {
  it('should properly recognize id', () => {
    const pay = 'div#superid[attr]|background-color:blue;|'
    const extId = extractId(pay)

    expect(extId).toBe('superid')
  })

  it('should return null if there is no id', () => {
    const pay = 'div[isup=true]'
    const extId = extractId(pay)

    expect(extId).toBe(null)
  })
})

describe('.extractAttributes', () => {
  it('should properly recognize singular attribute', () => {
    const pay = 'div[isup=true]'
    const extId = extractAttributes(pay)

    expect(extId).toStrictEqual([
      {
        key: 'isup',
        value: 'true',
      },
    ])
  })

  it('should properly recognize multiple attributes', () => {
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

  it('should set attribute value to true if attribute has only a name', () => {
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

  it('should return an empty array if no attributes were passed', () => {
    const pay = 'div.cool|background:red;|'
    const extId = extractAttributes(pay)

    expect(extId).toStrictEqual([])
  })
})

describe('.extractStyles', () => {
  it('should properly recognize singular style property', () => {
    const pay = 'div[isup=true]|background:red;|'
    const extId = extractStyles(pay)

    expect(extId).toStrictEqual([
      {
        key: 'background',
        value: 'red',
      },
    ])
  })

  it('should properly recognize multiple style properties', () => {
    const pay = 'div[isup=true]|background:red; color: purple;|'
    const extId = extractStyles(pay)

    expect(extId).toStrictEqual([
      {
        key: 'background',
        value: 'red',
      },
      {
        key: 'color',
        value: 'purple',
      },
    ])
  })

  it('should return an empty if no style properties were passed', () => {
    const pay = 'div[isup=true]'
    const extId = extractStyles(pay)

    expect(extId).toStrictEqual([])
  })
})

describe('e2e tests', () => {
  // Generates DOM structure from the web index file
  const fHTML = fs.readFileSync(path.join(__dirname, '../web/index.html'))
  const DOM = new JSDOM(fHTML)
  global.document = DOM.window.document
  global.window = DOM.window

  it('createQueryElement function should correctly return an element based on query "#crazy"', () => {
    const payload = '#crazy'

    // Generates element
    const element = createQueryElement(payload)

    // Checks if element tagname and id is right
    expect(element.tagName).toBe('DIV')

    expect(element.id).toBe('crazy')
  })

  it('createQueryElement function should correctly return an element based on query "span#crazyitem{This is The way}"', () => {
    const payload = 'span#crazyitem{This is The way}'

    // Generates element
    const element = createQueryElement(payload)

    // Checks if element tagname, id and textcontent is right
    expect(element.tagName).toBe('SPAN')

    expect(element.id).toBe('crazyitem')

    expect(element.textContent).toBe('This is The way')
  })

  it('createQueryElement function should correctly process a complex query and generate an element with right meta ', () => {
    const payload = 'span#superId.myclass1.myclass2[attr=2, isCool]|background:red; height:200px; width: 300px;|'

    // Generates element using a complicated query
    const element = createQueryElement(payload)

    // Checks if element has correct styles, attributes and classes
    expect(element.tagName).toBe('SPAN')

    expect(element.id).toBe('superId')

    expect(element.classList.contains('myclass1')).toBe(true)

    expect(element.classList.contains('myclass2')).toBe(true)

    expect(element.getAttribute('attr')).toBe('2')

    expect(element.getAttribute('isCool')).toBe('true')

    expect(element.style.background).toBe('red')

    expect(element.style.height).toBe('200px')

    expect(element.style.width).toBe('300px')
  })
})
