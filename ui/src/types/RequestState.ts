export const enum AsyncStatus {
  IDLE = 'IDLE',
  AWAITING = 'AWAITING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface ResponseStateSuccess<T extends object | undefined> {
  data: T;
  error: undefined;
  awaiting: false;
  success: true;
  failed: false;
  idle: false;
  status: AsyncStatus.SUCCESS;
}
export interface ResponseStateError {
  data: undefined;
  error: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  awaiting: false;
  success: false;
  failed: true;
  idle: false;
  status: AsyncStatus.FAILED;
}
export interface ResponseStateAwaiting {
  data: undefined;
  error: undefined;
  awaiting: true;
  success: false;
  failed: false;
  idle: false;
  status: AsyncStatus.AWAITING;
}
export interface ResponseStateIdle {
  data: undefined;
  error: undefined;
  awaiting: false;
  success: false;
  failed: false;
  idle: true;
  status: AsyncStatus.IDLE;
}

export type ResponseState<T extends object | undefined> =
  | ResponseStateSuccess<T>
  | ResponseStateError
  | ResponseStateAwaiting
  | ResponseStateIdle;

// export interface ResponseState<T extends object|undefined> {
//   status: AsyncStatus;
//   awaiting: boolean;
//   success: boolean;
//   failed: boolean;
//   idle: boolean;
//   data?: T;
//   error?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
// }

export class RequestHelper<T extends object | undefined> {
  public status: AsyncStatus = AsyncStatus.IDLE;
  public data?: T;
  public error?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  public promise?: Promise<T>;

  public constructor(requestState?: ResponseState<T>) {
    if (requestState) {
      this.status = requestState.status;
      this.data = requestState.data;
      this.error = requestState.error;
    }
  }

  public get value(): ResponseState<T> {
    return {
      status: this.status,
      awaiting: this.status === AsyncStatus.AWAITING,
      success: this.status === AsyncStatus.SUCCESS,
      failed: this.status === AsyncStatus.FAILED,
      idle: this.status === AsyncStatus.IDLE,
      data: this.data,
      error: this.error,
    } as ResponseState<T>;
  }

  public async start(promise: Promise<T>): Promise<ResponseState<T>> {
    this.promise = promise;

    this.status = AsyncStatus.AWAITING;

    return this.promise
      .then((val) => {
        this.data = val;
        this.status = AsyncStatus.SUCCESS;
        return this.value;
      })
      .catch((err) => {
        this.error = err;
        this.status = AsyncStatus.FAILED;
        return this.value;
      });
  }

  public static init<T extends object | undefined>(): ResponseState<T> {
    return {
      status: AsyncStatus.IDLE,
      awaiting: false,
      success: false,
      failed: false,
      idle: true,
    } as ResponseState<T>;
  }
}
