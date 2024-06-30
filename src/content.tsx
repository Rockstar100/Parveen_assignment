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
  const [messageBox, setMessageBox] = useState<HTMLElement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleModal = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const checkForClass = () => {
    const msgBox = document.querySelector('.msg-form__contenteditable[contenteditable="true"]') as HTMLElement;
    setMessageBox(msgBox);
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
    if (messageBox) {
      let container = containerRef.current;

      if (!container) {
        container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.bottom = '8px';
        container.style.right = '8px';
        container.style.zIndex = '50';
        container.style.display = 'flex';
        messageBox.style.position = 'relative';
        containerRef.current = container;
        messageBox.appendChild(container);
      }

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
  }, [messageBox, showModal]);

  return (
    <div className="z-50 flex fixed top-32 right-8">
      <CountButton />
      {showModal && <Modal onClose={handleClose} />}
    </div>
  );
};

export default PlasmoOverlay;
