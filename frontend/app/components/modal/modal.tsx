import type { ReactNode } from "react";
import { useEffect } from "react";
import style from "./Modal.module.scss";

interface Props {
  title: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: Props) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onClose]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={style.modal__container} onClick={handleClickOutside}>
      <div className={style.modal__container__modal}>
        <div className={style.modal__header}>
          <h2>{title}</h2>
          <button className={style.modal__close} onClick={onClose}>
            <i className="ri-close-large-fill" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
