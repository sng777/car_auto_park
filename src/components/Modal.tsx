import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ModalFormProps, ModalMessageProps, ModalProps } from "../interfaces";

const Modal = styled.div<ModalProps>`
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #ffff;
  margin: auto;
  padding: 10px 20px;
  width: 500px;
  border-radius: 20px;
  border: 5px solid #0084ff;
`;

const TextMain = styled.p`
  font-size: 30px;
  font-weight: 500;
`;

const TextNormal = styled.p`
  font-size: 20px;
`;

const Button = styled.p`
  padding: 10px 30px;
  border: 1px solid black;
  border-radius: 20px;
  cursor: pointer;
  text-align: center;
  width: 45px;
  font-weight: 500;
  &:hover {
    background: #018cff;
    color: #ffff;
    border: 1px solid #ffff;
  }
  &.close:hover {
    background: #ff0101;
    color: #ffff;
    border: 1px solid #ffff;
  }
`;

const TextBox = styled.input`
  border: 1px solid black;
  border-radius: 50px;
  padding: 10px;
  width: 480px;
  &:focus {
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  column-gap: 10px;
`;

const ModalMessage: React.FC<ModalMessageProps> = ({
  header = "Caution",
  message = "Empty",
  onClose,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <Modal open={open}>
      <ModalContent
        style={{
          border:
            header === "Caution" ? " 5px solid #e9bc0a" : "5px solid #99cc33",
        }}
      >
        <TextMain>
          {header === "Caution" ? `${header} (╥﹏╥)` : `${header} ( • ᴗ - ) ✧`}
        </TextMain>
        <div style={{ marginBottom: 20 }} />
        <TextNormal>{message}</TextNormal>
        <div style={{ marginBottom: 40 }} />
        <ButtonContainer>
          <Button
            onClick={() => {
              onClose && onClose();
              setOpen(false);
            }}
          >
            OK
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export const ModalForm: React.FC<ModalFormProps> = ({
  open = false,
  onSave,
  onClose,
}) => {
  const [car, setCar] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      setCar(undefined);
      inputRef.current.focus();
      inputRef.current.value = ""; // Clear the input value using the ref
    }
  }, [open]); // Run this effect when the `open` prop changes

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      // Handle Enter key press here
      onSave && onSave(e.currentTarget.value);
      setCar(undefined);
    }
  };

  return (
    <Modal open={open}>
      <ModalContent>
        <TextMain>{`Welcome (,,>ヮ<,,)!`}</TextMain>
        <p style={{ fontWeight: 500 }}>Plate Number</p>
        <TextBox
          type="text"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={(e) => setCar(e.target.value)}
        />

        <ButtonContainer>
          <Button
            onClick={() => {
              onSave && onSave(car);
              setCar(undefined);
            }}
          >
            Save
          </Button>
          <Button
            className="close"
            onClick={() => {
              onClose && onClose();
              setCar(undefined);
            }}
          >
            Close
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default ModalMessage;
