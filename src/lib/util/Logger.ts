import clc from 'cli-color';

export class Logger implements LogInterface {
    public log(message: string, ...data: any[]): void {
        this.emitLogMessage('log', message, data);
    }

    public debug(message: string, ...data: any[]): void {
        this.emitLogMessage('debug', message, data);
    }

    public error(message: string, ...data: any[]): void {
        this.emitLogMessage('error', message, data);
    }

    public info(message: string, ...data: any[]): void {
        this.emitLogMessage('info', message, data);
    }


    private emitLogMessage(Type: 'log' | 'debug' | 'error' | 'info', message: string, data: any[]) {

        let type:string;  
        switch (Type) {
            case 'log':
                type = (clc.green(Type));
            break;
            case 'debug':
                type = (clc.magenta(Type));
            break;
            case 'error':
                type = (clc.red.bold(Type));
            break;
            case 'info':
                type = (clc.blue(Type));
            break;
        }

        if (data.length > 0) {
            console[Type](`[${type}]`, message, data);
        } else {
            console[Type](`[${type}]`, message);
        }
    }

}


export interface LogInterface {
    log(primaryMessage: string, ...Data: any[]): void;
    debug(primaryMessage: string, ...Data: any[]): void;
    error(primaryMessage: string, ...Data: any[]): void;
    info(primaryMessage: string, ...Data: any[]): void;
}