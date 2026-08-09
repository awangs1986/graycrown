import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { cpp } from '@codemirror/lang-cpp';
import { lintGutter, setDiagnostics } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';

export function createEditor(parent, onChange) {
  const listener = EditorView.updateListener.of(update => {
    if (update.docChanged) onChange(update.state.doc.toString());
  });
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: '',
      extensions: [
        lineNumbers(), highlightActiveLine(), highlightActiveLineGutter(), history(), lintGutter(),
        cpp(), oneDark, keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]), listener,
        EditorView.lineWrapping,
        EditorView.theme({
          '&': { fontSize: '15px' },
          '.cm-content': { caretColor: '#70d9ed' },
          '&.cm-focused': { outline: 'none' }
        })
      ]
    })
  });

  return {
    getValue: () => view.state.doc.toString(),
    setValue(value) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
    },
    setDiagnostics(items) {
      const doc = view.state.doc;
      const diagnostics = items.map(item => {
        const lineNumber = Math.max(1, Math.min(item.line || 1, doc.lines));
        const line = doc.line(lineNumber);
        const column = Math.max(1, item.column || 1);
        const from = Math.min(line.to, line.from + column - 1);
        return {
          from,
          to: Math.min(line.to, Math.max(from + 1, from)),
          severity: item.level === 'warning' ? 'warning' : 'error',
          message: item.message
        };
      });
      view.dispatch(setDiagnostics(view.state, diagnostics));
    },
    setFontSize(size) {
      parent.style.setProperty('--editor-font-size', `${size}px`);
      view.dom.style.fontSize = `${size}px`;
      view.requestMeasure();
    },
    focus: () => view.focus()
  };
}
