

// model for the solar panel data (currently not using)
export class SolarpaneldataModel {
    
    public date: string;
    public time: string;
    public power: number;
    public voltage: number;
    public current: number;
    
    constructor(date: string, time: string, power: number, voltage: number, current: number) {
        this.date = date;
        this.time = time;
        this.power = power;
        this.voltage = voltage;
        this.current = current;
    }

}
