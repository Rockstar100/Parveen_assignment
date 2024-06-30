import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import { AiButton } from "~features/AiButton";
import React, { useEffect, useState, useRef } from 'react';
import { CountButton } from "~features/CountButton";
import ReactDOM from 'react-dom';
import { Modal } from "~features/Modal";

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

const PlasmoOverlay = () => {
  const [messageBoxes, setMessageBoxes] = useState<HTMLElement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const containersRef = useRef<Map<HTMLElement, HTMLDivElement>>(new Map());

  const handleModal = () => {
    setShowModal(true);
  };

  const handleInsert = () => {
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const checkForClass = () => {
    const msgBoxes = Array.from(document.querySelectorAll('.msg-form__contenteditable[contenteditable="true"]')) as HTMLElement[];
    setMessageBoxes(msgBoxes);
  };

  useEffect(() => {
    checkForClass();
    const observer = new MutationObserver(() => {
      checkForClass();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    messageBoxes.forEach(messageBox => {
      if (!containersRef.current.has(messageBox)) {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.bottom = '8px';
        container.style.right = '8px';
        container.style.zIndex = '50';
        container.style.display = 'flex';
        messageBox.style.position = 'relative';
        containersRef.current.set(messageBox, container);
        messageBox.appendChild(container);

        const renderAIButton = () => {
          ReactDOM.render(<AiButton onClick={handleModal} isModalOpen={showModal} />, container);
        };

        renderAIButton();

        const mutationObserver = new MutationObserver(() => {
          if (!messageBox.contains(container)) {
            messageBox.appendChild(container);
            renderAIButton();
          }
        });

        mutationObserver.observe(messageBox, { childList: true, subtree: true });

        return () => {
          if (container && container.parentNode === messageBox) {
            messageBox.removeChild(container);
          }
          mutationObserver.disconnect();
        };
      }
    });
  }, [messageBoxes, showModal]);

  return (
    <div className="z-50 flex fixed top-32 right-8">
      {/* <CountButton /> */}
      {showModal && <Modal onClose={handleClose} onInsert={handleInsert} />}
    </div>
  );
};

export default PlasmoOverlay;
