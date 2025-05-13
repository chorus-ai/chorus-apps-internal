import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { styled } from "@mui/material/styles";
import { Badge } from '@mui/material';
import ContextMenu from '../../../../../common/ContextMenu';

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 3,
    top: -15,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 3px",
    backgroundColor: "rgba(26, 188, 156, 0.8)",
    color: "white",
  },
}));

// Utility function to apply highlights to text without tag processing
function applyHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) {
    return [{ text, isTag: false, highlight: false }];
  }

  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
  const parts = [];
  let cursor = 0;

  sortedHighlights.forEach(({ start, end, concept, concept_id, isUserHighlight }) => {
    if (cursor < start) {
      parts.push({
        text: text.slice(cursor, start),
        isTag: false,
        highlight: false,
      });
    }
    parts.push({
      text: text.slice(start, end),
      highlight: true,
      isTag: false,
      conceptId: concept_id,
      concept,
      isUserHighlight: isUserHighlight || false,
    });
    cursor = end;
  });

  if (cursor < text.length) {
    parts.push({
      text: text.slice(cursor),
      isTag: false,
      highlight: false,
    });
  }

  return parts;
}

// HighlightText Component
const HighlightText = ({ text, highlights, selectedConcept, onHighlightClick, values, userHighlight }) => {
  const [userHighlights, setUserHighlights] = useState([]);
  const [parts, setParts] = useState(applyHighlights(text, highlights));
  const textContainerRef = useRef(null);

  useEffect(() => {
    setParts(applyHighlights(text, [...highlights, ...userHighlights]));
  }, [userHighlights, highlights, text, setParts]);

  useEffect(() => {
    if (selectedConcept !== null && selectedConcept !== undefined && textContainerRef.current) {
      const element = textContainerRef.current.querySelector(
        `[data-highlight-id="${selectedConcept}"]`
      );
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedConcept]);  

  const getCharacterOffsetWithin = (element, node, offset) => {
    let total = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(n) {
          if (n.parentNode?.getAttribute && n.parentNode.getAttribute('data-original') === 'true') {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      },
      false
    );
    while (walker.nextNode()) {
      const currentNode = walker.currentNode;
      if (currentNode === node) {
        return total + offset;
      }
      total += currentNode.textContent.length;
    }
    return total;
  };

  const handleMouseUp = () => {
    // Only allow user highlighting if userHighlight prop is true
    if (!userHighlight) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && textContainerRef.current) {
      const range = selection.getRangeAt(0);
      if (range.collapsed) return;

      const startIndex = getCharacterOffsetWithin(
        textContainerRef.current,
        range.startContainer,
        range.startOffset
      );
      const endIndex = getCharacterOffsetWithin(
        textContainerRef.current,
        range.endContainer,
        range.endOffset
      );

      if (startIndex < 0 || endIndex <= startIndex) return;

      setUserHighlights((prev) => [
        ...prev,
        {
          start: startIndex,
          end: endIndex,
          concept: "",
          concept_id: `user-${Date.now()}`,
          isUserHighlight: true,
        },
      ]);

      selection.removeAllRanges();
    }
  };

  return (
    <div
      ref={textContainerRef}
      style={{ fontSize: '1.1rem', lineHeight: '2.2rem', display: 'inline', cursor: 'text' }}
      onMouseUp={handleMouseUp}
    >
      {parts.map((part, index) => {
        if (part.highlight) {
          const baseClass = part.isUserHighlight 
            ? `user-highlight${part?.concept?.length > 0 ? '' : '-without-concept'}`
            : `highlight${part?.concept?.length > 0 ? '' : '-without-concept'}`;
          const selectedClass = part.isUserHighlight 
            ? `user-highlight-selected${part?.concept?.length > 0 ? '' : '-without-concept'}`
            : `highlight-selected${part?.concept?.length > 0 ? '' : '-without-concept'}`;
          const className = selectedConcept === part.conceptId ? selectedClass : baseClass;

          return (
            <span
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => onHighlightClick(part.conceptId)}
            >
              {part.isUserHighlight ? (
                <ContextMenu
                  menuItems={[
                    {
                      label: 'Remove Highlight',
                      action: () =>
                        setUserHighlights((prev) =>
                          prev.filter((h) => h.concept_id !== part.conceptId)
                        ),
                    },
                  ]}
                  containerStyle={{ display: 'inline' }}
                >
                  <span 
                    className={className} 
                    data-original="true"
                    data-highlight-id={part.conceptId}
                  >
                    {part.text}
                  </span>
                </ContextMenu>
              ) : (
                <span 
                  className={className} 
                  data-original="true"
                  data-highlight-id={part.conceptId}
                >
                  {part.text}
                </span>
              )}
              {part?.concept?.length > 0 && (
                <span className={`concept${selectedConcept === part.conceptId ? '-selected' : ''}`}>
                  {part.concept}
                </span>
              )}
              {part.conceptId !== undefined && part.conceptId !== null && values && values[part.conceptId] && (
                <StyledBadge badgeContent="✔" />
              )}
            </span>
          );
        }
        return (
          <span key={index} data-original="true">
            {part.text}
          </span>
        );
      })}
      <style>
        {`
          .highlight,
          .highlight-selected {
            border-bottom: rgb(245, 124, 0) solid 3px;
            padding: 0 2px;
            border-radius: 4px;
          }
          .highlight-without-concept,
          .highlight-selected-without-concept {
            background-color: rgb(245, 124, 0);
            color: white;
            padding: 1px 5px;
            border-radius: 8px;
          }
          .highlight-without-concept {
            background-color: rgb(246, 195, 109);
          }
          .concept,
          .concept-selected {
            background-color: rgb(245, 124, 0);
            color: white;
            font-size: 1rem;
            margin-left: 5px;
            margin-right: 10px;
            padding: 1px 5px;
            border-radius: 8px;
            font-weight: bold;
            position: relative;
            top: -7px;
          }
          .highlight {
            border-bottom: rgb(246, 195, 109) solid 3px;
          }
          .concept {
            background-color: rgb(246, 195, 109);
            color: white;
          }
          /* New styling for user highlights */
          .user-highlight,
          .user-highlight-selected {
            border-bottom: rgb(59, 82, 227) solid 3px;
            padding: 0 2px;
            border-radius: 4px;
          }
          .user-highlight-without-concept,
          .user-highlight-selected-without-concept {
            background-color: rgb(59, 82, 227);
            color: white;
            padding: 1px 5px;
            border-radius: 8px;
          }
          .user-highlight-without-concept {
            background-color: rgb(122, 139, 250);
          }
          .user-highlight-selected {
            border-bottom: rgb(122, 139, 250) solid 3px;
          }
          .user-highlight {
            border-bottom: rgb(122, 139, 250) solid 3px;
          }
        `}
      </style>
    </div>
  );
};

HighlightText.propTypes = {
  text: PropTypes.string.isRequired,
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      concept: PropTypes.string,
      concept_id: PropTypes.any,
    })
  ),
  selectedConcept: PropTypes.any,
  onHighlightClick: PropTypes.func,
  values: PropTypes.object,
  userHighlight: PropTypes.bool, // New prop to control user highlighting
};

HighlightText.defaultProps = {
  highlights: [],
  values: {},
  userHighlight: true, // Default is true so user highlighting is enabled
};

export default HighlightText;
