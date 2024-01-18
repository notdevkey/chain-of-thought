export function extractTitleFromHTML(htmlString: string): string {
    try {
      const doc = document.createDocumentFragment();
      const tempElement = document.createElement('div');
      tempElement.innerHTML = htmlString;
  
      doc.appendChild(tempElement);
  
      const findTextContent = (node: Node): string  => {
        const childNodes = Array.from(node.childNodes);
  
        if (childNodes.length === 0) {
          return node.textContent?.trim() || '';
        }
  
        // Recursively traverse child nodes
        for (const childNode of childNodes) {
          if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType === Node.TEXT_NODE) {
            const content = findTextContent(childNode as Node);
            if (content) {
              return content;
            }
          }
        }
  
        return '';
      };
  
      return findTextContent(doc);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return '';
    }
  }
  
