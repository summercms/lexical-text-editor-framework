/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorState,
  EditorThemeClasses,
  LexicalEditor,
  SerializedElementNode,
  SerializedLexicalNode,
  SerializedTextNode,
  Spread,
} from 'lexical';

import {CodeHighlightNode, CodeNode} from '@lexical/code';
import {HashtagNode} from '@lexical/hashtag';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {OverflowNode} from '@lexical/overflow';
import {LexicalComposer} from '@lexical/react/src/LexicalComposer';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {TableCellNode, TableNode, TableRowNode} from '@lexical/table';
import {createEditor, DecoratorNode, ElementNode, TextNode} from 'lexical';
import * as React from 'react';
import {createRef, RefObject} from 'react';
import {createRoot} from 'react-dom/client';
import * as ReactTestUtils from 'react-dom/test-utils';
import {Klass} from 'shared/types';

import {resetRandomKey} from '../../LexicalUtils';

type TestEnv = {
  container?: HTMLDivElement;
  editor?: LexicalEditor;
  outerHTML: string;
};

export function initializeUnitTest(
  runTests: (testEnv: Required<TestEnv>) => void,
  editorConfig = {},
) {
  const testEnv: TestEnv = {
    get outerHTML() {
      if (this.container) {
        return this.container.innerHTML;
      }

      return '';
    },
  };

  beforeEach(async () => {
    resetRandomKey();

    testEnv.container = document.createElement('div');
    document.body.appendChild(testEnv.container);
    const ref = createRef<HTMLDivElement>();

    const useLexicalEditor = (rootElementRef: RefObject<HTMLDivElement>) => {
      const lexicalEditor = React.useMemo(() => {
        const lexical = createTestEditor(editorConfig);
        return lexical;
      }, []);

      React.useEffect(() => {
        const rootElement = rootElementRef.current;
        lexicalEditor.setRootElement(rootElement);
      }, [rootElementRef, lexicalEditor]);
      return lexicalEditor;
    };

    const Editor = () => {
      testEnv.editor = useLexicalEditor(ref);
      return <div ref={ref} contentEditable={true} />;
    };

    ReactTestUtils.act(() => {
      if (testEnv.container) {
        createRoot(testEnv.container).render(<Editor />);
      }
    });
  });

  afterEach(() => {
    if (testEnv.container) {
      document.body.removeChild(testEnv.container);
    }
    delete testEnv.container;
  });

  if (testEnv.container !== undefined && testEnv.editor !== undefined) {
    runTests(testEnv as Required<TestEnv>);
  }
}

export type SerializedTestElementNode = Spread<
  {
    type: 'test_block';
    version: 1;
  },
  SerializedElementNode
>;

export class TestElementNode extends ElementNode {
  static getType(): string {
    return 'test_block';
  }

  static clone(node: TestElementNode) {
    return new TestElementNode(node.__key);
  }

  static importJSON(
    serializedNode: SerializedTestElementNode,
  ): TestInlineElementNode {
    const node = $createTestInlineElementNode();
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedTestElementNode {
    return {
      ...super.exportJSON(),
      type: 'test_block',
      version: 1,
    };
  }

  createDOM() {
    return document.createElement('div');
  }

  updateDOM() {
    return false;
  }
}

export function $createTestElementNode(): TestElementNode {
  return new TestElementNode();
}

export type SerializedTestInlineElementNode = Spread<
  {
    type: 'test_inline_block';
    version: 1;
  },
  SerializedElementNode
>;

export class TestInlineElementNode extends ElementNode {
  static getType(): string {
    return 'test_inline_block';
  }

  static clone(node: TestInlineElementNode) {
    return new TestInlineElementNode(node.__key);
  }

  static importJSON(
    serializedNode: SerializedTestInlineElementNode,
  ): TestInlineElementNode {
    const node = $createTestInlineElementNode();
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedTestInlineElementNode {
    return {
      ...super.exportJSON(),
      type: 'test_inline_block',
      version: 1,
    };
  }

  createDOM() {
    return document.createElement('div');
  }

  updateDOM() {
    return false;
  }

  isInline() {
    return true;
  }
}

export function $createTestInlineElementNode(): TestInlineElementNode {
  return new TestInlineElementNode();
}

export type SerializedTestSegmentedNode = Spread<
  {
    type: 'test_segmented';
    version: 1;
  },
  SerializedTextNode
>;

export class TestSegmentedNode extends TextNode {
  static getType(): string {
    return 'test_segmented';
  }

  static clone(node: TestSegmentedNode): TestSegmentedNode {
    return new TestSegmentedNode(node.__text, node.__key);
  }

  static importJSON(
    serializedNode: SerializedTestSegmentedNode,
  ): TestSegmentedNode {
    const node = $createTestSegmentedNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedTestSegmentedNode {
    return {
      ...super.exportJSON(),
      type: 'test_segmented',
      version: 1,
    };
  }
}

export function $createTestSegmentedNode(text: string): TestSegmentedNode {
  return new TestSegmentedNode(text).setMode('segmented');
}

export type SerializedTestExcludeFromCopyElementNode = Spread<
  {
    type: 'test_exclude_from_copy_block';
    version: 1;
  },
  SerializedElementNode
>;

export class TestExcludeFromCopyElementNode extends ElementNode {
  static getType(): string {
    return 'test_exclude_from_copy_block';
  }

  static clone(node: TestExcludeFromCopyElementNode) {
    return new TestExcludeFromCopyElementNode(node.__key);
  }

  static importJSON(
    serializedNode: SerializedTestExcludeFromCopyElementNode,
  ): TestExcludeFromCopyElementNode {
    const node = $createTestExcludeFromCopyElementNode();
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedTestExcludeFromCopyElementNode {
    return {
      ...super.exportJSON(),
      type: 'test_exclude_from_copy_block',
      version: 1,
    };
  }

  createDOM() {
    return document.createElement('div');
  }

  updateDOM() {
    return false;
  }

  excludeFromCopy() {
    return true;
  }
}

export function $createTestExcludeFromCopyElementNode(): TestExcludeFromCopyElementNode {
  return new TestExcludeFromCopyElementNode();
}

export type SerializedTestDecoratorNode = Spread<
  {
    type: 'test_decorator';
    version: 1;
  },
  SerializedLexicalNode
>;

export class TestDecoratorNode extends DecoratorNode<JSX.Element> {
  static getType(): string {
    return 'test_decorator';
  }

  static clone(node: TestDecoratorNode) {
    return new TestDecoratorNode(node.__key);
  }

  static importJSON(
    serializedNode: SerializedTestDecoratorNode,
  ): TestDecoratorNode {
    return $createTestDecoratorNode();
  }

  exportJSON(): SerializedTestDecoratorNode {
    return {
      ...super.exportJSON(),
      type: 'test_decorator',
      version: 1,
    };
  }

  getTextContent() {
    return 'Hello world';
  }

  createDOM() {
    return document.createElement('span');
  }

  decorate() {
    return <Decorator text={'Hello world'} />;
  }
}

function Decorator({text}: {text: string}): JSX.Element {
  return <span>{text}</span>;
}

export function $createTestDecoratorNode(): TestDecoratorNode {
  return new TestDecoratorNode();
}

const DEFAULT_NODES = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  TestElementNode,
  TestSegmentedNode,
  TestExcludeFromCopyElementNode,
  TestDecoratorNode,
  TestInlineElementNode,
];

export function TestComposer({
  config = {
    nodes: [],
    theme: {},
  },
  children,
}: {
  config: {
    nodes: ReadonlyArray<Klass<never>>;
    theme: EditorThemeClasses;
  };
  children: JSX.Element | string | (JSX.Element | string)[];
}): JSX.Element {
  const customNodes = config.nodes as ReadonlyArray<never>;
  return (
    <LexicalComposer
      initialConfig={{
        onError: (e) => {
          throw e;
        },
        ...config,
        namespace: '',
        nodes: DEFAULT_NODES.concat(customNodes),
      }}>
      {children}
    </LexicalComposer>
  );
}

export function createTestEditor(
  config: {
    namespace?: string;
    editorState?: EditorState;
    theme?: EditorThemeClasses;
    parentEditor?: LexicalEditor;
    nodes?: ReadonlyArray<typeof DEFAULT_NODES[number]>;
    onError?: (error: Error) => void;
    disableEvents?: boolean;
    readOnly?: boolean;
  } = {},
): LexicalEditor {
  const customNodes = config.nodes || [];
  const editor = createEditor({
    namespace: config.namespace,
    onError: (e) => {
      throw e;
    },
    ...config,
    nodes: DEFAULT_NODES.concat(customNodes),
  });
  return editor;
}
