(function(window) {
    var keyMap = {
        8: 0x10,
        13: 0x11,
        45: 0x12,
        46: 0x13,
        38: 0x80,
        40: 0x81,
        37: 0x82,
        39: 0x83,
        16: 0x90,
        17: 0x91,
        128: 0x80,
        129: 0x81,
        130: 0x82,
        131: 0x83,
        16: 0x10, // Backspace
        17: 0x11,  // Return
        // Insert?
        // Delete?
        45: 0x2D
    };

    var shiftKeyMap = {
        49: 0x21, // !
        222: 0x22 // "
    };

    function Keyboard(input) {
        this.id = 0x30cf7406;
        this.version = 1;
        this.manufacturer = 0x8b82cb0c; // Or 0xae387702

        this.buffer = [];
        this.keysDown = [];
        this.keyInterrupts = 0;

        this.input = input;
    }
    
    Keyboard.prototype.onConnect = function(cpu) {
        this.cpu = cpu;
    
        $(document).keydown(function(e) {
            if(e.target === this.input) {
                var key = keyMap[e.which] || e.which;
                this.keysDown[key] = Date.now();
                
                // this.buffer.push(key);
                // this.keyEvent(key);
                // console.log(key + "a");
                if(e.which >= 37 && e.which <= 40 || e.which === 8) e.preventDefault();
            }
        }.bind(this));
        
        $(document).keyup(function(e) {
            if(e.target === this.input) {
                var key = keyMap[e.which] || e.which;
                this.keysDown[key] = 0;
            }
        }.bind(this));
        
        $(document).keypress(function(e) {
            if(e.target === this.input) {
                console.log(e.which + "a");
                var key = keyMap[e.which] || e.which;
                this.buffer.push(key);
                this.keyEvent(key);
                console.log(key + "b");
                // e.preventDefault();
            }
        }.bind(this));
    };
    
    Keyboard.prototype.onInterrupt = function(callback) {
        switch(this.cpu.mem.a) {
            case 0:
                this.buffer = [];
                break;
            
            case 1:
                var k = this.buffer.shift() || 0;
                this.cpu.set('c',  k);
                break;
                
            case 2:
                this.cpu.set('c', Number(this.keysDown[this.cpu.mem.b] !== 0));
                break;
                
            case 3:
                this.keyInterrupts = this.cpu.mem.b;
                break;
        }
        callback();
    };

    Keyboard.prototype.keyEvent = function(key) {
        if(this.keyInterrupts) {
            this.cpu.interrupt(key);
        }
    };

    window.Keyboard = Keyboard;
})(window);
