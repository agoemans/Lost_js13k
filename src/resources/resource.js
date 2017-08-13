function Resource(maxValue, startValue) {
    this.currentValue = startValue

    this.maxValue = maxValue
};

ctor(Resource);

Resource.prototype.add = function(amount) {
    this.currentValue += amount

    this.currentValue = Math.min(this.currentValue, this.maxValue)
}

Resource.prototype.canUse = function(amount) {
    return amount <= this.currentValue
}

Resource.prototype.use = function(amount) {
    if(this.canUse()) {
        this.currentValue -= amount
    }
    
}