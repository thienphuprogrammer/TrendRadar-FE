import { useState } from 'react';

export enum FORM_MODE {
  CREATE = 'CREATE',
  EDIT = 'EDIT'
}

export interface ModalAction<TData = any, SData = any> {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (values: SData) => Promise<void>;
  formMode?: FORM_MODE;
  defaultValue?: TData;
  payload?: Record<string, any>;
}

export default function useModalAction() {
  const [visible, setVisible] = useState(false);
  const [formMode, setFormMode] = useState(FORM_MODE.CREATE);
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
  const [defaultValue, setDefaultValue] = useState<any>(null);

  const openModal = (value?: any, payload?: any) => {
    if (payload) setPayload(payload);
    if (value) {
      setDefaultValue(value);
      setFormMode(FORM_MODE.EDIT);
    } else {
      setFormMode(FORM_MODE.CREATE);
    }
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setPayload(null);
    setDefaultValue(null);
    setFormMode(FORM_MODE.CREATE);
  };

  return {
    state: {
      visible,
      formMode,
      defaultValue,
      payload,
    },
    openModal,
    closeModal,
  };
}
