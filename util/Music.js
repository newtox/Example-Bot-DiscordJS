class ProgressBar {
    value
    maxValue
    barSize
    constructor(value, maxValue, barSize) {
        this.value = value - 1;
        this.maxValue = maxValue;
        this.barSize = barSize;
    }

    create() {
        const percentage = this.value / this.maxValue;
        const progress = Math.round((this.barSize * percentage));
        const emptyProgress = this.barSize - progress;

        const progressText = '-'.repeat(progress);
        const emptyProgressText = '-'.repeat(emptyProgress);
        const bar = '`' + progressText + '🟣' + emptyProgressText + '\n' + new Date(this.value).toISOString().substr(11, 8) + ' / ' + new Date(this.maxValue).toISOString().substr(11, 8) + '`';
        return bar;
    }
}

module.exports = {
    ProgressBar
}