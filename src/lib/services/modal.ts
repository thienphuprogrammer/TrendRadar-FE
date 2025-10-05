import { ModalState, DrawerState, FORM_MODE } from '@/types';

/**
 * Generic modal service for managing modal states
 */
export class ModalService {
  private state: ModalState;

  constructor(initialState: Partial<ModalState> = {}) {
    this.state = {
      visible: false,
      loading: false,
      formMode: FORM_MODE.CREATE,
      ...initialState,
    };
  }

  /**
   * Get current modal state
   */
  getState(): ModalState {
    return { ...this.state };
  }

  /**
   * Open modal with optional default value
   */
  openModal(defaultValue?: any): void {
    this.state = {
      ...this.state,
      visible: true,
      defaultValue,
      formMode: defaultValue ? FORM_MODE.EDIT : FORM_MODE.CREATE,
    };
  }

  /**
   * Close modal and reset state
   */
  closeModal(): void {
    this.state = {
      ...this.state,
      visible: false,
      defaultValue: undefined,
      loading: false,
      formMode: FORM_MODE.CREATE,
    };
  }

  /**
   * Update modal state
   */
  updateState(updates: Partial<ModalState>): void {
    this.state = {
      ...this.state,
      ...updates,
    };
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.state = {
      ...this.state,
      loading,
    };
  }

  /**
   * Set form mode
   */
  setFormMode(formMode: FORM_MODE): void {
    this.state = {
      ...this.state,
      formMode,
    };
  }

  /**
   * Set default value
   */
  setDefaultValue(defaultValue: any): void {
    this.state = {
      ...this.state,
      defaultValue,
    };
  }
}

/**
 * Generic drawer service for managing drawer states
 */
export class DrawerService {
  private state: DrawerState;

  constructor(initialState: Partial<DrawerState> = {}) {
    this.state = {
      visible: false,
      loading: false,
      formMode: FORM_MODE.CREATE,
      ...initialState,
    };
  }

  /**
   * Get current drawer state
   */
  getState(): DrawerState {
    return { ...this.state };
  }

  /**
   * Open drawer with optional default value
   */
  openDrawer(defaultValue?: any): void {
    this.state = {
      ...this.state,
      visible: true,
      defaultValue,
      formMode: defaultValue ? FORM_MODE.EDIT : FORM_MODE.CREATE,
    };
  }

  /**
   * Close drawer and reset state
   */
  closeDrawer(): void {
    this.state = {
      ...this.state,
      visible: false,
      defaultValue: undefined,
      loading: false,
      formMode: FORM_MODE.CREATE,
    };
  }

  /**
   * Update drawer state
   */
  updateState(updates: Partial<DrawerState>): void {
    this.state = {
      ...this.state,
      ...updates,
    };
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.state = {
      ...this.state,
      loading,
    };
  }

  /**
   * Set form mode
   */
  setFormMode(formMode: FORM_MODE): void {
    this.state = {
      ...this.state,
      formMode,
    };
  }

  /**
   * Set default value
   */
  setDefaultValue(defaultValue: any): void {
    this.state = {
      ...this.state,
      defaultValue,
    };
  }

  /**
   * Update default value
   */
  updateDefaultValue(defaultValue: any): void {
    this.state = {
      ...this.state,
      defaultValue,
    };
  }
}
