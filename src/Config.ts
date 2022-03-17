const STATIC_INIT = Symbol(); // gives you a unique identifier

export class Config {
    private static workersEnabled: boolean;

    public static[STATIC_INIT] = () =>  {
        const args = process.argv.slice(2);
        this.workersEnabled = args.includes('--workers');
        console.log(`Application started ${this.workersEnabled ? 'with workers enabled' : `without workers`}`);
    }

    static areWorkersEnabled() {
        return this.workersEnabled;
    }
}

// Call the init once
Config[STATIC_INIT]();