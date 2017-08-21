function Resource(maxValue, startValue) {
    this.currentValue = startValue

    this.maxValue = maxValue
};

ctor(Resource);

Resource.prototype.canAdd = function(amount) {

    return (this.currentValue + amount <= this.maxValue)
}

Resource.prototype.add = function(amount) {
    this.currentValue += amount;

    this.currentValue = Math.min(this.currentValue, this.maxValue);
}

Resource.prototype.subtract = function(amount) {
    this.currentValue -= amount;

    this.currentValue = Math.max(this.currentValue, 0);
}

Resource.prototype.canUse = function(amount) {
    return amount <= this.currentValue
}

Resource.prototype.use = function(amount) {
    if(this.canUse()) {
        this.currentValue -= amount
    }

}
