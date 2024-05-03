export interface CarProps {
  name?: string;
  img?: string;
}

export interface ModalProps {
  open: boolean;
}

export interface ModalMessageProps extends MessageProps {
  onClose: () => void;
}

export interface MessageProps {
  header?: string;
  message?: string;
}

export interface ModalFormProps extends ModalProps {
  onSave: (data?: string) => void;
  onClose: () => void;
}
