'use client'

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import * as styles from './VariablePhraseField.css'

const TOKEN_LABEL: Record<string, string> = {
  '{학원명}': '학원명',
  '{강사명}': '선생님 이름',
  '{학생이름}': '학생 이름',
  '{날짜}': '수업 날짜',
  '{반이름}': '반 이름',
  '{수업일}': '수업 날짜',
}

const TOKEN_RE = /(\{[^}]+\})/g

export const VARIABLE_INSERTS: { label: string; token: string }[] = [
  { label: '학원명', token: '{학원명}' },
  { label: '선생님 이름', token: '{강사명}' },
  { label: '학생 이름', token: '{학생이름}' },
  { label: '수업 날짜', token: '{날짜}' },
  { label: '반 이름', token: '{반이름}' },
]

function labelFor(token: string) {
  return TOKEN_LABEL[token] ?? token.slice(1, -1)
}

function createChip(token: string) {
  const chip = document.createElement('span')
  chip.dataset.token = token
  chip.contentEditable = 'false'
  chip.className = styles.chip
  chip.textContent = labelFor(token)
  return chip
}

function serialize(root: HTMLElement) {
  const hasToken = Boolean(root.querySelector('[data-token]'))
  const plain = (root.textContent ?? '').replace(/\u200b/g, '')
  if (!hasToken && plain === '') return ''

  let out = ''
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += (node.textContent ?? '').replace(/\u200b/g, '').replace(/\u00a0/g, ' ')
      return
    }
    if (!(node instanceof HTMLElement)) return
    if (node.dataset.token) {
      out += node.dataset.token
      return
    }
    if (node.tagName === 'BR') {
      out += '\n'
      return
    }
    const block = node.tagName === 'DIV' || node.tagName === 'P'
    if (block && out.length > 0 && !out.endsWith('\n')) out += '\n'
    node.childNodes.forEach(walk)
  }
  root.childNodes.forEach(walk)
  return out
}

function appendLine(root: HTMLElement, line: string, lineIndex: number) {
  if (lineIndex > 0) root.appendChild(document.createElement('br'))
  const parts = line.split(TOKEN_RE)
  parts.forEach((part) => {
    if (!part) return
    if (part.startsWith('{') && part.endsWith('}')) {
      root.appendChild(createChip(part))
      return
    }
    root.appendChild(document.createTextNode(part))
  })
}

function renderInto(root: HTMLElement, value: string) {
  root.replaceChildren()
  value.split('\n').forEach((line, index) => appendLine(root, line, index))
}

function selectionInside(root: HTMLElement) {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return false
  const node = sel.anchorNode
  return Boolean(node && root.contains(node))
}

function placeCaretAtEnd(root: HTMLElement) {
  const sel = window.getSelection()
  if (!sel) return
  const range = document.createRange()
  range.selectNodeContents(root)
  range.collapse(false)
  sel.removeAllRanges()
  sel.addRange(range)
}

function insertNodesAtCaret(nodes: Node[]) {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return
  const range = sel.getRangeAt(0)
  range.deleteContents()
  const frag = document.createDocumentFragment()
  nodes.forEach((node) => frag.appendChild(node))
  const spacer = document.createTextNode('\u200b')
  frag.appendChild(spacer)
  range.insertNode(frag)
  range.setStart(spacer, spacer.textContent?.length ?? 0)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
}

function nodesFromText(text: string) {
  const nodes: Node[] = []
  text.replace(/\r\n/g, '\n').split('\n').forEach((line, index) => {
    if (index > 0) nodes.push(document.createElement('br'))
    line.split(TOKEN_RE).forEach((part) => {
      if (!part) return
      if (part.startsWith('{') && part.endsWith('}')) {
        nodes.push(createChip(part))
        return
      }
      nodes.push(document.createTextNode(part))
    })
  })
  return nodes
}

export type VariablePhraseFieldHandle = {
  insertToken: (token: string) => void
}

interface VariablePhraseFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
}

const VariablePhraseField = forwardRef<VariablePhraseFieldHandle, VariablePhraseFieldProps>(
  function VariablePhraseField({ value, onChange, placeholder, ariaLabel }, ref) {
    const editorRef = useRef<HTMLDivElement>(null)
    const lastValue = useRef<string | null>(null)

    const emit = () => {
      const root = editorRef.current
      if (!root) return
      const next = serialize(root)
      lastValue.current = next
      onChange(next)
    }

    useLayoutEffect(() => {
      const root = editorRef.current
      if (!root) return
      if (lastValue.current === value) return
      renderInto(root, value)
      lastValue.current = value
    }, [value])

    useImperativeHandle(ref, () => ({
      insertToken(token: string) {
        const root = editorRef.current
        if (!root) return
        root.focus()
        if (!selectionInside(root)) placeCaretAtEnd(root)
        insertNodesAtCaret([createChip(token)])
        emit()
      },
    }))

    return (
      <div className={styles.fieldWrap}>
        <div
          ref={editorRef}
          className={styles.field}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label={ariaLabel}
          spellCheck={false}
          onInput={emit}
          onPaste={(event) => {
            event.preventDefault()
            const root = editorRef.current
            if (!root) return
            if (!selectionInside(root)) placeCaretAtEnd(root)
            const text = event.clipboardData.getData('text/plain')
            if (!text) return
            insertNodesAtCaret(nodesFromText(text))
            emit()
          }}
        />
        {value.length === 0 ? <span className={styles.placeholder}>{placeholder}</span> : null}
      </div>
    )
  },
)

export default VariablePhraseField
