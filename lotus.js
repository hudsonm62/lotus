class Node {
  constructor(tag, attributes = {}, content = "", children = []) {
    this.tag = tag;
    this.attributes = attributes;
    this.content = content;
    this.children = children;
  }

  addAttribute(name, value) {
    this.attributes[name] = value;
  }

  addChild(node) {
    this.children.push(node);
  }

  setContent(content) {
    this.content = content;
  }

  toHtml() {
    // Using template literals for attribute string construction
    const attributesString = Object.entries(this.attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
    const openingTag = `<${this.tag}${
      attributesString ? ` ${attributesString}` : ""
    }>`;

    if (SELF_CLOSING_TAGS.has(this.tag.toLowerCase())) {
      return openingTag;
    }

    // Concatenates children's HTML in a declarative way
    const childrenHtml = this.children.map((child) => child.toHtml()).join("");
    return `${openingTag}${this.content}${childrenHtml}</${this.tag}>`;
  }
}

const SELF_CLOSING_TAGS = new Set(["img", "br", "hr", "input", "link", "meta"]);

const parseLine = (line, stack) => {
  const indentLevel = line.search(/\S/);
  const content = line.trim();
  let currentParent = stack.at(-1);

  // Adjusts parent based on indentation
  if (indentLevel < currentParent.indent) {
    while (stack.at(-1)?.indent >= indentLevel) {
      stack.pop();
    }
    currentParent = stack.at(-1);
  }

  // Uses destructuring and default for simplicity
  const [tag, value = ""] = content.split(":").map((part) => part.trim());

  if (tag.startsWith("@")) {
    currentParent.node.addAttribute(tag.substring(1), value);
  } else {
    const newNode = new Node(tag, {}, value);
    currentParent.node.addChild(newNode);
    stack.push({ node: newNode, indent: indentLevel });
  }
};

const lotus = (lotus) => {
  // Filters out empty lines more concisely
  const lines = lotus.split("\n").filter((line) => line.trim());
  const root = new Node("html");
  const stack = [{ node: root, indent: -1 }];

  lines.forEach((line) => parseLine(line, stack));

  // Adjusts to remove the <html> tag from the result
  return root.toHtml().substring(6);
};

module.exports = lotus;
